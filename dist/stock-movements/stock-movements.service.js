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
exports.StockMovementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stock_movement_entity_1 = require("./stock-movement.entity");
const stock_entity_1 = require("../stock/stock.entity");
const brand_entity_1 = require("../brands/brand.entity");
const sale_item_entity_1 = require("../sales/sale-item.entity");
let StockMovementsService = class StockMovementsService {
    constructor(movementsRepository, stockRepository, brandRepository, saleItemRepository) {
        this.movementsRepository = movementsRepository;
        this.stockRepository = stockRepository;
        this.brandRepository = brandRepository;
        this.saleItemRepository = saleItemRepository;
    }
    async receiveStock(receiptDto) {
        const brand = await this.brandRepository.findOne({
            where: { id: receiptDto.brand_id }
        });
        if (!brand) {
            throw new common_1.BadRequestException(`Brand with ID ${receiptDto.brand_id} does not exist. Available brand IDs: ${await this.getAvailableBrandIds()}`);
        }
        const sizeColumnMap = {
            '90ml': 'price_90ml',
            '180ml': 'price_180ml',
            '330ml': 'price_330ml',
            '375ml': 'price_375ml',
            '500ml': 'price_500ml',
            '650ml': 'price_650ml',
            '750ml': 'price_750ml',
            '1L': 'price_1l',
            '2L': 'price_2l'
        };
        const priceColumn = sizeColumnMap[receiptDto.size];
        if (!priceColumn || !brand[priceColumn]) {
            const availableSizes = Object.keys(sizeColumnMap).filter(size => {
                const column = sizeColumnMap[size];
                return brand[column] && brand[column] !== null;
            });
            throw new common_1.BadRequestException(`Brand "${brand.name}" does not support size "${receiptDto.size}". Available sizes: ${availableSizes.join(', ')}`);
        }
        const movementType = receiptDto.notes && receiptDto.notes.includes('adjustment')
            ? stock_movement_entity_1.MovementType.ADJUSTMENT
            : stock_movement_entity_1.MovementType.RECEIPT;
        const movement = this.movementsRepository.create({
            brand_id: receiptDto.brand_id,
            size: receiptDto.size,
            movement_type: movementType,
            quantity: receiptDto.quantity,
            defective_quantity: receiptDto.defective_quantity || 0,
            unit_cost: receiptDto.unit_cost,
            notes: receiptDto.notes,
        });
        const savedMovement = await this.movementsRepository.save(movement);
        let stock = await this.stockRepository.findOne({
            where: {
                brand_id: receiptDto.brand_id,
                size: receiptDto.size,
            },
        });
        if (stock) {
            const goodQuantity = receiptDto.quantity - (receiptDto.defective_quantity || 0);
            stock.quantity += goodQuantity;
            stock.defective_quantity += receiptDto.defective_quantity || 0;
            await this.stockRepository.save(stock);
        }
        else {
            const goodQuantity = receiptDto.quantity - (receiptDto.defective_quantity || 0);
            stock = this.stockRepository.create({
                brand_id: receiptDto.brand_id,
                size: receiptDto.size,
                quantity: goodQuantity,
                defective_quantity: receiptDto.defective_quantity || 0,
            });
            await this.stockRepository.save(stock);
        }
        return {
            message: 'Stock received successfully',
            movement: savedMovement,
            currentStock: stock.quantity,
            defectiveStock: stock.defective_quantity,
            totalReceived: receiptDto.quantity,
            defectiveReceived: receiptDto.defective_quantity || 0,
        };
    }
    async adjustStock(adjustDto) {
        const brand = await this.brandRepository.findOne({
            where: { id: adjustDto.brand_id }
        });
        if (!brand) {
            throw new common_1.BadRequestException(`Brand with ID ${adjustDto.brand_id} does not exist. Available brand IDs: ${await this.getAvailableBrandIds()}`);
        }
        let stock = await this.stockRepository.findOne({
            where: {
                brand_id: adjustDto.brand_id,
                size: adjustDto.size,
            },
        });
        const currentQuantity = stock ? stock.quantity : 0;
        const adjustmentQuantity = adjustDto.new_total_quantity - currentQuantity;
        const movement = this.movementsRepository.create({
            brand_id: adjustDto.brand_id,
            size: adjustDto.size,
            movement_type: stock_movement_entity_1.MovementType.ADJUSTMENT,
            quantity: adjustmentQuantity,
            defective_quantity: 0,
            notes: adjustDto.notes || `Stock adjustment: ${currentQuantity} → ${adjustDto.new_total_quantity}`,
        });
        const savedMovement = await this.movementsRepository.save(movement);
        if (stock) {
            stock.quantity = adjustDto.new_total_quantity;
            await this.stockRepository.save(stock);
        }
        else {
            stock = this.stockRepository.create({
                brand_id: adjustDto.brand_id,
                size: adjustDto.size,
                quantity: adjustDto.new_total_quantity,
                defective_quantity: 0,
            });
            await this.stockRepository.save(stock);
        }
        return {
            message: 'Stock adjusted successfully',
            movement: savedMovement,
            previousQuantity: currentQuantity,
            newQuantity: adjustDto.new_total_quantity,
            adjustmentQuantity: adjustmentQuantity,
        };
    }
    async reportDefect(defectDto) {
        const brand = await this.brandRepository.findOne({
            where: { id: defectDto.brand_id }
        });
        if (!brand) {
            throw new common_1.BadRequestException(`Brand with ID ${defectDto.brand_id} does not exist. Available brand IDs: ${await this.getAvailableBrandIds()}`);
        }
        const stock = await this.stockRepository.findOne({
            where: {
                brand_id: defectDto.brand_id,
                size: defectDto.size,
            },
        });
        if (!stock || stock.quantity < defectDto.defective_quantity) {
            throw new common_1.BadRequestException(`Insufficient good stock for ${brand.name} ${defectDto.size}. Available: ${stock?.quantity || 0}, Requested: ${defectDto.defective_quantity}`);
        }
        const notes = [
            defectDto.defect_reason && `Reason: ${defectDto.defect_reason}`,
            defectDto.action_taken && `Action: ${defectDto.action_taken}`,
            defectDto.notes
        ].filter(Boolean).join(' | ');
        const movement = this.movementsRepository.create({
            brand_id: defectDto.brand_id,
            size: defectDto.size,
            movement_type: stock_movement_entity_1.MovementType.DEFECT,
            quantity: -defectDto.defective_quantity,
            defective_quantity: defectDto.defective_quantity,
            notes: notes || 'Defective bottles reported',
        });
        const savedMovement = await this.movementsRepository.save(movement);
        stock.quantity -= defectDto.defective_quantity;
        stock.defective_quantity += defectDto.defective_quantity;
        await this.stockRepository.save(stock);
        return {
            message: 'Defect reported successfully',
            movement: savedMovement,
            currentStock: stock.quantity,
            defectiveStock: stock.defective_quantity,
        };
    }
    async recordSale(brandId, size, quantity, saleId) {
        const movement = this.movementsRepository.create({
            brand_id: brandId,
            size: size,
            movement_type: stock_movement_entity_1.MovementType.SALE,
            quantity: -quantity,
            reference_id: saleId,
            notes: `Sale #${saleId}`,
        });
        return await this.movementsRepository.save(movement);
    }
    async getStockReport(reportDto) {
        const { brand_id, start_date, end_date } = reportDto;
        const reportDate = start_date || new Date().toISOString().split('T')[0];
        const startOfDay = new Date(reportDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(reportDate);
        endOfDay.setHours(23, 59, 59, 999);
        const brandQuery = {};
        if (brand_id) {
            brandQuery.id = brand_id;
        }
        const allBrands = await this.brandRepository.find({
            where: brandQuery,
            order: { name: 'ASC' },
        });
        const stockQuery = {};
        if (brand_id) {
            stockQuery.brand_id = brand_id;
        }
        const existingStocks = await this.stockRepository.find({
            where: stockQuery,
            relations: ['brand'],
            order: { brand: { name: 'ASC' }, size: 'ASC' },
        });
        const stockMap = new Map();
        existingStocks.forEach(stock => {
            const key = `${stock.brand_id}-${stock.size}`;
            stockMap.set(key, stock);
        });
        let movements = await this.movementsRepository.find({
            where: stockQuery,
            relations: ['brand'],
            order: { created_at: 'ASC' },
        });
        const todaysMovements = movements.filter(movement => {
            const movementDate = new Date(movement.created_at);
            return movementDate >= startOfDay && movementDate <= endOfDay;
        });
        const previousMovements = movements.filter(movement => {
            const movementDate = new Date(movement.created_at);
            return movementDate < startOfDay;
        });
        const reportMap = new Map();
        allBrands.forEach(brand => {
            const sizeConfig = [
                { size: '90ml', priceField: 'price_90ml' },
                { size: '180ml', priceField: 'price_180ml' },
                { size: '330ml', priceField: 'price_330ml' },
                { size: '375ml', priceField: 'price_375ml' },
                { size: '500ml', priceField: 'price_500ml' },
                { size: '650ml', priceField: 'price_650ml' },
                { size: '750ml', priceField: 'price_750ml' },
                { size: '1L', priceField: 'price_1l' },
                { size: '2L', priceField: 'price_2l' },
            ];
            sizeConfig.forEach(({ size, priceField }) => {
                const unitPrice = brand[priceField];
                if (unitPrice !== null && unitPrice !== undefined) {
                    const key = `${brand.id}-${size}`;
                    const existingStock = stockMap.get(key);
                    reportMap.set(key, {
                        date: reportDate,
                        brand_id: brand.id,
                        brand_name: brand.name,
                        size: size,
                        opening_balance: 0,
                        received_today: 0,
                        total_stock: existingStock ? existingStock.quantity : 0,
                        closed_balance: 0,
                        sales_quantity: 0,
                        defective_quantity: existingStock ? (existingStock.defective_quantity || 0) : 0,
                        rate: unitPrice,
                        sales_amount: 0,
                        movements: [],
                    });
                }
            });
        });
        for (const [key, report] of reportMap) {
            const previousMovements = movements.filter(movement => {
                const movementDate = new Date(movement.created_at);
                return movementDate < startOfDay &&
                    movement.brand_id === report.brand_id &&
                    movement.size === report.size;
            });
            let openingBalance = 0;
            previousMovements.forEach(movement => {
                if (movement.movement_type === stock_movement_entity_1.MovementType.RECEIPT ||
                    movement.movement_type === stock_movement_entity_1.MovementType.ADJUSTMENT) {
                    openingBalance += movement.quantity;
                }
                else if (movement.movement_type === stock_movement_entity_1.MovementType.SALE) {
                    openingBalance += movement.quantity;
                }
                else if (movement.movement_type === stock_movement_entity_1.MovementType.DEFECT) {
                    openingBalance += movement.quantity;
                }
            });
            report.opening_balance = Math.max(0, openingBalance);
        }
        todaysMovements.forEach(movement => {
            const key = `${movement.brand_id}-${movement.size}`;
            if (!reportMap.has(key)) {
                return;
            }
            const report = reportMap.get(key);
            report.movements.push({
                date: movement.created_at,
                type: movement.movement_type,
                quantity: movement.quantity,
                defective_quantity: movement.defective_quantity,
                notes: movement.notes,
                unit_cost: movement.unit_cost,
            });
            if (movement.movement_type === stock_movement_entity_1.MovementType.RECEIPT ||
                movement.movement_type === stock_movement_entity_1.MovementType.ADJUSTMENT) {
                report.received_today += movement.quantity;
            }
            else if (movement.movement_type === stock_movement_entity_1.MovementType.SALE) {
                const saleQuantity = Math.abs(movement.quantity);
                report.sales_quantity += saleQuantity;
            }
            else if (movement.movement_type === stock_movement_entity_1.MovementType.DEFECT) {
            }
        });
        const salesData = await this.saleItemRepository
            .createQueryBuilder('saleItem')
            .leftJoinAndSelect('saleItem.sale', 'sale')
            .where('DATE(sale.created_at) = :reportDate', { reportDate })
            .andWhere(brand_id ? 'saleItem.brand_id = :brand_id' : '1=1', { brand_id })
            .select([
            'saleItem.brand_id as brand_id',
            'saleItem.size as size',
            'SUM(saleItem.total_price) as actual_sales_amount'
        ])
            .groupBy('saleItem.brand_id, saleItem.size')
            .getRawMany();
        const salesAmountMap = new Map();
        salesData.forEach(sale => {
            const key = `${sale.brand_id}-${sale.size}`;
            salesAmountMap.set(key, parseFloat(sale.actual_sales_amount) || 0);
        });
        for (const [key, report] of reportMap) {
            const actualSalesAmount = salesAmountMap.get(key) || 0;
            const todaysSalesMovements = todaysMovements.filter(m => m.brand_id === report.brand_id &&
                m.size === report.size &&
                m.movement_type === stock_movement_entity_1.MovementType.SALE);
            const actualSalesQty = await this.saleItemRepository
                .createQueryBuilder('saleItem')
                .leftJoinAndSelect('saleItem.sale', 'sale')
                .where('DATE(sale.created_at) = :reportDate', { reportDate })
                .andWhere('saleItem.brand_id = :brand_id', { brand_id: report.brand_id })
                .andWhere('saleItem.size = :size', { size: report.size })
                .select('SUM(saleItem.quantity)', 'total_qty')
                .getRawOne();
            const actualSalesQuantity = parseInt(actualSalesQty?.total_qty) || 0;
            const manualSalesQuantity = report.sales_quantity - actualSalesQuantity;
            const manualSalesAmount = manualSalesQuantity > 0 ? manualSalesQuantity * report.rate : 0;
            report.sales_amount = actualSalesAmount + manualSalesAmount;
            report.closed_balance = report.opening_balance + report.received_today - report.sales_quantity;
            if (report.opening_balance < 0) {
                report.opening_balance = 0;
            }
            if (report.total_stock < 0) {
                report.total_stock = 0;
            }
            if (report.closed_balance < 0) {
                report.closed_balance = 0;
            }
            const calculatedClosing = report.opening_balance + report.received_today - report.sales_quantity;
            if (Math.abs(calculatedClosing - report.closed_balance) > 0.001) {
            }
        }
        return Array.from(reportMap.values());
    }
    async getAllMovements() {
        return await this.movementsRepository.find({
            relations: ['brand'],
            order: { created_at: 'DESC' },
        });
    }
    async getMovementsByBrand(brandId) {
        return await this.movementsRepository.find({
            where: { brand_id: brandId },
            relations: ['brand'],
            order: { created_at: 'DESC' },
        });
    }
    async getAvailableBrandIds() {
        const brands = await this.brandRepository.find({ select: ['id', 'name'] });
        return brands.map(brand => `${brand.id} (${brand.name})`).join(', ');
    }
    async manualStockEntry(entryDto) {
        const brand = await this.brandRepository.findOne({
            where: { id: entryDto.brand_id }
        });
        if (!brand) {
            throw new common_1.BadRequestException(`Brand with ID ${entryDto.brand_id} does not exist. Available brand IDs: ${await this.getAvailableBrandIds()}`);
        }
        let stock = await this.stockRepository.findOne({
            where: {
                brand_id: entryDto.brand_id,
                size: entryDto.size,
            },
        });
        if (!stock) {
            stock = this.stockRepository.create({
                brand_id: entryDto.brand_id,
                size: entryDto.size,
                quantity: 0,
                defective_quantity: 0,
            });
            await this.stockRepository.save(stock);
        }
        const entryDate = new Date(entryDto.date);
        const startOfDay = new Date(entryDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(entryDate);
        endOfDay.setHours(23, 59, 59, 999);
        const existingMovements = await this.movementsRepository.find({
            where: {
                brand_id: entryDto.brand_id,
                size: entryDto.size,
                created_at: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
            order: { created_at: 'DESC' },
        });
        const existingReceipt = existingMovements.find(m => m.movement_type === stock_movement_entity_1.MovementType.RECEIPT);
        const existingSale = existingMovements.find(m => m.movement_type === stock_movement_entity_1.MovementType.SALE);
        let existingReceiptQty = 0;
        let existingSalesQty = 0;
        if (existingReceipt) {
            existingReceiptQty = existingReceipt.quantity;
        }
        if (existingSale) {
            existingSalesQty = Math.abs(existingSale.quantity);
        }
        const stockBeforeManualEntries = stock.quantity - existingReceiptQty + existingSalesQty;
        if (existingMovements.length > 0) {
            await this.movementsRepository.remove(existingMovements);
        }
        const movements = [];
        if (entryDto.received_today > 0) {
            const receiptMovement = this.movementsRepository.create({
                brand_id: entryDto.brand_id,
                size: entryDto.size,
                movement_type: stock_movement_entity_1.MovementType.RECEIPT,
                quantity: entryDto.received_today,
                defective_quantity: 0,
                notes: `Manual entry - Received: ${entryDto.received_today} on ${entryDto.date}. ${entryDto.notes || ''}`.trim(),
            });
            movements.push(await this.movementsRepository.save(receiptMovement));
        }
        if (entryDto.sales_quantity > 0) {
            const saleMovement = this.movementsRepository.create({
                brand_id: entryDto.brand_id,
                size: entryDto.size,
                movement_type: stock_movement_entity_1.MovementType.SALE,
                quantity: -entryDto.sales_quantity,
                defective_quantity: 0,
                notes: `Manual entry - Sold: ${entryDto.sales_quantity} on ${entryDto.date}. ${entryDto.notes || ''}`.trim(),
            });
            movements.push(await this.movementsRepository.save(saleMovement));
        }
        const newQuantity = stockBeforeManualEntries + entryDto.received_today - entryDto.sales_quantity;
        if (newQuantity < 0) {
            throw new common_1.BadRequestException(`Insufficient stock: Available stock before manual entries is ${stockBeforeManualEntries}, but you're trying to sell ${entryDto.sales_quantity}. Available after receiving ${entryDto.received_today}: ${stockBeforeManualEntries + entryDto.received_today}`);
        }
        stock.quantity = newQuantity;
        await this.stockRepository.save(stock);
        return {
            message: 'Manual stock entry recorded successfully',
            movements: movements,
            stockUpdate: {
                brand: brand.name,
                size: entryDto.size,
                stockBeforeManualEntries,
                receivedToday: entryDto.received_today,
                salesQuantity: entryDto.sales_quantity,
                newQuantity,
                replacedExistingEntries: existingMovements.length > 0,
            },
        };
    }
    getUnitPrice(brand, size) {
        switch (size) {
            case '90ml':
                return brand.price_90ml || 0;
            case '180ml':
                return brand.price_180ml || 0;
            case '330ml':
                return brand.price_330ml || 0;
            case '375ml':
                return brand.price_375ml || 0;
            case '500ml':
                return brand.price_500ml || 0;
            case '650ml':
                return brand.price_650ml || 0;
            case '750ml':
                return brand.price_750ml || 0;
            case '1L':
            case '1l':
                return brand.price_1l || 0;
            case '2L':
            case '2l':
                return brand.price_2l || 0;
            default:
                return 0;
        }
    }
};
exports.StockMovementsService = StockMovementsService;
exports.StockMovementsService = StockMovementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stock_movement_entity_1.StockMovement)),
    __param(1, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __param(2, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __param(3, (0, typeorm_1.InjectRepository)(sale_item_entity_1.SaleItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StockMovementsService);
//# sourceMappingURL=stock-movements.service.js.map