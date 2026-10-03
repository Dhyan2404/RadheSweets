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

  const tabs = [
    { id: 'all', label: `All Customers (${customers.length})` },
    { id: 'advance', label: `Advance Bulk Orders (${advanceOrders.length})`, isAdvance: true }
  ];

  const isAdvanceTab = customersFilterTab === 'advance';

  // Compute live customer metrics (all patrons are treated equally)
  const totalCustomerSpend = customers.reduce((sum: number, c: any) => sum + (Number(c.totalSpent) || 0), 0);
  const totalOrdersCount = customers.reduce((sum: number, c: any) => sum + (Number(c.totalOrders) || 0), 0);

  // Top 3 Customers by Total Spend
  const top3Customers = [...customers]
    .sort((a: any, b: any) => (Number(b.totalSpent) || 0) - (Number(a.totalSpent) || 0))
    .slice(0, 3);

  // Filter & Search (All patrons equal - no tier segregation)
  let filteredCustomers = customers.filter((c: any) => {
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
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">Customer Directory &amp; Advance Orders</h1>
            <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#FFF7ED] text-[#C86D3B] border border-[#FED7AA]">
              <span class="w-2 h-2 rounded-full bg-[#1E7E34]"></span>
              Patron CRM Active
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#7C7267] mt-1 font-medium">Manage customer profiles, unique Customer IDs, lifetime spending &amp; bulk advance orders</p>
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



      <!-- TOP 3 CUSTOMERS SPOTLIGHT PODIUM -->
      ${!isAdvanceTab && top3Customers.length > 0 ? `
        <section class="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10 rounded-3xl p-4 sm:p-5 border border-amber-200/90 shadow-subtle space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">🏆</span>
              <div>
                <h3 class="text-sm sm:text-base font-extrabold text-[#2A1F1D]">Top 3 Customers (Highest Spenders)</h3>
                <p class="text-[11px] text-stone-500">Honoring our top sweet lovers and high-frequency buyers</p>
              </div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900 border border-amber-300">
              Patron Spotlight
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
                    <button 
                      type="button" 
                      data-delete-customer="${cust.id}" 
                      class="p-1.5 bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 text-[11px] font-bold rounded-xl transition-all cursor-pointer"
                      title="Delete Customer"
                    >
                      🗑️
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
        <!-- Advance Bulk & Event Orders Management -->
        <section class="space-y-4">
          <!-- Banner & Action Button -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-amber-100 text-[#C86D3B] flex items-center justify-center font-bold text-xl border border-amber-200 shrink-0">
                📦
              </div>
              <div>
                <h3 class="text-sm sm:text-base font-extrabold text-[#2A1F1D]">Advance Bulk &amp; Festival Orders (${advanceOrders.length})</h3>
                <p class="text-xs text-[#7C7267]">Pre-booked wedding catering, corporate festival hampers &amp; scheduled bulk sweet bookings</p>
              </div>
            </div>
            <button 
              type="button" 
              id="open-add-advance-modal-btn" 
              class="px-4 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span class="text-base leading-none font-black">+</span>
              <span>Book Advance Order</span>
            </button>
          </div>

          ${advanceOrders.length === 0 ? `
            <div class="py-16 text-center bg-white rounded-3xl border border-[#F0ECE4] space-y-3">
              <span class="text-4xl">📅</span>
              <p class="text-sm font-bold text-[#2A1F1D]">No advance bulk orders booked yet</p>
              <p class="text-xs text-[#7C7267]">Click "Book Advance Order" to log your first wedding or festival bulk booking.</p>
              <button 
                type="button"
                id="open-add-advance-modal-empty-btn"
                class="px-4 py-2 bg-[#C86D3B] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#B25D2E]"
              >
                + Book Advance Order
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              ${advanceOrders.map((order: any) => {
                const total = Number(order.totalAmount || order.total) || 0;
                const paid = Number(order.depositPaid) || 0;
                const balance = Math.max(0, total - paid);
                const statusColors: any = {
                  'Confirmed': 'bg-blue-100 text-blue-900 border-blue-200',
                  'In Preparation': 'bg-amber-100 text-amber-900 border-amber-200',
                  'Ready': 'bg-emerald-100 text-emerald-900 border-emerald-200',
                  'Completed': 'bg-stone-200 text-stone-800 border-stone-300'
                };
                const statusClass = statusColors[order.status] || 'bg-amber-100 text-amber-900 border-amber-200';
                const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');
                const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(`Namaste ${order.customerName}, regarding your advance order #${order.id} for ${order.eventDate || order.deliveryDate}: Total ₹${total}, Deposit Paid ₹${paid}, Balance Due ₹${balance}. Radhe Sweets`)}` : '#';

                return `
                  <div class="bg-white p-5 rounded-3xl border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] hover:shadow-md transition-all flex flex-col justify-between space-y-3.5">
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="font-mono text-xs font-black text-[#C86D3B] bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                          #${order.id}
                        </span>
                        <button 
                          type="button"
                          data-toggle-advance-status="${order.id}"
                          class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusClass} cursor-pointer transition-all hover:scale-105 active:scale-95"
                          title="Click to toggle status"
                        >
                          ${order.status || 'Confirmed'} ▾
                        </button>
                      </div>

                      <div class="mt-2.5">
                        <h4 class="font-bold text-sm text-[#2A1F1D] truncate">${order.customerName}</h4>
                        <p class="text-xs text-[#7C7267] font-medium">${order.customerPhone}</p>
                      </div>

                      <div class="mt-3 text-xs bg-[#FAF7F2] p-3 rounded-2xl border border-[#F0ECE4] space-y-1.5">
                        <div class="flex items-center justify-between">
                          <span class="text-[#7C7267]">Category:</span>
                          <span class="font-bold text-[#2A1F1D] truncate ml-2">${order.eventType || order.event || 'Bulk Order'}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-[#7C7267]">Delivery / Event:</span>
                          <span class="font-extrabold text-[#C86D3B]">📅 ${order.eventDate || order.deliveryDate || 'Scheduled'}</span>
                        </div>
                        <div class="pt-1.5 border-t border-[#EFE7DE]">
                          <span class="text-[10px] text-stone-400 block mb-0.5">Sweets / Items:</span>
                          <p class="text-xs text-stone-700 font-medium line-clamp-2">${order.itemsSummary || order.items || 'Confectionery Items'}</p>
                        </div>
                      </div>

                      <div class="mt-3 p-2.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
                        <div>
                          <span class="text-[10px] text-stone-400 block">Total</span>
                          <span class="font-black text-[#2A1F1D]">₹${total.toLocaleString()}</span>
                        </div>
                        <div class="text-center">
                          <span class="text-[10px] text-stone-400 block">Deposit</span>
                          <span class="font-bold text-emerald-700">₹${paid.toLocaleString()}</span>
                        </div>
                        <div class="text-right">
                          <span class="text-[10px] text-stone-400 block">Balance Due</span>
                          <span class="font-black ${balance > 0 ? 'text-amber-700' : 'text-stone-400'}">₹${balance.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="pt-2 border-t border-[#F7F3EE] flex items-center gap-2">
                      <button 
                        type="button" 
                        data-edit-advance-order="${order.id}" 
                        class="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-[#2A1F1D] text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                      >
                        ✏️ Edit Booking
                      </button>
                      ${cleanPhone ? `
                        <a 
                          href="${waUrl}" 
                          target="_blank" 
                          rel="noopener"
                          class="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-all cursor-pointer"
                          title="WhatsApp Details"
                        >
                          💬
                        </a>
                      ` : ''}
                      <button 
                        type="button" 
                        data-delete-advance-order="${order.id}" 
                        class="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 transition-all cursor-pointer"
                        title="Delete Advance Order"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </section>
      ` : `
        <!-- Customer Cards Grid with Prominent Customer IDs (All Patrons Equal) -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          ${filteredCustomers.length === 0 ? `
            <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-[#F0ECE4] space-y-3">
              <span class="text-4xl">👥</span>
              <p class="text-sm font-bold text-[#2A1F1D]">No customers match your search or filter</p>
              <p class="text-xs text-[#7C7267]">Try clearing search keywords or register a new customer above.</p>
            </div>
          ` : filteredCustomers.map((customer: any) => {
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
                        <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold ${customer.branchId && customer.branchId !== state?.currentBranchId ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-stone-100 text-stone-600'}">
                          📍 ${(state?.branches || []).find((b: any) => b.id === customer.branchId)?.name || customer.branchName || 'Radhe Sweets'}
                        </span>
                      </div>
                      <h3 class="font-bold text-sm text-[#2A1F1D] truncate mt-0.5 group-hover:text-[#C86D3B] transition-colors">
                        ${customer.name}
                      </h3>
                      <p class="text-xs text-[#7C7267] font-medium">${customer.phone}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-1">
                    <button 
                      type="button" 
                      data-edit-customer="${customer.id}"
                      class="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Edit Customer"
                    >
                      ✏️
                    </button>
                    <button 
                      type="button" 
                      data-delete-customer="${customer.id}"
                      class="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Customer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <!-- Customer Details & Preferences -->
                <div class="bg-[#FAF7F2] p-3 rounded-2xl border border-[#F0ECE4] space-y-1.5 text-xs text-[#7C7267]">
                  <div class="flex items-center justify-between">
                    <span>Customer ID:</span>
                    <span class="font-mono font-bold text-stone-900">#${custIdDisplay}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Total Lifetime Spend:</span>
                    <span class="font-extrabold text-[#2A1F1D]">₹${totalSpent.toLocaleString()}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Total Purchases:</span>
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
                    class="w-full py-2 bg-[#C86D3B] hover:bg-[#B25D2E] text-white text-xs font-bold rounded-2xl shadow-xs transition-all text-center cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ Attach to POS</span>
                  </button>
                  
                </div>
              </article>
            `;
          }).join('')}
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
                  Registered Patron
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
            <p class="text-[10px] text-[#7C7267]">Total Purchases</p>
            <p class="font-extrabold text-[#C86D3B] text-sm mt-0.5">${customer.totalOrders || customerOrders.length || 1} bills</p>
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
          <div class="flex items-center gap-2">
            <button 
              type="button" 
              id="close-customer-profile-bottom-btn" 
              class="px-4 py-2 border border-[#E0D7CC] text-[#7C7267] hover:text-[#2A1F1D] rounded-2xl font-bold transition-all hover:bg-[#FAF7F2] text-xs cursor-pointer"
            >
              Close
            </button>
            <button 
              type="button" 
              data-delete-customer="${customer.id}"
              class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-2xl font-bold transition-all text-xs cursor-pointer flex items-center gap-1"
              title="Delete Customer Profile"
            >
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          </div>

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

          <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-between gap-3">
            <button 
              type="button" 
              data-delete-customer="${customer.id}"
              class="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🗑️</span>
              <span>Delete Customer</span>
            </button>
            <div class="flex items-center gap-2">
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
                id="add-customer-phone-input"
                required 
                placeholder="98765 43210" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-r-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              />
            </div>
            <div id="add-customer-phone-match-card" class="mt-2 hidden"></div>
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
