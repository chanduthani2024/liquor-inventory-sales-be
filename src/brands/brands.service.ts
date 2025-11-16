import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Brand } from './brand.entity';
import { BrandPriceHistory } from './brand-price-history.entity';
import { SaleItem } from '../sales/sale-item.entity';
import { Sale } from '../sales/sale.entity';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
    @InjectRepository(BrandPriceHistory)
    private brandPriceHistoryRepository: Repository<BrandPriceHistory>,
    @InjectRepository(SaleItem)
    private saleItemRepository: Repository<SaleItem>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @Inject(forwardRef(() => StockMovementsService))
    private stockMovementsService: StockMovementsService,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brand = this.brandsRepository.create(createBrandDto);
    return await this.brandsRepository.save(brand);
  }

  async findAll(): Promise<Brand[]> {
    return await this.brandsRepository.find({
      relations: ['stocks', 'alcoholType'],
      order: { name: 'ASC' },
    });
  }

  async findByAlcoholType(alcoholTypeId: number): Promise<Brand[]> {
    return await this.brandsRepository.find({
      where: { alcohol_type_id: alcoholTypeId },
      relations: ['stocks', 'alcoholType'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandsRepository.findOne({
      where: { id },
      relations: ['stocks', 'alcoholType'],
    });
    
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, userId?: number): Promise<Brand> {
    const brand = await this.findOne(id);
    
    // Track price changes before updating
    await this.trackPriceChanges(brand, updateBrandDto, userId);
    
    Object.assign(brand, updateBrandDto);
    return await this.brandsRepository.save(brand);
  }

  private async trackPriceChanges(
    existingBrand: Brand, 
    updateDto: UpdateBrandDto, 
    userId?: number
  ): Promise<void> {
    // Selling prices (regular prices)
    const sellingPriceFields = [
      { field: 'price_90ml', size: '90ml', type: 'Selling' },
      { field: 'price_180ml', size: '180ml', type: 'Selling' },
      { field: 'price_330ml', size: '330ml', type: 'Selling' },
      { field: 'price_375ml', size: '375ml', type: 'Selling' },
      { field: 'price_500ml', size: '500ml', type: 'Selling' },
      { field: 'price_650ml', size: '650ml', type: 'Selling' },
      { field: 'price_750ml', size: '750ml', type: 'Selling' },
      { field: 'price_1l', size: '1L', type: 'Selling' },
      { field: 'price_2l', size: '2L', type: 'Selling' },
    ];

    // Cost prices (actual prices - what owner pays to supplier)
    const costPriceFields = [
      { field: 'actual_price_90ml', size: '90ml', type: 'Cost' },
      { field: 'actual_price_180ml', size: '180ml', type: 'Cost' },
      { field: 'actual_price_330ml', size: '330ml', type: 'Cost' },
      { field: 'actual_price_375ml', size: '375ml', type: 'Cost' },
      { field: 'actual_price_500ml', size: '500ml', type: 'Cost' },
      { field: 'actual_price_650ml', size: '650ml', type: 'Cost' },
      { field: 'actual_price_750ml', size: '750ml', type: 'Cost' },
      { field: 'actual_price_1l', size: '1L', type: 'Cost' },
      { field: 'actual_price_2l', size: '2L', type: 'Cost' },
    ];

    // Combine both types of price fields
    const allPriceFields = [...sellingPriceFields, ...costPriceFields];

    for (const { field, size, type } of allPriceFields) {
      const oldPrice = existingBrand[field];
      const newPrice = updateDto[field];

      // Only track if the price actually changed
      if (newPrice !== undefined && oldPrice !== newPrice) {
        const priceHistory = this.brandPriceHistoryRepository.create({
          brand_id: existingBrand.id,
          size: size,
          old_price: oldPrice,
          new_price: newPrice,
          changed_by: userId || null,
          notes: `${type} Price updated from ${oldPrice ? '₹' + oldPrice : 'unset'} to ${newPrice ? '₹' + newPrice : 'unset'}`,
        });

        await this.brandPriceHistoryRepository.save(priceHistory);
      }
    }
  }

  async remove(id: number): Promise<void> {
    const brand = await this.findOne(id);
    await this.brandsRepository.remove(brand);
  }

  async getPriceForSize(brandId: number, size: string): Promise<number | null> {
    const brand = await this.findOne(brandId);
    
    let price: number | null;
    switch (size) {
      case '90ml':
        price = brand.price_90ml;
        break;
      case '180ml':
        price = brand.price_180ml;
        break;
      case '330ml':
        price = brand.price_330ml;
        break;
      case '375ml':
        price = brand.price_375ml;
        break;
      case '500ml':
        price = brand.price_500ml;
        break;
      case '650ml':
        price = brand.price_650ml;
        break;
      case '750ml':
        price = brand.price_750ml;
        break;
      case '1L':
        price = brand.price_1l;
        break;
      case '2L':
        price = brand.price_2l;
        break;
      default:
        throw new NotFoundException(`Size ${size} not found for brand`);
    }
    
    if (price === null) {
      throw new NotFoundException(`Price for size ${size} is not set for brand ${brand.name}`);
    }
    
    return price;
  }

  async getPriceHistory(brandId?: number, size?: string, limit: number = 50): Promise<BrandPriceHistory[]> {
    const queryBuilder = this.brandPriceHistoryRepository.createQueryBuilder('history')
      .leftJoinAndSelect('history.brand', 'brand')
      .leftJoinAndSelect('history.user', 'user')
      .orderBy('history.changed_at', 'DESC')
      .limit(limit);

    if (brandId) {
      queryBuilder.andWhere('history.brand_id = :brandId', { brandId });
    }

    if (size) {
      queryBuilder.andWhere('history.size = :size', { size });
    }

    return await queryBuilder.getMany();
  }

  async getBrandPriceHistory(brandId: number, size?: string): Promise<BrandPriceHistory[]> {
    // Verify brand exists
    await this.findOne(brandId);
    
    return await this.getPriceHistory(brandId, size);
  }

  async getDailyProfitReport(date?: string, brandId?: number) {
    const reportDate = date || new Date().toISOString().split('T')[0];
    const startOfDay = new Date(reportDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reportDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all sales for the specified date
    const queryBuilder = this.saleItemRepository
      .createQueryBuilder('saleItem')
      .leftJoinAndSelect('saleItem.sale', 'sale')
      .leftJoinAndSelect('saleItem.brand', 'brand')
      .where('sale.created_at BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay });

    if (brandId) {
      queryBuilder.andWhere('saleItem.brand_id = :brandId', { brandId });
    }

    const salesItems = await queryBuilder.getMany();

    console.log('🔍 DAILY PROFIT REPORT DEBUG 🔍');
    console.log(`Report Date: ${reportDate}`);
    console.log(`Start of Day: ${startOfDay}`);
    console.log(`End of Day: ${endOfDay}`);
    console.log(`Brand ID Filter: ${brandId || 'All brands'}`);
    console.log(`Found ${salesItems.length} sale items`);
    
    if (salesItems.length > 0) {
      console.log('First sale item details:', {
        sale_id: salesItems[0].sale_id,
        brand_name: salesItems[0].brand?.name,
        size: salesItems[0].size,
        quantity: salesItems[0].quantity,
        unit_price: salesItems[0].unit_price,
        total_price: salesItems[0].total_price,
        sale_date: salesItems[0].sale?.created_at
      });
    }

    // Calculate profit for each sale item
    const profitReport = salesItems.map(saleItem => {
      const actualPrice = this.getActualPrice(saleItem.brand, saleItem.size);
      const sellingPrice = saleItem.unit_price;
      const profitPerUnit = actualPrice ? sellingPrice - actualPrice : 0;
      const totalProfit = profitPerUnit * saleItem.quantity;

      // Debug console logging for profit calculation
      console.log('=== PROFIT CALCULATION DEBUG ===');
      console.log(`Sale ID: ${saleItem.sale_id}`);
      console.log(`Brand: ${saleItem.brand.name}`);
      console.log(`Size: ${saleItem.size}`);
      console.log(`Quantity: ${saleItem.quantity}`);
      console.log(`Selling Price: ₹${sellingPrice}`);
      console.log(`Actual Price: ₹${actualPrice}`);
      console.log(`Profit Per Unit: ₹${profitPerUnit}`);
      console.log(`Total Profit: ₹${totalProfit}`);
      console.log('Brand actual prices object:', {
        actual_price_90ml: saleItem.brand.actual_price_90ml,
        actual_price_180ml: saleItem.brand.actual_price_180ml,
        actual_price_330ml: saleItem.brand.actual_price_330ml,
        actual_price_375ml: saleItem.brand.actual_price_375ml,
        actual_price_500ml: saleItem.brand.actual_price_500ml,
        actual_price_650ml: saleItem.brand.actual_price_650ml,
        actual_price_750ml: saleItem.brand.actual_price_750ml,
        actual_price_1l: saleItem.brand.actual_price_1l,
        actual_price_2l: saleItem.brand.actual_price_2l,
      });
      console.log('================================');

      return {
        sale_id: saleItem.sale_id,
        brand_name: saleItem.brand.name,
        size: saleItem.size,
        quantity: saleItem.quantity,
        selling_price: sellingPrice,
        actual_price: actualPrice,
        profit_per_unit: profitPerUnit,
        total_profit: totalProfit,
        sale_date: saleItem.sale.created_at,
      };
    });

    // Calculate summary
    const totalSales = salesItems.reduce((sum, item) => sum + item.total_price, 0);
    const totalProfit = profitReport.reduce((sum, item) => sum + item.total_profit, 0);
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    return {
      date: reportDate,
      summary: {
        total_sales: totalSales,
        total_profit: totalProfit,
        profit_margin: profitMargin,
        items_sold: salesItems.reduce((sum, item) => sum + item.quantity, 0),
      },
      details: profitReport,
    };
  }

  async getProfitSummary(startDate?: string, endDate?: string, brandId?: number) {
    console.log('🟡 [getProfitSummary - STOCK MOVEMENTS] CALLED WITH PARAMETERS:');
    console.log('   startDate parameter:', startDate, '(type:', typeof startDate, ')');
    console.log('   endDate parameter:', endDate, '(type:', typeof endDate, ')');
    console.log('   brandId parameter:', brandId);
    
    // Fix: When no dates provided, default to TODAY (not last 30 days)
    // This matches the behavior of other dashboard methods
    let start: Date;
    let end: Date;
    
    if (!startDate || !endDate) {
      // Default to today's range - same as dashboard service
      const today = new Date();
      start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      console.log('🟡 [getProfitSummary] Using TODAY as default (no dates provided)');
    } else {
      // FIX: Parse dates as local timezone, not UTC
      // Split the date string and construct Date object with local timezone
      const startParts = startDate.split('-').map(Number);
      const endParts = endDate.split('-').map(Number);
      
      start = new Date(startParts[0], startParts[1] - 1, startParts[2], 0, 0, 0, 0);
      end = new Date(endParts[0], endParts[1] - 1, endParts[2], 23, 59, 59, 999);
      
      console.log('🟡 [getProfitSummary] Using PROVIDED date range');
      console.log('🟡 [getProfitSummary] Date parsing fix applied:');
      console.log('   startDate string:', startDate, '-> Date object:', start);
      console.log('   endDate string:', endDate, '-> Date object:', end);
    }
    
    console.log('🟡 [getProfitSummary] COMPUTED DATE RANGE:');
    console.log('   Computed start:', start);
    console.log('   Computed end:', end);
    
    // NEW APPROACH: Use stock movements service like totalRevenue does
    return await this.getProfitSummaryFromStockMovements(start, end, brandId);

    // OLD APPROACH (COMMENTED OUT): Using sale_items table
    // This was incorrect because it doesn't include manual stock entries
    // The correct approach is to use stock_movements data like totalRevenue does
    
    // const queryBuilder = this.saleItemRepository
    //   .createQueryBuilder('saleItem')
    //   .leftJoinAndSelect('saleItem.sale', 'sale')
    //   .leftJoinAndSelect('saleItem.brand', 'brand')
    //   .where('sale.created_at BETWEEN :start AND :end', { start, end });

    // if (brandId) {
    //   queryBuilder.andWhere('saleItem.brand_id = :brandId', { brandId });
    // }

    // const salesItems = await queryBuilder.getMany();
    // ... (rest of old logic commented out)
    
    // END OF OLD APPROACH - Now using stock movements approach like totalRevenue
  }

  private async getProfitSummaryFromStockMovements(start: Date, end: Date, brandId?: number) {
    console.log('🟢 [getProfitSummaryFromStockMovements] Starting profit calculation');
    console.log('   Date range:', start, 'to', end);

    let totalSales = 0;
    let totalProfit = 0;
    const brandProfits = new Map();

    // Handle single day vs date range (same logic as dashboard service)
    if (this.isSameDay(start, end)) {
      // Single day - use stock report method
      // FIX: Don't use toISOString() as it converts to UTC
      // Extract date components from local date object
      const year = start.getFullYear();
      const month = String(start.getMonth() + 1).padStart(2, '0');
      const day = String(start.getDate()).padStart(2, '0');
      const reportDate = `${year}-${month}-${day}`;
      
      console.log(`🟢 [SINGLE DAY] Requesting stock report for date: ${reportDate}`);
      console.log(`🟢 [SINGLE DAY] Original start date object: ${start}`);
      console.log(`🟢 [SINGLE DAY] Extracted components: year=${year}, month=${month}, day=${day}`);
      
      const stockReports = await this.stockMovementsService.getStockReport({
        start_date: reportDate,
        end_date: reportDate,
        brand_id: brandId,
      });
      
      console.log(`🟢 Found ${stockReports.length} stock reports for ${reportDate}`);
      if (stockReports.length > 0) {
        console.log(`🟢 First report sample:`, {
          brand_name: stockReports[0].brand_name,
          size: stockReports[0].size,
          sales_quantity: stockReports[0].sales_quantity,
          sales_amount: stockReports[0].sales_amount,
          date: stockReports[0].date
        });
      }
      
      // Calculate profit for each stock report entry
      for (let index = 0; index < stockReports.length; index++) {
        const report = stockReports[index];
        const salesAmount = report.sales_amount || 0;
        const salesQuantity = report.sales_quantity || 0;
        
        if (salesQuantity > 0) {
          const sellingPricePerUnit = salesAmount / salesQuantity;
          const actualPrice = await this.getActualPriceForSize(report.brand_name, report.size);
          const profitPerUnit = actualPrice ? sellingPricePerUnit - actualPrice : 0;
          const totalProfitForItem = profitPerUnit * salesQuantity;

          console.log(`🟢 Item ${index + 1}: ${report.brand_name} ${report.size}`);
          console.log(`   Sales Qty: ${salesQuantity}, Sales Amount: ₹${salesAmount}`);
          console.log(`   Selling Price/Unit: ₹${sellingPricePerUnit}, Actual Price: ₹${actualPrice}`);
          console.log(`   Profit/Unit: ₹${profitPerUnit}, Total Profit: ₹${totalProfitForItem}`);

          totalSales += salesAmount;
          totalProfit += totalProfitForItem;

          // Track by brand
          const brandKey = `${report.brand_name}-${report.size}`;
          if (!brandProfits.has(brandKey)) {
            brandProfits.set(brandKey, {
              brand_name: report.brand_name,
              size: report.size,
              total_quantity: 0,
              total_sales: 0,
              total_profit: 0,
              profit_margin: 0,
            });
          }

          const brandData = brandProfits.get(brandKey);
          brandData.total_quantity += salesQuantity;
          brandData.total_sales += salesAmount;
          brandData.total_profit += totalProfitForItem;
          brandData.profit_margin = brandData.total_sales > 0 ? (brandData.total_profit / brandData.total_sales) * 100 : 0;
        }
      }
    } else {
      // Date range - iterate through each day
      const currentDate = new Date(start);
      while (currentDate <= end) {
        // FIX: Don't use toISOString() as it converts to UTC
        // Extract date components from local date object
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const reportDate = `${year}-${month}-${day}`;
        const stockReports = await this.stockMovementsService.getStockReport({
          start_date: reportDate,
          end_date: reportDate,
          brand_id: brandId,
        });
        
        // Same calculation logic as single day
        for (const report of stockReports) {
          const salesAmount = report.sales_amount || 0;
          const salesQuantity = report.sales_quantity || 0;
          
          if (salesQuantity > 0) {
            const sellingPricePerUnit = salesAmount / salesQuantity;
            const actualPrice = await this.getActualPriceForSize(report.brand_name, report.size);
            const profitPerUnit = actualPrice ? sellingPricePerUnit - actualPrice : 0;
            const totalProfitForItem = profitPerUnit * salesQuantity;

            totalSales += salesAmount;
            totalProfit += totalProfitForItem;

            // Track by brand
            const brandKey = `${report.brand_name}-${report.size}`;
            if (!brandProfits.has(brandKey)) {
              brandProfits.set(brandKey, {
                brand_name: report.brand_name,
                size: report.size,
                total_quantity: 0,
                total_sales: 0,
                total_profit: 0,
                profit_margin: 0,
              });
            }

            const brandData = brandProfits.get(brandKey);
            brandData.total_quantity += salesQuantity;
            brandData.total_sales += salesAmount;
            brandData.total_profit += totalProfitForItem;
            brandData.profit_margin = brandData.total_sales > 0 ? (brandData.total_profit / brandData.total_sales) * 100 : 0;
          }
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
    const itemsSold = Array.from(brandProfits.values()).reduce((sum, brand) => sum + brand.total_quantity, 0);

    console.log('🟢 [STOCK MOVEMENTS] FINAL PROFIT SUMMARY RESULTS:');
    console.log(`   Total Sales: ₹${totalSales}`);
    console.log(`   Total Profit: ₹${totalProfit}`);
    console.log(`   Profit Margin: ${profitMargin.toFixed(2)}%`);
    console.log(`   Items Sold: ${itemsSold}`);
    console.log(`   Brand Profits Map Size: ${brandProfits.size}`);
    console.log('==========================================');

    return {
      period: {
        start_date: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`,
        end_date: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`,
      },
      overall_summary: {
        total_sales: totalSales,
        total_profit: totalProfit,
        profit_margin: profitMargin,
        items_sold: itemsSold,
      },
      by_brand: Array.from(brandProfits.values()),
    };
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  private async getActualPriceForSize(brandName: string, size: string): Promise<number | null> {
    console.log(`>>> getActualPriceForSize called for Brand: '${brandName}', Size: '${size}'`);
    
    try {
      // Find the brand by name - use case insensitive search and trim whitespace
      const brand = await this.brandsRepository
        .createQueryBuilder('brand')
        .where('LOWER(TRIM(brand.name)) = LOWER(TRIM(:name))', { name: brandName })
        .getOne();
      
      if (!brand) {
        console.log(`>>> Brand '${brandName}' not found in database`);
        console.log(`>>> Searching for similar brand names...`);
        
        // Try to find similar brand names for debugging
        const allBrands = await this.brandsRepository.find({ select: ['id', 'name'] });
        const similarBrands = allBrands.filter(b => 
          b.name.toLowerCase().includes(brandName.toLowerCase()) || 
          brandName.toLowerCase().includes(b.name.toLowerCase())
        );
        
        console.log(`>>> Similar brands found:`, similarBrands.map(b => `${b.id}: "${b.name}"`));
        return null;
      }
      
      console.log(`>>> Found brand in database: ID=${brand.id}, Name="${brand.name}"`);
      
      // Use the existing getActualPrice method
      const actualPrice = this.getActualPrice(brand, size);
      console.log(`>>> Found actual price for ${brandName} ${size}: ₹${actualPrice}`);
      return actualPrice;
    } catch (error) {
      console.error(`>>> Error getting actual price for ${brandName} ${size}:`, error);
      return null;
    }
  }

  private getActualPrice(brand: Brand, size: string): number | null {
    console.log(`>>> getActualPrice called for Brand: ${brand.name}, Size: '${size}'`);
    
    switch (size) {
      case '90ml':
        console.log(`>>> Matched 90ml, returning: ${brand.actual_price_90ml}`);
        return brand.actual_price_90ml;
      case '180ml':
        console.log(`>>> Matched 180ml, returning: ${brand.actual_price_180ml}`);
        return brand.actual_price_180ml;
      case '330ml':
        console.log(`>>> Matched 330ml, returning: ${brand.actual_price_330ml}`);
        return brand.actual_price_330ml;
      case '375ml':
        console.log(`>>> Matched 375ml, returning: ${brand.actual_price_375ml}`);
        return brand.actual_price_375ml;
      case '500ml':
        console.log(`>>> Matched 500ml, returning: ${brand.actual_price_500ml}`);
        return brand.actual_price_500ml;
      case '650ml':
        console.log(`>>> Matched 650ml, returning: ${brand.actual_price_650ml}`);
        return brand.actual_price_650ml;
      case '750ml':
        console.log(`>>> Matched 750ml, returning: ${brand.actual_price_750ml}`);
        return brand.actual_price_750ml;
      case '1L':
      case '1l':
        console.log(`>>> Matched 1L, returning: ${brand.actual_price_1l}`);
        return brand.actual_price_1l;
      case '2L':
      case '2l':
        console.log(`>>> Matched 2L, returning: ${brand.actual_price_2l}`);
        return brand.actual_price_2l;
      default:
        console.log(`>>> NO MATCH for size '${size}', returning null`);
        return null;
    }
  }
}