"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBrandNumberToBrands1731248000000 = void 0;
const typeorm_1 = require("typeorm");
class AddBrandNumberToBrands1731248000000 {
    async up(queryRunner) {
        await queryRunner.addColumn('brands', new typeorm_1.TableColumn({
            name: 'brand_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
            isUnique: true,
            comment: 'Unique brand number/SKU for inventory tracking'
        }));
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_brands_brand_number" ON "brands" ("brand_number")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_brands_brand_number"`);
        await queryRunner.dropColumn('brands', 'brand_number');
    }
}
exports.AddBrandNumberToBrands1731248000000 = AddBrandNumberToBrands1731248000000;
//# sourceMappingURL=1731248000000-AddBrandNumberToBrands.js.map