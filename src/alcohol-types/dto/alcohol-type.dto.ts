import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAlcoholTypeDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  display_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}

export class UpdateAlcoholTypeDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  display_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}