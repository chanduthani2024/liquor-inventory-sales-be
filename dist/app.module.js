"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const brands_module_1 = require("./brands/brands.module");
const stock_module_1 = require("./stock/stock.module");
const sales_module_1 = require("./sales/sales.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const stock_movements_module_1 = require("./stock-movements/stock-movements.module");
const tp_charges_module_1 = require("./tp-charges/tp-charges.module");
const cash_reconciliation_module_1 = require("./cash-reconciliation/cash-reconciliation.module");
const auth_module_1 = require("./auth/auth.module");
const alcohol_types_module_1 = require("./alcohol-types/alcohol-types.module");
const pdf_import_module_1 = require("./pdf-import/pdf-import.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'db.wbmhdagvgnedroltowfw.supabase.co',
                port: parseInt(process.env.DB_PORT) || 5432,
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || 'Chandu@saicharan@1',
                database: process.env.DB_NAME || 'postgres',
                autoLoadEntities: true,
                synchronize: true,
                ssl: {
                    rejectUnauthorized: false,
                },
                extra: {
                    family: 4,
                    connectionTimeoutMillis: 10000,
                    query_timeout: 10000,
                    statement_timeout: 10000,
                },
            }),
            brands_module_1.BrandsModule,
            stock_module_1.StockModule,
            sales_module_1.SalesModule,
            dashboard_module_1.DashboardModule,
            stock_movements_module_1.StockMovementsModule,
            tp_charges_module_1.TpChargesModule,
            cash_reconciliation_module_1.CashReconciliationModule,
            auth_module_1.AuthModule,
            alcohol_types_module_1.AlcoholTypesModule,
            pdf_import_module_1.PdfImportModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map