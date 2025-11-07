import { IsNumber, IsOptional, IsString, IsBoolean, Min } from 'class-validator';

export class CreateCashReconciliationDto {
  @IsString()
  date: string; // Format: YYYY-MM-DD

  @IsNumber()
  @Min(0)
  office_cash: number;

  @IsNumber()
  @Min(0)
  online_cash: number;

  @IsNumber()
  @Min(0)
  expenditure: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCashReconciliationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  office_cash?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  online_cash?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  expenditure?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  is_finalized?: boolean;
}