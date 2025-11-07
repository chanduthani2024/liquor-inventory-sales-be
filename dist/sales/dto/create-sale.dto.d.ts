import { SaleItemDto } from './sale-item.dto';
export declare class CreateSaleDto {
    items: SaleItemDto[];
    payment_method?: 'cash' | 'online';
}
