import { Injectable } from '@nestjs/common';
import { SalesService } from '../sales/sales.service';
import { StockService } from '../stock/stock.service';
import { BrandsService } from '../brands/brands.service';
import { StockMovementsService } from '../stock-movements/stock-movements.service';

@Injectable()
export class DashboardService {
  constructor(
    private salesService: SalesService,
    private stockService: StockService,
    private brandsService: BrandsService,
    private stockMovementsService: StockMovementsService,
  ) {}

  async getDashboardData(startDate?: Date, endDate?: Date) {
    const [
      totalRevenue,
      totalStockValue,
      topSellingBrands,
      salesByBrand,
      currentStock,
      totalBrands,
      lowStockItems,
    ] = await Promise.all([
      this.getComprehensiveTotalRevenue(startDate, endDate),
      this.stockService.getTotalStockValue(),
      this.getComprehensiveTopSellingBrands(10, startDate, endDate),
      this.getComprehensiveSalesByBrand(startDate, endDate),
      this.stockService.findAll(),
      this.brandsService.findAll(),
      this.getLowStockItems(5), // Items with 5 or fewer bottles
    ]);

    return {
      summary: {
        totalRevenue,
        totalStockValue,
        totalBrands: totalBrands.length,
        totalStockItems: currentStock.reduce((sum, item) => sum + item.quantity, 0),
        lowStockCount: lowStockItems.length,
      },
      topSellingBrands,
      salesByBrand,
      currentStock: currentStock.map(stock => ({
        ...stock,
        brand_name: stock.brand.name,
      })),
      lowStockItems: lowStockItems.map(stock => ({
        ...stock,
        brand_name: stock.brand.name,
      })),
      dateRange: {
        startDate,
        endDate,
      },
    };
  }

  async getRevenueByDate(startDate: Date, endDate: Date) {
    return await this.salesService.findByDateRange(startDate, endDate);
  }

  async getLowStockItems(threshold: number = 10) {
    const allStock = await this.stockService.findAll();
    return allStock.filter(stock => stock.quantity <= threshold);
  }

  async getBrandPerformance(brandId?: number, startDate?: Date, endDate?: Date) {
    if (brandId) {
      const [stockValue, salesData] = await Promise.all([
        this.stockService.getStockValueByBrand(brandId),
        this.salesService.getSalesByBrand(startDate, endDate),
      ]);

      const brandSales = salesData.filter(sale => sale.brand_id === brandId);
      
      return {
        brandId,
        stockValue,
        sales: brandSales,
      };
    }

    const allBrands = await this.brandsService.findAll();
    const performance = await Promise.all(
      allBrands.map(async (brand) => {
        const [stockValue, salesData] = await Promise.all([
          this.stockService.getStockValueByBrand(brand.id),
          this.salesService.getSalesByBrand(startDate, endDate),
        ]);

        const brandSales = salesData.filter(sale => sale.brand_id === brand.id);
        const totalRevenue = brandSales.reduce((sum, sale) => sum + parseFloat(sale.total_revenue), 0);
        const totalQuantitySold = brandSales.reduce((sum, sale) => sum + parseInt(sale.total_quantity), 0);

        return {
          brandId: brand.id,
          brandName: brand.name,
          stockValue,
          totalRevenue,
          totalQuantitySold,
          sales: brandSales,
        };
      })
    );

    return performance.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  private async getComprehensiveTotalRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    // If no date range specified, use today
    if (!startDate || !endDate) {
      const today = new Date();
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    }

    let totalRevenue = 0;

    // Handle single day vs date range
    if (this.isSameDay(startDate, endDate)) {
      // Single day - use stock report method which includes both actual sales and manual entries
      const reportDate = startDate.toISOString().split('T')[0];
      const stockReports = await this.stockMovementsService.getStockReport({
        start_date: reportDate,
        end_date: reportDate,
      });
      
      totalRevenue = stockReports.reduce((sum, report) => sum + (report.sales_amount || 0), 0);
    } else {
      // Date range - iterate through each day
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const reportDate = currentDate.toISOString().split('T')[0];
        const stockReports = await this.stockMovementsService.getStockReport({
          start_date: reportDate,
          end_date: reportDate,
        });
        
        const dayRevenue = stockReports.reduce((sum, report) => sum + (report.sales_amount || 0), 0);
        totalRevenue += dayRevenue;
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return totalRevenue;
  }

  private async getComprehensiveTopSellingBrands(limit: number = 10, startDate?: Date, endDate?: Date): Promise<any[]> {
    // If no date range specified, use today
    if (!startDate || !endDate) {
      const today = new Date();
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    }

    const brandSizeSalesMap = new Map();

    // Handle single day vs date range
    if (this.isSameDay(startDate, endDate)) {
      // Single day - use stock report method
      const reportDate = startDate.toISOString().split('T')[0];
      const stockReports = await this.stockMovementsService.getStockReport({
        start_date: reportDate,
        end_date: reportDate,
      });
      
      // Aggregate by brand + size combination
      stockReports.forEach(report => {
        if (report.sales_quantity > 0 || report.sales_amount > 0) {
          const key = `${report.brand_name}-${report.size}`;
          brandSizeSalesMap.set(key, { 
            brand_name: report.brand_name,
            size: report.size,
            total_quantity: report.sales_quantity, 
            total_revenue: report.sales_amount 
          });
        }
      });
    } else {
      // Date range - iterate through each day
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const reportDate = currentDate.toISOString().split('T')[0];
        const stockReports = await this.stockMovementsService.getStockReport({
          start_date: reportDate,
          end_date: reportDate,
        });
        
        // Aggregate by brand + size combination
        stockReports.forEach(report => {
          if (report.sales_quantity > 0 || report.sales_amount > 0) {
            const key = `${report.brand_name}-${report.size}`;
            const existing = brandSizeSalesMap.get(key) || { 
              brand_name: report.brand_name,
              size: report.size,
              total_quantity: 0, 
              total_revenue: 0 
            };
            existing.total_quantity += report.sales_quantity;
            existing.total_revenue += report.sales_amount;
            brandSizeSalesMap.set(key, existing);
          }
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Convert to array, sort by revenue, and limit results
    return Array.from(brandSizeSalesMap.values())
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, limit);
  }

  private async getComprehensiveSalesByBrand(startDate?: Date, endDate?: Date): Promise<any[]> {
    // If no date range specified, use today
    if (!startDate || !endDate) {
      const today = new Date();
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    }

    const brandSizeSalesMap = new Map();

    // Handle single day vs date range
    if (this.isSameDay(startDate, endDate)) {
      // Single day - use stock report method
      const reportDate = startDate.toISOString().split('T')[0];
      const stockReports = await this.stockMovementsService.getStockReport({
        start_date: reportDate,
        end_date: reportDate,
      });
      
      // Aggregate by brand and size
      stockReports.forEach(report => {
        if (report.sales_quantity > 0 || report.sales_amount > 0) {
          const key = `${report.brand_name}-${report.size}`;
          brandSizeSalesMap.set(key, {
            brand_name: report.brand_name,
            size: report.size,
            total_quantity: report.sales_quantity.toString(),
            total_revenue: report.sales_amount.toString(),
          });
        }
      });
    } else {
      // Date range - iterate through each day
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const reportDate = currentDate.toISOString().split('T')[0];
        const stockReports = await this.stockMovementsService.getStockReport({
          start_date: reportDate,
          end_date: reportDate,
        });
        
        // Aggregate by brand and size
        stockReports.forEach(report => {
          if (report.sales_quantity > 0 || report.sales_amount > 0) {
            const key = `${report.brand_name}-${report.size}`;
            const existing = brandSizeSalesMap.get(key) || { 
              brand_name: report.brand_name, 
              size: report.size,
              total_quantity: 0, 
              total_revenue: 0 
            };
            existing.total_quantity += report.sales_quantity;
            existing.total_revenue += report.sales_amount;
            brandSizeSalesMap.set(key, {
              brand_name: existing.brand_name,
              size: existing.size,
              total_quantity: existing.total_quantity.toString(),
              total_revenue: existing.total_revenue.toString(),
            });
          }
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Convert to array and sort by revenue
    return Array.from(brandSizeSalesMap.values())
      .sort((a, b) => parseFloat(b.total_revenue) - parseFloat(a.total_revenue));
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}