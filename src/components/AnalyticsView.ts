// Multi-Branch Consolidated Financial Portfolio & True Net Profit Analytics View Component
import { computeProfitLedger } from './ProfitModal.ts';

export function renderAnalyticsView(state) {
  const { kpis, analytics, branches = [], expenses, shopInfo } = state;

  const currentBranch = branches.find((b: any) => b.id === state.currentBranchId) || branches[0] || {
    id: "br-1", code: "BR-NAV-01", name: "Navrangpura Flagship", revenue: 42850, orders: 126, margin: "34.1%"
  };

  // Financial breakdown calculation based on True Net Profit formula:
  // Net Profit = Gross Revenue - (Raw Materials + Packaging + Labor + Utilities + Rent/Maintenance + Taxes)
  const grossRevenue = kpis?.sales?.value ?? currentBranch.revenue ?? 0;
  const rawMaterialCost = grossRevenue > 0 ? Math.round(grossRevenue * 0.291) : 0;
  const packagingCost = grossRevenue > 0 ? Math.round(grossRevenue * 0.047) : 0;
  const laborCost = grossRevenue > 0 ? Math.round(grossRevenue * 0.14) : 0;
  const utilitiesCost = grossRevenue > 0 ? Math.round(grossRevenue * 0.124) : 0;
  const rentMaintenanceCost = grossRevenue > 0 ? Math.round(grossRevenue * 0.057) : 0;
  const taxCost = 0; // 0% fresh mithai exemption
  const totalOperatingCosts = rawMaterialCost + packagingCost + laborCost + utilitiesCost + rentMaintenanceCost + taxCost;
  const trueNetProfit = Math.max(0, grossRevenue - totalOperatingCosts);
  const netMarginPercent = grossRevenue > 0 ? ((trueNetProfit / grossRevenue) * 100).toFixed(1) : "0.0";

  return `
    <div class="space-y-6">
      <!-- Header with Time Range & Branch Portfolio Filter -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-bold text-[var(--text-main)] tracking-tight">Enterprise Portfolio & P&L</h2>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
              Multi-Branch Architecture
            </span>
          </div>
          <p class="text-xs text-[var(--text-muted)] mt-0.5">Consolidated financials, True Net Profit computation & seasonal forecasting</p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Time range selector -->
          <select class="bg-[var(--bg-surface)] border border-[var(--border-color)] px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--text-main)] focus:outline-none">
            <option value="month">📅 This Month (Sep 2026)</option>
            <option value="week">📅 This Week</option>
            <option value="quarter">📅 Q3 Festive Quarter</option>
            <option value="year">📅 FY 2026-27</option>
          </select>
        </div>
      </section>

      <!-- Branch Performance Index Comparative Ranking -->
      <section class="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-4">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div>
            <h3 class="text-sm font-bold text-[var(--text-main)]">🏆 Branch Performance Index</h3>
            <p class="text-[11px] text-[var(--text-light)]">Automated comparative ranking across revenue, cost efficiency & net margin</p>
          </div>
          <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            3 Active Locations
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${branches.map((b: any, idx: number) => {
            const isRank1 = idx === 0;
            const isCurrent = b.id === state.currentBranchId;
            const bRevenue = isCurrent ? grossRevenue : (b.revenue || 0);
            const bOrders = isCurrent ? (state.orders?.length ?? b.orders ?? 0) : (b.orders || 0);
            const bMargin = isCurrent ? `${netMarginPercent}%` : (b.margin || '0.0%');
            return `
              <div class="p-4 rounded-xl border ${isCurrent ? 'border-[var(--brand-primary)] bg-[var(--bg-highlight)] ring-2 ring-[var(--brand-primary)]/10' : 'border-[var(--border-color)] bg-[var(--bg-subtle)]'} flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="text-[10px] font-bold text-[var(--brand-primary)] font-mono">${b.code}</span>
                      <h4 class="font-bold text-sm text-[var(--text-main)]">${b.name}</h4>
                      <p class="text-[11px] text-[var(--text-muted)]">${b.city}</p>
                    </div>
                    <span class="text-xs font-black px-2 py-0.5 rounded-full ${isRank1 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-700'}">
                      ${idx === 0 ? '🥇 #1 Rank' : idx === 1 ? '🥈 #2 Rank' : '🥉 #3 Rank'}
                    </span>
                  </div>

                  <div class="mt-3 grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[var(--border-subtle)]">
                    <div>
                      <p class="text-[10px] text-[var(--text-light)]">Gross Revenue</p>
                      <p class="font-extrabold text-[var(--text-main)] mt-0.5">₹${bRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p class="text-[10px] text-[var(--text-light)]">Net Margin</p>
                      <p class="font-extrabold text-emerald-600 mt-0.5">${bMargin}</p>
                    </div>
                  </div>
                </div>

                <div class="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
                  <span class="text-[var(--text-light)]">${bOrders} Orders Completed</span>
                  <button data-switch-branch="${b.id}" class="text-[var(--brand-primary)] font-bold hover:underline cursor-pointer">
                    ${isCurrent ? 'Active Branch ✓' : 'Switch Branch →'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
` + (function() {
        const ledger = computeProfitLedger(state, state.profitSelectedMonth || 'Sep 2026');
        return `
      <!-- All-Over Month & Per-Day Profit & Customer Sales Ledger -->
      <section class="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-5" id="analytics-daily-profit-ledger">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-black text-sm">₹</span>
              <h3 class="text-base font-black text-[var(--text-main)]">
                All-Over Month &amp; Per-Day Profit Ledger
              </h3>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                Customer Sales Driven
              </span>
            </div>
            <p class="text-xs text-[var(--text-muted)] mt-0.5">
              Live profit computed for each day as per day sales which depends on customers' purchases
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" data-action="open-profit-modal" class="px-3.5 py-1.5 bg-stone-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer">
              <span>Detailed Modal ↗</span>
            </button>
          </div>
        </div>

        <!-- 4 Monthly KPI Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div class="p-3.5 sm:p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <p class="text-[10px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wide">All-Over Month Profit</p>
            <p class="text-xl sm:text-2xl font-black text-emerald-950 mt-1">₹${ledger.totalProfit.toLocaleString()}</p>
            <p class="text-[10px] text-emerald-700 font-semibold mt-0.5">${ledger.overallMargin}% Net Take-Home</p>
          </div>
          <div class="p-3.5 sm:p-4 rounded-xl bg-stone-50 border border-stone-200">
            <p class="text-[10px] sm:text-xs font-bold text-stone-600 uppercase tracking-wide">Customer Sales (Sell)</p>
            <p class="text-xl sm:text-2xl font-black text-stone-900 mt-1">₹${ledger.totalSales.toLocaleString()}</p>
            <p class="text-[10px] text-stone-500 font-semibold mt-0.5">${ledger.totalCustomers} Customer Buys</p>
          </div>
          <div class="p-3.5 sm:p-4 rounded-xl bg-rose-50/60 border border-rose-200">
            <p class="text-[10px] sm:text-xs font-bold text-rose-800 uppercase tracking-wide">Sweets Cost (COGS)</p>
            <p class="text-xl sm:text-2xl font-black text-rose-950 mt-1">₹${ledger.totalCost.toLocaleString()}</p>
            <p class="text-[10px] text-rose-700 font-semibold mt-0.5">Production Ingredients</p>
          </div>
          <div class="p-3.5 sm:p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <p class="text-[10px] sm:text-xs font-bold text-blue-800 uppercase tracking-wide">Average Daily Profit</p>
            <p class="text-xl sm:text-2xl font-black text-blue-950 mt-1">₹${ledger.avgDailyProfit.toLocaleString()}</p>
            <p class="text-[10px] text-blue-700 font-semibold mt-0.5">Per-Day Operating Pace</p>
          </div>
        </div>

        <!-- Daily Ledger Table -->
        <div class="border border-[var(--border-color)] rounded-xl overflow-hidden bg-white shadow-2xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-stone-50 text-stone-700 font-black text-[11px] uppercase border-b border-stone-200">
                  <th class="py-2.5 px-4">Date &amp; Day</th>
                  <th class="py-2.5 px-4">Customer Buys (Orders)</th>
                  <th class="py-2.5 px-4 text-right">Day Sales (₹)</th>
                  <th class="py-2.5 px-4 text-right">Day Cost (₹)</th>
                  <th class="py-2.5 px-4 text-right">Per-Day Profit (₹)</th>
                  <th class="py-2.5 px-4 text-right">Margin</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100">
                ${ledger.days.map(day => `
                  <tr class="hover:bg-amber-50/30 transition-colors">
                    <td class="py-2.5 px-4 font-bold text-stone-900 whitespace-nowrap">
                      ${day.date} <span class="text-stone-400 font-normal text-[10px]">(${day.dayOfWeek})</span>
                    </td>
                    <td class="py-2.5 px-4">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 text-[10px] font-bold">
                          ${day.customerOrders.length} Buys
                        </span>
                        <span class="text-[11px] text-stone-600 truncate max-w-[200px]" title="${day.customerOrders.map(c => c.customerName).join(', ')}">
                          ${day.customerOrders.slice(0, 2).map(c => c.customerName).join(', ')}${day.customerOrders.length > 2 ? '...' : ''}
                        </span>
                      </div>
                    </td>
                    <td class="py-2.5 px-4 text-right font-black text-stone-900">
                      ₹${day.sales.toLocaleString()}
                    </td>
                    <td class="py-2.5 px-4 text-right font-bold text-rose-600">
                      - ₹${day.cost.toLocaleString()}
                    </td>
                    <td class="py-2.5 px-4 text-right whitespace-nowrap">
                      <span class="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs">
                        + ₹${day.profit.toLocaleString()}
                      </span>
                    </td>
                    <td class="py-2.5 px-4 text-right font-bold text-emerald-700">
                      ${day.sales > 0 ? ((day.profit / day.sales) * 100).toFixed(1) : '0.0'}%
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>
        `;
      })() + `

      <!-- True Net Profit P&L Statement Engine -->
      <section class="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
          <div>
            <h3 class="text-sm font-bold text-[var(--text-main)]">
              Shop Net Profit &amp; Loss Statement (P&amp;L)
            </h3>
            <p class="text-[11px] text-[var(--text-light)] font-mono">
              Net Profit = Gross Revenue - (Raw Material + Packaging + Labor + Utilities + Rent + Taxes)
            </p>
          </div>
          <div class="text-right">
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              Bottom-line Margin: ${netMarginPercent}%
            </span>
          </div>
        </div>

        <!-- P&L Financial Line Items Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[var(--bg-subtle)] text-[var(--text-muted)] font-bold text-[10px] uppercase">
                <th class="py-2.5 px-4">Financial Ledger Item</th>
                <th class="py-2.5 px-4 text-center">Classification</th>
                <th class="py-2.5 px-4 text-right">Amount (₹)</th>
                <th class="py-2.5 px-4 text-right">% of Revenue</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-subtle)] text-xs font-medium">
              <!-- Gross Revenue -->
              <tr class="bg-emerald-50/30">
                <td class="py-3 px-4 font-bold text-[var(--text-main)] flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Gross Counter & Delivery Revenue
                </td>
                <td class="py-3 px-4 text-center text-[var(--text-muted)]">Operating Inflow</td>
                <td class="py-3 px-4 text-right font-extrabold text-emerald-700 text-sm">₹${grossRevenue.toLocaleString()}</td>
                <td class="py-3 px-4 text-right font-bold text-emerald-700">${grossRevenue > 0 ? '100.0%' : '0.0%'}</td>
              </tr>

              <!-- Raw Material Cost -->
              <tr>
                <td class="py-2.5 px-4 text-[var(--text-main)] pl-8">(-) Raw Material Consumption (Ghee, Mawa, Sugar, Cashews)</td>
                <td class="py-2.5 px-4 text-center text-[var(--text-light)]">COGS / Production</td>
                <td class="py-2.5 px-4 text-right font-semibold text-rose-600">- ₹${rawMaterialCost.toLocaleString()}</td>
                <td class="py-2.5 px-4 text-right text-[var(--text-muted)]">${grossRevenue > 0 ? '29.1%' : '0.0%'}</td>
              </tr>

              <!-- Packaging -->
              <tr>
                <td class="py-2.5 px-4 text-[var(--text-main)] pl-8">(-) Packaging Expense (Gold Boxes, Pouches, Bags)</td>
                <td class="py-2.5 px-4 text-center text-[var(--text-light)]">Direct Production</td>
                <td class="py-2.5 px-4 text-right font-semibold text-rose-600">- ₹${packagingCost.toLocaleString()}</td>
                <td class="py-2.5 px-4 text-right text-[var(--text-muted)]">${grossRevenue > 0 ? '4.7%' : '0.0%'}</td>
              </tr>

              <!-- Staff Payroll & Wages -->
              <tr>
                <td class="py-2.5 px-4 text-[var(--text-main)] pl-8">(-) Staff Payroll & Halwai Wages</td>
                <td class="py-2.5 px-4 text-center text-[var(--text-light)]">Operating Overhead</td>
                <td class="py-2.5 px-4 text-right font-semibold text-rose-600">- ₹${laborCost.toLocaleString()}</td>
                <td class="py-2.5 px-4 text-right text-[var(--text-muted)]">${grossRevenue > 0 ? '14.0%' : '0.0%'}</td>
              </tr>

              <!-- Utilities -->
              <tr>
                <td class="py-2.5 px-4 text-[var(--text-main)] pl-8">(-) Utilities & Energy (Commercial LPG, Power, Water)</td>
                <td class="py-2.5 px-4 text-center text-[var(--text-light)]">Operating Overhead</td>
                <td class="py-2.5 px-4 text-right font-semibold text-rose-600">- ₹${utilitiesCost.toLocaleString()}</td>
                <td class="py-2.5 px-4 text-right text-[var(--text-muted)]">${grossRevenue > 0 ? '12.4%' : '0.0%'}</td>
              </tr>

              <!-- Rent & Facility Maintenance -->
              <tr>
                <td class="py-2.5 px-4 text-[var(--text-main)] pl-8">(-) Store Lease Rent & Equipment Maintenance</td>
                <td class="py-2.5 px-4 text-center text-[var(--text-light)]">Fixed Overhead</td>
                <td class="py-2.5 px-4 text-right font-semibold text-rose-600">- ₹${rentMaintenanceCost.toLocaleString()}</td>
                <td class="py-2.5 px-4 text-right text-[var(--text-muted)]">${grossRevenue > 0 ? '5.7%' : '0.0%'}</td>
              </tr>

              <!-- Taxes -->
              <tr>
                <td class="py-2.5 px-4 text-[var(--text-main)] pl-8">(-) GST & Municipal Tax Localization</td>
                <td class="py-2.5 px-4 text-center text-[var(--text-light)]">Statutory Tax</td>
                <td class="py-2.5 px-4 text-right font-semibold text-stone-500">₹0 (0% Exemption)</td>
                <td class="py-2.5 px-4 text-right text-[var(--text-muted)]">0.0%</td>
              </tr>

              <!-- True Bottom Line Net Profit -->
              <tr class="bg-[var(--bg-subtle)] font-bold text-sm">
                <td class="py-3 px-4 text-[var(--text-main)] font-black flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)]"></span>
                  True Net Profit (Bottom-Line Take-Home)
                </td>
                <td class="py-3 px-4 text-center text-emerald-600 font-bold">Consolidated Surplus</td>
                <td class="py-3 px-4 text-right font-black text-emerald-600 text-base">₹${trueNetProfit.toLocaleString()}</td>
                <td class="py-3 px-4 text-right font-black text-emerald-600 text-sm">${netMarginPercent}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Seasonal & Festive Trend Forecasts -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Festive Projection Card -->
        <div class="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-[var(--text-main)]">🪔 Festive Demand Forecast (Navratri & Diwali)</h3>
              <p class="text-[11px] text-[var(--text-light)]">Historical data-driven stock & labor capacity planning</p>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Peak Rush: +280%
            </span>
          </div>

          <div class="space-y-3 text-xs">
            <div class="p-3 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-between">
              <div>
                <p class="font-bold text-[var(--text-main)]">Kaju Katli Special Batches</p>
                <p class="text-[10px] text-[var(--text-light)]">Projected Demand: 450 kg (Needs 315kg Cashews)</p>
              </div>
              <span class="font-extrabold text-[var(--brand-primary)]">₹2,02,500</span>
            </div>

            <div class="p-3 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-between">
              <div>
                <p class="font-bold text-[var(--text-main)]">Motichoor Ladoo (Pure Desi Ghee)</p>
                <p class="text-[10px] text-[var(--text-light)]">Projected Demand: 600 kg (Needs 120kg Ghee)</p>
              </div>
              <span class="font-extrabold text-[var(--brand-primary)]">₹96,000</span>
            </div>

            <div class="p-3 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-between">
              <div>
                <p class="font-bold text-[var(--text-main)]">Dry Fruit Gift Hampers</p>
                <p class="text-[10px] text-[var(--text-light)]">Corporate Advance Bookings: 350 boxes</p>
              </div>
              <span class="font-extrabold text-[var(--brand-primary)]">₹1,47,000</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800">
            ⚠️ <strong>Action Required:</strong> Reorder Goan Cashews and Pure Desi Ghee by <strong>02 Oct</strong> to lock wholesale bulk rates and avoid festive supply shocks.
          </div>
        </div>

        <!-- Sales Channels & Average Ticket Size -->
        <div class="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-[var(--text-main)]">Sales Channel Margin Profiler</h3>
            <span class="text-xs text-[var(--text-light)]">Avg Ticket: ₹${analytics.avgOrderValue}</span>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="flex items-center gap-1.5 text-[var(--text-main)]">
                  <span class="w-3 h-3 rounded-full bg-[var(--brand-primary)]"></span>
                  Counter Walk-in Retail (0% Aggregator Fee)
                </span>
                <span class="font-bold text-[var(--text-main)]">
                  ₹${analytics.salesByChannel.storeOrders.amount.toLocaleString()} 
                  <span class="text-[10px] text-[var(--text-muted)]">(${analytics.salesByChannel.storeOrders.percentage}%)</span>
                </span>
              </div>
              <div class="w-full h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                <div class="h-full bg-[var(--brand-primary)] rounded-full" style="width: ${analytics.salesByChannel.storeOrders.percentage}%;"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs font-semibold mb-1">
                <span class="flex items-center gap-1.5 text-[var(--text-main)]">
                  <span class="w-3 h-3 rounded-full bg-sky-500"></span>
                  Online Delivery (Swiggy / Zomato / App)
                </span>
                <span class="font-bold text-[var(--text-main)]">
                  ₹${analytics.salesByChannel.onlineOrders.amount.toLocaleString()} 
                  <span class="text-[10px] text-[var(--text-muted)]">(${analytics.salesByChannel.onlineOrders.percentage}%)</span>
                </span>
              </div>
              <div class="w-full h-3 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                <div class="h-full bg-sky-500 rounded-full" style="width: ${analytics.salesByChannel.onlineOrders.percentage}%;"></div>
              </div>
            </div>
          </div>

          <div class="mt-4 p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] space-y-1">
            <p class="font-bold text-[var(--text-main)]">💡 Executive Margin Takeaway:</p>
            <p>Direct in-store sales yield a 34.1% net take-home margin compared to 22.4% on food delivery platforms after platform commissions.</p>
          </div>
        </div>
      </section>
    </div>
  `;
}
