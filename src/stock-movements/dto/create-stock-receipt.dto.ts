import { IsNumber, IsIn, IsOptional, IsString, Min } from 'class-validator';

export class CreateStockReceiptDto {
  @IsNumber()
  brand_id: number;

  @IsIn(['90ml', '180ml', '330ml', '375ml', '500ml', '650ml', '750ml', '1L', '2L'])
  size: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  defective_quantity?: number; // Number of defective bottles in this receipt

  @IsOptional()
  @IsNumber()
  @Min(0)
  unit_cost?: number; // Cost price per unit

  @IsOptional()
  @IsString()
  notes?: string; // e.g., "Weekly delivery", "Emergency stock"
}