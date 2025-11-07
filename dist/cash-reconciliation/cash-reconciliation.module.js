"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashReconciliationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cash_reconciliation_entity_1 = require("./cash-reconciliation.entity");
const cash_reconciliation_service_1 = require("./cash-reconciliation.service");
const cash_reconciliation_controller_1 = require("./cash-reconciliation.controller");
const sale_entity_1 = require("../sales/sale.entity");
const stock_movements_module_1 = require("../stock-movements/stock-movements.module");
let CashReconciliationModule = class CashReconciliationModule {
};
exports.CashReconciliationModule = CashReconciliationModule;
exports.CashReconciliationModule = CashReconciliationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([cash_reconciliation_entity_1.CashReconciliation, sale_entity_1.Sale]),
            stock_movements_module_1.StockMovementsModule
        ],
        controllers: [cash_reconciliation_controller_1.CashReconciliationController],
        providers: [cash_reconciliation_service_1.CashReconciliationService],
        exports: [cash_reconciliation_service_1.CashReconciliationService],
    })
], CashReconciliationModule);
//# sourceMappingURL=cash-reconciliation.module.js.map