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
        <!-- Tabs with Sleek Pill Design -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          ${tabs.map(tab => `
            <button 
              data-orders-tab="${tab.id}"
              class="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                ordersFilterTab === tab.id 
                  ? 'bg-[#C86D3B] text-white shadow-md shadow-[#C86D3B]/25 scale-[1.02]' 
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/80 hover:border-[#C86D3B]/40 hover:bg-stone-50'
              }"
            >
              ${tab.label}
            </button>
          `).join('')}
        </div>

        <!-- Search Bar and Modern Frosted Glass Hint Pill -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:max-w-xs">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            </span>
            <input 
              id="orders-search-input"
              type="text" 
              value="${ordersSearchQuery || ''}"
              placeholder="Search invoice #, customer name or phone..." 
              class="w-full pl-9 pr-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-200/90 dark:border-stone-700 rounded-full text-xs text-[#2A1F1D] dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] shadow-2xs transition-all"
            />
          </div>

          <!-- Modern Frosted Glass Gesture Guidance Pill -->
          <div class="w-full sm:w-auto flex items-center gap-2.5 justify-between sm:justify-end text-xs bg-white/90 dark:bg-stone-800/90 backdrop-blur-md border border-[#EBE4D8] dark:border-stone-700/80 px-3.5 py-1.5 rounded-full shadow-2xs">
            <span class="flex items-center gap-1.5 font-semibold text-stone-600 dark:text-stone-300 text-xs">
              <span class="inline-block animate-pulse">👈</span>
              <span>Swipe actions:</span>
            </span>
            <div class="flex items-center gap-1.5 text-[10px] font-bold">
              <span class="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-2xs">1. WhatsApp</span>
              <span class="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-[#C86D3B] text-white shadow-2xs">2. Details</span>
              <span class="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-2xs">3. Delete</span>
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
                        class="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-all cursor-pointer shadow-xs"
                        title="Send WhatsApp Invoice"
                      >
                        💬 WhatsApp
                      </button>
                      <button 
                        data-view-order="${order.id}" 
                        class="px-2.5 py-1 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-all cursor-pointer"
                        title="View / Edit Details"
                      >
                        View / Edit
                      </button>
                      <button 
                        data-delete-order="${order.id}" 
                        class="w-7 h-7 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-full transition-all cursor-pointer inline-flex items-center justify-center"
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
        <section class="space-y-3" id="swipe-invoices-container">
          ${filteredOrders.length > 0 ? filteredOrders.map((order: any) => {
            const itemsSummary = (order.items || []).slice(0, 2).map((it: any) => it.name).join(', ') + ((order.items && order.items.length > 2) ? ` +${order.items.length - 2} more` : '');
            
            const isCompleted = order.status === 'Completed';
            const isAdvance = order.status === 'Advance Booking';
            const isKitchen = order.status === 'Kitchen Packing';

            const nameStr = order.customerName || '';
            const isWalkIn = !nameStr || nameStr.toLowerCase().includes('walk-in') || nameStr.toLowerCase().includes('counter');
            let initials = 'RS';
            if (!isWalkIn) {
              const parts = nameStr.trim().split(/\s+/);
              initials = parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
            }

            const cardContentHtml = `
              <div class="w-full flex items-center justify-between gap-3 sm:gap-4 py-1">
                <!-- Left: Luminous Status Ribbon + Circular Insignia + Metadata -->
                <div class="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <!-- Luminous Vertical Ribbon Pill -->
                  <div class="w-1.5 h-11 rounded-full shrink-0 ${
                    isCompleted ? 'bg-gradient-to-b from-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                    isAdvance ? 'bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' :
                    isKitchen ? 'bg-gradient-to-b from-purple-400 to-indigo-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]' :
                    'bg-gradient-to-b from-rose-400 to-red-500'
                  }"></div>

                  <!-- Luxury Circular Insignia Avatar -->
                  <div class="relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-xs font-black text-xs tracking-wider select-none ${
                    isWalkIn 
                      ? 'bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 text-[#C86D3B] border border-amber-200/80 ring-2 ring-amber-500/10'
                      : isCompleted 
                      ? 'bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200 text-emerald-900 border border-emerald-300/70 ring-2 ring-emerald-500/10' 
                      : isAdvance 
                      ? 'bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-200 text-amber-900 border border-amber-300/70 ring-2 ring-amber-500/10' 
                      : isKitchen 
                      ? 'bg-gradient-to-br from-purple-100 via-fuchsia-50 to-indigo-200 text-purple-900 border border-purple-300/70 ring-2 ring-purple-500/10' 
                      : 'bg-gradient-to-br from-rose-100 via-pink-50 to-red-200 text-rose-900 border border-rose-300/70'
                  }">
                    ${isWalkIn ? '<span class="text-base">🍬</span>' : `<span>${initials}</span>`}
                    <!-- Micro Status Pin Badge -->
                    <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center text-[7px] font-black text-white ${
                      isCompleted ? 'bg-emerald-500' : isAdvance ? 'bg-amber-500' : isKitchen ? 'bg-purple-500' : 'bg-rose-500'
                    }">
                      ${isCompleted ? '✓' : isAdvance ? '★' : isKitchen ? '📦' : '•'}
                    </span>
                  </div>

                  <!-- Central Text & Badges -->
                  <div class="min-w-0 truncate">
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-black text-[#C86D3B] text-xs sm:text-sm tracking-tight">#${order.id}</span>
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-2xs ${
                        isCompleted 
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20' 
                          : isAdvance 
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20' 
                          : isKitchen
                          ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20'
                      }">
                        <span class="w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : isAdvance ? 'bg-amber-500' : isKitchen ? 'bg-purple-500' : 'bg-rose-500'}"></span>
                        <span>${isCompleted ? '✓ Paid & Handled' : order.status}</span>
                      </span>
                      ${order.paymentMethod ? `<span class="hidden sm:inline-block text-[10px] text-stone-400 font-semibold">• ${order.paymentMethod}</span>` : ''}
                    </div>

                    <div class="font-extrabold text-[#2A1F1D] dark:text-[#FAF7F2] text-sm sm:text-base tracking-tight truncate mt-0.5">
                      ${order.customerName || 'Walk-in Counter Customer'}
                    </div>

                    <div class="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5 truncate mt-0.5">
                      <span class="font-medium text-stone-600 dark:text-stone-300">${order.customerPhone || 'Counter Sale'}</span>
                      <span class="text-stone-300 dark:text-stone-600">•</span>
                      <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-700 dark:text-stone-300 bg-stone-100/90 dark:bg-stone-800/90 px-2.5 py-0.5 rounded-full truncate">
                        <span>🍬</span>
                        <span>${itemsSummary || `${order.itemsCount || 1} items`}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Right: Price & Ergonomic Action Pills (NO MORE BOXES) -->
                <div class="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <div class="font-black text-base sm:text-lg text-[#1F1615] dark:text-white tracking-tight">
                      ₹${(order.total || 0).toLocaleString()}
                    </div>
                    <div class="text-[10px] font-medium text-stone-400 dark:text-stone-500">
                      ${order.date}
                    </div>
                  </div>

                  <!-- Sleek Ergonomic Action Pills for Desktop -->
                  <div class="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-stone-200/60 dark:border-stone-700/60">
                    <button 
                      type="button"
                      data-quick-whatsapp="${order.id}" 
                      class="group/wa flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow-md hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
                      title="Send WhatsApp Invoice"
                    >
                      <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.761.82 2.791.82 3.181 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.806-5.768-5.806zm3.374 8.243c-.145.407-.741.777-1.033.826-.292.05-.67.072-1.077-.061-.258-.084-.59-.199-1.018-.387-1.796-.789-2.96-2.616-3.05-2.736-.09-.12-1.033-1.378-1.033-2.628 0-1.25.646-1.866.877-2.12.231-.254.508-.318.677-.318.17 0 .339.002.486.01.154.009.362-.058.566.432.215.518.736 1.792.8 1.923.064.13.107.283.02.454-.087.17-.13.277-.258.428-.128.151-.27.337-.386.452-.128.129-.262.27-.113.526.149.256.662 1.092 1.419 1.766.974.867 1.795 1.135 2.052 1.264.257.129.407.114.558-.06.151-.173.646-.752.818-1.01.172-.258.344-.216.578-.129.234.086 1.488.701 1.745.83.257.129.428.194.492.302.064.108.064.625-.081 1.032z"></path></svg>
                      <span>WhatsApp</span>
                    </button>
                    <button 
                      type="button"
                      data-view-order="${order.id}" 
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-[#FCEEE3] dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 hover:text-[#C86D3B] font-bold text-xs hover:scale-[1.03] active:scale-95 transition-all cursor-pointer"
                      title="View / Edit Details"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                      <span>Details</span>
                    </button>
                    <button 
                      type="button"
                      data-print-order="${order.id}" 
                      class="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 text-stone-600 dark:text-stone-300 hover:text-amber-800 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
                      title="Print Thermal Bill"
                    >
                      <span class="text-xs">🖨️</span>
                    </button>
                  </div>
                </div>
              </div>
            `;

            return renderSwipeRow({
              id: order.id,
              actions: DEFAULT_INVOICE_ACTIONS,
              height: 82,
              radius: 20,
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
