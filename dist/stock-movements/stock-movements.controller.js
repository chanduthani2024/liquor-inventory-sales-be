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
exports.StockMovementsController = void 0;
const common_1 = require("@nestjs/common");
const stock_movements_service_1 = require("./stock-movements.service");
const create_stock_receipt_dto_1 = require("./dto/create-stock-receipt.dto");
const adjust_stock_dto_1 = require("./dto/adjust-stock.dto");
const report_defect_dto_1 = require("./dto/report-defect.dto");
const stock_report_dto_1 = require("./dto/stock-report.dto");
let StockMovementsController = class StockMovementsController {
    constructor(stockMovementsService) {
        this.stockMovementsService = stockMovementsService;
    }
    async receiveStock(receiptDto) {
        return await this.stockMovementsService.receiveStock(receiptDto);
    }
    async adjustStock(adjustDto) {
        return await this.stockMovementsService.adjustStock(adjustDto);
    }
    async reportDefect(defectDto) {
        return await this.stockMovementsService.reportDefect(defectDto);
    }
    async getStockReport(reportDto) {
        return await this.stockMovementsService.getStockReport(reportDto);
    }
    async getAllMovements() {
        return await this.stockMovementsService.getAllMovements();
    }
    async getMovementsByBrand(brandId) {
        return await this.stockMovementsService.getMovementsByBrand(brandId);
    }
    async manualStockEntry(entryDto) {
        return await this.stockMovementsService.manualStockEntry(entryDto);
    }
};
exports.StockMovementsController = StockMovementsController;
__decorate([
    (0, common_1.Post)('receive'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stock_receipt_dto_1.CreateStockReceiptDto]),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "receiveStock", null);
__decorate([
    (0, common_1.Post)('adjust'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [adjust_stock_dto_1.AdjustStockDto]),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Post)('defect'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_defect_dto_1.ReportDefectDto]),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "reportDefect", null);
__decorate([
    (0, common_1.Get)('report'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stock_report_dto_1.StockReportDto]),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "getStockReport", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "getAllMovements", null);
__decorate([
    (0, common_1.Get)('brand/:brandId'),
    __param(0, (0, common_1.Param)('brandId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "getMovementsByBrand", null);
__decorate([
    (0, common_1.Post)('manual-entry'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StockMovementsController.prototype, "manualStockEntry", null);
exports.StockMovementsController = StockMovementsController = __decorate([
    (0, common_1.Controller)('stock-movements'),
    __metadata("design:paramtypes", [stock_movements_service_1.StockMovementsService])
], StockMovementsController);
//# sourceMappingURL=stock-movements.controller.js.map