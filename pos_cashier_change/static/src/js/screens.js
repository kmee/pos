/* -*- coding: utf-8 -*-
* © 2016 KMEE INFORMATICA LTDA (https://kmee.com.br) - Luiz Felipe do Divino
* License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
*/

function pos_cashier_change_screens(instance, module) {
    var QWeb = instance.web.qweb;
    var _t = instance.web._t;

    module.UsernameWidget = module.UsernameWidget.extend({
        renderElement: function() {
            var self = this;
            this._super();
            this.$el.click(function(options){
                self.pos_widget.screen_selector.show_popup('pos_select_cashier');
            });

        }
    });

    module.CashierWidget = module.PosBaseWidget.extend({
        template: 'CashierWidget',

        init: function(parent, options) {
            this._super(parent,options);
            this.model = options.model;
        },

        renderElement: function() {
            this._super();
            var self = this;
            $("a", this.$el).click(function(e){
                var users=self.pos.users;
                var user=self.pos.cashier || self.pos.user;
                if(e.delegateTarget.id == user.id){
                self.pos_widget.screen_selector.set_current_screen(self.pos_widget.screen_selector.get_current_screen());
                }
                else{
                for(i=0;i<users.length;i++){
                    if(users[i].id==e.delegateTarget.id){
                     if(users[i].pos_security_pass == false){
                        self.pos.cashier =users[i];
                        self.pos_widget.username.refresh();
                        self.pos_widget.screen_selector.set_current_screen(self.pos_widget.screen_selector.get_current_screen());
                     }
                     else{
                            self.pos_widget.screen_selector.show_popup('pos_password_popup',{'password':users[i].pos_security_pass,'user':users[i]});
                        }
                    break;
                    }
                }
            }
            });
            $('#pos_cashier_cance').click(function(){
                self.pos_widget.screen_selector.set_current_screen(self.pos_widget.screen_selector.get_current_screen());
            });
        },
    });

    module.CashierScreenWidget = module.ScreenWidget.extend({
    template:'CashierScreenWidget',
        init: function(parent, options) {
            this._super(parent,options);
        },

        start: function() {
            this._super();
            var self = this;
        },

        renderElement: function() {
            this._super();
            var self = this;
            var users = self.pos.users|| [];
            var pos_users = new module.CashierWidget(this, {
                model: users,
                });
            pos_users.appendTo(this.$('.cashier_list'));
        },
    }),

    module.CashierPopupWidget = module.PopUpWidget.extend({
        template:'CashierPopupWidget',

        start: function(){
            this._super();
            var self = this;
           this.discount_list_widget = new module.CashierScreenWidget(this,{});
        },

        show: function(){
            this._super();
            var self = this;
            this.discount_list_widget.replace($('.placeholder-CashierListScreenWidget'));
        },
    });
    var pos_password=""
    module.PasswordPopupWidget = module.PopUpWidget.extend({
        template:'PasswordPopupWidget',

        show: function(user_password){
            this.user_password = user_password;
            this._super(user_password);
            var self = this;
            var pos_password="";
            $("button", this.$el).click(function(e){
                var number=$(this).html();
                if(Number.isInteger(parseInt(number))){
                    pos_password+=number;
                }
                else if(number == 'C'){
                    pos_password="";
                }
                else{
                    pos_password = pos_password.substring(0, pos_password.length - 1);
                }
                var pass_char=""
                for(i=0;i<pos_password.length;i++){
                    pass_char+="*";
                }
                $(".pos_input_password").html(pass_char);
            });
            this.$('.pos_password_widget_cance').click(function(){
                pos_password="";
                $(".pos_input_password").html("");
                self.pos_widget.screen_selector.set_current_screen(self.pos_widget.screen_selector.get_current_screen());
            });
            this.$('.pos_password_widget_ok').click(function(){
                if(user_password.password == pos_password){
                   self.pos.cashier =user_password.user;
                   self.pos_widget.username.refresh();
                    self.pos_widget.screen_selector.set_current_screen(self.pos_widget.screen_selector.get_current_screen());
                }
                else{
                    self.pos_widget.screen_selector.show_popup('error',{
                                    'message': _t('Invalid password'),
                                    'comment': "Please try again to change the cashier !!!",
                                });
                }
                pos_password="";
                $(".pos_input_password").html("");
            });
        },

    });

}