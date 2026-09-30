// Mobile Navigation Components: Bottom Tab Bar & Mobile Drawer Component

export function renderMobileBottomNav(currentTab) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round"></path></svg>` },
    { id: 'pos', label: 'Sell', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` },
    { id: 'orders', label: 'Orders', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke-linecap="round" stroke-linejoin="round"></path></svg>` },
    { id: 'products', label: 'Products', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect height="7" rx="1.5" stroke-linecap="round" stroke-linejoin="round" width="7" x="3" y="3"></rect><rect height="7" rx="1.5" stroke-linecap="round" stroke-linejoin="round" width="7" x="14" y="3"></rect><rect height="7" rx="1.5" stroke-linecap="round" stroke-linejoin="round" width="7" x="14" y="14"></rect><rect height="7" rx="1.5" stroke-linecap="round" stroke-linejoin="round" width="7" x="3" y="14"></rect></svg>` },
    { id: 'settings', label: 'Settings', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` }
  ];

  return `
    <nav class="fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-[var(--border-color)] px-2 py-1.5 flex justify-around items-center z-40 shadow-lg md:hidden">
      ${tabs.map(tab => {
        const isActive = currentTab === tab.id;
        return `
          <button 
            data-tab="${tab.id}" 
            class="mobile-bottom-tab flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              isActive 
                ? 'text-[var(--brand-primary)] font-bold' 
                : 'text-stone-400 hover:text-stone-600'
            }"
          >
            <div class="${isActive ? 'scale-110 transition-transform' : ''}">
              ${tab.icon}
            </div>
            <span class="text-[10px] tracking-tight mt-1 font-semibold">${tab.label}</span>
          </button>
        `;
      }).join('')}
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
