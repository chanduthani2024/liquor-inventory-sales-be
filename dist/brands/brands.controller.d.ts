import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    create(createBrandDto: CreateBrandDto): Promise<{
        success: boolean;
        message: string;
        data: import("./brand.entity").Brand;
    }>;
    findAll(): Promise<import("./brand.entity").Brand[]>;
    findOne(id: string): Promise<import("./brand.entity").Brand>;
    update(id: string, updateBrandDto: UpdateBrandDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./brand.entity").Brand;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findByAlcoholType(alcoholTypeId: string): Promise<import("./brand.entity").Brand[]>;
    getPriceForSize(id: string, size: string): Promise<number>;
    getAllPriceHistory(brandId?: string, size?: string, limit?: string): Promise<{
        success: boolean;
        data: import("./brand-price-history.entity").BrandPriceHistory[];
    }>;
    getBrandPriceHistory(id: string, size?: string): Promise<{
        success: boolean;
        data: import("./brand-price-history.entity").BrandPriceHistory[];
    }>;
    getDailyProfitReport(date?: string, brandId?: string): Promise<{
        success: boolean;
        data: {
            date: string;
            summary: {
                total_sales: number;
                total_profit: number;
                profit_margin: number;
                items_sold: number;
            };
            details: {
                sale_id: number;
                brand_name: string;
                size: string;
                quantity: number;
                selling_price: number;
                actual_price: number;
                profit_per_unit: number;
                total_profit: number;
                sale_date: Date;
            }[];
        };
    }>;
    getProfitSummary(startDate?: string, endDate?: string, brandId?: string): Promise<{
        success: boolean;
        data: {
            period: {
                start_date: string;
                end_date: string;
            };
            overall_summary: {
                total_sales: number;
                total_profit: number;
                profit_margin: number;
                items_sold: any;
            };
            by_brand: any[];
        };
    }>;
}
