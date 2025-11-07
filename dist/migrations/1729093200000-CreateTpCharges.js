"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTpCharges1729093200000 = void 0;
const typeorm_1 = require("typeorm");
class CreateTpCharges1729093200000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'tp_charges',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'date',
                    type: 'date',
                    comment: 'Date for which the TP charges are recorded',
                },
                {
                    name: 'amount',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    comment: 'Total TP charges amount for the day',
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true,
                    comment: 'Description of the charges (optional)',
                },
                {
                    name: 'notes',
                    type: 'text',
                    isNullable: true,
                    comment: 'Additional notes about the charges',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createIndex('tp_charges', new typeorm_1.TableIndex({
            name: 'IDX_tp_charges_date',
            columnNames: ['date'],
            isUnique: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('tp_charges');
    }
}
exports.CreateTpCharges1729093200000 = CreateTpCharges1729093200000;
//# sourceMappingURL=1729093200000-CreateTpCharges.js.map