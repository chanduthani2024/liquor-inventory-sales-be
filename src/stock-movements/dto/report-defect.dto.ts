import { IsNumber, IsIn, IsOptional, IsString, Min } from 'class-validator';

export class ReportDefectDto {
  @IsNumber()
  brand_id: number;

  @IsIn(['90ml', '180ml', '330ml', '375ml', '500ml', '650ml', '750ml', '1L', '2L'])
  size: string;

  @IsNumber()
  @Min(1)
  defective_quantity: number;

  @IsOptional()
  @IsString()
  defect_reason?: string; // e.g., "Cracked bottle", "Label damaged", "Expired", "Quality issue"

  @IsOptional()
  @IsString()
  action_taken?: string; // e.g., "Returned to supplier", "Disposed", "Exchanged"

  @IsOptional()
  @IsString()
  notes?: string;
}