"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("../sales/sales.service");
const stock_service_1 = require("../stock/stock.service");
const brands_service_1 = require("../brands/brands.service");
const stock_movements_service_1 = require("../stock-movements/stock-movements.service");
let DashboardService = class DashboardService {
    constructor(salesService, stockService, brandsService, stockMovementsService) {
        this.salesService = salesService;
        this.stockService = stockService;
        this.brandsService = brandsService;
        this.stockMovementsService = stockMovementsService;
    }
    async getDashboardData(startDate, endDate) {
        const [totalRevenue, totalStockValue, topSellingBrands, salesByBrand, currentStock, totalBrands, lowStockItems, profitData,] = await Promise.all([
            this.getComprehensiveTotalRevenue(startDate, endDate),
            this.stockService.getTotalStockValue(),
            this.getComprehensiveTopSellingBrands(10, startDate, endDate),
            this.getComprehensiveSalesByBrand(startDate, endDate),
            this.stockService.findAll(),
            this.brandsService.findAll(),
            this.getLowStockItems(5),
            this.getProfitData(startDate, endDate),
        ]);
        return {
            summary: {
                totalRevenue,
                totalStockValue,
                totalBrands: totalBrands.length,
                totalStockItems: currentStock.reduce((sum, item) => sum + item.quantity, 0),
                lowStockCount: lowStockItems.length,
                totalProfit: profitData.totalProfit,
                profitMargin: profitData.profitMargin,
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
    async getRevenueByDate(startDate, endDate) {
        return await this.salesService.findByDateRange(startDate, endDate);
    }
    async getLowStockItems(threshold = 10) {
        const allStock = await this.stockService.findAll();
        return allStock.filter(stock => stock.quantity <= threshold);
    }
    async getBrandPerformance(brandId, startDate, endDate) {
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
        const performance = await Promise.all(allBrands.map(async (brand) => {
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
        }));
        return performance.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }
    async getComprehensiveTotalRevenue(startDate, endDate) {
        if (!startDate || !endDate) {
            const today = new Date();
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        }
        let totalRevenue = 0;
        if (this.isSameDay(startDate, endDate)) {
            const reportDate = startDate.toISOString().split('T')[0];
            const stockReports = await this.stockMovementsService.getStockReport({
                start_date: reportDate,
                end_date: reportDate,
            });
            totalRevenue = stockReports.reduce((sum, report) => sum + (report.sales_amount || 0), 0);
        }
        else {
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
    async getComprehensiveTopSellingBrands(limit = 10, startDate, endDate) {
        if (!startDate || !endDate) {
            const today = new Date();
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        }
        const brandSizeSalesMap = new Map();
        if (this.isSameDay(startDate, endDate)) {
            const reportDate = startDate.toISOString().split('T')[0];
            const stockReports = await this.stockMovementsService.getStockReport({
                start_date: reportDate,
                end_date: reportDate,
            });
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
        }
        else {
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const reportDate = currentDate.toISOString().split('T')[0];
                const stockReports = await this.stockMovementsService.getStockReport({
                    start_date: reportDate,
                    end_date: reportDate,
                });
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
        return Array.from(brandSizeSalesMap.values())
            .sort((a, b) => b.total_revenue - a.total_revenue)
            .slice(0, limit);
    }
    async getComprehensiveSalesByBrand(startDate, endDate) {
        if (!startDate || !endDate) {
            const today = new Date();
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        }
        const brandSizeSalesMap = new Map();
        if (this.isSameDay(startDate, endDate)) {
            const reportDate = startDate.toISOString().split('T')[0];
            const stockReports = await this.stockMovementsService.getStockReport({
                start_date: reportDate,
                end_date: reportDate,
            });
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
        }
        else {
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const reportDate = currentDate.toISOString().split('T')[0];
                const stockReports = await this.stockMovementsService.getStockReport({
                    start_date: reportDate,
                    end_date: reportDate,
                });
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
        return Array.from(brandSizeSalesMap.values())
            .sort((a, b) => parseFloat(b.total_revenue) - parseFloat(a.total_revenue));
    }
    async getProfitData(startDate, endDate) {
        try {
            const startDateStr = startDate ? startDate.toISOString().split('T')[0] : undefined;
            const endDateStr = endDate ? endDate.toISOString().split('T')[0] : undefined;
            console.log('🔍 [Dashboard Service] getProfitData called with:');
            console.log('   Original startDate:', startDate);
            console.log('   Original endDate:', endDate);
            console.log('   Converted startDateStr:', startDateStr);
            console.log('   Converted endDateStr:', endDateStr);
            const profitSummary = await this.brandsService.getProfitSummary(startDateStr, endDateStr);
            console.log('🔍 [Dashboard Service] Profit summary result:');
            console.log('   Total Profit:', profitSummary.overall_summary?.total_profit);
            console.log('   Profit Margin:', profitSummary.overall_summary?.profit_margin);
            return {
                totalProfit: profitSummary.overall_summary?.total_profit || 0,
                profitMargin: profitSummary.overall_summary?.profit_margin || 0,
            };
        }
        catch (error) {
            console.error('Error calculating profit data for dashboard:', error);
            return {
                totalProfit: 0,
                profitMargin: 0,
            };
        }
    }
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sales_service_1.SalesService,
        stock_service_1.StockService,
        brands_service_1.BrandsService,
        stock_movements_service_1.StockMovementsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map