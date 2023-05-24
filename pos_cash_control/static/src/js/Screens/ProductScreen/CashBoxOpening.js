odoo.define("pos_cash_control.CashBoxOpening", function (require) {
    "use strict";

    const Registries = require("point_of_sale.Registries");
    const CashBoxOpening = require("point_of_sale.CashBoxOpening");

    const PosCashControlCashOpeningBox = (CashBoxOpening) =>
        class extends CashBoxOpening {
            async startSession() {
                this.env.pos.pos_session.notes = this.changes.notes;
                super.startSession();
            }
        };

    Registries.Component.extend(CashBoxOpening, PosCashControlCashOpeningBox);

    return CashBoxOpening;
});
