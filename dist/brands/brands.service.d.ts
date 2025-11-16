import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import { BrandPriceHistory } from './brand-price-history.entity';
import { SaleItem } from '../sales/sale-item.entity';
import { Sale } from '../sales/sale.entity';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsService {
    private brandsRepository;
    private brandPriceHistoryRepository;
    private saleItemRepository;
    private saleRepository;
    private stockMovementsService;
    constructor(brandsRepository: Repository<Brand>, brandPriceHistoryRepository: Repository<BrandPriceHistory>, saleItemRepository: Repository<SaleItem>, saleRepository: Repository<Sale>, stockMovementsService: StockMovementsService);
    create(createBrandDto: CreateBrandDto): Promise<Brand>;
    findAll(): Promise<Brand[]>;
    findByAlcoholType(alcoholTypeId: number): Promise<Brand[]>;
    findOne(id: number): Promise<Brand>;
    update(id: number, updateBrandDto: UpdateBrandDto, userId?: number): Promise<Brand>;
    private trackPriceChanges;
    remove(id: number): Promise<void>;
    getPriceForSize(brandId: number, size: string): Promise<number | null>;
    getPriceHistory(brandId?: number, size?: string, limit?: number): Promise<BrandPriceHistory[]>;
    getBrandPriceHistory(brandId: number, size?: string): Promise<BrandPriceHistory[]>;
    getDailyProfitReport(date?: string, brandId?: number): Promise<{
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
    }>;
    getProfitSummary(startDate?: string, endDate?: string, brandId?: number): Promise<{
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
    }>;
    private getProfitSummaryFromStockMovements;
    private isSameDay;
    private getActualPriceForSize;
    private getActualPrice;
}
