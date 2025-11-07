import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sale.entity';
import { Brand } from '../brands/brand.entity';

@Entity('sale_items')
export class SaleItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sale_id: number;

  @Column()
  brand_id: number;

  @Column({
    type: 'enum',
    enum: ['90ml', '180ml', '330ml', '375ml', '500ml', '650ml', '750ml', '1L', '2L'],
  })
  size: string;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_price: number;

  @ManyToOne(() => Sale, sale => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Brand, brand => brand.saleItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
}