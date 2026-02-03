/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).
 */

import {Component, useState} from "@odoo/owl";
import {Dialog} from "@web/core/dialog/dialog";
import {_t} from "@web/core/l10n/translation";

export class TaxIdPopup extends Component {
    static template = "pos_ask_vat.TaxIdPopup";
    static components = {Dialog};
    static props = {
        title: {type: String, optional: true},
        startingValue: {type: String, optional: true},
        close: Function,
        getPayload: {type: Function, optional: true},
    };
    static defaultProps = {
        title: _t("Customer Tax ID"),
        startingValue: "",
    };

    setup() {
        this.state = useState({
            inputValue: this.props.startingValue || "",
        });
    }

    get inputBuffer() {
        return this.state.inputValue;
    }

    sendInput(key) {
        if (key === "Delete") {
            this.state.inputValue = "";
        } else if (key === "Backspace") {
            this.state.inputValue = this.state.inputValue.slice(0, -1);
        } else {
            this.state.inputValue += key;
        }
    }

    confirm() {
        if (this.state.inputValue) {
            this.props.close({confirmed: true, payload: this.state.inputValue});
        }
    }

    cancel() {
        this.props.close({confirmed: false, payload: null});
    }
}
