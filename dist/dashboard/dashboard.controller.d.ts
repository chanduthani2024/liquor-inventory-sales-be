import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboardData(startDate?: string, endDate?: string): Promise<{
        summary: {
            totalRevenue: number;
            totalStockValue: number;
            totalBrands: number;
            totalStockItems: number;
            lowStockCount: number;
            totalProfit: number;
            profitMargin: number;
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
    private getEndOfDay;
    getRevenueByDate(startDate: string, endDate: string): Promise<import("../sales/sale.entity").Sale[]>;
    getLowStockItems(threshold?: string): Promise<import("../stock/stock.entity").Stock[]>;
    getBrandPerformance(brandId?: string, startDate?: string, endDate?: string): Promise<{
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
}
