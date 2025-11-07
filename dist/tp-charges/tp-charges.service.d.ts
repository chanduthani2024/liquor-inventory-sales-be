import { Repository } from 'typeorm';
import { TpCharge } from './tp-charge.entity';
import { CreateTpChargeDto } from './dto/create-tp-charge.dto';
import { UpdateTpChargeDto } from './dto/update-tp-charge.dto';
export declare class TpChargesService {
    private tpChargesRepository;
    constructor(tpChargesRepository: Repository<TpCharge>);
    create(createTpChargeDto: CreateTpChargeDto): Promise<TpCharge>;
    findAll(): Promise<TpCharge[]>;
    findByDate(date: string): Promise<TpCharge | null>;
    findByDateRange(startDate: string, endDate: string): Promise<TpCharge[]>;
    findOne(id: number): Promise<TpCharge>;
    update(id: number, updateTpChargeDto: UpdateTpChargeDto): Promise<TpCharge>;
    remove(id: number): Promise<void>;
    getTotalForMonth(year: number, month: number): Promise<number>;
    getTotalForDateRange(startDate: string, endDate: string): Promise<number>;
}
