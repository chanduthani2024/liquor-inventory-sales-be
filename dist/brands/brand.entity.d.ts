import { Stock } from '../stock/stock.entity';
import { SaleItem } from '../sales/sale-item.entity';
import { AlcoholType } from '../alcohol-types/alcohol-type.entity';
export declare enum BottleSize {
    ML_90 = "90ml",
    ML_180 = "180ml",
    ML_330 = "330ml",
    ML_375 = "375ml",
    ML_500 = "500ml",
    ML_650 = "650ml",
    ML_750 = "750ml",
    L_1 = "1L",
    L_2 = "2L"
}
export declare class Brand {
    id: number;
    name: string;
    price_90ml: number | null;
    price_180ml: number | null;
    price_375ml: number | null;
    price_500ml: number | null;
    price_750ml: number | null;
    price_330ml: number | null;
    price_650ml: number | null;
    price_1l: number | null;
    price_2l: number | null;
    description: string;
    alcohol_type_id: number;
    alcoholType: AlcoholType;
    created_at: Date;
    updated_at: Date;
    stocks: Stock[];
    saleItems: SaleItem[];
}
