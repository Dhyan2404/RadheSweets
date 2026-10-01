// Desktop Sidebar Component - 100% Exact Match with Stitch Dashboard (screen.png)
// Features: Radhe Sweets Lotus Emblem, Navigation Links, and Devotional Footer Card ("Jai Radhe Krishna")

export function renderSidebar(currentTab) {
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round"></path></svg>` 
    },
    { 
      id: 'pos', 
      label: 'Sell / POS', 
      icon: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` 
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>` 
    },
    { 
      id: 'customers', 
      label: 'Customers', 
      icon: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` 
    },
    { 
      id: 'products', 
      label: 'Products', 
      icon: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"></path></svg>` 
    },
    { 
      id: 'expenses', 
      label: 'Expenses', 
      icon: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` 
    },
    { 
      id: 'analytics', 
      label: 'Reports', 
      icon: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` 
    },
    { 
      id: 'staff', 
      label: 'Staff & Payroll', 
      icon: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` 
    }
  ];

  return `
    <aside class="hidden md:flex w-64 bg-white border-r border-[#F0ECE4] flex-shrink-0 flex-col justify-between p-5 h-screen sticky top-0 select-none overflow-y-auto" data-purpose="desktop-sidebar">
      <div class="space-y-6">
        
        <!-- Brand Header (1:1 with Stitch screen.png) -->
        <div class="flex items-center space-x-3 px-1 pt-1 cursor-pointer group" id="brand-header-btn" data-tab="dashboard">
          <div class="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-[#C86D3B] shadow-xs group-hover:scale-105 transition-transform">
            <!-- Lotus Emblem Icon (1:1 with Stitch screen.png) -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
              <path d="M12 3c1.5 3.5 4 6 8 7-2 4-5 6-8 11-3-5-6-7-8-11 4-1 6.5-3.5 8-7Z"></path>
              <path d="M12 10c0 4 2 7 5 9"></path>
              <path d="M12 10c0 4-2 7-5 9"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold tracking-tight text-[#2A1F1D] leading-snug">Radhe Sweets</h1>
            <p class="text-[11px] font-semibold text-amber-700 tracking-wide uppercase">SWEETS &amp; MORE</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1" data-purpose="main-nav">
          ${navItems.map(item => {
            const isActive = currentTab === item.id;
            return `
              <button 
                data-tab="${item.id}"
                class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all text-left ${
                  isActive 
                    ? 'bg-orange-50 text-[#C86D3B] font-semibold shadow-xs' 
                    : 'text-[#7C7267] hover:text-[#2A1F1D] hover:bg-stone-50 font-medium'
                }"
              >
                <div class="flex items-center space-x-3">
                  <span class="${isActive ? 'text-[#C86D3B]' : 'text-[#7C7267]'}">
                    ${item.icon}
                  </span>
                  <span>${item.label}</span>
                </div>
                ${isActive ? `
                  <span class="w-1.5 h-1.5 rounded-full bg-[#C86D3B]"></span>
                ` : ''}
              </button>
            `;
          }).join('')}
        </nav>
      </div>

      <!-- Brand Artwork (Exact 1:1 match with Stitch screen.png) -->
      <div class="mt-auto pt-4 border-t border-[#F0ECE4]/60" data-purpose="sidebar-bottom-art">
        <div class="relative overflow-hidden rounded-2xl group cursor-pointer transition-all duration-300 hover:scale-[1.03]">
          <img 
            src="/image.png" 
            alt="Sweet moments... Better together" 
            class="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm transition-transform duration-500 group-hover:scale-105" 
            loading="lazy"
          />
        </div>
      </div>
    </aside>
  `;
}
