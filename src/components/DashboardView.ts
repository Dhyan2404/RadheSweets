// Dashboard View Component - 100% Exact 1:1 Match with Reference Design (Image 1)
// Features: 3x2 Grid of 6 Spacious KPI Cards with Custom Badges, Three-Dot Menus, Wave Sparklines & Interactive Depth

export function renderDashboardView(state) {
  const { kpis, orderStatusCounts, sweets, salesOverview = [] } = state;

  return `
    <div class="space-y-8 animate-fadeIn">
      <!-- Dashboard Title & Greeting (1:1 with reference image) -->
      <div>
        <h1 class="text-3xl font-black text-[#2A1F1D] tracking-tight">Dashboard</h1>
        <p class="text-sm text-[#7C7267] mt-1 font-medium">Here's what's happening with your sweet shop today.</p>
      </div>

      <!-- 6 KPI Stat Cards in exact 3x2 Grid (1:1 with Reference Design) -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-purpose="reference-kpi-grid">
        
        <!-- CARD 1: Customers -->
        <article class="relative bg-white rounded-3xl p-6 sm:p-7 border border-[#F2ECE4] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.04)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#FCEFE3] flex items-center justify-center text-[#7C4A28] shadow-2xs">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50 transition-colors" title="Card Options">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
              </svg>
            </button>
          </div>

          <!-- Middle: Label & Big Stat -->
          <div class="mt-5 z-10">
            <p class="text-sm font-medium text-[#7C7267]">Customers</p>
            <p class="text-4xl font-extrabold text-[#2A1F1D] tracking-tight mt-1">184</p>
            <div class="flex items-center text-xs font-bold text-[#10B981] mt-2">
              <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M7 17l10-10M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>+12% today</span>
            </div>
          </div>

          <!-- Bottom: Smooth Wave Sparkline Curve (Exact reference match) -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="peach-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#E89B67" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#E89B67" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,55 Q 25,58 50,48 T 100,50 T 150,38 T 200,32 T 260,18 L 260,70 L 0,70 Z" fill="url(#peach-wave)"/>
              <path d="M 0,55 Q 25,58 50,48 T 100,50 T 150,38 T 200,32 T 260,18" fill="none" stroke="#E89B67" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

        <!-- CARD 2: Sales -->
        <article class="relative bg-white rounded-3xl p-6 sm:p-7 border border-[#EAF3EC] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.04)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#1E7E34] shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 2a4 4 0 0 1 4 4v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11v6M10 13h4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50 transition-colors" title="Card Options">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
              </svg>
            </button>
          </div>

          <!-- Middle: Label & Big Stat -->
          <div class="mt-5 z-10">
            <p class="text-sm font-medium text-[#7C7267]">Sales</p>
            <p class="text-4xl font-extrabold text-[#2A1F1D] tracking-tight mt-1">₹42,850</p>
            <div class="flex items-center text-xs font-bold text-[#10B981] mt-2">
              <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M7 17l10-10M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>+8.4%</span>
            </div>
          </div>

          <!-- Bottom: Smooth Wave Sparkline Curve (Exact reference match) -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mint-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#34A853" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#34A853" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,60 Q 30,52 65,56 T 130,42 T 180,32 T 230,22 T 260,14 L 260,70 L 0,70 Z" fill="url(#mint-wave)"/>
              <path d="M 0,60 Q 30,52 65,56 T 130,42 T 180,32 T 230,22 T 260,14" fill="none" stroke="#34A853" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

        <!-- CARD 3: Orders -->
        <article class="relative bg-white rounded-3xl p-6 sm:p-7 border border-[#EFEBF8] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.04)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#F0EBF8] flex items-center justify-center text-[#734BB5] shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50 transition-colors" title="Card Options">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
              </svg>
            </button>
          </div>

          <!-- Middle: Label & Big Stat -->
          <div class="mt-5 z-10">
            <p class="text-sm font-medium text-[#7C7267]">Orders</p>
            <p class="text-4xl font-extrabold text-[#2A1F1D] tracking-tight mt-1">126</p>
            <div class="flex items-center text-xs font-bold text-[#10B981] mt-2">
              <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M7 17l10-10M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>+9.2%</span>
            </div>
          </div>

          <!-- Bottom: Smooth Wave Sparkline Curve (Exact reference match) -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lav-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#845EC2" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#845EC2" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,62 Q 35,58 70,50 T 140,46 T 190,30 T 240,24 T 260,16 L 260,70 L 0,70 Z" fill="url(#lav-wave)"/>
              <path d="M 0,62 Q 35,58 70,50 T 140,46 T 190,30 T 240,24 T 260,16" fill="none" stroke="#845EC2" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

        <!-- CARD 4: Profit -->
        <article class="relative bg-white rounded-3xl p-6 sm:p-7 border border-[#EAF3EC] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.04)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#1E7E34] shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <ellipse cx="12" cy="7" rx="7" ry="3"/>
                <path d="M5 7v4c0 1.66 3.13 3 7 3s7-1.34 7-3V7M5 11v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4M5 15v4c0 1.66 3.13 3 7 3s7-1.34 7-3v-4"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50 transition-colors" title="Card Options">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
              </svg>
            </button>
          </div>

          <!-- Middle: Label & Big Stat -->
          <div class="mt-5 z-10">
            <p class="text-sm font-medium text-[#7C7267]">Profit</p>
            <p class="text-4xl font-extrabold text-[#2A1F1D] tracking-tight mt-1">₹14,620</p>
            <p class="text-xs font-semibold text-[#6E7B72] mt-2">34.1% margin</p>
          </div>

          <!-- Bottom: Smooth Wave Sparkline Curve (Exact reference match) -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="profit-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2E7D32" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#2E7D32" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,65 Q 30,60 65,58 T 135,46 T 180,40 T 235,26 T 260,18 L 260,70 L 0,70 Z" fill="url(#profit-wave)"/>
              <path d="M 0,65 Q 30,60 65,58 T 135,46 T 180,40 T 235,26 T 260,18" fill="none" stroke="#2E7D32" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

        <!-- CARD 5: Cost -->
        <article class="relative bg-white rounded-3xl p-6 sm:p-7 border border-[#F8ECE8] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.04)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#FCEBE6] flex items-center justify-center text-[#D84A38] shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50 transition-colors" title="Card Options">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
              </svg>
            </button>
          </div>

          <!-- Middle: Label & Big Stat -->
          <div class="mt-5 z-10">
            <p class="text-sm font-medium text-[#7C7267]">Cost</p>
            <p class="text-4xl font-extrabold text-[#2A1F1D] tracking-tight mt-1">₹28,230</p>
            <p class="text-xs font-semibold text-[#8C7E72] mt-2">65.9%</p>
          </div>

          <!-- Bottom: Smooth Wave Sparkline Curve (Exact reference match) -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cost-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#E06D53" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#E06D53" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,64 Q 30,62 70,55 T 140,50 T 195,36 T 240,30 T 260,20 L 260,70 L 0,70 Z" fill="url(#cost-wave)"/>
              <path d="M 0,64 Q 30,62 70,55 T 140,50 T 195,36 T 240,30 T 260,20" fill="none" stroke="#E06D53" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

        <!-- CARD 6: Returning -->
        <article class="relative bg-white rounded-3xl p-6 sm:p-7 border border-[#E8F1F8] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.04)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#E8F3FA] flex items-center justify-center text-[#1976D2] shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50 transition-colors" title="Card Options">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="5" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
              </svg>
            </button>
          </div>

          <!-- Middle: Label & Big Stat -->
          <div class="mt-5 z-10">
            <p class="text-sm font-medium text-[#7C7267]">Returning</p>
            <p class="text-4xl font-extrabold text-[#2A1F1D] tracking-tight mt-1">76 <span class="text-lg font-normal text-[#7C7267]">customers</span></p>
            <div class="flex items-center text-xs font-bold text-[#10B981] mt-2">
              <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path d="M7 17l10-10M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>41.3%</span>
            </div>
          </div>

          <!-- Bottom: Smooth Wave Sparkline Curve (Exact reference match) -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="blue-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2196F3" stop-opacity="0.25"/>
                  <stop offset="100%" stop-color="#2196F3" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,66 Q 30,62 65,58 T 130,52 T 180,42 T 225,30 T 260,20 L 260,70 L 0,70 Z" fill="url(#blue-wave)"/>
              <path d="M 0,66 Q 30,62 65,58 T 130,52 T 180,42 T 225,30 T 260,20" fill="none" stroke="#2196F3" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

      </section>

      <!-- Bottom Interactive Management Deck: Live Sales Trajectory & Kitchen Stock Summary -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <!-- Sales Overview Trajectory Chart (2 cols) -->
        <div class="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-[#F2ECE4] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.04)]">
          <div class="flex items-center justify-between pb-4 border-b border-[#F4EFE9]">
            <div>
              <h2 class="text-base font-bold text-[#2A1F1D]">Sales Trajectory & Hourly Counter Peak</h2>
              <p class="text-xs text-[#7C7267]">Real-time counter sales across Navrangpura Flagship</p>
            </div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#1E7E34] border border-[#CDE9D3]">
              <span class="w-2 h-2 rounded-full bg-[#34A853] animate-pulse"></span>
              Live Synced
            </span>
          </div>

          <div class="pt-6">
            <div class="h-56 w-full flex items-end justify-between gap-3 sm:gap-6 px-2">
              ${salesOverview.map((item, idx) => {
                const heightPct = Math.round((item.amount / 50000) * 100);
                const isHighlight = idx === 5;
                return `
                  <div class="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-bold text-[#2A1F1D] bg-[#FAF7F2] px-2 py-0.5 rounded shadow-xs border border-[#EFE9DF] whitespace-nowrap">
                      ₹${item.amount.toLocaleString()}
                    </div>
                    <div class="w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative ${
                      isHighlight 
                        ? 'bg-gradient-to-t from-[#C86D3B] to-[#E07A5F] shadow-sm' 
                        : 'bg-[#F2ECE4] group-hover:bg-[#E2D8CD]'
                    }" style="height: ${heightPct}%;">
                      ${isHighlight ? '<span class="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#C86D3B] ring-4 ring-white"></span>' : ''}
                    </div>
                    <span class="text-[11px] font-semibold text-[#8C7E72] mt-1">${item.day}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Quick Live Stock Alerts (1 col) -->
        <div class="bg-white rounded-3xl p-6 sm:p-7 border border-[#F2ECE4] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.04)] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-[#F4EFE9]">
              <h2 class="text-base font-bold text-[#2A1F1D]">Shelf Stock Health</h2>
              <button data-tab="products" class="text-xs font-bold text-[#C86D3B] hover:underline">Manage All</button>
            </div>
            <div class="space-y-3.5 mt-4">
              ${sweets.slice(0, 4).map(item => `
                <div class="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF7F2] transition-colors">
                  <div class="flex items-center space-x-3">
                    <div class="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EFE9DF] flex items-center justify-center font-bold text-xs text-[#6B5749]">
                      ${item.code || item.name.substring(0, 2)}
                    </div>
                    <div>
                      <p class="font-bold text-xs text-[#2A1F1D]">${item.name}</p>
                      <p class="text-[10px] text-[#8C7E72]">₹${item.pricePerKg}/${item.unit}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs font-black text-[#2A1F1D]">${item.stock} ${item.unit}</span>
                    <p class="text-[10px] font-bold ${item.stockStatus === 'Low Stock' ? 'text-[#D84A38]' : 'text-[#1E7E34]'}">${item.stockStatus}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <button data-tab="pos" class="w-full mt-4 py-3 bg-[#3D271D] hover:bg-[#2A1F1D] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2">
            <span>⚡ Open POS Counter Billing</span>
          </button>
        </div>
      </section>
    </div>
  `;
}
