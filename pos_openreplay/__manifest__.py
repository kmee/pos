# Copyright 2021 KMEE
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

{
    "name": "POS OpenReplay",
    "summary": "Point of Sale: OpenReplay Integration for session recording",
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
        "pos_hr",
    ],
    "data": [
        "views/pos_config_view.xml",
    ],
    "assets": {
        "point_of_sale._assets_pos": [
            "pos_openreplay/static/src/js/open_replay_service.esm.js",
        ],
    },
}
