# -*- coding: utf-8 -*-
# © 2016 KMEE INFORMATICA LTDA (https://kmee.com.br) - Luiz Felipe do Divino
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp import api, models, fields


class ResUsers(models.Model):
    _inherit = 'res.users'

    pos_security_pass = fields.Char(
        'Security Password',
        size=32,
        help='A Security Password used to protect Point of Sale'
    )

    @api.multi
    def _pos_check_pin(self):
        for user in self:
            if user.pos_security_pin and not user.pos_security_pin.isdigit():
                return False
        return True

    _constraints = [
        (
            _pos_check_pin,
            "Security PIN can only contain digits",
            ['wk_pos_security_pin']
        ),
    ]


class PosConfig(models.Model):
    _inherit = 'pos.config'

    @api.multi
    def _get_pos_group_manager(self):
        group = self.env['ir.model.data'].get_object_reference(
            'point_of_sale',
            'group_pos_manager'
        )
        result = self.env['res.groups'].search([('id', '=', group[1])])
        if result:
            return result
        else:
            return False

    @api.multi
    def _get_pos_group_user(self):
        group = self.env['ir.model.data'].get_object_reference(
            'point_of_sale',
            'group_pos_user'
        )
        result = self.env['res.groups'].search([('id', '=', group[1])])
        if result:
            return result
        else:
            return False

    pos_group_manager_id = fields.Many2one(
        'res.groups',
        default=_get_pos_group_manager
    )
    pos_group_user_id = fields.Many2one(
        'res.groups',
        default=_get_pos_group_user
    )
