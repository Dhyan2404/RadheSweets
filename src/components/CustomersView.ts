// Customers, Loyalty Club & Advance Bulk Orders Component
// Radhe Sweets - Warm Terracotta Confectionery Design System
import { renderCounter } from './Counter';

export function renderCustomersView(state: any) {
  const { customers = [], customersFilterTab = 'all', customersSearchQuery = '', advanceOrders = [] } = state;

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
        <article class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267]">Loyalty Points Pool</span>
            <div class="w-9 h-9 rounded-2xl bg-[#FFFBEB] flex items-center justify-center text-[#D97706]">
              🎁
            </div>
          </div>
          <div class="mt-3">
            <div class="text-2xl sm:text-3xl font-extrabold text-[#D97706] tracking-tight">
              ${renderCounter({
                value: totalLoyaltyPoints,
                suffix: '<span class="text-sm font-normal text-[#7C7267]">pts</span>',
                fontWeight: 800,
                gradientFrom: 'rgba(255, 255, 255, 0.75)'
              })}
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>Redeemable at counter</span>
              <span class="font-bold text-[#D97706]">₹1 / 10 Pts</span>
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
                placeholder="Search by ID, name, phone..." 
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
        <!-- Customer Cards Grid -->
        ${filteredCustomers.length === 0 ? `
          <div class="bg-white rounded-3xl border border-[#F0ECE4] p-12 text-center shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)]">
            <div class="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#F0ECE4] flex items-center justify-center mx-auto text-2xl mb-3 text-[#C86D3B]">
              👥
            </div>
            <h3 class="text-base font-bold text-[#2A1F1D]">No customers match your search</h3>
            <p class="text-xs text-[#7C7267] mt-1 max-w-sm mx-auto">Try clearing your search query or click "Add New Customer" above.</p>
            <button id="reset-customers-filter-btn" class="mt-4 px-4 py-2 bg-[#C86D3B] text-white text-xs font-bold rounded-2xl shadow-sm cursor-pointer">
              Show All Customers
            </button>
          </div>
        ` : `
          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            ${filteredCustomers.map((customer: any) => {
              const isVIP = customer.tier === 'VIP' || customer.type === 'VIP';
              const initials = (customer.name || 'C').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
              const custIdDisplay = (customer.id || 'CUST').toUpperCase();
              const totalSpent = Number(customer.totalSpent) || 0;
              const totalOrders = Number(customer.totalOrders) || 1;
              const avgSpend = Math.round(totalSpent / totalOrders);

              return `
                <div class="bg-white p-5 rounded-3xl border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] hover:shadow-card transition-all flex flex-col justify-between group">
                  <div>
                    <!-- Header with Customer ID, Avatar and Tier -->
                    <div class="flex items-start justify-between">
                      <div class="flex items-center space-x-3.5">
                        <div class="w-12 h-12 rounded-2xl ${isVIP ? 'bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]' : 'bg-[#FAF7F2] text-[#C86D3B] border border-[#F0ECE4]'} font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
                          ${initials}
                        </div>
                        <div class="min-w-0">
                          <div class="flex items-center gap-1.5">
                            <span class="px-2 py-0.5 rounded-lg text-[10px] font-black font-mono bg-stone-100 text-stone-700 border border-stone-200">
                              #${custIdDisplay}
                            </span>
                            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isVIP 
                                ? 'bg-[#FEF9C3] text-[#A16207] border border-[#FDE047]' 
                                : 'bg-[#FAF7F2] text-[#7C7267] border border-[#EFE7DE]'
                            }">
                              ${customer.tier || customer.type || 'Regular'}
                            </span>
                          </div>
                          <h4 class="font-bold text-sm text-[#2A1F1D] group-hover:text-[#C86D3B] transition-colors truncate mt-1">${customer.name}</h4>
                          <p class="text-xs text-[#7C7267] font-medium mt-0.5">${customer.phone}</p>
                        </div>
                      </div>

                      <div class="flex flex-col items-end gap-1 shrink-0">
                        <span class="text-[10px] font-extrabold text-[#A16207] bg-[#FEF9C3]/80 px-2.5 py-1 rounded-full border border-[#FEF08A] shadow-2xs">
                          ⭐ ${customer.loyaltyPoints || 0} Pts
                        </span>
                      </div>
                    </div>

                    <!-- Customer Statistics Grid -->
                    <div class="mt-4 pt-3.5 border-t border-[#F4EFE9] grid grid-cols-3 gap-2 text-xs">
                      <div class="bg-[#FAF7F2] p-2.5 rounded-2xl text-center border border-[#F0ECE4]">
                        <p class="text-[10px] text-[#7C7267] font-medium">Orders</p>
                        <p class="font-extrabold text-sm text-[#2A1F1D] mt-0.5">${totalOrders}</p>
                      </div>
                      <div class="bg-[#FAF7F2] p-2.5 rounded-2xl text-center border border-[#F0ECE4]">
                        <p class="text-[10px] text-[#7C7267] font-medium">Lifetime Spend</p>
                        <p class="font-extrabold text-sm text-[#2A1F1D] mt-0.5">₹${totalSpent.toLocaleString()}</p>
                      </div>
                      <div class="bg-[#FAF7F2] p-2.5 rounded-2xl text-center border border-[#F0ECE4]">
                        <p class="text-[10px] text-[#7C7267] font-medium">Avg Order</p>
                        <p class="font-extrabold text-sm text-[#1E7E34] mt-0.5">₹${avgSpend.toLocaleString()}</p>
                      </div>
                    </div>

                    <!-- Address & Sweet Preferences line -->
                    <div class="mt-3 flex items-center justify-between text-[11px] text-[#7C7267]">
                      <span class="line-clamp-1 max-w-[200px]">📍 ${customer.address || 'Ahmedabad, Gujarat'}</span>
                      <span class="text-[10px] text-stone-500 font-medium">${customer.notes ? `Note: ${customer.notes}` : 'Prefers fresh batch'}</span>
                    </div>
                  </div>

                  <!-- Action Buttons Row -->
                  <div class="mt-4 pt-3 border-t border-[#F4EFE9] flex items-center gap-2">
                    <button 
                      data-select-for-pos="${customer.id}"
                      class="flex-1 py-2 px-3 bg-[#FAF7F2] hover:bg-[#C86D3B] text-[#C86D3B] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#F0ECE4] text-center cursor-pointer"
                    >
                      + New Counter Bill
                    </button>
                    <button 
                      data-view-customer="${customer.id}"
                      class="py-2 px-3.5 bg-[#FAF7F2] hover:bg-[#F0ECE4] text-[#2A1F1D] rounded-xl text-xs font-bold transition-all border border-[#F0ECE4] flex items-center gap-1 cursor-pointer"
                    >
                      <span>👤 Profile</span>
                    </button>
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

// Deprecated no-op for any stale imports
export function renderSettleKhataModal(_customer?: any) {
  return '';
}

// Customer Profile & Detailed History Modal
export function renderCustomerProfileModal(customer: any, orders: any[] = []) {
  if (!customer) return '';
  const customerOrders = orders.filter((o: any) => o.customerId === customer.id || o.customerName === customer.name);
  const totalSpent = Number(customer.totalSpent) || 0;
  const totalOrders = customerOrders.length || customer.totalOrders || 1;
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
          <button id="close-customer-profile-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
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
