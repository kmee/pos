# Copyright 2022 KMEE
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

{
    "name": "POS Ask VAT",
    "summary": "Point of Sale: Ask Customer Code or Tax ID",
    "version": "18.0.1.0.0",
    "development_status": "Beta",
    "category": "Point Of Sale",
    "website": "https://github.com/OCA/pos",
    "author": "KMEE, Odoo Community Association (OCA)",
    "maintainers": ["mileo", "ygcarvalh"],
    "license": "LGPL-3",
    "application": False,
    "installable": True,
    "depends": [
        "point_of_sale",
    ],
    "data": [
        "views/pos_order_views.xml",
        "views/pos_config_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_ask_vat/static/src/js/**/*.js",
            "pos_ask_vat/static/src/xml/**/*.xml",
        ],
    },
}
