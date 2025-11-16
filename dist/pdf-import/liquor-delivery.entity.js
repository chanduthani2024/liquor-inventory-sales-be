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
exports.LiquorDelivery = void 0;
const typeorm_1 = require("typeorm");
let LiquorDelivery = class LiquorDelivery {
};
exports.LiquorDelivery = LiquorDelivery;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LiquorDelivery.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LiquorDelivery.prototype, "brandNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LiquorDelivery.prototype, "brandName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LiquorDelivery.prototype, "productType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LiquorDelivery.prototype, "packType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LiquorDelivery.prototype, "packQtySize", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LiquorDelivery.prototype, "qtyCasesDelivered", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LiquorDelivery.prototype, "qtyBottlesDelivered", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LiquorDelivery.prototype, "unitRateBtlRate", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], LiquorDelivery.prototype, "rateCase", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], LiquorDelivery.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LiquorDelivery.prototype, "createdAt", void 0);
exports.LiquorDelivery = LiquorDelivery = __decorate([
    (0, typeorm_1.Entity)('liquor_deliveries')
], LiquorDelivery);
//# sourceMappingURL=liquor-delivery.entity.js.map