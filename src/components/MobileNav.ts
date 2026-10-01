// Mobile Navigation Components: Curved Floating Bottom Dock & Slide-Out Drawer

export function renderMobileBottomNav(currentTab) {
  const isPos = currentTab === 'pos';

  return `
    <!-- Floating Curved Mobile Island Navbar (iOS / Super-App Style) -->
    <nav class="fixed bottom-3 inset-x-3 sm:inset-x-6 max-w-md mx-auto z-40 select-none pointer-events-auto md:hidden" data-purpose="mobile-curved-navbar">
      <div class="relative bg-white/95 backdrop-blur-2xl border border-[#F0ECE4] shadow-[0_16px_36px_rgba(42,31,29,0.18)] rounded-[32px] px-2 py-1.5 flex items-center justify-between">
        
        <!-- Tab 1: Home / Dashboard -->
        <button 
          data-tab="dashboard" 
          class="flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'dashboard' 
              ? 'text-[#C86D3B] font-bold' 
              : 'text-stone-400 hover:text-stone-700 font-medium'
          }"
          aria-label="Dashboard"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            currentTab === 'dashboard' ? 'bg-orange-50 text-[#C86D3B] scale-105' : ''
          }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight mt-0.5">Home</span>
          ${currentTab === 'dashboard' ? '<span class="w-1.5 h-1.5 rounded-full bg-[#C86D3B] mt-0.5"></span>' : '<span class="w-1.5 h-1.5 opacity-0 mt-0.5"></span>'}
        </button>

        <!-- Tab 2: Orders -->
        <button 
          data-tab="orders" 
          class="flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'orders' 
              ? 'text-[#C86D3B] font-bold' 
              : 'text-stone-400 hover:text-stone-700 font-medium'
          }"
          aria-label="Orders"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            currentTab === 'orders' ? 'bg-orange-50 text-[#C86D3B] scale-105' : ''
          }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight mt-0.5">Orders</span>
          ${currentTab === 'orders' ? '<span class="w-1.5 h-1.5 rounded-full bg-[#C86D3B] mt-0.5"></span>' : '<span class="w-1.5 h-1.5 opacity-0 mt-0.5"></span>'}
        </button>

        <!-- Tab 3 (CENTER): HERO ROUND FLOATING POS BUTTON -->
        <div class="relative -mt-7 sm:-mt-8 flex flex-col items-center shrink-0 px-1">
          <button 
            data-tab="pos" 
            class="w-14 h-14 rounded-full bg-gradient-to-tr from-[#B25D2E] via-[#C86D3B] to-[#E07A5F] text-white shadow-[0_10px_25px_rgba(200,109,59,0.5)] border-[3.5px] border-[#FAF7F2] ring-4 ring-orange-200/50 flex items-center justify-center transform active:scale-90 hover:scale-105 transition-all duration-200 cursor-pointer pulse-glow ${
              isPos ? 'scale-105 ring-orange-400/60' : ''
            }"
            aria-label="Express Sell POS"
          >
            <svg class="w-6 h-6 text-white drop-shadow-xs" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <span class="text-[10px] font-black text-[#C86D3B] tracking-tight mt-0.5">Sell POS</span>
        </div>

        <!-- Tab 4: Customers -->
        <button 
          data-tab="customers" 
          class="flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'customers' 
              ? 'text-[#C86D3B] font-bold' 
              : 'text-stone-400 hover:text-stone-700 font-medium'
          }"
          aria-label="Customers"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            currentTab === 'customers' ? 'bg-orange-50 text-[#C86D3B] scale-105' : ''
          }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight mt-0.5">Khata</span>
          ${currentTab === 'customers' ? '<span class="w-1.5 h-1.5 rounded-full bg-[#C86D3B] mt-0.5"></span>' : '<span class="w-1.5 h-1.5 opacity-0 mt-0.5"></span>'}
        </button>

        <!-- Tab 5: Sweets / Products -->
        <button 
          data-tab="products" 
          class="flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
            currentTab === 'products' 
              ? 'text-[#C86D3B] font-bold' 
              : 'text-stone-400 hover:text-stone-700 font-medium'
          }"
          aria-label="Sweets Menu"
        >
          <div class="w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            currentTab === 'products' ? 'bg-orange-50 text-[#C86D3B] scale-105' : ''
          }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight mt-0.5">Sweets</span>
          ${currentTab === 'products' ? '<span class="w-1.5 h-1.5 rounded-full bg-[#C86D3B] mt-0.5"></span>' : '<span class="w-1.5 h-1.5 opacity-0 mt-0.5"></span>'}
        </button>

      </div>
    </nav>
  `;
}

// Full Mobile Slide-Out Drawer Component
export function renderMobileDrawer(state) {
  const { activeTab, branches = [], currentBranchId = 'br-1' } = state;
  const currentBranch = branches.find(b => b.id === currentBranchId) || branches[0];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'pos', label: 'Sell / POS', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'customers', label: 'Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'expenses', label: 'Expenses', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z' },
    { id: 'staff', label: 'Staff & Payroll', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'analytics', label: 'Reports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  return `
    <div id="mobile-drawer-backdrop" class="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex md:hidden animate-fadeIn">
      <div class="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-slideInLeft">
        <div>
          <!-- Header with Close Button -->
          <div class="flex items-center justify-between pb-4 border-b border-stone-200">
            <div class="flex items-center space-x-2.5">
              <div class="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
                <svg class="w-5 h-5 fill-amber-700" viewBox="0 0 24 24">
                  <path d="M12 3.25c-.4 1.25-1.5 3.5-3.5 5 2 0 3.5 1.5 3.5 3.75 0-2.25 1.5-3.75 3.5-3.75-2-1.5-3.1-3.75-3.5-5zm-5 6.25c-.3 1-.9 2.4-2.2 3.4 1.5 0 2.6.9 2.7 2.4.2-1.5 1.1-2.5 2.5-2.6-1.5-.7-2.4-2.1-3-3.2zm10 0c-.6 1.1-1.5 2.5-3 3.2 1.4.1 2.3 1.1 2.5 2.6.1-1.5 1.2-2.4 2.7-2.4-1.3-1-1.9-2.4-2.2-3.4zM4 18c2.5 0 5-.8 8-3.2 3 2.4 5.5 3.2 8 3.2-.5 2-3.5 3-8 3s-7.5-1-8-3z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-base text-[var(--text-main)] tracking-tight">Radhe Sweets</h3>
                <p class="text-[9px] font-bold text-[var(--brand-primary)] tracking-widest -mt-0.5">SWEETS & MORE</p>
              </div>
            </div>
            <button id="close-mobile-drawer-btn" class="p-2 text-stone-400 hover:text-stone-700 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
          </div>

          <!-- Active Branch Banner -->
          <div class="my-4 p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <p class="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Active Branch</p>
              <p class="text-xs font-bold text-stone-800 flex items-center gap-1.5 mt-0.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                ${currentBranch?.name || 'Navrangpura Flagship'}
              </p>
            </div>
            <button data-tab="settings" class="text-[10px] text-[var(--brand-primary)] font-bold hover:underline">
              Change →
            </button>
          </div>

          <!-- Mobile Drawer Search Button -->
          <button 
            id="drawer-search-trigger-btn"
            type="button"
            class="w-full mb-3 px-3.5 py-2.5 bg-orange-50/80 hover:bg-orange-100 border border-orange-200/80 rounded-xl text-left text-xs font-bold text-[#C86D3B] flex items-center justify-between cursor-pointer transition-all active:scale-98 shadow-2xs"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#C86D3B]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span>Search Anything...</span>
            </span>
            <span class="text-[10px] bg-white border border-orange-200/80 text-[#C86D3B] px-1.5 py-0.5 rounded shadow-2xs font-bold">Spotlight</span>
          </button>

          <!-- Navigation Links -->
          <nav class="space-y-1">
            ${navItems.map(item => {
              const isActive = activeTab === item.id;
              return `
                <a 
                  href="#" 
                  data-tab="${item.id}"
                  class="flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-amber-50 text-[var(--brand-primary)] font-bold' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }"
                >
                  <svg class="w-4 h-4 ${isActive ? 'text-[var(--brand-primary)]' : 'text-stone-400'}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="${item.icon}" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                  <span>${item.label}</span>
                </a>
              `;
            }).join('')}
          </nav>
        </div>

        <!-- Brand Artwork at Bottom of Drawer (1:1 with Stitch screen.png) -->
        <div class="pt-4 border-t border-stone-200 mt-auto">
          <div class="relative overflow-hidden rounded-2xl p-1 flex flex-col items-center">
            <img 
              src="/image.png" 
              alt="Sweet moments... Better together" 
              class="w-full max-w-[200px] h-auto object-contain select-none pointer-events-none drop-shadow-sm" 
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  `;
}
