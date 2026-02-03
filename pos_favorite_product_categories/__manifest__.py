# Copyright 2022 KMEE
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).

{
    "name": "POS Favorite Product Categories",
    "summary": "Pins a bar with favorite POS product categories",
    "version": "18.0.1.0.0",
    "license": "AGPL-3",
    "author": "KMEE, Odoo Community Association (OCA)",
    "website": "https://github.com/OCA/pos",
    "category": "Point Of Sale",
    "depends": [
        "point_of_sale",
    ],
    "data": [
        "views/pos_category_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_favorite_product_categories/static/src/js/**/*.js",
            "pos_favorite_product_categories/static/src/xml/**/*.xml",
            "pos_favorite_product_categories/static/src/css/**/*.css",
        ],
    },
    "installable": True,
}
