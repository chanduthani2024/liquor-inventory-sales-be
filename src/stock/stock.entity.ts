import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from '../brands/brand.entity';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand_id: number;

  @Column({
    type: 'enum',
    enum: ['90ml', '180ml', '330ml', '375ml', '500ml', '650ml', '750ml', '1L', '2L'],
  })
  size: string;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 0 })
  defective_quantity: number; // Track defective bottles separately

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Brand, brand => brand.stocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
}