import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentMethodToSales1697086471000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE sales 
      ADD COLUMN payment_method ENUM('cash', 'online') NOT NULL DEFAULT 'cash'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE sales 
      DROP COLUMN payment_method
    `);
  }
}