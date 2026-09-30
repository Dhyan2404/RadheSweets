// Order Success Modal Component with Confetti Celebration

export function renderOrderSuccessModal(lastOrder) {
  if (!lastOrder) return '';

  return `
    <div class="modal-backdrop" id="order-success-modal">
      <div class="modal-content p-6 sm:p-8 text-center space-y-5 relative overflow-hidden max-w-md">
        <!-- Confetti Elements -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          <div class="confetti-piece bg-amber-400" style="left: 15%; animation-delay: 0.1s;"></div>
          <div class="confetti-piece bg-rose-400" style="left: 30%; animation-delay: 0.3s;"></div>
          <div class="confetti-piece bg-emerald-400" style="left: 50%; animation-delay: 0.2s;"></div>
          <div class="confetti-piece bg-sky-400" style="left: 70%; animation-delay: 0.4s;"></div>
          <div class="confetti-piece bg-purple-400" style="left: 85%; animation-delay: 0.15s;"></div>
        </div>

        <!-- Success Check Icon -->
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <svg class="w-9 h-9 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>

        <div>
          <h3 class="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] tracking-tight">Order Placed Successfully!</h3>
          <p class="text-xs text-[var(--text-light)] mt-1">Order #${lastOrder.id} • ${lastOrder.date}</p>
        </div>

        <!-- Order Summary Card -->
        <div class="bg-[var(--bg-subtle)] p-4 rounded-2xl border border-[var(--border-color)] text-xs text-left space-y-2">
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">Customer</span>
            <span class="font-bold text-[var(--text-main)]">${lastOrder.customerName}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">Total Amount</span>
            <span class="font-extrabold text-sm text-[var(--brand-primary)]">₹${lastOrder.total}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">Items</span>
            <span class="font-semibold text-[var(--text-main)]">${lastOrder.itemsCount} items</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--text-muted)]">Payment Mode</span>
            <span class="font-semibold text-[var(--text-main)]">${lastOrder.paymentMethod}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2.5 pt-2">
          <button 
            id="print-order-bill-btn"
            class="w-full py-3 px-4 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            <span>Print Thermal Bill</span>
          </button>

          <button 
            id="share-whatsapp-btn"
            class="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-1.5"
          >
            <span>💬 Share Bill on WhatsApp</span>
          </button>

          <div class="flex items-center gap-2 pt-1">
            <button 
              id="view-orders-after-success-btn"
              class="flex-1 py-2 px-3 bg-[var(--bg-subtle)] hover:bg-[var(--bg-highlight)] text-[var(--text-main)] border border-[var(--border-color)] font-semibold text-xs rounded-xl transition-all"
            >
              View Orders
            </button>
            <button 
              id="new-sale-after-success-btn"
              class="flex-1 py-2 px-3 bg-[var(--text-main)] hover:opacity-90 text-[var(--bg-surface)] font-semibold text-xs rounded-xl transition-all"
            >
              + Another Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
