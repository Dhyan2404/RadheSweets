// Checkout Modal Component
// Streamlined Counter Billing with Cash, UPI & Card
import { renderSlideCommit } from './SlideCommit.ts';

export function renderCheckoutModal(state: any) {
  const { selectedCustomer, posCart, discountPercent = 0, paymentMethod = 'Cash', shopInfo = {}, branches = [], currentBranchId = 'br-1' } = state;

  const activeBranch = branches.find((b: any) => b.id === currentBranchId) || (branches.length > 0 ? branches[0] : null);

  const cartSubtotal = posCart.reduce((sum: number, item: any) => sum + (item.rate * item.qty), 0);
  const discountAmount = Math.round((cartSubtotal * (discountPercent || 0)) / 100);
  const totalPayable = Math.max(0, cartSubtotal - discountAmount);

  const storeUpiId = activeBranch?.upiId || shopInfo.upiId || 'radhesweets@oksbi';
  const storeUpiName = activeBranch?.upiName || activeBranch?.name || shopInfo.upiName || shopInfo.name || 'Radhe Sweets';
  const branchAddress = activeBranch?.address || shopInfo.address || 'Ahmedabad, Gujarat';
  const upiQrUri = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`upi://pay?pa=${storeUpiId}&pn=${encodeURIComponent(storeUpiName)}&am=${totalPayable}&cu=INR`)}`;

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
              ${selectedCustomer?.id ? `
                <p class="text-[10px] text-stone-500 font-mono font-bold mt-0.5">
                  Customer ID: <strong class="text-[#C86D3B]">#${selectedCustomer.id.toUpperCase()}</strong>
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

        <!-- Payment Mode Selection (Cash, UPI, Card) -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Payment Mode</h4>
            <span class="text-[10px] text-[var(--text-muted)] font-semibold">Select tender</span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            ${['Cash', 'UPI', 'Card'].map(method => `
              <button 
                type="button"
                data-select-payment="${method}"
                class="payment-method-pill p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === method 
                    ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)] text-[var(--brand-primary)] shadow-xs ring-2 ring-[var(--brand-primary)]/20' 
                    : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:border-[var(--brand-primary)]'
                }"
              >
                ${method === 'Cash' ? '💵' : method === 'UPI' ? '📱' : '💳'}
                <span class="block text-[11px] mt-0.5">${method}</span>
              </button>
            `).join('')}
          </div>

          <!-- Payment Tender Specific Panels -->

          <!-- 1. Cash Tender: Cash Tendered & Change Return Calculator -->
          ${paymentMethod === 'Cash' ? `
            <div class="mt-3 p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs space-y-2.5 animate-fadeIn">
              <div class="flex items-center justify-between">
                <span class="font-extrabold text-amber-950 flex items-center gap-1.5">
                  <span>💵</span> Cash Calculator &amp; Change Due
                </span>
                <span class="text-[10px] font-bold text-amber-800">RBI ₹1 Rounding</span>
              </div>

              <div class="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label class="block text-[10px] font-bold text-stone-600 mb-1">Cash Received (₹)</label>
                  <input 
                    type="number" 
                    id="checkout-cash-received-input" 
                    min="${totalPayable}" 
                    step="1"
                    value="${state.cashTendered || totalPayable}"
                    class="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl font-mono font-black text-sm text-[var(--text-main)] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div class="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-center">
                  <span class="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Change to Return</span>
                  <span class="font-mono font-black text-base sm:text-lg text-emerald-700" id="checkout-change-due-val">
                    ₹${Math.max(0, (state.cashTendered || totalPayable) - totalPayable)}
                  </span>
                </div>
              </div>

              <!-- Quick Tender Cash Chips -->
              <div class="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                <span class="text-[10px] font-bold text-stone-500 shrink-0">Quick:</span>
                <button type="button" data-cash-quick="${totalPayable}" class="px-2 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-bold text-stone-700 hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer">
                  Exact (₹${totalPayable})
                </button>
                ${[100, 200, 500, 1000, 2000].filter(d => d >= totalPayable).map(denom => `
                  <button type="button" data-cash-quick="${denom}" class="px-2 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-bold text-stone-700 hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer">
                    ₹${denom}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 2. UPI Tender: Dynamic QR Code with Exact Amount -->
          ${paymentMethod === 'UPI' ? `
            <div class="mt-3 p-3.5 bg-gradient-to-br from-indigo-50/90 to-purple-50/80 border border-indigo-200 rounded-2xl text-xs space-y-3 animate-fadeIn">
              <div class="flex items-center justify-between">
                <span class="font-extrabold text-indigo-950 flex items-center gap-1.5">
                  <span>📱</span> Dynamic Counter UPI QR
                </span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  Exact ₹${totalPayable}
                </span>
              </div>

              <div class="flex items-center gap-4 bg-white p-3 rounded-xl border border-indigo-100 shadow-2xs">
                <div class="w-24 h-24 bg-stone-100 rounded-xl p-1 border border-stone-200 flex items-center justify-center shrink-0">
                  <img 
                    src="${upiQrUri}"
                    alt="UPI QR Code" 
                    class="w-full h-full object-contain"
                    onerror="this.onerror=null; this.src='/favicon.svg';"
                  />
                </div>
                <div class="min-w-0 space-y-1">
                  <p class="font-extrabold text-[var(--text-main)] text-xs">Scan via GPay / PhonePe / Paytm</p>
                  <p class="text-[11px] font-mono text-stone-500">VPA: ${storeUpiId}</p>
                  <p class="text-[10px] text-emerald-700 font-bold">✓ Amount locked to ₹${totalPayable}</p>
                  <div class="pt-1">
                    <input 
                      type="text" 
                      id="checkout-upi-utr-input" 
                      placeholder="Optional: UTR / Last 4 digits" 
                      class="w-full px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-mono font-semibold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- 3. Card Tender -->
          ${paymentMethod === 'Card' ? `
            <div class="mt-3 p-3.5 bg-sky-50/80 border border-sky-200 rounded-2xl text-xs space-y-2 animate-fadeIn">
              <div class="flex items-center justify-between">
                <span class="font-extrabold text-sky-950 flex items-center gap-1.5">
                  <span>💳</span> Counter POS EDC Card Machine
                </span>
                <span class="text-[10px] font-bold text-sky-800">Swipe / Tap / Chip</span>
              </div>
              <p class="text-stone-600 text-[11px]">
                Please process payment of <strong class="text-sky-950">₹${totalPayable}</strong> on the bank EDC terminal and confirm once approval receipt prints.
              </p>
            </div>
          ` : ''}
        </div>

        <!-- Payment Breakdown Summary with Official GST HSN 2106 Breakdown -->
        <div class="bg-[var(--bg-subtle)] p-3.5 rounded-2xl space-y-1.5 text-xs border border-[var(--border-color)]">
          <div class="flex justify-between text-[var(--text-muted)]">
            <span>Subtotal (Gross Item Total)</span>
            <span class="font-bold text-[var(--text-main)]" id="checkout-subtotal-val">₹${cartSubtotal}</span>
          </div>
          ${discountAmount > 0 ? `
            <div class="flex justify-between text-[var(--text-muted)]">
              <span>Discount (${discountPercent}%)</span>
              <span class="font-bold text-emerald-600" id="checkout-discount-val">- ₹${discountAmount}</span>
            </div>
          ` : ''}
          <div class="flex justify-between text-[var(--text-muted)] text-[11px]">
            <span>GST (5% HSN 2106 Mithai • 2.5% CGST + 2.5% SGST)</span>
            <span class="text-stone-600 font-medium">Included (₹${Math.round((totalPayable * 0.05) / 1.05)})</span>
          </div>
          <div class="border-t border-[var(--border-color)] pt-2 flex justify-between font-extrabold text-sm sm:text-base text-[var(--text-main)]">
            <span>Net Total Payable</span>
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
