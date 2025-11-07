export declare class CreateCashReconciliationDto {
    date: string;
    office_cash: number;
    online_cash: number;
    expenditure: number;
    notes?: string;
}
export declare class UpdateCashReconciliationDto {
    office_cash?: number;
    online_cash?: number;
    expenditure?: number;
    notes?: string;
    is_finalized?: boolean;
}
