import { Repository } from 'typeorm';
import { StockMovement } from './stock-movement.entity';
import { Stock } from '../stock/stock.entity';
import { Brand } from '../brands/brand.entity';
import { SaleItem } from '../sales/sale-item.entity';
import { CreateStockReceiptDto } from './dto/create-stock-receipt.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { ReportDefectDto } from './dto/report-defect.dto';
import { StockReportDto } from './dto/stock-report.dto';
import { ManualStockEntryDto } from './dto/manual-stock-entry.dto';
export declare class StockMovementsService {
    private movementsRepository;
    private stockRepository;
    private brandRepository;
    private saleItemRepository;
    constructor(movementsRepository: Repository<StockMovement>, stockRepository: Repository<Stock>, brandRepository: Repository<Brand>, saleItemRepository: Repository<SaleItem>);
    receiveStock(receiptDto: CreateStockReceiptDto): Promise<{
        message: string;
        movement: StockMovement;
        currentStock: number;
        defectiveStock: number;
        totalReceived: number;
        defectiveReceived: number;
    }>;
    adjustStock(adjustDto: AdjustStockDto): Promise<{
        message: string;
        movement: StockMovement;
        previousQuantity: number;
        newQuantity: number;
        adjustmentQuantity: number;
    }>;
    reportDefect(defectDto: ReportDefectDto): Promise<{
        message: string;
        movement: StockMovement;
        currentStock: number;
        defectiveStock: number;
    }>;
    recordSale(brandId: number, size: string, quantity: number, saleId: number): Promise<StockMovement>;
    getStockReport(reportDto: StockReportDto): Promise<any[]>;
    getAllMovements(): Promise<StockMovement[]>;
    getMovementsByBrand(brandId: number): Promise<StockMovement[]>;
    private getAvailableBrandIds;
    manualStockEntry(entryDto: ManualStockEntryDto): Promise<{
        message: string;
        movements: any[];
        stockUpdate: {
            brand: string;
            size: string;
            stockBeforeManualEntries: number;
            receivedToday: number;
            salesQuantity: number;
            newQuantity: number;
            replacedExistingEntries: boolean;
        };
    }>;
    private getUnitPrice;
}
