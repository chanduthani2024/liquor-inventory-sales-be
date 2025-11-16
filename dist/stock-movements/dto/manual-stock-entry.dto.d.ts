export interface ManualStockEntryDto {
    brand_id: number;
    size: string;
    opening_balance: number;
    received_today: number;
    sales_quantity: number;
    date: string;
    notes?: string;
}
