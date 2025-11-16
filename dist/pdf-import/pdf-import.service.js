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
exports.PdfImportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const liquor_delivery_entity_1 = require("./liquor-delivery.entity");
const pdf_import_history_entity_1 = require("./pdf-import-history.entity");
const brand_entity_1 = require("../brands/brand.entity");
const stock_entity_1 = require("../stock/stock.entity");
const stock_movement_entity_1 = require("../stock-movements/stock-movement.entity");
const pdf_parser_util_1 = require("./pdf-parser.util");
let PdfImportService = class PdfImportService {
    constructor(liquorDeliveryRepository, importHistoryRepository, brandRepository, stockRepository, stockMovementRepository) {
        this.liquorDeliveryRepository = liquorDeliveryRepository;
        this.importHistoryRepository = importHistoryRepository;
        this.brandRepository = brandRepository;
        this.stockRepository = stockRepository;
        this.stockMovementRepository = stockMovementRepository;
    }
    extractSize(packQtySize) {
        try {
            const match = packQtySize.match(/\/\s*(\d+)\s*ml/i);
            if (match) {
                const sizeNum = match[1];
                if (sizeNum === '1000')
                    return '1L';
                if (sizeNum === '2000')
                    return '2L';
                return `${sizeNum}ml`;
            }
            return null;
        }
        catch (error) {
            console.error('Error extracting size from:', packQtySize, error);
            return null;
        }
    }
    extractPackQuantity(packQtySize) {
        try {
            const match = packQtySize.match(/^(\d+)\s*\//);
            return match ? parseInt(match[1]) : 0;
        }
        catch (error) {
            console.error('Error extracting pack quantity from:', packQtySize, error);
            return 0;
        }
    }
    extractBottlePrice(unitRateBtlRate) {
        try {
            const match = unitRateBtlRate.match(/\/\s*([\d,]+\.?\d*)/);
            if (match) {
                return parseFloat(match[1].replace(/,/g, ''));
            }
            return 0;
        }
        catch (error) {
            console.error('Error extracting bottle price from:', unitRateBtlRate, error);
            return 0;
        }
    }
    getActualPriceColumn(size) {
        const sizeMap = {
            '90ml': 'actual_price_90ml',
            '180ml': 'actual_price_180ml',
            '330ml': 'actual_price_330ml',
            '375ml': 'actual_price_375ml',
            '500ml': 'actual_price_500ml',
            '650ml': 'actual_price_650ml',
            '750ml': 'actual_price_750ml',
            '1L': 'actual_price_1l',
            '2L': 'actual_price_2l',
        };
        return sizeMap[size] || null;
    }
    async processDeliveryRecord(delivery, importId, stats) {
        try {
            console.log(`Processing delivery record: ${delivery.brandNumber} - ${delivery.brandName}`);
            const size = this.extractSize(delivery.packQtySize);
            if (!size) {
                stats.errors.push(`Could not extract size from: ${delivery.packQtySize}`);
                return;
            }
            const packQty = this.extractPackQuantity(delivery.packQtySize);
            const bottlePrice = this.extractBottlePrice(delivery.unitRateBtlRate);
            const totalBottles = delivery.qtyCasesDelivered * packQty;
            console.log(`Extracted: size=${size}, packQty=${packQty}, bottlePrice=${bottlePrice}, totalBottles=${totalBottles}`);
            let brand = await this.brandRepository.findOne({
                where: { brand_number: delivery.brandNumber }
            });
            if (!brand) {
                console.log(`Brand ${delivery.brandNumber} not found, creating new brand`);
                brand = this.brandRepository.create({
                    name: delivery.brandName,
                    brand_number: delivery.brandNumber,
                    description: `${delivery.productType} - Auto-created from PDF import`,
                });
                const actualPriceColumn = this.getActualPriceColumn(size);
                if (actualPriceColumn) {
                    brand[actualPriceColumn] = bottlePrice;
                }
                brand = await this.brandRepository.save(brand);
                stats.brandsCreated++;
                console.log(`Created new brand: ${brand.name} (ID: ${brand.id})`);
            }
            else {
                console.log(`Found existing brand: ${brand.name} (ID: ${brand.id})`);
                const actualPriceColumn = this.getActualPriceColumn(size);
                if (actualPriceColumn && bottlePrice > 0) {
                    const currentPrice = brand[actualPriceColumn];
                    if (!currentPrice || Math.abs(currentPrice - bottlePrice) > 0.01) {
                        brand[actualPriceColumn] = bottlePrice;
                        await this.brandRepository.save(brand);
                        stats.brandsUpdated++;
                        console.log(`Updated ${actualPriceColumn} to ${bottlePrice} for brand ${brand.name}`);
                    }
                }
            }
            if (totalBottles > 0) {
                const movement = this.stockMovementRepository.create({
                    brand_id: brand.id,
                    size: size,
                    movement_type: stock_movement_entity_1.MovementType.RECEIPT,
                    quantity: totalBottles,
                    defective_quantity: 0,
                    unit_cost: bottlePrice,
                    notes: `Auto-import from PDF: ${importId} - ${delivery.qtyCasesDelivered} cases x ${packQty} bottles`,
                });
                await this.stockMovementRepository.save(movement);
                console.log(`Created stock movement for ${totalBottles} bottles`);
                let stock = await this.stockRepository.findOne({
                    where: {
                        brand_id: brand.id,
                        size: size,
                    },
                });
                if (stock) {
                    stock.quantity += totalBottles;
                    await this.stockRepository.save(stock);
                    console.log(`Updated existing stock: ${stock.quantity} bottles`);
                }
                else {
                    stock = this.stockRepository.create({
                        brand_id: brand.id,
                        size: size,
                        quantity: totalBottles,
                        defective_quantity: 0,
                    });
                    await this.stockRepository.save(stock);
                    console.log(`Created new stock record: ${totalBottles} bottles`);
                }
                stats.stocksAdded++;
                stats.totalBottlesAdded += totalBottles;
            }
        }
        catch (error) {
            console.error(`Error processing delivery record:`, error);
            stats.errors.push(`${delivery.brandNumber}: ${error.message}`);
        }
    }
    async createFromPDFRows(rows) {
        try {
            console.log('Saving', rows.length, 'liquor delivery records');
            if (rows.length === 0) {
                throw new common_1.BadRequestException('No valid delivery records found in PDF');
            }
            const validRows = rows.filter(row => {
                const isValid = row.brandNumber && row.brandName &&
                    row.qtyCasesDelivered >= 0 && row.qtyBottlesDelivered >= 0;
                if (!isValid) {
                    console.log('Skipping invalid row:', row);
                }
                return isValid;
            });
            if (validRows.length === 0) {
                throw new common_1.BadRequestException('No valid delivery records after validation');
            }
            console.log('Saving', validRows.length, 'valid records out of', rows.length, 'total');
            const savedDeliveries = await this.liquorDeliveryRepository.save(validRows);
            console.log('Successfully saved', savedDeliveries.length, 'delivery records');
            return savedDeliveries;
        }
        catch (error) {
            console.error('Error in createFromPDFRows:', error);
            throw error;
        }
    }
    async processLiquorDeliveryPDF(file) {
        const importId = `LQDEL-${Date.now()}`;
        const stats = {
            brandsCreated: 0,
            brandsUpdated: 0,
            stocksAdded: 0,
            totalBottlesAdded: 0,
            errors: [],
        };
        try {
            console.log('Processing liquor delivery PDF:', file.originalname);
            if (!file) {
                throw new common_1.BadRequestException('No file uploaded');
            }
            if (file.mimetype !== 'application/pdf') {
                throw new common_1.BadRequestException('Only PDF files are allowed');
            }
            const rows = await (0, pdf_parser_util_1.parsePDF)(file);
            console.log('Parsed', rows.length, 'rows from PDF');
            if (rows.length === 0) {
                throw new common_1.BadRequestException('No delivery data found in PDF');
            }
            const savedDeliveries = await this.createFromPDFRows(rows);
            console.log(`Saved ${savedDeliveries.length} delivery records`);
            console.log('Starting automated processing of delivery records...');
            for (const delivery of savedDeliveries) {
                await this.processDeliveryRecord(delivery, importId, stats);
            }
            const importHistory = this.importHistoryRepository.create({
                importIdentifier: importId,
                filename: file.originalname,
                totalItems: rows.length,
                itemsProcessed: savedDeliveries.length,
                brandsCreated: stats.brandsCreated,
                brandsUpdated: stats.brandsUpdated,
                stocksAdded: stats.stocksAdded,
                totalBottlesAdded: stats.totalBottlesAdded,
                importStatus: stats.errors.length === 0 ? 'success' : 'partial',
                errorMessage: stats.errors.length > 0 ? stats.errors.join('; ') : null,
                importDetails: {
                    deliveries: savedDeliveries.map(d => ({
                        brandNumber: d.brandNumber,
                        brandName: d.brandName,
                        size: this.extractSize(d.packQtySize),
                        bottles: d.qtyCasesDelivered * this.extractPackQuantity(d.packQtySize),
                    })),
                    stats,
                },
            });
            await this.importHistoryRepository.save(importHistory);
            console.log('Import history saved');
            return {
                success: true,
                message: `Successfully processed ${savedDeliveries.length} items from PDF`,
                icdc_number: importId,
                items_parsed: savedDeliveries.length,
                automation_summary: {
                    brands_created: stats.brandsCreated,
                    brands_updated: stats.brandsUpdated,
                    stocks_added: stats.stocksAdded,
                    total_bottles_added: stats.totalBottlesAdded,
                    errors: stats.errors,
                },
                items: savedDeliveries.map(delivery => ({
                    id: delivery.id,
                    icdc_number: importId,
                    sl_no: parseInt(delivery.brandNumber) || 0,
                    brand_code: delivery.brandNumber,
                    brand_name: delivery.brandName,
                    product_type: delivery.productType,
                    pack_type: delivery.packType,
                    pack_qty: this.extractPackQuantity(delivery.packQtySize),
                    size_ml: this.extractSize(delivery.packQtySize),
                    qty_cases_delivered: delivery.qtyCasesDelivered,
                    qty_bottles_delivered: delivery.qtyCasesDelivered * this.extractPackQuantity(delivery.packQtySize),
                    rate_per_case: delivery.rateCase,
                    rate_per_bottle: this.extractBottlePrice(delivery.unitRateBtlRate),
                    total_amount: delivery.totalAmount,
                    created_at: delivery.createdAt,
                })),
            };
        }
        catch (error) {
            console.error('Error processing liquor delivery PDF:', error);
            const importHistory = this.importHistoryRepository.create({
                importIdentifier: importId,
                filename: file?.originalname || 'unknown',
                totalItems: 0,
                itemsProcessed: 0,
                brandsCreated: stats.brandsCreated,
                brandsUpdated: stats.brandsUpdated,
                stocksAdded: stats.stocksAdded,
                totalBottlesAdded: stats.totalBottlesAdded,
                importStatus: 'failed',
                errorMessage: error.message,
                importDetails: { stats, error: error.message },
            });
            await this.importHistoryRepository.save(importHistory);
            return {
                success: false,
                message: error.message || 'Failed to process PDF',
                error: error.message,
            };
        }
    }
    async findAll() {
        return this.liquorDeliveryRepository.find({
            order: { createdAt: 'DESC' }
        });
    }
    async findById(id) {
        const delivery = await this.liquorDeliveryRepository.findOne({
            where: { id }
        });
        if (!delivery) {
            throw new common_1.BadRequestException(`Liquor delivery record with ID ${id} not found`);
        }
        return delivery;
    }
    async deleteById(id) {
        const result = await this.liquorDeliveryRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.BadRequestException(`Liquor delivery record with ID ${id} not found`);
        }
    }
    async getImportHistory() {
        return this.importHistoryRepository.find({
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
    async getImportHistoryById(id) {
        const history = await this.importHistoryRepository.findOne({
            where: { id }
        });
        if (!history) {
            throw new common_1.BadRequestException(`Import history with ID ${id} not found`);
        }
        return history;
    }
};
exports.PdfImportService = PdfImportService;
exports.PdfImportService = PdfImportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(liquor_delivery_entity_1.LiquorDelivery)),
    __param(1, (0, typeorm_1.InjectRepository)(pdf_import_history_entity_1.PdfImportHistory)),
    __param(2, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __param(3, (0, typeorm_1.InjectRepository)(stock_entity_1.Stock)),
    __param(4, (0, typeorm_1.InjectRepository)(stock_movement_entity_1.StockMovement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PdfImportService);
//# sourceMappingURL=pdf-import.service.js.map