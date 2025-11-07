"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSizeEnumsAdd500ml1760248557375 = void 0;
class UpdateSizeEnumsAdd500ml1760248557375 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TYPE "stocks_size_enum" ADD VALUE '500ml';
        `);
        await queryRunner.query(`
            ALTER TYPE "sale_items_size_enum" ADD VALUE '500ml';
        `);
    }
    async down(queryRunner) {
        console.log('Rollback not implemented - PostgreSQL enum values cannot be easily removed');
    }
}
exports.UpdateSizeEnumsAdd500ml1760248557375 = UpdateSizeEnumsAdd500ml1760248557375;
//# sourceMappingURL=1760248557375-update-size-enums-add-500ml.js.map