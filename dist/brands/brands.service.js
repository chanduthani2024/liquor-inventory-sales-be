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
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const brand_entity_1 = require("./brand.entity");
let BrandsService = class BrandsService {
    constructor(brandsRepository) {
        this.brandsRepository = brandsRepository;
    }
    async create(createBrandDto) {
        const brand = this.brandsRepository.create(createBrandDto);
        return await this.brandsRepository.save(brand);
    }
    async findAll() {
        return await this.brandsRepository.find({
            relations: ['stocks', 'alcoholType'],
            order: { name: 'ASC' },
        });
    }
    async findByAlcoholType(alcoholTypeId) {
        return await this.brandsRepository.find({
            where: { alcohol_type_id: alcoholTypeId },
            relations: ['stocks', 'alcoholType'],
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const brand = await this.brandsRepository.findOne({
            where: { id },
            relations: ['stocks', 'alcoholType'],
        });
        if (!brand) {
            throw new common_1.NotFoundException(`Brand with ID ${id} not found`);
        }
        return brand;
    }
    async update(id, updateBrandDto) {
        const brand = await this.findOne(id);
        Object.assign(brand, updateBrandDto);
        return await this.brandsRepository.save(brand);
    }
    async remove(id) {
        const brand = await this.findOne(id);
        await this.brandsRepository.remove(brand);
    }
    async getPriceForSize(brandId, size) {
        const brand = await this.findOne(brandId);
        let price;
        switch (size) {
            case '90ml':
                price = brand.price_90ml;
                break;
            case '180ml':
                price = brand.price_180ml;
                break;
            case '330ml':
                price = brand.price_330ml;
                break;
            case '375ml':
                price = brand.price_375ml;
                break;
            case '500ml':
                price = brand.price_500ml;
                break;
            case '650ml':
                price = brand.price_650ml;
                break;
            case '750ml':
                price = brand.price_750ml;
                break;
            case '1L':
                price = brand.price_1l;
                break;
            case '2L':
                price = brand.price_2l;
                break;
            default:
                throw new common_1.NotFoundException(`Size ${size} not found for brand`);
        }
        if (price === null) {
            throw new common_1.NotFoundException(`Price for size ${size} is not set for brand ${brand.name}`);
        }
        return price;
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(brand_entity_1.Brand)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BrandsService);
//# sourceMappingURL=brands.service.js.map