import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
export declare class StockController {
    private readonly stockService;
    constructor(stockService: StockService);
    create(createStockDto: CreateStockDto): Promise<{
        success: boolean;
        message: string;
        data: import("./stock.entity").Stock;
    }>;
    findAll(brandId?: string): Promise<import("./stock.entity").Stock[]>;
    getTotalStockValue(): Promise<number>;
    getStockValueByBrand(brandId: string): Promise<number>;
    findOne(id: string): Promise<import("./stock.entity").Stock>;
    update(id: string, updateStockDto: UpdateStockDto): Promise<{
        success: boolean;
        message: string;
        data: import("./stock.entity").Stock;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
