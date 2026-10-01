// Orders & Invoices Management View Component - Radhe Sweets
// Real-world Sweet Shop Counter & Festival Pre-Order Management
// Enhanced with interactive SwipeRow for Invoices (WhatsApp, View/Edit, and Delete)

import { renderSwipeRow, DEFAULT_INVOICE_ACTIONS } from './SwipeRow.ts';

export function renderOrdersView(state: any) {
  const { 
    orders = [], 
    ordersFilterTab = 'all', 
    ordersSearchQuery = '',
    ordersViewMode = 'swipe' // 'swipe' or 'table'
  } = state;

  const completedCount = orders.filter((o: any) => o.status === 'Completed').length;
  const advanceCount = orders.filter((o: any) => o.status === 'Advance Booking').length;
  const kitchenCount = orders.filter((o: any) => o.status === 'Kitchen Packing').length;

  const tabs = [
    { id: 'all', label: `All Invoices (${orders.length})`, filter: () => true },
    { id: 'completed', label: `Counter Sales (${completedCount})`, filter: (o: any) => o.status === 'Completed' },
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
          <div class="flex items-center gap-2.5">
            <h2 class="text-2xl font-bold text-[var(--text-main)] tracking-tight">Shop Invoices & Orders</h2>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-[#C86D3B] border border-amber-200/60 shadow-2xs">
              Live POS
            </span>
          </div>
          <p class="text-xs text-[var(--text-muted)] mt-0.5">Real-time counter handover sales, festival advance bookings & thermal bill printing</p>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-auto">
          <!-- View Mode Toggle (Swipe Rows vs Table) -->
          <div class="bg-[var(--bg-subtle)] p-0.5 rounded-xl border border-[var(--border-color)] flex items-center">
            <button
              id="orders-toggle-swipe-view"
              class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${ordersViewMode !== 'table' ? 'bg-white dark:bg-stone-800 text-[#C86D3B] shadow-2xs' : 'text-stone-500 hover:text-stone-800'}"
              title="Swipeable Cards Mode"
            >
              👈 Swipe Cards
            </button>
            <button
              id="orders-toggle-table-view"
              class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${ordersViewMode === 'table' ? 'bg-white dark:bg-stone-800 text-[#C86D3B] shadow-2xs' : 'text-stone-500 hover:text-stone-800'}"
              title="Data Table Mode"
            >
              📊 Table
            </button>
          </div>

          <button id="orders-new-sale-btn" class="px-4 py-2 bg-[var(--brand-primary)] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[var(--brand-primary-hover)] transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer">
            <span>+</span> New Counter Sale
          </button>
        </div>
      </section>

      <!-- Filter Tabs & Search Controls -->
      <section class="space-y-3">
        <!-- Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          ${tabs.map(tab => `
            <button 
              data-orders-tab="${tab.id}"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                ordersFilterTab === tab.id 
                  ? 'bg-[var(--brand-primary)] text-white shadow-xs' 
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]'
              }"
            >
              ${tab.label}
            </button>
          `).join('')}
        </div>

        <!-- Search Bar and Swipe Hint -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:max-w-xs">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-light)]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            </span>
            <input 
              id="orders-search-input"
              type="text" 
              value="${ordersSearchQuery || ''}"
              placeholder="Search invoice #, customer name or phone..." 
              class="w-full pl-9 pr-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          <!-- Gesture Guidance Banner -->
          <div class="w-full sm:w-auto flex items-center gap-2 justify-between sm:justify-end text-xs text-stone-500 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 px-3 py-1.5 rounded-xl">
            <span class="flex items-center gap-1.5 font-medium text-stone-700 dark:text-stone-300">
              <span class="text-sm">👆</span>
              <span><b>Swipe left</b> on any invoice:</span>
            </span>
            <div class="flex items-center gap-1.5 text-[10px] font-bold">
              <span class="px-1.5 py-0.5 rounded bg-emerald-600 text-white">1. WhatsApp</span>
              <span class="px-1.5 py-0.5 rounded bg-[#C86D3B] text-white">2. View / Edit</span>
              <span class="px-1.5 py-0.5 rounded bg-rose-600 text-white">3. Delete</span>
            </div>
          </div>
        </div>
      </section>

      ${ordersViewMode === 'table' ? `
        <!-- Table View Mode -->
        <section class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] shadow-subtle overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr class="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] text-[var(--text-muted)] font-semibold text-[11px] uppercase tracking-wider">
                  <th class="py-3.5 px-5">Invoice ID</th>
                  <th class="py-3.5 px-4">Date & Time</th>
                  <th class="py-3.5 px-4">Customer</th>
                  <th class="py-3.5 px-4 text-center">Items</th>
                  <th class="py-3.5 px-4">Total</th>
                  <th class="py-3.5 px-4">Status</th>
                  <th class="py-3.5 px-5 text-right">Quick Actions</th>
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
                    <td class="py-3.5 px-5 text-right space-x-1.5">
                      <button 
                        data-quick-whatsapp="${order.id}" 
                        class="px-2 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg transition-all cursor-pointer"
                        title="Send WhatsApp Invoice"
                      >
                        💬 WhatsApp
                      </button>
                      <button 
                        data-view-order="${order.id}" 
                        class="px-2 py-1 text-xs font-bold text-[var(--brand-primary)] bg-[var(--brand-primary-light)] hover:bg-[var(--brand-primary)] hover:text-white rounded-lg transition-all cursor-pointer"
                        title="View / Edit Details"
                      >
                        View / Edit
                      </button>
                      <button 
                        data-delete-order="${order.id}" 
                        class="px-2 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-lg transition-all cursor-pointer"
                        title="Delete Invoice"
                      >
                        🗑️
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
      ` : `
        <!-- Swipeable Cards List Mode (SwipeRow) -->
        <section class="space-y-2.5" id="swipe-invoices-container">
          ${filteredOrders.length > 0 ? filteredOrders.map((order: any) => {
            const itemsSummary = (order.items || []).slice(0, 2).map((it: any) => it.name).join(', ') + ((order.items && order.items.length > 2) ? ` +${order.items.length - 2} more` : '');
            
            const cardContentHtml = `
              <div class="w-full flex items-center justify-between gap-3">
                <!-- Left: Order ID & Customer Info -->
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-orange-50 dark:bg-stone-800 border border-orange-200/50 dark:border-stone-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <span class="text-sm font-extrabold text-[#C86D3B]">🧾</span>
                  </div>
                  <div class="min-w-0 truncate">
                    <div class="flex items-center gap-2">
                      <span class="font-extrabold text-[#C86D3B] text-xs sm:text-sm">#${order.id}</span>
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Completed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : order.status === 'Advance Booking'
                          ? 'bg-amber-50 text-amber-700 border border-amber-300'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }">
                        ${order.status === 'Completed' ? '✓ Sale' : order.status}
                      </span>
                    </div>
                    <div class="font-bold text-[var(--text-main)] text-xs sm:text-sm truncate mt-0.5">
                      ${order.customerName || 'Walk-in Counter Customer'}
                    </div>
                    <div class="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 truncate">
                      <span>${order.customerPhone || 'OTC Sale'}</span>
                      <span>•</span>
                      <span>${itemsSummary || `${order.itemsCount || 1} items`}</span>
                    </div>
                  </div>
                </div>

                <!-- Right: Amount & Quick Clicks -->
                <div class="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <div class="font-black text-sm sm:text-base text-[var(--text-main)]">
                      ₹${(order.total || 0).toLocaleString()}
                    </div>
                    <div class="text-[10px] text-[var(--text-light)]">
                      ${order.date}
                    </div>
                  </div>

                  <!-- Quick Action Buttons for Non-Swipe Devices -->
                  <div class="hidden sm:flex items-center gap-1.5 ml-1">
                    <button 
                      type="button"
                      data-quick-whatsapp="${order.id}" 
                      class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200/60 flex items-center justify-center transition-all cursor-pointer"
                      title="Send WhatsApp Invoice"
                    >
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.761.82 2.791.82 3.181 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.806-5.768-5.806zm3.374 8.243c-.145.407-.741.777-1.033.826-.292.05-.67.072-1.077-.061-.258-.084-.59-.199-1.018-.387-1.796-.789-2.96-2.616-3.05-2.736-.09-.12-1.033-1.378-1.033-2.628 0-1.25.646-1.866.877-2.12.231-.254.508-.318.677-.318.17 0 .339.002.486.01.154.009.362-.058.566.432.215.518.736 1.792.8 1.923.064.13.107.283.02.454-.087.17-.13.277-.258.428-.128.151-.27.337-.386.452-.128.129-.262.27-.113.526.149.256.662 1.092 1.419 1.766.974.867 1.795 1.135 2.052 1.264.257.129.407.114.558-.06.151-.173.646-.752.818-1.01.172-.258.344-.216.578-.129.234.086 1.488.701 1.745.83.257.129.428.194.492.302.064.108.064.625-.081 1.032z"></path></svg>
                    </button>
                    <button 
                      type="button"
                      data-view-order="${order.id}" 
                      class="w-7 h-7 rounded-lg bg-orange-50 text-[#C86D3B] hover:bg-[#C86D3B] hover:text-white border border-orange-200/60 flex items-center justify-center transition-all cursor-pointer"
                      title="View / Edit Details"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                    <button 
                      type="button"
                      data-print-order="${order.id}" 
                      class="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center transition-all cursor-pointer"
                      title="Print Thermal Bill"
                    >
                      🖨️
                    </button>
                  </div>
                </div>
              </div>
            `;

            return renderSwipeRow({
              id: order.id,
              actions: DEFAULT_INVOICE_ACTIONS,
              height: 72,
              radius: 16,
              actionWidth: 84,
              direction: 'left',
              collapseMs: 200
            }, cardContentHtml);
          }).join('') : `
            <div class="bg-[var(--bg-surface)] p-8 rounded-2xl border border-[var(--border-color)] text-center text-stone-400">
              <p class="text-sm font-medium">No invoices match the selected filter.</p>
            </div>
          `}
        </section>
      `}
    </div>
  `;
}
