import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CashReconciliationService } from './cash-reconciliation.service';
import { CreateCashReconciliationDto, UpdateCashReconciliationDto } from './dto/cash-reconciliation.dto';

@Controller('cash-reconciliation')
export class CashReconciliationController {
  constructor(private readonly cashReconciliationService: CashReconciliationService) {}

  @Post()
  create(@Body() createDto: CreateCashReconciliationDto) {
    return this.cashReconciliationService.create(createDto);
  }

  @Get()
  findAll() {
    return this.cashReconciliationService.findAll();
  }

  @Get('by-date')
  async getByDate(@Query('date') date: string) {
    if (!date) {
      // Default to today's date
      date = new Date().toISOString().split('T')[0];
    }
    return this.cashReconciliationService.getOrCreateForDate(date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashReconciliationService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCashReconciliationDto) {
    return this.cashReconciliationService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashReconciliationService.delete(+id);
  }
}