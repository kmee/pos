/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).
 */

import {PosStore} from "@point_of_sale/app/store/pos_store";
import {patch} from "@web/core/utils/patch";

patch(PosStore.prototype, {
    async setup() {
        await super.setup(...arguments);
        this.discountReasons = {
            orderDiscountReasons: {},
            lineDiscountReasons: {},
            models: {},
            getById(id) {
                return this.models[id];
            },
        };
    },

    async _processData(loadedData) {
        await super._processData(...arguments);
        this._loadDiscountReasons(loadedData["pos.discount.reason"] || []);
    },

    _loadDiscountReasons(discountReasons) {
        for (const discount of discountReasons) {
            this.discountReasons.models[discount.id] = discount;
            if (discount.discount_use === "line" || discount.discount_use === "both") {
                this.discountReasons.lineDiscountReasons[discount.id] = discount;
            }
            if (discount.discount_use === "order" || discount.discount_use === "both") {
                this.discountReasons.orderDiscountReasons[discount.id] = discount;
            }
        }
    },

    getDiscountOptions() {
        const discountOptions = [];
        for (const item in this.discountReasons.orderDiscountReasons) {
            const reason = this.discountReasons.getById(item);
            const reasonValue = " - " + reason.percent * 100 + "%";
            discountOptions.push({
                label: reason.name + reasonValue,
                item: reason,
                id: reason.id,
            });
        }
        return discountOptions;
    },
});
