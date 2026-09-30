// Customers, Khata Credit Ledger & Advance Bulk Orders Component
// Radhe Sweets - Warm Terracotta Confectionery Design System

export function renderCustomersView(state: any) {
  const { customers = [], customersFilterTab = 'all', customersSearchQuery = '', advanceOrders = [] } = state;

  // Filter tabs
  const khataCustomers = customers.filter((c: any) => (Number(c.khataBalance) || 0) > 0);
  const vipCustomers = customers.filter((c: any) => c.tier === 'VIP' || c.type === 'VIP');
  
  const tabs = [
    { id: 'all', label: `All Customers (${customers.length})` },
    { id: 'khata', label: `Khata Credit / Udhar (${khataCustomers.length})`, isKhata: true },
    { id: 'vip', label: `VIP Members (${vipCustomers.length})` },
    { id: 'advance', label: `Advance Bulk Orders (${advanceOrders.length})`, isAdvance: true }
  ];

  const isAdvanceTab = customersFilterTab === 'advance';

  // Compute live ledger KPIs
  const totalKhataOutstanding = customers.reduce((sum: number, c: any) => sum + (Number(c.khataBalance) || 0), 0);
  const totalLoyaltyPoints = customers.reduce((sum: number, c: any) => sum + (Number(c.loyaltyPoints) || 0), 0);
  const totalCustomerSpend = customers.reduce((sum: number, c: any) => sum + (Number(c.totalSpent) || 0), 0);

  // Filter & Search
  let filteredCustomers = customers.filter((c: any) => {
    if (customersFilterTab === 'vip') return c.tier === 'VIP' || c.type === 'VIP';
    if (customersFilterTab === 'khata') return (Number(c.khataBalance) || 0) > 0;
    
    if (!customersSearchQuery) return true;
    const q = customersSearchQuery.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q))
    );
  });

  // Sort: Khata tab sorts highest due first
  if (customersFilterTab === 'khata') {
    filteredCustomers.sort((a: any, b: any) => (Number(b.khataBalance) || 0) - (Number(a.khataBalance) || 0));
  }

  return `
    <div class="space-y-6 animate-fadeIn select-none">
      
      <!-- Top Title Bar with Action Buttons -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">Customer Khata & Loyalty</h1>
            <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#FFF7ED] text-[#C86D3B] border border-[#FED7AA]">
              <span class="w-2 h-2 rounded-full bg-[#C86D3B] animate-pulse"></span>
              Udhar Ledger Active
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#7C7267] mt-1 font-medium">Manage counter credit (Udhar Khata), partial payment settlements, VIP points & bulk orders</p>
        </div>

        <div class="flex items-center gap-2.5">
          <button 
            id="open-add-customer-modal-btn" 
            class="px-4 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span class="text-base leading-none">+</span>
            <span>Add New Customer</span>
          </button>
        </div>
      </section>

      <!-- 4 Confectionery Customer & Khata KPI Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <!-- CARD 1: Total Khata Credit Outstanding -->
        <article 
          data-customers-tab="khata"
          class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between cursor-pointer hover:border-[#C86D3B] hover:shadow-md transition-all group"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267] group-hover:text-[#2A1F1D]">Khata Balance (Udhar)</span>
            <div class="w-9 h-9 rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <div class="flex items-baseline gap-2">
              <p class="text-2xl sm:text-3xl font-extrabold text-[#DC2626] tracking-tight">₹${totalKhataOutstanding.toLocaleString()}</p>
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>${khataCustomers.length} Accounts with dues</span>
              <span class="font-bold text-[#C86D3B] group-hover:underline">Settle Payments &rarr;</span>
            </div>
          </div>
        </article>

        <!-- CARD 2: Total Registered Customers -->
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
            <p class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">${customers.length} <span class="text-sm font-normal text-[#7C7267]">patrons</span></p>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>Active in Ahmedabad</span>
              <span class="font-bold text-[#1E7E34]">+12% this month</span>
            </div>
          </div>
        </article>

        <!-- CARD 3: VIP Loyalty Club -->
        <article 
          data-customers-tab="vip"
          class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between cursor-pointer hover:border-[#DDA15E] hover:shadow-md transition-all group"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267] group-hover:text-[#2A1F1D]">VIP Loyalty Club</span>
            <div class="w-9 h-9 rounded-2xl bg-[#FEF9C3] flex items-center justify-center text-[#A16207]">
              ⭐
            </div>
          </div>
          <div class="mt-3">
            <p class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">${vipCustomers.length} <span class="text-sm font-normal text-[#7C7267]">Gold Tier</span></p>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>${totalLoyaltyPoints.toLocaleString()} Total Pts</span>
              <span class="font-bold text-[#A16207]">Privilege Rewards</span>
            </div>
          </div>
        </article>

        <!-- CARD 4: Total Counter Purchases -->
        <article class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267]">Customer Lifetime Spend</span>
            <div class="w-9 h-9 rounded-2xl bg-[#E6F4EA] flex items-center justify-center text-[#1E7E34]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <p class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">₹${totalCustomerSpend.toLocaleString()}</p>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>Total orders logged</span>
              <span class="font-bold text-[#1E7E34]">High Retention</span>
            </div>
          </div>
        </article>

      </section>

      <!-- Filter Tabs & Search Bar -->
      <section class="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <!-- Category Filter Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            ${tabs.map(tab => {
              const isActive = (customersFilterTab || 'all') === tab.id;
              return `
                <button 
                  data-customers-tab="${tab.id}"
                  class="px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-[#C86D3B] text-white shadow-xs' 
                      : 'bg-[#FAF7F2] text-[#7C7267] hover:text-[#2A1F1D] hover:bg-[#F0ECE4] border border-[#EFE7DE]'
                  }"
                >
                  ${tab.label}
                  ${tab.id === 'khata' && khataCustomers.length > 0 ? `
                    <span class="ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700 font-extrabold'}">
                      ₹${totalKhataOutstanding.toLocaleString()}
                    </span>
                  ` : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Search Input -->
          ${!isAdvanceTab ? `
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
                placeholder="Search by customer name, phone..." 
                class="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] placeholder-[#A89F95] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              />
              ${customersSearchQuery ? `
                <button id="clear-customers-search-btn" class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A89F95] hover:text-[#2A1F1D]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                </button>
              ` : ''}
            </div>
          ` : ''}

        </div>
      </section>

      <!-- View Content: Either Advance Bulk Orders or Customer Cards -->
      ${isAdvanceTab ? `
        <!-- Advance Bulk & Event Orders Calendar List -->
        <section class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${advanceOrders.map((order: any) => `
              <div class="bg-white p-5 rounded-3xl border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between space-y-4">
                <div>
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="text-[10px] font-mono font-bold text-[#C86D3B]">${order.id}</span>
                      <h4 class="font-bold text-sm text-[#2A1F1D] mt-0.5">${order.customerName}</h4>
                      <p class="text-xs text-[#7C7267]">${order.customerPhone}</p>
                    </div>
                    <span class="text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      order.status === 'Completed' 
                        ? 'bg-[#E6F4EA] text-[#1E7E34] border border-[#CDE9D3]' 
                        : 'bg-[#FFF7ED] text-[#C86D3B] border border-[#FED7AA]'
                    }">
                      ${order.status}
                    </span>
                  </div>

                  <div class="mt-3 p-3.5 bg-[#FAF7F2] rounded-2xl text-xs space-y-1.5 border border-[#F0ECE4]">
                    <p class="font-bold text-[#C86D3B]">🎉 ${order.eventType}</p>
                    <p class="text-[#2A1F1D] font-medium">📦 ${order.itemsSummary}</p>
                    <p class="text-[11px] text-[#7C7267]">📅 Scheduled Delivery: <strong class="text-[#2A1F1D]">${order.eventDate}</strong></p>
                  </div>

                  <!-- Financial Ledger Row -->
                  <div class="mt-3.5 grid grid-cols-3 gap-2 text-center text-xs">
                    <div class="bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#F0ECE4]">
                      <p class="text-[10px] text-[#7C7267]">Total Bill</p>
                      <p class="font-extrabold text-[#2A1F1D] mt-0.5">₹${order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div class="bg-[#E6F4EA] p-2.5 rounded-2xl text-[#1E7E34] border border-[#CDE9D3]">
                      <p class="text-[10px]">Deposit Paid</p>
                      <p class="font-extrabold mt-0.5">₹${order.depositPaid.toLocaleString()}</p>
                    </div>
                    <div class="bg-[#FEF2F2] p-2.5 rounded-2xl text-[#DC2626] border border-[#FECACA]">
                      <p class="text-[10px]">Balance Due</p>
                      <p class="font-extrabold mt-0.5">₹${order.balanceDue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-between text-xs">
                  <span class="text-[11px] text-[#7C7267]">Kitchen Halwai Prep</span>
                  <button class="font-bold text-xs text-[#C86D3B] hover:text-[#B25D2E] transition-colors">
                    Manage Order ↗
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : `
        <!-- Customer Cards Grid -->
        ${filteredCustomers.length === 0 ? `
          <div class="bg-white rounded-3xl border border-[#F0ECE4] p-12 text-center shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)]">
            <div class="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#F0ECE4] flex items-center justify-center mx-auto text-2xl mb-3 text-[#C86D3B]">
              👥
            </div>
            <h3 class="text-base font-bold text-[#2A1F1D]">No customers match your criteria</h3>
            <p class="text-xs text-[#7C7267] mt-1 max-w-sm mx-auto">Try clearing your search query or add a new customer to the directory.</p>
            <button id="reset-customers-filter-btn" class="mt-4 px-4 py-2 bg-[#C86D3B] text-white text-xs font-bold rounded-2xl shadow-sm">
              Show All Customers
            </button>
          </div>
        ` : `
          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            ${filteredCustomers.map((customer: any) => {
              const khataDue = Number(customer.khataBalance) || 0;
              const hasKhata = khataDue > 0;
              const isVIP = customer.tier === 'VIP' || customer.type === 'VIP';
              const initials = customer.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

              return `
                <div class="bg-white p-5 rounded-3xl border ${hasKhata ? 'border-[#FCA5A5]/60 ring-1 ring-[#FCA5A5]/20' : 'border-[#F0ECE4]'} shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] hover:shadow-card transition-all flex flex-col justify-between group">
                  <div>
                    <!-- Header with Avatar and Tier -->
                    <div class="flex items-start justify-between">
                      <div class="flex items-center space-x-3.5">
                        <div class="w-12 h-12 rounded-2xl ${isVIP ? 'bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]' : 'bg-[#FAF7F2] text-[#C86D3B] border border-[#F0ECE4]'} font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
                          ${initials}
                        </div>
                        <div class="min-w-0">
                          <h4 class="font-bold text-sm text-[#2A1F1D] group-hover:text-[#C86D3B] transition-colors truncate">${customer.name}</h4>
                          <p class="text-xs text-[#7C7267] font-medium mt-0.5">${customer.phone}</p>
                        </div>
                      </div>

                      <div class="flex flex-col items-end gap-1 shrink-0">
                        <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isVIP 
                            ? 'bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]' 
                            : 'bg-[#FAF7F2] text-[#7C7267] border border-[#EFE7DE]'
                        }">
                          ${customer.tier || customer.type || 'Regular'}
                        </span>
                        <span class="text-[10px] font-extrabold text-[#A16207] bg-[#FEF9C3]/60 px-2 py-0.5 rounded-full border border-[#FEF08A]">
                          ⭐ ${customer.loyaltyPoints || 0} Pts
                        </span>
                      </div>
                    </div>

                    <!-- Financial Stats & Khata Credit Row -->
                    <div class="mt-4 pt-3.5 border-t border-[#F4EFE9] grid grid-cols-3 gap-2 text-xs">
                      <div class="bg-[#FAF7F2] p-2.5 rounded-2xl text-center border border-[#F0ECE4]">
                        <p class="text-[10px] text-[#7C7267]">Orders</p>
                        <p class="font-extrabold text-sm text-[#2A1F1D] mt-0.5">${customer.totalOrders || 1}</p>
                      </div>
                      <div class="bg-[#FAF7F2] p-2.5 rounded-2xl text-center border border-[#F0ECE4]">
                        <p class="text-[10px] text-[#7C7267]">Total Spent</p>
                        <p class="font-extrabold text-sm text-[#2A1F1D] mt-0.5">₹${(customer.totalSpent || 500).toLocaleString()}</p>
                      </div>
                      <div class="p-2.5 rounded-2xl text-center ${
                        hasKhata 
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]' 
                          : 'bg-[#E6F4EA] text-[#1E7E34] border border-[#CDE9D3]'
                      }">
                        <p class="text-[10px] font-bold">${hasKhata ? 'Khata Due' : 'Khata Clear'}</p>
                        <p class="font-extrabold text-sm mt-0.5">₹${khataDue.toLocaleString()}</p>
                      </div>
                    </div>

                    <!-- Address & Credit Limit line -->
                    <div class="mt-2.5 flex items-center justify-between text-[11px] text-[#7C7267]">
                      <span class="line-clamp-1 max-w-[170px]">📍 ${customer.address || 'Ahmedabad, Gujarat'}</span>
                      <span class="font-medium text-[#2A1F1D]">Limit: ₹${(customer.creditLimit || 5000).toLocaleString()}</span>
                    </div>

                    <!-- Highlighted Khata Warning Banner if Balance is due -->
                    ${hasKhata ? `
                      <div class="mt-3 px-3 py-2 bg-[#FFF7ED] rounded-xl border border-[#FED7AA] flex items-center justify-between text-xs">
                        <div class="flex items-center gap-1.5 text-[#C86D3B]">
                          <span class="text-sm">⚠️</span>
                          <span class="font-bold text-[11px]">Due ₹${khataDue.toLocaleString()}</span>
                        </div>
                        <span class="text-[10px] text-[#7C7267]">Partial pay available</span>
                      </div>
                    ` : ''}
                  </div>

                  <!-- Action Buttons Row -->
                  <div class="mt-4 pt-3 border-t border-[#F4EFE9] flex items-center gap-2">
                    <button 
                      data-select-for-pos="${customer.id}"
                      class="flex-1 py-2 px-3 bg-[#FAF7F2] hover:bg-[#C86D3B] text-[#C86D3B] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#F0ECE4] text-center"
                    >
                      + New Order
                    </button>

                    ${hasKhata ? `
                      <button 
                        data-settle-khata="${customer.id}"
                        class="py-2 px-3.5 bg-[#1E7E34] hover:bg-[#166527] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        title="Settle full or partial payment amount"
                      >
                        <span>💵</span>
                        <span>Settle Money</span>
                      </button>
                    ` : `
                      <button 
                        data-view-customer="${customer.id}"
                        class="py-2 px-3 bg-[#FAF7F2] hover:bg-[#F0ECE4] text-[#2A1F1D] rounded-xl text-xs font-bold transition-all border border-[#F0ECE4]"
                      >
                        Profile & Ledger
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </section>
        `}
      `}
    </div>
  `;
}

// Partial & Custom Amount Settle Khata Modal
// Allows settling any partial amount (e.g. ₹500, ₹1000) or full balance
export function renderSettleKhataModal(customer: any) {
  if (!customer) return '';
  const currentDue = Number(customer.khataBalance) || 0;
  
  // Suggested quick partial amounts
  const chips: number[] = [];
  if (currentDue > 500) chips.push(500);
  if (currentDue > 1000) chips.push(1000);
  if (currentDue > 2000) chips.push(2000);
  chips.push(currentDue); // Full settlement

  return `
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none" id="settle-khata-modal">
      <div class="bg-white rounded-3xl p-6 sm:p-7 space-y-5 max-w-md w-full border border-[#F0ECE4] shadow-2xl animate-scaleUp">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#1E7E34] flex items-center justify-center font-bold text-lg">
              💵
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2A1F1D]">Settle Khata Payment</h3>
              <p class="text-xs text-[#7C7267]">Receive partial or full balance payment</p>
            </div>
          </div>
          <button id="close-settle-khata-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>

        <!-- Customer Summary Strip -->
        <div class="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#F0ECE4] flex items-center justify-between">
          <div>
            <h4 class="font-bold text-sm text-[#2A1F1D]">${customer.name}</h4>
            <p class="text-xs text-[#7C7267] font-medium">${customer.phone}</p>
          </div>
          <div class="text-right">
            <span class="text-[10px] font-bold text-[#7C7267]">Total Due Balance</span>
            <p class="text-base font-black text-[#DC2626]" id="settle-current-due-display">₹${currentDue.toLocaleString()}</p>
          </div>
        </div>

        <!-- Form for Settlement -->
        <form id="settle-khata-form" class="space-y-4 text-xs" data-customer-id="${customer.id}" data-current-due="${currentDue}">
          
          <!-- Amount Input Section -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="font-bold text-[#2A1F1D]">Amount to Settle (₹) *</label>
              <span class="text-[11px] text-[#7C7267]">Enter any partial amount</span>
            </div>

            <!-- Quick Chips -->
            <div class="flex flex-wrap gap-2 mb-2.5">
              ${chips.map(amt => `
                <button 
                  type="button" 
                  data-quick-settle-amt="${amt}"
                  class="px-3 py-1.5 rounded-xl font-bold text-xs bg-[#FAF7F2] hover:bg-[#C86D3B] hover:text-white border border-[#EFE7DE] text-[#2A1F1D] transition-all"
                >
                  ${amt === currentDue ? `Full (₹${amt.toLocaleString()})` : `₹${amt.toLocaleString()}`}
                </button>
              `).join('')}
            </div>

            <!-- Numeric Input with Rupee Prefix -->
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none font-bold text-sm text-[#2A1F1D]">
                ₹
              </span>
              <input 
                type="number" 
                id="settle-amount-input"
                name="amount" 
                required 
                min="1" 
                max="${currentDue * 2}"
                value="${Math.min(currentDue, 1000)}" 
                placeholder="Enter amount..."
                class="w-full pl-8 pr-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-base font-extrabold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              />
            </div>

            <!-- Dynamic Remaining Balance Calculator -->
            <div class="mt-2 flex items-center justify-between text-xs px-1">
              <span class="text-[#7C7267]">Remaining Due After Payment:</span>
              <span class="font-extrabold text-[#1E7E34]" id="settle-remaining-calc">
                ₹${Math.max(0, currentDue - Math.min(currentDue, 1000)).toLocaleString()}
              </span>
            </div>
          </div>

          <!-- Payment Mode Selection -->
          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Payment Method *</label>
            <div class="grid grid-cols-2 gap-2">
              <label class="flex items-center gap-2.5 p-3 rounded-2xl border border-[#EFE7DE] bg-[#FAF7F2] cursor-pointer hover:border-[#C86D3B] transition-all has-[:checked]:border-[#C86D3B] has-[:checked]:bg-[#FFF7ED]">
                <input type="radio" name="paymentMode" value="Cash" checked class="text-[#C86D3B] focus:ring-[#C86D3B]" />
                <div>
                  <p class="font-bold text-xs text-[#2A1F1D]">💵 Cash</p>
                  <p class="text-[10px] text-[#7C7267]">Received at counter</p>
                </div>
              </label>

              <label class="flex items-center gap-2.5 p-3 rounded-2xl border border-[#EFE7DE] bg-[#FAF7F2] cursor-pointer hover:border-[#C86D3B] transition-all has-[:checked]:border-[#C86D3B] has-[:checked]:bg-[#FFF7ED]">
                <input type="radio" name="paymentMode" value="UPI" class="text-[#C86D3B] focus:ring-[#C86D3B]" />
                <div>
                  <p class="font-bold text-xs text-[#2A1F1D]">📱 UPI / QR</p>
                  <p class="text-[10px] text-[#7C7267]">GPay / PhonePe</p>
                </div>
              </label>

              <label class="flex items-center gap-2.5 p-3 rounded-2xl border border-[#EFE7DE] bg-[#FAF7F2] cursor-pointer hover:border-[#C86D3B] transition-all has-[:checked]:border-[#C86D3B] has-[:checked]:bg-[#FFF7ED]">
                <input type="radio" name="paymentMode" value="Card" class="text-[#C86D3B] focus:ring-[#C86D3B]" />
                <div>
                  <p class="font-bold text-xs text-[#2A1F1D]">💳 Card / POS</p>
                  <p class="text-[10px] text-[#7C7267]">Debit or Credit</p>
                </div>
              </label>

              <label class="flex items-center gap-2.5 p-3 rounded-2xl border border-[#EFE7DE] bg-[#FAF7F2] cursor-pointer hover:border-[#C86D3B] transition-all has-[:checked]:border-[#C86D3B] has-[:checked]:bg-[#FFF7ED]">
                <input type="radio" name="paymentMode" value="Bank Transfer" class="text-[#C86D3B] focus:ring-[#C86D3B]" />
                <div>
                  <p class="font-bold text-xs text-[#2A1F1D]">🏦 Bank / Cheque</p>
                  <p class="text-[10px] text-[#7C7267]">Direct deposit</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Note / Reference Input -->
          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Note or Transaction Ref (Optional)</label>
            <input 
              type="text" 
              name="note" 
              placeholder="e.g. Received at evening counter shift, UPI Ref #7482" 
              class="w-full px-4 py-2 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <!-- Actions -->
          <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-end gap-3">
            <button 
              type="button" 
              id="cancel-settle-khata-btn" 
              class="px-5 py-2.5 border border-[#E0D7CC] text-[#7C7267] hover:text-[#2A1F1D] rounded-2xl font-bold transition-all hover:bg-[#FAF7F2]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 bg-[#1E7E34] hover:bg-[#166527] text-white rounded-2xl font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <span>✓</span>
              <span id="settle-submit-btn-text">Confirm Settlement</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}

// Customer Profile & Detailed Ledger Modal
export function renderCustomerProfileModal(customer: any, orders: any[] = []) {
  if (!customer) return '';
  const customerOrders = orders.filter((o: any) => o.customerId === customer.id || o.customerName === customer.name);
  const khataDue = Number(customer.khataBalance) || 0;
  const history = customer.khataHistory || [];

  return `
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none" id="customer-profile-modal">
      <div class="bg-white rounded-3xl p-6 sm:p-7 space-y-5 max-w-lg w-full border border-[#F0ECE4] shadow-2xl animate-scaleUp">
        
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-2xl bg-[#FFF7ED] text-[#C86D3B] flex items-center justify-center font-extrabold text-base border border-[#FED7AA]">
              ${customer.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2A1F1D]">${customer.name}</h3>
              <p class="text-xs text-[#7C7267]">${customer.phone} • ${customer.tier || 'Regular'} Tier</p>
            </div>
          </div>
          <button id="close-customer-profile-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>

        <!-- 3 Quick Stats -->
        <div class="grid grid-cols-3 gap-2.5 text-xs text-center">
          <div class="p-3 bg-[#FAF7F2] rounded-2xl border border-[#F0ECE4]">
            <p class="text-[10px] text-[#7C7267]">Loyalty Points</p>
            <p class="font-extrabold text-[#A16207] text-sm mt-0.5">⭐ ${customer.loyaltyPoints || 0}</p>
          </div>
          <div class="p-3 bg-[#FAF7F2] rounded-2xl border border-[#F0ECE4]">
            <p class="text-[10px] text-[#7C7267]">Lifetime Spend</p>
            <p class="font-extrabold text-[#2A1F1D] text-sm mt-0.5">₹${(customer.totalSpent || 0).toLocaleString()}</p>
          </div>
          <div class="p-3 rounded-2xl border ${khataDue > 0 ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' : 'bg-[#E6F4EA] text-[#1E7E34] border-[#CDE9D3]'}">
            <p class="text-[10px]">Khata Balance</p>
            <p class="font-extrabold text-sm mt-0.5">₹${khataDue.toLocaleString()}</p>
          </div>
        </div>

        <!-- Info details -->
        <div class="space-y-2 text-xs bg-[#FAF7F2] p-4 rounded-2xl border border-[#F0ECE4]">
          <div class="flex justify-between py-1 border-b border-[#F0ECE4]">
            <span class="text-[#7C7267]">Address:</span>
            <span class="font-semibold text-[#2A1F1D] text-right">${customer.address || 'Ahmedabad, Gujarat'}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-[#F0ECE4]">
            <span class="text-[#7C7267]">Credit Limit:</span>
            <span class="font-semibold text-[#2A1F1D]">₹${(customer.creditLimit || 5000).toLocaleString()}</span>
          </div>
          <div class="flex justify-between py-1">
            <span class="text-[#7C7267]">Special Notes:</span>
            <span class="font-semibold text-[#2A1F1D] italic text-right">${customer.notes || 'Preferred sweet lover'}</span>
          </div>
        </div>

        <!-- Payment Settlement History Ledger -->
        <div>
          <h4 class="font-bold text-xs text-[#2A1F1D] mb-2 flex items-center justify-between">
            <span>Recent Payment Settlement Ledger</span>
            <span class="text-[10px] font-normal text-[#7C7267]">${history.length} records</span>
          </h4>

          ${history.length === 0 ? `
            <p class="text-xs text-[#7C7267] italic p-3 bg-[#FAF7F2] rounded-2xl text-center border border-[#F0ECE4]">
              No past partial settlements recorded yet.
            </p>
          ` : `
            <div class="max-h-36 overflow-y-auto space-y-1.5 scrollbar-thin">
              ${history.map((h: any) => `
                <div class="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#F0ECE4] flex items-center justify-between text-xs">
                  <div>
                    <span class="font-bold text-[#1E7E34]">Settled ₹${h.amount.toLocaleString()}</span>
                    <span class="text-[10px] text-[#7C7267] ml-2">via ${h.paymentMode}</span>
                    <p class="text-[10px] text-[#A89F95]">${h.date} ${h.note ? '• ' + h.note : ''}</p>
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] text-[#7C7267]">Remaining</span>
                    <p class="font-bold text-[#2A1F1D]">₹${h.remainingBalance.toLocaleString()}</p>
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
            class="px-5 py-2.5 border border-[#E0D7CC] text-[#7C7267] hover:text-[#2A1F1D] rounded-2xl font-bold transition-all hover:bg-[#FAF7F2] text-xs"
          >
            Close
          </button>

          <div class="flex items-center gap-2">
            ${khataDue > 0 ? `
              <button 
                data-settle-khata="${customer.id}"
                class="px-5 py-2.5 bg-[#1E7E34] hover:bg-[#166527] text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>💵</span>
                <span>Settle ₹${khataDue.toLocaleString()}</span>
              </button>
            ` : ''}
            <button 
              data-select-for-pos="${customer.id}"
              class="px-5 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white rounded-2xl text-xs font-bold transition-all shadow-sm"
            >
              + Create Order
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

// Add New Customer Modal
export function renderAddCustomerModal() {
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
              <p class="text-xs text-[#7C7267]">Register for counter loyalty and credit ledger</p>
            </div>
          </div>
          <button id="close-add-customer-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>

        <form id="add-customer-form" class="space-y-3.5 text-xs">
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
                <option value="Corporate">Corporate / Khata</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Credit Limit (₹)</label>
              <input 
                type="number" 
                name="creditLimit" 
                value="5000" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Initial Khata Due (₹)</label>
            <input 
              type="number" 
              name="khataBalance" 
              value="0" 
              min="0"
              placeholder="0"
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Address</label>
            <input 
              type="text" 
              name="address" 
              placeholder="e.g. Navrangpura, Ahmedabad" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            />
          </div>

          <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-end gap-3">
            <button 
              type="button" 
              id="cancel-add-customer-btn" 
              class="px-5 py-2.5 border border-[#E0D7CC] text-[#7C7267] hover:text-[#2A1F1D] rounded-2xl font-bold transition-all hover:bg-[#FAF7F2]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white rounded-2xl font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
