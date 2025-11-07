import { IsArray, ValidateNested, ArrayMinSize, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { SaleItemDto } from './sale-item.dto';

export class CreateSaleDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @IsOptional()
  @IsEnum(['cash', 'online'])
  payment_method?: 'cash' | 'online';
}