// Dashboard View Component - 100% Exact 1:1 Match with Reference Design (Image 1)
// Features: 3x2 Grid of 6 Spacious KPI Cards with Custom Badges, Three-Dot Menus, Wave Sparklines & Tinted Pastel Backgrounds

export function renderDashboardView(state) {
  const { kpis } = state;

  return `
    <div class="space-y-8 animate-fadeIn max-w-6xl mx-auto w-full">
      <!-- Dashboard Title & Greeting (Exact 1:1 with reference image) -->
      <div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-[#2A1F1D] tracking-tight">Dashboard</h1>
        <p class="text-sm sm:text-base text-[#7C7267] mt-1.5 font-normal">Here's what's happening with your sweet shop today.</p>
      </div>

      <!-- 6 KPI Stat Cards in exact 3x2 Grid (1:1 with Reference Design) -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7" data-purpose="reference-kpi-grid">
        
        <!-- CARD 1: Customers (Peach/Tan Tint) -->
        <article class="relative bg-[#FAF4ED] rounded-[28px] p-6 sm:p-7 border border-[#F2E8DC] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.03)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#FCECE0] flex items-center justify-center text-[#8C522B] shadow-2xs">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50/50 transition-colors" title="Options">
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

          <!-- Bottom: Smooth Wave Sparkline Curve -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="peach-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#E28B57" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="#E28B57" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,55 Q 35,62 70,52 T 140,50 T 190,36 T 235,32 T 260,18 L 260,70 L 0,70 Z" fill="url(#peach-wave)"/>
              <path d="M 0,55 Q 35,62 70,52 T 140,50 T 190,36 T 235,32 T 260,18" fill="none" stroke="#E28B57" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

        <!-- CARD 2: Sales (Mint/Sage Tint) -->
        <article class="relative bg-[#F2F9F4] rounded-[28px] p-6 sm:p-7 border border-[#E2EFE5] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.03)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#E2F4E7] flex items-center justify-center text-[#1E7E34] shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 2a4 4 0 0 1 4 4v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11v6M10 13h4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50/50 transition-colors" title="Options">
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

          <!-- Bottom: Smooth Wave Sparkline Curve -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mint-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#34A853" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="#34A853" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,60 Q 35,52 70,56 T 135,44 T 185,34 T 230,22 T 260,14 L 260,70 L 0,70 Z" fill="url(#mint-wave)"/>
              <path d="M 0,60 Q 35,52 70,56 T 135,44 T 185,34 T 230,22 T 260,14" fill="none" stroke="#34A853" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

        <!-- CARD 3: Orders (Lavender Tint) -->
        <article class="relative bg-[#F8F4FD] rounded-[28px] p-6 sm:p-7 border border-[#EFE7FA] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.03)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#EFE7FA] flex items-center justify-center text-[#734BB5] shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50/50 transition-colors" title="Options">
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

          <!-- Bottom: Smooth Wave Sparkline Curve -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="purple-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#805AD5" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="#805AD5" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,62 Q 35,62 70,58 T 135,52 T 185,42 T 230,28 T 260,16 L 260,70 L 0,70 Z" fill="url(#purple-wave)"/>
              <path d="M 0,62 Q 35,62 70,58 T 135,52 T 185,42 T 230,28 T 260,16" fill="none" stroke="#805AD5" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

        <!-- CARD 4: Profit (Mint/Sage Tint) -->
        <article class="relative bg-[#F2F9F4] rounded-[28px] p-6 sm:p-7 border border-[#E2EFE5] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.03)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#E2F4E7] flex items-center justify-center text-[#1E7E34] shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 8c-3.866 0-7-1.343-7-3s3.134-3 7-3 7 1.343 7 3-3.134 3-7 3z"/>
                <path d="M5 5v6c0 1.657 3.134 3 7 3s7-1.343 7-3V5"/>
                <path d="M5 11v6c0 1.657 3.134 3 7 3s7-1.343 7-3v-6"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50/50 transition-colors" title="Options">
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
            <p class="text-xs font-semibold text-[#8C7E72] mt-2.5">34.1% margin</p>
          </div>

          <!-- Bottom: Smooth Wave Sparkline Curve -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="profit-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#34A853" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="#34A853" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,64 Q 35,60 70,56 T 135,46 T 185,36 T 230,24 T 260,16 L 260,70 L 0,70 Z" fill="url(#profit-wave)"/>
              <path d="M 0,64 Q 35,60 70,56 T 135,46 T 185,36 T 230,24 T 260,16" fill="none" stroke="#34A853" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

        <!-- CARD 5: Cost (Rose/Coral Tint) -->
        <article class="relative bg-[#FFF2F2] rounded-[28px] p-6 sm:p-7 border border-[#FCE2E2] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.03)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#FCE5E5] flex items-center justify-center text-[#D94F3D] shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50/50 transition-colors" title="Options">
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
            <p class="text-xs font-semibold text-[#8C7E72] mt-2.5">65.9%</p>
          </div>

          <!-- Bottom: Smooth Wave Sparkline Curve -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cost-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#E05A47" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="#E05A47" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,66 Q 35,64 70,58 T 140,52 T 195,38 T 235,32 T 260,20 L 260,70 L 0,70 Z" fill="url(#cost-wave)"/>
              <path d="M 0,66 Q 35,64 70,58 T 140,52 T 195,38 T 235,32 T 260,20" fill="none" stroke="#E05A47" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

        <!-- CARD 6: Returning (Sky Blue Tint) -->
        <article class="relative bg-[#F0F7FD] rounded-[28px] p-6 sm:p-7 border border-[#DFEDF8] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.03)] hover:shadow-[0_8px_30px_-5px_rgba(74,58,47,0.08)] transition-all flex flex-col justify-between overflow-hidden group">
          <!-- Top Row: Icon Badge & 3-Dot Action -->
          <div class="flex items-center justify-between z-10">
            <div class="w-12 h-12 rounded-full bg-[#E0EFFC] flex items-center justify-center text-[#1976D2] shadow-2xs">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <button class="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50/50 transition-colors" title="Options">
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

          <!-- Bottom: Smooth Wave Sparkline Curve -->
          <div class="mt-4 pt-2 w-full h-16 relative">
            <svg class="w-full h-full overflow-visible" viewBox="0 0 260 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="blue-wave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2196F3" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="#2196F3" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 0,68 Q 35,66 70,62 T 135,54 T 185,42 T 230,30 T 260,20 L 260,70 L 0,70 Z" fill="url(#blue-wave)"/>
              <path d="M 0,68 Q 35,66 70,62 T 135,54 T 185,42 T 230,30 T 260,20" fill="none" stroke="#2196F3" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
        </article>

      </section>
    </div>
  `;
}
