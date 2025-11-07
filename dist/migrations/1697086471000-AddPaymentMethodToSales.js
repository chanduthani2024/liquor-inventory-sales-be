"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPaymentMethodToSales1697086471000 = void 0;
class AddPaymentMethodToSales1697086471000 {
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE sales 
      ADD COLUMN payment_method ENUM('cash', 'online') NOT NULL DEFAULT 'cash'
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE sales 
      DROP COLUMN payment_method
    `);
    }
}
exports.AddPaymentMethodToSales1697086471000 = AddPaymentMethodToSales1697086471000;
//# sourceMappingURL=1697086471000-AddPaymentMethodToSales.js.map