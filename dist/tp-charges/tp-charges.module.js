"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TpChargesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tp_charges_service_1 = require("./tp-charges.service");
const tp_charges_controller_1 = require("./tp-charges.controller");
const tp_charge_entity_1 = require("./tp-charge.entity");
let TpChargesModule = class TpChargesModule {
};
exports.TpChargesModule = TpChargesModule;
exports.TpChargesModule = TpChargesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tp_charge_entity_1.TpCharge])],
        controllers: [tp_charges_controller_1.TpChargesController],
        providers: [tp_charges_service_1.TpChargesService],
        exports: [tp_charges_service_1.TpChargesService],
    })
], TpChargesModule);
//# sourceMappingURL=tp-charges.module.js.map