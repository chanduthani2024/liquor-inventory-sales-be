import { PartialType } from '@nestjs/mapped-types';
import { CreateTpChargeDto } from './create-tp-charge.dto';

export class UpdateTpChargeDto extends PartialType(CreateTpChargeDto) {}