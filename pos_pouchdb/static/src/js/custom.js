odoo.define("pos_pouchdb.db", function (require) {
    "use strict";
    var PosDB = require("point_of_sale.DB");
    var models = require('point_of_sale.models');

    PosDB.include({
        init: function (options) {
            this._super.apply(this, arguments);
            this.p_db = {};
            this.pouch_db = new PouchDB('localDB');
        },

        save_unpaid_order: function (order) {
            var self = this;
            try {
                var serialized = order.export_as_JSON();
                // self.pouch_db.info().then(function (info) {
                //     console.log(info);
                // });
                // self.pouch_db.get(serialized._id).then(function(doc) {
                //     serialized._rev = doc._rev
                //     self.pouch_db.put(serialized).then(function(doc){
                //         return serialized.uid;
                //     });
                // }).catch(function (err) {
                //     console.log(err);
                //     self.pouch_db.put(serialized).then(function(doc){
                //         return serialized.uid;
                //     });
                // });
                self.pouch_db.upsert(serialized._id, function () { return serialized; });
            } catch (e) {
                return this._super.apply(this, arguments);
            }
        },
        remove_unpaid_order: function (order) {
            try {
                var serialized = order.export_as_JSON();
                this.pouch_db.get(serialized._id).then(function(doc) {
                  this.pouch_db.remove(doc);
                }).then(function (result) {
                  // handle result
                }).catch(function (err) {
                  this._super.apply(this, arguments);
                });
            } catch (e) {
                this._super.apply(this, arguments);
            }
        },
        remove_all_unpaid_orders: function () {
            this._super.apply(this, arguments);
        },
        get_unpaid_orders: async function () {
            var self = this;
            try {
              var result = await self.pouch_db.allDocs({
                include_docs: true,
                attachments: true
              });
              return result.rows;
            } catch (err) {
              return [];
            }
        },
    });
  const _super_order = models.Order.prototype;

  models.Order = models.Order.extend({
    export_as_JSON: function () {
      const json = _super_order.export_as_JSON.call(this);
      json._id = this.uid;
      return json;
    },
  });

});

