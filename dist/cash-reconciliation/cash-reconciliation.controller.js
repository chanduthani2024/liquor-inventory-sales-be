"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashReconciliationController = void 0;
const common_1 = require("@nestjs/common");
const cash_reconciliation_service_1 = require("./cash-reconciliation.service");
const cash_reconciliation_dto_1 = require("./dto/cash-reconciliation.dto");
let CashReconciliationController = class CashReconciliationController {
    constructor(cashReconciliationService) {
        this.cashReconciliationService = cashReconciliationService;
    }
    create(createDto) {
        return this.cashReconciliationService.create(createDto);
    }
    findAll() {
        return this.cashReconciliationService.findAll();
    }
    async getByDate(date) {
        if (!date) {
            date = new Date().toISOString().split('T')[0];
        }
        return this.cashReconciliationService.getOrCreateForDate(date);
    }
    findOne(id) {
        return this.cashReconciliationService.findOne(+id);
    }
    update(id, updateDto) {
        return this.cashReconciliationService.update(+id, updateDto);
    }
    remove(id) {
        return this.cashReconciliationService.delete(+id);
    }
};
exports.CashReconciliationController = CashReconciliationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cash_reconciliation_dto_1.CreateCashReconciliationDto]),
    __metadata("design:returntype", void 0)
], CashReconciliationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CashReconciliationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-date'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CashReconciliationController.prototype, "getByDate", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CashReconciliationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cash_reconciliation_dto_1.UpdateCashReconciliationDto]),
    __metadata("design:returntype", void 0)
], CashReconciliationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CashReconciliationController.prototype, "remove", null);
exports.CashReconciliationController = CashReconciliationController = __decorate([
    (0, common_1.Controller)('cash-reconciliation'),
    __metadata("design:paramtypes", [cash_reconciliation_service_1.CashReconciliationService])
], CashReconciliationController);
//# sourceMappingURL=cash-reconciliation.controller.js.map