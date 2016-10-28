/* -*- coding: utf-8 -*-
* © 2016 KMEE INFORMATICA LTDA (https://kmee.com.br) - Luiz Felipe do Divino
* License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
*/

function pos_cashier_change_widgets(instance, module) {
    var QWeb = instance.web.qweb;
    var _t = instance.web._t;

    module.PosWidget = module.PosWidget.extend({
        build_widgets: function(){
            this._super();
            var self = this;
            this.product_popup = new module.CashierPopupWidget(this, {});
            this.product_popup.appendTo(this.$el);
            this.product_popup.hide();
            this.screen_selector.popup_set['pos_select_cashier'] = this.product_popup;
            this.password_popup = new module.PasswordPopupWidget(this, {});
            this.password_popup.appendTo(this.$el);
            this.password_popup.hide();
            this.screen_selector.popup_set['pos_password_popup'] = this.password_popup;
        },
    });

}