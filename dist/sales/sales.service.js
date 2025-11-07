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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("./sale.entity");
const sale_item_entity_1 = require("./sale-item.entity");
const brands_service_1 = require("../brands/brands.service");
const stock_service_1 = require("../stock/stock.service");
const stock_movements_service_1 = require("../stock-movements/stock-movements.service");
let SalesService = class SalesService {
    constructor(salesRepository, saleItemsRepository, brandsService, stockService, stockMovementsService) {
        this.salesRepository = salesRepository;
        this.saleItemsRepository = saleItemsRepository;
        this.brandsService = brandsService;
        this.stockService = stockService;
        this.stockMovementsService = stockMovementsService;
    }
    async create(createSaleDto) {
        let totalAmount = 0;
        const validatedItems = [];
        for (const item of createSaleDto.items) {
            const brand = await this.brandsService.findOne(item.brand_id);
            const stock = await this.stockService.findByBrandAndSize(item.brand_id, item.size);
            if (!stock || stock.quantity < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${brand.name} ${item.size}. Available: ${stock?.quantity || 0}, Requested: ${item.quantity}`);
            }
            const unitPrice = await this.brandsService.getPriceForSize(item.brand_id, item.size);
            const itemTotal = unitPrice * item.quantity;
            totalAmount += itemTotal;
            validatedItems.push({
                brand_id: item.brand_id,
                size: item.size,
                quantity: item.quantity,
                unit_price: unitPrice,
                total_price: itemTotal,
            });
        }
        const sale = this.salesRepository.create({
            total_amount: totalAmount,
            payment_method: createSaleDto.payment_method || 'cash',
            items: validatedItems,
        });
        const savedSale = await this.salesRepository.save(sale);
        for (const item of createSaleDto.items) {
            await this.stockService.updateQuantity(item.brand_id, item.size, -item.quantity);
            await this.stockMovementsService.recordSale(item.brand_id, item.size, item.quantity, savedSale.id);
        }
        return await this.salesRepository.findOne({
            where: { id: savedSale.id },
            relations: ['items', 'items.brand'],
        });
    }
    async findAll() {
        return await this.salesRepository.find({
            relations: ['items', 'items.brand'],
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const sale = await this.salesRepository.findOne({
            where: { id },
            relations: ['items', 'items.brand'],
        });
        if (!sale) {
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
        return sale;
    }
    async findByDateRange(startDate, endDate) {
        return await this.salesRepository.find({
            where: {
                created_at: (0, typeorm_2.Between)(startDate, endDate),
            },
            relations: ['items', 'items.brand'],
            order: { created_at: 'DESC' },
        });
    }
    async getTotalRevenue(startDate, endDate) {
        let query = this.salesRepository.createQueryBuilder('sale');
        if (startDate && endDate) {
            query = query.where('sale.created_at BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const result = await query
            .select('SUM(sale.total_amount)', 'total')
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getSalesByBrand(startDate, endDate) {
        let query = this.saleItemsRepository
            .createQueryBuilder('saleItem')
            .leftJoinAndSelect('saleItem.brand', 'brand')
            .leftJoinAndSelect('saleItem.sale', 'sale');
        if (startDate && endDate) {
            query = query.where('sale.created_at BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const saleItems = await query
            .select([
            'brand.name as brand_name',
            'saleItem.size as size',
            'SUM(saleItem.quantity) as total_quantity',
            'SUM(saleItem.total_price) as total_revenue',
        ])
            .groupBy('brand.name, saleItem.size')
            .orderBy('total_revenue', 'DESC')
            .getRawMany();
        return saleItems;
    }
    async getTopSellingBrands(limit = 10, startDate, endDate) {
        let query = this.saleItemsRepository
            .createQueryBuilder('saleItem')
            .leftJoinAndSelect('saleItem.brand', 'brand')
            .leftJoinAndSelect('saleItem.sale', 'sale');
        if (startDate && endDate) {
            query = query.where('sale.created_at BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const topBrands = await query
            .select([
            'brand.name as brand_name',
            'SUM(saleItem.quantity) as total_quantity',
            'SUM(saleItem.total_price) as total_revenue',
        ])
            .groupBy('brand.name')
            .orderBy('total_revenue', 'DESC')
            .limit(limit)
            .getRawMany();
        return topBrands;
    }
    async getSalesByPaymentMethod(startDate, endDate) {
        let query = this.salesRepository.createQueryBuilder('sale');
        if (startDate && endDate) {
            query = query.where('sale.created_at BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const result = await query
            .select([
            'sale.payment_method as payment_method',
            'SUM(sale.total_amount) as total',
            'COUNT(sale.id) as count',
        ])
            .groupBy('sale.payment_method')
            .getRawMany();
        const summary = {
            cash: { total: 0, count: 0 },
            online: { total: 0, count: 0 },
        };
        result.forEach(row => {
            summary[row.payment_method] = {
                total: parseFloat(row.total) || 0,
                count: parseInt(row.count) || 0,
            };
        });
        return summary;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(sale_item_entity_1.SaleItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        brands_service_1.BrandsService,
        stock_service_1.StockService,
        stock_movements_service_1.StockMovementsService])
], SalesService);
//# sourceMappingURL=sales.service.js.map