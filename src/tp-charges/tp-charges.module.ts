import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TpChargesService } from './tp-charges.service';
import { TpChargesController } from './tp-charges.controller';
import { TpCharge } from './tp-charge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TpCharge])],
  controllers: [TpChargesController],
  providers: [TpChargesService],
  exports: [TpChargesService],
})
export class TpChargesModule {}