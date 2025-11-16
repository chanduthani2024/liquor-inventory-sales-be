import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsModule } from './brands/brands.module';
import { StockModule } from './stock/stock.module';
import { SalesModule } from './sales/sales.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { TpChargesModule } from './tp-charges/tp-charges.module';
import { CashReconciliationModule } from './cash-reconciliation/cash-reconciliation.module';
import { AuthModule } from './auth/auth.module';
import { AlcoholTypesModule } from './alcohol-types/alcohol-types.module';
import { PdfImportModule } from './pdf-import/pdf-import.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db.wbmhdagvgnedroltowfw.supabase.co',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'Chandu@saicharan@1',
      database: process.env.DB_NAME || 'postgres',
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),
    BrandsModule,
    StockModule,
    SalesModule,
    DashboardModule,
    StockMovementsModule,
    TpChargesModule,
    CashReconciliationModule,
    AuthModule,
    AlcoholTypesModule,
    PdfImportModule,
  ],
})
export class AppModule {}