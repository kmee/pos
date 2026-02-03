# Copyright 2022 KMEE
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

{
    "name": "POS Close Session Validate Orders",
    "summary": "Point of Sale: Validate orders in payment state before closing session",
    "version": "18.0.1.0.0",
    "author": "KMEE, Odoo Community Association (OCA)",
    "website": "https://github.com/OCA/pos",
    "license": "LGPL-3",
    "category": "Point Of Sale",
    "depends": [
        "point_of_sale",
    ],
    "data": [
        "security/ir.model.access.csv",
        "wizard/pos_close_session_wizard_views.xml",
    ],
    "installable": True,
}
