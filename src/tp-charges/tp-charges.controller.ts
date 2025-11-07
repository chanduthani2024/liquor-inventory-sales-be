import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TpChargesService } from './tp-charges.service';
import { CreateTpChargeDto } from './dto/create-tp-charge.dto';
import { UpdateTpChargeDto } from './dto/update-tp-charge.dto';

@Controller('tp-charges')
export class TpChargesController {
  constructor(private readonly tpChargesService: TpChargesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createTpChargeDto: CreateTpChargeDto) {
    return this.tpChargesService.create(createTpChargeDto);
  }

  @Get()
  findAll() {
    return this.tpChargesService.findAll();
  }

  @Get('by-date')
  findByDate(@Query('date') date: string) {
    return this.tpChargesService.findByDate(date);
  }

  @Get('by-date-range')
  findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.tpChargesService.findByDateRange(startDate, endDate);
  }

  @Get('total/month')
  getTotalForMonth(
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.tpChargesService.getTotalForMonth(
      parseInt(year),
      parseInt(month),
    );
  }

  @Get('total/date-range')
  getTotalForDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.tpChargesService.getTotalForDateRange(startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tpChargesService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateTpChargeDto: UpdateTpChargeDto) {
    return this.tpChargesService.update(+id, updateTpChargeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tpChargesService.remove(+id);
  }
}