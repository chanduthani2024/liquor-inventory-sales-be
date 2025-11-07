import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { BrandsService } from '../brands/brands.service';
import { StockService } from '../stock/stock.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    @InjectRepository(SaleItem)
    private saleItemsRepository: Repository<SaleItem>,
    private brandsService: BrandsService,
    private stockService: StockService,
    private stockMovementsService: StockMovementsService,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    // Validate all items and check stock availability
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of createSaleDto.items) {
      // Verify brand exists
      const brand = await this.brandsService.findOne(item.brand_id);
      
      // Check stock availability
      const stock = await this.stockService.findByBrandAndSize(item.brand_id, item.size);
      if (!stock || stock.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${brand.name} ${item.size}. Available: ${stock?.quantity || 0}, Requested: ${item.quantity}`
        );
      }

      // Get price for the size
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

    // Create the sale
    const sale = this.salesRepository.create({
      total_amount: totalAmount,
      payment_method: createSaleDto.payment_method || 'cash',
      items: validatedItems,
    });

    const savedSale = await this.salesRepository.save(sale);

    // Update stock quantities and record movements
    for (const item of createSaleDto.items) {
      await this.stockService.updateQuantity(item.brand_id, item.size, -item.quantity);
      // Record the sale movement
      await this.stockMovementsService.recordSale(item.brand_id, item.size, item.quantity, savedSale.id);
    }

    return await this.salesRepository.findOne({
      where: { id: savedSale.id },
      relations: ['items', 'items.brand'],
    });
  }

  async findAll(): Promise<Sale[]> {
    return await this.salesRepository.find({
      relations: ['items', 'items.brand'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: ['items', 'items.brand'],
    });
    
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    
    return sale;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return await this.salesRepository.find({
      where: {
        created_at: Between(startDate, endDate),
      },
      relations: ['items', 'items.brand'],
      order: { created_at: 'DESC' },
    });
  }

  async getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
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

  async getSalesByBrand(startDate?: Date, endDate?: Date): Promise<any[]> {
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

  async getTopSellingBrands(limit: number = 10, startDate?: Date, endDate?: Date): Promise<any[]> {
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

  async getSalesByPaymentMethod(startDate?: Date, endDate?: Date): Promise<{
    cash: { total: number; count: number };
    online: { total: number; count: number };
  }> {
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
}