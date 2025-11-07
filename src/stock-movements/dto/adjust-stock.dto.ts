import { IsNumber, IsIn, IsOptional, IsString, Min } from 'class-validator';

export class AdjustStockDto {
  @IsNumber()
  brand_id: number;

  @IsIn(['90ml', '180ml', '330ml', '375ml', '500ml', '650ml', '750ml', '1L', '2L'])
  size: string;

  @IsNumber()
  @Min(0)
  new_total_quantity: number; // The new total quantity after physical count

  @IsOptional()
  @IsString()
  notes?: string; // e.g., "Stock adjustment after physical count"
}