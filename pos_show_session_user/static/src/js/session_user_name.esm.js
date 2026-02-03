/** @odoo-module */
/**
 * Copyright 2022 KMEE (https://www.kmee.com.br).
 * @author Luis Felipe Mileo <mileo@kmee.com.br>
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).
 */

import {Component} from "@odoo/owl";
import {usePos} from "@point_of_sale/app/store/pos_hook";
import {useService} from "@web/core/utils/hooks";

export class SessionUserName extends Component {
    static template = "pos_show_session_user.SessionUserName";

    setup() {
        this.pos = usePos();
        this.user = useService("user");
    }

    get username() {
        return this.user.name || "";
    }
}
