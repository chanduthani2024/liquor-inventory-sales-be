"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfImportModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pdf_import_controller_1 = require("./pdf-import.controller");
const pdf_import_service_1 = require("./pdf-import.service");
const liquor_delivery_entity_1 = require("./liquor-delivery.entity");
const pdf_import_history_entity_1 = require("./pdf-import-history.entity");
const brand_entity_1 = require("../brands/brand.entity");
const stock_entity_1 = require("../stock/stock.entity");
const stock_movement_entity_1 = require("../stock-movements/stock-movement.entity");
let PdfImportModule = class PdfImportModule {
};
exports.PdfImportModule = PdfImportModule;
exports.PdfImportModule = PdfImportModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                liquor_delivery_entity_1.LiquorDelivery,
                pdf_import_history_entity_1.PdfImportHistory,
                brand_entity_1.Brand,
                stock_entity_1.Stock,
                stock_movement_entity_1.StockMovement,
            ])
        ],
        controllers: [pdf_import_controller_1.PdfImportController],
        providers: [pdf_import_service_1.PdfImportService],
        exports: [pdf_import_service_1.PdfImportService],
    })
], PdfImportModule);
//# sourceMappingURL=pdf-import.module.js.map