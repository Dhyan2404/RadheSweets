// Customers, Khata Credit Ledger & Advance Bulk Orders Component

export function renderCustomersView(state) {
  const { customers, customersFilterTab, customersSearchQuery, advanceOrders = [] } = state;

  const tabs = [
    { id: 'all', label: `All (${customers.length})`, filter: () => true },
    { id: 'vip', label: `VIP Members (${customers.filter(c => c.tier === 'VIP').length})`, filter: c => c.tier === 'VIP' },
    { id: 'khata', label: `Khata Credit (${customers.filter(c => (c.khataBalance || 0) > 0).length})`, filter: c => (c.khataBalance || 0) > 0 },
    { id: 'advance', label: `Advance Bulk Orders (${advanceOrders.length})`, isAdvance: true }
  ];

  const isAdvanceTab = customersFilterTab === 'advance';

  const filteredCustomers = customers.filter(c => {
    if (customersFilterTab === 'vip') return c.tier === 'VIP';
    if (customersFilterTab === 'khata') return (c.khataBalance || 0) > 0;
    const matchesSearch = !customersSearchQuery ||
      c.name.toLowerCase().includes(customersSearchQuery.toLowerCase()) ||
      c.phone.includes(customersSearchQuery);
    return matchesSearch;
  });

  return `
    <div class="space-y-6">
      <!-- Header -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-2xl font-bold text-[var(--text-main)] tracking-tight">Customers, Khata & Bulk Orders</h2>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Loyalty Engine
            </span>
          </div>
          <p class="text-xs text-[var(--text-muted)] mt-0.5">Manage VIP tiers, reward points, institutional Khata credit ledgers & bulk advance bookings</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="open-add-customer-modal-btn" class="px-4 py-2 bg-[var(--brand-primary)] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[var(--brand-primary-hover)] transition-all flex items-center gap-1.5 self-start sm:self-auto">
            <span>+</span> Add New Customer
          </button>
        </div>
      </section>

      <!-- Filter Tabs & Search -->
      <section class="space-y-3">
        <!-- Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          ${tabs.map(tab => `
            <button 
              data-customers-tab="${tab.id}"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                customersFilterTab === tab.id 
                  ? 'bg-[var(--brand-primary)] text-white shadow-xs' 
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]'
              }"
            >
              ${tab.label}
            </button>
          `).join('')}
        </div>

        <!-- Search Bar -->
        ${!isAdvanceTab ? `
          <div class="relative w-full sm:max-w-xs">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-light)]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            </span>
            <input 
              id="customers-search-input"
              type="text" 
              value="${customersSearchQuery || ''}"
              placeholder="Search customer by name or phone..." 
              class="w-full pl-9 pr-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>
        ` : ''}
      </section>

      <!-- View Content: Either Advance Bulk Orders or Customer/Khata Cards -->
      ${isAdvanceTab ? `
        <!-- Advance Bulk & Event Orders Calendar List -->
        <section class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${advanceOrders.map(order => `
              <div class="bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-color)] shadow-subtle flex flex-col justify-between space-y-4">
                <div>
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="text-[10px] font-mono font-bold text-[var(--brand-primary)]">${order.id}</span>
                      <h4 class="font-bold text-sm text-[var(--text-main)] mt-0.5">${order.customerName}</h4>
                      <p class="text-xs text-[var(--text-muted)]">${order.customerPhone}</p>
                    </div>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
                      ${order.status}
                    </span>
                  </div>

                  <div class="mt-3 p-3 bg-[var(--bg-subtle)] rounded-xl text-xs space-y-1">
                    <p class="font-semibold text-[var(--brand-primary)]">🎉 ${order.eventType}</p>
                    <p class="text-[var(--text-main)] font-medium">📦 ${order.itemsSummary}</p>
                    <p class="text-[10px] text-[var(--text-light)]">📅 Scheduled Delivery: <strong>${order.eventDate}</strong></p>
                  </div>

                  <!-- Financial Ledger Row -->
                  <div class="mt-3 grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div class="bg-[var(--bg-subtle)] p-2 rounded-xl">
                      <p class="text-[9px] text-[var(--text-light)]">Total Bill</p>
                      <p class="font-bold text-[var(--text-main)]">₹${order.totalAmount.toLocaleString()}</p>
                    </div>
                    <div class="bg-emerald-50 p-2 rounded-xl text-emerald-800">
                      <p class="text-[9px]">Deposit Paid</p>
                      <p class="font-bold">₹${order.depositPaid.toLocaleString()}</p>
                    </div>
                    <div class="bg-rose-50 p-2 rounded-xl text-rose-800">
                      <p class="text-[9px]">Balance Due</p>
                      <p class="font-bold">₹${order.balanceDue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div class="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <span class="text-[10px] text-[var(--text-light)]">Kitchen Prep Scheduled</span>
                  <button class="font-bold text-xs text-[var(--brand-primary)] hover:underline">
                    Manage Order ↗
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : `
        <!-- Customers Cards Grid (including Khata Balances & Loyalty Points) -->
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${filteredCustomers.map(customer => `
            <div class="bg-[var(--bg-surface)] p-4 rounded-2xl border border-[var(--border-color)] shadow-subtle hover:shadow-card transition-all flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-11 h-11 rounded-full bg-[var(--brand-primary-light)] text-[var(--brand-primary)] font-extrabold text-sm flex items-center justify-center shadow-xs">
                      ${customer.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 class="font-bold text-sm text-[var(--text-main)] leading-snug">${customer.name}</h4>
                      <p class="text-xs text-[var(--text-muted)]">${customer.phone}</p>
                    </div>
                  </div>

                  <div class="flex flex-col items-end gap-1">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      customer.tier === 'VIP' 
                        ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                        : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]'
                    }">
                      ${customer.tier || customer.type}
                    </span>
                    <span class="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      ⭐ ${customer.loyaltyPoints || 0} Pts
                    </span>
                  </div>
                </div>

                <!-- Financial Stats & Khata Credit Row -->
                <div class="mt-3.5 pt-3 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-xs">
                  <div class="bg-[var(--bg-subtle)] p-2 rounded-xl text-center">
                    <p class="text-[10px] text-[var(--text-light)]">Total Orders</p>
                    <p class="font-extrabold text-sm text-[var(--text-main)] mt-0.5">${customer.totalOrders || 1}</p>
                  </div>
                  <div class="bg-[var(--bg-subtle)] p-2 rounded-xl text-center">
                    <p class="text-[10px] text-[var(--text-light)]">Total Spent</p>
                    <p class="font-extrabold text-sm text-[var(--brand-primary)] mt-0.5">₹${customer.totalSpent || 500}</p>
                  </div>
                  <div class="p-2 rounded-xl text-center ${customer.khataBalance > 0 ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800'}">
                    <p class="text-[10px]">Khata Balance</p>
                    <p class="font-extrabold text-sm mt-0.5">₹${customer.khataBalance || 0}</p>
                  </div>
                </div>

                <div class="mt-2 flex items-center justify-between text-[11px] text-[var(--text-light)]">
                  <span class="line-clamp-1">📍 ${customer.address || 'Ahmedabad, Gujarat'}</span>
                  <span>Limit: ₹${customer.creditLimit || 5000}</span>
                </div>
              </div>

              <div class="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                <button 
                  data-select-for-pos="${customer.id}"
                  class="flex-1 py-1.5 px-2 bg-[var(--brand-primary-light)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white rounded-lg text-xs font-bold transition-all"
                >
                  + New Order
                </button>
                ${customer.khataBalance > 0 ? `
                  <button 
                    data-settle-khata="${customer.id}"
                    class="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all"
                    title="Record Cash/UPI settlement for Khata credit"
                  >
                    Settle Khata
                  </button>
                ` : `
                  <button 
                    data-view-customer="${customer.id}"
                    class="py-1.5 px-3 bg-[var(--bg-subtle)] text-[var(--text-main)] hover:bg-[var(--border-color)] rounded-lg text-xs font-semibold transition-all"
                  >
                    Profile
                  </button>
                `}
              </div>
            </div>
          `).join('')}
        </section>
      `}
    </div>
  `;
}

// Add New Customer Modal
export function renderAddCustomerModal() {
  return `
    <div class="modal-backdrop" id="add-customer-modal">
      <div class="modal-content p-6 space-y-4 max-w-md">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <h3 class="text-base font-bold text-[var(--text-main)]">Add New Customer</h3>
          <button id="close-add-customer-btn" class="text-[var(--text-light)] hover:text-[var(--text-main)] p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </button>
        </div>

        <form id="add-customer-form" class="space-y-3.5 text-xs">
          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Full Name *</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="e.g. Jignesh Shah" 
              class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none"
            />
          </div>

          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Phone Number *</label>
            <div class="flex">
              <span class="inline-flex items-center px-3 bg-[var(--border-color)]/60 text-[var(--text-muted)] font-bold rounded-l-xl border border-r-0 border-[var(--border-color)] text-xs">
                +91
              </span>
              <input 
                type="tel" 
                name="phone" 
                required 
                placeholder="98765 43210" 
                pattern="[0-9]{10}"
                class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-r-xl text-xs text-[var(--text-main)] focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Loyalty Tier & Khata</label>
            <select 
              name="tier" 
              class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none"
            >
              <option value="Regular">Regular Customer</option>
              <option value="VIP">VIP Gold Tier</option>
              <option value="Corporate">Corporate / Khata Account</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Credit Limit (₹)</label>
            <input 
              type="number" 
              name="creditLimit" 
              value="5000" 
              class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none font-bold"
            />
          </div>

          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Address</label>
            <input 
              type="text" 
              name="address" 
              placeholder="e.g. Navrangpura, Ahmedabad" 
              class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none"
            />
          </div>

          <div class="pt-2">
            <button 
              type="submit" 
              class="w-full py-2.5 bg-[var(--brand-primary)] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[var(--brand-primary-hover)] transition-all"
            >
              Save Customer & Issue Points
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
