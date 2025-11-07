import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { BrandsModule } from '../brands/brands.module';
import { StockModule } from '../stock/stock.module';
import { StockMovementsModule } from '../stock-movements/stock-movements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem]),
    BrandsModule,
    StockModule,
    forwardRef(() => StockMovementsModule),
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}