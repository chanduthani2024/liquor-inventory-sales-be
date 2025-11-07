export interface ManualStockEntryDto {
  brand_id: number;
  size: string;
  received_today: number;
  sales_quantity: number;
  date: string; // YYYY-MM-DD format
  notes?: string;
}