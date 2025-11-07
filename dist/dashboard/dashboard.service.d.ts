import { SalesService } from '../sales/sales.service';
import { StockService } from '../stock/stock.service';
import { BrandsService } from '../brands/brands.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
export declare class DashboardService {
    private salesService;
    private stockService;
    private brandsService;
    private stockMovementsService;
    constructor(salesService: SalesService, stockService: StockService, brandsService: BrandsService, stockMovementsService: StockMovementsService);
    getDashboardData(startDate?: Date, endDate?: Date): Promise<{
        summary: {
            totalRevenue: number;
            totalStockValue: number;
            totalBrands: number;
            totalStockItems: number;
            lowStockCount: number;
        };
        topSellingBrands: any[];
        salesByBrand: any[];
        currentStock: {
            brand_name: string;
            id: number;
            brand_id: number;
            size: string;
            quantity: number;
            defective_quantity: number;
            created_at: Date;
            updated_at: Date;
            brand: import("../brands/brand.entity").Brand;
        }[];
        lowStockItems: {
            brand_name: string;
            id: number;
            brand_id: number;
            size: string;
            quantity: number;
            defective_quantity: number;
            created_at: Date;
            updated_at: Date;
            brand: import("../brands/brand.entity").Brand;
        }[];
        dateRange: {
            startDate: Date;
            endDate: Date;
        };
    }>;
    getRevenueByDate(startDate: Date, endDate: Date): Promise<import("../sales/sale.entity").Sale[]>;
    getLowStockItems(threshold?: number): Promise<import("../stock/stock.entity").Stock[]>;
    getBrandPerformance(brandId?: number, startDate?: Date, endDate?: Date): Promise<{
        brandId: number;
        brandName: string;
        stockValue: number;
        totalRevenue: any;
        totalQuantitySold: any;
        sales: any[];
    }[] | {
        brandId: number;
        stockValue: number;
        sales: any[];
    }>;
    private getComprehensiveTotalRevenue;
    private getComprehensiveTopSellingBrands;
    private getComprehensiveSalesByBrand;
    private isSameDay;
}
