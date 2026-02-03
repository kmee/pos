# Copyright 2022 KMEE
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

{
    "name": "POS Employee Access Right",
    "summary": "Point of Sale: Check access rights at POS features",
    "version": "18.0.1.0.0",
    "author": "KMEE, Odoo Community Association (OCA)",
    "website": "https://github.com/OCA/pos",
    "license": "LGPL-3",
    "category": "Point Of Sale",
    "depends": [
        "pos_hr",
    ],
    "data": [
        "security/ir.model.access.csv",
        "views/pos_component_security_views.xml",
        "views/pos_employee_access_security_views.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_employee_access_right/static/src/js/**/*.js",
        ],
    },
    "installable": True,
}
