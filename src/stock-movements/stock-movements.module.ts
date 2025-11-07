import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovementsService } from './stock-movements.service';
import { StockMovement } from './stock-movement.entity';
import { Stock } from '../stock/stock.entity';
import { Brand } from '../brands/brand.entity';
import { SaleItem } from '../sales/sale-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovement, Stock, Brand, SaleItem])],
  controllers: [StockMovementsController],
  providers: [StockMovementsService],
  exports: [StockMovementsService],
})
export class StockMovementsModule {}