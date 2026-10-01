// Checkout Modal Component
// Streamlined Counter Billing with Cash, UPI, Card & Khata

export function renderCheckoutModal(state: any) {
  const { selectedCustomer, posCart, discountPercent = 0, paymentMethod = 'Cash' } = state;

  const cartSubtotal = posCart.reduce((sum: number, item: any) => sum + (item.rate * item.qty), 0);
  const discountAmount = Math.round((cartSubtotal * (discountPercent || 0)) / 100);
  const totalPayable = Math.max(0, cartSubtotal - discountAmount);

  return `
    <div class="modal-backdrop" id="checkout-modal">
      <div class="modal-content p-6 space-y-5 max-w-lg select-none">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div class="flex items-center space-x-2">
            <button type="button" id="close-checkout-btn" class="p-1 -ml-1 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            </button>
            <h3 class="text-lg font-bold text-[var(--text-main)]">Counter Checkout</h3>
          </div>
          <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Invoice Ready
          </span>
        </div>

        <!-- Customer Profile & Loyalty Card -->
        <div class="bg-[var(--bg-subtle)] p-3.5 rounded-xl border border-[var(--border-color)] flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full ${selectedCustomer ? 'bg-[var(--brand-primary)]' : 'bg-stone-600'} text-white font-bold text-xs flex items-center justify-center shadow-xs">
              ${selectedCustomer ? selectedCustomer.name.split(' ').map((n: string)=>n[0]).join('').slice(0, 2) : 'WC'}
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-bold text-xs sm:text-sm text-[var(--text-main)]">${selectedCustomer?.name || 'Walk-in Counter Customer'}</span>
                <span class="text-[9px] ${selectedCustomer ? 'bg-amber-500 text-white' : 'bg-emerald-100 text-emerald-800'} font-bold px-1.5 py-0.2 rounded">${selectedCustomer?.tier || 'Cash OTC'}</span>
                ${selectedCustomer?.loyaltyPoints ? `
                  <span class="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded border border-amber-300">
                    ⭐ ${selectedCustomer.loyaltyPoints} Pts
                  </span>
                ` : ''}
              </div>
              <p class="text-[11px] text-[var(--text-muted)]">${selectedCustomer?.phone || 'OTC Instant Counter Delivery'}</p>
              ${selectedCustomer && selectedCustomer?.khataBalance !== undefined ? `
                <p class="text-[10px] text-stone-500">
                  Khata Limit: ₹${selectedCustomer.creditLimit || 5000} | Current Due: <strong class="text-rose-600">₹${selectedCustomer.khataBalance}</strong>
                </p>
              ` : ''}
            </div>
          </div>
          <button type="button" id="checkout-edit-customer-btn" class="text-xs font-semibold text-[var(--brand-primary)] hover:underline">
            Switch
          </button>
        </div>

        <!-- Order Items Review -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Order Items (${posCart.length})</h4>
            <span class="text-[11px] text-[var(--text-light)]">Instant weighing calculation</span>
          </div>
          <div class="space-y-2 max-h-40 overflow-y-auto pr-1">
            ${posCart.map((item: any) => `
              <div class="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)] text-xs">
                <div class="flex items-center space-x-2.5">
                  <img 
                    src="${item.image}" 
                    alt="${item.name}" 
                    class="w-8 h-8 rounded-lg object-cover border border-[var(--border-color)] shadow-2xs"
                    onerror="this.src='${item.fallbackImage}'"
                  />
                  <div>
                    <p class="font-bold text-[var(--text-main)]">${item.name}</p>
                    <p class="text-[10px] text-[var(--text-light)]">
                      ${item.qty >= 1 ? `${item.qty} ${item.unit}` : `${Math.round(item.qty * 1000)}g`} × ₹${item.rate}/${item.unit}
                    </p>
                  </div>
                </div>
                <span class="font-bold text-[var(--text-main)]">₹${Math.round(item.qty * item.rate)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Payment Mode Selection (Cash, UPI, Card, Khata) -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Payment Mode</h4>
            <span class="text-[10px] text-[var(--text-muted)] font-semibold">Select tender</span>
          </div>

          <div class="grid grid-cols-4 gap-2">
            ${['Cash', 'UPI', 'Card', 'Khata'].map(method => `
              <button 
                type="button"
                data-select-payment="${method}"
                class="payment-method-pill p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                  paymentMethod === method 
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)] text-[var(--brand-primary)] shadow-xs ring-2 ring-[var(--brand-primary)]/20' 
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:border-[var(--brand-primary)]'
                }"
              >
                ${method === 'Cash' ? '💵' : method === 'UPI' ? '📱' : method === 'Card' ? '💳' : '📒'}
                <span class="block text-[11px] mt-0.5">${method}</span>
              </button>
            `).join('')}
          </div>

          <!-- Customer Khata info when Khata selected -->
          ${paymentMethod === 'Khata' ? `
            <div class="mt-3 p-3 bg-amber-50/70 border border-amber-300 rounded-xl text-xs space-y-1 animate-fadeIn">
              <p class="font-bold text-amber-900">📒 Customer Credit Ledger (Khata)</p>
              <p class="text-[11px] text-amber-800">
                ₹${totalPayable} will be added to ${selectedCustomer?.name || 'Customer'}'s Khata account.
              </p>
              <p class="text-[10px] text-amber-700">
                Allowed Credit Limit: ₹${selectedCustomer?.creditLimit || 5000} (Available: ₹${(selectedCustomer?.creditLimit || 5000) - (selectedCustomer?.khataBalance || 0)})
              </p>
            </div>
          ` : ''}
        </div>

        <!-- Payment Breakdown Summary -->
        <div class="bg-[var(--bg-subtle)] p-3.5 rounded-xl space-y-1.5 text-xs">
          <div class="flex justify-between text-[var(--text-muted)]">
            <span>Subtotal</span>
            <span class="font-bold text-[var(--text-main)]">₹${cartSubtotal}</span>
          </div>
          <div class="flex justify-between text-[var(--text-muted)]">
            <span>Discount (${discountPercent}%)</span>
            <span class="font-bold text-emerald-600">- ₹${discountAmount}</span>
          </div>
          <div class="flex justify-between text-[var(--text-muted)]">
            <span>GST (0% Fresh Sweets)</span>
            <span class="text-[var(--text-main)]">₹0</span>
          </div>
          <div class="border-t border-[var(--border-color)] pt-1.5 flex justify-between font-extrabold text-sm sm:text-base text-[var(--text-main)]">
            <span>Total Payable</span>
            <span class="text-[var(--brand-primary)]">₹${totalPayable}</span>
          </div>
        </div>

        <!-- Place Order Button -->
        <button 
          type="button"
          id="confirm-place-order-btn"
          class="w-full py-3.5 px-4 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] active:scale-98 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <span>Confirm & Print Bill • ₹${totalPayable}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
      </div>
    </div>
  `;
}
