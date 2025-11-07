import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : parseFloat(value))
  price_90ml?: number | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : parseFloat(value))
  price_180ml?: number | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : parseFloat(value))
  price_375ml?: number | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : parseFloat(value))
  price_500ml?: number | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : parseFloat(value))
  price_750ml?: number | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : parseFloat(value))
  price_330ml?: number | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : parseFloat(value))
  price_650ml?: number | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : parseFloat(value))
  price_1l?: number | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : parseFloat(value))
  price_2l?: number | null;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? null : parseInt(value))
  alcohol_type_id?: number | null;
}