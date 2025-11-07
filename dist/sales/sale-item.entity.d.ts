import { Sale } from './sale.entity';
import { Brand } from '../brands/brand.entity';
export declare class SaleItem {
    id: number;
    sale_id: number;
    brand_id: number;
    size: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    sale: Sale;
    brand: Brand;
}
