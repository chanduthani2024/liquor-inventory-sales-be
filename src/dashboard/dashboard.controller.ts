import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboardData(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
    
    console.log('Dashboard dates:', { start, end, originalEndDate: endDate });
    
    return this.dashboardService.getDashboardData(start, end);
  }

  private getEndOfDay(date: Date): Date {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }

  @Get('revenue-by-date')
  getRevenueByDate(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.dashboardService.getRevenueByDate(new Date(startDate), this.getEndOfDay(new Date(endDate)));
  }

  @Get('low-stock')
  getLowStockItems(@Query('threshold') threshold?: string) {
    const thresholdNumber = threshold ? parseInt(threshold) : 10;
    return this.dashboardService.getLowStockItems(thresholdNumber);
  }

  @Get('brand-performance')
  getBrandPerformance(
    @Query('brandId') brandId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const brand = brandId ? parseInt(brandId) : undefined;
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? this.getEndOfDay(new Date(endDate)) : undefined;
    return this.dashboardService.getBrandPerformance(brand, start, end);
  }
}