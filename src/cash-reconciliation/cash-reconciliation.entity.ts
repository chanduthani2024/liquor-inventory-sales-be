import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('cash_reconciliation')
@Index(['date'], { unique: true }) // Ensure only one entry per date
export class CashReconciliation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  date: string; // Format: YYYY-MM-DD

  @Column('decimal', { precision: 12, scale: 2 })
  opening_balance: number; // Previous day's closing balance

  @Column('decimal', { precision: 12, scale: 2 })
  total_sales: number; // Calculated from sales table (readonly)

  @Column('decimal', { precision: 12, scale: 2 })
  cash_sales: number; // Cash sales amount (readonly)

  @Column('decimal', { precision: 12, scale: 2 })
  online_sales: number; // Online sales amount (readonly)

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  office_cash: number; // Cash given to office (entered by cashier)

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  online_cash: number; // Online payments received (entered by cashier)

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  expenditure: number; // Daily expenditure (entered by cashier)

  @Column('decimal', { precision: 12, scale: 2 })
  closing_balance: number; // Calculated: (total_sales + opening_balance) - office_cash - online_cash - expenditure

  @Column('text', { nullable: true })
  notes: string; // Optional notes by cashier

  @Column('boolean', { default: false })
  is_finalized: boolean; // Once finalized, opening_balance for next day is set

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}