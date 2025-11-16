import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateBrandPriceHistory1731096000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'brand_price_history',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'brand_id',
            type: 'int',
            comment: 'ID of the brand whose price was changed',
          },
          {
            name: 'size',
            type: 'varchar',
            length: '10',
            comment: 'Size of the bottle (90ml, 180ml, 750ml, 1L, etc.)',
          },
          {
            name: 'old_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Previous price (null if price was being set for first time)',
          },
          {
            name: 'new_price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'New price (null if price was removed/cleared)',
          },
          {
            name: 'changed_by',
            type: 'int',
            isNullable: true,
            comment: 'ID of the user who made the change',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
            comment: 'Optional notes about the price change',
          },
          {
            name: 'changed_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            comment: 'Timestamp when the price was changed',
          },
        ],
      }),
      true,
    );

    // Create foreign key for brand_id
    await queryRunner.createForeignKey(
      'brand_price_history',
      new TableForeignKey({
        columnNames: ['brand_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'brands',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key for changed_by (user)
    await queryRunner.createForeignKey(
      'brand_price_history',
      new TableForeignKey({
        columnNames: ['changed_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Create index on brand_id for faster queries
    await queryRunner.createIndex(
      'brand_price_history',
      new TableIndex({
        name: 'IDX_brand_price_history_brand_id',
        columnNames: ['brand_id'],
      }),
    );

    // Create index on changed_at for chronological queries
    await queryRunner.createIndex(
      'brand_price_history',
      new TableIndex({
        name: 'IDX_brand_price_history_changed_at',
        columnNames: ['changed_at'],
      }),
    );

    // Create composite index for brand_id + size + changed_at for efficient filtering
    await queryRunner.createIndex(
      'brand_price_history',
      new TableIndex({
        name: 'IDX_brand_price_history_brand_size_date',
        columnNames: ['brand_id', 'size', 'changed_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('brand_price_history');
  }
}