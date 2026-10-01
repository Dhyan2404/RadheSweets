// Checkout Modal Component
// Streamlined Counter Billing with Cash, UPI, Card & Khata
import { renderSlideCommit } from './SlideCommit.ts';

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
        <div id="checkout-customer-section" class="bg-[var(--bg-subtle)] p-3.5 rounded-xl border border-[var(--border-color)] flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full ${selectedCustomer ? 'bg-[var(--brand-primary)]' : 'bg-stone-600'} text-white font-bold text-xs flex items-center justify-center shadow-xs">
              ${selectedCustomer?.name ? selectedCustomer.name.split(' ').filter(Boolean).map((n: string)=>n[0]).join('').slice(0, 2).toUpperCase() : 'WC'}
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
          <div class="flex items-center gap-2">
            ${selectedCustomer ? `
              <button type="button" id="checkout-detach-customer-btn" class="text-xs font-semibold text-stone-400 hover:text-rose-600 hover:underline cursor-pointer" title="Detach customer and switch to Walk-in">
                Detach
              </button>
            ` : ''}
            <button type="button" id="checkout-edit-customer-btn" class="px-3 py-1.5 bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer">
              ${selectedCustomer ? 'Switch' : '+ Attach Customer'}
            </button>
          </div>
        </div>

        <!-- Order Items Review with Live Weighing & Presets (250g, 500g, 750g, 1kg) -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Order Items (${posCart.length})</h4>
            <span class="text-[11px] font-semibold text-[var(--brand-primary)]">Presets &amp; Custom Weight (g / kg)</span>
          </div>
          
          <div class="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            ${posCart.length > 0 ? posCart.map((item: any) => {
              const currentUnit = item.checkoutUnit || (item.qty < 1 ? 'g' : 'kg');
              const displayQty = currentUnit === 'g' ? Math.round(item.qty * 1000) : item.qty;
              const is250 = Math.abs(item.qty - 0.25) < 0.001;
              const is500 = Math.abs(item.qty - 0.50) < 0.001;
              const is750 = Math.abs(item.qty - 0.75) < 0.001;
              const is1000 = Math.abs(item.qty - 1.00) < 0.001;

              return `
                <div class="p-3 bg-stone-50/90 rounded-2xl border border-stone-200/80 space-y-2 text-xs transition-all hover:border-amber-300 shadow-2xs">
                  <!-- Sweet Header: Photo, Name, Rate and Item Total -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2.5 min-w-0">
                      <img 
                        src="${item.image || (item.id && String(item.id).startsWith('sw-') ? `/assets/sweets/${item.id}.png` : '/assets/sweets/sw-1.png')}" 
                        alt="${item.name}" 
                        class="w-10 h-10 rounded-xl object-cover border border-amber-200/80 shadow-2xs shrink-0 bg-white"
                        onerror="this.onerror=null; this.src='/assets/sweets/sw-1.png';"
                      />
                      <div class="min-w-0">
                        <p class="font-bold text-[var(--text-main)] text-xs sm:text-sm truncate">${item.name}</p>
                        <p class="text-[10px] text-[var(--text-muted)] font-medium">₹${item.rate}/kg</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-2 shrink-0">
                      <span class="font-extrabold text-sm sm:text-base text-[var(--brand-primary)]">
                        ₹${Math.round(item.qty * item.rate)}
                      </span>
                      <button 
                        type="button"
                        data-checkout-remove="${item.id}"
                        class="w-6 h-6 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove sweet"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <!-- Controls: Unit selector (g vs kg) + Custom typed quantity -->
                  <div class="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/60 flex-wrap">
                    <!-- Unit toggle -->
                    <div class="flex items-center bg-white p-0.5 rounded-xl border border-stone-200 text-[11px] font-bold shadow-2xs">
                      <button 
                        type="button"
                        data-checkout-unit="${item.id}" 
                        data-unit="g"
                        class="px-2.5 py-0.5 rounded-lg transition-all cursor-pointer ${currentUnit === 'g' ? 'bg-[var(--brand-primary)] text-white shadow-2xs' : 'text-stone-500 hover:text-stone-800'}"
                      >
                        g (grams)
                      </button>
                      <button 
                        type="button"
                        data-checkout-unit="${item.id}" 
                        data-unit="kg"
                        class="px-2.5 py-0.5 rounded-lg transition-all cursor-pointer ${currentUnit === 'kg' ? 'bg-[var(--brand-primary)] text-white shadow-2xs' : 'text-stone-500 hover:text-stone-800'}"
                      >
                        kg
                      </button>
                    </div>

                    <!-- Type Quantity Directly -->
                    <div class="flex items-center gap-1.5">
                      <span class="text-[10px] font-semibold text-stone-500">Type Qty:</span>
                      <div class="relative flex items-center">
                        <input 
                          type="number" 
                          step="${currentUnit === 'kg' ? '0.05' : '10'}" 
                          min="${currentUnit === 'kg' ? '0.01' : '10'}" 
                          max="${currentUnit === 'kg' ? '100' : '100000'}" 
                          value="${displayQty}" 
                          data-checkout-qty-input="${item.id}"
                          data-unit="${currentUnit}"
                          class="w-20 px-2 py-1 bg-white border border-stone-300 rounded-xl text-center font-extrabold text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] shadow-2xs"
                        />
                        <span class="ml-1 text-[11px] font-bold text-stone-600">${currentUnit}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Quick Presets: 250g, 500g, 750g, 1kg -->
                  <div class="grid grid-cols-4 gap-1.5 pt-0.5">
                    <button 
                      type="button"
                      data-checkout-preset="${item.id}" 
                      data-kg="0.25"
                      class="py-1 px-1 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer ${
                        is250 
                          ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-700' 
                          : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200'
                      }"
                    >
                      250g
                    </button>
                    <button 
                      type="button"
                      data-checkout-preset="${item.id}" 
                      data-kg="0.5"
                      class="py-1 px-1 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer ${
                        is500 
                          ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-700' 
                          : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200'
                      }"
                    >
                      500g
                    </button>
                    <button 
                      type="button"
                      data-checkout-preset="${item.id}" 
                      data-kg="0.75"
                      class="py-1 px-1 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer ${
                        is750 
                          ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-700' 
                          : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200'
                      }"
                    >
                      750g
                    </button>
                    <button 
                      type="button"
                      data-checkout-preset="${item.id}" 
                      data-kg="1.0"
                      class="py-1 px-1 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer ${
                        is1000 
                          ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-700' 
                          : 'bg-white hover:bg-amber-50 text-stone-700 border border-stone-200'
                      }"
                    >
                      1kg
                    </button>
                  </div>
                </div>
              `;
            }).join('') : `
              <div class="text-center py-6 text-stone-400 text-xs font-medium">Cart is currently empty</div>
            `}
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
            <span class="font-bold text-[var(--text-main)]" id="checkout-subtotal-val">₹${cartSubtotal}</span>
          </div>
          <div class="flex justify-between text-[var(--text-muted)]">
            <span>Discount (${discountPercent}%)</span>
            <span class="font-bold text-emerald-600" id="checkout-discount-val">- ₹${discountAmount}</span>
          </div>
          <div class="flex justify-between text-[var(--text-muted)]">
            <span>GST (0% Fresh Sweets)</span>
            <span class="text-[var(--text-main)]">₹0</span>
          </div>
          <div class="border-t border-[var(--border-color)] pt-1.5 flex justify-between font-extrabold text-sm sm:text-base text-[var(--text-main)]">
            <span>Total Payable</span>
            <span class="text-[var(--brand-primary)]" id="checkout-total-val">₹${totalPayable}</span>
          </div>
        </div>

        <!-- Slide to Checkout Action (SlideCommit with Chocolate Brand Theme & Green Confirmation) -->
        <div class="pt-2 space-y-2">
          ${renderSlideCommit({
            id: 'checkout-slide-commit',
            label: 'Slide to checkout',
            doneLabel: 'Checked Out',
            errorLabel: 'Payment failed',
            trackColor: '#241816', // Main website roasted dark chocolate color
            handleColor: '#C86D3B', // Warm signature chocolate terracotta
            successColor: '#16a34a', // Vibrant green for checked out
            dangerColor: '#e5484d',
            height: 56,
            radius: 28,
            totalPayable,
            disabled: posCart.length === 0
          })}

          <div class="flex items-center justify-between px-1 text-[11px] text-stone-500">
            <span class="flex items-center gap-1.5">
              <kbd class="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 font-mono text-[10px] text-stone-600">Space</kbd> or drag right to pay
            </span>
            <button 
              type="button" 
              id="confirm-place-order-btn" 
              class="font-bold text-[var(--brand-primary)] hover:underline cursor-pointer flex items-center gap-1 py-1"
            >
              <span>Instant Click Pay • ₹${totalPayable}</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
