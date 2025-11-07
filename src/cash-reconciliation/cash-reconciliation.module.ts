import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashReconciliation } from './cash-reconciliation.entity';
import { CashReconciliationService } from './cash-reconciliation.service';
import { CashReconciliationController } from './cash-reconciliation.controller';
import { Sale } from '../sales/sale.entity';
import { StockMovementsModule } from '../stock-movements/stock-movements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CashReconciliation, Sale]),
    StockMovementsModule
  ],
  controllers: [CashReconciliationController],
  providers: [CashReconciliationService],
  exports: [CashReconciliationService],
})
export class CashReconciliationModule {}