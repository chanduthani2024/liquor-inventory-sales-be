import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class StockReportDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  brand_id?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}