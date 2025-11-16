import { PdfImportService } from './pdf-import.service';
export declare class PdfImportController {
    private readonly pdfImportService;
    constructor(pdfImportService: PdfImportService);
    uploadLiquorDeliveryPDF(file: any): Promise<any>;
    getAllDeliveries(): Promise<{
        status: string;
        count: number;
        data: import("./liquor-delivery.entity").LiquorDelivery[];
    }>;
    getDeliveryById(id: string): Promise<{
        status: string;
        data: import("./liquor-delivery.entity").LiquorDelivery;
    }>;
    deleteDelivery(id: string): Promise<{
        status: string;
        message: string;
    }>;
    getImportHistory(): Promise<{
        status: string;
        count: number;
        data: import("./pdf-import-history.entity").PdfImportHistory[];
    }>;
    getImportHistoryById(id: string): Promise<{
        status: string;
        data: import("./pdf-import-history.entity").PdfImportHistory;
    }>;
}
