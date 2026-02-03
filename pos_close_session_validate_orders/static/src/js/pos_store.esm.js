/** @odoo-module */
/**
 * Copyright 2023 KMEE
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).
 */

import {PosStore} from "@point_of_sale/app/store/pos_store";
import {AlertDialog} from "@web/core/confirmation_dialog/confirmation_dialog";
import {patch} from "@web/core/utils/patch";
import {_t} from "@web/core/l10n/translation";

patch(PosStore.prototype, {
    /**
     * Check if there are orders in payment state (with payments but not finalized)
     * @returns {boolean} True if there are unpaid orders with payments
     */
    checkOrdersInPaymentState() {
        const orders = this.get_order_list();
        for (const order of orders) {
            // Check if order has payment lines but is not finalized
            const paymentLines = order.payment_ids || order.get_paymentlines?.() || [];
            if (paymentLines.length > 0) {
                // Order has payments but might not be finalized
                if (!order.finalized) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * Override closePos to validate orders in payment state before closing
     */
    async closePos() {
        const hasOrdersInPayment = this.checkOrdersInPaymentState();
        if (hasOrdersInPayment) {
            this.dialog.add(AlertDialog, {
                title: _t("Closing session error"),
                body: _t(
                    "There are orders in payment state! Please finish or cancel these orders before closing the session."
                ),
            });
            return;
        }
        return super.closePos(...arguments);
    },
});
