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
exports.Brand = exports.BottleSize = void 0;
const typeorm_1 = require("typeorm");
const stock_entity_1 = require("../stock/stock.entity");
const sale_item_entity_1 = require("../sales/sale-item.entity");
const alcohol_type_entity_1 = require("../alcohol-types/alcohol-type.entity");
const brand_price_history_entity_1 = require("./brand-price-history.entity");
var BottleSize;
(function (BottleSize) {
    BottleSize["ML_90"] = "90ml";
    BottleSize["ML_180"] = "180ml";
    BottleSize["ML_330"] = "330ml";
    BottleSize["ML_375"] = "375ml";
    BottleSize["ML_500"] = "500ml";
    BottleSize["ML_650"] = "650ml";
    BottleSize["ML_750"] = "750ml";
    BottleSize["L_1"] = "1L";
    BottleSize["L_2"] = "2L";
})(BottleSize || (exports.BottleSize = BottleSize = {}));
let Brand = class Brand {
};
exports.Brand = Brand;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Brand.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Brand.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true, length: 50, comment: 'Unique brand number/SKU for inventory tracking' }),
    __metadata("design:type", String)
], Brand.prototype, "brand_number", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "price_90ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "price_180ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "price_375ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "price_500ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "price_750ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "price_330ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "price_650ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "price_1l", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "price_2l", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "actual_price_90ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "actual_price_180ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "actual_price_330ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "actual_price_375ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "actual_price_500ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "actual_price_650ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "actual_price_750ml", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "actual_price_1l", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true, default: null }),
    __metadata("design:type", Number)
], Brand.prototype, "actual_price_2l", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Brand.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Brand.prototype, "alcohol_type_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => alcohol_type_entity_1.AlcoholType, alcoholType => alcoholType.brands, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'alcohol_type_id' }),
    __metadata("design:type", alcohol_type_entity_1.AlcoholType)
], Brand.prototype, "alcoholType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Brand.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Brand.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_entity_1.Stock, stock => stock.brand),
    __metadata("design:type", Array)
], Brand.prototype, "stocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_item_entity_1.SaleItem, saleItem => saleItem.brand),
    __metadata("design:type", Array)
], Brand.prototype, "saleItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => brand_price_history_entity_1.BrandPriceHistory, priceHistory => priceHistory.brand),
    __metadata("design:type", Array)
], Brand.prototype, "priceHistory", void 0);
exports.Brand = Brand = __decorate([
    (0, typeorm_1.Entity)('brands')
], Brand);
//# sourceMappingURL=brand.entity.js.map