"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakePricesOptional1697088267000 = void 0;
class MakePricesOptional1697088267000 {
    constructor() {
        this.name = 'MakePricesOptional1697088267000';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_90ml" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_180ml" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_375ml" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_750ml" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_1l" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_1l" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_750ml" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_375ml" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_180ml" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "brands" ALTER COLUMN "price_90ml" SET NOT NULL`);
    }
}
exports.MakePricesOptional1697088267000 = MakePricesOptional1697088267000;
//# sourceMappingURL=1697088267000-MakePricesOptional.js.map