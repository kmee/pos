/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
 */

import {Component} from "@odoo/owl";
import {usePos} from "@point_of_sale/app/store/pos_hook";

export class FavoriteCategoriesBar extends Component {
    static template = "pos_favorite_product_categories.FavoriteCategoriesBar";
    static props = {
        categories: {type: Array, optional: true},
    };

    setup() {
        this.pos = usePos();
    }

    selectCategory(category) {
        this.pos.setSelectedCategory(category);
    }

    getCategoryImageUrl(category) {
        return `/web/image?model=pos.category&field=image_128&id=${category.id}&unique=${category.write_date}`;
    }
}
