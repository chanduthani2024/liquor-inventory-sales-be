import { Brand } from '../brands/brand.entity';
export declare class Stock {
    id: number;
    brand_id: number;
    size: string;
    quantity: number;
    defective_quantity: number;
    created_at: Date;
    updated_at: Date;
    brand: Brand;
}
