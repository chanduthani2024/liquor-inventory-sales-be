import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Query, Req } from '@nestjs/common';
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
  async update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto, @Req() req: any) {
    // Extract user ID from request (assuming JWT auth provides user info)
    const userId = req.user?.id;
    const brand = await this.brandsService.update(+id, updateBrandDto, userId);
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

  @Get('price-history/all')
  async getAllPriceHistory(
    @Query('brandId') brandId?: string,
    @Query('size') size?: string,
    @Query('limit') limit?: string
  ) {
    const history = await this.brandsService.getPriceHistory(
      brandId ? +brandId : undefined,
      size,
      limit ? +limit : 50
    );
    return {
      success: true,
      data: history
    };
  }

  @Get(':id/price-history')
  async getBrandPriceHistory(
    @Param('id') id: string,
    @Query('size') size?: string
  ) {
    const history = await this.brandsService.getBrandPriceHistory(+id, size);
    return {
      success: true,
      data: history
    };
  }

  @Get('profit-report/daily')
  async getDailyProfitReport(
    @Query('date') date?: string,
    @Query('brandId') brandId?: string
  ) {
    const report = await this.brandsService.getDailyProfitReport(date, brandId ? +brandId : undefined);
    return {
      success: true,
      data: report
    };
  }

  @Get('profit-report/summary')
  async getProfitSummary(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('brandId') brandId?: string
  ) {
    const summary = await this.brandsService.getProfitSummary(startDate, endDate, brandId ? +brandId : undefined);
    return {
      success: true,
      data: summary
    };
  }
}