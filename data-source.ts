import { DataSource } from 'typeorm';
import { Brand } from './src/brands/brand.entity';
import { Stock } from './src/stock/stock.entity';
import { Sale } from './src/sales/sale.entity';
import { SaleItem } from './src/sales/sale-item.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'chandu',
  database: 'wine_shop',
  entities: [Brand, Stock, Sale, SaleItem],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Important: set to false for migrations
  logging: false,
});