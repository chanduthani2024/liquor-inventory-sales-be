import { DataSource } from 'typeorm';
import { Brand } from '../brands/brand.entity';
import { Stock } from '../stock/stock.entity';
import { seedAuthData } from './seed-auth';

export const seedData = async (dataSource: DataSource) => {
  const brandRepository = dataSource.getRepository(Brand);
  const stockRepository = dataSource.getRepository(Stock);

  // Clear existing data in proper order (child tables first)
  await dataSource.query('TRUNCATE TABLE "stocks", "sale_items", "sales", "brands" RESTART IDENTITY CASCADE');

  // Wine brands with dummy pricing data
  const brandsData = [
    {
      name: "Royal Challenge",
      price_90ml: 85.00,
      price_180ml: 170.00,
      price_330ml: 280.00,
      price_375ml: 340.00,
      price_500ml: 450.00,
      price_650ml: 585.00,
      price_750ml: 680.00,
      price_1l: 900.00,
      price_2l: 1750.00,
      description: "Premium Indian whisky blend"
    },
    {
      name: "McDowell's No.1",
      price_90ml: 75.00,
      price_180ml: 150.00,
      price_330ml: 248.00,
      price_375ml: 300.00,
      price_500ml: 400.00,
      price_650ml: 520.00,
      price_750ml: 600.00,
      price_1l: 800.00,
      price_2l: 1560.00,
      description: "Popular Indian whisky"
    },
    {
      name: "Old Monk",
      price_90ml: 60.00,
      price_180ml: 120.00,
      price_330ml: 198.00,
      price_375ml: 240.00,
      price_500ml: 320.00,
      price_650ml: 416.00,
      price_750ml: 480.00,
      price_1l: 640.00,
      price_2l: 1248.00,
      description: "Dark rum, Indian classic"
    },
    {
      name: "Bagpiper",
      price_90ml: 70.00,
      price_180ml: 140.00,
      price_330ml: 231.00,
      price_375ml: 280.00,
      price_500ml: 375.00,
      price_650ml: 487.50,
      price_750ml: 560.00,
      price_1l: 750.00,
      price_2l: 1462.50,
      description: "Indian whisky"
    },
    {
      name: "Officer's Choice",
      price_90ml: 65.00,
      price_180ml: 130.00,
      price_330ml: 214.50,
      price_375ml: 260.00,
      price_500ml: 350.00,
      price_650ml: 455.00,
      price_750ml: 520.00,
      price_1l: 700.00,
      price_2l: 1365.00,
      description: "Affordable Indian whisky"
    },
    {
      name: "Signature",
      price_90ml: 90.00,
      price_180ml: 180.00,
      price_330ml: 297.00,
      price_375ml: 360.00,
      price_500ml: 480.00,
      price_650ml: 624.00,
      price_750ml: 720.00,
      price_1l: 950.00,
      price_2l: 1852.50,
      description: "Premium rare grain whisky"
    },
    {
      name: "Imperial Blue",
      price_90ml: 80.00,
      price_180ml: 160.00,
      price_330ml: 264.00,
      price_375ml: 320.00,
      price_500ml: 425.00,
      price_650ml: 552.50,
      price_750ml: 640.00,
      price_1l: 850.00,
      price_2l: 1657.50,
      description: "Grain whisky blend"
    },
    {
      name: "Blenders Pride",
      price_90ml: 95.00,
      price_180ml: 190.00,
      price_330ml: 313.50,
      price_375ml: 380.00,
      price_500ml: 500.00,
      price_650ml: 650.00,
      price_750ml: 760.00,
      price_1l: 1000.00,
      price_2l: 1950.00,
      description: "Premium Indian whisky"
    }
  ];

  // Create brands
  const brands = [];
  for (const brandData of brandsData) {
    const brand = brandRepository.create(brandData);
    const savedBrand = await brandRepository.save(brand);
    brands.push(savedBrand);
  }

  // Create initial stock data
  const stockData = [];
  for (const brand of brands) {
    // Add random stock for each size
    const sizes = ['90ml', '180ml', '330ml', '375ml', '500ml', '650ml', '750ml', '1L', '2L'];
    
    for (const size of sizes) {
      const quantity = Math.floor(Math.random() * 50) + 10; // Random quantity between 10-60
      stockData.push({
        brand_id: brand.id,
        size: size,
        quantity: quantity,
      });
    }
  }

  // Save stock data
  for (const stock of stockData) {
    const stockEntry = stockRepository.create(stock);
    await stockRepository.save(stockEntry);
  }

  // Seed authentication data
  await seedAuthData(dataSource);

  console.log('Seed data created successfully!');
  console.log(`Created ${brands.length} brands and ${stockData.length} stock entries`);
};