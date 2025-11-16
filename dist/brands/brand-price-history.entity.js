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
exports.BrandPriceHistory = void 0;
const typeorm_1 = require("typeorm");
const brand_entity_1 = require("./brand.entity");
const user_entity_1 = require("../auth/user.entity");
let BrandPriceHistory = class BrandPriceHistory {
};
exports.BrandPriceHistory = BrandPriceHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BrandPriceHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BrandPriceHistory.prototype, "brand_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BrandPriceHistory.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BrandPriceHistory.prototype, "old_price", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BrandPriceHistory.prototype, "new_price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], BrandPriceHistory.prototype, "changed_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BrandPriceHistory.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BrandPriceHistory.prototype, "changed_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => brand_entity_1.Brand, brand => brand.priceHistory),
    (0, typeorm_1.JoinColumn)({ name: 'brand_id' }),
    __metadata("design:type", brand_entity_1.Brand)
], BrandPriceHistory.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'changed_by' }),
    __metadata("design:type", user_entity_1.User)
], BrandPriceHistory.prototype, "user", void 0);
exports.BrandPriceHistory = BrandPriceHistory = __decorate([
    (0, typeorm_1.Entity)('brand_price_history')
], BrandPriceHistory);
//# sourceMappingURL=brand-price-history.entity.js.map