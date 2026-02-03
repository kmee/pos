/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).
 */

import {PosOrder} from "@point_of_sale/app/models/pos_order";
import {patch} from "@web/core/utils/patch";
import {_t} from "@web/core/l10n/translation";

patch(PosOrder.prototype, {
    setup() {
        super.setup(...arguments);
        this.customer_tax_id = this.customer_tax_id || null;
    },

    init_from_JSON(json) {
        super.init_from_JSON(...arguments);
        this.customer_tax_id = json.customer_tax_id || null;
        if (json.partner_id) {
            const partner = this.pos.models["res.partner"].get(json.partner_id);
            if (partner) {
                this.customer_tax_id = partner.vat;
            }
        }
    },

    export_as_JSON() {
        const json = super.export_as_JSON(...arguments);
        json.customer_tax_id = this.customer_tax_id;
        return json;
    },

    export_for_printing() {
        const result = super.export_for_printing(...arguments);
        result.customer_tax_id = this.customer_tax_id;
        return result;
    },

    set_partner(partner) {
        super.set_partner(...arguments);
        if (partner) {
            this.customer_tax_id = partner.vat || this.customer_tax_id;
        }
    },

    /**
     * Ask customer for Tax ID data
     * @param {Object} component - The component to show popup
     * @param {string} screen - The screen context ("payment")
     */
    async askCustomerData(component, screen) {
        const partner = this.get_partner();
        const posConfig = this.pos.config;

        if (!partner && posConfig.pos_ask_vat_question === screen) {
            const {confirmed, payload} = await component.popup.add(
                (await import("./Popups/TaxIdPopup.esm")).TaxIdPopup,
                {
                    title: _t("Customer Tax ID"),
                    startingValue: "",
                }
            );

            if (confirmed && payload) {
                const partnerIds = this.pos.getPartnersByTaxId(payload);
                let foundPartner = null;

                if (partnerIds.length > 0) {
                    foundPartner = this.pos.models["res.partner"].get(partnerIds[0]);
                } else {
                    foundPartner = this.pos.getPartnerByBarcode(payload);
                }

                if (!foundPartner && posConfig.pos_ask_vat_auto_create_partner) {
                    try {
                        const partnerId = await this.pos.data.call(
                            "res.partner",
                            "create",
                            [{name: payload, vat: payload}]
                        );
                        await this.pos.data.read("res.partner", [partnerId]);
                        foundPartner = this.pos.models["res.partner"].get(partnerId);
                    } catch (error) {
                        console.error(
                            "Error creating partner. Cannot complete operation offline:",
                            error
                        );
                        return false;
                    }
                }

                if (foundPartner && partner !== foundPartner) {
                    this.set_partner(foundPartner);
                } else if (!foundPartner) {
                    this.customer_tax_id = payload;
                }
            }
        }
    },
});
