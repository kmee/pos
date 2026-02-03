# Copyright 2022 KMEE
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

from odoo import fields, models


class PosConfig(models.Model):
    _inherit = "pos.config"

    open_replay_active = fields.Boolean(string="Enable OpenReplay")
    open_replay_ingest_point = fields.Char(string="Server URL")
    open_replay_project_key = fields.Char(string="Project Key")
    open_replay_default_input_mode = fields.Selection(
        [
            ("0", "Record all inputs"),
            ("1", "Ignore all inputs"),
            ("2", "Obscure all inputs"),
        ],
        string="Input Recording Mode",
        default="0",
    )
    open_replay_obscure_text_numbers = fields.Boolean(
        string="Do not record numeric text",
        help="Obscure any numeric text in the session recording",
    )
    open_replay_obscure_text_emails = fields.Boolean(
        string="Do not record email addresses",
        help="Obscure email addresses in the session recording",
    )
