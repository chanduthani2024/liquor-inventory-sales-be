import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CashReconciliation } from './cash-reconciliation.entity';
import { CreateCashReconciliationDto, UpdateCashReconciliationDto } from './dto/cash-reconciliation.dto';
import { Sale } from '../sales/sale.entity';
import { StockMovementsService } from '../stock-movements/stock-movements.service';

@Injectable()
export class CashReconciliationService {
  constructor(
    @InjectRepository(CashReconciliation)
    private cashReconciliationRepository: Repository<CashReconciliation>,
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    private stockMovementsService: StockMovementsService,
  ) {}

  async create(createDto: CreateCashReconciliationDto): Promise<CashReconciliation> {
    // Check if entry already exists for this date
    const existingEntry = await this.findByDate(createDto.date);
    if (existingEntry) {
      throw new BadRequestException(`Cash reconciliation for ${createDto.date} already exists`);
    }

    try {
      // Get sales data for the date
      const salesData = await this.getSalesDataForDate(createDto.date);
      
      // Get opening balance (previous day's closing balance)
      const openingBalance = await this.getOpeningBalance(createDto.date);

      // Calculate closing balance using the formula:
      // (total_sales + opening_balance) - office_cash - online_cash - expenditure
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
    } catch (error) {
      // If we get a unique constraint violation, provide a more specific error message
      if (error.code === '23505' || error.message.includes('duplicate key')) {
        throw new BadRequestException(`Cash reconciliation for ${createDto.date} already exists. Please refresh and try again.`);
      }
      throw error;
    }
  }

  async update(id: number, updateDto: UpdateCashReconciliationDto): Promise<CashReconciliation> {
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
      throw new BadRequestException('Cannot modify finalized cash reconciliation');
    }

    // Update editable fields with proper number conversion
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

    // Recalculate closing balance with proper number conversion
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

    // Handle finalization
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
    
    // Explicitly save the entity using save method
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

      // Verify the save by fetching the record again
      const verifyRecord = await this.cashReconciliationRepository.findOne({ where: { id: savedRecord.id } });
      console.log(`🔍 [UPDATE] Verification fetch:`, {
        id: verifyRecord?.id,
        closing_balance: verifyRecord?.closing_balance,
        is_finalized: verifyRecord?.is_finalized
      });

      return savedRecord;
    } catch (saveError) {
      console.error(`❌ [UPDATE] Error saving with save():`, saveError);
      
      // Alternative approach: Use update() method with explicit values
      console.log(`🔄 [UPDATE] Trying alternative approach with update() method...`);
      
      const updateResult = await this.cashReconciliationRepository.update(
        { id: cashReconciliation.id },
        {
          office_cash: cashReconciliation.office_cash,
          online_cash: cashReconciliation.online_cash,
          expenditure: cashReconciliation.expenditure,
          closing_balance: cashReconciliation.closing_balance,
          is_finalized: cashReconciliation.is_finalized,
          notes: cashReconciliation.notes,
        }
      );
      
      console.log(`📊 [UPDATE] Update result:`, updateResult);
      
      // Fetch the updated record to return
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

  async findAll(): Promise<CashReconciliation[]> {
    return await this.cashReconciliationRepository.find({
      order: { date: 'DESC' }
    });
  }

  async findOne(id: number): Promise<CashReconciliation> {
    const cashReconciliation = await this.cashReconciliationRepository.findOne({
      where: { id }
    });
    
    if (!cashReconciliation) {
      throw new NotFoundException(`Cash reconciliation with ID ${id} not found`);
    }
    
    return cashReconciliation;
  }

  async findByDate(date: string): Promise<CashReconciliation | null> {
    return await this.cashReconciliationRepository.findOne({
      where: { date }
    });
  }

  async getOrCreateForDate(date: string): Promise<CashReconciliation> {
    console.log(`🔍 [getOrCreateForDate] Starting for date: ${date}`);
    
    let reconciliation = await this.findByDate(date);
    
    // 🎯 OPTION A: ALWAYS RECALCULATE from stock_movements (same as dashboard)
    console.log(`📊 Always recalculating sales data from stock_movements (same source as dashboard)`);
    const salesData = await this.getSalesDataForDate(date);
    const openingBalance = await this.getOpeningBalance(date);
    
    if (!reconciliation) {
      // Create new record
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
          closing_balance: salesData.total_sales + openingBalance, // Initial calculation
          notes: '',
          is_finalized: false,
        });

        reconciliation = await this.cashReconciliationRepository.save(reconciliation);
        console.log(`✅ NEW record created with total_sales: ₹${salesData.total_sales}`);
      } catch (error) {
        // Handle race condition - another request might have created it
        if (error.code === '23505' || error.message.includes('duplicate key')) {
          console.log(`⚠️ Race condition detected, fetching existing record...`);
          reconciliation = await this.findByDate(date);
          if (!reconciliation) {
            throw new BadRequestException(`Failed to create or find cash reconciliation for ${date}`);
          }
          // Even if we found existing record, we still need to update it with fresh data
        } else {
          throw error;
        }
      }
    }
    
    // 🎯 ALWAYS UPDATE existing record with fresh sales data from stock_movements
    if (reconciliation) {
      console.log(`🔄 UPDATING existing record with fresh sales data from stock_movements`);
      console.log(`   Before: total_sales = ₹${reconciliation.total_sales}`);
      console.log(`   Fresh data: total_sales = ₹${salesData.total_sales}`);
      
      // Update the sales data with fresh calculations from stock_movements
      reconciliation.total_sales = salesData.total_sales;
      reconciliation.cash_sales = salesData.cash_sales;
      reconciliation.online_sales = salesData.online_sales;
      reconciliation.opening_balance = openingBalance;
      
      // Recalculate closing balance with updated sales data
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
      
      // Save the updated record
      reconciliation = await this.cashReconciliationRepository.save(reconciliation);
      console.log(`✅ Record UPDATED with fresh sales data: ₹${reconciliation.total_sales}`);
    }

    return reconciliation;
  }

  async delete(id: number): Promise<void> {
    const cashReconciliation = await this.findOne(id);
    
    if (cashReconciliation.is_finalized) {
      throw new BadRequestException('Cannot delete finalized cash reconciliation');
    }
    
    await this.cashReconciliationRepository.remove(cashReconciliation);
  }

  private async getSalesDataForDate(date: string): Promise<{
    total_sales: number;
    cash_sales: number;
    online_sales: number;
  }> {
    console.log(`🔍 [getSalesDataForDate] Using EXACT SAME approach as dashboard`);
    console.log(`📅 Target date: ${date}`);
    
    const reportDate = date || new Date().toISOString().split('T')[0];
    
    try {
      // 🎯 USE THE EXACT SAME METHOD AS DASHBOARD
      // Dashboard uses: stockMovementsService.getStockReport()
      console.log(`🎯 Calling stockMovementsService.getStockReport() - SAME as dashboard`);
      
      const stockReports = await this.stockMovementsService.getStockReport({
        start_date: reportDate,
        end_date: reportDate,
      });
      
      console.log(`� Stock reports returned ${stockReports.length} records for ${reportDate}`);
      
      // Calculate totals exactly like dashboard does
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
      
      // For cash/online breakdown, we need to check actual sales from sales table
      // since stock movements doesn't track payment method
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
            } else if (row.payment_method === 'online') {
              online_sales = amount;
            }
          });
          
          // If payment breakdown doesn't match total from stock reports,
          // use the stock reports total (which is what dashboard uses)
          const paymentTotal = cash_sales + online_sales;
          if (Math.abs(paymentTotal - total_sales) > 0.01) {
            console.log(`⚠️ Payment breakdown total (₹${paymentTotal}) != stock reports total (₹${total_sales})`);
            console.log(`🎯 Using stock reports total for consistency with dashboard`);
            
            // Proportionally distribute if we have payment method data
            if (paymentTotal > 0) {
              const cashRatio = cash_sales / paymentTotal;
              const onlineRatio = online_sales / paymentTotal;
              cash_sales = total_sales * cashRatio;
              online_sales = total_sales * onlineRatio;
            } else {
              // If no payment method data, assume all cash
              console.log(`� No payment method data found, assuming all cash`);
              cash_sales = total_sales;
              online_sales = 0;
            }
          }
          
        } catch (error) {
          console.error(`❌ Error getting payment breakdown:`, error.message);
          // Fallback: assume all cash
          cash_sales = total_sales;
          online_sales = 0;
        }
      } else {
        console.log(`⚠️ No sales found in stock reports for ${reportDate}`);
      }
      
      console.log(`✅ FINAL TOTALS (using EXACT SAME method as dashboard):`);
      console.log(`   📊 Total Sales: ₹${total_sales} (from stock movements - matches dashboard)`);
      console.log(`   💵 Cash Sales: ₹${cash_sales}`);
      console.log(`   💳 Online Sales: ₹${online_sales}`);
      console.log(`   🔍 Verification: Cash + Online = ₹${cash_sales + online_sales}`);
      
      return { total_sales, cash_sales, online_sales };
      
    } catch (error) {
      console.error(`❌ Error in getSalesDataForDate:`, error);
      console.error(`❌ Stack trace:`, error.stack);
      return { total_sales: 0, cash_sales: 0, online_sales: 0 };
    }
  }

  private async getOpeningBalance(date: string): Promise<number> {
    // Get previous day's closing balance
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    const prevDateStr = previousDate.toISOString().split('T')[0];

    const previousDayReconciliation = await this.findByDate(prevDateStr);
    
    if (previousDayReconciliation) {
      return parseFloat(previousDayReconciliation.closing_balance.toString());
    }

    // If no previous day record, return 0 (first day of operation)
    return 0;
  }

  private async setNextDayOpeningBalance(currentDate: string, closingBalance: number): Promise<void> {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    // Check if next day record exists
    const nextDayReconciliation = await this.findByDate(nextDateStr);
    if (nextDayReconciliation && !nextDayReconciliation.is_finalized) {
      // Update opening balance for next day
      nextDayReconciliation.opening_balance = closingBalance;
      
      // Recalculate closing balance for next day
      nextDayReconciliation.closing_balance = (nextDayReconciliation.total_sales + closingBalance) - 
                                            nextDayReconciliation.office_cash - 
                                            nextDayReconciliation.online_cash - 
                                            nextDayReconciliation.expenditure;
      
      await this.cashReconciliationRepository.save(nextDayReconciliation);
    }
  }
}