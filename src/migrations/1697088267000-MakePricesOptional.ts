import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakePricesOptional1697088267000 implements MigrationInterface {
  name = 'MakePricesOptional1697088267000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make price columns nullable
    await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_90ml" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_180ml" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_375ml" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_750ml" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_1l" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes - make price columns NOT NULL again
    await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_1l" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_750ml" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_375ml" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_180ml" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_90ml" SET NOT NULL`);
  }
}