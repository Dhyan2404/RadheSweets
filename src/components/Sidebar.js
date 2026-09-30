// Desktop Sidebar Component - 100% 1:1 Exact Match with Reference Design (Image 1)
// Features: RadheSweets Confectionery Lotus Emblem, Exact Nav Items, and Sweet Moments Artwork at bottom

export function renderSidebar(currentTab) {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>` 
    },
    { 
      id: 'customers', 
      label: 'Customers', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>` 
    },
    { 
      id: 'pos', 
      label: 'Sales', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>` 
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` 
    },
    { 
      id: 'products', 
      label: 'Products', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>` 
    },
    { 
      id: 'expenses', 
      label: 'Expenses', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h.01M17 15h.01M7 9h10"/></svg>` 
    },
    { 
      id: 'analytics', 
      label: 'Profit & Analytics', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>` 
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>` 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>` 
    }
  ];

  return `
    <aside class="w-[240px] bg-[#FAF8F5] border-r border-[#EFE9DF] flex-shrink-0 flex flex-col justify-between p-4 sm:p-5 h-screen sticky top-0 select-none overflow-hidden">
      <div class="space-y-5">
        
        <!-- Brand Header (1:1 with reference image) -->
        <div class="flex items-center space-x-3 px-1 pt-1 cursor-pointer group" id="brand-header-btn">
          <!-- Dark Brown Circle Emblem with Cream Confectionery Lotus -->
          <div class="w-10 h-10 rounded-full bg-[#3D271D] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 48 48" class="w-6 h-6" fill="none">
              <!-- Confectionery Lotus Pedestal -->
              <path d="M12 28 C12 33, 36 33, 36 28 C34 26, 14 26, 12 28 Z" fill="#FAF7F2" opacity="0.95"/>
              <path d="M18 32 C18 35, 30 35, 30 32 Z" fill="#FAF7F2" opacity="0.85"/>
              <!-- Central Lotus Petal -->
              <path d="M24 13 C22 17, 21 21, 24 25 C27 21, 26 17, 24 13 Z" fill="#FAF7F2"/>
              <!-- Left Petal -->
              <path d="M23 18 C19 19, 16 22, 17 25 C20 25.5, 22.5 23, 23 18 Z" fill="#FAF7F2" opacity="0.95"/>
              <!-- Right Petal -->
              <path d="M25 18 C29 19, 32 22, 31 25 C28 25.5, 25.5 23, 25 18 Z" fill="#FAF7F2" opacity="0.95"/>
              <!-- Confectionery Decorative Dots -->
              <circle cx="24" cy="10" r="1.5" fill="#FAF7F2" opacity="0.85"/>
              <circle cx="18" cy="14" r="1.2" fill="#FAF7F2" opacity="0.65"/>
              <circle cx="30" cy="14" r="1.2" fill="#FAF7F2" opacity="0.65"/>
            </svg>
          </div>

          <div class="flex flex-col text-left">
            <h1 class="text-xl font-bold tracking-tight text-[#2A1F1D] leading-none">RadheSweets</h1>
            <p class="text-[9px] font-bold text-[#8C7E72] tracking-[0.2em] uppercase mt-1">SWEETS & MORE</p>
          </div>
        </div>

        <!-- Navigation Links (Matching reference active/inactive styling) -->
        <nav class="space-y-1">
          ${navItems.map(item => {
            const isActive = currentTab === item.id;
            return `
              <button 
                data-tab="${item.id}"
                class="w-full flex items-center px-3.5 py-2 rounded-2xl text-[13px] transition-all text-left ${
                  isActive 
                    ? 'bg-[#EFE8DC] text-[#2A1F1D] font-bold shadow-2xs' 
                    : 'text-[#6C635B] hover:text-[#2A1F1D] hover:bg-[#F2ECE3]/70 font-medium'
                }"
              >
                <span class="mr-3 shrink-0 flex items-center justify-center ${isActive ? 'text-[#2A1F1D]' : 'text-[#8C7E72]'}">
                  ${item.icon}
                </span>
                <span>${item.label}</span>
              </button>
            `;
          }).join('')}
        </nav>
      </div>

      <!-- Bottom Sweet Moments Artwork (Exact match with reference image) -->
      <div class="pt-3 pb-1 select-none pointer-events-none mt-auto">
        <div class="relative w-full max-w-[190px] mx-auto transition-transform hover:scale-102">
          <img 
            src="/assets/sweet_moments.png" 
            alt="Sweet moments... Better together" 
            class="w-full h-auto object-contain filter drop-shadow-xs"
            onerror="this.src='/image.png'; if(!this.src) this.src='./image.png'"
          />
        </div>
      </div>
    </aside>
  `;
}
