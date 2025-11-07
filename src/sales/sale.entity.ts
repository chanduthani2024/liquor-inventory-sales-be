import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { SaleItem } from './sale-item.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_amount: number;

  @Column({
    type: 'enum',
    enum: ['cash', 'online'],
    default: 'cash'
  })
  payment_method: 'cash' | 'online';

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => SaleItem, saleItem => saleItem.sale, { cascade: true })
  items: SaleItem[];
}