import { DataSource } from 'typeorm';
import { Brand } from './src/brands/brand.entity';
import { BrandPriceHistory } from './src/brands/brand-price-history.entity';
import { Stock } from './src/stock/stock.entity';
import { Sale } from './src/sales/sale.entity';
import { SaleItem } from './src/sales/sale-item.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'aws-1-ap-south-1.pooler.supabase.com',
  port: 5432,
  username: 'postgres.wbmhdagvgnedroltowfw',
  password: 'Chandu@saicharan@1',
  database: 'postgres',
  entities: [Brand, BrandPriceHistory, Stock, Sale, SaleItem],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Important: set to false for migrations
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    // Force IPv4 to avoid IPv6 connection issues
    family: 4,
    connectionTimeoutMillis: 10000,
    query_timeout: 10000,
    statement_timeout: 10000,
  },
});