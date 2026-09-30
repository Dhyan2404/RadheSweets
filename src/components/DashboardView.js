// Dashboard View Component - 100% Exact Match with Stitch Dashboard (screen.png)
// Features: 
// 1. 6 KPI Stat Cards (Customers, Sales, Orders, Profit, Cost, Returning) with Status Badges and Color Waves
// 2. Sales Overview Area Chart (Monthly trajectory, Gross Sales 1 Sep - 30 Sep, interactive spline)
// 3. Order Status Donut Chart (Total 126 Orders in center, Delivered, Processing, Pending, Canceled breakdown)
// 4. Fast Selling Sweets & Stock Table (KK, RG, GJ, ML, KP, MC with stock badges and quick + Add buttons)
// 5. Quick Billing (POS) Card (Counter 1, Selected Customer Jignesh Shah, Line Items, Subtotal, Proceed to Checkout)

export function renderDashboardView(state) {
  const { kpis, quickCart = [] } = state;

  return `
    <div class="space-y-6 animate-fadeIn select-none" data-purpose="stitch-dashboard">
      
      <!-- Greeting & Time Filter Header -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-purpose="greeting-header">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-[#2A1F1D] tracking-tight">Dashboard</h1>
          <p class="text-xs sm:text-sm text-stone-500 mt-0.5">Here's what's happening with your sweet shop today.</p>
        </div>

        <!-- Time Filter Dropdown (1:1 with Stitch screen.png) -->
        <div class="flex items-center space-x-2">
          <div class="relative">
            <select class="appearance-none bg-white border border-[#F0ECE4] text-xs sm:text-sm font-medium text-stone-700 py-2 pl-3.5 pr-8 rounded-xl shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer transition-colors">
              <option>This Month</option>
              <option>Today</option>
              <option>This Week</option>
              <option>Quarterly</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-400">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- 6 KPI Stat Cards in exact row (1:1 with Stitch screen.png) -->
      <!-- ======================================================== -->
      <section class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4" data-purpose="kpi-metrics-grid">
        
        <!-- KPI 1: Customers -->
        <article class="bg-white p-4 rounded-2xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-[0_4px_20px_-2px_rgba(92,64,43,0.08)] transition-all flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              +12%
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Customers</p>
            <p class="text-xl font-bold text-[#2A1F1D] mt-0.5">184</p>
          </div>
          <div class="mt-2 text-amber-400">
            <svg class="w-full h-8" fill="none" viewBox="0 0 100 28">
              <path d="M0 24 Q 20 22, 35 15 T 70 12 T 100 4" fill="none" stroke="#F59E0B" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 24 Q 20 22, 35 15 T 70 12 T 100 4 L 100 28 L 0 28 Z" fill="url(#amber-grad)" opacity="0.18"></path>
              <defs>
                <linearGradient id="amber-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#F59E0B"></stop>
                  <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>

        <!-- KPI 2: Sales -->
        <article class="bg-white p-4 rounded-2xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-[0_4px_20px_-2px_rgba(92,64,43,0.08)] transition-all flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              +8.4%
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Sales</p>
            <p class="text-xl font-bold text-[#2A1F1D] mt-0.5">₹42,850</p>
          </div>
          <div class="mt-2">
            <svg class="w-full h-8" fill="none" viewBox="0 0 100 28">
              <path d="M0 20 Q 25 18, 50 10 T 80 8 T 100 3" fill="none" stroke="#10B981" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 20 Q 25 18, 50 10 T 80 8 T 100 3 L 100 28 L 0 28 Z" fill="url(#mint-grad)" opacity="0.18"></path>
              <defs>
                <linearGradient id="mint-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#10B981"></stop>
                  <stop offset="100%" stop-color="#10B981" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>

        <!-- KPI 3: Orders -->
        <article class="bg-white p-4 rounded-2xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-[0_4px_20px_-2px_rgba(92,64,43,0.08)] transition-all flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              +9.2%
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Orders</p>
            <p class="text-xl font-bold text-[#2A1F1D] mt-0.5">126</p>
          </div>
          <div class="mt-2">
            <svg class="w-full h-8" fill="none" viewBox="0 0 100 28">
              <path d="M0 22 Q 30 16, 55 18 T 85 8 T 100 2" fill="none" stroke="#8B5CF6" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 22 Q 30 16, 55 18 T 85 8 T 100 2 L 100 28 L 0 28 Z" fill="url(#lav-grad)" opacity="0.18"></path>
              <defs>
                <linearGradient id="lav-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#8B5CF6"></stop>
                  <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>

        <!-- KPI 4: Profit -->
        <article class="bg-white p-4 rounded-2xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-[0_4px_20px_-2px_rgba(92,64,43,0.08)] transition-all flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span class="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              34.1% margin
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Profit</p>
            <p class="text-xl font-bold text-[#2A1F1D] mt-0.5">₹14,620</p>
          </div>
          <div class="mt-2">
            <svg class="w-full h-8" fill="none" viewBox="0 0 100 28">
              <path d="M0 21 Q 30 20, 60 14 T 90 9 T 100 4" fill="none" stroke="#0D9488" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 21 Q 30 20, 60 14 T 90 9 T 100 4 L 100 28 L 0 28 Z" fill="url(#teal-grad)" opacity="0.18"></path>
              <defs>
                <linearGradient id="teal-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0D9488"></stop>
                  <stop offset="100%" stop-color="#0D9488" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>

        <!-- KPI 5: Cost -->
        <article class="bg-white p-4 rounded-2xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-[0_4px_20px_-2px_rgba(92,64,43,0.08)] transition-all flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span class="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
              65.9%
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Cost</p>
            <p class="text-xl font-bold text-[#2A1F1D] mt-0.5">₹28,230</p>
          </div>
          <div class="mt-2">
            <svg class="w-full h-8" fill="none" viewBox="0 0 100 28">
              <path d="M0 12 Q 25 15, 50 18 T 75 14 T 100 20" fill="none" stroke="#F43F5E" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 12 Q 25 15, 50 18 T 75 14 T 100 20 L 100 28 L 0 28 Z" fill="url(#rose-grad)" opacity="0.18"></path>
              <defs>
                <linearGradient id="rose-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#F43F5E"></stop>
                  <stop offset="100%" stop-color="#F43F5E" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>

        <!-- KPI 6: Returning -->
        <article class="bg-white p-4 rounded-2xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-[0_4px_20px_-2px_rgba(92,64,43,0.08)] transition-all flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              +41.3%
            </span>
          </div>
          <div class="mt-3">
            <p class="text-xs text-stone-500 font-medium">Returning</p>
            <p class="text-xl font-bold text-[#2A1F1D] mt-0.5">76 <span class="text-xs font-normal text-stone-400">cust</span></p>
          </div>
          <div class="mt-2">
            <svg class="w-full h-8" fill="none" viewBox="0 0 100 28">
              <path d="M0 24 Q 30 22, 60 16 T 85 10 T 100 2" fill="none" stroke="#0284C7" stroke-linecap="round" stroke-width="2"></path>
              <path d="M0 24 Q 30 22, 60 16 T 85 10 T 100 2 L 100 28 L 0 28 Z" fill="url(#sky-grad)" opacity="0.18"></path>
              <defs>
                <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0284C7"></stop>
                  <stop offset="100%" stop-color="#0284C7" stop-opacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </article>

      </section>

      <!-- ======================================================== -->
      <!-- MAIN 12-COLUMN DASHBOARD GRID (1:1 with Stitch screen.png) -->
      <!-- ======================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6" data-purpose="main-dashboard-grid">
        
        <!-- ====================================================== -->
        <!-- LEFT COLUMN (8 COLS): Sales Overview & Fast Selling Table -->
        <!-- ====================================================== -->
        <div class="lg:col-span-8 space-y-6">
          
          <!-- SECTION 1: Sales Overview Area Chart -->
          <section class="bg-white p-5 sm:p-6 rounded-2xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)]" data-purpose="sales-chart-card">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0ECE4]/70 gap-2">
              <div>
                <h3 class="text-base font-bold text-[#2A1F1D]">Sales Overview</h3>
                <p class="text-xs text-stone-400">Monthly trajectory &amp; revenue spikes</p>
              </div>

              <!-- Legend -->
              <div class="flex items-center space-x-3 text-xs">
                <span class="inline-flex items-center text-stone-600 font-medium">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#C86D3B] mr-1.5"></span>
                  Gross Sales
                </span>
                <span class="text-stone-300">|</span>
                <span class="text-stone-500 font-medium">1 Sep – 30 Sep</span>
              </div>
            </div>

            <!-- SVG Line & Area Graph (1:1 with Stitch reference) -->
            <div class="relative w-full h-56 pt-3">
              <svg class="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#C86D3B" stop-opacity="0.25"></stop>
                    <stop offset="100%" stop-color="#C86D3B" stop-opacity="0.0"></stop>
                  </linearGradient>
                </defs>

                <!-- Horizontal Dashed Grid Lines -->
                <line x1="40" y1="20" x2="700" y2="20" stroke="#F4EFEA" stroke-width="1" stroke-dasharray="4 4"></line>
                <line x1="40" y1="65" x2="700" y2="65" stroke="#F4EFEA" stroke-width="1" stroke-dasharray="4 4"></line>
                <line x1="40" y1="110" x2="700" y2="110" stroke="#F4EFEA" stroke-width="1" stroke-dasharray="4 4"></line>
                <line x1="40" y1="155" x2="700" y2="155" stroke="#F4EFEA" stroke-width="1"></line>

                <!-- Y-Axis Value Labels -->
                <text x="5" y="24" fill="#A8A29E" font-size="10" font-family="sans-serif">50K</text>
                <text x="5" y="69" fill="#A8A29E" font-size="10" font-family="sans-serif">40K</text>
                <text x="5" y="114" fill="#A8A29E" font-size="10" font-family="sans-serif">20K</text>
                <text x="5" y="159" fill="#A8A29E" font-size="10" font-family="sans-serif">10K</text>

                <!-- Gradient Fill Under Curve -->
                <path d="M 50 145 C 100 130, 140 148, 190 100 C 240 60, 280 95, 340 55 C 400 20, 450 70, 520 40 C 580 15, 630 65, 690 30 L 690 160 L 50 160 Z" fill="url(#chartFill)"></path>

                <!-- Primary Curve Line -->
                <path d="M 50 145 C 100 130, 140 148, 190 100 C 240 60, 280 95, 340 55 C 400 20, 450 70, 520 40 C 580 15, 630 65, 690 30" fill="none" stroke="#C86D3B" stroke-width="3.5" stroke-linecap="round"></path>

                <!-- Peak Data Markers -->
                <circle cx="520" cy="40" r="5" fill="#FFFFFF" stroke="#C86D3B" stroke-width="3"></circle>
                <circle cx="690" cy="30" r="5" fill="#FFFFFF" stroke="#C86D3B" stroke-width="3"></circle>
              </svg>

              <!-- X-Axis Dates -->
              <div class="flex justify-between pl-8 pr-2 pt-2 text-[11px] font-medium text-stone-400">
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

          <!-- SECTION 2: Fast Selling Sweets & Stock Table (1:1 with Stitch screen.png) -->
          <section class="bg-white rounded-2xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)] overflow-hidden" data-purpose="fast-selling-sweets-table">
            <div class="p-5 border-b border-[#F0ECE4] flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-[#2A1F1D]">Fast Selling Sweets &amp; Stock</h3>
                <p class="text-xs text-stone-400">Popular freshly prepared batch items for today</p>
              </div>
              <button 
                class="text-xs font-semibold text-[#C86D3B] hover:text-[#B25D2E] flex items-center cursor-pointer transition-colors"
                data-tab="products"
              >
                <span>View Full Menu</span>
                <svg class="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr class="bg-stone-50/70 border-b border-[#F0ECE4] text-stone-500 font-semibold text-[11px] uppercase tracking-wider">
                    <th class="py-3 px-5">Sweet Name</th>
                    <th class="py-3 px-4">Category</th>
                    <th class="py-3 px-4">Rate (₹)</th>
                    <th class="py-3 px-4">Stock Status</th>
                    <th class="py-3 px-4 text-right">Quick Order</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#F0ECE4]/60">
                  
                  <!-- Item 1: Kaju Katli -->
                  <tr class="hover:bg-amber-50/30 transition-colors">
                    <td class="py-3 px-5 flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-lg bg-amber-100/70 border border-amber-200 flex items-center justify-center font-bold text-amber-800 text-xs shadow-2xs">
                        KK
                      </div>
                      <span class="font-semibold text-[#2A1F1D]">Kaju Katli</span>
                    </td>
                    <td class="py-3 px-4 text-stone-500">Dry Fruit Sweet</td>
                    <td class="py-3 px-4 font-semibold text-[#2A1F1D]">₹450 <span class="text-[11px] font-normal text-stone-400">/kg</span></td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In Stock
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button 
                        class="quick-add-to-cart-btn px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all"
                        data-id="sw-1" 
                        data-name="Kaju Katli" 
                        data-price="450"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>

                  <!-- Item 2: Rasgulla -->
                  <tr class="hover:bg-amber-50/30 transition-colors">
                    <td class="py-3 px-5 flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-lg bg-orange-100/70 border border-orange-200 flex items-center justify-center font-bold text-orange-800 text-xs shadow-2xs">
                        RG
                      </div>
                      <span class="font-semibold text-[#2A1F1D]">Rasgulla</span>
                    </td>
                    <td class="py-3 px-4 text-stone-500">Chhena / Bengali</td>
                    <td class="py-3 px-4 font-semibold text-[#2A1F1D]">₹320 <span class="text-[11px] font-normal text-stone-400">/kg</span></td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In Stock
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button 
                        class="quick-add-to-cart-btn px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all"
                        data-id="sw-2" 
                        data-name="Rasgulla" 
                        data-price="320"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>

                  <!-- Item 3: Gulab Jamun -->
                  <tr class="hover:bg-amber-50/30 transition-colors">
                    <td class="py-3 px-5 flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-lg bg-amber-900/10 border border-amber-900/20 flex items-center justify-center font-bold text-amber-900 text-xs shadow-2xs">
                        GJ
                      </div>
                      <span class="font-semibold text-[#2A1F1D]">Gulab Jamun</span>
                    </td>
                    <td class="py-3 px-4 text-stone-500">Mawa Sweet</td>
                    <td class="py-3 px-4 font-semibold text-[#2A1F1D]">₹180 <span class="text-[11px] font-normal text-stone-400">/kg</span></td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In Stock
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button 
                        class="quick-add-to-cart-btn px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all"
                        data-id="sw-3" 
                        data-name="Gulab Jamun" 
                        data-price="180"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>

                  <!-- Item 4: Motichoor Ladoo (Low Stock) -->
                  <tr class="hover:bg-amber-50/30 transition-colors">
                    <td class="py-3 px-5 flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-lg bg-yellow-100 border border-yellow-200 flex items-center justify-center font-bold text-amber-800 text-xs shadow-2xs">
                        ML
                      </div>
                      <span class="font-semibold text-[#2A1F1D]">Motichoor Ladoo</span>
                    </td>
                    <td class="py-3 px-4 text-stone-500">Desi Ghee</td>
                    <td class="py-3 px-4 font-semibold text-[#2A1F1D]">₹160 <span class="text-[11px] font-normal text-stone-400">/kg</span></td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-300">
                        Low Stock
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button 
                        class="quick-add-to-cart-btn px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all"
                        data-id="sw-4" 
                        data-name="Motichoor Ladoo" 
                        data-price="160"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>

                  <!-- Item 5: Kesar Peda -->
                  <tr class="hover:bg-amber-50/30 transition-colors">
                    <td class="py-3 px-5 flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-amber-900 text-xs shadow-2xs">
                        KP
                      </div>
                      <span class="font-semibold text-[#2A1F1D]">Kesar Peda</span>
                    </td>
                    <td class="py-3 px-4 text-stone-500">Special Milk Peda</td>
                    <td class="py-3 px-4 font-semibold text-[#2A1F1D]">₹380 <span class="text-[11px] font-normal text-stone-400">/kg</span></td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In Stock
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button 
                        class="quick-add-to-cart-btn px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all"
                        data-id="sw-5" 
                        data-name="Kesar Peda" 
                        data-price="380"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>

                  <!-- Item 6: Milk Cake -->
                  <tr class="hover:bg-amber-50/30 transition-colors">
                    <td class="py-3 px-5 flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-lg bg-orange-100/60 border border-orange-200 flex items-center justify-center font-bold text-orange-900 text-xs shadow-2xs">
                        MC
                      </div>
                      <span class="font-semibold text-[#2A1F1D]">Milk Cake</span>
                    </td>
                    <td class="py-3 px-4 text-stone-500">Caramelized Mawa</td>
                    <td class="py-3 px-4 font-semibold text-[#2A1F1D]">₹300 <span class="text-[11px] font-normal text-stone-400">/kg</span></td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In Stock
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button 
                        class="quick-add-to-cart-btn px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-orange-100 active:scale-95 transition-all"
                        data-id="sw-7" 
                        data-name="Milk Cake" 
                        data-price="300"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </section>

        </div>

        <!-- ====================================================== -->
        <!-- RIGHT COLUMN (4 COLS): Order Status Donut & Quick Billing -->
        <!-- ====================================================== -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- SECTION 3: Order Status Donut Chart (1:1 with Stitch screen.png) -->
          <section class="bg-white p-5 sm:p-6 rounded-2xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)]" data-purpose="order-status-card">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-bold text-[#2A1F1D]">Order Status</h3>
              <span class="text-xs text-stone-400">Today</span>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between pt-2">
              <!-- SVG Donut Chart with Center Text -->
              <div class="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <!-- Background ring -->
                  <circle cx="18" cy="18" r="14.5" fill="none" stroke="#F5EFE9" stroke-width="3.8"></circle>
                  <!-- Delivered (68/126 ~ 54%) #10B981 -->
                  <circle cx="18" cy="18" r="14.5" fill="none" stroke="#10B981" stroke-width="3.8" stroke-dasharray="49 100" stroke-dashoffset="0" class="donut-segment"></circle>
                  <!-- Processing (26/126 ~ 20.6%) #0284C7 -->
                  <circle cx="18" cy="18" r="14.5" fill="none" stroke="#0284C7" stroke-width="3.8" stroke-dasharray="19 100" stroke-dashoffset="-49" class="donut-segment"></circle>
                  <!-- Pending (24/126 ~ 19%) #F59E0B -->
                  <circle cx="18" cy="18" r="14.5" fill="none" stroke="#F59E0B" stroke-width="3.8" stroke-dasharray="17 100" stroke-dashoffset="-68" class="donut-segment"></circle>
                  <!-- Canceled (8/126 ~ 6.3%) #EF4444 -->
                  <circle cx="18" cy="18" r="14.5" fill="none" stroke="#EF4444" stroke-width="3.8" stroke-dasharray="6 100" stroke-dashoffset="-85" class="donut-segment"></circle>
                </svg>

                <!-- Center Total Metric -->
                <div class="absolute text-center flex flex-col items-center justify-center pointer-events-none">
                  <span class="text-xl font-bold text-[#2A1F1D] leading-tight">126</span>
                  <span class="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Orders</span>
                </div>
              </div>

              <!-- Donut Chart Legend -->
              <div class="mt-4 sm:mt-0 sm:ml-4 flex-1 space-y-2.5 text-xs w-full">
                <div class="flex items-center justify-between">
                  <span class="flex items-center text-stone-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>
                    Delivered
                  </span>
                  <span class="font-bold text-[#2A1F1D]">68</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center text-stone-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-sky-500 mr-2"></span>
                    Processing
                  </span>
                  <span class="font-bold text-[#2A1F1D]">26</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center text-stone-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></span>
                    Pending
                  </span>
                  <span class="font-bold text-[#2A1F1D]">24</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center text-stone-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2"></span>
                    Canceled
                  </span>
                  <span class="font-bold text-[#2A1F1D]">8</span>
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 4: Quick Billing (POS) Widget (1:1 with Stitch screen.png) -->
          <section class="bg-white p-5 rounded-2xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)] flex flex-col justify-between" data-purpose="quick-pos-widget">
            <div>
              <div class="flex items-center justify-between border-b border-[#F0ECE4] pb-3 mb-4">
                <div>
                  <h3 class="text-base font-bold text-[#2A1F1D]">Quick Billing (POS)</h3>
                  <p class="text-xs text-stone-400">Order #SA-00130</p>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#C86D3B] text-[11px] font-semibold">Counter 1</span>
              </div>

              <!-- Selected Customer Pill -->
              <div class="bg-amber-50/60 rounded-xl p-3 border border-amber-100 mb-4 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-9 h-9 rounded-full bg-amber-200/80 text-amber-900 font-bold text-xs flex items-center justify-center shadow-2xs">
                    JS
                  </div>
                  <div>
                    <div class="flex items-center space-x-1.5">
                      <span class="font-semibold text-xs text-[#2A1F1D]">Jignesh Shah</span>
                      <span class="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded">VIP</span>
                    </div>
                    <p class="text-[11px] text-stone-500">+91 98765 67890</p>
                  </div>
                </div>
                <button class="text-stone-400 hover:text-stone-600 p-1 transition-colors" title="Change Customer">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                </button>
              </div>

              <!-- Quick Order Selected Sweets Line Items -->
              <div class="space-y-2.5 mb-4 text-xs">
                <!-- Line Item 1 -->
                <div class="flex items-center justify-between py-1.5 border-b border-stone-100">
                  <div>
                    <p class="font-semibold text-stone-800">Kaju Katli</p>
                    <p class="text-[11px] text-stone-400">500 g × ₹450</p>
                  </div>
                  <span class="font-bold text-[#2A1F1D]">₹225</span>
                </div>
                <!-- Line Item 2 -->
                <div class="flex items-center justify-between py-1.5 border-b border-stone-100">
                  <div>
                    <p class="font-semibold text-stone-800">Gulab Jamun</p>
                    <p class="text-[11px] text-stone-400">1 kg × ₹180</p>
                  </div>
                  <span class="font-bold text-[#2A1F1D]">₹180</span>
                </div>
                <!-- Line Item 3 -->
                <div class="flex items-center justify-between py-1.5">
                  <div>
                    <p class="font-semibold text-stone-800">Motichoor Ladoo</p>
                    <p class="text-[11px] text-stone-400">1 kg × ₹160</p>
                  </div>
                  <span class="font-bold text-[#2A1F1D]">₹160</span>
                </div>
              </div>

              <!-- Price Breakdown Box -->
              <div class="bg-stone-50 rounded-xl p-3 space-y-1.5 text-xs mb-4">
                <div class="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>₹565</span>
                </div>
                <div class="flex justify-between text-stone-500">
                  <span>Discount</span>
                  <span class="text-emerald-600">- ₹0</span>
                </div>
                <div class="flex justify-between text-stone-500">
                  <span>Tax (GST 0%)</span>
                  <span>₹0</span>
                </div>
                <div class="border-t border-stone-200/80 pt-1.5 flex justify-between font-bold text-sm text-[#2A1F1D]">
                  <span>Total Payable</span>
                  <span class="text-[#C86D3B] text-base">₹565</span>
                </div>
              </div>
            </div>

            <!-- Proceed to Checkout Action -->
            <button 
              id="proceed-to-checkout-btn"
              data-tab="pos"
              class="w-full py-3 px-4 bg-[#C86D3B] hover:bg-[#B25D2E] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
          </section>

        </div>

      </div>

    </div>
  `;
}
