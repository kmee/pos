/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
 */

import {PosStore} from "@point_of_sale/app/store/pos_store";
import {patch} from "@web/core/utils/patch";

patch(PosStore.prototype, {
    getFavoriteCategories() {
        const categories = this.models["pos.category"].getAll();
        return categories.filter((cat) => cat.favorite === "1");
    },

    getNonFavoriteCategories() {
        const categories = this.models["pos.category"].getAll();
        return categories.filter(
            (cat) => cat.favorite !== "1" || !cat.only_favorite_bar
        );
    },
});
