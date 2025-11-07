import { StockMovementsService } from './stock-movements.service';
import { CreateStockReceiptDto } from './dto/create-stock-receipt.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { ReportDefectDto } from './dto/report-defect.dto';
import { StockReportDto } from './dto/stock-report.dto';
import { ManualStockEntryDto } from './dto/manual-stock-entry.dto';
export declare class StockMovementsController {
    private readonly stockMovementsService;
    constructor(stockMovementsService: StockMovementsService);
    receiveStock(receiptDto: CreateStockReceiptDto): Promise<{
        message: string;
        movement: import("./stock-movement.entity").StockMovement;
        currentStock: number;
        defectiveStock: number;
        totalReceived: number;
        defectiveReceived: number;
    }>;
    adjustStock(adjustDto: AdjustStockDto): Promise<{
        message: string;
        movement: import("./stock-movement.entity").StockMovement;
        previousQuantity: number;
        newQuantity: number;
        adjustmentQuantity: number;
    }>;
    reportDefect(defectDto: ReportDefectDto): Promise<{
        message: string;
        movement: import("./stock-movement.entity").StockMovement;
        currentStock: number;
        defectiveStock: number;
    }>;
    getStockReport(reportDto: StockReportDto): Promise<any[]>;
    getAllMovements(): Promise<import("./stock-movement.entity").StockMovement[]>;
    getMovementsByBrand(brandId: number): Promise<import("./stock-movement.entity").StockMovement[]>;
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
}
