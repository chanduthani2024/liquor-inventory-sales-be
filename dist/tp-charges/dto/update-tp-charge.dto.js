"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTpChargeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_tp_charge_dto_1 = require("./create-tp-charge.dto");
class UpdateTpChargeDto extends (0, mapped_types_1.PartialType)(create_tp_charge_dto_1.CreateTpChargeDto) {
}
exports.UpdateTpChargeDto = UpdateTpChargeDto;
//# sourceMappingURL=update-tp-charge.dto.js.map