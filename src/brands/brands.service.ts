import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
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

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);
    Object.assign(brand, updateBrandDto);
    return await this.brandsRepository.save(brand);
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
}