// Dashboard View Component - 100% Exact Match with Stitch Dashboard (screen.png)
// Features: 
// 1. 6 KPI Stat Cards (Customers, Sales, Orders, Profit, Cost, Returning) with Status Badges and Color Waves
// 2. Sales Overview Area Chart (Monthly trajectory, Gross Sales 1 Sep - 30 Sep, interactive spline)
// 3. Order Status Donut Chart (Total 126 Orders in center, Delivered, Processing, Pending, Canceled breakdown)
// 4. Fast Selling Sweets & Stock Table (KK, RG, GJ, ML, KP, MC with stock badges and quick + Add buttons)
// 5. Quick Billing (POS) Card (Counter 1, Selected Customer Jignesh Shah, Line Items, Subtotal, Proceed to Checkout)

export function renderDashboardView(state) {
  const { kpis, quickCart = [] } = state;

  const defaultItems = [
    { id: 'sw-1', name: 'Kaju Katli', qty: 0.5, rate: 450, total: 225, unit: 'kg' },
    { id: 'sw-3', name: 'Gulab Jamun', qty: 1, rate: 180, total: 180, unit: 'kg' },
    { id: 'sw-4', name: 'Motichoor Ladoo', qty: 1, rate: 160, total: 160, unit: 'kg' }
  ];
  const items = (quickCart && quickCart.length > 0) ? quickCart : defaultItems;
  const subtotal = items.reduce((sum, item) => sum + (item.total || Math.round(item.qty * (item.rate || item.price || 0))), 0);
  const totalPayable = subtotal;

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
            <select id="dashboard-time-filter" class="appearance-none bg-white border border-[#F0ECE4] text-xs sm:text-sm font-medium text-stone-700 py-2 pl-3.5 pr-8 rounded-xl shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer transition-colors">
              <option value="month" ${state.timeFilter === 'month' ? 'selected' : ''}>This Month</option>
              <option value="today" ${state.timeFilter === 'today' ? 'selected' : ''}>Today</option>
              <option value="week" ${state.timeFilter === 'week' ? 'selected' : ''}>This Week</option>
              <option value="quarter" ${state.timeFilter === 'quarter' ? 'selected' : ''}>Quarterly</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-400">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Mobile Quick Search Trigger (10000x Better Mobile Search) -->
      <div class="md:hidden w-full -mt-2" data-purpose="mobile-hero-search">
        <button 
          type="button" 
          id="mobile-hero-search-trigger"
          class="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#F0ECE4] shadow-xs rounded-2xl text-left text-stone-400 text-xs font-medium cursor-pointer active:scale-98 transition-all hover:border-[#C86D3B]/40"
        >
          <span class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-[#C86D3B]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span class="text-stone-600 font-semibold">Search sweets, customers, bills...</span>
          </span>
          <span class="px-2.5 py-1 rounded-xl bg-orange-50 text-[#C86D3B] text-[10px] font-bold border border-orange-200/60 shadow-2xs">🔍 Search</span>
        </button>
      </div>

      <!-- Sticky Floating Quick-KPI Ribbon (Desktop only - smoothly slides in when scrolling past tiles) -->
      <div 
        id="sticky-kpi-bar" 
        class="sticky top-2 z-30 mb-2 backdrop-blur-md bg-white/95 border border-[#F0ECE4] shadow-[0_8px_30px_rgba(74,58,47,0.08)] rounded-2xl px-4 py-2.5 hidden md:flex items-center justify-between transition-all duration-300 transform -translate-y-8 opacity-0 pointer-events-none"
        data-purpose="sticky-kpi-dock"
      >
        <div class="flex items-center space-x-3 overflow-hidden">
          <div class="flex items-center space-x-2 text-xs font-bold text-[#C86D3B] bg-orange-50/90 px-3 py-1 rounded-full border border-orange-200/60 shadow-2xs shrink-0">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span id="current-view-label">Dashboard Overview</span>
          </div>
          <div class="hidden sm:flex items-center space-x-4 text-xs font-semibold text-[#2A1F1D] truncate">
            <span class="flex items-center text-stone-600"><span class="text-stone-400 mr-1.5 font-normal">Customers:</span> <b class="text-stone-900 font-bold">184</b></span>
            <span class="text-stone-300">•</span>
            <span class="flex items-center text-stone-600"><span class="text-stone-400 mr-1.5 font-normal">Sales:</span> <b class="text-emerald-700 font-bold">₹42,850</b></span>
            <span class="text-stone-300">•</span>
            <span class="flex items-center text-stone-600"><span class="text-stone-400 mr-1.5 font-normal">Orders:</span> <b class="text-purple-700 font-bold">126</b></span>
            <span class="text-stone-300 hidden md:inline">•</span>
            <span class="hidden md:flex items-center text-stone-600"><span class="text-stone-400 mr-1.5 font-normal">Profit:</span> <b class="text-teal-700 font-bold">₹14,620</b> <span class="text-[10px] text-teal-600 ml-1 font-semibold">(34.1%)</span></span>
          </div>
        </div>

        <div class="flex items-center space-x-2 shrink-0">
          <button 
            id="sticky-pos-shortcut" 
            data-tab="pos" 
            class="px-3 py-1.5 rounded-xl bg-[#C86D3B] hover:bg-[#B25D2E] active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <span>+ Sell POS</span>
          </button>
          <button 
            id="scroll-to-top-btn" 
            class="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer"
            title="Scroll to top of tiles"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>
            <span class="hidden sm:inline">Top</span>
          </button>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- 6 KPI Stat Cards Grid (Mobile 2-Cols / Desktop 3-Cols)   -->
      <!-- 1:1 with Stitch screen.png with Pastel Tinted Gradients   -->
      <!-- ======================================================== -->
      <section id="kpi-tiles-container" class="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5" data-purpose="kpi-metrics-grid">
        
        <!-- CARD 1: Customers -->
        <article class="animate-card-pop stagger-1 interactive-scale bg-gradient-to-br from-[#FFF9F5] via-[#FFF3EB] to-[#FCEAE0] border border-[#F6E7DC] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" data-tab="customers">
          <!-- Top Row: Icon Badge & 3-Dots Menu -->
          <div class="flex items-center justify-between">
            <span class="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FCEEE3] text-[#C86D3B] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            </span>
            <button class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-black/5 transition-colors" title="More options">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>
            </button>
          </div>

          <!-- Middle: Label & Stat -->
          <div class="mt-2.5 sm:mt-4 z-10">
            <p class="text-xs sm:text-sm font-semibold text-[#5A4E4D]">Customers</p>
            <p class="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">184</p>
          </div>

          <!-- Bottom Row: Trend Badge & Bezier Sparkline -->
          <div class="mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="flex items-center text-emerald-600 font-bold text-[10px] sm:text-xs z-10">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 17l10-10M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              <span>+12%</span>
            </div>

            <!-- Soft Bezier Sparkline (1:1 with screen.png) -->
            <div class="w-20 sm:w-32 md:w-36 h-8 sm:h-12 absolute -right-2 -bottom-2 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
              <svg class="w-full h-full" viewBox="0 0 140 45" fill="none">
                <path d="M 5 35 Q 35 32, 60 22 T 95 18 T 135 6" stroke="#E07A5F" stroke-width="2.5" stroke-linecap="round"></path>
                <path d="M 5 35 Q 35 32, 60 22 T 95 18 T 135 6 L 135 45 L 5 45 Z" fill="url(#peachSparkFill)" opacity="0.25"></path>
                <defs>
                  <linearGradient id="peachSparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#E07A5F" stop-opacity="0.6"></stop>
                    <stop offset="100%" stop-color="#E07A5F" stop-opacity="0.0"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </article>

        <!-- CARD 2: Sales -->
        <article class="animate-card-pop stagger-2 interactive-scale bg-gradient-to-br from-[#F4FAF6] via-[#EAF5EE] to-[#E2F2E7] border border-[#E0EFE6] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" data-tab="pos">
          <!-- Top Row: Icon Badge & 3-Dots Menu -->
          <div class="flex items-center justify-between">
            <span class="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#EAF7EE] text-[#16A34A] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C9.5 2 7.8 3.5 7.4 5.5L4 7.2v1.5l1.6.8C5.2 11.2 5 13 5 15c0 4.4 3.1 7 7 7s7-2.6 7-7c0-2-.2-3.8-.6-5.5l1.6-.8V7.2l-3.4-1.7C16.2 3.5 14.5 2 12 2zm0 6c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm0 8c1.7 0 3 .9 3 2H9c0-1.1 1.3-2 3-2z"></path>
              </svg>
            </span>
            <button class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-black/5 transition-colors" title="More options">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>
            </button>
          </div>

          <!-- Middle: Label & Stat -->
          <div class="mt-2.5 sm:mt-4 z-10">
            <p class="text-xs sm:text-sm font-semibold text-[#5A4E4D]">Sales</p>
            <p class="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">₹42,850</p>
          </div>

          <!-- Bottom Row: Trend Badge & Bezier Sparkline -->
          <div class="mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="flex items-center text-emerald-600 font-bold text-[10px] sm:text-xs z-10">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 17l10-10M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              <span>+8.4%</span>
            </div>

            <!-- Soft Bezier Sparkline -->
            <div class="w-20 sm:w-32 md:w-36 h-8 sm:h-12 absolute -right-2 -bottom-2 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
              <svg class="w-full h-full" viewBox="0 0 140 45" fill="none">
                <path d="M 5 32 Q 35 28, 65 18 T 100 14 T 135 5" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"></path>
                <path d="M 5 32 Q 35 28, 65 18 T 100 14 T 135 5 L 135 45 L 5 45 Z" fill="url(#mintSparkFill)" opacity="0.25"></path>
                <defs>
                  <linearGradient id="mintSparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#10B981" stop-opacity="0.6"></stop>
                    <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </article>

        <!-- CARD 3: Orders -->
        <article class="animate-card-pop stagger-3 interactive-scale bg-gradient-to-br from-[#F8F5FD] via-[#EFEBF9] to-[#E8E0F7] border border-[#E9E2F5] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" data-tab="orders">
          <!-- Top Row: Icon Badge & 3-Dots Menu -->
          <div class="flex items-center justify-between">
            <span class="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F3EEFC] text-[#7C3AED] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <button class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-black/5 transition-colors" title="More options">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>
            </button>
          </div>

          <!-- Middle: Label & Stat -->
          <div class="mt-2.5 sm:mt-4 z-10">
            <p class="text-xs sm:text-sm font-semibold text-[#5A4E4D]">Orders</p>
            <p class="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">126</p>
          </div>

          <!-- Bottom Row: Trend Badge & Bezier Sparkline -->
          <div class="mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="flex items-center text-emerald-600 font-bold text-[10px] sm:text-xs z-10">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 17l10-10M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              <span>+9.2%</span>
            </div>

            <!-- Soft Bezier Sparkline -->
            <div class="w-20 sm:w-32 md:w-36 h-8 sm:h-12 absolute -right-2 -bottom-2 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
              <svg class="w-full h-full" viewBox="0 0 140 45" fill="none">
                <path d="M 5 34 Q 35 24, 70 26 T 105 14 T 135 4" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round"></path>
                <path d="M 5 34 Q 35 24, 70 26 T 105 14 T 135 4 L 135 45 L 5 45 Z" fill="url(#lavSparkFill)" opacity="0.25"></path>
                <defs>
                  <linearGradient id="lavSparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.6"></stop>
                    <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.0"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </article>

        <!-- CARD 4: Profit -->
        <article class="animate-card-pop stagger-4 interactive-scale bg-gradient-to-br from-[#F1FAF5] via-[#E8F6EE] to-[#DEEFE6] border border-[#DEEFE6] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" data-tab="analytics">
          <!-- Top Row: Icon Badge & 3-Dots Menu -->
          <div class="flex items-center justify-between">
            <span class="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#E8F6EF] text-[#0D9488] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"></path>
              </svg>
            </span>
            <button class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-black/5 transition-colors" title="More options">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>
            </button>
          </div>

          <!-- Middle: Label & Stat -->
          <div class="mt-2.5 sm:mt-4 z-10">
            <p class="text-xs sm:text-sm font-semibold text-[#5A4E4D]">Profit</p>
            <p class="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">₹14,620</p>
          </div>

          <!-- Bottom Row: Trend Badge & Bezier Sparkline -->
          <div class="mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="text-[#0D9488] font-bold text-[10px] sm:text-xs z-10">
              <span>34.1% margin</span>
            </div>

            <!-- Soft Bezier Sparkline -->
            <div class="w-20 sm:w-32 md:w-36 h-8 sm:h-12 absolute -right-2 -bottom-2 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
              <svg class="w-full h-full" viewBox="0 0 140 45" fill="none">
                <path d="M 5 31 Q 40 30, 75 22 T 115 14 T 135 7" stroke="#0D9488" stroke-width="2.5" stroke-linecap="round"></path>
                <path d="M 5 31 Q 40 30, 75 22 T 115 14 T 135 7 L 135 45 L 5 45 Z" fill="url(#tealSparkFill)" opacity="0.25"></path>
                <defs>
                  <linearGradient id="tealSparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0D9488" stop-opacity="0.6"></stop>
                    <stop offset="100%" stop-color="#0D9488" stop-opacity="0.0"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </article>

        <!-- CARD 5: Cost -->
        <article class="animate-card-pop stagger-5 interactive-scale bg-gradient-to-br from-[#FDF5F4] via-[#FCECEB] to-[#FADEDB] border border-[#F7DDDC] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" data-tab="expenses">
          <!-- Top Row: Icon Badge & 3-Dots Menu -->
          <div class="flex items-center justify-between">
            <span class="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FEECEB] text-[#E11D48] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>
              </svg>
            </span>
            <button class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-black/5 transition-colors" title="More options">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>
            </button>
          </div>

          <!-- Middle: Label & Stat -->
          <div class="mt-2.5 sm:mt-4 z-10">
            <p class="text-xs sm:text-sm font-semibold text-[#5A4E4D]">Cost</p>
            <p class="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">₹28,230</p>
          </div>

          <!-- Bottom Row: Trend Badge & Bezier Sparkline -->
          <div class="mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="text-rose-500 font-bold text-[10px] sm:text-xs z-10">
              <span>65.9%</span>
            </div>

            <!-- Soft Bezier Sparkline -->
            <div class="w-20 sm:w-32 md:w-36 h-8 sm:h-12 absolute -right-2 -bottom-2 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
              <svg class="w-full h-full" viewBox="0 0 140 45" fill="none">
                <path d="M 5 18 Q 35 22, 68 28 T 105 22 T 135 32" stroke="#F43F5E" stroke-width="2.5" stroke-linecap="round"></path>
                <path d="M 5 18 Q 35 22, 68 28 T 105 22 T 135 32 L 135 45 L 5 45 Z" fill="url(#roseSparkFill)" opacity="0.25"></path>
                <defs>
                  <linearGradient id="roseSparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.6"></stop>
                    <stop offset="100%" stop-color="#F43F5E" stop-opacity="0.0"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </article>

        <!-- CARD 6: Returning -->
        <article class="animate-card-pop stagger-6 interactive-scale bg-gradient-to-br from-[#F2F7FD] via-[#ECF3FC] to-[#E0EDFA] border border-[#DBE7F6] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" data-tab="customers">
          <!-- Top Row: Icon Badge & 3-Dots Menu -->
          <div class="flex items-center justify-between">
            <span class="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#EAF4FD] text-[#0284C7] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <button class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-black/5 transition-colors" title="More options">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>
            </button>
          </div>

          <!-- Middle: Label & Stat -->
          <div class="mt-2.5 sm:mt-4 z-10">
            <p class="text-xs sm:text-sm font-semibold text-[#5A4E4D]">Returning</p>
            <p class="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">76 <span class="text-xs sm:text-sm font-medium text-stone-500">cust</span></p>
          </div>

          <!-- Bottom Row: Trend Badge & Bezier Sparkline -->
          <div class="mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="flex items-center text-sky-600 font-bold text-[10px] sm:text-xs z-10">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 17l10-10M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              <span>41.3%</span>
            </div>

            <!-- Soft Bezier Sparkline -->
            <div class="w-20 sm:w-32 md:w-36 h-8 sm:h-12 absolute -right-2 -bottom-2 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity">
              <svg class="w-full h-full" viewBox="0 0 140 45" fill="none">
                <path d="M 5 33 Q 40 32, 75 22 T 115 14 T 135 5" stroke="#0284C7" stroke-width="2.5" stroke-linecap="round"></path>
                <path d="M 5 33 Q 40 32, 75 22 T 115 14 T 135 5 L 135 45 L 5 45 Z" fill="url(#skySparkFill)" opacity="0.25"></path>
                <defs>
                  <linearGradient id="skySparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0284C7" stop-opacity="0.6"></stop>
                    <stop offset="100%" stop-color="#0284C7" stop-opacity="0.0"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </article>

      </section>

      <!-- ======================================================== -->
      <!-- MAIN 12-COLUMN DASHBOARD GRID (1:1 with Stitch screen.png) -->
      <!-- With Scroll-Reveal Staggered Animations for All Sections  -->
      <!-- ======================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6" data-purpose="main-dashboard-grid">
        
        <!-- ====================================================== -->
        <!-- LEFT COLUMN (8 COLS): Sales Overview & Fast Selling Table -->
        <!-- ====================================================== -->
        <div class="lg:col-span-8 space-y-6">
          
          <!-- SECTION 1: Sales Overview Area Chart -->
          <section id="section-sales-overview" class="scroll-reveal-item bg-white p-5 sm:p-6 rounded-3xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)]" data-purpose="sales-chart-card">
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
          <section id="section-fast-selling" class="scroll-reveal-item bg-white rounded-3xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)] overflow-hidden" data-purpose="fast-selling-sweets-table">
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
                  <tr class="table-row-hover transition-all cursor-pointer">
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
                        class="quick-add-to-cart-btn interactive-scale px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-[#C86D3B] hover:text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                        data-id="sw-1" 
                        data-name="Kaju Katli" 
                        data-price="450"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>

                  <!-- Item 2: Rasgulla -->
                  <tr class="table-row-hover transition-all cursor-pointer">
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
                        class="quick-add-to-cart-btn interactive-scale px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-[#C86D3B] hover:text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                        data-id="sw-2" 
                        data-name="Rasgulla" 
                        data-price="320"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>

                  <!-- Item 3: Gulab Jamun -->
                  <tr class="table-row-hover transition-all cursor-pointer">
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
                        class="quick-add-to-cart-btn interactive-scale px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-[#C86D3B] hover:text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                        data-id="sw-3" 
                        data-name="Gulab Jamun" 
                        data-price="180"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>

                  <!-- Item 4: Motichoor Ladoo (Low Stock) -->
                  <tr class="table-row-hover transition-all cursor-pointer">
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
                        class="quick-add-to-cart-btn interactive-scale px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-[#C86D3B] hover:text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                        data-id="sw-4" 
                        data-name="Motichoor Ladoo" 
                        data-price="160"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>

                  <!-- Item 5: Kesar Peda -->
                  <tr class="table-row-hover transition-all cursor-pointer">
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
                        class="quick-add-to-cart-btn interactive-scale px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-[#C86D3B] hover:text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                        data-id="sw-5" 
                        data-name="Kesar Peda" 
                        data-price="380"
                      >
                        + Add
                      </button>
                    </td>
                  </tr>

                  <!-- Item 6: Milk Cake -->
                  <tr class="table-row-hover transition-all cursor-pointer">
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
                        class="quick-add-to-cart-btn interactive-scale px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-[#C86D3B] hover:text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
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
          <section id="section-order-status" class="scroll-reveal-item bg-white p-5 sm:p-6 rounded-3xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)]" data-purpose="order-status-card">
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
          <section id="section-quick-billing" class="scroll-reveal-item bg-white p-5 rounded-3xl border border-[#F0ECE4] shadow-[0_2px_10px_rgba(74,58,47,0.04)] flex flex-col justify-between" data-purpose="quick-pos-widget">
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
                ${items.map((item, idx) => `
                  <div class="flex items-center justify-between py-1.5 ${idx < items.length - 1 ? 'border-b border-stone-100' : ''} group">
                    <div>
                      <p class="font-semibold text-stone-800">${item.name}</p>
                      <p class="text-[11px] text-stone-400">${item.qty < 1 ? Math.round(item.qty * 1000) + ' g' : item.qty + ' kg'} × ₹${item.rate || item.price || 0}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                      <span class="font-bold text-[#2A1F1D]">₹${item.total || Math.round(item.qty * (item.rate || item.price || 0))}</span>
                      <button class="remove-quick-item-btn opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-500 p-0.5 transition-opacity cursor-pointer" data-index="${idx}" title="Remove item">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Price Breakdown Box -->
              <div class="bg-stone-50 rounded-xl p-3 space-y-1.5 text-xs mb-4">
                <div class="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>₹${subtotal}</span>
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
                  <span class="text-[#C86D3B] text-base font-bold">₹${totalPayable}</span>
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
