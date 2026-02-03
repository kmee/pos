# Copyright 2022 KMEE
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

{
    "name": "POS Stock MRP",
    "summary": "Point of Sale: Create procurement after POS sale",
    "version": "18.0.1.0.0",
    "author": "KMEE, Odoo Community Association (OCA)",
    "website": "https://github.com/OCA/pos",
    "license": "LGPL-3",
    "category": "Point Of Sale",
    "maintainers": ["gabrielcardoso21"],
    "depends": [
        "point_of_sale",
        "stock",
        "mrp",
    ],
    "demo": [
        "data/demo_data.xml",
    ],
    "installable": True,
}
