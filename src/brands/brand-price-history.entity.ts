import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { User } from '../auth/user.entity';

@Entity('brand_price_history')
export class BrandPriceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand_id: number;

  @Column()
  size: string; // '90ml', '180ml', '750ml', '1L', etc.

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  old_price: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  new_price: number | null;

  @Column({ nullable: true })
  changed_by: number; // user ID who made the change

  @Column({ type: 'text', nullable: true })
  notes: string; // optional notes about the price change

  @CreateDateColumn()
  changed_at: Date;

  // Relations
  @ManyToOne(() => Brand, brand => brand.priceHistory)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'changed_by' })
  user: User;
}