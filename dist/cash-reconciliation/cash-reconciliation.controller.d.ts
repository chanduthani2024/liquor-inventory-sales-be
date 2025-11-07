import { CashReconciliationService } from './cash-reconciliation.service';
import { CreateCashReconciliationDto, UpdateCashReconciliationDto } from './dto/cash-reconciliation.dto';
export declare class CashReconciliationController {
    private readonly cashReconciliationService;
    constructor(cashReconciliationService: CashReconciliationService);
    create(createDto: CreateCashReconciliationDto): Promise<import("./cash-reconciliation.entity").CashReconciliation>;
    findAll(): Promise<import("./cash-reconciliation.entity").CashReconciliation[]>;
    getByDate(date: string): Promise<import("./cash-reconciliation.entity").CashReconciliation>;
    findOne(id: string): Promise<import("./cash-reconciliation.entity").CashReconciliation>;
    update(id: string, updateDto: UpdateCashReconciliationDto): Promise<import("./cash-reconciliation.entity").CashReconciliation>;
    remove(id: string): Promise<void>;
}
