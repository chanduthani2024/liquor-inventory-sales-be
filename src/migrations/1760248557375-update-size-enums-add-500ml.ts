import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSizeEnumsAdd500ml1760248557375 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add '500ml' to the stocks_size_enum
        await queryRunner.query(`
            ALTER TYPE "stocks_size_enum" ADD VALUE '500ml';
        `);
        
        // Add '500ml' to the sale_items_size_enum
        await queryRunner.query(`
            ALTER TYPE "sale_items_size_enum" ADD VALUE '500ml';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Note: PostgreSQL doesn't support removing enum values directly
        // This would require recreating the enum type and updating all references
        // For now, we'll leave this empty as it's complex and rarely needed
        console.log('Rollback not implemented - PostgreSQL enum values cannot be easily removed');
    }

}
