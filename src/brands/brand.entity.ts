import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Stock } from '../stock/stock.entity';
import { SaleItem } from '../sales/sale-item.entity';
import { AlcoholType } from '../alcohol-types/alcohol-type.entity';
import { BrandPriceHistory } from './brand-price-history.entity';

export enum BottleSize {
  ML_90 = '90ml',
  ML_180 = '180ml',
  ML_330 = '330ml',
  ML_375 = '375ml',
  ML_500 = '500ml',
  ML_650 = '650ml',
  ML_750 = '750ml',
  L_1 = '1L',
  L_2 = '2L',
}

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, nullable: true, length: 50, comment: 'Unique brand number/SKU for inventory tracking' })
  brand_number: string | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  price_90ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  price_180ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  price_375ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  price_500ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  price_750ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  price_330ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  price_650ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  price_1l: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  price_2l: number | null;

  // Actual/Cost prices (what owner pays to supplier)
  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  actual_price_90ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  actual_price_180ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  actual_price_330ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  actual_price_375ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  actual_price_500ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  actual_price_650ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  actual_price_750ml: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  actual_price_1l: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
  actual_price_2l: number | null;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  alcohol_type_id: number;

  @ManyToOne(() => AlcoholType, alcoholType => alcoholType.brands, { eager: true })
  @JoinColumn({ name: 'alcohol_type_id' })
  alcoholType: AlcoholType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Stock, stock => stock.brand)
  stocks: Stock[];

  @OneToMany(() => SaleItem, saleItem => saleItem.brand)
  saleItems: SaleItem[];

  @OneToMany(() => BrandPriceHistory, priceHistory => priceHistory.brand)
  priceHistory: BrandPriceHistory[];
}