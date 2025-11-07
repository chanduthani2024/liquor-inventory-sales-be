import { Repository } from 'typeorm';
import { CashReconciliation } from './cash-reconciliation.entity';
import { CreateCashReconciliationDto, UpdateCashReconciliationDto } from './dto/cash-reconciliation.dto';
import { Sale } from '../sales/sale.entity';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
export declare class CashReconciliationService {
    private cashReconciliationRepository;
    private salesRepository;
    private stockMovementsService;
    constructor(cashReconciliationRepository: Repository<CashReconciliation>, salesRepository: Repository<Sale>, stockMovementsService: StockMovementsService);
    create(createDto: CreateCashReconciliationDto): Promise<CashReconciliation>;
    update(id: number, updateDto: UpdateCashReconciliationDto): Promise<CashReconciliation>;
    findAll(): Promise<CashReconciliation[]>;
    findOne(id: number): Promise<CashReconciliation>;
    findByDate(date: string): Promise<CashReconciliation | null>;
    getOrCreateForDate(date: string): Promise<CashReconciliation>;
    delete(id: number): Promise<void>;
    private getSalesDataForDate;
    private getOpeningBalance;
    private setNextDayOpeningBalance;
}
