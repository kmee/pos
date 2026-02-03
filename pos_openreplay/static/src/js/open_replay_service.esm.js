/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).
 */

import {PosStore} from "@point_of_sale/app/store/pos_store";
import {patch} from "@web/core/utils/patch";

class OpenReplayManager {
    constructor(config) {
        this.config = config;
        this.initialized = false;
    }

    init() {
        if (this.initialized) {
            return;
        }

        const initOpts = {
            projectKey: this.config.open_replay_project_key,
            ingestPoint: this.config.open_replay_ingest_point,
            defaultInputMode: parseInt(this.config.open_replay_default_input_mode || "0"),
            obscureTextNumbers: this.config.open_replay_obscure_text_numbers,
            obscureTextEmails: this.config.open_replay_obscure_text_emails,
        };

        const startOpts = {
            userID: this.config.name,
            metadata: {
                cashier: "",
                session: "",
                cashier_id: "",
            },
        };

        // Load OpenReplay script dynamically
        ((A, s, a, y, e, r) => {
            r = window.OpenReplay = [e, r, y, [s - 1, e]];
            s = document.createElement("script");
            s.src = A;
            s.async = !a;
            document.getElementsByTagName("head")[0].appendChild(s);
            r.start = function () {
                r.push([0]);
            };
            r.stop = function () {
                r.push([1]);
            };
            r.setUserID = function (id) {
                r.push([2, id]);
            };
            r.setUserAnonymousID = function (id) {
                r.push([3, id]);
            };
            r.setMetadata = function (k, v) {
                r.push([4, k, v]);
            };
            r.event = function (k, p, i) {
                r.push([5, k, p, i]);
            };
            r.issue = function (k, p) {
                r.push([6, k, p]);
            };
            r.isActive = function () {
                return false;
            };
            r.getSessionToken = function () {
                return initOpts.uuid;
            };
        })(
            "//static.openreplay.com/latest/openreplay.js",
            1,
            0,
            initOpts,
            startOpts
        );

        this.initialized = true;
    }

    updateCashierMetadata(cashier, session) {
        if (window.OpenReplay && this.initialized) {
            window.OpenReplay.setMetadata("cashier", cashier.name || "");
            window.OpenReplay.setMetadata("session", session?.name || "");
            window.OpenReplay.setMetadata("cashier_id", String(cashier.id || ""));
        }
    }
}

patch(PosStore.prototype, {
    async setup() {
        await super.setup(...arguments);
        this._initOpenReplay();
    },

    _initOpenReplay() {
        if (this.config.open_replay_active) {
            this.openReplayManager = new OpenReplayManager(this.config);
            this.openReplayManager.init();
        }
    },

    set_cashier(employee) {
        const result = super.set_cashier(...arguments);
        if (this.openReplayManager && employee) {
            this.openReplayManager.updateCashierMetadata(employee, this.session);
        }
        return result;
    },
});
