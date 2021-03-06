/*
    POS Customer display module for Odoo
    Copyright (C) 2014 Aurélien DUMAINE
    Copyright (C) 2014 Barroux Abbey (www.barroux.org)
    @author: Aurélien DUMAINE
    @author: Alexis de Lattre <alexis.delattre@akretion.com>
    @author: Father Odilon (Barroux Abbey)
    The licence is in the file __openerp__.py
*/

odoo.define('pos_customer_display', function(require) {
    "use strict";
    var chrome = require('point_of_sale.chrome');
    var core = require('web.core');
    var devices = require('point_of_sale.devices');
    var gui = require('point_of_sale.gui');
    var models = require('point_of_sale.models');
    var screens = require('point_of_sale.screens');
    var _t = core._t;
    var PosModelSuper = models.PosModel;

    models.PosModel = models.PosModel.extend({
        prepare_text_customer_display: function(type, data){
            if (this.config.iface_customer_display != true)
                return;
            var line_length = this.config.customer_display_line_length || 20;
            var currency_rounding = Math.ceil(Math.log(1.0 / this.currency.rounding) / Math.log(10));

            if (type == 'add_product'){
                // in order to not recompute qty in options..., we assume that the new ordeLine is the last of the collection
                // addOrderline exists but is not called by add_product, should we handle it ?
                var line = this.get('selectedOrder').get_last_orderline(); 
                var price_unit = line.get_unit_price() * (1.0 - (line.get_discount() / 100.0));
                price_unit = price_unit.toFixed(currency_rounding);
                var l21 = line.get_quantity_str_with_unit() + ' x ' + price_unit;
                var l22 = ' ' + line.get_display_price().toFixed(currency_rounding);
                var lines_to_send = new Array(
                    this.proxy.align_left(line.get_product().display_name, line_length),
                    this.proxy.align_left(l21, line_length - l22.length) + l22
                    );

            } else if (type == 'remove_orderline') {
                // first click on the backspace button set the amount to 0 => we can't precise the deleted qunatity and price
                var line = data['line'];
                var lines_to_send = new Array(
                    this.proxy.align_left(_t("Delete Item"), line_length),
                    this.proxy.align_right(line.get_product().display_name, line_length)
                    );

            } else if (type == 'add_paymentline') {
                var total = this.get('selectedOrder').get_total_with_tax().toFixed(currency_rounding);
                var lines_to_send = new Array(
                    this.proxy.align_left(_t("TOTAL: "), line_length),
                    this.proxy.align_right(total, line_length)
                    );

            } else if (type == 'remove_paymentline') {
                var line = data['line'];
                var amount = line.get_amount().toFixed(currency_rounding);
                var lines_to_send = new Array(
                    this.proxy.align_left(_t("Cancel Payment"), line_length),
                    this.proxy.align_right(line.cashregister.journal_id[1] , line_length - 1 - amount.length) + ' ' + amount
                    );

            } else if (type == 'update_payment') {
                var change = data['change'];
                var lines_to_send = new Array(
                    this.proxy.align_left(_t("Your Change:"), line_length),
                    this.proxy.align_right(change, line_length)
                );

            } else if (type == 'push_order') {
                var lines_to_send = new Array(
                    this.proxy.align_center(this.config.customer_display_msg_next_l1, line_length),
                    this.proxy.align_center(this.config.customer_display_msg_next_l2, line_length)
                    );

            } else if (type == 'openPOS') {
                var lines_to_send = new Array(
                    this.proxy.align_center(this.config.customer_display_msg_next_l1, line_length),
                    this.proxy.align_center(this.config.customer_display_msg_next_l2, line_length)
                    );

            } else if (type = 'closePOS') {
                var lines_to_send = new Array(
                    this.proxy.align_center(this.config.customer_display_msg_closed_l1, line_length),
                    this.proxy.align_center(this.config.customer_display_msg_closed_l2, line_length)
                    );
            } else {
                console.warn('Unknown message type');
                return;
            }

            this.proxy.send_text_customer_display(lines_to_send, line_length);
            //console.log('prepare_text_customer_display type=' + type + ' | l1=' + lines_to_send[0] + ' | l2=' + lines_to_send[1]);
        },

        push_order: function(order){
            var res = PosModelSuper.prototype.push_order.call(this, order);
            if (order) {
                this.prepare_text_customer_display('push_order', {'order' : order});
            }
            return res;
        },

    });

    devices.ProxyDevice = devices.ProxyDevice.extend({
        send_text_customer_display: function(data, line_length){
            //FIXME : this function is call twice. The first time, it is not called by prepare_text_customer_display : WHY ?
            if (_.isEmpty(data) || data.length != 2 || data[0].length != line_length || data[1].length != line_length){
                console.warn("send_text_customer_display: Bad Data argument. Data=" + data + ' line_length=' + line_length);
            } else {
//              alert(JSON.stringify(data));
                return this.message('send_text_customer_display', {'text_to_display' : JSON.stringify(data)});
            }
        },

        align_left: function(string, length){
            if (string) {
                if (string.length > length)
                {
                    string = string.substring(0,length);
                }
                else if (string.length < length)
                {
                    while(string.length < length)
                        string = string + ' ';
                }
            }
            else {
                string = ' '
                while(string.length < length)
                    string = ' ' + string;
            }
            return string;
        },

        align_right: function(string, length){
            if (string) {
                if (string.length > length)
                {
                    string = string.substring(0,length);
                }
                else if (string.length < length)
                {
                    while(string.length < length)
                        string = ' ' + string;
                }
            }
            else {
                string = ' '
                while(string.length < length)
                    string = ' ' + string;
            }
            return string;
        },

        align_center: function(string, length){
            if (string) {
                if (string.length > length)
                {
                    string = string.substring(0, length);
                }
                else if (string.length < length)
                {
                    var ini = (length - string.length) / 2;
                    while(string.length < length - ini)
                        string = ' ' + string;
                    while(string.length < length)
                        string = string + ' ';
                }
            }
            else {
                string = ' '
                while(string.length < length)
                    string = ' ' + string;
            }
            return string;
        },
    });

    var OrderSuper = models.Order;

    models.Order = models.Order.extend({
        add_product: function(product, options){
            var res = OrderSuper.prototype.add_product.call(this, product, options);
            if (product) {
                this.pos.prepare_text_customer_display('add_product', {'product' : product, 'options' : options});
            }
            return res;
        },

        remove_orderline: function(line){
            if (line) {
                this.pos.prepare_text_customer_display('remove_orderline', {'line' : line});
            }
            return OrderSuper.prototype.remove_orderline.call(this, line);
        },

        remove_paymentline: function(line){
            if (line) {
                this.pos.prepare_text_customer_display('remove_paymentline', {'line' : line});
            }
            return OrderSuper.prototype.remove_paymentline.call(this, line);
        },

        add_paymentline: function(cashregister){
            var res = OrderSuper.prototype.add_paymentline.call(this, cashregister);
            if (cashregister) {
                this.pos.prepare_text_customer_display('add_paymentline', {'cashregister' : cashregister});
            }
            return res;
        },

    });

    screens.PaymentScreenWidget.include({
        render_paymentlines: function(){
            var res = this._super();
            var currentOrder = this.pos.get_order();
            var paidTotal = currentOrder.get_total_paid();
            var dueTotal = currentOrder.get_total_with_tax();
            var change = paidTotal > dueTotal ? paidTotal - dueTotal : 0;
            if (change) {
                var change_rounded = change.toFixed(2);
                this.pos.prepare_text_customer_display('update_payment', {'change': change_rounded});
            }
            return res;
        },
    });

    gui.Gui.include({
        close: function(){
            this._super();
            this.pos.prepare_text_customer_display('closePOS', {});
        },
    });

    chrome.ProxyStatusWidget.include({
        start: function(){
            this._super();
            this.pos.prepare_text_customer_display('openPOS', {});
        },
    });

    /* Handle Button "Display Total to Customer" */
    var _saved_renderElement = screens.OrderWidget.prototype.renderElement;
    screens.OrderWidget.prototype.renderElement = function() {
        _saved_renderElement.apply(this, arguments);
        var self = this;
        if (self.pos.config.iface_customer_display && self.el.querySelector('.show-total-to-customer')) {
            // .show-total-to-customer is empty when we show the bon during payment
            self.el.querySelector('.show-total-to-customer')
                .addEventListener('click', function(){
                    self.pos.prepare_text_customer_display('add_paymentline', {})
                });
        }
    };
});

