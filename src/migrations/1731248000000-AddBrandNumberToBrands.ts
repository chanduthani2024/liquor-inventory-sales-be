import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddBrandNumberToBrands1731248000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('brands', new TableColumn({
      name: 'brand_number',
      type: 'varchar',
      length: '50',
      isNullable: true,
      isUnique: true,
      comment: 'Unique brand number/SKU for inventory tracking'
    }));

    // Add index for better performance
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_brands_brand_number" ON "brands" ("brand_number")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_brands_brand_number"`);
    await queryRunner.dropColumn('brands', 'brand_number');
  }
}