# Copyright 2022 KMEE
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

from odoo import fields, models


class PosOrderLine(models.Model):
    _inherit = "pos.order.line"

    discount_reason_id = fields.Many2one(
        comodel_name="pos.discount.reason",
        string="Discount Reason",
        readonly=True,
    )

    def _order_line_fields(self, line, session_id=None):
        result = super()._order_line_fields(line, session_id)
        result[2]["discount_reason_id"] = line[2].get("discount_reason_id", False)
        return result
