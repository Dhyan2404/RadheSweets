// Desktop Sidebar Component
export function renderSidebar(currentTab, onTabChange, onOpenSplash) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round"></path></svg>` },
    { id: 'pos', label: 'Sell / POS', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` },
    { id: 'orders', label: 'Orders', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke-linecap="round" stroke-linejoin="round"></path></svg>` },
    { id: 'customers', label: 'Customers', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` },
    { id: 'products', label: 'Products', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"></path></svg>` },
    { id: 'expenses', label: 'Expenses', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` },
    { id: 'analytics', label: 'Reports', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` },
    { id: 'settings', label: 'Settings', icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` }
  ];

  return `
    <aside class="w-64 bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex-shrink-0 flex flex-col justify-between p-5 min-h-screen select-none transition-colors">
      <div class="space-y-6">
        <!-- Brand Logo Header -->
        <div class="flex items-center space-x-3 px-2 pt-1 cursor-pointer" id="brand-header-btn">
          <div class="w-10 h-10 rounded-xl bg-[var(--brand-primary-light)] border border-[var(--brand-primary)]/30 flex items-center justify-center text-[var(--brand-primary)] shadow-xs">
            <!-- Stylized Lotus Emblem -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
              <path d="M12 3c1.5 3.5 4 6 8 7-2 4-5 6-8 11-3-5-6-7-8-11 4-1 6.5-3.5 8-7Z"></path>
              <path d="M12 10c0 4 2 7 5 9"></path>
              <path d="M12 10c0 4-2 7-5 9"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold tracking-tight text-[var(--text-main)] leading-snug">Radhe Sweets</h1>
            <p class="text-[10px] font-bold text-[var(--brand-primary)] tracking-widest">SWEETS & MORE</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-1">
          ${navItems.map(item => {
            const isActive = currentTab === item.id;
            return `
              <button 
                data-tab="${item.id}"
                class="sidebar-nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)] font-semibold shadow-xs' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                }"
              >
                <div class="flex items-center space-x-3">
                  <span class="${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-light)]'}">
                    ${item.icon}
                  </span>
                  <span>${item.label}</span>
                </div>
                ${isActive ? '<span class="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)]"></span>' : ''}
              </button>
            `;
          }).join('')}
        </nav>
      </div>

      <!-- Devotional Footer Card -->
      <div class="mt-8 pt-4 border-t border-[var(--border-color)]">
        <div 
          id="open-splash-btn"
          class="bg-gradient-to-b from-orange-50/80 via-amber-50/60 to-orange-100/50 hover:from-amber-100/80 rounded-2xl p-3 border border-amber-200/80 flex flex-col items-center text-center cursor-pointer transition-all shadow-xs group"
          title="Click to view full Radha Krishna Welcome Art"
        >
          <div class="relative w-14 h-14 overflow-hidden mb-1 group-hover:scale-105 transition-transform flex items-center justify-center">
            <img 
              src="./assets/devotional_sidebar.png" 
              alt="Jai Radhe Krishna"
              class="w-full h-full object-contain"
            />
          </div>
          <p class="text-xs font-bold text-amber-950 tracking-tight">Jai Radhe Krishna</p>
          <p class="text-[9px] text-amber-800 italic mt-0.5 font-semibold">Sweet Moments With Radhe Krishna</p>
          <span class="text-[8px] font-bold text-amber-700 uppercase tracking-widest mt-1 opacity-80 group-hover:opacity-100">
            🙏 Divine Blessings
          </span>
        </div>
      </div>
    </aside>
  `;
}
