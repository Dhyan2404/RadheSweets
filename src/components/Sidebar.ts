// Desktop Sidebar Component with Role-Based Access Control (RBAC) & Logout
// Radhe Sweets - Supports Owner, Branch Admin, and Cashier permission filtering

export function renderSidebar(currentTab: string, state?: any) {
  const currentUser = state?.currentUser || { name: 'Owner', role: 'owner' };
  const userRole = currentUser.role || 'owner';
  const allowedPages = currentUser.allowedPages || [];

  const baseNavItems = [
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
    }
  ];

  // Role-Specific Navigation Extensions
  const navItems = [...baseNavItems];

  if (userRole === 'owner') {
    // Only Owner has Settings (Multi-branch CRUD, store profile, taxes, UPI)
    navItems.push({ 
      id: 'settings', 
      label: 'Settings', 
      icon: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>` 
    });
    // Only Owner has Owner Manage (Super Admin user roster across all branches)
    navItems.push({
      id: 'owner-manage',
      label: 'Owner Manage',
      icon: `<svg class="w-4 h-4 shrink-0 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
    });
  } else if (userRole === 'branch_admin') {
    // Branch Admin has Branch Admin console for managing their branch staff & cashiers
    navItems.push({
      id: 'branch-admin',
      label: 'Branch Admin',
      icon: `<svg class="w-4 h-4 shrink-0 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
    });
  }

  // Filter navigation items based on user's customized allowedPages
  const visibleNavItems = (allowedPages && allowedPages.length > 0)
    ? navItems.filter(item => allowedPages.includes(item.id))
    : navItems;

  let roleBadge = '👑 Owner';
  let roleBadgeClass = 'bg-amber-100 text-amber-900 border border-amber-300';
  if (userRole === 'branch_admin') {
    roleBadge = '🏢 Branch Admin';
    roleBadgeClass = 'bg-blue-100 text-blue-900 border border-blue-300';
  } else if (userRole === 'cashier') {
    roleBadge = '🛍️ Cashier';
    roleBadgeClass = 'bg-emerald-100 text-emerald-900 border border-emerald-300';
  }

  // Active Branch information
  const activeBranchId = state?.currentBranchId || 'br-1';
  const branchObj = (state?.branches || []).find((b: any) => b.id === activeBranchId);
  const branchName = branchObj ? branchObj.name : 'Main Store';

  return `
    <aside class="hidden md:flex w-64 bg-white border-r border-[#F0ECE4] flex-shrink-0 flex-col justify-between p-5 h-screen sticky top-0 select-none overflow-y-auto" data-purpose="desktop-sidebar">
      <div class="space-y-4">
        
        <!-- Brand Header -->
        <div class="flex items-center space-x-3 px-1 pt-1 cursor-pointer group" id="brand-header-btn" data-tab="${visibleNavItems[0]?.id || 'pos'}">
          <div class="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/70 flex items-center justify-center text-[#C86D3B] shadow-xs group-hover:scale-105 transition-transform">
            <!-- Lotus Emblem Icon -->
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

        <!-- Active Branch Section -->
        <div class="px-1 py-1 space-y-1 bg-stone-50/80 rounded-xl border border-stone-200/60 p-2">
          ${userRole === 'owner' ? `
            <div class="flex items-center gap-2 text-xs text-stone-600 font-medium">
              <span class="text-[#C86D3B] text-sm shrink-0">📍</span>
              <select 
                id="sidebar-branch-select"
                class="bg-transparent border-0 font-extrabold text-stone-800 text-xs focus:outline-none cursor-pointer hover:text-[#C86D3B] truncate flex-1 py-0.5"
                title="Select Active Branch"
              >
                ${(state?.branches || []).map((b: any) => `
                  <option value="${b.id}" ${b.id === activeBranchId ? 'selected' : ''}>
                    ${b.name} (${b.city || 'Gandhinagar'})
                  </option>
                `).join('')}
              </select>
            </div>
            <div class="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200/50 text-stone-500 font-semibold">
              <span>Gandhinagar Outlets</span>
              <button 
                type="button" 
                data-action="open-add-branch" 
                id="sidebar-add-branch-btn" 
                class="font-black text-[#C86D3B] hover:text-[#b05a2b] hover:underline flex items-center gap-0.5 cursor-pointer transition-colors"
                title="Add a new branch location"
              >
                <span>+ Add Branch</span>
              </button>
            </div>
          ` : `
            <div class="flex items-center justify-between gap-2 text-xs font-bold text-stone-800 py-0.5">
              <div class="flex items-center gap-1.5 truncate">
                <span class="text-[#C86D3B] text-sm shrink-0">📍</span>
                <span class="truncate">${branchName}</span>
              </div>
              <span class="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-1.5 py-0.5 rounded-md shrink-0 uppercase tracking-wider">
                Assigned
              </span>
            </div>
          `}
        </div>

        <!-- Spotlight Search Trigger (Ctrl+K) -->
        <button 
          id="desktop-search-trigger"
          type="button"
          class="w-full flex items-center justify-between px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100/90 border border-stone-200/80 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer transition-all active:scale-98 shadow-2xs"
          title="Search sweets, customers, orders (Ctrl+K)"
        >
          <div class="flex items-center space-x-2.5">
            <svg class="w-4 h-4 text-[#C86D3B]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <span>Search (Ctrl+K)</span>
          </div>
          <kbd class="text-[10px] font-mono font-bold text-stone-400 bg-white border border-stone-200 rounded px-1.5 py-0.5 shadow-2xs">⌘K</kbd>
        </button>

        <!-- Navigation Links -->
        <nav class="space-y-1" data-purpose="main-nav">
          ${visibleNavItems.map(item => {
            const isActive = currentTab === item.id;
            return `
              <button 
                data-tab="${item.id}"
                class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all text-left cursor-pointer ${
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

      <!-- Sweet Moments Dessert Bowl & User Profile Card -->
      <div class="mt-auto space-y-3 pt-3 border-t border-[#F0ECE4]" data-purpose="sidebar-user-footer">
        
        <!-- Sweet Moments Dessert Bowl Artwork -->
        <div class="px-1">
          <div class="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-white p-2 border border-amber-200/60 shadow-xs hover:shadow-sm transition-all group">
            <img 
              src="/sweet_moments_dessert_bowl.png" 
              alt="Sweet Moments Dessert Bowl" 
              onerror="this.onerror=null; this.src='/Sweet Moments Dessert Bowl.png';"
              class="w-full h-auto max-h-24 object-contain mx-auto drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </div>

        <!-- User Profile Card & Prominent Sign Out -->
        <div class="p-3 bg-stone-50/90 rounded-2xl border border-stone-200 space-y-2">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-9 h-9 rounded-full bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-xs font-black text-[#C86D3B] shrink-0">
              ${currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-xs font-extrabold text-[#2A1F1D] block truncate">${currentUser.name || 'User'}</span>
              <span class="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase inline-block ${roleBadgeClass}">
                ${roleBadge}
              </span>
            </div>
          </div>

          <!-- Explicit Full-Width Logout Button -->
          <button 
            type="button" 
            id="sidebar-logout-btn" 
            data-action="app-logout"
            class="w-full py-1.5 px-3 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-stone-200 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 group"
          >
            <svg class="w-3.5 h-3.5 text-rose-500 group-hover:text-rose-700 transition-colors" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Sign Out / Logout</span>
          </button>
        </div>

        <div class="text-center">
          <p class="text-[11px] font-bold text-[#C86D3B]/90 tracking-wide">🙏 Jai Radhe Krishna</p>
          <p class="text-[10px] text-stone-400">Sweet Moments... Better Together</p>
        </div>

      </div>
    </aside>
  `;
}
