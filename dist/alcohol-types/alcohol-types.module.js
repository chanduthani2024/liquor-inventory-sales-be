"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlcoholTypesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const alcohol_types_controller_1 = require("./alcohol-types.controller");
const alcohol_types_service_1 = require("./alcohol-types.service");
const alcohol_type_entity_1 = require("./alcohol-type.entity");
let AlcoholTypesModule = class AlcoholTypesModule {
};
exports.AlcoholTypesModule = AlcoholTypesModule;
exports.AlcoholTypesModule = AlcoholTypesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([alcohol_type_entity_1.AlcoholType])],
        controllers: [alcohol_types_controller_1.AlcoholTypesController],
        providers: [alcohol_types_service_1.AlcoholTypesService],
        exports: [alcohol_types_service_1.AlcoholTypesService],
    })
], AlcoholTypesModule);
//# sourceMappingURL=alcohol-types.module.js.map