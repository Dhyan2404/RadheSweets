// Orders Management View Component
// Real-world Sweet Shop Counter & Festival Pre-Order Management

export function renderOrdersView(state: any) {
  const { orders = [], ordersFilterTab = 'all', ordersSearchQuery = '' } = state;

  const completedCount = orders.filter((o: any) => o.status === 'Completed').length;
  const advanceCount = orders.filter((o: any) => o.status === 'Advance Booking').length;
  const kitchenCount = orders.filter((o: any) => o.status === 'Kitchen Packing').length;

  const tabs = [
    { id: 'all', label: `All Orders (${orders.length})`, filter: () => true },
    { id: 'completed', label: `Completed (Counter Sale) (${completedCount})`, filter: (o: any) => o.status === 'Completed' },
    { id: 'advance', label: `Advance Bookings (${advanceCount})`, filter: (o: any) => o.status === 'Advance Booking' },
    { id: 'kitchen', label: `Kitchen Packing (${kitchenCount})`, filter: (o: any) => o.status === 'Kitchen Packing' }
  ];

  // Filter orders
  const activeTabConfig = tabs.find(t => t.id === ordersFilterTab) || tabs[0];
  const filteredOrders = orders.filter((order: any) => {
    const matchesTab = activeTabConfig.filter(order);
    const matchesSearch = !ordersSearchQuery || 
      order.id.toLowerCase().includes(ordersSearchQuery.toLowerCase()) ||
      (order.customerName && order.customerName.toLowerCase().includes(ordersSearchQuery.toLowerCase())) ||
      (order.customerPhone && order.customerPhone.includes(ordersSearchQuery));
    return matchesTab && matchesSearch;
  });

  return `
    <div class="space-y-6">
      <!-- Orders Header -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-[var(--text-main)] tracking-tight">Shop Orders</h2>
          <p class="text-xs text-[var(--text-muted)] mt-0.5">Real-time counter handover sales, festival advance bookings & kitchen packing</p>
        </div>

        <button id="orders-new-sale-btn" class="px-4 py-2 bg-[var(--brand-primary)] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[var(--brand-primary-hover)] transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95">
          <span>+</span> New Counter Sale
        </button>
      </section>

      <!-- Filter Tabs & Search Controls -->
      <section class="space-y-3">
        <!-- Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          ${tabs.map(tab => `
            <button 
              data-orders-tab="${tab.id}"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                ordersFilterTab === tab.id 
                  ? 'bg-[var(--brand-primary)] text-white shadow-xs' 
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]'
              }"
            >
              ${tab.label}
            </button>
          `).join('')}
        </div>

        <!-- Search Bar and Date Filter -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:max-w-xs">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-light)]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            </span>
            <input 
              id="orders-search-input"
              type="text" 
              value="${ordersSearchQuery || ''}"
              placeholder="Search by order ID, customer or phone..." 
              class="w-full pl-9 pr-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div class="bg-[var(--bg-surface)] border border-[var(--border-color)] px-3 py-1.5 rounded-xl text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <span>📅</span>
              <span>Today (25 Sep 2026)</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Orders Data Table -->
      <section class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] shadow-subtle overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr class="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] text-[var(--text-muted)] font-semibold text-[11px] uppercase tracking-wider">
                <th class="py-3.5 px-5">Order ID</th>
                <th class="py-3.5 px-4">Date & Time</th>
                <th class="py-3.5 px-4">Customer</th>
                <th class="py-3.5 px-4 text-center">Items</th>
                <th class="py-3.5 px-4">Total</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]/70">
              ${filteredOrders.length > 0 ? filteredOrders.map((order: any) => `
                <tr class="hover:bg-[var(--bg-highlight)]/40 transition-colors">
                  <td class="py-3.5 px-5 font-bold text-[var(--brand-primary)]">
                    #${order.id}
                  </td>
                  <td class="py-3.5 px-4 text-[var(--text-muted)] font-medium">
                    ${order.date}
                  </td>
                  <td class="py-3.5 px-4">
                    <div class="font-bold text-[var(--text-main)]">${order.customerName || 'Walk-in Customer'}</div>
                    <div class="text-[10px] text-[var(--text-light)]">${order.customerPhone || 'OTC Counter Sale'}</div>
                  </td>
                  <td class="py-3.5 px-4 text-center font-semibold text-[var(--text-muted)]">
                    ${order.itemsCount || (order.items ? order.items.length : 1)}
                  </td>
                  <td class="py-3.5 px-4 font-bold text-[var(--text-main)]">
                    ₹${order.total}
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === 'Completed' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : order.status === 'Advance Booking'
                        ? 'bg-amber-50 text-amber-700 border border-amber-300'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }">
                      ${order.status === 'Completed' ? '✓ Counter Sale' : order.status}
                    </span>
                  </td>
                  <td class="py-3.5 px-5 text-right space-x-2">
                    <button 
                      data-view-order="${order.id}" 
                      class="px-2.5 py-1 text-xs font-bold text-[var(--brand-primary)] bg-[var(--brand-primary-light)] hover:bg-[var(--brand-primary)] hover:text-white rounded-lg transition-all"
                    >
                      View
                    </button>
                    <button 
                      data-print-order="${order.id}" 
                      class="px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-subtle)] hover:bg-[var(--border-color)] rounded-lg transition-all"
                      title="Print Thermal Bill"
                    >
                      🖨️
                    </button>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="7" class="py-10 text-center text-[var(--text-light)]">
                    <p class="font-medium text-xs">No orders match the selected filter.</p>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}
