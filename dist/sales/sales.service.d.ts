import { Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { SaleItem } from './sale-item.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { BrandsService } from '../brands/brands.service';
import { StockService } from '../stock/stock.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';
export declare class SalesService {
    private salesRepository;
    private saleItemsRepository;
    private brandsService;
    private stockService;
    private stockMovementsService;
    constructor(salesRepository: Repository<Sale>, saleItemsRepository: Repository<SaleItem>, brandsService: BrandsService, stockService: StockService, stockMovementsService: StockMovementsService);
    create(createSaleDto: CreateSaleDto): Promise<Sale>;
    findAll(): Promise<Sale[]>;
    findOne(id: number): Promise<Sale>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Sale[]>;
    getTotalRevenue(startDate?: Date, endDate?: Date): Promise<number>;
    getSalesByBrand(startDate?: Date, endDate?: Date): Promise<any[]>;
    getTopSellingBrands(limit?: number, startDate?: Date, endDate?: Date): Promise<any[]>;
    getSalesByPaymentMethod(startDate?: Date, endDate?: Date): Promise<{
        cash: {
            total: number;
            count: number;
        };
        online: {
            total: number;
            count: number;
        };
    }>;
}
