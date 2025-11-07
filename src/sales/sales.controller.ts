import { Controller, Get, Post, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSaleDto: CreateSaleDto) {
    const sale = await this.salesService.create(createSaleDto);
    return {
      success: true,
      message: `Sale recorded successfully! Payment method: ${sale.payment_method}`,
      data: sale,
    };
  }

  @Get()
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (startDate && endDate) {
      return this.salesService.findByDateRange(new Date(startDate), this.getEndOfDay(new Date(endDate)));
    }
    return this.salesService.findAll();
  }

  @Get('revenue')
  getTotalRevenue(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
    return this.salesService.getTotalRevenue(start, end);
  }

  @Get('by-brand')
  getSalesByBrand(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
    return this.salesService.getSalesByBrand(start, end);
  }

  @Get('top-brands')
  getTopSellingBrands(
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const limitNumber = limit ? parseInt(limit) : 10;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
    return this.salesService.getTopSellingBrands(limitNumber, start, end);
  }

  @Get('payment-summary')
  getSalesByPaymentMethod(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
    return this.salesService.getSalesByPaymentMethod(start, end);
  }

  private getEndOfDay(date: Date): Date {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }
}