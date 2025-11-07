import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrice500mlToBrands1760247616458 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "brands" 
            ADD COLUMN "price_500ml" DECIMAL(10,2) DEFAULT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "brands" 
            DROP COLUMN "price_500ml"
        `);
    }

}
