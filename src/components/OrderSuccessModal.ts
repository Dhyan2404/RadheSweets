// Checkout Success Modal Component with Celebration & Smooth Transition Delay

export function renderOrderSuccessModal(lastOrder: any, countdownSec = 2) {
  if (!lastOrder) return '';

  return `
    <div class="modal-backdrop" id="order-success-modal">
      <div class="modal-content p-6 sm:p-7 text-center space-y-4 relative overflow-hidden max-w-md shadow-2xl border border-emerald-500/20">
        <!-- Close Button -->
        <button 
          id="close-success-modal-btn"
          type="button"
          class="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-stone-100/90 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          title="Close modal"
        >
          <svg class="w-4 h-4 stroke-[2.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <!-- Confetti Elements -->
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          <div class="confetti-piece bg-amber-400" style="left: 15%; animation-delay: 0.1s;"></div>
          <div class="confetti-piece bg-rose-400" style="left: 30%; animation-delay: 0.3s;"></div>
          <div class="confetti-piece bg-emerald-400" style="left: 50%; animation-delay: 0.2s;"></div>
          <div class="confetti-piece bg-sky-400" style="left: 70%; animation-delay: 0.4s;"></div>
          <div class="confetti-piece bg-purple-400" style="left: 85%; animation-delay: 0.15s;"></div>
        </div>

        <!-- Success Check Icon with Radial Glow Ring -->
        <div class="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div class="absolute inset-0 rounded-full bg-emerald-400/25 animate-ping"></div>
          <div class="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 relative z-10">
            <svg class="w-9 h-9 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
        </div>

        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-black uppercase tracking-wider shadow-2xs mb-1.5">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Checkout Successful</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight">Checkout Complete!</h3>
          <p class="text-xs text-[var(--text-light)] mt-0.5 font-medium">Invoice <strong class="text-[var(--text-main)]">#${lastOrder.id}</strong> • ${lastOrder.date}</p>
        </div>

        <!-- Order Summary Card -->
        <div class="bg-[var(--bg-subtle)] p-3.5 rounded-2xl border border-[var(--border-color)] text-xs text-left space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-[var(--text-muted)] font-medium">Customer</span>
            <span class="font-bold text-[var(--text-main)] truncate max-w-[200px]">${lastOrder.customerName}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[var(--text-muted)] font-medium">Total Paid</span>
            <span class="font-black text-base text-[var(--brand-primary)]">₹${lastOrder.total.toLocaleString()}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[var(--text-muted)] font-medium">Items</span>
            <span class="font-semibold text-[var(--text-main)]">${lastOrder.itemsCount} item(s) fresh packed</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[var(--text-muted)] font-medium">Payment Mode</span>
            <span class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">${lastOrder.paymentMethod}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 pt-1">
          <button 
            id="print-order-bill-btn"
            type="button"
            class="w-full py-3 px-4 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            <span>Print Thermal Receipt Now</span>
          </button>

          <button 
            id="share-whatsapp-btn"
            type="button"
            class="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>💬 Share Bill on WhatsApp</span>
          </button>

          <div class="flex items-center gap-2 pt-0.5">
            <button 
              id="view-orders-after-success-btn"
              type="button"
              class="flex-1 py-2 px-3 bg-[var(--bg-subtle)] hover:bg-[var(--bg-highlight)] text-[var(--text-main)] border border-[var(--border-color)] font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              View Invoices
            </button>
            <button 
              id="new-sale-after-success-btn"
              type="button"
              class="flex-1 py-2 px-3 bg-[var(--text-main)] hover:opacity-90 text-[var(--bg-surface)] font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              + Another Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
