/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).
 */

import {Order, Orderline} from "@point_of_sale/app/store/models";
import {patch} from "@web/core/utils/patch";

patch(Order.prototype, {
    setDiscountReason(reason) {
        const lines = this.get_orderlines();
        for (const line of lines) {
            line.setDiscountReason(reason);
        }
        this.deselectOrderline();
    },
});

patch(Orderline.prototype, {
    setup(options) {
        super.setup(...arguments);
        this.discount_reason_id = this.discount_reason_id || null;
    },

    export_as_JSON() {
        const json = super.export_as_JSON(...arguments);
        json.discount_reason_id = this.discount_reason_id;
        return json;
    },

    init_from_JSON(json) {
        super.init_from_JSON(...arguments);
        this.discount_reason_id = json.discount_reason_id;
    },

    setDiscountReason(reason) {
        if (reason.percent) {
            this.discount_reason_id = reason.id;
        } else {
            this.discount_reason_id = null;
        }
        this.set_discount(reason.percent * 100);
    },

    clone() {
        const orderline = super.clone(...arguments);
        orderline.discount_reason_id = this.discount_reason_id;
        return orderline;
    },
});
