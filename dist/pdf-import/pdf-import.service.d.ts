import { Repository } from 'typeorm';
import { LiquorDelivery } from './liquor-delivery.entity';
import { PdfImportHistory } from './pdf-import-history.entity';
import { Brand } from '../brands/brand.entity';
import { Stock } from '../stock/stock.entity';
import { StockMovement } from '../stock-movements/stock-movement.entity';
import { CreateLiquorDeliveryDto } from './dto';
export declare class PdfImportService {
    private readonly liquorDeliveryRepository;
    private readonly importHistoryRepository;
    private readonly brandRepository;
    private readonly stockRepository;
    private readonly stockMovementRepository;
    constructor(liquorDeliveryRepository: Repository<LiquorDelivery>, importHistoryRepository: Repository<PdfImportHistory>, brandRepository: Repository<Brand>, stockRepository: Repository<Stock>, stockMovementRepository: Repository<StockMovement>);
    private extractSize;
    private extractPackQuantity;
    private extractBottlePrice;
    private getActualPriceColumn;
    private processDeliveryRecord;
    createFromPDFRows(rows: CreateLiquorDeliveryDto[]): Promise<LiquorDelivery[]>;
    processLiquorDeliveryPDF(file: any): Promise<any>;
    findAll(): Promise<LiquorDelivery[]>;
    findById(id: number): Promise<LiquorDelivery>;
    deleteById(id: number): Promise<void>;
    getImportHistory(): Promise<PdfImportHistory[]>;
    getImportHistoryById(id: number): Promise<PdfImportHistory>;
}
