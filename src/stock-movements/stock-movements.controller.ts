import { Controller, Post, Get, Body, Query, Param, ParseIntPipe } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockReceiptDto } from './dto/create-stock-receipt.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { ReportDefectDto } from './dto/report-defect.dto';
import { StockReportDto } from './dto/stock-report.dto';
import { ManualStockEntryDto } from './dto/manual-stock-entry.dto';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post('receive')
  async receiveStock(@Body() receiptDto: CreateStockReceiptDto) {
    return await this.stockMovementsService.receiveStock(receiptDto);
  }

  @Post('adjust')
  async adjustStock(@Body() adjustDto: AdjustStockDto) {
    return await this.stockMovementsService.adjustStock(adjustDto);
  }

  @Post('defect')
  async reportDefect(@Body() defectDto: ReportDefectDto) {
    return await this.stockMovementsService.reportDefect(defectDto);
  }

  @Get('report')
  async getStockReport(@Query() reportDto: StockReportDto) {
    return await this.stockMovementsService.getStockReport(reportDto);
  }

  @Get()
  async getAllMovements() {
    return await this.stockMovementsService.getAllMovements();
  }

  @Get('brand/:brandId')
  async getMovementsByBrand(@Param('brandId', ParseIntPipe) brandId: number) {
    return await this.stockMovementsService.getMovementsByBrand(brandId);
  }

  @Post('manual-entry')
  async manualStockEntry(@Body() entryDto: ManualStockEntryDto) {
    return await this.stockMovementsService.manualStockEntry(entryDto);
  }
}