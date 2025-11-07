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
exports.AlcoholTypesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const alcohol_type_entity_1 = require("./alcohol-type.entity");
let AlcoholTypesService = class AlcoholTypesService {
    constructor(alcoholTypeRepository) {
        this.alcoholTypeRepository = alcoholTypeRepository;
    }
    async create(createDto) {
        const existingType = await this.alcoholTypeRepository.findOne({
            where: { name: createDto.name }
        });
        if (existingType) {
            throw new common_1.BadRequestException(`Alcohol type '${createDto.name}' already exists`);
        }
        const alcoholType = this.alcoholTypeRepository.create(createDto);
        return this.alcoholTypeRepository.save(alcoholType);
    }
    async findAll() {
        return this.alcoholTypeRepository.find({
            where: { is_active: true },
            order: { display_order: 'ASC', name: 'ASC' }
        });
    }
    async findOne(id) {
        const alcoholType = await this.alcoholTypeRepository.findOne({
            where: { id }
        });
        if (!alcoholType) {
            throw new common_1.NotFoundException(`Alcohol type with ID ${id} not found`);
        }
        return alcoholType;
    }
    async update(id, updateDto) {
        const alcoholType = await this.findOne(id);
        if (updateDto.name && updateDto.name !== alcoholType.name) {
            const existingType = await this.alcoholTypeRepository.findOne({
                where: { name: updateDto.name }
            });
            if (existingType) {
                throw new common_1.BadRequestException(`Alcohol type '${updateDto.name}' already exists`);
            }
        }
        Object.assign(alcoholType, updateDto);
        return this.alcoholTypeRepository.save(alcoholType);
    }
    async remove(id) {
        const alcoholType = await this.findOne(id);
        alcoholType.is_active = false;
        await this.alcoholTypeRepository.save(alcoholType);
    }
    async initializeDefaultTypes() {
        const defaultTypes = [
            { name: 'Vodka', description: 'Premium vodka brands', display_order: 1 },
            { name: 'Low Cost Whisky', description: 'Budget-friendly whisky options', display_order: 2 },
            { name: 'Mid Cost Whisky', description: 'Mid-range whisky brands', display_order: 3 },
            { name: 'High Cost Whisky', description: 'Premium whisky collection', display_order: 4 },
            { name: 'Beer', description: 'Beer and lager varieties', display_order: 5 },
            { name: 'Rum', description: 'Rum and dark spirits', display_order: 6 },
            { name: 'Wine', description: 'Wine and champagne', display_order: 7 },
        ];
        for (const typeData of defaultTypes) {
            const existing = await this.alcoholTypeRepository.findOne({
                where: { name: typeData.name }
            });
            if (!existing) {
                const alcoholType = this.alcoholTypeRepository.create(typeData);
                await this.alcoholTypeRepository.save(alcoholType);
            }
        }
    }
};
exports.AlcoholTypesService = AlcoholTypesService;
exports.AlcoholTypesService = AlcoholTypesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alcohol_type_entity_1.AlcoholType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AlcoholTypesService);
//# sourceMappingURL=alcohol-types.service.js.map