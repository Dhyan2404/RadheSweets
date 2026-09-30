// Top Navigation Bar Component - 100% 1:1 Match with Reference Design
// Features: Pill Search Input, Date Widget ("25 Sep 2026 Today"), Notification Bell with dot, Admin User Dropdown

export function renderTopBar(state) {
  const { searchQuery, unreadNotifications = 1 } = state;

  return `
    <header class="h-18 bg-[#FAF7F2] border-b border-[#EFE9DF] px-6 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 select-none">
      <!-- Mobile Brand & Hamburger Menu (Visible on mobile < 768px) -->
      <div class="flex items-center space-x-3 md:hidden">
        <button 
          id="mobile-menu-toggle" 
          class="p-2 -ml-1 text-[#2A1F1D] hover:bg-[#F2ECE3] active:bg-stone-200/70 rounded-xl transition-all"
          aria-label="Open Navigation Menu"
        >
          <svg class="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>

        <div class="flex items-center space-x-2.5 cursor-pointer" data-tab="dashboard">
          <div class="w-8 h-8 rounded-full bg-[#3D271D] flex items-center justify-center shadow-2xs">
            <svg viewBox="0 0 48 48" class="w-5 h-5" fill="none">
              <path d="M12 28 C12 33, 36 33, 36 28 C34 26, 14 26, 12 28 Z" fill="#FAF7F2" opacity="0.95"/>
              <path d="M18 32 C18 35, 30 35, 30 32 Z" fill="#FAF7F2" opacity="0.85"/>
              <path d="M24 13 C22 17, 21 21, 24 25 C27 21, 26 17, 24 13 Z" fill="#FAF7F2"/>
              <path d="M23 18 C19 19, 16 22, 17 25 C20 25.5, 22.5 23, 23 18 Z" fill="#FAF7F2" opacity="0.95"/>
              <path d="M25 18 C29 19, 32 22, 31 25 C28 25.5, 25.5 23, 25 18 Z" fill="#FAF7F2" opacity="0.95"/>
            </svg>
          </div>
          <div class="flex flex-col text-left">
            <span class="font-bold text-sm tracking-tight text-[#2A1F1D] leading-tight">RadheSweets</span>
            <span class="text-[8px] font-bold text-[#8C7E72] tracking-widest leading-none mt-0.5">SWEETS & MORE</span>
          </div>
        </div>
      </div>

      <!-- Desktop Search Bar (Exact 1:1 match with reference pill search) -->
      <div class="hidden md:flex w-full max-w-sm relative items-center">
        <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8C7E72]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </span>
        <input 
          id="global-search-input"
          type="text" 
          value="${searchQuery || ''}"
          placeholder="Search anything..." 
          style="padding-left: 2.75rem !important;"
          class="w-full pr-4 py-2.5 bg-[#F4EEE5] border border-transparent rounded-full text-xs text-[#2A1F1D] placeholder-[#A3968A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
        />
      </div>

      <!-- Right Header Actions (Exact 1:1 with reference image) -->
      <div class="flex items-center space-x-4 sm:space-x-5">
        <!-- Date Widget ("25 Sep 2026 Today") -->
        <div class="hidden sm:flex items-center space-x-2 text-left">
          <span class="text-[#2A1F1D]">
            <svg class="w-4 h-4 text-[#3D271D]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </span>
          <div class="flex flex-col leading-tight">
            <span class="text-xs font-bold text-[#2A1F1D]">25 Sep 2026</span>
            <span class="text-[10px] text-[#8C7E72] font-medium">Today</span>
          </div>
        </div>

        <!-- Notification Bell with Red Badge Dot -->
        <button 
          id="notifications-bell-btn"
          class="relative p-2 rounded-xl text-[#4A3E37] hover:bg-[#F2ECE3] transition-colors"
          title="1 New Notification"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          ${unreadNotifications > 0 ? `
            <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E05A47] ring-2 ring-[#FAF7F2]"></span>
          ` : ''}
        </button>

        <!-- User Profile Pill: Circular Avatar "AS" + "Admin" + Chevron -->
        <div class="flex items-center space-x-2 pl-1 cursor-pointer group" id="user-profile-menu-btn">
          <div class="w-8 h-8 rounded-full bg-[#6B5749] text-[#FAF7F2] font-semibold text-xs flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
            AS
          </div>
          <span class="text-xs font-semibold text-[#2A1F1D] group-hover:text-[#C86D3B] transition-colors">Admin</span>
          <svg class="w-3.5 h-3.5 text-[#8C7E72] group-hover:text-[#2A1F1D] transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
      </div>
    </header>
  `;
}
