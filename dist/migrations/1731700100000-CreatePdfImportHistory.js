"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePdfImportHistory1731700100000 = void 0;
const typeorm_1 = require("typeorm");
class CreatePdfImportHistory1731700100000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'pdf_import_history',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'import_identifier',
                    type: 'varchar',
                    length: '100',
                    comment: 'Unique identifier for this import batch (e.g., LQDEL-timestamp)',
                },
                {
                    name: 'filename',
                    type: 'varchar',
                    length: '255',
                    comment: 'Original PDF filename',
                },
                {
                    name: 'total_items',
                    type: 'int',
                    comment: 'Total number of items in the PDF',
                },
                {
                    name: 'items_processed',
                    type: 'int',
                    comment: 'Number of items successfully processed',
                },
                {
                    name: 'brands_created',
                    type: 'int',
                    default: 0,
                    comment: 'Number of new brands created during import',
                },
                {
                    name: 'brands_updated',
                    type: 'int',
                    default: 0,
                    comment: 'Number of existing brands updated',
                },
                {
                    name: 'stocks_added',
                    type: 'int',
                    default: 0,
                    comment: 'Number of stock records added',
                },
                {
                    name: 'total_bottles_added',
                    type: 'int',
                    default: 0,
                    comment: 'Total number of bottles added to inventory',
                },
                {
                    name: 'import_status',
                    type: 'varchar',
                    length: '50',
                    default: "'success'",
                    comment: 'success, partial, failed',
                },
                {
                    name: 'error_message',
                    type: 'text',
                    isNullable: true,
                    comment: 'Error details if import failed',
                },
                {
                    name: 'import_details',
                    type: 'json',
                    isNullable: true,
                    comment: 'Detailed JSON of all processed items',
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
    }
    async down(queryRunner) {
        await queryRunner.dropTable('pdf_import_history');
    }
}
exports.CreatePdfImportHistory1731700100000 = CreatePdfImportHistory1731700100000;
//# sourceMappingURL=1731700100000-CreatePdfImportHistory.js.map