// Customers, Loyalty Club & Advance Bulk Orders Component
// Radhe Sweets - Warm Terracotta Confectionery Design System with Top 3 Customers, Sorting & Edit Customer Modal
import { renderCounter } from './Counter';

export function renderCustomersView(state: any) {
  const { 
    customers = [], 
    customersFilterTab = 'all', 
    customersSearchQuery = '', 
    advanceOrders = [],
    customersSortBy = 'most-spent'
  } = state;

  const vipCustomers = customers.filter((c: any) => c.tier === 'VIP' || c.type === 'VIP');
  
  const tabs = [
    { id: 'all', label: `All Customers (${customers.length})` },
    { id: 'vip', label: `VIP Members (${vipCustomers.length})` },
    { id: 'advance', label: `Advance Bulk Orders (${advanceOrders.length})`, isAdvance: true }
  ];

  const isAdvanceTab = customersFilterTab === 'advance';

  // Compute live customer KPIs
  const totalLoyaltyPoints = customers.reduce((sum: number, c: any) => sum + (Number(c.loyaltyPoints) || 0), 0);
  const totalCustomerSpend = customers.reduce((sum: number, c: any) => sum + (Number(c.totalSpent) || 0), 0);

  // Top 3 Customers by Total Spend
  const top3Customers = [...customers]
    .sort((a: any, b: any) => (Number(b.totalSpent) || 0) - (Number(a.totalSpent) || 0))
    .slice(0, 3);

  // Filter & Search
  let filteredCustomers = customers.filter((c: any) => {
    if (customersFilterTab === 'vip') return c.tier === 'VIP' || c.type === 'VIP';
    
    if (!customersSearchQuery) return true;
    const q = customersSearchQuery.toLowerCase();
    return (
      (c.id && c.id.toLowerCase().includes(q)) ||
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  // Sorting: most-spent, least-spent, newest, oldest, name
  if (customersSortBy === 'least-spent') {
    filteredCustomers.sort((a: any, b: any) => (Number(a.totalSpent) || 0) - (Number(b.totalSpent) || 0));
  } else if (customersSortBy === 'newest') {
    filteredCustomers.sort((a: any, b: any) => String(b.id || '').localeCompare(String(a.id || '')));
  } else if (customersSortBy === 'oldest') {
    filteredCustomers.sort((a: any, b: any) => String(a.id || '').localeCompare(String(b.id || '')));
  } else if (customersSortBy === 'name') {
    filteredCustomers.sort((a: any, b: any) => String(a.name || '').localeCompare(String(b.name || '')));
  } else {
    // Default 'most-spent'
    filteredCustomers.sort((a: any, b: any) => (Number(b.totalSpent) || 0) - (Number(a.totalSpent) || 0));
  }

  return `
    <div class="space-y-6 animate-fadeIn select-none">
      
      <!-- Top Title Bar with Action Buttons -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">Customer Directory &amp; Loyalty</h1>
            <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#FFF7ED] text-[#C86D3B] border border-[#FED7AA]">
              <span class="w-2 h-2 rounded-full bg-[#1E7E34]"></span>
              Patron CRM Active
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#7C7267] mt-1 font-medium">Manage customer profiles, Customer IDs, VIP rewards, lifetime spending &amp; bulk festival orders</p>
        </div>

        <div class="flex items-center gap-2.5">
          <button 
            id="open-add-customer-modal-btn" 
            class="px-4 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span class="text-base leading-none font-black">+</span>
            <span>Add New Customer</span>
          </button>
        </div>
      </section>

      <!-- 4 Customer KPI Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <!-- CARD 1: Total Registered Customers -->
        <article 
          data-customers-tab="all"
          class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between cursor-pointer hover:border-[#C86D3B] hover:shadow-md transition-all group"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267] group-hover:text-[#2A1F1D]">Total Patron Base</span>
            <div class="w-9 h-9 rounded-2xl bg-[#FFF7ED] flex items-center justify-center text-[#C86D3B]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">
              ${renderCounter({
                value: customers.length,
                suffix: '<span class="text-sm font-normal text-[#7C7267]">patrons</span>',
                fontWeight: 800,
                gradientFrom: 'rgba(255, 255, 255, 0.75)'
              })}
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>Active in Ahmedabad</span>
              <span class="font-bold text-[#1E7E34]">+12% this month</span>
            </div>
          </div>
        </article>

        <!-- CARD 2: VIP Loyalty Club -->
        <article 
          data-customers-tab="vip"
          class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between cursor-pointer hover:border-[#DDA15E] hover:shadow-md transition-all group"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267] group-hover:text-[#2A1F1D]">VIP Loyalty Members</span>
            <div class="w-9 h-9 rounded-2xl bg-[#FEF9C3] flex items-center justify-center text-[#A16207]">
              ⭐
            </div>
          </div>
          <div class="mt-3">
            <div class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">
              ${renderCounter({
                value: vipCustomers.length,
                suffix: '<span class="text-sm font-normal text-[#7C7267]">Gold Tier</span>',
                fontWeight: 800,
                gradientFrom: 'rgba(255, 255, 255, 0.75)'
              })}
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>Special festival discounts</span>
              <span class="font-bold text-[#A16207]">Privilege Tier</span>
            </div>
          </div>
        </article>

        <!-- CARD 3: Loyalty Points Pool -->
        <article 
          class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267]">Loyalty Points Balance</span>
            <div class="w-9 h-9 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
              🎁
            </div>
          </div>
          <div class="mt-3">
            <div class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">
              ${renderCounter({
                value: totalLoyaltyPoints,
                suffix: '<span class="text-sm font-normal text-[#7C7267]">pts</span>',
                fontWeight: 800,
                gradientFrom: 'rgba(255, 255, 255, 0.75)'
              })}
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>1 pt per ₹50 spend</span>
              <span class="font-bold text-[#D97706]">Redeemable</span>
            </div>
          </div>
        </article>

        <!-- CARD 4: Lifetime Spend -->
        <article 
          class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267]">Patron Lifetime Spend</span>
            <div class="w-9 h-9 rounded-2xl bg-[#E6F4EA] flex items-center justify-center text-[#1E7E34]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <div class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">
              ${renderCounter({
                value: totalCustomerSpend,
                prefix: '₹',
                fontWeight: 800,
                gradientFrom: 'rgba(255, 255, 255, 0.75)'
              })}
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>Total revenue logged</span>
              <span class="font-bold text-[#1E7E34]">High Retention</span>
            </div>
          </div>
        </article>

      </section>

      <!-- TOP 3 CUSTOMERS SPOTLIGHT PODIUM -->
      ${!isAdvanceTab && top3Customers.length > 0 ? `
        <section class="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 rounded-3xl p-4 sm:p-5 border border-amber-200/90 shadow-subtle space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">🏆</span>
              <div>
                <h3 class="text-sm sm:text-base font-extrabold text-[#2A1F1D]">Top 3 Patrons (Highest Spenders)</h3>
                <p class="text-[11px] text-stone-500">Honoring our top sweet lovers and high-frequency buyers</p>
              </div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900 border border-amber-300">
              VIP Champions
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            ${top3Customers.map((cust, idx) => {
              const badge = idx === 0 ? '🥇 #1 Rank (Gold)' : idx === 1 ? '🥈 #2 Rank (Silver)' : '🥉 #3 Rank (Bronze)';
              const badgeBg = idx === 0 ? 'bg-amber-100 text-amber-900 border-amber-300' : idx === 1 ? 'bg-stone-200 text-stone-800 border-stone-300' : 'bg-orange-100 text-orange-900 border-orange-300';
              return `
                <div class="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeBg}">${badge}</span>
                      <span class="font-mono text-[10px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">#${cust.id.toUpperCase()}</span>
                    </div>
                    <h4 class="font-black text-sm text-[#2A1F1D] truncate">${cust.name}</h4>
                    <p class="text-[11px] text-stone-500">${cust.phone}</p>
                    
                    <div class="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <span class="text-[10px] text-stone-400 block">Total Spend</span>
                        <span class="font-black text-[#1E7E34]">₹${(cust.totalSpent || 0).toLocaleString()}</span>
                      </div>
                      <div class="text-right">
                        <span class="text-[10px] text-stone-400 block">Orders</span>
                        <span class="font-bold text-stone-700">${cust.totalOrders || 1} bills</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 pt-2 border-t border-stone-100 flex items-center gap-2">
                    <button 
                      type="button" 
                      data-select-for-pos="${cust.id}" 
                      class="flex-1 py-1.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white text-[11px] font-bold rounded-xl transition-all text-center cursor-pointer shadow-2xs"
                    >
                      ⚡ Quick Sale
                    </button>
                    <button 
                      type="button" 
                      data-edit-customer="${cust.id}" 
                      class="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                      title="Edit Customer"
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Filter Tabs, Sort & Search Bar -->
      <section class="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <!-- Category Filter Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            ${tabs.map(tab => {
              const isActive = (customersFilterTab || 'all') === tab.id;
              return `
                <button 
                  data-customers-tab="${tab.id}"
                  class="px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#C86D3B] text-white shadow-xs' 
                      : 'bg-[#FAF7F2] text-[#7C7267] hover:text-[#2A1F1D] hover:bg-[#F0ECE4] border border-[#EFE7DE]'
                  }"
                >
                  ${tab.label}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Sort & Search Inputs -->
          ${!isAdvanceTab ? `
            <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              
              <!-- Sorting Dropdown -->
              <div class="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl px-3 py-1.5 text-xs">
                <span class="font-bold text-stone-500 whitespace-nowrap">Sort:</span>
                <select 
                  id="customers-sort-select" 
                  class="bg-transparent font-bold text-stone-800 focus:outline-none cursor-pointer text-xs"
                >
                  <option value="most-spent" ${customersSortBy === 'most-spent' ? 'selected' : ''}>⚡ Most Spent</option>
                  <option value="least-spent" ${customersSortBy === 'least-spent' ? 'selected' : ''}>📉 Least Spent</option>
                  <option value="newest" ${customersSortBy === 'newest' ? 'selected' : ''}>🆕 Newest</option>
                  <option value="oldest" ${customersSortBy === 'oldest' ? 'selected' : ''}>📅 Oldest</option>
                  <option value="name" ${customersSortBy === 'name' ? 'selected' : ''}>🔤 Name (A-Z)</option>
                </select>
              </div>

              <!-- Search Input -->
              <div class="relative w-full md:max-w-xs">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A89F95]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <input 
                  id="customers-search-input"
                  type="text" 
                  value="${customersSearchQuery || ''}"
                  placeholder="Search by ID, name, phone..." 
                  class="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] placeholder-[#A89F95] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
                />
                ${customersSearchQuery ? `
                  <button id="clear-customers-search-btn" class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A89F95] hover:text-[#2A1F1D]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                  </button>
                ` : ''}
              </div>
            </div>
          ` : ''}

        </div>
      </section>

      <!-- View Content: Advance Bulk Orders or Customer Cards -->
      ${isAdvanceTab ? `
        <!-- Advance Bulk & Event Orders Calendar List -->
        <section class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${advanceOrders.map((order: any) => `
              <div class="bg-white p-5 rounded-3xl border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-[#C86D3B]">#${order.id}</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    order.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }">
                    ${order.status}
                  </span>
                </div>
                <div>
                  <h4 class="font-bold text-sm text-[#2A1F1D]">${order.customerName}</h4>
                  <p class="text-xs text-[#7C7267]">${order.customerPhone}</p>
                </div>
                <div class="text-xs text-[#7C7267] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#F0ECE4]">
                  <p class="font-medium">📦 Event: ${order.event || 'Festival Bulk Order'}</p>
                  <p class="font-medium mt-0.5">📅 Delivery: ${order.deliveryDate || 'Tomorrow'}</p>
                  <p class="font-bold text-[#2A1F1D] mt-1">₹${(order.total || 0).toLocaleString()}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : `
        <!-- Customer Cards Grid with Prominent Customer IDs -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          ${filteredCustomers.length === 0 ? `
            <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-[#F0ECE4] space-y-3">
              <span class="text-4xl">👥</span>
              <p class="text-sm font-bold text-[#2A1F1D]">No customers match your search or filter</p>
              <p class="text-xs text-[#7C7267]">Try clearing search keywords or register a new customer above.</p>
            </div>
          ` : filteredCustomers.map((customer: any) => {
            const isVip = customer.tier === 'VIP' || customer.type === 'VIP';
            const initials = (customer.name || 'C').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
            const totalSpent = Number(customer.totalSpent) || 0;
            const custIdDisplay = (customer.id || 'CUST').toUpperCase();

            return `
              <article 
                class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] hover:shadow-lg hover:border-[#C86D3B]/40 transition-all flex flex-col justify-between space-y-4 group relative"
              >
                <!-- Customer Header with Prominent ID Badge -->
                <div class="flex items-start justify-between">
                  <div class="flex items-center space-x-3 min-w-0">
                    <div class="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#C86D3B] flex items-center justify-center font-extrabold text-sm border border-[#EFE7DE] shrink-0 group-hover:bg-[#FFF7ED] group-hover:border-[#FED7AA] transition-colors">
                      ${initials}
                    </div>
                    <div class="min-w-0 truncate">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="px-2 py-0.5 rounded-lg text-[10px] font-black font-mono bg-stone-100 text-stone-800 border border-stone-200">
                          #${custIdDisplay}
                        </span>
                        ${isVip ? `
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FEF9C3] text-[#A16207] border border-[#FEF08A]">
                            VIP ⭐
                          </span>
                        ` : ''}
                      </div>
                      <h3 class="font-bold text-sm text-[#2A1F1D] truncate mt-0.5 group-hover:text-[#C86D3B] transition-colors">
                        ${customer.name}
                      </h3>
                      <p class="text-xs text-[#7C7267] font-medium">${customer.phone}</p>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    data-edit-customer="${customer.id}"
                    class="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Edit Customer"
                  >
                    ✏️
                  </button>
                </div>

                <!-- Customer Details & Preferences -->
                <div class="bg-[#FAF7F2] p-3 rounded-2xl border border-[#F0ECE4] space-y-1.5 text-xs text-[#7C7267]">
                  <div class="flex items-center justify-between">
                    <span>Loyalty Points:</span>
                    <span class="font-bold text-[#A16207]">⭐ ${customer.loyaltyPoints || 0} pts</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Total Lifetime Spend:</span>
                    <span class="font-extrabold text-[#2A1F1D]">₹${totalSpent.toLocaleString()}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Total Orders:</span>
                    <span class="font-bold text-stone-700">${customer.totalOrders || 1} bills</span>
                  </div>
                  ${customer.notes ? `
                    <div class="pt-1 border-t border-[#EFE7DE] text-[11px] truncate italic text-[#A89F95]">
                      “${customer.notes}”
                    </div>
                  ` : ''}
                </div>

                <!-- Card Action Buttons -->
                <div class="flex items-center gap-2 pt-2 border-t border-[#F7F3EE]">
                  <button 
                    type="button"
                    data-select-for-pos="${customer.id}"
                    class="flex-1 py-2 bg-[#C86D3B] hover:bg-[#B25D2E] text-white text-xs font-bold rounded-2xl shadow-xs transition-all text-center cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ Attach to POS</span>
                  </button>
                  <button 
                    type="button"
                    data-view-customer-profile="${customer.id}"
                    class="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                    title="View Full Profile & Past Bills"
                  >
                    👁️ History
                  </button>
                </div>
              </article>
            `;
          }).join('')}
        </section>
      `}

    </div>
  `;
}

// Customer Profile & Detailed History Modal
export function renderCustomerProfileModal(customer: any, orders: any[] = []) {
  if (!customer) return '';
  const customerOrders = orders.filter((o: any) => o.customerId === customer.id || o.customerName === customer.name);
  const totalSpent = Number(customer.totalSpent) || 0;
  const custIdDisplay = (customer.id || 'CUST').toUpperCase();

  return `
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none" id="customer-profile-modal">
      <div class="bg-white rounded-3xl p-6 sm:p-7 space-y-5 max-w-lg w-full border border-[#F0ECE4] shadow-2xl animate-scaleUp">
        
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#C86D3B] flex items-center justify-center font-extrabold text-base border border-[#FED7AA]">
              ${(customer.name || 'C').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-lg text-xs font-black font-mono bg-stone-100 text-stone-800 border border-stone-200">
                  #${custIdDisplay}
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  ${customer.tier || 'Regular'} Tier
                </span>
              </div>
              <h3 class="text-lg font-bold text-[#2A1F1D] mt-0.5">${customer.name}</h3>
              <p class="text-xs text-[#7C7267]">${customer.phone}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <button 
              type="button" 
              data-edit-profile-customer="${customer.id}"
              class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 cursor-pointer"
            >
              ✏️ Edit
            </button>
            <button id="close-customer-profile-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
            </button>
          </div>
        </div>

        <!-- 3 Quick Stats -->
        <div class="grid grid-cols-3 gap-2.5 text-xs text-center">
          <div class="p-3 bg-[#FAF7F2] rounded-2xl border border-[#F0ECE4]">
            <p class="text-[10px] text-[#7C7267]">Customer ID</p>
            <p class="font-extrabold text-stone-800 font-mono text-xs mt-0.5">#${custIdDisplay}</p>
          </div>
          <div class="p-3 bg-[#FAF7F2] rounded-2xl border border-[#F0ECE4]">
            <p class="text-[10px] text-[#7C7267]">Loyalty Points</p>
            <p class="font-extrabold text-[#A16207] text-sm mt-0.5">⭐ ${customer.loyaltyPoints || 0}</p>
          </div>
          <div class="p-3 bg-[#FAF7F2] rounded-2xl border border-[#F0ECE4]">
            <p class="text-[10px] text-[#7C7267]">Lifetime Spend</p>
            <p class="font-extrabold text-[#2A1F1D] text-sm mt-0.5">₹${totalSpent.toLocaleString()}</p>
          </div>
        </div>

        <!-- Info details -->
        <div class="space-y-2 text-xs bg-[#FAF7F2] p-4 rounded-2xl border border-[#F0ECE4]">
          <div class="flex justify-between py-1 border-b border-[#F0ECE4]">
            <span class="text-[#7C7267]">Customer ID:</span>
            <span class="font-bold font-mono text-[#2A1F1D]">#${custIdDisplay}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-[#F0ECE4]">
            <span class="text-[#7C7267]">Phone:</span>
            <span class="font-bold text-[#2A1F1D]">${customer.phone}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-[#F0ECE4]">
            <span class="text-[#7C7267]">Email:</span>
            <span class="font-semibold text-[#2A1F1D]">${customer.email || 'None'}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-[#F0ECE4]">
            <span class="text-[#7C7267]">Address:</span>
            <span class="font-semibold text-[#2A1F1D] text-right">${customer.address || 'Ahmedabad, Gujarat'}</span>
          </div>
          <div class="flex justify-between py-1">
            <span class="text-[#7C7267]">Special Sweet Preferences:</span>
            <span class="font-semibold text-[#2A1F1D] italic text-right">${customer.notes || 'Prefers Pure Desi Ghee Mithai'}</span>
          </div>
        </div>

        <!-- Recent Order History -->
        <div>
          <h4 class="font-bold text-xs text-[#2A1F1D] mb-2 flex items-center justify-between">
            <span>Recent Counter Bills &amp; Purchases</span>
            <span class="text-[10px] font-normal text-[#7C7267]">${customerOrders.length} orders logged</span>
          </h4>

          ${customerOrders.length === 0 ? `
            <p class="text-xs text-[#7C7267] italic p-3 bg-[#FAF7F2] rounded-2xl text-center border border-[#F0ECE4]">
              No past bills recorded for this customer yet.
            </p>
          ` : `
            <div class="max-h-40 overflow-y-auto space-y-1.5 scrollbar-thin">
              ${customerOrders.slice(0, 8).map((ord: any) => `
                <div class="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#F0ECE4] flex items-center justify-between text-xs">
                  <div>
                    <span class="font-bold text-[#2A1F1D]">Invoice #${ord.id}</span>
                    <span class="text-[10px] text-[#7C7267] ml-2">via ${ord.paymentMethod || 'Cash'}</span>
                    <p class="text-[10px] text-[#A89F95]">${ord.date || ord.createdAt || 'Recent'}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-black text-[#1E7E34]">₹${(ord.total || 0).toLocaleString()}</p>
                    <span class="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800 font-bold">Paid</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Modal Footer Actions -->
        <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-between">
          <button 
            type="button" 
            id="close-customer-profile-bottom-btn" 
            class="px-5 py-2.5 border border-[#E0D7CC] text-[#7C7267] hover:text-[#2A1F1D] rounded-2xl font-bold transition-all hover:bg-[#FAF7F2] text-xs cursor-pointer"
          >
            Close
          </button>

          <button 
            data-select-for-pos="${customer.id}"
            class="px-5 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            + Create New Counter Order
          </button>
        </div>

      </div>
    </div>
  `;
}

// Edit Existing Customer Modal
export function renderEditCustomerModal(customer: any) {
  if (!customer) return '';
  const custIdDisplay = (customer.id || 'CUST').toUpperCase();

  return `
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none" id="edit-customer-modal">
      <div class="bg-white rounded-3xl p-6 sm:p-7 space-y-5 max-w-md w-full border border-[#F0ECE4] shadow-2xl animate-scaleUp">
        
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-lg border border-amber-200">
              ✏️
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2A1F1D]">Edit Customer Profile</h3>
              <p class="text-xs text-[#7C7267]">Update patron details and sweet preferences</p>
            </div>
          </div>
          <button id="close-edit-customer-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>

        <form id="edit-customer-form" data-customer-id="${customer.id}" class="space-y-3.5 text-xs">
          
          <!-- Customer ID (Read-only badge) -->
          <div class="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between">
            <div>
              <span class="block text-[10px] font-bold text-amber-800 uppercase">Customer ID</span>
              <span class="font-mono font-black text-amber-950 text-sm">#${custIdDisplay}</span>
            </div>
            <span class="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
              Verified ID
            </span>
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Full Name *</label>
            <input 
              type="text" 
              name="name" 
              required 
              value="${customer.name || ''}"
              placeholder="e.g. Jignesh Shah" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Phone Number *</label>
            <input 
              type="text" 
              name="phone" 
              required 
              value="${customer.phone || ''}"
              placeholder="+91 98765 43210" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Customer Tier</label>
              <select 
                name="tier" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              >
                <option value="Regular" ${customer.tier === 'Regular' ? 'selected' : ''}>Regular</option>
                <option value="VIP" ${customer.tier === 'VIP' ? 'selected' : ''}>VIP Gold Tier</option>
                <option value="Corporate" ${customer.tier === 'Corporate' ? 'selected' : ''}>Corporate / Institutional</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Loyalty Points</label>
              <input 
                type="number" 
                name="loyaltyPoints" 
                value="${customer.loyaltyPoints || 0}" 
                min="0"
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value="${customer.email || ''}"
              placeholder="e.g. jignesh@gmail.com" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Address</label>
            <input 
              type="text" 
              name="address" 
              value="${customer.address || ''}"
              placeholder="e.g. Navrangpura, Ahmedabad" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Sweet Preferences / Notes</label>
            <input 
              type="text" 
              name="notes" 
              value="${customer.notes || ''}"
              placeholder="e.g. Likes Kaju Katli, Less Sugar, Extra silver vark" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-end gap-3">
            <button 
              type="button" 
              id="cancel-edit-customer-btn" 
              class="px-5 py-2.5 border border-[#E0D7CC] text-[#7C7267] hover:text-[#2A1F1D] rounded-2xl font-bold transition-all hover:bg-[#FAF7F2] cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white rounded-2xl font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Save Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}

// Add New Customer Modal with Prominent Customer ID
export function renderAddCustomerModal(state?: any) {
  const customerCount = (state?.customers?.length || 0);
  const suggestedId = `CUST-${1001 + customerCount}`;

  return `
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none" id="add-customer-modal">
      <div class="bg-white rounded-3xl p-6 sm:p-7 space-y-5 max-w-md w-full border border-[#F0ECE4] shadow-2xl animate-scaleUp">
        
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-[#FFF7ED] text-[#C86D3B] flex items-center justify-center font-bold text-lg border border-[#FED7AA]">
              👤
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2A1F1D]">Add New Customer</h3>
              <p class="text-xs text-[#7C7267]">Register patron with unique Customer ID</p>
            </div>
          </div>
          <button id="close-add-customer-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>

        <form id="add-customer-form" class="space-y-3.5 text-xs">
          
          <!-- Customer ID preview & custom override -->
          <div class="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
            <div class="flex items-center justify-between">
              <label class="block font-bold text-amber-900">Customer ID</label>
              <span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">Auto-Assigned</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-stone-500 text-sm">#</span>
              <input 
                type="text" 
                name="customId" 
                id="add-customer-id-input"
                value="${suggestedId}" 
                placeholder="e.g. CUST-1045"
                class="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-amber-950 focus:outline-none focus:border-[#C86D3B]"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Full Name *</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="e.g. Jignesh Shah" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Phone Number *</label>
            <div class="flex">
              <span class="inline-flex items-center px-3.5 bg-[#FAF7F2] text-[#7C7267] font-bold rounded-l-2xl border border-r-0 border-[#EFE7DE] text-xs">
                +91
              </span>
              <input 
                type="tel" 
                name="phone" 
                required 
                placeholder="98765 43210" 
                pattern="[0-9]{10}"
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-r-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Customer Tier</label>
              <select 
                name="tier" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              >
                <option value="Regular">Regular</option>
                <option value="VIP">VIP Gold Tier</option>
                <option value="Corporate">Corporate / Institutional</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Welcome Loyalty Points</label>
              <input 
                type="number" 
                name="loyaltyPoints" 
                value="50" 
                min="0"
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Email Address (Optional)</label>
            <input 
              type="email" 
              name="email" 
              placeholder="e.g. jignesh@gmail.com" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Address (Optional)</label>
            <input 
              type="text" 
              name="address" 
              placeholder="e.g. Navrangpura, Ahmedabad" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Sweet Preferences / Notes (Optional)</label>
            <input 
              type="text" 
              name="notes" 
              placeholder="e.g. Likes Kaju Katli, Less Sugar, Festival patron" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-end gap-3">
            <button 
              type="button" 
              id="cancel-add-customer-btn" 
              class="px-5 py-2.5 border border-[#E0D7CC] text-[#7C7267] hover:text-[#2A1F1D] rounded-2xl font-bold transition-all hover:bg-[#FAF7F2] cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white rounded-2xl font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Save Customer
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
