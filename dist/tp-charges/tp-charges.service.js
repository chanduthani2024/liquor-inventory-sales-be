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
exports.TpChargesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tp_charge_entity_1 = require("./tp-charge.entity");
let TpChargesService = class TpChargesService {
    constructor(tpChargesRepository) {
        this.tpChargesRepository = tpChargesRepository;
    }
    async create(createTpChargeDto) {
        const existingCharge = await this.tpChargesRepository.findOne({
            where: { date: createTpChargeDto.date },
        });
        if (existingCharge) {
            throw new common_1.ConflictException(`TP charges already recorded for date ${createTpChargeDto.date}. Use update instead.`);
        }
        const tpCharge = this.tpChargesRepository.create(createTpChargeDto);
        return await this.tpChargesRepository.save(tpCharge);
    }
    async findAll() {
        return await this.tpChargesRepository.find({
            order: { date: 'DESC' },
        });
    }
    async findByDate(date) {
        return await this.tpChargesRepository.findOne({
            where: { date },
        });
    }
    async findByDateRange(startDate, endDate) {
        return await this.tpChargesRepository
            .createQueryBuilder('tp_charge')
            .where('tp_charge.date >= :startDate AND tp_charge.date <= :endDate', {
            startDate,
            endDate,
        })
            .orderBy('tp_charge.date', 'DESC')
            .getMany();
    }
    async findOne(id) {
        const tpCharge = await this.tpChargesRepository.findOne({
            where: { id },
        });
        if (!tpCharge) {
            throw new common_1.NotFoundException(`TP charge with ID ${id} not found`);
        }
        return tpCharge;
    }
    async update(id, updateTpChargeDto) {
        const tpCharge = await this.findOne(id);
        if (updateTpChargeDto.date && updateTpChargeDto.date !== tpCharge.date) {
            const existingCharge = await this.tpChargesRepository.findOne({
                where: { date: updateTpChargeDto.date },
            });
            if (existingCharge) {
                throw new common_1.ConflictException(`TP charges already recorded for date ${updateTpChargeDto.date}`);
            }
        }
        Object.assign(tpCharge, updateTpChargeDto);
        return await this.tpChargesRepository.save(tpCharge);
    }
    async remove(id) {
        const tpCharge = await this.findOne(id);
        await this.tpChargesRepository.remove(tpCharge);
    }
    async getTotalForMonth(year, month) {
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
        const result = await this.tpChargesRepository
            .createQueryBuilder('tp_charge')
            .select('SUM(tp_charge.amount)', 'total')
            .where('tp_charge.date >= :startDate AND tp_charge.date <= :endDate', {
            startDate,
            endDate,
        })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getTotalForDateRange(startDate, endDate) {
        const result = await this.tpChargesRepository
            .createQueryBuilder('tp_charge')
            .select('SUM(tp_charge.amount)', 'total')
            .where('tp_charge.date >= :startDate AND tp_charge.date <= :endDate', {
            startDate,
            endDate,
        })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
};
exports.TpChargesService = TpChargesService;
exports.TpChargesService = TpChargesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tp_charge_entity_1.TpCharge)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TpChargesService);
//# sourceMappingURL=tp-charges.service.js.map