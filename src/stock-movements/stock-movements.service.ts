import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { StockMovement, MovementType } from './stock-movement.entity';
import { Stock } from '../stock/stock.entity';
import { Brand } from '../brands/brand.entity';
import { SaleItem } from '../sales/sale-item.entity';
import { CreateStockReceiptDto } from './dto/create-stock-receipt.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { ReportDefectDto } from './dto/report-defect.dto';
import { StockReportDto } from './dto/stock-report.dto';
import { ManualStockEntryDto } from './dto/manual-stock-entry.dto';

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectRepository(StockMovement)
    private movementsRepository: Repository<StockMovement>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(SaleItem)
    private saleItemRepository: Repository<SaleItem>,
  ) {}

  async receiveStock(receiptDto: CreateStockReceiptDto) {
    // Validate that the brand exists
    const brand = await this.brandRepository.findOne({
      where: { id: receiptDto.brand_id }
    });

    if (!brand) {
      throw new BadRequestException(
        `Brand with ID ${receiptDto.brand_id} does not exist. Available brand IDs: ${await this.getAvailableBrandIds()}`
      );
    }

    // Validate that the brand supports the requested size
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
      throw new BadRequestException(
        `Brand "${brand.name}" does not support size "${receiptDto.size}". Available sizes: ${availableSizes.join(', ')}`
      );
    }

    // Determine movement type based on context
    const movementType = receiptDto.notes && receiptDto.notes.includes('adjustment') 
      ? MovementType.ADJUSTMENT 
      : MovementType.RECEIPT;

    // Create stock movement record
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

    // Update or create stock record
    let stock = await this.stockRepository.findOne({
      where: {
        brand_id: receiptDto.brand_id,
        size: receiptDto.size,
      },
    });

    if (stock) {
      // Update existing stock (good bottles only - defective ones are tracked separately)
      const goodQuantity = receiptDto.quantity - (receiptDto.defective_quantity || 0);
      stock.quantity += goodQuantity;
      stock.defective_quantity += receiptDto.defective_quantity || 0;
      await this.stockRepository.save(stock);
    } else {
      // Create new stock record
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

  async adjustStock(adjustDto: AdjustStockDto) {
    // Validate that the brand exists
    const brand = await this.brandRepository.findOne({
      where: { id: adjustDto.brand_id }
    });

    if (!brand) {
      throw new BadRequestException(
        `Brand with ID ${adjustDto.brand_id} does not exist. Available brand IDs: ${await this.getAvailableBrandIds()}`
      );
    }

    // Get current stock
    let stock = await this.stockRepository.findOne({
      where: {
        brand_id: adjustDto.brand_id,
        size: adjustDto.size,
      },
    });

    const currentQuantity = stock ? stock.quantity : 0;
    const adjustmentQuantity = adjustDto.new_total_quantity - currentQuantity;

    // Create stock movement record for the adjustment
    const movement = this.movementsRepository.create({
      brand_id: adjustDto.brand_id,
      size: adjustDto.size,
      movement_type: MovementType.ADJUSTMENT,
      quantity: adjustmentQuantity, // This can be positive or negative
      defective_quantity: 0,
      notes: adjustDto.notes || `Stock adjustment: ${currentQuantity} → ${adjustDto.new_total_quantity}`,
    });

    const savedMovement = await this.movementsRepository.save(movement);

    // Update or create stock record
    if (stock) {
      stock.quantity = adjustDto.new_total_quantity;
      await this.stockRepository.save(stock);
    } else {
      // Create new stock record if it doesn't exist
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

  async reportDefect(defectDto: ReportDefectDto) {
    // Validate that the brand exists
    const brand = await this.brandRepository.findOne({
      where: { id: defectDto.brand_id }
    });

    if (!brand) {
      throw new BadRequestException(
        `Brand with ID ${defectDto.brand_id} does not exist. Available brand IDs: ${await this.getAvailableBrandIds()}`
      );
    }

    // Check if we have enough good stock to convert to defective
    const stock = await this.stockRepository.findOne({
      where: {
        brand_id: defectDto.brand_id,
        size: defectDto.size,
      },
    });

    if (!stock || stock.quantity < defectDto.defective_quantity) {
      throw new BadRequestException(
        `Insufficient good stock for ${brand.name} ${defectDto.size}. Available: ${stock?.quantity || 0}, Requested: ${defectDto.defective_quantity}`
      );
    }

    // Create defect movement record
    const notes = [
      defectDto.defect_reason && `Reason: ${defectDto.defect_reason}`,
      defectDto.action_taken && `Action: ${defectDto.action_taken}`,
      defectDto.notes
    ].filter(Boolean).join(' | ');

    const movement = this.movementsRepository.create({
      brand_id: defectDto.brand_id,
      size: defectDto.size,
      movement_type: MovementType.DEFECT,
      quantity: -defectDto.defective_quantity, // Negative to show reduction from good stock
      defective_quantity: defectDto.defective_quantity,
      notes: notes || 'Defective bottles reported',
    });

    const savedMovement = await this.movementsRepository.save(movement);

    // Update stock: reduce good quantity, increase defective quantity
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

  async recordSale(brandId: number, size: string, quantity: number, saleId: number) {
    // Create stock movement record for sale
    const movement = this.movementsRepository.create({
      brand_id: brandId,
      size: size,
      movement_type: MovementType.SALE,
      quantity: -quantity, // Negative for outgoing stock
      reference_id: saleId,
      notes: `Sale #${saleId}`,
    });

    return await this.movementsRepository.save(movement);
  }

  async getStockReport(reportDto: StockReportDto) {
    const { brand_id, start_date, end_date } = reportDto;
    
    // Use today as default if no date provided
    const reportDate = start_date || new Date().toISOString().split('T')[0];
    const startOfDay = new Date(reportDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reportDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get all brands and their possible sizes with prices set
    const brandQuery: any = {};
    if (brand_id) {
      brandQuery.id = brand_id;
    }
    
    const allBrands = await this.brandRepository.find({
      where: brandQuery,
      order: { name: 'ASC' },
    });

    // Get existing stock records for reference
    const stockQuery: any = {};
    if (brand_id) {
      stockQuery.brand_id = brand_id;
    }
    
    const existingStocks = await this.stockRepository.find({
      where: stockQuery,
      relations: ['brand'],
      order: { brand: { name: 'ASC' }, size: 'ASC' },
    });

    // Create a map of existing stock for quick lookup
    const stockMap = new Map();
    existingStocks.forEach(stock => {
      const key = `${stock.brand_id}-${stock.size}`;
      stockMap.set(key, stock);
    });

    // Get movements for the specified date
    let movements = await this.movementsRepository.find({
      where: stockQuery,
      relations: ['brand'],
      order: { created_at: 'ASC' },
    });

    // Filter movements by date
    const todaysMovements = movements.filter(movement => {
      const movementDate = new Date(movement.created_at);
      return movementDate >= startOfDay && movementDate <= endOfDay;
    });

    // Calculate opening balance (stock at beginning of the day)
    // This requires getting all movements BEFORE the report date
    const previousMovements = movements.filter(movement => {
      const movementDate = new Date(movement.created_at);
      return movementDate < startOfDay;
    });

    // Group by brand and size to calculate comprehensive report
    const reportMap = new Map();

    // Initialize report entries for all brand-size combinations with prices set
    allBrands.forEach(brand => {
      // Define all possible sizes and their corresponding price fields
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

      // Only include brand-size combinations where price is set (not null)
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
            opening_balance: 0, // Will calculate after processing today's movements
            received_today: 0,
            total_stock: existingStock ? existingStock.quantity : 0, // Use existing stock or 0
            closed_balance: 0, // Will calculate as total_stock - sales_quantity
            sales_quantity: 0,
            defective_quantity: existingStock ? (existingStock.defective_quantity || 0) : 0,
            rate: unitPrice, // Cost per bottle from brand price
            sales_amount: 0, // Will calculate below
            movements: [],
          });
        }
      });
    });

    // Opening balance will be calculated at the end based on current stock 
    // and today's net business movements, not from historical movement reconstruction

    // First pass: Calculate opening balance for each stock item
    // Opening balance = what the stock was at the start of the day
    // We need to calculate this BEFORE processing today's movements
    
    for (const [key, report] of reportMap) {
      // Get all movements for this brand/size combination before today
      const previousMovements = movements.filter(movement => {
        const movementDate = new Date(movement.created_at);
        return movementDate < startOfDay && 
               movement.brand_id === report.brand_id && 
               movement.size === report.size;
      });
      
      // Calculate opening balance from previous movements
      let openingBalance = 0;
      previousMovements.forEach(movement => {
        if (movement.movement_type === MovementType.RECEIPT || 
            movement.movement_type === MovementType.ADJUSTMENT) {
          openingBalance += movement.quantity;
        } else if (movement.movement_type === MovementType.SALE) {
          openingBalance += movement.quantity; // Already negative in database
        } else if (movement.movement_type === MovementType.DEFECT) {
          openingBalance += movement.quantity; // Already negative in database
        }
      });
      
      report.opening_balance = Math.max(0, openingBalance);
    }

    // Second pass: Process today's movements
    todaysMovements.forEach(movement => {
      const key = `${movement.brand_id}-${movement.size}`;
      
      // Skip movements for brand-size combinations not in our report
      // (these would be for brands/sizes without prices set)
      if (!reportMap.has(key)) {
        return;
      }

      const report = reportMap.get(key);
      
      // Add movement to details
      report.movements.push({
        date: movement.created_at,
        type: movement.movement_type,
        quantity: movement.quantity,
        defective_quantity: movement.defective_quantity,
        notes: movement.notes,
        unit_cost: movement.unit_cost,
      });

      // Calculate today's transactions based on movement types
      if (movement.movement_type === MovementType.RECEIPT || 
          movement.movement_type === MovementType.ADJUSTMENT) {
        // Both receipts and adjustments affect "received today"
        // This matches user requirement where adjustments change the "received today" value
        report.received_today += movement.quantity;
      } else if (movement.movement_type === MovementType.SALE) {
        const saleQuantity = Math.abs(movement.quantity);
        report.sales_quantity += saleQuantity;
        // Don't calculate sales_amount here - will be calculated from actual sales data
      } else if (movement.movement_type === MovementType.DEFECT) {
        // Defective quantities are already tracked in stock table
        // Defects reduce good stock but don't count as sales
      }
    });

    // Get actual sales amounts from sales table for the report date
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

    // Create a map for quick lookup of actual sales amounts
    const salesAmountMap = new Map();
    salesData.forEach(sale => {
      const key = `${sale.brand_id}-${sale.size}`;
      salesAmountMap.set(key, parseFloat(sale.actual_sales_amount) || 0);
    });

    // Calculate sales amounts properly for both actual sales and manual entries
    for (const [key, report] of reportMap) {
      // Get actual sales amount from sales table (this represents real POS transactions)
      const actualSalesAmount = salesAmountMap.get(key) || 0;
      
      // Get sales movements for this brand/size to understand the breakdown
      const todaysSalesMovements = todaysMovements.filter(m => 
        m.brand_id === report.brand_id && 
        m.size === report.size && 
        m.movement_type === MovementType.SALE
      );
      
      // Count actual sales quantity (from POS system via sales table)
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
      
      // Calculate sales amount:
      // 1. Use actual sales amount for POS transactions
      // 2. Calculate manual sales amount using current brand prices
      const manualSalesAmount = manualSalesQuantity > 0 ? manualSalesQuantity * report.rate : 0;
      report.sales_amount = actualSalesAmount + manualSalesAmount;
      
      // Calculate closed balance using proper stock accounting formula:
      // Closing Balance = Opening Balance + Received Today - Sales Quantity
      report.closed_balance = report.opening_balance + report.received_today - report.sales_quantity;
      
      // Ensure values are not negative
      if (report.opening_balance < 0) {
        report.opening_balance = 0;
      }
      if (report.total_stock < 0) {
        report.total_stock = 0;
      }
      if (report.closed_balance < 0) {
        report.closed_balance = 0;
      }
      
      // Validation: Check if the formula balances
      // Opening + Received - Sales should equal Closing
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

  async getMovementsByBrand(brandId: number) {
    return await this.movementsRepository.find({
      where: { brand_id: brandId },
      relations: ['brand'],
      order: { created_at: 'DESC' },
    });
  }

  private async getAvailableBrandIds(): Promise<string> {
    const brands = await this.brandRepository.find({ select: ['id', 'name'] });
    return brands.map(brand => `${brand.id} (${brand.name})`).join(', ');
  }

  async manualStockEntry(entryDto: ManualStockEntryDto) {
    // Validate that the brand exists
    const brand = await this.brandRepository.findOne({
      where: { id: entryDto.brand_id }
    });

    if (!brand) {
      throw new BadRequestException(
        `Brand with ID ${entryDto.brand_id} does not exist. Available brand IDs: ${await this.getAvailableBrandIds()}`
      );
    }

    // Get or create stock record
    let stock = await this.stockRepository.findOne({
      where: {
        brand_id: entryDto.brand_id,
        size: entryDto.size,
      },
    });

    if (!stock) {
      // Create new stock record
      stock = this.stockRepository.create({
        brand_id: entryDto.brand_id,
        size: entryDto.size,
        quantity: 0,
        defective_quantity: 0,
      });
      await this.stockRepository.save(stock);
    }

    // Define date boundaries for the entry date
    const entryDate = new Date(entryDto.date);
    const startOfDay = new Date(entryDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(entryDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find existing manual entries for the same day, brand, and size
    const existingMovements = await this.movementsRepository.find({
      where: {
        brand_id: entryDto.brand_id,
        size: entryDto.size,
        created_at: Between(startOfDay, endOfDay),
        notes: Like('Manual entry%'), // Only get manual entries
      },
      order: { created_at: 'DESC' },
    });

    // Separate existing receipt and sale movements
    const existingReceipt = existingMovements.find(m => m.movement_type === MovementType.RECEIPT);
    const existingSale = existingMovements.find(m => m.movement_type === MovementType.SALE);

    // Calculate the net effect of existing manual entries to reverse them
    let existingReceiptQty = 0;
    let existingSalesQty = 0;

    if (existingReceipt) {
      existingReceiptQty = existingReceipt.quantity;
    }
    if (existingSale) {
      existingSalesQty = Math.abs(existingSale.quantity); // Convert back to positive
    }

    // Calculate what the stock was before any manual entries today
    const stockBeforeManualEntries = stock.quantity - existingReceiptQty + existingSalesQty;

    // Delete existing manual entries for this day to avoid duplicates
    if (existingMovements.length > 0) {
      await this.movementsRepository.remove(existingMovements);
    }

    // Create new movements with the updated values
    const movements = [];

    // Create receipt movement if received_today > 0
    if (entryDto.received_today > 0) {
      const receiptMovement = this.movementsRepository.create({
        brand_id: entryDto.brand_id,
        size: entryDto.size,
        movement_type: MovementType.RECEIPT,
        quantity: entryDto.received_today,
        defective_quantity: 0,
        notes: `Manual entry - Received: ${entryDto.received_today} on ${entryDto.date}. ${entryDto.notes || ''}`.trim(),
        created_at: new Date(`${entryDto.date}T23:59:00`), // Set to end of day
      });
      movements.push(await this.movementsRepository.save(receiptMovement));
    }

    // Create sale movement if sales_quantity > 0
    if (entryDto.sales_quantity > 0) {
      const saleMovement = this.movementsRepository.create({
        brand_id: entryDto.brand_id,
        size: entryDto.size,
        movement_type: MovementType.SALE,
        quantity: -entryDto.sales_quantity, // Negative for outgoing
        defective_quantity: 0,
        notes: `Manual entry - Sold: ${entryDto.sales_quantity} on ${entryDto.date}. ${entryDto.notes || ''}`.trim(),
        created_at: new Date(`${entryDto.date}T23:59:00`), // Set to end of day
      });
      movements.push(await this.movementsRepository.save(saleMovement));
    }

    // Calculate new stock quantity based on pre-manual stock + new values
    const newQuantity = stockBeforeManualEntries + entryDto.received_today - entryDto.sales_quantity;
    
    // Ensure quantity doesn't go negative
    if (newQuantity < 0) {
      throw new BadRequestException(
        `Insufficient stock: Available stock before manual entries is ${stockBeforeManualEntries}, but you're trying to sell ${entryDto.sales_quantity}. Available after receiving ${entryDto.received_today}: ${stockBeforeManualEntries + entryDto.received_today}`
      );
    }

    // Update stock with the new calculated quantity
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

  private getUnitPrice(brand: any, size: string): number {
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
}