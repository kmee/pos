/** @odoo-module */
/**
 * Copyright 2022 KMEE
 * License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl).
 */

import {PosStore} from "@point_of_sale/app/store/pos_store";
import {patch} from "@web/core/utils/patch";

patch(PosStore.prototype, {
    async setup() {
        await super.setup(...arguments);
        this.componentAccessCheck = {};
        this.employeeAccessRights = [];
    },

    async _processData(loadedData) {
        await super._processData(...arguments);
        this._loadAccessRights(loadedData);
    },

    _loadAccessRights(loadedData) {
        const components = loadedData["pos.component.security"] || [];
        const accessRights = loadedData["pos.employee.access.security"] || [];

        this.employeeAccessRights = accessRights;

        for (const access of accessRights) {
            const component = components.find(
                (c) => c.id === access.pos_component_id[0]
            );
            if (component) {
                if (!this.componentAccessCheck[component.name]) {
                    this.componentAccessCheck[component.name] = [];
                }
                if (
                    access.pos_event_type &&
                    !this.componentAccessCheck[component.name].includes(
                        access.pos_event_type
                    )
                ) {
                    this.componentAccessCheck[component.name].push(
                        access.pos_event_type
                    );
                }
            }
        }
    },

    getEmployeeAccess(jobPositionId, componentName, eventType, payload) {
        return this.employeeAccessRights.filter((access) => {
            const component = this.models["pos.component.security"].find(
                (c) => c.id === access.pos_component_id[0]
            );
            if (!component || component.name !== componentName) {
                return false;
            }
            if (access.job_position_id[0] !== jobPositionId) {
                return false;
            }
            if (access.pos_event_type && access.pos_event_type !== eventType) {
                return false;
            }
            return true;
        });
    },
});
