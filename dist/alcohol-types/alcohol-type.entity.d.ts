import { Brand } from '../brands/brand.entity';
export declare class AlcoholType {
    id: number;
    name: string;
    description: string;
    display_order: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    brands: Brand[];
}
