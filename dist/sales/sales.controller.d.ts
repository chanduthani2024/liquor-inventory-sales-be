import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto): Promise<{
        success: boolean;
        message: string;
        data: import("./sale.entity").Sale;
    }>;
    findAll(startDate?: string, endDate?: string): Promise<import("./sale.entity").Sale[]>;
    getTotalRevenue(startDate?: string, endDate?: string): Promise<number>;
    getSalesByBrand(startDate?: string, endDate?: string): Promise<any[]>;
    getTopSellingBrands(limit?: string, startDate?: string, endDate?: string): Promise<any[]>;
    getSalesByPaymentMethod(startDate?: string, endDate?: string): Promise<{
        cash: {
            total: number;
            count: number;
        };
        online: {
            total: number;
            count: number;
        };
    }>;
    private getEndOfDay;
    findOne(id: string): Promise<import("./sale.entity").Sale>;
}
