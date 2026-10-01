// Top Navigation Bar Component - Clean, Elegant, Fully Responsive & Operational
// Designed for seamless touch on mobile smartphones (360px+) and executive widescreen displays

export function renderTopBar(state: any) {
  const { searchQuery = '', unreadNotifications = 1, currentBranchId = 'br-1', branches = [] } = state;
  const currentBranch = branches.find((b: any) => b.id === currentBranchId) || branches[0] || { name: 'Navrangpura Flagship' };

  return `
    <header class="h-16 sm:h-[72px] bg-white/95 backdrop-blur-xl border-b border-[#F0ECE4] px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 select-none shadow-xs" data-purpose="top-bar">
      
      <!-- Left: Mobile Menu Toggle & Brand Logo -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <!-- Mobile Hamburger Button (Touch Target 44px) -->
        <button 
          id="mobile-menu-toggle" 
          type="button"
          class="md:hidden w-11 h-11 flex items-center justify-center text-[#2A1F1D] hover:bg-stone-100 active:bg-orange-50 active:scale-95 rounded-2xl transition-all cursor-pointer border border-stone-200/60 shadow-2xs"
          aria-label="Open Navigation Menu"
          title="Open Menu"
        >
          <svg class="w-5 h-5 stroke-[2.2] text-[#2A1F1D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>

        <!-- Brand Identity -->
        <div class="flex items-center gap-2 cursor-pointer" data-tab="dashboard" title="Go to Dashboard">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-[#C86D3B] text-white flex items-center justify-center shadow-xs hover:scale-105 transition-transform shrink-0">
            <span class="text-base">🪔</span>
          </div>
          <div class="leading-tight">
            <div class="flex items-center gap-1.5">
              <span class="font-black text-sm sm:text-base tracking-tight text-[#2A1F1D]">Radhe Sweets</span>
              <span class="hidden sm:inline px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-100 text-[#C86D3B]">Ahmedabad</span>
            </div>
            <p class="text-[9px] font-bold text-[#C86D3B] tracking-wider truncate max-w-[140px] sm:max-w-none">
              ${currentBranch.name}
            </p>
          </div>
        </div>
      </div>

      <!-- Center: Desktop Search Bar (Input with Instant Dropdown + Ctrl+K) -->
      <div class="hidden md:flex flex-1 max-w-md mx-4 relative items-center" id="topbar-search-container">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <svg class="w-4 h-4 text-[#C86D3B]" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </span>
        <input 
          id="global-search-input"
          type="text" 
          value="${state.searchModalQuery || ''}"
          placeholder="Search sweets, patrons, orders... (Ctrl+K)" 
          autocomplete="off"
          class="w-full pl-10 pr-20 py-2 bg-stone-50/90 hover:bg-white focus:bg-white border border-[#F0ECE4] focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
          style="padding-left: 2.75rem !important;"
        />
        <div class="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
          <button 
            id="topbar-clear-search-btn" 
            type="button"
            class="text-stone-400 hover:text-stone-600 p-1 text-xs cursor-pointer ${state.searchModalQuery ? '' : 'hidden'}"
            title="Clear search"
          >
            ✕
          </button>
          <kbd class="hidden lg:inline-block text-[10px] font-mono font-bold text-stone-400 bg-white border border-stone-200/90 rounded px-1.5 py-0.5 shadow-2xs">⌘K</kbd>
        </div>

        <!-- Floating Instant Search Results Dropdown -->
        <div 
          id="topbar-search-dropdown" 
          class="hidden absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl border border-stone-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-dropdown"
        >
          <div id="topbar-dropdown-content" class="max-h-96 overflow-y-auto p-2 space-y-1"></div>
        </div>
      </div>

      <!-- Right: Quick Branch, Mobile Search, Notifications & Actions -->
      <div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
        
        <!-- Mobile Search Trigger Icon (Compact) -->
        <button 
          id="mobile-search-btn"
          type="button"
          class="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-stone-600 hover:text-[#C86D3B] hover:bg-orange-50 active:scale-95 transition-all cursor-pointer border border-stone-200/60"
          aria-label="Open Search"
          title="Search Sweets, Customers, Orders"
        >
          <svg class="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>

        <!-- Live Status Pill (Desktop) -->
        <div class="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-extrabold shadow-2xs">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live POS</span>
        </div>

        <!-- Branch Selector Pill -->
        <div class="flex items-center">
          <div class="relative flex items-center bg-amber-50/90 hover:bg-amber-100/80 border border-amber-200/90 rounded-full pl-2.5 sm:pl-3 pr-2 py-1 shadow-2xs transition-all">
            <span class="text-xs mr-1 select-none">📍</span>
            <select 
              id="topbar-branch-select"
              class="bg-transparent text-xs font-bold text-[#C86D3B] cursor-pointer border-0 outline-none pr-5 py-0 appearance-none max-w-[90px] sm:max-w-none truncate"
              title="Switch Active Store Branch"
            >
              ${branches.map((b: any) => `
                <option value="${b.id}" ${b.id === currentBranchId ? 'selected' : ''} class="text-[#2A1F1D] bg-white font-semibold">
                  ${b.name}
                </option>
              `).join('')}
            </select>
            <span class="pointer-events-none -ml-4 flex items-center text-[#C86D3B]">
              <svg class="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        <!-- Notifications Bell -->
        <button 
          id="notifications-bell-btn"
          type="button"
          class="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer active:scale-95" 
          title="Notifications"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          ${unreadNotifications > 0 ? `
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
          ` : ''}
        </button>

        <!-- Admin Profile Avatar (Navigates to Settings) -->
        <div class="flex items-center space-x-2 pl-1 sm:pl-2 border-l border-[#F0ECE4] cursor-pointer group shrink-0" id="user-profile-menu-btn" data-tab="settings" title="Settings & Profile">
          <div class="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
            AS
          </div>
        </div>

      </div>

    </header>
  `;
}
