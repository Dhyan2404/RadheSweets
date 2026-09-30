// Global Spotlight Command Palette & Omnibar Search Modal
// Features: Full-text instantaneous search across Sweets, Customers, Orders, and Quick Actions
// Works 1000x better on PC with keyboard shortcuts (Ctrl+K, arrows, ESC)
// Works 10000x better on Mobile with full-screen native search sheet and touch actions

export function renderSearchResultsBody(state: any): string {
  const query = (state.searchModalQuery || '').trim().toLowerCase();
  const category = state.searchModalCategory || 'all';

  const sweets = state.sweets || [];
  const customers = state.customers || [];
  const orders = state.orders || [];

  // Filter Sweets
  const matchedSweets = query 
    ? sweets.filter((s: any) => 
        (s.name && s.name.toLowerCase().includes(query)) ||
        (s.category && s.category.toLowerCase().includes(query)) ||
        (s.description && s.description.toLowerCase().includes(query))
      )
    : sweets.slice(0, 6);

  // Filter Customers
  const matchedCustomers = query
    ? customers.filter((c: any) => 
        (c.name && c.name.toLowerCase().includes(query)) ||
        (c.phone && c.phone.includes(query)) ||
        (c.tier && c.tier.toLowerCase().includes(query))
      )
    : customers.slice(0, 5);

  // Filter Orders
  const matchedOrders = query
    ? orders.filter((o: any) => 
        (o.id && o.id.toLowerCase().includes(query)) ||
        (o.customerName && o.customerName.toLowerCase().includes(query)) ||
        (o.status && o.status.toLowerCase().includes(query))
      )
    : orders.slice(0, 5);

  // Quick System Actions
  const allActions = [
    { id: 'act-pos', title: 'Open POS Counter / New Bill', desc: 'Create quick walk-in or express counter sale', badge: 'POS Counter', icon: 'cart', tab: 'pos' },
    { id: 'act-add-sweet', title: 'Add New Confectionery Sweet', desc: 'Register fresh batch, pricing, and stock', badge: 'Inventory', icon: 'plus', action: 'add-product' },
    { id: 'act-add-customer', title: 'Register New Customer Account', desc: 'Create customer phone profile & Khata ledger', badge: 'Customers', icon: 'user-plus', action: 'add-customer' },
    { id: 'act-settle', title: 'Settle Khata / Udhar Balance', desc: 'Record partial cash, UPI or full balance payments', badge: 'Khata', icon: 'credit-card', tab: 'customers' },
    { id: 'act-expense', title: 'Record Store Expense', desc: 'Log dairy milk, pure ghee, sugar or payroll cost', badge: 'Expenses', icon: 'receipt', action: 'add-expense' },
    { id: 'act-analytics', title: 'View Analytics & Profit Reports', desc: 'Check gross profit margins, shift reports, and trajectories', badge: 'Reports', icon: 'chart', tab: 'analytics' },
    { id: 'act-seo', title: 'Google SEO & Sitemap Status', desc: 'Audit sitemap.xml, robots.txt, and JSON-LD schema', badge: 'SEO Hub', icon: 'search', action: 'open-seo' },
    { id: 'act-theme', title: 'Switch App Theme Palette', desc: 'Toggle between Warm Terracotta and Serene Ice themes', badge: 'Appearance', icon: 'palette', action: 'toggle-theme' },
    { id: 'act-dark', title: 'Toggle Dark / Light Mode', desc: 'Switch system display theme for night counter shifts', badge: 'Appearance', icon: 'moon', action: 'toggle-dark' },
    { id: 'act-dialer', title: 'Open Customer Touch Phone Dialer', desc: 'Call customer directly from counter terminal', badge: 'Dialer', icon: 'phone', action: 'open-dialer' }
  ];

  const matchedActions = query
    ? allActions.filter(a => a.title.toLowerCase().includes(query) || a.desc.toLowerCase().includes(query) || a.badge.toLowerCase().includes(query))
    : allActions.slice(0, 5);

  const totalResults = (category === 'all' || category === 'sweets' ? matchedSweets.length : 0) +
                       (category === 'all' || category === 'customers' ? matchedCustomers.length : 0) +
                       (category === 'all' || category === 'orders' ? matchedOrders.length : 0) +
                       (category === 'all' || category === 'actions' ? matchedActions.length : 0);

  return `
    ${!query ? `
      <!-- Popular Quick Searches Pill List -->
      <div class="mb-4">
        <p class="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2 px-1 flex items-center gap-1.5">
          <span>⚡</span>
          <span>Popular &amp; Suggested Searches</span>
        </p>
        <div class="flex flex-wrap gap-1.5">
          ${[
            { label: 'Kaju Katli', query: 'Kaju Katli' },
            { label: 'Gulab Jamun', query: 'Gulab Jamun' },
            { label: 'Jignesh Shah', query: 'Jignesh' },
            { label: 'Motichoor Ladoo', query: 'Motichoor' },
            { label: 'Rasgulla', query: 'Rasgulla' },
            { label: 'Khata Due', query: 'due' },
            { label: 'POS Billing', query: 'pos' }
          ].map(tag => `
            <button 
              type="button"
              data-quick-search-term="${tag.query}"
              class="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200/70 text-[#C86D3B] text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center gap-1"
            >
              <span>🔍</span>
              <span>${tag.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${totalResults === 0 ? `
      <div class="py-12 flex flex-col items-center justify-center text-center">
        <div class="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-[#C86D3B] flex items-center justify-center mb-3 shadow-2xs">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <p class="text-sm font-bold text-stone-800">No matches found for "${state.searchModalQuery}"</p>
        <p class="text-xs text-stone-500 mt-1 max-w-xs">Try searching for sweets like "Kaju", customer names, phone digits, order IDs, or actions like "POS".</p>
      </div>
    ` : ''}

    <!-- SECTION: SWEETS -->
    ${(category === 'all' || category === 'sweets') && matchedSweets.length > 0 ? `
      <section class="space-y-1.5 mb-4">
        <div class="flex items-center justify-between px-1">
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <span>🍬</span>
            <span>Confectionery &amp; Sweets (${matchedSweets.length})</span>
          </span>
          <button type="button" data-tab="products" class="text-[11px] font-bold text-[#C86D3B] hover:underline cursor-pointer">View All →</button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${matchedSweets.map((sweet: any) => `
            <div 
              class="search-result-item bg-white p-3 rounded-2xl border border-stone-200/90 hover:border-[#C86D3B]/70 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
              data-search-action="add-sweet-pos"
              data-sweet-id="${sweet.id}"
              data-sweet-name="${sweet.name}"
              data-sweet-price="${sweet.rate || sweet.price || 450}"
            >
              <div class="flex items-center space-x-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-orange-100/70 border border-orange-200 text-[#C86D3B] font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  ${(sweet.name || 'SW').slice(0, 2).toUpperCase()}
                </div>
                <div class="min-w-0 truncate">
                  <p class="font-bold text-xs sm:text-sm text-[#2A1F1D] truncate group-hover:text-[#C86D3B] transition-colors">${sweet.name}</p>
                  <p class="text-[11px] text-stone-500 mt-0.5">
                    <b class="text-[#C86D3B] font-bold">₹${sweet.rate || sweet.price}</b> /kg
                    <span class="text-stone-300 mx-1">•</span>
                    <span class="${sweet.stock > 5 ? 'text-emerald-600' : 'text-amber-600'} font-medium">${sweet.stock > 0 ? `${sweet.stock} kg in stock` : 'Out of stock'}</span>
                  </p>
                </div>
              </div>
              <button 
                type="button"
                class="px-2.5 py-1.5 rounded-xl bg-orange-50 group-hover:bg-[#C86D3B] text-[#C86D3B] group-hover:text-white text-xs font-bold transition-all shrink-0 ml-2 shadow-2xs cursor-pointer"
                title="Add 1 kg directly to POS counter cart"
              >
                + Add POS
              </button>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- SECTION: CUSTOMERS -->
    ${(category === 'all' || category === 'customers') && matchedCustomers.length > 0 ? `
      <section class="space-y-1.5 mb-4">
        <div class="flex items-center justify-between px-1">
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <span>👥</span>
            <span>Customers &amp; Khata Accounts (${matchedCustomers.length})</span>
          </span>
          <button type="button" data-tab="customers" class="text-[11px] font-bold text-[#C86D3B] hover:underline cursor-pointer">View Khata →</button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${matchedCustomers.map((cust: any) => `
            <div 
              class="search-result-item bg-white p-3 rounded-2xl border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
              data-search-action="view-customer"
              data-customer-id="${cust.id}"
            >
              <div class="flex items-center space-x-3 min-w-0">
                <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  ${(cust.name || 'CU').slice(0, 2).toUpperCase()}
                </div>
                <div class="min-w-0 truncate">
                  <div class="flex items-center gap-1.5">
                    <p class="font-bold text-xs sm:text-sm text-[#2A1F1D] truncate group-hover:text-amber-800 transition-colors">${cust.name}</p>
                    ${cust.tier === 'VIP' ? '<span class="text-[9px] bg-amber-500 text-white font-bold px-1 rounded shadow-2xs">VIP</span>' : ''}
                  </div>
                  <p class="text-[11px] text-stone-400 mt-0.5 truncate">${cust.phone || 'No phone'}</p>
                </div>
              </div>
              <div class="text-right shrink-0 ml-2">
                <p class="text-xs font-bold ${(cust.pendingBalance || cust.khataBalance || 0) > 0 ? 'text-rose-600' : 'text-emerald-600'}">
                  ${(cust.pendingBalance || cust.khataBalance || 0) > 0 ? `₹${cust.pendingBalance || cust.khataBalance} due` : 'Settled'}
                </p>
                <span class="text-[10px] text-stone-400">${cust.ordersCount || cust.visits || cust.totalOrders || 0} orders</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- SECTION: ORDERS -->
    ${(category === 'all' || category === 'orders') && matchedOrders.length > 0 ? `
      <section class="space-y-1.5 mb-4">
        <div class="flex items-center justify-between px-1">
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <span>📦</span>
            <span>Recent Orders &amp; Receipts (${matchedOrders.length})</span>
          </span>
          <button type="button" data-tab="orders" class="text-[11px] font-bold text-[#C86D3B] hover:underline cursor-pointer">View All →</button>
        </div>

        <div class="space-y-2">
          ${matchedOrders.map((ord: any) => `
            <div 
              class="search-result-item bg-white p-3 rounded-2xl border border-stone-200/90 hover:border-purple-300 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
              data-search-action="view-order"
              data-order-id="${ord.id}"
            >
              <div class="flex items-center space-x-3 min-w-0">
                <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  #
                </div>
                <div class="min-w-0 truncate">
                  <div class="flex items-center gap-2">
                    <p class="font-bold text-xs sm:text-sm text-[#2A1F1D] group-hover:text-purple-700 transition-colors">${ord.id}</p>
                    <span class="text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                      ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' :
                      ord.status === 'Processing' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'
                    }">${ord.status || 'Delivered'}</span>
                  </div>
                  <p class="text-[11px] text-stone-500 mt-0.5 truncate">${ord.customerName || 'Walk-in Customer'} • ${ord.date || 'Today'}</p>
                </div>
              </div>
              <div class="text-right shrink-0 ml-2">
                <p class="font-extrabold text-sm text-[#2A1F1D]">₹${ord.total || 0}</p>
                <span class="text-[10px] text-[#C86D3B] font-semibold group-hover:underline">View Bill →</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- SECTION: QUICK ACTIONS -->
    ${(category === 'all' || category === 'actions') && matchedActions.length > 0 ? `
      <section class="space-y-1.5 mb-2">
        <span class="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 px-1 flex items-center gap-1.5">
          <span>⚡</span>
          <span>Quick Actions &amp; Navigation (${matchedActions.length})</span>
        </span>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${matchedActions.map(act => `
            <button 
              type="button"
              class="search-result-item bg-white p-3 rounded-2xl border border-stone-200/90 hover:border-[#C86D3B] hover:shadow-md transition-all flex items-center space-x-3 text-left group cursor-pointer w-full"
              data-search-action="${act.action || 'nav'}"
              data-search-tab="${act.tab || ''}"
            >
              <div class="w-9 h-9 rounded-xl bg-orange-50 group-hover:bg-[#C86D3B] text-[#C86D3B] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <p class="font-bold text-xs sm:text-sm text-[#2A1F1D] group-hover:text-[#C86D3B] transition-colors truncate">${act.title}</p>
                  <span class="text-[9px] font-bold text-stone-400 uppercase tracking-wider shrink-0 ml-1">${act.badge}</span>
                </div>
                <p class="text-[11px] text-stone-500 mt-0.5 truncate">${act.desc}</p>
              </div>
            </button>
          `).join('')}
        </div>
      </section>
    ` : ''}
  `;
}

export function renderSearchModal(state: any): string {
  const query = state.searchModalQuery || '';
  const category = state.searchModalCategory || 'all';

  return `
    <div id="global-search-modal-backdrop" class="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex flex-col md:items-center md:justify-start md:pt-16 p-0 md:p-4 animate-fadeIn select-none">
      
      <!-- Modal Box: Fullscreen on mobile, centered card on PC -->
      <div 
        id="global-search-card"
        class="w-full md:max-w-2xl bg-[#FAF7F2] md:bg-white md:rounded-3xl shadow-2xl border-0 md:border md:border-stone-200/80 flex flex-col h-full md:h-auto md:max-h-[84vh] overflow-hidden animate-popIn"
        onclick="event.stopPropagation()"
      >
        <!-- Header: Search Input & Close Action -->
        <div class="p-3.5 sm:p-4 border-b border-stone-200/80 bg-white flex items-center gap-2.5">
          <!-- Back button on mobile / Close icon -->
          <button 
            type="button"
            id="close-search-modal-btn" 
            class="p-2 -ml-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
            aria-label="Close search"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>

          <!-- Input Wrapper -->
          <div class="flex-1 relative flex items-center">
            <span class="absolute left-3.5 text-[#C86D3B] pointer-events-none">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <input 
              id="spotlight-search-input"
              type="text" 
              value="${query}"
              placeholder="Search sweets, customers, phone, orders, actions..." 
              autocomplete="off"
              class="w-full pl-11 pr-10 py-2.5 sm:py-3 bg-stone-50 border border-stone-200 focus:bg-white rounded-2xl text-sm sm:text-base text-[#2A1F1D] font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/25 focus:border-[#C86D3B] transition-all"
            />
            <button 
              type="button"
              id="clear-spotlight-search-btn"
              class="${query ? 'block' : 'hidden'} absolute right-3 p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              title="Clear input"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <!-- ESC Badge on Desktop -->
          <div class="hidden sm:flex items-center shrink-0">
            <kbd class="px-2 py-1 text-[11px] font-bold text-stone-500 bg-stone-100 border border-stone-200 rounded-lg shadow-2xs">ESC</kbd>
          </div>
        </div>

        <!-- Category Filter Tabs -->
        <div class="px-3 sm:px-4 py-2 bg-stone-50/90 border-b border-stone-200/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          ${[
            { id: 'all', label: 'All Results' },
            { id: 'sweets', label: '🍬 Sweets' },
            { id: 'customers', label: '👥 Customers' },
            { id: 'orders', label: '📦 Orders' },
            { id: 'actions', label: '⚡ Quick Actions' }
          ].map(tab => {
            const isActive = category === tab.id;
            return `
              <button 
                type="button"
                data-search-filter="${tab.id}"
                class="px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'bg-[#C86D3B] text-white shadow-2xs' 
                    : 'bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-100'
                }"
              >
                ${tab.label}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Results Body -->
        <div id="search-modal-results-container" class="flex-1 overflow-y-auto p-3 sm:p-4">
          ${renderSearchResultsBody(state)}
        </div>

        <!-- Desktop Footer Keyboard Shortcuts -->
        <div class="hidden sm:flex items-center justify-between px-4 py-2.5 bg-stone-50 border-t border-stone-200/80 text-[11px] text-stone-500">
          <div class="flex items-center space-x-4">
            <span class="flex items-center gap-1"><kbd class="px-1.5 py-0.5 bg-white border border-stone-300 rounded shadow-2xs font-mono font-bold">↵</kbd> to select</span>
            <span class="flex items-center gap-1"><kbd class="px-1.5 py-0.5 bg-white border border-stone-300 rounded shadow-2xs font-mono font-bold">ESC</kbd> to close</span>
          </div>
          <span class="text-stone-400 font-semibold">Radhe Sweets Omnibar Search</span>
        </div>

      </div>
    </div>
  `;
}
