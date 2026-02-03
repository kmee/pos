# Copyright 2022 KMEE
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

{
    "name": "POS Discount Reason",
    "summary": "Point of Sale: Ask the discount reason before applying it",
    "version": "18.0.1.0.0",
    "author": "KMEE, Odoo Community Association (OCA)",
    "website": "https://github.com/OCA/pos",
    "license": "LGPL-3",
    "category": "Point Of Sale",
    "maintainers": ["mileo"],
    "depends": [
        "point_of_sale",
    ],
    "data": [
        "security/pos_discount_reason.xml",
        "data/pos_discount_reason.xml",
        "views/pos_discount_reason_views.xml",
        "views/pos_order_line_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_discount_reason/static/src/js/**/*.js",
            "pos_discount_reason/static/src/xml/**/*.xml",
        ],
    },
    "installable": True,
}
