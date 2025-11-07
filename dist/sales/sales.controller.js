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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("./sales.service");
const create_sale_dto_1 = require("./dto/create-sale.dto");
let SalesController = class SalesController {
    constructor(salesService) {
        this.salesService = salesService;
    }
    async create(createSaleDto) {
        const sale = await this.salesService.create(createSaleDto);
        return {
            success: true,
            message: `Sale recorded successfully! Payment method: ${sale.payment_method}`,
            data: sale,
        };
    }
    findAll(startDate, endDate) {
        if (startDate && endDate) {
            return this.salesService.findByDateRange(new Date(startDate), this.getEndOfDay(new Date(endDate)));
        }
        return this.salesService.findAll();
    }
    getTotalRevenue(startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
        return this.salesService.getTotalRevenue(start, end);
    }
    getSalesByBrand(startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
        return this.salesService.getSalesByBrand(start, end);
    }
    getTopSellingBrands(limit, startDate, endDate) {
        const limitNumber = limit ? parseInt(limit) : 10;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
        return this.salesService.getTopSellingBrands(limitNumber, start, end);
    }
    getSalesByPaymentMethod(startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
        return this.salesService.getSalesByPaymentMethod(start, end);
    }
    getEndOfDay(date) {
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return endOfDay;
    }
    findOne(id) {
        return this.salesService.findOne(+id);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_1.CreateSaleDto]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('revenue'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getTotalRevenue", null);
__decorate([
    (0, common_1.Get)('by-brand'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getSalesByBrand", null);
__decorate([
    (0, common_1.Get)('top-brands'),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getTopSellingBrands", null);
__decorate([
    (0, common_1.Get)('payment-summary'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getSalesByPaymentMethod", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findOne", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map