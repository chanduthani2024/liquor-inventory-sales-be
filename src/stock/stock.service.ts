import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { BrandsService } from '../brands/brands.service';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    private brandsService: BrandsService,
  ) {}

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    // Verify brand exists
    await this.brandsService.findOne(createStockDto.brand_id);
    
    // Check if stock already exists for this brand and size
    const existingStock = await this.stockRepository.findOne({
      where: {
        brand_id: createStockDto.brand_id,
        size: createStockDto.size,
      },
    });

    if (existingStock) {
      throw new BadRequestException('Stock already exists for this brand and size. Use update instead.');
    }

    const stock = this.stockRepository.create(createStockDto);
    return await this.stockRepository.save(stock);
  }

  async findAll(): Promise<Stock[]> {
    return await this.stockRepository.find({
      relations: ['brand'],
      order: { 
        brand: { name: 'ASC' },
        size: 'ASC' 
      },
    });
  }

  async findByBrand(brandId: number): Promise<Stock[]> {
    await this.brandsService.findOne(brandId); // Verify brand exists
    return await this.stockRepository.find({
      where: { brand_id: brandId },
      relations: ['brand'],
      order: { size: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Stock> {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: ['brand'],
    });
    
    if (!stock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }
    
    return stock;
  }

  async findByBrandAndSize(brandId: number, size: string): Promise<Stock | null> {
    return await this.stockRepository.findOne({
      where: { brand_id: brandId, size },
      relations: ['brand'],
    });
  }

  async update(id: number, updateStockDto: UpdateStockDto): Promise<Stock> {
    const stock = await this.findOne(id);
    
    if (updateStockDto.brand_id && updateStockDto.brand_id !== stock.brand_id) {
      await this.brandsService.findOne(updateStockDto.brand_id);
    }
    
    Object.assign(stock, updateStockDto);
    return await this.stockRepository.save(stock);
  }

  async updateQuantity(brandId: number, size: string, quantityChange: number): Promise<Stock> {
    let stock = await this.findByBrandAndSize(brandId, size);
    
    if (!stock) {
      // Create new stock entry if it doesn't exist
      stock = await this.create({
        brand_id: brandId,
        size,
        quantity: Math.max(0, quantityChange),
      });
    } else {
      stock.quantity = Math.max(0, stock.quantity + quantityChange);
      stock = await this.stockRepository.save(stock);
    }
    
    return stock;
  }

  async remove(id: number): Promise<void> {
    const stock = await this.findOne(id);
    await this.stockRepository.remove(stock);
  }

  async getTotalStockValue(): Promise<number> {
    const stocks = await this.findAll();
    let totalValue = 0;

    for (const stock of stocks) {
      const price = await this.brandsService.getPriceForSize(stock.brand_id, stock.size);
      totalValue += stock.quantity * price;
    }

    return totalValue;
  }

  async getStockValueByBrand(brandId: number): Promise<number> {
    const stocks = await this.findByBrand(brandId);
    let totalValue = 0;

    for (const stock of stocks) {
      const price = await this.brandsService.getPriceForSize(stock.brand_id, stock.size);
      totalValue += stock.quantity * price;
    }

    return totalValue;
  }
}