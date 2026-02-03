/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
 */

import {ProductScreen} from "@point_of_sale/app/screens/product_screen/product_screen";
import {patch} from "@web/core/utils/patch";
import {FavoriteCategoriesBar} from "@pos_favorite_product_categories/js/favorite_categories_bar.esm";

patch(ProductScreen, {
    components: {
        ...ProductScreen.components,
        FavoriteCategoriesBar,
    },
});

patch(ProductScreen.prototype, {
    get favoriteCategories() {
        const categories = this.pos.models["pos.category"].getAll();
        return categories.filter((category) => category.favorite === "1");
    },

    get subcategories() {
        const result = super.subcategories;
        return result.filter((category) => {
            if (!category.favorite) {
                return true;
            }
            if (category.favorite && category.only_favorite_bar) {
                return false;
            }
            return true;
        });
    },
});
