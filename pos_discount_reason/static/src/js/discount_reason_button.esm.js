/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).
 */

import {Component} from "@odoo/owl";
import {ProductScreen} from "@point_of_sale/app/screens/product_screen/product_screen";
import {usePos} from "@point_of_sale/app/store/pos_hook";
import {useService} from "@web/core/utils/hooks";
import {_t} from "@web/core/l10n/translation";

export class DiscountReasonButton extends Component {
    static template = "pos_discount_reason.DiscountReasonButton";

    setup() {
        this.pos = usePos();
        this.dialog = useService("dialog");
    }

    async onClick() {
        const discountOptions = this.pos.getDiscountOptions();
        if (!discountOptions.length) {
            return;
        }
        const {confirmed, payload} = await this.pos.showPopup("SelectionPopup", {
            title: _t("Discount Reason"),
            list: discountOptions,
        });
        if (confirmed) {
            this.applyDiscount(payload);
        }
    }

    applyDiscount(discount) {
        const order = this.pos.get_order();
        if (order) {
            order.setDiscountReason(discount);
        }
    }
}

ProductScreen.addControlButton({
    component: DiscountReasonButton,
    condition: function () {
        return true;
    },
});
