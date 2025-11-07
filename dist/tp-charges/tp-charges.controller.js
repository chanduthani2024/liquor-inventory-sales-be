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
exports.TpChargesController = void 0;
const common_1 = require("@nestjs/common");
const tp_charges_service_1 = require("./tp-charges.service");
const create_tp_charge_dto_1 = require("./dto/create-tp-charge.dto");
const update_tp_charge_dto_1 = require("./dto/update-tp-charge.dto");
let TpChargesController = class TpChargesController {
    constructor(tpChargesService) {
        this.tpChargesService = tpChargesService;
    }
    create(createTpChargeDto) {
        return this.tpChargesService.create(createTpChargeDto);
    }
    findAll() {
        return this.tpChargesService.findAll();
    }
    findByDate(date) {
        return this.tpChargesService.findByDate(date);
    }
    findByDateRange(startDate, endDate) {
        return this.tpChargesService.findByDateRange(startDate, endDate);
    }
    getTotalForMonth(year, month) {
        return this.tpChargesService.getTotalForMonth(parseInt(year), parseInt(month));
    }
    getTotalForDateRange(startDate, endDate) {
        return this.tpChargesService.getTotalForDateRange(startDate, endDate);
    }
    findOne(id) {
        return this.tpChargesService.findOne(+id);
    }
    update(id, updateTpChargeDto) {
        return this.tpChargesService.update(+id, updateTpChargeDto);
    }
    remove(id) {
        return this.tpChargesService.remove(+id);
    }
};
exports.TpChargesController = TpChargesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tp_charge_dto_1.CreateTpChargeDto]),
    __metadata("design:returntype", void 0)
], TpChargesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TpChargesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-date'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TpChargesController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)('by-date-range'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TpChargesController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)('total/month'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TpChargesController.prototype, "getTotalForMonth", null);
__decorate([
    (0, common_1.Get)('total/date-range'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TpChargesController.prototype, "getTotalForDateRange", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TpChargesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tp_charge_dto_1.UpdateTpChargeDto]),
    __metadata("design:returntype", void 0)
], TpChargesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TpChargesController.prototype, "remove", null);
exports.TpChargesController = TpChargesController = __decorate([
    (0, common_1.Controller)('tp-charges'),
    __metadata("design:paramtypes", [tp_charges_service_1.TpChargesService])
], TpChargesController);
//# sourceMappingURL=tp-charges.controller.js.map