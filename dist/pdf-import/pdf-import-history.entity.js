"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfImportHistory = void 0;
const typeorm_1 = require("typeorm");
let PdfImportHistory = class PdfImportHistory {
};
exports.PdfImportHistory = PdfImportHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PdfImportHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, comment: 'Unique identifier for this import batch' }),
    __metadata("design:type", String)
], PdfImportHistory.prototype, "importIdentifier", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, comment: 'Original PDF filename' }),
    __metadata("design:type", String)
], PdfImportHistory.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: 'Total number of items in the PDF' }),
    __metadata("design:type", Number)
], PdfImportHistory.prototype, "totalItems", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: 'Number of items successfully processed' }),
    __metadata("design:type", Number)
], PdfImportHistory.prototype, "itemsProcessed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: 'Number of new brands created during import' }),
    __metadata("design:type", Number)
], PdfImportHistory.prototype, "brandsCreated", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: 'Number of existing brands updated' }),
    __metadata("design:type", Number)
], PdfImportHistory.prototype, "brandsUpdated", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: 'Number of stock records added' }),
    __metadata("design:type", Number)
], PdfImportHistory.prototype, "stocksAdded", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, comment: 'Total number of bottles added to inventory' }),
    __metadata("design:type", Number)
], PdfImportHistory.prototype, "totalBottlesAdded", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, default: 'success', comment: 'success, partial, failed' }),
    __metadata("design:type", String)
], PdfImportHistory.prototype, "importStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, comment: 'Error details if import failed' }),
    __metadata("design:type", String)
], PdfImportHistory.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true, comment: 'Detailed JSON of all processed items' }),
    __metadata("design:type", Object)
], PdfImportHistory.prototype, "importDetails", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PdfImportHistory.prototype, "createdAt", void 0);
exports.PdfImportHistory = PdfImportHistory = __decorate([
    (0, typeorm_1.Entity)('pdf_import_history')
], PdfImportHistory);
//# sourceMappingURL=pdf-import-history.entity.js.map