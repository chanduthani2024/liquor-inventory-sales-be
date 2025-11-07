import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlcoholType } from './alcohol-type.entity';
import { CreateAlcoholTypeDto, UpdateAlcoholTypeDto } from './dto/alcohol-type.dto';

@Injectable()
export class AlcoholTypesService {
  constructor(
    @InjectRepository(AlcoholType)
    private alcoholTypeRepository: Repository<AlcoholType>,
  ) {}

  async create(createDto: CreateAlcoholTypeDto): Promise<AlcoholType> {
    // Check if alcohol type with same name already exists
    const existingType = await this.alcoholTypeRepository.findOne({
      where: { name: createDto.name }
    });

    if (existingType) {
      throw new BadRequestException(`Alcohol type '${createDto.name}' already exists`);
    }

    const alcoholType = this.alcoholTypeRepository.create(createDto);
    return this.alcoholTypeRepository.save(alcoholType);
  }

  async findAll(): Promise<AlcoholType[]> {
    return this.alcoholTypeRepository.find({
      where: { is_active: true },
      order: { display_order: 'ASC', name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<AlcoholType> {
    const alcoholType = await this.alcoholTypeRepository.findOne({
      where: { id }
    });

    if (!alcoholType) {
      throw new NotFoundException(`Alcohol type with ID ${id} not found`);
    }

    return alcoholType;
  }

  async update(id: number, updateDto: UpdateAlcoholTypeDto): Promise<AlcoholType> {
    const alcoholType = await this.findOne(id);

    // Check for duplicate name if name is being updated
    if (updateDto.name && updateDto.name !== alcoholType.name) {
      const existingType = await this.alcoholTypeRepository.findOne({
        where: { name: updateDto.name }
      });

      if (existingType) {
        throw new BadRequestException(`Alcohol type '${updateDto.name}' already exists`);
      }
    }

    Object.assign(alcoholType, updateDto);
    return this.alcoholTypeRepository.save(alcoholType);
  }

  async remove(id: number): Promise<void> {
    const alcoholType = await this.findOne(id);
    
    // Soft delete by setting is_active to false
    alcoholType.is_active = false;
    await this.alcoholTypeRepository.save(alcoholType);
  }

  async initializeDefaultTypes(): Promise<void> {
    const defaultTypes = [
      { name: 'Vodka', description: 'Premium vodka brands', display_order: 1 },
      { name: 'Low Cost Whisky', description: 'Budget-friendly whisky options', display_order: 2 },
      { name: 'Mid Cost Whisky', description: 'Mid-range whisky brands', display_order: 3 },
      { name: 'High Cost Whisky', description: 'Premium whisky collection', display_order: 4 },
      { name: 'Beer', description: 'Beer and lager varieties', display_order: 5 },
      { name: 'Rum', description: 'Rum and dark spirits', display_order: 6 },
      { name: 'Wine', description: 'Wine and champagne', display_order: 7 },
    ];

    for (const typeData of defaultTypes) {
      const existing = await this.alcoholTypeRepository.findOne({
        where: { name: typeData.name }
      });

      if (!existing) {
        const alcoholType = this.alcoholTypeRepository.create(typeData);
        await this.alcoholTypeRepository.save(alcoholType);
      }
    }
  }
}