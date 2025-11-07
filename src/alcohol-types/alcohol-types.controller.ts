import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AlcoholTypesService } from './alcohol-types.service';
import { CreateAlcoholTypeDto, UpdateAlcoholTypeDto } from './dto/alcohol-type.dto';
import { AlcoholType } from './alcohol-type.entity';

@Controller('alcohol-types')
export class AlcoholTypesController {
  constructor(private readonly alcoholTypesService: AlcoholTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateAlcoholTypeDto): Promise<AlcoholType> {
    return this.alcoholTypesService.create(createDto);
  }

  @Get()
  findAll(): Promise<AlcoholType[]> {
    return this.alcoholTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AlcoholType> {
    return this.alcoholTypesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAlcoholTypeDto,
  ): Promise<AlcoholType> {
    return this.alcoholTypesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.alcoholTypesService.remove(id);
  }

  @Post('initialize')
  @HttpCode(HttpStatus.OK)
  initializeDefaultTypes(): Promise<void> {
    return this.alcoholTypesService.initializeDefaultTypes();
  }
}