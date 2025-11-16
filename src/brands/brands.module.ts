import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brand } from './brand.entity';
import { BrandPriceHistory } from './brand-price-history.entity';
import { SaleItem } from '../sales/sale-item.entity';
import { Sale } from '../sales/sale.entity';
import { StockMovementsModule } from '../stock-movements/stock-movements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, BrandPriceHistory, SaleItem, Sale]),
    forwardRef(() => StockMovementsModule),
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}