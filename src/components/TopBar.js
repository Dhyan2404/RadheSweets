// Top Navigation Bar Component - Clean 1:1 Match with Reference Design
// Shows Active Branch (changeable only in Settings), Date, Notifications.
// No Admin Supernova. Auto-adjusts between Phone and Web.

export function renderTopBar(state) {
  const { searchQuery, branches = [], currentBranchId = 'br-1', unreadNotifications = 2 } = state;

  const currentBranch = branches.find(b => b.id === currentBranchId) || branches[0] || {
    id: 'br-1',
    name: 'Navrangpura Flagship',
    code: 'BR-NAV-01'
  };

  return `
    <header class="h-16 md:h-18 bg-white border-b border-[var(--border-color)] px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <!-- Mobile Left Brand & Hamburger (Visible on Phone < 768px) -->
      <div class="flex items-center space-x-2.5 md:hidden">
        <button 
          id="mobile-menu-toggle" 
          class="p-2 -ml-1 text-[var(--text-main)] hover:bg-[var(--bg-subtle)] active:bg-stone-200/70 rounded-xl transition-all"
          aria-label="Open Navigation Menu"
        >
          <svg class="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>

        <div class="flex items-center space-x-2 cursor-pointer" data-tab="dashboard">
          <div class="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
            <svg class="w-4 h-4 fill-amber-700" viewBox="0 0 24 24">
              <path d="M12 3.25c-.4 1.25-1.5 3.5-3.5 5 2 0 3.5 1.5 3.5 3.75 0-2.25 1.5-3.75 3.5-3.75-2-1.5-3.1-3.75-3.5-5zm-5 6.25c-.3 1-.9 2.4-2.2 3.4 1.5 0 2.6.9 2.7 2.4.2-1.5 1.1-2.5 2.5-2.6-1.5-.7-2.4-2.1-3-3.2zm10 0c-.6 1.1-1.5 2.5-3 3.2 1.4.1 2.3 1.1 2.5 2.6.1-1.5 1.2-2.4 2.7-2.4-1.3-1-1.9-2.4-2.2-3.4zM4 18c2.5 0 5-.8 8-3.2 3 2.4 5.5 3.2 8 3.2-.5 2-3.5 3-8 3s-7.5-1-8-3z"></path>
            </svg>
          </div>
          <div class="flex flex-col text-left">
            <span class="font-bold text-sm tracking-tight text-[var(--text-main)] leading-tight">Radhe Sweets</span>
            <span class="text-[8px] font-bold text-[var(--brand-primary)] tracking-widest leading-none mt-0.5">SWEETS & MORE</span>
          </div>
        </div>
      </div>

      <!-- Desktop Search Input Field (Visible on Desktop >= 768px) -->
      <div class="hidden md:flex w-full max-w-md relative items-center">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </span>
        <input 
          id="global-search-input"
          type="text" 
          value="${searchQuery || ''}"
          placeholder="Search anything..." 
          class="w-full pl-10 pr-4 py-2 bg-stone-50/80 border border-[var(--border-color)] rounded-xl text-xs sm:text-sm text-[var(--text-main)] placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-[var(--brand-primary)] transition-all"
        />
      </div>

      <!-- Right Controls: Date, Notifications Bell, Active Branch Badge -->
      <div class="flex items-center space-x-2 sm:space-x-3 pl-2">
        <!-- Current Date Indicator (Desktop large screens) -->
        <div class="hidden lg:flex items-center space-x-2 bg-stone-50 border border-[var(--border-color)] px-3 py-1.5 rounded-xl text-xs text-stone-600 select-none">
          <svg class="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect height="18" rx="2" ry="2" width="18" x="3" y="4"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
          </svg>
          <span class="font-medium text-stone-800">25 Sep 2026, <span class="text-stone-400 font-normal">Today</span></span>
        </div>

        <!-- Notifications Bell -->
        <button 
          id="notifications-bell-btn" 
          class="relative p-2 rounded-xl text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors" 
          title="Notifications"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          ${unreadNotifications > 0 ? `
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          ` : ''}
        </button>

        <!-- Active Branch Badge (Display-only; Changeable only in Settings) -->
        <div 
          class="flex items-center space-x-1.5 sm:space-x-2 bg-stone-50 hover:bg-amber-50/50 border border-[var(--border-color)] px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs text-stone-800 font-bold shadow-2xs select-none transition-colors" 
          title="Active Branch: ${currentBranch.name} • Only changeable in Settings"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-amber-700 text-xs sm:text-sm">🏢</span>
          <span class="hidden sm:inline font-bold tracking-tight text-[var(--text-main)]">${currentBranch.name}</span>
          <span class="sm:hidden font-bold tracking-tight text-[var(--text-main)] text-[11px]">${currentBranch.name.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  `;
}
