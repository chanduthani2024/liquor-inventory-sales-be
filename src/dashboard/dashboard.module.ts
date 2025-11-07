import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SalesModule } from '../sales/sales.module';
import { StockModule } from '../stock/stock.module';
import { BrandsModule } from '../brands/brands.module';
import { StockMovementsModule } from '../stock-movements/stock-movements.module';

@Module({
  imports: [SalesModule, StockModule, BrandsModule, StockMovementsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}