import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTpCharges1729093200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tp_charges',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'date',
            type: 'date',
            comment: 'Date for which the TP charges are recorded',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            comment: 'Total TP charges amount for the day',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
            comment: 'Description of the charges (optional)',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
            comment: 'Additional notes about the charges',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create unique index on date to ensure only one TP charge entry per day
    await queryRunner.createIndex(
      'tp_charges',
      new TableIndex({
        name: 'IDX_tp_charges_date',
        columnNames: ['date'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tp_charges');
  }
}