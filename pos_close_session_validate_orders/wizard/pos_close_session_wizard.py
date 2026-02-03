# Copyright 2022 KMEE
# License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).

from odoo import fields, models


class PosCloseSessionWizard(models.TransientModel):
    _name = "pos.close.session.wizard"
    _description = "Close Session Wizard"

    session_id = fields.Many2one(
        comodel_name="pos.session",
        string="Session",
        readonly=True,
    )
    message = fields.Text(string="Information message", readonly=True)

    def action_force_close(self):
        """Force close the session even with pending orders"""
        if self.session_id:
            # Cancel pending orders
            pending_orders = self.session_id.order_ids.filtered(
                lambda o: o.state == "draft"
            )
            pending_orders.write({"state": "cancel"})
            return self.session_id.action_pos_session_closing_control()
        return {"type": "ir.actions.act_window_close"}
