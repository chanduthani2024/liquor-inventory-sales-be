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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashReconciliationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cash_reconciliation_entity_1 = require("./cash-reconciliation.entity");
const sale_entity_1 = require("../sales/sale.entity");
const stock_movements_service_1 = require("../stock-movements/stock-movements.service");
let CashReconciliationService = class CashReconciliationService {
    constructor(cashReconciliationRepository, salesRepository, stockMovementsService) {
        this.cashReconciliationRepository = cashReconciliationRepository;
        this.salesRepository = salesRepository;
        this.stockMovementsService = stockMovementsService;
    }
    async create(createDto) {
        const existingEntry = await this.findByDate(createDto.date);
        if (existingEntry) {
            throw new common_1.BadRequestException(`Cash reconciliation for ${createDto.date} already exists`);
        }
        try {
            const salesData = await this.getSalesDataForDate(createDto.date);
            const openingBalance = await this.getOpeningBalance(createDto.date);
            const closingBalance = (salesData.total_sales + openingBalance) -
                createDto.office_cash -
                createDto.online_cash -
                createDto.expenditure;
            const cashReconciliation = this.cashReconciliationRepository.create({
                date: createDto.date,
                opening_balance: openingBalance,
                total_sales: salesData.total_sales,
                cash_sales: salesData.cash_sales,
                online_sales: salesData.online_sales,
                office_cash: createDto.office_cash,
                online_cash: createDto.online_cash,
                expenditure: createDto.expenditure,
                closing_balance: closingBalance,
                notes: createDto.notes,
                is_finalized: false,
            });
            return await this.cashReconciliationRepository.save(cashReconciliation);
        }
        catch (error) {
            if (error.code === '23505' || error.message.includes('duplicate key')) {
                throw new common_1.BadRequestException(`Cash reconciliation for ${createDto.date} already exists. Please refresh and try again.`);
            }
            throw error;
        }
    }
    async update(id, updateDto) {
        console.log(`🔄 [UPDATE] Starting update for ID: ${id}`);
        console.log(`📝 [UPDATE] Update data:`, updateDto);
        const cashReconciliation = await this.findOne(id);
        console.log(`📊 [UPDATE] Current record:`, {
            id: cashReconciliation.id,
            date: cashReconciliation.date,
            opening_balance: cashReconciliation.opening_balance,
            total_sales: cashReconciliation.total_sales,
            office_cash: cashReconciliation.office_cash,
            online_cash: cashReconciliation.online_cash,
            expenditure: cashReconciliation.expenditure,
            closing_balance: cashReconciliation.closing_balance,
            is_finalized: cashReconciliation.is_finalized
        });
        if (cashReconciliation.is_finalized && !updateDto.is_finalized) {
            throw new common_1.BadRequestException('Cannot modify finalized cash reconciliation');
        }
        if (updateDto.office_cash !== undefined) {
            console.log(`💰 [UPDATE] Updating office_cash: ${cashReconciliation.office_cash} → ${updateDto.office_cash}`);
            cashReconciliation.office_cash = Number(updateDto.office_cash);
        }
        if (updateDto.online_cash !== undefined) {
            console.log(`💳 [UPDATE] Updating online_cash: ${cashReconciliation.online_cash} → ${updateDto.online_cash}`);
            cashReconciliation.online_cash = Number(updateDto.online_cash);
        }
        if (updateDto.expenditure !== undefined) {
            console.log(`💸 [UPDATE] Updating expenditure: ${cashReconciliation.expenditure} → ${updateDto.expenditure}`);
            cashReconciliation.expenditure = Number(updateDto.expenditure);
        }
        if (updateDto.notes !== undefined) {
            cashReconciliation.notes = updateDto.notes;
        }
        const oldClosingBalance = cashReconciliation.closing_balance;
        const totalSales = Number(cashReconciliation.total_sales) || 0;
        const openingBalance = Number(cashReconciliation.opening_balance) || 0;
        const officeCash = Number(cashReconciliation.office_cash) || 0;
        const onlineCash = Number(cashReconciliation.online_cash) || 0;
        const expenditure = Number(cashReconciliation.expenditure) || 0;
        const calculatedClosingBalance = (totalSales + openingBalance) - officeCash - onlineCash - expenditure;
        cashReconciliation.closing_balance = Number(calculatedClosingBalance);
        console.log(`🧮 [UPDATE] Closing balance calculation:`);
        console.log(`   Formula: (total_sales + opening_balance) - office_cash - online_cash - expenditure`);
        console.log(`   Values: (${totalSales} + ${openingBalance}) - ${officeCash} - ${onlineCash} - ${expenditure}`);
        console.log(`   Calculation: (${totalSales + openingBalance}) - ${officeCash + onlineCash + expenditure} = ${calculatedClosingBalance}`);
        console.log(`   Result: ${cashReconciliation.closing_balance}`);
        console.log(`   Changed: ${oldClosingBalance} → ${cashReconciliation.closing_balance}`);
        if (updateDto.is_finalized !== undefined) {
            console.log(`🔒 [UPDATE] Updating finalization status: ${cashReconciliation.is_finalized} → ${updateDto.is_finalized}`);
            cashReconciliation.is_finalized = updateDto.is_finalized;
            if (updateDto.is_finalized) {
                console.log(`🔗 [UPDATE] Setting next day opening balance: ${cashReconciliation.closing_balance}`);
                await this.setNextDayOpeningBalance(cashReconciliation.date, Number(cashReconciliation.closing_balance));
            }
        }
        console.log(`💾 [UPDATE] Saving updated record...`);
        console.log(`📝 [UPDATE] Entity before save:`, {
            id: cashReconciliation.id,
            office_cash: cashReconciliation.office_cash,
            online_cash: cashReconciliation.online_cash,
            expenditure: cashReconciliation.expenditure,
            closing_balance: cashReconciliation.closing_balance,
            is_finalized: cashReconciliation.is_finalized
        });
        try {
            const savedRecord = await this.cashReconciliationRepository.save(cashReconciliation);
            console.log(`✅ [UPDATE] Record saved successfully using save():`, {
                id: savedRecord.id,
                office_cash: savedRecord.office_cash,
                online_cash: savedRecord.online_cash,
                expenditure: savedRecord.expenditure,
                closing_balance: savedRecord.closing_balance,
                is_finalized: savedRecord.is_finalized
            });
            const verifyRecord = await this.cashReconciliationRepository.findOne({ where: { id: savedRecord.id } });
            console.log(`🔍 [UPDATE] Verification fetch:`, {
                id: verifyRecord?.id,
                closing_balance: verifyRecord?.closing_balance,
                is_finalized: verifyRecord?.is_finalized
            });
            return savedRecord;
        }
        catch (saveError) {
            console.error(`❌ [UPDATE] Error saving with save():`, saveError);
            console.log(`🔄 [UPDATE] Trying alternative approach with update() method...`);
            const updateResult = await this.cashReconciliationRepository.update({ id: cashReconciliation.id }, {
                office_cash: cashReconciliation.office_cash,
                online_cash: cashReconciliation.online_cash,
                expenditure: cashReconciliation.expenditure,
                closing_balance: cashReconciliation.closing_balance,
                is_finalized: cashReconciliation.is_finalized,
                notes: cashReconciliation.notes,
            });
            console.log(`📊 [UPDATE] Update result:`, updateResult);
            const updatedRecord = await this.cashReconciliationRepository.findOne({ where: { id: cashReconciliation.id } });
            if (!updatedRecord) {
                throw new Error('Failed to fetch updated record');
            }
            console.log(`✅ [UPDATE] Alternative update successful:`, {
                id: updatedRecord.id,
                closing_balance: updatedRecord.closing_balance,
                is_finalized: updatedRecord.is_finalized
            });
            return updatedRecord;
        }
    }
    async findAll() {
        return await this.cashReconciliationRepository.find({
            order: { date: 'DESC' }
        });
    }
    async findOne(id) {
        const cashReconciliation = await this.cashReconciliationRepository.findOne({
            where: { id }
        });
        if (!cashReconciliation) {
            throw new common_1.NotFoundException(`Cash reconciliation with ID ${id} not found`);
        }
        return cashReconciliation;
    }
    async findByDate(date) {
        return await this.cashReconciliationRepository.findOne({
            where: { date }
        });
    }
    async getOrCreateForDate(date) {
        console.log(`🔍 [getOrCreateForDate] Starting for date: ${date}`);
        let reconciliation = await this.findByDate(date);
        console.log(`📊 Always recalculating sales data from stock_movements (same source as dashboard)`);
        const salesData = await this.getSalesDataForDate(date);
        const openingBalance = await this.getOpeningBalance(date);
        if (!reconciliation) {
            console.log(`➕ Creating NEW cash reconciliation record for ${date}`);
            try {
                reconciliation = this.cashReconciliationRepository.create({
                    date,
                    opening_balance: openingBalance,
                    total_sales: salesData.total_sales,
                    cash_sales: salesData.cash_sales,
                    online_sales: salesData.online_sales,
                    office_cash: 0,
                    online_cash: 0,
                    expenditure: 0,
                    closing_balance: salesData.total_sales + openingBalance,
                    notes: '',
                    is_finalized: false,
                });
                reconciliation = await this.cashReconciliationRepository.save(reconciliation);
                console.log(`✅ NEW record created with total_sales: ₹${salesData.total_sales}`);
            }
            catch (error) {
                if (error.code === '23505' || error.message.includes('duplicate key')) {
                    console.log(`⚠️ Race condition detected, fetching existing record...`);
                    reconciliation = await this.findByDate(date);
                    if (!reconciliation) {
                        throw new common_1.BadRequestException(`Failed to create or find cash reconciliation for ${date}`);
                    }
                }
                else {
                    throw error;
                }
            }
        }
        if (reconciliation) {
            console.log(`🔄 UPDATING existing record with fresh sales data from stock_movements`);
            console.log(`   Before: total_sales = ₹${reconciliation.total_sales}`);
            console.log(`   Fresh data: total_sales = ₹${salesData.total_sales}`);
            reconciliation.total_sales = salesData.total_sales;
            reconciliation.cash_sales = salesData.cash_sales;
            reconciliation.online_sales = salesData.online_sales;
            reconciliation.opening_balance = openingBalance;
            const newClosingBalance = (salesData.total_sales + openingBalance) -
                reconciliation.office_cash -
                reconciliation.online_cash -
                reconciliation.expenditure;
            console.log(`🧮 Recalculating closing balance:`);
            console.log(`   Formula: (total_sales + opening_balance) - office_cash - online_cash - expenditure`);
            console.log(`   Values: (${salesData.total_sales} + ${openingBalance}) - ${reconciliation.office_cash} - ${reconciliation.online_cash} - ${reconciliation.expenditure}`);
            console.log(`   Before: ₹${reconciliation.closing_balance}`);
            console.log(`   After: ₹${newClosingBalance}`);
            reconciliation.closing_balance = newClosingBalance;
            reconciliation = await this.cashReconciliationRepository.save(reconciliation);
            console.log(`✅ Record UPDATED with fresh sales data: ₹${reconciliation.total_sales}`);
        }
        return reconciliation;
    }
    async delete(id) {
        const cashReconciliation = await this.findOne(id);
        if (cashReconciliation.is_finalized) {
            throw new common_1.BadRequestException('Cannot delete finalized cash reconciliation');
        }
        await this.cashReconciliationRepository.remove(cashReconciliation);
    }
    async getSalesDataForDate(date) {
        console.log(`🔍 [getSalesDataForDate] Using EXACT SAME approach as dashboard`);
        console.log(`📅 Target date: ${date}`);
        const reportDate = date || new Date().toISOString().split('T')[0];
        try {
            console.log(`🎯 Calling stockMovementsService.getStockReport() - SAME as dashboard`);
            const stockReports = await this.stockMovementsService.getStockReport({
                start_date: reportDate,
                end_date: reportDate,
            });
            console.log(`� Stock reports returned ${stockReports.length} records for ${reportDate}`);
            let total_sales = 0;
            let cash_sales = 0;
            let online_sales = 0;
            stockReports.forEach(report => {
                const salesAmount = report.sales_amount || 0;
                if (salesAmount > 0) {
                    console.log(`💰 ${report.brand_name} ${report.size}: ₹${salesAmount}`);
                }
                total_sales += salesAmount;
            });
            console.log(`📊 Total from stock reports: ₹${total_sales} (SAME calculation as dashboard)`);
            if (total_sales > 0) {
                console.log(`🔍 Getting payment method breakdown from sales table...`);
                try {
                    const paymentBreakdown = await this.salesRepository.query(`
            SELECT 
              payment_method,
              SUM(total_amount) as amount
            FROM sales 
            WHERE DATE(created_at) = DATE($1)
            GROUP BY payment_method
          `, [reportDate]);
                    console.log(`📊 Payment breakdown:`, paymentBreakdown);
                    paymentBreakdown.forEach(row => {
                        const amount = parseFloat(row.amount || '0');
                        if (row.payment_method === 'cash') {
                            cash_sales = amount;
                        }
                        else if (row.payment_method === 'online') {
                            online_sales = amount;
                        }
                    });
                    const paymentTotal = cash_sales + online_sales;
                    if (Math.abs(paymentTotal - total_sales) > 0.01) {
                        console.log(`⚠️ Payment breakdown total (₹${paymentTotal}) != stock reports total (₹${total_sales})`);
                        console.log(`🎯 Using stock reports total for consistency with dashboard`);
                        if (paymentTotal > 0) {
                            const cashRatio = cash_sales / paymentTotal;
                            const onlineRatio = online_sales / paymentTotal;
                            cash_sales = total_sales * cashRatio;
                            online_sales = total_sales * onlineRatio;
                        }
                        else {
                            console.log(`� No payment method data found, assuming all cash`);
                            cash_sales = total_sales;
                            online_sales = 0;
                        }
                    }
                }
                catch (error) {
                    console.error(`❌ Error getting payment breakdown:`, error.message);
                    cash_sales = total_sales;
                    online_sales = 0;
                }
            }
            else {
                console.log(`⚠️ No sales found in stock reports for ${reportDate}`);
            }
            console.log(`✅ FINAL TOTALS (using EXACT SAME method as dashboard):`);
            console.log(`   📊 Total Sales: ₹${total_sales} (from stock movements - matches dashboard)`);
            console.log(`   💵 Cash Sales: ₹${cash_sales}`);
            console.log(`   💳 Online Sales: ₹${online_sales}`);
            console.log(`   🔍 Verification: Cash + Online = ₹${cash_sales + online_sales}`);
            return { total_sales, cash_sales, online_sales };
        }
        catch (error) {
            console.error(`❌ Error in getSalesDataForDate:`, error);
            console.error(`❌ Stack trace:`, error.stack);
            return { total_sales: 0, cash_sales: 0, online_sales: 0 };
        }
    }
    async getOpeningBalance(date) {
        const previousDate = new Date(date);
        previousDate.setDate(previousDate.getDate() - 1);
        const prevDateStr = previousDate.toISOString().split('T')[0];
        const previousDayReconciliation = await this.findByDate(prevDateStr);
        if (previousDayReconciliation) {
            return parseFloat(previousDayReconciliation.closing_balance.toString());
        }
        return 0;
    }
    async setNextDayOpeningBalance(currentDate, closingBalance) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateStr = nextDate.toISOString().split('T')[0];
        const nextDayReconciliation = await this.findByDate(nextDateStr);
        if (nextDayReconciliation && !nextDayReconciliation.is_finalized) {
            nextDayReconciliation.opening_balance = closingBalance;
            nextDayReconciliation.closing_balance = (nextDayReconciliation.total_sales + closingBalance) -
                nextDayReconciliation.office_cash -
                nextDayReconciliation.online_cash -
                nextDayReconciliation.expenditure;
            await this.cashReconciliationRepository.save(nextDayReconciliation);
        }
    }
};
exports.CashReconciliationService = CashReconciliationService;
exports.CashReconciliationService = CashReconciliationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cash_reconciliation_entity_1.CashReconciliation)),
    __param(1, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        stock_movements_service_1.StockMovementsService])
], CashReconciliationService);
//# sourceMappingURL=cash-reconciliation.service.js.map