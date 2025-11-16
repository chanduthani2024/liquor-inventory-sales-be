import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateLiquorDeliveryDto {
  @IsString()
  @IsNotEmpty()
  brandNumber: string;

  @IsString()
  @IsNotEmpty()
  brandName: string;

  @IsString()
  @IsNotEmpty()
  productType: string;

  @IsString()
  @IsNotEmpty()
  packType: string;

  @IsString()
  @IsNotEmpty()
  packQtySize: string;

  @IsNumber()
  qtyCasesDelivered: number;

  @IsNumber()
  qtyBottlesDelivered: number;

  @IsString()
  @IsNotEmpty()
  unitRateBtlRate: string;

  @IsNumber()
  rateCase: number;

  @IsNumber()
  totalAmount: number;
}