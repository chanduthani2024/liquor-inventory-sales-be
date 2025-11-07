"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNewBottleSizesToBrands1760647616458 = void 0;
class AddNewBottleSizesToBrands1760647616458 {
    constructor() {
        this.name = 'AddNewBottleSizesToBrands1760647616458';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "brands" 
            ADD COLUMN "price_330ml" DECIMAL(10,2) DEFAULT NULL,
            ADD COLUMN "price_650ml" DECIMAL(10,2) DEFAULT NULL,
            ADD COLUMN "price_2l" DECIMAL(10,2) DEFAULT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "brands" 
            DROP COLUMN "price_330ml",
            DROP COLUMN "price_650ml",
            DROP COLUMN "price_2l"
        `);
    }
}
exports.AddNewBottleSizesToBrands1760647616458 = AddNewBottleSizesToBrands1760647616458;
//# sourceMappingURL=1760647616458-add-new-bottle-sizes-to-brands.js.map