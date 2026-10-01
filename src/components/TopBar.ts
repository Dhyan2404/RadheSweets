// Top Navigation Bar Component - Clean, Elegant & Operational
// Features: Real Interactive Search Input with Live Dropdown & Ctrl+K, Date Badge, Notifications Bell, Profile

export function renderTopBar(state: any) {
  const { searchQuery = '', unreadNotifications = 1 } = state;

  return `
    <header class="h-[72px] bg-white border-b border-[#F0ECE4] px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 select-none" data-purpose="top-bar">
      
      <!-- Mobile Hamburger & Brand (Visible on mobile < 768px) -->
      <div class="flex items-center space-x-3 md:hidden">
        <button 
          id="mobile-menu-toggle" 
          class="p-2 -ml-1 text-[#2A1F1D] hover:bg-stone-100 rounded-xl transition-all active:scale-95 cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <svg class="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>

        <div class="flex items-center space-x-2 cursor-pointer" data-tab="dashboard">
          <div class="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C86D3B] shadow-2xs hover:scale-105 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
              <path d="M12 3c1.5 3.5 4 6 8 7-2 4-5 6-8 11-3-5-6-7-8-11 4-1 6.5-3.5 8-7Z"></path>
            </svg>
          </div>
          <span class="font-bold text-sm tracking-tight text-[#2A1F1D]">Radhe Sweets</span>
        </div>
      </div>

      <!-- Desktop Search Bar (Real Interactive Input with Instant Dropdown + Ctrl+K) -->
      <div class="hidden md:flex w-full max-w-md relative items-center" id="topbar-search-container">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <svg class="w-4 h-4 text-[#C86D3B]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </span>
        <input 
          id="global-search-input"
          type="text" 
          value="${state.searchModalQuery || ''}"
          placeholder="Search anything... (sweets, customers, orders)" 
          autocomplete="off"
          class="w-full pl-10 pr-20 py-2 bg-stone-50/90 hover:bg-white focus:bg-white border border-[#F0ECE4] focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
          style="padding-left: 2.75rem !important;"
        />
        <div class="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
          <button 
            id="topbar-clear-search-btn" 
            type="button" 
            class="${state.searchModalQuery ? '' : 'hidden'} p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            title="Clear search"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold text-stone-400 bg-white border border-stone-200 rounded shadow-2xs pointer-events-none">Ctrl K</kbd>
        </div>

        <!-- Floating Live Instant Search Dropdown on PC -->
        <div 
          id="topbar-search-dropdown" 
          class="hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 max-h-[68vh] overflow-y-auto p-3 animate-dropdown"
        >
          <div id="topbar-dropdown-results"></div>
        </div>
      </div>

      <!-- Right Header Controls: Mobile Search, Date, Bell, Profile (SEO removed cleanly) -->
      <div class="flex items-center space-x-2 sm:space-x-4 pl-4">
        <!-- Mobile Search Button (10000x Better Mobile Experience) -->
        <button 
          id="mobile-search-btn"
          type="button"
          class="md:hidden p-2 rounded-xl text-stone-600 hover:text-[#C86D3B] hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
          aria-label="Open Search"
          title="Search Sweets, Customers, Orders"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>

        <!-- Active Branch Selector Pill (Quick Branch Switching) -->
        <div class="flex items-center">
          <div class="relative flex items-center bg-amber-50/90 dark:bg-stone-800/90 hover:bg-amber-100/80 border border-amber-200/90 dark:border-stone-700 rounded-full pl-3 pr-2 py-1 shadow-2xs transition-all">
            <span class="text-xs mr-1.5 select-none">📍</span>
            <select 
              id="topbar-branch-select"
              class="bg-transparent text-xs font-bold text-[#C86D3B] dark:text-amber-400 cursor-pointer border-0 border-none outline-none focus:outline-none focus:ring-0 focus:border-0 shadow-none ring-0 appearance-none pr-5 py-0"
              style="border: none !important; outline: none !important; box-shadow: none !important; -webkit-appearance: none; -moz-appearance: none; background: transparent !important;"
              title="Switch Active Store Branch"
            >
              ${(state.branches || []).map((b: any) => `
                <option value="${b.id}" ${b.id === state.currentBranchId ? 'selected' : ''} class="text-[#2A1F1D] dark:text-white bg-white dark:bg-stone-800 font-semibold">
                  ${b.name}
                </option>
              `).join('')}
            </select>
            <span class="pointer-events-none -ml-4 flex items-center text-[#C86D3B] dark:text-amber-400">
              <svg class="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>



        <!-- Current Date Indicator -->
        <div class="hidden lg:flex items-center space-x-2 bg-stone-50 border border-[#F0ECE4] px-3 py-1.5 rounded-xl text-xs text-stone-600 shadow-2xs">
          <svg class="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect height="18" rx="2" ry="2" width="18" x="3" y="4"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
          </svg>
          <span class="font-medium">25 Sep 2026, <span class="text-stone-400 font-normal">Today</span></span>
        </div>

        <!-- Notifications Bell with pulse dot -->
        <button 
          id="notifications-bell-btn"
          type="button"
          class="relative p-2 rounded-xl text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer active:scale-95" 
          title="Notifications"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          ${unreadNotifications > 0 ? `
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
          ` : ''}
        </button>

        <!-- Admin Profile Tag -->
        <div class="flex items-center space-x-2 pl-2 border-l border-[#F0ECE4] cursor-pointer group" id="user-profile-menu-btn" data-tab="settings">
          <div class="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            AS
          </div>
          <div class="hidden lg:block text-left">
            <p class="text-xs font-semibold text-[#2A1F1D] leading-tight">Admin</p>
            <p class="text-[10px] text-stone-500 leading-tight">Shop Owner</p>
          </div>
          <svg class="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          </svg>
        </div>
      </div>

    </header>
  `;
}
