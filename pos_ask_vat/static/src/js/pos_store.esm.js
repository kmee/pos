/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).
 */

import {PosStore} from "@point_of_sale/app/store/pos_store";
import {patch} from "@web/core/utils/patch";

/**
 * Remove punctuation from string for VAT comparison
 */
function removePunctuation(string) {
    return string.replace(/[^\w\s]/gi, "");
}

patch(PosStore.prototype, {
    async setup() {
        await super.setup(...arguments);
        this.partnerByTaxId = {};
    },

    /**
     * Build index of partners by tax ID
     */
    _buildPartnerTaxIdIndex() {
        this.partnerByTaxId = {};
        const partners = this.models["res.partner"].getAll();
        for (const partner of partners) {
            if (partner.vat) {
                const taxIdUnmasked = removePunctuation(partner.vat);
                if (!this.partnerByTaxId[taxIdUnmasked]) {
                    this.partnerByTaxId[taxIdUnmasked] = [];
                }
                this.partnerByTaxId[taxIdUnmasked].push(partner.id);
            }
        }
    },

    /**
     * Get partners by tax ID
     * @param {string} taxId - The tax ID to search for
     * @returns {Array} Array of partner IDs
     */
    getPartnersByTaxId(taxId) {
        if (Object.keys(this.partnerByTaxId).length === 0) {
            this._buildPartnerTaxIdIndex();
        }
        const taxIdUnmasked = removePunctuation(taxId);
        return this.partnerByTaxId[taxIdUnmasked] || [];
    },

    /**
     * Get partner by barcode
     * @param {string} barcode - The barcode to search for
     * @returns {Object|null} Partner object or null
     */
    getPartnerByBarcode(barcode) {
        const partners = this.models["res.partner"].getAll();
        return partners.find((p) => p.barcode === barcode) || null;
    },
});
