# Copyright 2022 KMEE
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

from odoo import _, models
from odoo.exceptions import UserError


class PosSession(models.Model):
    _inherit = "pos.session"

    def action_pos_session_closing_control(self):
        """Check for orders in payment state before closing"""
        for session in self:
            paying_orders = session.order_ids.filtered(
                lambda o: o.state == "draft" and o.amount_total > 0
            )
            if paying_orders:
                raise UserError(
                    _(
                        "There are %s orders in payment state. "
                        "Please complete or cancel them before closing the session."
                    )
                    % len(paying_orders)
                )
        return super().action_pos_session_closing_control()
