import { IsNumber, IsNotEmpty, IsIn, Min } from 'class-validator';

export class CreateStockDto {
  @IsNumber()
  @IsNotEmpty()
  brand_id: number;

  @IsIn(['90ml', '180ml', '330ml', '375ml', '500ml', '650ml', '750ml', '1L', '2L'])
  @IsNotEmpty()
  size: string;

  @IsNumber()
  @Min(0)
  quantity: number;
}