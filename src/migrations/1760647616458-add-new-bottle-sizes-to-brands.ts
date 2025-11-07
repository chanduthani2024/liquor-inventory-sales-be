import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewBottleSizesToBrands1760647616458 implements MigrationInterface {
    name = 'AddNewBottleSizesToBrands1760647616458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "brands" 
            ADD COLUMN "price_330ml" DECIMAL(10,2) DEFAULT NULL,
            ADD COLUMN "price_650ml" DECIMAL(10,2) DEFAULT NULL,
            ADD COLUMN "price_2l" DECIMAL(10,2) DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "brands" 
            DROP COLUMN "price_330ml",
            DROP COLUMN "price_650ml",
            DROP COLUMN "price_2l"
        `);
    }
}