import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TpCharge } from './tp-charge.entity';
import { CreateTpChargeDto } from './dto/create-tp-charge.dto';
import { UpdateTpChargeDto } from './dto/update-tp-charge.dto';

@Injectable()
export class TpChargesService {
  constructor(
    @InjectRepository(TpCharge)
    private tpChargesRepository: Repository<TpCharge>,
  ) {}

  async create(createTpChargeDto: CreateTpChargeDto): Promise<TpCharge> {
    // Check if TP charge already exists for this date
    const existingCharge = await this.tpChargesRepository.findOne({
      where: { date: createTpChargeDto.date },
    });

    if (existingCharge) {
      throw new ConflictException(
        `TP charges already recorded for date ${createTpChargeDto.date}. Use update instead.`
      );
    }

    const tpCharge = this.tpChargesRepository.create(createTpChargeDto);
    return await this.tpChargesRepository.save(tpCharge);
  }

  async findAll(): Promise<TpCharge[]> {
    return await this.tpChargesRepository.find({
      order: { date: 'DESC' },
    });
  }

  async findByDate(date: string): Promise<TpCharge | null> {
    return await this.tpChargesRepository.findOne({
      where: { date },
    });
  }

  async findByDateRange(startDate: string, endDate: string): Promise<TpCharge[]> {
    return await this.tpChargesRepository
      .createQueryBuilder('tp_charge')
      .where('tp_charge.date >= :startDate AND tp_charge.date <= :endDate', {
        startDate,
        endDate,
      })
      .orderBy('tp_charge.date', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<TpCharge> {
    const tpCharge = await this.tpChargesRepository.findOne({
      where: { id },
    });

    if (!tpCharge) {
      throw new NotFoundException(`TP charge with ID ${id} not found`);
    }

    return tpCharge;
  }

  async update(id: number, updateTpChargeDto: UpdateTpChargeDto): Promise<TpCharge> {
    const tpCharge = await this.findOne(id);

    // If date is being updated, check for conflicts
    if (updateTpChargeDto.date && updateTpChargeDto.date !== tpCharge.date) {
      const existingCharge = await this.tpChargesRepository.findOne({
        where: { date: updateTpChargeDto.date },
      });

      if (existingCharge) {
        throw new ConflictException(
          `TP charges already recorded for date ${updateTpChargeDto.date}`
        );
      }
    }

    Object.assign(tpCharge, updateTpChargeDto);
    return await this.tpChargesRepository.save(tpCharge);
  }

  async remove(id: number): Promise<void> {
    const tpCharge = await this.findOne(id);
    await this.tpChargesRepository.remove(tpCharge);
  }

  async getTotalForMonth(year: number, month: number): Promise<number> {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

    const result = await this.tpChargesRepository
      .createQueryBuilder('tp_charge')
      .select('SUM(tp_charge.amount)', 'total')
      .where('tp_charge.date >= :startDate AND tp_charge.date <= :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getTotalForDateRange(startDate: string, endDate: string): Promise<number> {
    const result = await this.tpChargesRepository
      .createQueryBuilder('tp_charge')
      .select('SUM(tp_charge.amount)', 'total')
      .where('tp_charge.date >= :startDate AND tp_charge.date <= :endDate', {
        startDate,
        endDate,
      })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }
}