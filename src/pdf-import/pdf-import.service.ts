import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiquorDelivery } from './liquor-delivery.entity';
import { PdfImportHistory } from './pdf-import-history.entity';
import { Brand } from '../brands/brand.entity';
import { Stock } from '../stock/stock.entity';
import { StockMovement, MovementType } from '../stock-movements/stock-movement.entity';
import { CreateLiquorDeliveryDto } from './dto';
import { parsePDF } from './pdf-parser.util';

@Injectable()
export class PdfImportService {
  constructor(
    @InjectRepository(LiquorDelivery)
    private readonly liquorDeliveryRepository: Repository<LiquorDelivery>,
    @InjectRepository(PdfImportHistory)
    private readonly importHistoryRepository: Repository<PdfImportHistory>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
  ) {}

  // Helper method to extract size from packQtySize (e.g., '12 / 650 ml' -> '650ml')
  private extractSize(packQtySize: string): string | null {
    try {
      // Match patterns like '12 / 650 ml' or '24 / 500 ml'
      const match = packQtySize.match(/\/\s*(\d+)\s*ml/i);
      if (match) {
        const sizeNum = match[1];
        // Convert to standard format
        if (sizeNum === '1000') return '1L';
        if (sizeNum === '2000') return '2L';
        return `${sizeNum}ml`;
      }
      return null;
    } catch (error) {
      console.error('Error extracting size from:', packQtySize, error);
      return null;
    }
  }

  // Helper method to extract pack quantity (e.g., '12 / 650 ml' -> 12)
  private extractPackQuantity(packQtySize: string): number {
    try {
      const match = packQtySize.match(/^(\d+)\s*\//);
      return match ? parseInt(match[1]) : 0;
    } catch (error) {
      console.error('Error extracting pack quantity from:', packQtySize, error);
      return 0;
    }
  }

  // Helper method to extract bottle price (e.g., '1,501.00 / 125.08' -> 125.08)
  private extractBottlePrice(unitRateBtlRate: string): number {
    try {
      const match = unitRateBtlRate.match(/\/\s*([\d,]+\.?\d*)/);
      if (match) {
        return parseFloat(match[1].replace(/,/g, ''));
      }
      return 0;
    } catch (error) {
      console.error('Error extracting bottle price from:', unitRateBtlRate, error);
      return 0;
    }
  }

  // Helper method to get the actual price column name for a size
  private getActualPriceColumn(size: string): string {
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

  // Process each delivery record: match/create brand, update price, add stock
  private async processDeliveryRecord(
    delivery: LiquorDelivery,
    importId: string,
    stats: {
      brandsCreated: number;
      brandsUpdated: number;
      stocksAdded: number;
      totalBottlesAdded: number;
      errors: string[];
    }
  ): Promise<void> {
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

      // Find or create brand
      let brand = await this.brandRepository.findOne({
        where: { brand_number: delivery.brandNumber }
      });

      if (!brand) {
        console.log(`Brand ${delivery.brandNumber} not found, creating new brand`);
        
        // Create new brand
        brand = this.brandRepository.create({
          name: delivery.brandName,
          brand_number: delivery.brandNumber,
          description: `${delivery.productType} - Auto-created from PDF import`,
        });

        // Set the actual price for this size
        const actualPriceColumn = this.getActualPriceColumn(size);
        if (actualPriceColumn) {
          brand[actualPriceColumn] = bottlePrice;
        }

        brand = await this.brandRepository.save(brand);
        stats.brandsCreated++;
        console.log(`Created new brand: ${brand.name} (ID: ${brand.id})`);
      } else {
        console.log(`Found existing brand: ${brand.name} (ID: ${brand.id})`);
        
        // Update the actual price for this size if it's different
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

      // Add stock receipt
      if (totalBottles > 0) {
        // Create stock movement record
        const movement = this.stockMovementRepository.create({
          brand_id: brand.id,
          size: size,
          movement_type: MovementType.RECEIPT,
          quantity: totalBottles,
          defective_quantity: 0,
          unit_cost: bottlePrice,
          notes: `Auto-import from PDF: ${importId} - ${delivery.qtyCasesDelivered} cases x ${packQty} bottles`,
        });

        await this.stockMovementRepository.save(movement);
        console.log(`Created stock movement for ${totalBottles} bottles`);

        // Update stock record
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
        } else {
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

    } catch (error) {
      console.error(`Error processing delivery record:`, error);
      stats.errors.push(`${delivery.brandNumber}: ${error.message}`);
    }
  }

  async createFromPDFRows(rows: CreateLiquorDeliveryDto[]): Promise<LiquorDelivery[]> {
    try {
      console.log('Saving', rows.length, 'liquor delivery records');
      
      if (rows.length === 0) {
        throw new BadRequestException('No valid delivery records found in PDF');
      }

      // Validate each row before saving
      const validRows = rows.filter(row => {
        const isValid = row.brandNumber && row.brandName && 
                       row.qtyCasesDelivered >= 0 && row.qtyBottlesDelivered >= 0;
        if (!isValid) {
          console.log('Skipping invalid row:', row);
        }
        return isValid;
      });

      if (validRows.length === 0) {
        throw new BadRequestException('No valid delivery records after validation');
      }

      console.log('Saving', validRows.length, 'valid records out of', rows.length, 'total');

      const savedDeliveries = await this.liquorDeliveryRepository.save(validRows);
      console.log('Successfully saved', savedDeliveries.length, 'delivery records');
      
      return savedDeliveries;
    } catch (error) {
      console.error('Error in createFromPDFRows:', error);
      throw error;
    }
  }

  async processLiquorDeliveryPDF(file: any): Promise<any> {
    const importId = `LQDEL-${Date.now()}`;
    
    // Initialize stats
    const stats = {
      brandsCreated: 0,
      brandsUpdated: 0,
      stocksAdded: 0,
      totalBottlesAdded: 0,
      errors: [] as string[],
    };

    try {
      console.log('Processing liquor delivery PDF:', file.originalname);
      
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Only PDF files are allowed');
      }

      // Parse PDF to extract delivery data
      const rows = await parsePDF(file);
      console.log('Parsed', rows.length, 'rows from PDF');

      if (rows.length === 0) {
        throw new BadRequestException('No delivery data found in PDF');
      }

      // Save liquor delivery records to database (for audit trail)
      const savedDeliveries = await this.createFromPDFRows(rows);
      console.log(`Saved ${savedDeliveries.length} delivery records`);

      // Process each delivery record: match/create brand, update price, add stock
      console.log('Starting automated processing of delivery records...');
      for (const delivery of savedDeliveries) {
        await this.processDeliveryRecord(delivery, importId, stats);
      }

      // Create import history record
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

      // Return comprehensive response for frontend
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
      
    } catch (error) {
      console.error('Error processing liquor delivery PDF:', error);
      
      // Save error to import history
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

  async findAll(): Promise<LiquorDelivery[]> {
    return this.liquorDeliveryRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<LiquorDelivery> {
    const delivery = await this.liquorDeliveryRepository.findOne({ 
      where: { id } 
    });
    
    if (!delivery) {
      throw new BadRequestException(`Liquor delivery record with ID ${id} not found`);
    }
    
    return delivery;
  }

  async deleteById(id: number): Promise<void> {
    const result = await this.liquorDeliveryRepository.delete(id);
    
    if (result.affected === 0) {
      throw new BadRequestException(`Liquor delivery record with ID ${id} not found`);
    }
  }

  // Get import history
  async getImportHistory(): Promise<PdfImportHistory[]> {
    return this.importHistoryRepository.find({
      order: { createdAt: 'DESC' },
      take: 50, // Last 50 imports
    });
  }

  async getImportHistoryById(id: number): Promise<PdfImportHistory> {
    const history = await this.importHistoryRepository.findOne({ 
      where: { id } 
    });
    
    if (!history) {
      throw new BadRequestException(`Import history with ID ${id} not found`);
    }
    
    return history;
  }
}