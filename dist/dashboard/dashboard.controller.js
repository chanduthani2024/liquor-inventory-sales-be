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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getDashboardData(startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
        console.log('Dashboard dates:', { start, end, originalEndDate: endDate });
        return this.dashboardService.getDashboardData(start, end);
    }
    getEndOfDay(date) {
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return endOfDay;
    }
    getRevenueByDate(startDate, endDate) {
        return this.dashboardService.getRevenueByDate(new Date(startDate), this.getEndOfDay(new Date(endDate)));
    }
    getLowStockItems(threshold) {
        const thresholdNumber = threshold ? parseInt(threshold) : 10;
        return this.dashboardService.getLowStockItems(thresholdNumber);
    }
    getBrandPerformance(brandId, startDate, endDate) {
        const brand = brandId ? parseInt(brandId) : undefined;
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
        return this.dashboardService.getBrandPerformance(brand, start, end);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getDashboardData", null);
__decorate([
    (0, common_1.Get)('revenue-by-date'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getRevenueByDate", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getLowStockItems", null);
__decorate([
    (0, common_1.Get)('brand-performance'),
    __param(0, (0, common_1.Query)('brandId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getBrandPerformance", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map