/* -*- coding: utf-8 -*-
* © 2016 KMEE INFORMATICA LTDA (https://kmee.com.br) - Luiz Felipe do Divino
* License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).
*/

openerp.pos_cashier_change = function (instance) {
    var module = instance.point_of_sale;

    pos_cashier_change_models(instance, module);
    pos_cashier_change_screens(instance, module);
    pos_cashier_change_widgets(instance, module);
};