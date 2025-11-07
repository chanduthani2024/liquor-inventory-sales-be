import { IsNumber, IsIn, Min } from 'class-validator';

export class SaleItemDto {
  @IsNumber()
  brand_id: number;

  @IsIn(['90ml', '180ml', '330ml', '375ml', '500ml', '650ml', '750ml', '1L', '2L'])
  size: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}