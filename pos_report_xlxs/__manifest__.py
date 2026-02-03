# Copyright 2022 KMEE
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

{
    "name": "POS Report XLSX",
    "summary": "Point of Sale: Reports in XLSX format",
    "version": "18.0.1.0.0",
    "author": "KMEE, Odoo Community Association (OCA)",
    "website": "https://github.com/OCA/pos",
    "license": "LGPL-3",
    "category": "Point Of Sale",
    "depends": [
        "point_of_sale",
        "pos_hr",
    ],
    "data": [
        "security/ir.model.access.csv",
        "wizards/pos_items_sales_report_views.xml",
        "wizards/pos_payment_receivings_report_views.xml",
    ],
    "external_dependencies": {
        "python": ["xlwt"],
    },
    "installable": True,
}
