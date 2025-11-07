import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBrandDto: CreateBrandDto) {
    const brand = await this.brandsService.create(createBrandDto);
    return {
      success: true,
      message: 'Brand created successfully',
      data: brand
    };
  }

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandsService.update(+id, updateBrandDto);
    return {
      success: true,
      message: 'Brand updated successfully',
      data: brand
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.brandsService.remove(+id);
    return {
      success: true,
      message: 'Brand deleted successfully'
    };
  }

  @Get('by-alcohol-type/:alcoholTypeId')
  findByAlcoholType(@Param('alcoholTypeId') alcoholTypeId: string) {
    return this.brandsService.findByAlcoholType(+alcoholTypeId);
  }

  @Get(':id/price/:size')
  getPriceForSize(@Param('id') id: string, @Param('size') size: string) {
    return this.brandsService.getPriceForSize(+id, size);
  }
}