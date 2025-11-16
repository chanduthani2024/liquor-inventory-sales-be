import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('pdf_import_history')
export class PdfImportHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: 'Unique identifier for this import batch' })
  importIdentifier: string;

  @Column({ length: 255, comment: 'Original PDF filename' })
  filename: string;

  @Column({ comment: 'Total number of items in the PDF' })
  totalItems: number;

  @Column({ comment: 'Number of items successfully processed' })
  itemsProcessed: number;

  @Column({ default: 0, comment: 'Number of new brands created during import' })
  brandsCreated: number;

  @Column({ default: 0, comment: 'Number of existing brands updated' })
  brandsUpdated: number;

  @Column({ default: 0, comment: 'Number of stock records added' })
  stocksAdded: number;

  @Column({ default: 0, comment: 'Total number of bottles added to inventory' })
  totalBottlesAdded: number;

  @Column({ length: 50, default: 'success', comment: 'success, partial, failed' })
  importStatus: string;

  @Column({ type: 'text', nullable: true, comment: 'Error details if import failed' })
  errorMessage: string;

  @Column({ type: 'json', nullable: true, comment: 'Detailed JSON of all processed items' })
  importDetails: any;

  @CreateDateColumn()
  createdAt: Date;
}
