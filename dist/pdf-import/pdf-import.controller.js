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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfImportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const pdf_import_service_1 = require("./pdf-import.service");
let PdfImportController = class PdfImportController {
    constructor(pdfImportService) {
        this.pdfImportService = pdfImportService;
    }
    async uploadLiquorDeliveryPDF(file) {
        try {
            console.log('Received file upload request:', {
                filename: file?.originalname,
                mimetype: file?.mimetype,
                size: file?.size
            });
            if (!file) {
                throw new common_1.BadRequestException('No file uploaded');
            }
            if (file.mimetype !== 'application/pdf') {
                throw new common_1.BadRequestException('Only PDF files are allowed');
            }
            if (file.size === 0) {
                throw new common_1.BadRequestException('Empty file uploaded');
            }
            const result = await this.pdfImportService.processLiquorDeliveryPDF(file);
            console.log('Upload processing completed:', result);
            return result;
        }
        catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }
    async getAllDeliveries() {
        try {
            const deliveries = await this.pdfImportService.findAll();
            return {
                status: 'success',
                count: deliveries.length,
                data: deliveries
            };
        }
        catch (error) {
            console.error('Error fetching deliveries:', error);
            throw error;
        }
    }
    async getDeliveryById(id) {
        try {
            const delivery = await this.pdfImportService.findById(+id);
            return {
                status: 'success',
                data: delivery
            };
        }
        catch (error) {
            console.error('Error fetching delivery:', error);
            throw error;
        }
    }
    async deleteDelivery(id) {
        try {
            await this.pdfImportService.deleteById(+id);
            return {
                status: 'success',
                message: `Delivery record ${id} deleted successfully`
            };
        }
        catch (error) {
            console.error('Error deleting delivery:', error);
            throw error;
        }
    }
    async getImportHistory() {
        try {
            const history = await this.pdfImportService.getImportHistory();
            return {
                status: 'success',
                count: history.length,
                data: history
            };
        }
        catch (error) {
            console.error('Error fetching import history:', error);
            throw error;
        }
    }
    async getImportHistoryById(id) {
        try {
            const history = await this.pdfImportService.getImportHistoryById(+id);
            return {
                status: 'success',
                data: history
            };
        }
        catch (error) {
            console.error('Error fetching import history:', error);
            throw error;
        }
    }
};
exports.PdfImportController = PdfImportController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PdfImportController.prototype, "uploadLiquorDeliveryPDF", null);
__decorate([
    (0, common_1.Get)('deliveries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PdfImportController.prototype, "getAllDeliveries", null);
__decorate([
    (0, common_1.Get)('deliveries/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PdfImportController.prototype, "getDeliveryById", null);
__decorate([
    (0, common_1.Delete)('deliveries/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PdfImportController.prototype, "deleteDelivery", null);
__decorate([
    (0, common_1.Get)('history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PdfImportController.prototype, "getImportHistory", null);
__decorate([
    (0, common_1.Get)('history/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PdfImportController.prototype, "getImportHistoryById", null);
exports.PdfImportController = PdfImportController = __decorate([
    (0, common_1.Controller)('pdf-import'),
    __metadata("design:paramtypes", [pdf_import_service_1.PdfImportService])
], PdfImportController);
//# sourceMappingURL=pdf-import.controller.js.map