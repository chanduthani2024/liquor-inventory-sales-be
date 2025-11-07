import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Brand } from '../brands/brand.entity';

export enum MovementType {
  RECEIPT = 'RECEIPT',     // Stock received from supplier
  SALE = 'SALE',           // Stock sold to customer
  ADJUSTMENT = 'ADJUSTMENT', // Manual stock adjustment
  DEFECT = 'DEFECT'        // Defective bottles found/returned
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand_id: number;

  @Column({
    type: 'enum',
    enum: ['90ml', '180ml', '330ml', '375ml', '500ml', '650ml', '750ml', '1L', '2L'],
  })
  size: string;

  @Column({
    type: 'enum',
    enum: MovementType,
  })
  movement_type: MovementType;

  @Column()
  quantity: number; // Positive for receipts/adjustments in, negative for sales/adjustments out

  @Column({ default: 0 })
  defective_quantity: number; // Track defective bottles in the same movement

  @Column({ nullable: true })
  reference_id: number; // Reference to sale_id if movement_type is SALE

  @Column({ nullable: true })
  notes: string; // Optional notes about the movement

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  unit_cost: number; // Cost price for receipts (different from selling price)

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Brand, brand => brand.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
}