import { Brand } from './brand.entity';
import { User } from '../auth/user.entity';
export declare class BrandPriceHistory {
    id: number;
    brand_id: number;
    size: string;
    old_price: number | null;
    new_price: number | null;
    changed_by: number;
    notes: string;
    changed_at: Date;
    brand: Brand;
    user: User;
}
