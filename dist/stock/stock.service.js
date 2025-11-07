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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_entity_1 = require("./stock.entity");
const brands_service_1 = require("../brands/brands.service");
let StockService = class StockService {
    constructor(stockRepository, brandsService) {
        this.stockRepository = stockRepository;
        this.brandsService = brandsService;
    }
    async create(createStockDto) {
        await this.brandsService.findOne(createStockDto.brand_id);
        const existingStock = await this.stockRepository.findOne({
            where: {
                brand_id: createStockDto.brand_id,
                size: createStockDto.size,
            },
        });
        if (existingStock) {
            throw new common_1.BadRequestException('Stock already exists for this brand and size. Use update instead.');
        }
        const stock = this.stockRepository.create(createStockDto);
        return await this.stockRepository.save(stock);
    }
    async findAll() {
        return await this.stockRepository.find({
            relations: ['brand'],
            order: {
                brand: { name: 'ASC' },
                size: 'ASC'
            },
        });
    }
    async findByBrand(brandId) {
        await this.brandsService.findOne(brandId);
        return await this.stockRepository.find({
            where: { brand_id: brandId },
            relations: ['brand'],
            order: { size: 'ASC' },
        });
    }
    async findOne(id) {
        const stock = await this.stockRepository.findOne({
            where: { id },
            relations: ['brand'],
        });
        if (!stock) {
            throw new common_1.NotFoundException(`Stock with ID ${id} not found`);
        }
        return stock;
    }
    async findByBrandAndSize(brandId, size) {
        return await this.stockRepository.findOne({
            where: { brand_id: brandId, size },
            relations: ['brand'],
        });
    }
    async update(id, updateStockDto) {
        const stock = await this.findOne(id);
        if (updateStockDto.brand_id && updateStockDto.brand_id !== stock.brand_id) {
            await this.brandsService.findOne(updateStockDto.brand_id);
        }
        Object.assign(stock, updateStockDto);
        return await this.stockRepository.save(stock);
    }
    async updateQuantity(brandId, size, quantityChange) {
        let stock = await this.findByBrandAndSize(brandId, size);
        if (!stock) {
            stock = await this.create({
                brand_id: brandId,
                size,
                quantity: Math.max(0, quantityChange),
            });
        }
        else {
            stock.quantity = Math.max(0, stock.quantity + quantityChange);
            stock = await this.stockRepository.save(stock);
        }
        return stock;
    }
    async remove(id) {
        const stock = await this.findOne(id);
        await this.stockRepository.remove(stock);
    }
    async getTotalStockValue() {
        const stocks = await this.findAll();
        let totalValue = 0;
        for (const stock of stocks) {
            const price = await this.brandsService.getPriceForSize(stock.brand_id, stock.size);
            totalValue += stock.quantity * price;
        }
        return totalValue;
    }
    async getStockValueByBrand(brandId) {
        const stocks = await this.findByBrand(brandId);
        let totalValue = 0;
        for (const stock of stocks) {
            const price = await this.brandsService.getPriceForSize(stock.brand_id, stock.size);
            totalValue += stock.quantity * price;
        }
        return totalValue;
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        brands_service_1.BrandsService])
], StockService);
//# sourceMappingURL=stock.service.js.map