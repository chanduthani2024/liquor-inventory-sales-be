import { Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { BrandsService } from '../brands/brands.service';
export declare class StockService {
    private stockRepository;
    private brandsService;
    constructor(stockRepository: Repository<Stock>, brandsService: BrandsService);
    create(createStockDto: CreateStockDto): Promise<Stock>;
    findAll(): Promise<Stock[]>;
    findByBrand(brandId: number): Promise<Stock[]>;
    findOne(id: number): Promise<Stock>;
    findByBrandAndSize(brandId: number, size: string): Promise<Stock | null>;
    update(id: number, updateStockDto: UpdateStockDto): Promise<Stock>;
    updateQuantity(brandId: number, size: string, quantityChange: number): Promise<Stock>;
    remove(id: number): Promise<void>;
    getTotalStockValue(): Promise<number>;
    getStockValueByBrand(brandId: number): Promise<number>;
}
