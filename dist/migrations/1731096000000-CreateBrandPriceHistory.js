"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBrandPriceHistory1731096000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateBrandPriceHistory1731096000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'brand_price_history',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'brand_id',
                    type: 'int',
                    comment: 'ID of the brand whose price was changed',
                },
                {
                    name: 'size',
                    type: 'varchar',
                    length: '10',
                    comment: 'Size of the bottle (90ml, 180ml, 750ml, 1L, etc.)',
                },
                {
                    name: 'old_price',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                    comment: 'Previous price (null if price was being set for first time)',
                },
                {
                    name: 'new_price',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: true,
                    comment: 'New price (null if price was removed/cleared)',
                },
                {
                    name: 'changed_by',
                    type: 'int',
                    isNullable: true,
                    comment: 'ID of the user who made the change',
                },
                {
                    name: 'notes',
                    type: 'text',
                    isNullable: true,
                    comment: 'Optional notes about the price change',
                },
                {
                    name: 'changed_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                    comment: 'Timestamp when the price was changed',
                },
            ],
        }), true);
        await queryRunner.createForeignKey('brand_price_history', new typeorm_1.TableForeignKey({
            columnNames: ['brand_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'brands',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('brand_price_history', new typeorm_1.TableForeignKey({
            columnNames: ['changed_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createIndex('brand_price_history', new typeorm_1.TableIndex({
            name: 'IDX_brand_price_history_brand_id',
            columnNames: ['brand_id'],
        }));
        await queryRunner.createIndex('brand_price_history', new typeorm_1.TableIndex({
            name: 'IDX_brand_price_history_changed_at',
            columnNames: ['changed_at'],
        }));
        await queryRunner.createIndex('brand_price_history', new typeorm_1.TableIndex({
            name: 'IDX_brand_price_history_brand_size_date',
            columnNames: ['brand_id', 'size', 'changed_at'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('brand_price_history');
    }
}
exports.CreateBrandPriceHistory1731096000000 = CreateBrandPriceHistory1731096000000;
//# sourceMappingURL=1731096000000-CreateBrandPriceHistory.js.map