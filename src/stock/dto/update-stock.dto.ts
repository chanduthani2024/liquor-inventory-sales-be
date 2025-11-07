import { PartialType } from '@nestjs/mapped-types';
import { CreateStockDto } from './create-stock.dto';
import { IsNumber, Min } from 'class-validator';

export class UpdateStockDto extends PartialType(CreateStockDto) {
  @IsNumber()
  @Min(0)
  quantity?: number;
}