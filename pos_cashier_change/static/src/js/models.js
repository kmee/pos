/******************************************************************************
 *
 *    Copyright (C) 2016 KMEE INFORMATICA LTDA (http://www.kmee.com.br)
 *    @author Luiz Felipe do Divino <luiz.divino@kmee.com.br>
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License as
 *    published by the Free Software Foundation, either version 3 of the
 *    License, or (at your option) any later version.
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 ******************************************************************************/

function pos_cashier_change_models(instance, module) {
    var QWeb = instance.web.qweb;
    var _t = instance.web._t;

    var _initialize_ = module.PosModel.prototype.initialize;
    module.PosModel.prototype.initialize = function(session, attributes){
        self = this;
        this.models[this.models.length]={
            model:  'res.users',
            fields: ['name', 'pos_security_pass', 'groups_id','barcode', 'company_id'],
            domain: function(self){ return [['company_id','=',self.user.company_id[0]],'|', ['groups_id','=', self.config.pos_group_manager_id[0]],['groups_id','=', self.config.pos_group_user_id[0]]]; },
            loaded: function(self,users){
                var pos_users = [];
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    for (var j = 0; j < user.groups_id.length; j++) {
                        var group_id = user.groups_id[j];
                        if (group_id === self.config.pos_group_manager_id[0]) {
                            user.role = 'manager';
                            break;
                        } else if (group_id === self.config.pos_group_user_id[0]) {
                            user.role = 'cashier';
                        }
                    }
                    if (user.role){
                        pos_users.push(user);
                    }
                    if (user.id === self.user.id) {
                        self.user = user;
                    }
                }
                self.users = pos_users;
            },
        }
        return _initialize_.call(this, session, attributes);
    };
}