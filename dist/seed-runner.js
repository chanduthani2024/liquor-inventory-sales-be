"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const seed_1 = require("./database/seed");
const brand_entity_1 = require("./brands/brand.entity");
const stock_entity_1 = require("./stock/stock.entity");
const sale_entity_1 = require("./sales/sale.entity");
const sale_item_entity_1 = require("./sales/sale-item.entity");
const user_entity_1 = require("./auth/user.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'chandu',
    database: process.env.DB_NAME || 'wine_shop',
    entities: [brand_entity_1.Brand, stock_entity_1.Stock, sale_entity_1.Sale, sale_item_entity_1.SaleItem, user_entity_1.User],
    synchronize: true,
});
async function runSeed() {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully');
        await (0, seed_1.seedData)(AppDataSource);
        await AppDataSource.destroy();
        console.log('Seeding completed and connection closed');
    }
    catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
}
runSeed();
//# sourceMappingURL=seed-runner.js.map