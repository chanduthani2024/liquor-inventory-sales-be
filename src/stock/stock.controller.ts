import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createStockDto: CreateStockDto) {
    const stock = await this.stockService.create(createStockDto);
    return {
      success: true,
      message: 'Stock added successfully',
      data: stock
    };
  }

  @Get()
  findAll(@Query('brandId') brandId?: string) {
    if (brandId) {
      return this.stockService.findByBrand(+brandId);
    }
    return this.stockService.findAll();
  }

  @Get('total-value')
  getTotalStockValue() {
    return this.stockService.getTotalStockValue();
  }

  @Get('brand/:brandId/value')
  getStockValueByBrand(@Param('brandId') brandId: string) {
    return this.stockService.getStockValueByBrand(+brandId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    const stock = await this.stockService.update(+id, updateStockDto);
    return {
      success: true,
      message: 'Stock updated successfully',
      data: stock
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.stockService.remove(+id);
    return {
      success: true,
      message: 'Stock deleted successfully'
    };
  }
}