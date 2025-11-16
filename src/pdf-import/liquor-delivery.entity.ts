import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('liquor_deliveries')
export class LiquorDelivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brandNumber: string;

  @Column()
  brandName: string;

  @Column()
  productType: string;

  @Column()
  packType: string;

  @Column()
  packQtySize: string;

  @Column()
  qtyCasesDelivered: number;

  @Column()
  qtyBottlesDelivered: number;

  @Column()
  unitRateBtlRate: string;

  @Column('decimal', { precision: 10, scale: 2 })
  rateCase: number;

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;
}