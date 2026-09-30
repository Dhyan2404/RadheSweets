// Dashboard View Component - 100% 1:1 Match with Reference Design & Enterprise Polish

export function renderDashboardView(state) {
  const { kpis, orderStatusCounts, sweets, quickCart, selectedCustomer, timeFilter } = state;

  return `
    <div class="space-y-6">
      <!-- Greeting Header & Timeframe Filter -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">Dashboard</h2>
          <p class="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">Here's what's happening with your sweet shop today.</p>
        </div>

        <!-- Time Filter Dropdown -->
        <div class="flex items-center space-x-2">
          <div class="relative">
            <select 
              id="time-filter-select"
              class="appearance-none bg-white border border-[var(--border-color)] text-xs sm:text-sm font-semibold text-stone-700 py-2 pl-3.5 pr-8 rounded-xl shadow-subtle hover:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
            >
              <option value="month" ${timeFilter === 'month' ? 'selected' : ''}>This Month</option>
              <option value="today" ${timeFilter === 'today' ? 'selected' : ''}>Today</option>
              <option value="week" ${timeFilter === 'week' ? 'selected' : ''}>This Week</option>
              <option value="quarter" ${timeFilter === 'quarter' ? 'selected' : ''}>Quarterly</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-400">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            </div>
          </div>
        </div>
      </section>

      <!-- 6 KPI Stat Cards Grid (Desktop: 6 cols, Mobile: 2 cols) -->
      <section class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4" data-purpose="kpi-metrics-grid">
        <!-- KPI 1: Customers -->
        <article class="spring-card bg-white p-4 rounded-2xl border border-[var(--border-color)] shadow-subtle hover:shadow-card transition-all">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </span>
            <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              +12%
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Customers</p>
            <p class="text-xl sm:text-2xl font-black text-[var(--text-main)] mt-0.5 tracking-tight">${kpis.customers.value}</p>
          </div>
          <div class="mt-2 text-amber-400">
            <svg class="w-full h-8 overflow-visible" fill="none" viewBox="0 0 100 28" preserveAspectRatio="none">
              <path d="M0 24 Q 20 22, 35 15 T 70 12 T 100 4" fill="none" stroke="#F59E0B" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 24 Q 20 22, 35 15 T 70 12 T 100 4 L 100 28 L 0 28 Z" fill="url(#amber-grad)" opacity="0.15"></path>
              <defs>
                <linearGradient id="amber-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#F59E0B"></stop>
                  <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>

        <!-- KPI 2: Sales -->
        <article class="spring-card bg-white p-4 rounded-2xl border border-[var(--border-color)] shadow-subtle hover:shadow-card transition-all">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-2xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </span>
            <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              +8.4%
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Sales</p>
            <p class="text-xl sm:text-2xl font-black text-[var(--text-main)] mt-0.5 tracking-tight">${kpis.sales.formatted}</p>
          </div>
          <div class="mt-2 text-emerald-500">
            <svg class="w-full h-8 overflow-visible" fill="none" viewBox="0 0 100 28" preserveAspectRatio="none">
              <path d="M0 20 Q 25 18, 50 10 T 80 8 T 100 3" fill="none" stroke="#10B981" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 20 Q 25 18, 50 10 T 80 8 T 100 3 L 100 28 L 0 28 Z" fill="url(#mint-grad)" opacity="0.18"></path>
              <defs>
                <linearGradient id="mint-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#10B981"></stop>
                  <stop offset="100%" stop-color="#10B981" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>

        <!-- KPI 3: Orders -->
        <article class="spring-card bg-white p-4 rounded-2xl border border-[var(--border-color)] shadow-subtle hover:shadow-card transition-all">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </span>
            <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              +9.2%
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Orders</p>
            <p class="text-xl sm:text-2xl font-black text-[var(--text-main)] mt-0.5 tracking-tight">${kpis.orders.formatted}</p>
          </div>
          <div class="mt-2 text-purple-500">
            <svg class="w-full h-8 overflow-visible" fill="none" viewBox="0 0 100 28" preserveAspectRatio="none">
              <path d="M0 22 Q 30 16, 55 18 T 85 8 T 100 2" fill="none" stroke="#8B5CF6" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 22 Q 30 16, 55 18 T 85 8 T 100 2 L 100 28 L 0 28 Z" fill="url(#lav-grad)" opacity="0.16"></path>
              <defs>
                <linearGradient id="lav-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#8B5CF6"></stop>
                  <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>

        <!-- KPI 4: Profit -->
        <article class="spring-card bg-white p-4 rounded-2xl border border-[var(--border-color)] shadow-subtle hover:shadow-card transition-all">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </span>
            <span class="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              ${kpis.profit.change}
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Profit</p>
            <p class="text-xl sm:text-2xl font-black text-[var(--text-main)] mt-0.5 tracking-tight">${kpis.profit.formatted}</p>
          </div>
          <div class="mt-2 text-teal-500">
            <svg class="w-full h-8 overflow-visible" fill="none" viewBox="0 0 100 28" preserveAspectRatio="none">
              <path d="M0 21 Q 30 20, 60 14 T 90 9 T 100 4" fill="none" stroke="#0D9488" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 21 Q 30 20, 60 14 T 90 9 T 100 4 L 100 28 L 0 28 Z" fill="url(#teal-grad)" opacity="0.18"></path>
              <defs>
                <linearGradient id="teal-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#0D9488"></stop>
                  <stop offset="100%" stop-color="#0D9488" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>

        <!-- KPI 5: Cost -->
        <article class="spring-card bg-white p-4 rounded-2xl border border-[var(--border-color)] shadow-subtle hover:shadow-card transition-all">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </span>
            <span class="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
              ${kpis.cost.change}
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Cost</p>
            <p class="text-xl sm:text-2xl font-black text-[var(--text-main)] mt-0.5 tracking-tight">${kpis.cost.formatted}</p>
          </div>
          <div class="mt-2 text-rose-400">
            <svg class="w-full h-8 overflow-visible" fill="none" viewBox="0 0 100 28" preserveAspectRatio="none">
              <path d="M0 12 Q 25 15, 50 18 T 75 14 T 100 20" fill="none" stroke="#F43F5E" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 12 Q 25 15, 50 18 T 75 14 T 100 20 L 100 28 L 0 28 Z" fill="url(#rose-grad)" opacity="0.15"></path>
              <defs>
                <linearGradient id="rose-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#F43F5E"></stop>
                  <stop offset="100%" stop-color="#F43F5E" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>

        <!-- KPI 6: Returning -->
        <article class="spring-card bg-white p-4 rounded-2xl border border-[var(--border-color)] shadow-subtle hover:shadow-card transition-all">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </span>
            <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              +41.3%
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Returning</p>
            <p class="text-xl sm:text-2xl font-black text-[var(--text-main)] mt-0.5 tracking-tight">${kpis.returning.value} <span class="text-xs font-normal text-stone-400">cust</span></p>
          </div>
          <div class="mt-2 text-sky-400">
            <svg class="w-full h-8 overflow-visible" fill="none" viewBox="0 0 100 28" preserveAspectRatio="none">
              <path d="M0 24 Q 30 18, 55 19 T 80 10 T 100 5" fill="none" stroke="#0284C7" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 24 Q 30 18, 55 19 T 80 10 T 100 5 L 100 28 L 0 28 Z" fill="url(#sky-grad)" opacity="0.18"></path>
              <defs>
                <linearGradient id="sky-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="#0284C7"></stop>
                  <stop offset="100%" stop-color="#0284C7" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>
      </section>

      <!-- Main Dual Grid: Sales Overview Curve + Order Status Donut & POS Widget -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left 8 Columns: Sales Chart + Fast Selling Sweets Table -->
        <div class="lg:col-span-8 space-y-6">
          <!-- Sales Overview Chart -->
          <section class="bg-white p-5 sm:p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle" data-purpose="sales-chart-card">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-base font-bold text-[var(--text-main)]">Sales Overview</h3>
                <p class="text-xs text-stone-400">Monthly trajectory & revenue spikes</p>
              </div>
              <div class="flex items-center space-x-2 text-xs">
                <span class="inline-flex items-center text-stone-600 font-semibold">
                  <span class="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)] mr-1.5 shadow-xs"></span>
                  Gross Sales
                </span>
                <span class="text-stone-300">|</span>
                <span class="text-stone-500 font-medium">1 Sep – 30 Sep</span>
              </div>
            </div>

            <!-- SVG Line Graph with Area Gradient -->
            <div class="relative w-full h-56 pt-2">
              <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
                <defs>
                  <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="#C86D3B" stop-opacity="0.25"></stop>
                    <stop offset="100%" stop-color="#C86D3B" stop-opacity="0"></stop>
                  </linearGradient>
                </defs>
                <!-- Grid Horizontal Lines -->
                <line stroke="#F4EFEA" stroke-dasharray="4 4" stroke-width="1" x1="40" x2="700" y1="20" y2="20"></line>
                <line stroke="#F4EFEA" stroke-dasharray="4 4" stroke-width="1" x1="40" x2="700" y1="65" y2="65"></line>
                <line stroke="#F4EFEA" stroke-dasharray="4 4" stroke-width="1" x1="40" x2="700" y1="110" y2="110"></line>
                <line stroke="#F4EFEA" stroke-width="1" x1="40" x2="700" y1="155" y2="155"></line>

                <!-- Y Axis Value Labels -->
                <text fill="#A8A29E" font-size="10" font-weight="600" x="5" y="24">50K</text>
                <text fill="#A8A29E" font-size="10" font-weight="600" x="5" y="69">40K</text>
                <text fill="#A8A29E" font-size="10" font-weight="600" x="5" y="114">20K</text>
                <text fill="#A8A29E" font-size="10" font-weight="600" x="5" y="159">10K</text>

                <!-- Area Gradient Fill -->
                <path d="M 50 145 C 100 130, 140 148, 190 100 C 240 60, 280 95, 340 55 C 400 20, 450 70, 520 40 C 580 15, 630 65, 690 30 L 690 160 L 50 160 Z" fill="url(#chartFill)"></path>
                <!-- Primary Curve Line -->
                <path d="M 50 145 C 100 130, 140 148, 190 100 C 240 60, 280 95, 340 55 C 400 20, 450 70, 520 40 C 580 15, 630 65, 690 30" fill="none" stroke="#C86D3B" stroke-linecap="round" stroke-width="3.5"></path>

                <!-- Highlight Marker Points -->
                <circle cx="520" cy="40" fill="#FFFFFF" r="5" stroke="#C86D3B" stroke-width="3"></circle>
                <circle cx="690" cy="30" fill="#FFFFFF" r="5" stroke="#C86D3B" stroke-width="3"></circle>
              </svg>

              <!-- X Axis Labels -->
              <div class="flex justify-between pl-10 pr-2 pt-2 text-[11px] font-bold text-stone-400">
                <span>1 Sep</span>
                <span>5 Sep</span>
                <span>10 Sep</span>
                <span>15 Sep</span>
                <span>20 Sep</span>
                <span>25 Sep</span>
                <span>30 Sep</span>
              </div>
            </div>
          </section>

          <!-- Today's Fast Selling Sweets / Stock Table -->
          <section class="bg-white rounded-2xl border border-[var(--border-color)] shadow-subtle overflow-hidden" data-purpose="fast-selling-sweets-table">
            <div class="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-[var(--text-main)]">Fast Selling Sweets & Stock</h3>
                <p class="text-xs text-stone-400">Popular freshly prepared batch items for today</p>
              </div>
              <button data-tab="pos" class="text-xs font-bold text-[var(--brand-primary)] hover:underline flex items-center gap-1">
                <span>View Full Menu</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
              </button>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr class="bg-stone-50/70 border-b border-[var(--border-color)] text-stone-500 font-bold text-[11px] uppercase tracking-wider">
                    <th class="py-3 px-5">Sweet Name</th>
                    <th class="py-3 px-4">Category</th>
                    <th class="py-3 px-4">Rate (₹)</th>
                    <th class="py-3 px-4">Stock Status</th>
                    <th class="py-3 px-4 text-right">Quick Order</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[var(--border-subtle)] text-xs">
                  ${sweets.slice(0, 6).map(item => {
                    const avatarClass = item.code === 'KK' ? 'bg-amber-100/80 border border-amber-200 text-amber-900' :
                      item.code === 'RG' ? 'bg-orange-100/80 border border-orange-200 text-orange-800' :
                      item.code === 'GJ' ? 'bg-amber-900/10 border border-amber-900/20 text-amber-900' :
                      item.code === 'ML' ? 'bg-yellow-100 border border-yellow-200 text-amber-800' :
                      item.code === 'KP' ? 'bg-amber-100 border border-amber-300 text-amber-900' :
                      item.code === 'MC' ? 'bg-orange-100/60 border border-orange-200 text-orange-900' :
                      'bg-stone-100 border border-stone-200 text-stone-800';
                    return `
                    <tr class="hover:bg-amber-50/40 transition-colors">
                      <td class="py-3 px-5 flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-lg ${avatarClass} font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          ${item.code || item.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p class="font-bold text-[var(--text-main)] leading-snug">${item.name}</p>
                          <p class="text-[10px] text-stone-400">${item.tagline || item.category}</p>
                        </div>
                      </td>
                      <td class="py-3 px-4 text-stone-600 font-medium">${item.category}</td>
                      <td class="py-3 px-4 font-bold text-[var(--text-main)]">₹${item.pricePerKg} <span class="text-[10px] font-normal text-stone-400">/kg</span></td>
                      <td class="py-3 px-4">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.stockStatus === 'Low Stock' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-300' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }">
                          ${item.stockStatus}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right">
                        <button 
                          data-add-sweet="${item.id}"
                          class="spring-btn px-3 py-1 rounded-lg text-xs font-bold text-[var(--brand-primary)] bg-orange-50 hover:bg-[var(--brand-primary)] hover:text-white transition-all shadow-2xs"
                        >
                          + Add
                        </button>
                      </td>
                    </tr>
                  `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <!-- Right 4 Columns: Order Status Donut Chart & Quick Billing POS Card -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Order Status Donut Chart Card -->
          <section class="bg-white p-5 sm:p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle" data-purpose="order-status-card">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-bold text-[var(--text-main)]">Order Status</h3>
              <span class="text-xs text-stone-400 font-medium">Today</span>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between pt-2">
              <!-- Donut Chart SVG -->
              <div class="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <!-- Base ring -->
                  <circle cx="18" cy="18" r="14.5" fill="none" stroke="#F5EFE9" stroke-width="3.8"></circle>
                  <!-- Delivered 54% -->
                  <circle class="donut-segment" cx="18" cy="18" r="14.5" fill="none" stroke="#10B981" stroke-width="3.8" stroke-dasharray="49 100" stroke-dashoffset="0"></circle>
                  <!-- Processing 20% -->
                  <circle class="donut-segment" cx="18" cy="18" r="14.5" fill="none" stroke="#0284C7" stroke-width="3.8" stroke-dasharray="19 100" stroke-dashoffset="-49"></circle>
                  <!-- Pending 19% -->
                  <circle class="donut-segment" cx="18" cy="18" r="14.5" fill="none" stroke="#F59E0B" stroke-width="3.8" stroke-dasharray="17 100" stroke-dashoffset="-68"></circle>
                  <!-- Canceled 7% -->
                  <circle class="donut-segment" cx="18" cy="18" r="14.5" fill="none" stroke="#EF4444" stroke-width="3.8" stroke-dasharray="6 100" stroke-dashoffset="-85"></circle>
                </svg>
                <!-- Inner Total Text -->
                <div class="absolute text-center flex flex-col items-center justify-center pointer-events-none">
                  <span class="text-xl font-bold text-[var(--text-main)] leading-tight">${orderStatusCounts.total}</span>
                  <span class="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Orders</span>
                </div>
              </div>

              <!-- Donut Legend -->
              <div class="mt-4 sm:mt-0 sm:ml-4 flex-1 space-y-2.5 text-xs w-full">
                <div class="flex items-center justify-between">
                  <span class="flex items-center text-stone-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 shadow-2xs"></span>
                    Delivered
                  </span>
                  <span class="font-bold text-[var(--text-main)]">${orderStatusCounts.delivered}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center text-stone-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-sky-500 mr-2 shadow-2xs"></span>
                    Processing
                  </span>
                  <span class="font-bold text-[var(--text-main)]">${orderStatusCounts.processing}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center text-stone-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2 shadow-2xs"></span>
                    Pending
                  </span>
                  <span class="font-bold text-[var(--text-main)]">${orderStatusCounts.pending}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center text-stone-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2 shadow-2xs"></span>
                    Canceled
                  </span>
                  <span class="font-bold text-[var(--text-main)]">${orderStatusCounts.canceled}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Quick Billing (POS) Card -->
          <section class="bg-white p-5 rounded-2xl border border-[var(--border-color)] shadow-subtle flex flex-col justify-between" data-purpose="quick-pos-widget">
            <div>
              <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
                <div>
                  <h3 class="text-base font-bold text-[var(--text-main)]">Quick Billing (POS)</h3>
                  <p class="text-xs text-stone-400">Order #SA-00130</p>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-orange-100 text-[var(--brand-primary)] text-[11px] font-bold">Counter 1</span>
              </div>

              <!-- Selected Customer Card -->
              <div class="bg-amber-50/50 rounded-xl p-3 border border-amber-100 mb-4 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-9 h-9 rounded-full bg-amber-200/80 text-amber-900 font-bold text-xs flex items-center justify-center shadow-xs">
                    JS
                  </div>
                  <div>
                    <div class="flex items-center space-x-1.5">
                      <span class="font-bold text-xs text-[var(--text-main)]">${selectedCustomer?.name || 'Jignesh Shah'}</span>
                      <span class="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded">VIP</span>
                    </div>
                    <p class="text-[11px] text-stone-500">${selectedCustomer?.phone || '+91 98765 67890'}</p>
                  </div>
                </div>
                <button id="switch-customer-btn" class="text-stone-400 hover:text-stone-600 p-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                </button>
              </div>

              <!-- Quick Order Selected Sweets -->
              <div class="space-y-2.5 mb-4 text-xs">
                ${quickCart && quickCart.length > 0 ? quickCart.map(item => `
                  <div class="flex items-center justify-between py-1.5 border-b border-stone-100">
                    <div>
                      <p class="font-bold text-stone-800">${item.name}</p>
                      <p class="text-[10px] text-stone-400">${item.qty} ${item.unit} × ₹${item.rate}</p>
                    </div>
                    <span class="font-bold text-[var(--text-main)]">₹${item.total}</span>
                  </div>
                `).join('') : `
                  <div class="text-center py-4 text-stone-400">
                    <p>No sweets in counter cart.</p>
                    <p class="text-[10px] mt-0.5">Click "+ Add" on any sweet to add here!</p>
                  </div>
                `}
              </div>

              <!-- Price Breakdown -->
              <div class="bg-stone-50 rounded-xl p-3 space-y-1.5 text-xs mb-4">
                <div class="flex justify-between text-stone-500 font-medium">
                  <span>Subtotal</span>
                  <span class="font-bold text-stone-800">₹${calculateQuickCartTotal(quickCart)}</span>
                </div>
                <div class="flex justify-between text-stone-500 font-medium">
                  <span>Discount</span>
                  <span class="text-emerald-600 font-bold">- ₹0</span>
                </div>
                <div class="flex justify-between text-stone-500 font-medium">
                  <span>Tax (GST 0%)</span>
                  <span class="text-stone-800 font-bold">₹0</span>
                </div>
                <div class="border-t border-stone-200 pt-1.5 flex justify-between font-bold text-sm text-stone-900">
                  <span>Total Payable</span>
                  <span class="text-[var(--brand-primary)]">₹${calculateQuickCartTotal(quickCart)}</span>
                </div>
              </div>
            </div>

            <!-- Proceed to Checkout Button -->
            <button 
              id="dashboard-checkout-btn"
              class="spring-btn w-full py-3 px-4 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>
          </section>
        </div>
      </div>
    </div>
  `;
}

function calculateQuickCartTotal(cart) {
  if (!cart || cart.length === 0) return 0;
  return cart.reduce((acc, item) => acc + item.total, 0);
}
