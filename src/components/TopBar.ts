// Top Navigation Bar Component - 100% Exact Match with Stitch Dashboard (screen.png)
// Features: Search Field, Date Badge ("25 Sep 2026, Today"), Notifications Bell with red dot, Profile with "Admin" & "Shop Owner"

export function renderTopBar(state) {
  const { searchQuery, unreadNotifications = 1 } = state;

  return `
    <header class="h-[72px] bg-white border-b border-[#F0ECE4] px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 select-none" data-purpose="top-bar">
      
      <!-- Mobile Hamburger & Brand (Visible on mobile < 768px) -->
      <div class="flex items-center space-x-3 md:hidden">
        <button 
          id="mobile-menu-toggle" 
          class="p-2 -ml-1 text-[#2A1F1D] hover:bg-stone-100 rounded-xl transition-all"
          aria-label="Open Navigation Menu"
        >
          <svg class="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>

        <div class="flex items-center space-x-2 cursor-pointer" data-tab="dashboard">
          <div class="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C86D3B] shadow-2xs">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
              <path d="M12 3c1.5 3.5 4 6 8 7-2 4-5 6-8 11-3-5-6-7-8-11 4-1 6.5-3.5 8-7Z"></path>
            </svg>
          </div>
          <span class="font-bold text-sm tracking-tight text-[#2A1F1D]">Radhe Sweets</span>
        </div>
      </div>

      <!-- Desktop Search Bar (1:1 with Stitch screen.png) -->
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
          class="w-full pl-10 pr-4 py-2 bg-stone-50/80 border border-[#F0ECE4] rounded-xl text-xs sm:text-sm text-[#2A1F1D] placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-[#C86D3B] transition-all"
        />
      </div>

      <!-- Right Header Controls: Date, Bell, Profile (1:1 with Stitch screen.png) -->
      <div class="flex items-center space-x-3 sm:space-x-4 pl-4">
        <!-- Current Date Indicator -->
        <div class="hidden sm:flex items-center space-x-2 bg-stone-50 border border-[#F0ECE4] px-3 py-1.5 rounded-xl text-xs text-stone-600">
          <svg class="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect height="18" rx="2" ry="2" width="18" x="3" y="4"></rect>
            <line x1="16" x2="16" y1="2" y2="6"></line>
            <line x1="8" x2="8" y1="2" y2="6"></line>
            <line x1="3" x2="21" y1="10" y2="10"></line>
          </svg>
          <span class="font-medium">25 Sep 2026, <span class="text-stone-400 font-normal">Today</span></span>
        </div>

        <!-- Google SEO & Sitemap Live Status Button -->
        <button 
          id="open-seo-modal-btn" 
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#E6F4EA] hover:bg-[#D5EEDC] text-[#1E7E34] border border-[#CDE9D3] transition-all cursor-pointer shadow-2xs"
          title="Google SEO, Sitemap.xml & Rich Schema Validator"
        >
          <span class="w-2 h-2 rounded-full bg-[#34A853] animate-pulse"></span>
          <span>Google SEO & Sitemap</span>
        </button>

        <!-- Notifications Bell -->
        <button 
          id="notifications-bell-btn"
          class="relative p-2 rounded-xl text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer" 
          title="Notifications"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          ${unreadNotifications > 0 ? `
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          ` : ''}
        </button>

        <!-- Admin Profile Tag (1:1 with Stitch screen.png) -->
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
