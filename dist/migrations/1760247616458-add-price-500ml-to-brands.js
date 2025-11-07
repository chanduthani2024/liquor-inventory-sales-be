"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPrice500mlToBrands1760247616458 = void 0;
class AddPrice500mlToBrands1760247616458 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "brands" 
            ADD COLUMN "price_500ml" DECIMAL(10,2) DEFAULT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "brands" 
            DROP COLUMN "price_500ml"
        `);
    }
}
exports.AddPrice500mlToBrands1760247616458 = AddPrice500mlToBrands1760247616458;
//# sourceMappingURL=1760247616458-add-price-500ml-to-brands.js.map