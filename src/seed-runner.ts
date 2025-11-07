import { DataSource } from 'typeorm';
import { seedData } from './database/seed';
import { Brand } from './brands/brand.entity';
import { Stock } from './stock/stock.entity';
import { Sale } from './sales/sale.entity';
import { SaleItem } from './sales/sale-item.entity';
import { User } from './auth/user.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'chandu',
  database: process.env.DB_NAME || 'wine_shop',
  entities: [Brand, Stock, Sale, SaleItem, User],
  synchronize: true,
});

async function runSeed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
    
    await seedData(AppDataSource);
    
    await AppDataSource.destroy();
    console.log('Seeding completed and connection closed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

runSeed();