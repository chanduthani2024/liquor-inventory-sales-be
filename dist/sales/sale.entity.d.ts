import { SaleItem } from './sale-item.entity';
export declare class Sale {
    id: number;
    total_amount: number;
    payment_method: 'cash' | 'online';
    created_at: Date;
    items: SaleItem[];
}
