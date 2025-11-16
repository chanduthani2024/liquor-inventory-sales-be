import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfImportController } from './pdf-import.controller';
import { PdfImportService } from './pdf-import.service';
import { LiquorDelivery } from './liquor-delivery.entity';
import { PdfImportHistory } from './pdf-import-history.entity';
import { Brand } from '../brands/brand.entity';
import { Stock } from '../stock/stock.entity';
import { StockMovement } from '../stock-movements/stock-movement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LiquorDelivery,
      PdfImportHistory,
      Brand,
      Stock,
      StockMovement,
    ])
  ],
  controllers: [PdfImportController],
  providers: [PdfImportService],
  exports: [PdfImportService],
})
export class PdfImportModule {}