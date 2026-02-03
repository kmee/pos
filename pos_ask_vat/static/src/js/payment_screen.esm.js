/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).
 */

import {PaymentScreen} from "@point_of_sale/app/screens/payment_screen/payment_screen";
import {patch} from "@web/core/utils/patch";

patch(PaymentScreen.prototype, {
    async validateOrder(isForceValidate) {
        const order = this.pos.get_order();
        if (order && typeof order.askCustomerData === "function") {
            await order.askCustomerData(this, "payment");
        }
        return super.validateOrder(...arguments);
    },
});
