import { Brand } from '../brands/brand.entity';
export declare enum MovementType {
    RECEIPT = "RECEIPT",
    SALE = "SALE",
    ADJUSTMENT = "ADJUSTMENT",
    DEFECT = "DEFECT"
}
export declare class StockMovement {
    id: number;
    brand_id: number;
    size: string;
    movement_type: MovementType;
    quantity: number;
    defective_quantity: number;
    reference_id: number;
    notes: string;
    unit_cost: number;
    created_at: Date;
    brand: Brand;
}
