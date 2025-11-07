import { TpChargesService } from './tp-charges.service';
import { CreateTpChargeDto } from './dto/create-tp-charge.dto';
import { UpdateTpChargeDto } from './dto/update-tp-charge.dto';
export declare class TpChargesController {
    private readonly tpChargesService;
    constructor(tpChargesService: TpChargesService);
    create(createTpChargeDto: CreateTpChargeDto): Promise<import("./tp-charge.entity").TpCharge>;
    findAll(): Promise<import("./tp-charge.entity").TpCharge[]>;
    findByDate(date: string): Promise<import("./tp-charge.entity").TpCharge>;
    findByDateRange(startDate: string, endDate: string): Promise<import("./tp-charge.entity").TpCharge[]>;
    getTotalForMonth(year: string, month: string): Promise<number>;
    getTotalForDateRange(startDate: string, endDate: string): Promise<number>;
    findOne(id: string): Promise<import("./tp-charge.entity").TpCharge>;
    update(id: string, updateTpChargeDto: UpdateTpChargeDto): Promise<import("./tp-charge.entity").TpCharge>;
    remove(id: string): Promise<void>;
}
