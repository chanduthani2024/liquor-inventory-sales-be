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
exports.BrandsController = void 0;
const common_1 = require("@nestjs/common");
const brands_service_1 = require("./brands.service");
const create_brand_dto_1 = require("./dto/create-brand.dto");
const update_brand_dto_1 = require("./dto/update-brand.dto");
let BrandsController = class BrandsController {
    constructor(brandsService) {
        this.brandsService = brandsService;
    }
    async create(createBrandDto) {
        const brand = await this.brandsService.create(createBrandDto);
        return {
            success: true,
            message: 'Brand created successfully',
            data: brand
        };
    }
    findAll() {
        return this.brandsService.findAll();
    }
    findOne(id) {
        return this.brandsService.findOne(+id);
    }
    async update(id, updateBrandDto, req) {
        const userId = req.user?.id;
        const brand = await this.brandsService.update(+id, updateBrandDto, userId);
        return {
            success: true,
            message: 'Brand updated successfully',
            data: brand
        };
    }
    async remove(id) {
        await this.brandsService.remove(+id);
        return {
            success: true,
            message: 'Brand deleted successfully'
        };
    }
    findByAlcoholType(alcoholTypeId) {
        return this.brandsService.findByAlcoholType(+alcoholTypeId);
    }
    getPriceForSize(id, size) {
        return this.brandsService.getPriceForSize(+id, size);
    }
    async getAllPriceHistory(brandId, size, limit) {
        const history = await this.brandsService.getPriceHistory(brandId ? +brandId : undefined, size, limit ? +limit : 50);
        return {
            success: true,
            data: history
        };
    }
    async getBrandPriceHistory(id, size) {
        const history = await this.brandsService.getBrandPriceHistory(+id, size);
        return {
            success: true,
            data: history
        };
    }
    async getDailyProfitReport(date, brandId) {
        const report = await this.brandsService.getDailyProfitReport(date, brandId ? +brandId : undefined);
        return {
            success: true,
            data: report
        };
    }
    async getProfitSummary(startDate, endDate, brandId) {
        const summary = await this.brandsService.getProfitSummary(startDate, endDate, brandId ? +brandId : undefined);
        return {
            success: true,
            data: summary
        };
    }
};
exports.BrandsController = BrandsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_brand_dto_1.CreateBrandDto]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BrandsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_brand_dto_1.UpdateBrandDto, Object]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('by-alcohol-type/:alcoholTypeId'),
    __param(0, (0, common_1.Param)('alcoholTypeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BrandsController.prototype, "findByAlcoholType", null);
__decorate([
    (0, common_1.Get)(':id/price/:size'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BrandsController.prototype, "getPriceForSize", null);
__decorate([
    (0, common_1.Get)('price-history/all'),
    __param(0, (0, common_1.Query)('brandId')),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "getAllPriceHistory", null);
__decorate([
    (0, common_1.Get)(':id/price-history'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "getBrandPriceHistory", null);
__decorate([
    (0, common_1.Get)('profit-report/daily'),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('brandId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "getDailyProfitReport", null);
__decorate([
    (0, common_1.Get)('profit-report/summary'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('brandId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "getProfitSummary", null);
exports.BrandsController = BrandsController = __decorate([
    (0, common_1.Controller)('brands'),
    __metadata("design:paramtypes", [brands_service_1.BrandsService])
], BrandsController);
//# sourceMappingURL=brands.controller.js.map