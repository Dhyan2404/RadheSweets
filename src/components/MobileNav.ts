// Mobile Navigation Components: Curved Floating Bottom Dock & Slide-Out Navigation Drawer
// Designed specifically for Sweet Shop Management ERP & High-Speed Counter POS on Mobile Smartphones
// Supports Role-Based Access Control (RBAC) & Logout

export function renderMobileBottomNav(currentTab: string, state?: any) {
  const isPos = currentTab === 'pos';
  const posCart = state?.posCart || [];
  const posCartCount = posCart.reduce((sum: number, it: any) => sum + (it.qty || 1), 0);

  return `
    <!-- Sleek Compact Mobile Island Navbar for Radhe Sweets Management ERP -->
    <nav class="fixed bottom-3 inset-x-3 sm:inset-x-6 max-w-sm sm:max-w-md mx-auto z-40 select-none pointer-events-auto md:hidden" data-purpose="mobile-management-navbar">
      <div class="relative bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-[0_8px_30px_rgba(42,31,29,0.16)] rounded-2xl px-2 py-1.5 flex items-center justify-between">
        
        <!-- Tab 1: Dashboard / Home -->
        <button 
          type="button"
          data-tab="dashboard" 
          class="flex-1 flex flex-col items-center justify-center py-0.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
            currentTab === 'dashboard' 
              ? 'text-[#C86D3B] font-black' 
              : 'text-stone-600 hover:text-stone-900 font-bold'
          }"
          aria-label="Dashboard"
        >
          <div class="w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
            currentTab === 'dashboard' ? 'bg-orange-50 text-[#C86D3B]' : 'text-stone-600'
          }">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight mt-0.5 font-bold">Home</span>
          ${currentTab === 'dashboard' ? '<span class="w-1.5 h-1.5 rounded-full bg-[#C86D3B] mt-0.5"></span>' : '<span class="w-1.5 h-1.5 opacity-0 mt-0.5"></span>'}
        </button>

        <!-- Tab 2: Orders & Invoices -->
        <button 
          type="button"
          data-tab="orders" 
          class="flex-1 flex flex-col items-center justify-center py-0.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
            currentTab === 'orders' 
              ? 'text-[#C86D3B] font-black' 
              : 'text-stone-600 hover:text-stone-900 font-bold'
          }"
          aria-label="Orders"
        >
          <div class="w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
            currentTab === 'orders' ? 'bg-orange-50 text-[#C86D3B]' : 'text-stone-600'
          }">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight mt-0.5 font-bold">Orders</span>
          ${currentTab === 'orders' ? '<span class="w-1.5 h-1.5 rounded-full bg-[#C86D3B] mt-0.5"></span>' : '<span class="w-1.5 h-1.5 opacity-0 mt-0.5"></span>'}
        </button>

        <!-- Tab 3 (CENTER): SLEEK HERO FLOATING POS BUTTON -->
        <div class="relative -mt-5 flex flex-col items-center shrink-0 px-1">
          <button 
            type="button"
            data-tab="pos" 
            class="w-12 h-12 rounded-full bg-gradient-to-tr from-[#B25D2E] via-[#C86D3B] to-[#E07A5F] text-white shadow-[0_6px_18px_rgba(200,109,59,0.45)] border-2 border-white ring-2 ring-orange-200/60 flex items-center justify-center transform active:scale-90 hover:scale-105 transition-all duration-200 cursor-pointer relative ${
              isPos ? 'scale-105 ring-orange-400 shadow-[0_8px_20px_rgba(200,109,59,0.6)]' : ''
            }"
            aria-label="Express Sell POS"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.3" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            ${posCartCount > 0 ? `
              <span class="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-black text-[9px] shadow-xs">
                ${posCartCount}
              </span>
            ` : ''}
          </button>
          <span class="text-[10px] font-black text-[#2A1F1D] tracking-tight mt-0.5">Sell POS</span>
        </div>

        <!-- Tab 4: Customers & Loyalty -->
        <button 
          type="button"
          data-tab="customers" 
          class="flex-1 flex flex-col items-center justify-center py-0.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
            currentTab === 'customers' 
              ? 'text-[#C86D3B] font-black' 
              : 'text-stone-600 hover:text-stone-900 font-bold'
          }"
          aria-label="Customers & Loyalty"
        >
          <div class="w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
            currentTab === 'customers' ? 'bg-orange-50 text-[#C86D3B]' : 'text-stone-600'
          }">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight mt-0.5 font-bold">Customers</span>
          ${currentTab === 'customers' ? '<span class="w-1.5 h-1.5 rounded-full bg-[#C86D3B] mt-0.5"></span>' : '<span class="w-1.5 h-1.5 opacity-0 mt-0.5"></span>'}
        </button>

        <!-- Tab 5: All Modules / Slide-out Menu Trigger -->
        <button 
          type="button"
          id="mobile-bottom-menu-btn"
          class="flex-1 flex flex-col items-center justify-center py-0.5 rounded-xl transition-all cursor-pointer text-stone-600 hover:text-stone-900 font-bold active:scale-95"
          aria-label="All Modules Menu"
        >
          <div class="w-7 h-7 rounded-xl flex items-center justify-center transition-all text-stone-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h7" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
          <span class="text-[10px] tracking-tight mt-0.5 font-bold">Menu</span>
          <span class="w-1.5 h-1.5 opacity-0 mt-0.5"></span>
        </button>

      </div>
    </nav>
  `;
}

// Full Mobile Slide-Out Drawer Component
export function renderMobileDrawer(state: any) {
  const { activeTab } = state;
  const currentUser = state?.currentUser || { name: 'Owner', role: 'owner' };
  const userRole = currentUser.role || 'owner';
  const allowedPages = currentUser.allowedPages || [];

  const baseNavItems = [
    { id: 'pos', label: 'Sell / Counter POS', desc: 'Quick Billing, Weight Chips & UPI', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'dashboard', label: 'Shop Dashboard', desc: 'Live Sales, Rush Hours & Kitchen', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'orders', label: 'Live Orders & Invoices', desc: 'Delivery Dispatch & Advance Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'customers', label: 'Customers & Loyalty', desc: 'Patron Loyalty & Directory', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'products', label: '100 Sweets & Stock', desc: 'Inventory Levels & Batch Restock', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'staff', label: 'Staff & Halwais', desc: 'Attendance, Advances & Shifts', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'expenses', label: 'Store Expenses', desc: 'Dairy, Sugar & Daily Petty Cash', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z' },
    { id: 'analytics', label: 'Reports & Margins', desc: 'Gross Profit, Valuation & Shifts', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
  ];

  const navItems = [...baseNavItems];

  if (userRole === 'owner') {
    navItems.push({
      id: 'settings', 
      label: 'Settings & Multi-Branch', 
      desc: 'Branch Locations, Store UPI & Profile', 
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
    });
    navItems.push({
      id: 'owner-manage',
      label: 'Owner Manage',
      desc: 'Users, Roles & Branch Permissions',
      icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    });
  } else if (userRole === 'branch_admin') {
    navItems.push({
      id: 'branch-admin',
      label: 'Branch Admin',
      desc: 'Staff & Cashier Permissions',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    });
  }

  // Filter drawer items based on user's permitted allowedPages
  const visibleNavItems = (allowedPages && allowedPages.length > 0)
    ? navItems.filter(item => allowedPages.includes(item.id))
    : navItems;

  const activeBranchId = state?.currentBranchId || 'br-1';
  const branchObj = (state?.branches || []).find((b: any) => b.id === activeBranchId);
  const branchName = branchObj ? branchObj.name : 'Main Store';

  return `
    <div id="mobile-drawer-backdrop" class="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex md:hidden animate-fadeIn select-none">
      <div class="w-5/6 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-slideInLeft border-r border-stone-200">
        <div>
          <!-- Header with Close Button -->
          <div class="flex items-center justify-between pb-4 border-b border-stone-200">
            <div class="flex items-center space-x-2.5">
              <div class="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-[#C86D3B] shadow-xs shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
                  <path d="M12 3c1.5 3.5 4 6 8 7-2 4-5 6-8 11-3-5-6-7-8-11 4-1 6.5-3.5 8-7Z"></path>
                  <path d="M12 10c0 4 2 7 5 9"></path>
                  <path d="M12 10c0 4-2 7-5 9"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-extrabold text-base text-[#2A1F1D] tracking-tight">Radhe Sweets</h3>
                <p class="text-[9px] font-black text-[#C86D3B] tracking-widest uppercase">Sweets &amp; More • Est. 1984</p>
              </div>
            </div>
            <button 
              id="close-mobile-drawer-btn" 
              type="button"
              class="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center font-bold text-sm cursor-pointer transition-all active:scale-95"
              aria-label="Close Menu"
            >
              ✕
            </button>
          </div>

          <!-- Active Branch Selector -->
          ${userRole === 'owner' ? `
            <div class="my-2 px-1 flex items-center gap-2 text-xs text-stone-600 font-medium">
              <span class="text-[#C86D3B] text-sm shrink-0">📍</span>
              <select 
                id="drawer-branch-select"
                class="bg-transparent border-0 font-bold text-stone-800 text-xs focus:outline-none cursor-pointer hover:text-[#C86D3B] truncate flex-1 py-1"
                title="Select Active Branch"
              >
                ${(state?.branches || []).map((b: any) => `
                  <option value="${b.id}" ${b.id === activeBranchId ? 'selected' : ''}>
                    ${b.name} (${b.city || 'Gandhinagar'})
                  </option>
                `).join('')}
              </select>
            </div>
          ` : `
            <div class="my-2 px-1 flex items-center justify-between gap-2 text-xs font-bold text-stone-800 py-1">
              <div class="flex items-center gap-1.5 truncate">
                <span class="text-[#C86D3B] text-sm shrink-0">📍</span>
                <span class="truncate">${branchName}</span>
              </div>
              <span class="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-1.5 py-0.5 rounded-md shrink-0 uppercase tracking-wider">
                Assigned
              </span>
            </div>
          `}

          <!-- Spotlight Search Trigger Button -->
          <button 
            id="drawer-search-trigger-btn"
            type="button"
            class="w-full mb-3 px-3.5 py-3 bg-orange-50/80 hover:bg-orange-100 border border-orange-200/80 rounded-2xl text-left text-xs font-bold text-[#C86D3B] flex items-center justify-between cursor-pointer transition-all active:scale-98 shadow-2xs"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#C86D3B]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span>Search Sweets &amp; Orders...</span>
            </span>
            <span class="text-[10px] bg-white border border-orange-200 text-[#C86D3B] px-1.5 py-0.5 rounded-md shadow-2xs font-extrabold">⌘K</span>
          </button>

          <!-- Navigation Links -->
          <nav class="space-y-1 pt-1">
            ${visibleNavItems.map(item => {
              const isActive = activeTab === item.id;
              return `
                <button 
                  type="button" 
                  data-tab="${item.id}"
                  class="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer active:scale-98 ${
                    isActive 
                      ? 'bg-amber-100/80 text-[#C86D3B] shadow-2xs font-black' 
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-50'
                  }"
                >
                  <div class="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-[#C86D3B] text-white' : 'bg-stone-100 text-stone-500'
                  }">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path d="${item.icon}" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <span class="block truncate">${item.label}</span>
                    <span class="block text-[10px] font-normal text-stone-400 truncate">${item.desc}</span>
                  </div>
                  ${isActive ? '<span class="w-1.5 h-1.5 rounded-full bg-[#C86D3B] shrink-0"></span>' : ''}
                </button>
              `;
            }).join('')}
          </nav>
        </div>

        <!-- User Profile, Artwork & Logout at Bottom of Drawer -->
        <div class="pt-3 border-t border-stone-200 mt-4 space-y-3">
          
          <!-- Sweet Moments Dessert Bowl Artwork -->
          <div class="px-1">
            <div class="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-white p-2 border border-amber-200/60 shadow-2xs">
              <img 
                src="/sweet_moments_dessert_bowl.png" 
                alt="Sweet Moments Dessert Bowl" 
                onerror="this.onerror=null; this.src='/Sweet Moments Dessert Bowl.png';"
                class="w-full h-auto max-h-20 object-contain mx-auto drop-shadow-sm"
                loading="lazy"
              />
            </div>
          </div>

          <div class="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center font-black text-xs text-[#C86D3B] shrink-0">
                ${currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div class="min-w-0 flex-1">
                <span class="text-xs font-bold text-stone-900 block truncate">${currentUser.name || 'User'}</span>
                <span class="text-[9px] font-mono text-stone-500 uppercase">${currentUser.role || 'Staff'}</span>
              </div>
            </div>

            <!-- Full-width mobile drawer logout button -->
            <button 
              type="button" 
              id="drawer-logout-btn" 
              data-action="app-logout"
              class="w-full py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 font-extrabold text-xs rounded-xl border border-stone-200 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-2xs"
            >
              <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>Sign Out / Logout Account</span>
            </button>
          </div>

          <div class="text-center">
            <p class="text-xs font-black text-[#C86D3B]">Jai Radhe Krishna</p>
            <p class="text-[10px] text-stone-400 font-medium">Sweet Moments... Better Together</p>
          </div>

        </div>
      </div>
    </div>
  `;
}
