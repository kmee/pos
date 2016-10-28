# -*- coding: utf-8 -*-
# © 2016 KMEE INFORMATICA LTDA (https://kmee.com.br) - Luiz Felipe do Divino
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

{
    "name": "POS Cashier Change",
    "version": "8.0.0.1.0",
    "author": "KMEE",
    "website": "http://www.kmee.com.br",
    "license": "AGPL-3",
    "category": "Point Of Sale",
    "depends": ['point_of_sale'],
    'data': [
        "views/pos_template.xml",
        "views/res_users_view.xml",
    ],
    "qweb": [
        'static/src/xml/*',
    ],
    "installable": True,
}
