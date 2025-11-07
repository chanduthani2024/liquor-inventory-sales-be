import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlcoholTypesController } from './alcohol-types.controller';
import { AlcoholTypesService } from './alcohol-types.service';
import { AlcoholType } from './alcohol-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlcoholType])],
  controllers: [AlcoholTypesController],
  providers: [AlcoholTypesService],
  exports: [AlcoholTypesService],
})
export class AlcoholTypesModule {}