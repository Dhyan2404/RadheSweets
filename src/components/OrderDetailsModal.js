// Order Details Modal Component

export function renderOrderDetailsModal(order) {
  if (!order) return '';

  return `
    <div class="modal-backdrop" id="order-details-modal">
      <div class="modal-content p-6 space-y-5 max-w-lg">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div class="flex items-center space-x-2">
            <button id="close-order-details-btn" class="p-1 -ml-1 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            </button>
            <div>
              <h3 class="text-base font-bold text-[var(--text-main)] leading-snug">Order #${order.id}</h3>
              <p class="text-[11px] text-[var(--text-light)]">${order.date}</p>
            </div>
          </div>

          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            order.status === 'Processing' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
            order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-300' :
            'bg-rose-50 text-rose-700 border border-rose-200'
          }">
            ${order.status}
          </span>
        </div>

        <!-- Customer Profile Card -->
        <div class="bg-[var(--bg-subtle)] p-3.5 rounded-xl border border-[var(--border-color)] flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-[var(--brand-primary)] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              ${order.customerName ? order.customerName.split(' ').map(n=>n[0]).join('') : 'JS'}
            </div>
            <div>
              <p class="font-bold text-xs sm:text-sm text-[var(--text-main)]">${order.customerName}</p>
              <p class="text-[11px] text-[var(--text-muted)]">${order.customerPhone}</p>
              <p class="text-[10px] text-[var(--text-light)]">${order.customerAddress || 'Ahmedabad, Gujarat'}</p>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <a 
              href="tel:${order.customerPhone}" 
              class="px-2.5 py-1.5 bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              📞 Call
            </a>
            <a 
              href="https://wa.me/${(order.customerPhone || '').replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(order.customerName)},%20your%20Radhe%20Sweets%20order%20%23${order.id}%20is%20${order.status}." 
              target="_blank"
              class="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        <!-- Itemized Order Details -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Order Items</h4>
          <div class="space-y-2 max-h-44 overflow-y-auto pr-1">
            ${(order.items || []).map(item => `
              <div class="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] text-xs">
                <div>
                  <p class="font-bold text-[var(--text-main)]">${item.name}</p>
                  <p class="text-[10px] text-[var(--text-light)]">${item.quantity || item.qty} ${item.unit || 'kg'} × ₹${item.rate}</p>
                </div>
                <span class="font-bold text-[var(--text-main)]">₹${item.total || ((item.quantity || item.qty) * item.rate)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="bg-[var(--bg-subtle)] p-3.5 rounded-xl space-y-1.5 text-xs">
          <div class="flex justify-between text-[var(--text-muted)]">
            <span>Subtotal</span>
            <span class="font-bold text-[var(--text-main)]">₹${order.subtotal || order.total}</span>
          </div>
          <div class="flex justify-between text-[var(--text-muted)]">
            <span>Discount</span>
            <span class="text-emerald-600 font-bold">- ₹${order.discount || 0}</span>
          </div>
          <div class="flex justify-between text-[var(--text-muted)]">
            <span>Tax (GST 0%)</span>
            <span class="text-[var(--text-main)]">₹0</span>
          </div>
          <div class="border-t border-[var(--border-color)] pt-1.5 flex justify-between font-extrabold text-sm text-[var(--text-main)]">
            <span>Total Payable</span>
            <span class="text-[var(--brand-primary)]">₹${order.total}</span>
          </div>
        </div>

        <!-- Status Change Dropdown & Actions -->
        <div class="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <div class="w-full sm:w-auto flex-1 flex items-center gap-2">
            <span class="text-xs font-semibold text-[var(--text-muted)]">Status:</span>
            <select 
              id="update-order-status-select"
              data-order-id="${order.id}"
              class="flex-1 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl py-1.5 px-3 text-xs font-bold text-[var(--text-main)]"
            >
              <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Canceled" ${order.status === 'Canceled' ? 'selected' : ''}>Canceled</option>
            </select>
          </div>

          <button 
            id="print-from-details-btn"
            data-order-id="${order.id}"
            class="w-full sm:w-auto px-4 py-2 bg-[var(--brand-primary)] text-white text-xs font-bold rounded-xl hover:bg-[var(--brand-primary-hover)] transition-all flex items-center justify-center gap-1.5"
          >
            <span>🖨️ Print Bill</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
