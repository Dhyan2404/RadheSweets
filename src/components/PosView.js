// Point of Sale (POS / High-Speed Counter Billing) Component

export function renderPosView(state) {
  const { 
    sweets, 
    activeCategory, 
    selectedCustomer, 
    posCart, 
    posSearchQuery, 
    discountPercent,
    parkedBills = [],
    selectedWeightUnit = 'kg' // 'kg' or 'g'
  } = state;

  const categories = ["All", "Sweets", "Snacks", "Beverages"];

  // Filter sweets by category and search
  const filteredSweets = sweets.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !posSearchQuery || 
      item.name.toLowerCase().includes(posSearchQuery.toLowerCase()) ||
      (item.tagline && item.tagline.toLowerCase().includes(posSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const cartSubtotal = posCart.reduce((sum, item) => sum + (item.rate * item.qty), 0);
  const discountAmount = Math.round((cartSubtotal * (discountPercent || 0)) / 100);
  const totalPayable = Math.max(0, cartSubtotal - discountAmount);

  return `
    <div class="space-y-6">
      <!-- POS Top Header with Status & Stepper Progress -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h2 class="text-2xl font-bold text-[var(--text-main)] tracking-tight">Counter POS & Billing</h2>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync (radhesweets0)
            </span>
          </div>
          <p class="text-xs text-[var(--text-muted)] mt-0.5">High-speed dual-unit billing, decimal accuracy & split checkout</p>
        </div>

        <!-- 3-Step Breadcrumb Flow -->
        <div class="flex items-center space-x-2 text-xs font-semibold">
          <span class="flex items-center gap-1.5 px-3 py-1 rounded-full ${selectedCustomer ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]'}">
            <span class="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">1</span>
            Customer
          </span>
          <span class="text-[var(--text-light)]">→</span>
          <span class="flex items-center gap-1.5 px-3 py-1 rounded-full ${posCart.length > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]'}">
            <span class="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">2</span>
            Add Sweets (${posCart.length})
          </span>
          <span class="text-[var(--text-light)]">→</span>
          <span class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)]">
            <span class="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">3</span>
            Checkout
          </span>
        </div>
      </section>

      <!-- Main POS Grid: 8 Cols Sweets Catalog + 4 Cols Cart -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Sweets Selection Area (8 Columns) -->
        <div class="lg:col-span-8 space-y-5">
          <!-- Step 1: Customer Selection Bar with Khata / Loyalty Status (Required) -->
          <div class="bg-[var(--bg-surface)] p-4 rounded-2xl border ${selectedCustomer ? 'border-[var(--border-color)]' : 'border-amber-400 bg-amber-50/40 ring-2 ring-amber-400/20'} shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center space-x-3 w-full sm:w-auto">
              <span class="w-9 h-9 rounded-full ${selectedCustomer ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                ${selectedCustomer ? '✓' : '📞'}
              </span>
              <div>
                <div class="flex items-center gap-2">
                  <p class="text-xs font-bold text-[var(--text-main)]">
                    ${selectedCustomer ? 'Customer Attached (Required ✓)' : 'Customer Mobile Number Required *'}
                  </p>
                  ${selectedCustomer?.loyaltyPoints ? `
                    <span class="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.2 rounded-full">
                      ⭐ ${selectedCustomer.loyaltyPoints} Pts
                    </span>
                  ` : ''}
                </div>
                ${selectedCustomer ? `
                  <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span class="text-xs font-extrabold text-[var(--brand-primary)]">${selectedCustomer.name}</span>
                    <span class="text-[11px] font-mono text-[var(--text-muted)] font-semibold">${selectedCustomer.phone}</span>
                    <span class="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded">${selectedCustomer.tier || 'VIP'}</span>
                    ${selectedCustomer.khataBalance > 0 ? `
                      <span class="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                        Khata Due: ₹${selectedCustomer.khataBalance}
                      </span>
                    ` : ''}
                  </div>
                ` : `
                  <p class="text-[11px] text-amber-800 font-medium">Ask for customer mobile number to check existing loyalty or register</p>
                `}
              </div>
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button 
                id="pos-select-customer-btn" 
                class="px-4 py-2 ${selectedCustomer ? 'bg-[var(--bg-subtle)] text-[var(--text-main)] hover:bg-[var(--brand-primary)] hover:text-white' : 'bg-[var(--brand-primary)] text-white shadow-xs font-extrabold animate-bounce'} border border-[var(--border-color)] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>📞</span>
                <span>${selectedCustomer ? 'Switch Customer (Dialer)' : 'Dial Customer Number'}</span>
              </button>
            </div>
          </div>

          <!-- Step 2: Catalog Toolbar with Category Tabs, Search & Dual-Unit Weighing Mode -->
          <div class="space-y-3">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <!-- Category Filter Pills -->
              <div class="flex items-center gap-2 overflow-x-auto pb-1">
                ${categories.map(cat => `
                  <button 
                    data-pos-category="${cat}"
                    class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeCategory === cat 
                        ? 'bg-[var(--brand-primary)] text-white shadow-xs' 
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]'
                    }"
                  >
                    ${cat}
                  </button>
                `).join('')}
              </div>

              <!-- Controls: Weighing Unit Toggle + Search -->
              <div class="flex items-center gap-2">
                <!-- Dual-Unit Selector Toggle (g vs kg) -->
                <div class="flex items-center bg-[var(--bg-subtle)] p-0.5 rounded-xl border border-[var(--border-color)] text-xs font-bold">
                  <button 
                    id="unit-toggle-kg"
                    class="px-2.5 py-1 rounded-lg transition-all ${selectedWeightUnit === 'kg' ? 'bg-[var(--brand-primary)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}"
                    title="Weigh in Kilograms"
                  >
                    kg
                  </button>
                  <button 
                    id="unit-toggle-g"
                    class="px-2.5 py-1 rounded-lg transition-all ${selectedWeightUnit === 'g' ? 'bg-[var(--brand-primary)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}"
                    title="Weigh in Grams"
                  >
                    grams (g)
                  </button>
                </div>

                <!-- Search Sweets Input -->
                <div class="relative w-full sm:w-56">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-light)]">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                  </span>
                  <input 
                    id="pos-search-input"
                    type="text" 
                    value="${posSearchQuery || ''}"
                    placeholder="Search sweets..." 
                    class="w-full pl-9 pr-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--brand-primary)]"
                  />
                </div>
              </div>
            </div>

            <!-- Sweets Cards Grid (Touch Speed Grid with Margin and Quick Weight Chips) -->
            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              ${filteredSweets.map(sweet => {
                const inCartItem = posCart.find(i => i.id === sweet.id);
                return `
                  <div class="sweet-card flex flex-col justify-between group">
                    <div class="relative h-28 sm:h-32 overflow-hidden bg-[var(--bg-subtle)]">
                      <img 
                        src="${sweet.image}" 
                        alt="${sweet.name}" 
                        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        onerror="this.src='${sweet.fallbackImage}'"
                      />
                      <div class="absolute top-2 left-2 flex flex-col gap-1">
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs ${
                          sweet.stockStatus === 'Low Stock' 
                            ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }">
                          ${sweet.stockStatus} (${sweet.stock}${sweet.unit})
                        </span>
                      </div>
                      
                      <!-- Fresh Batch Tag -->
                      <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-900/80 text-amber-200 backdrop-blur-xs">
                        Fresh Batch
                      </span>
                    </div>

                    <div class="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 class="font-bold text-xs sm:text-sm text-[var(--text-main)] leading-snug">${sweet.name}</h4>
                        <div class="flex items-center justify-between text-[10px] text-[var(--text-light)] mt-0.5">
                          <span class="font-medium text-stone-500">${sweet.tagline || sweet.category}</span>
                          <span class="text-amber-700 font-semibold">★ Shuddh Ghee</span>
                        </div>
                      </div>

                      <!-- Pricing and Quick Add Buttons -->
                      <div class="mt-3 pt-2 border-t border-[var(--border-subtle)]">
                        <div class="flex items-center justify-between mb-2">
                          <span class="font-extrabold text-xs sm:text-sm text-[var(--text-main)]">
                            ₹${sweet.pricePerKg} <span class="text-[10px] font-normal text-[var(--text-light)]">/${sweet.unit}</span>
                          </span>

                          <!-- Add or In-Cart Counter -->
                          ${inCartItem ? `
                            <div class="flex items-center gap-1 bg-[var(--bg-subtle)] p-0.5 rounded-lg border border-[var(--border-color)]">
                              <button data-dec-cart="${sweet.id}" class="w-6 h-6 rounded bg-[var(--bg-surface)] text-[var(--text-main)] font-bold text-xs hover:bg-[var(--brand-primary)] hover:text-white flex items-center justify-center transition-colors">-</button>
                              <span class="text-xs font-extrabold px-1 text-[var(--brand-primary)]">${inCartItem.qty}</span>
                              <button data-inc-cart="${sweet.id}" class="w-6 h-6 rounded bg-[var(--bg-surface)] text-[var(--text-main)] font-bold text-xs hover:bg-[var(--brand-primary)] hover:text-white flex items-center justify-center transition-colors">+</button>
                            </div>
                          ` : `
                            <button 
                              data-add-to-pos="${sweet.id}"
                              class="w-7 h-7 rounded-lg bg-[var(--brand-primary-light)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white font-bold text-sm flex items-center justify-center transition-all shadow-xs"
                              title="Add to cart"
                            >
                              +
                            </button>
                          `}
                        </div>

                        <!-- Dual-Unit Weighing Quick Chips (100g, 250g, 500g, 1kg) -->
                        <div class="grid grid-cols-4 gap-1 text-[10px] font-semibold text-[var(--text-muted)]">
                          <button data-add-weight="${sweet.id}" data-weight="0.1" class="py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors text-center" title="Add 100g">
                            100g
                          </button>
                          <button data-add-weight="${sweet.id}" data-weight="0.25" class="py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors text-center" title="Add 250g">
                            250g
                          </button>
                          <button data-add-weight="${sweet.id}" data-weight="0.5" class="py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors text-center" title="Add 500g">
                            500g
                          </button>
                          <button data-add-weight="${sweet.id}" data-weight="1.0" class="py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors text-center" title="Add 1kg">
                            1kg
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Live Cart Panel (4 Columns) with Hold & Resume Parked Bills -->
        <div class="lg:col-span-4 bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-color)] shadow-subtle flex flex-col justify-between sticky top-20">
          <div>
            <!-- Cart Header & Rush Queue (Parked Bills) -->
            <div class="border-b border-[var(--border-color)] pb-3 mb-4 space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-bold text-[var(--text-main)]">Active Cart</h3>
                  <span class="px-2 py-0.5 rounded-full bg-[var(--brand-primary-light)] text-[var(--brand-primary)] text-xs font-bold">
                    ${posCart.length} items
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  ${posCart.length > 0 ? `
                    <button id="pos-hold-bill-btn" class="text-xs font-semibold px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all flex items-center gap-1" title="Park current bill for rush orders">
                      <span>⏸️</span> Hold
                    </button>
                    <button id="clear-pos-cart-btn" class="text-xs font-semibold text-rose-500 hover:underline">Clear</button>
                  ` : ''}
                </div>
              </div>

              <!-- Parked Bills Status Bar (Rush Queue) -->
              ${parkedBills.length > 0 ? `
                <div class="flex items-center justify-between bg-amber-50/60 p-2 rounded-xl border border-amber-200 text-xs">
                  <span class="text-amber-900 font-semibold flex items-center gap-1">
                    <span>📌</span> <strong>${parkedBills.length}</strong> Parked Bill(s)
                  </span>
                  <button id="toggle-parked-bills-btn" class="text-xs font-bold text-[var(--brand-primary)] hover:underline">
                    Resume Order ↗
                  </button>
                </div>
              ` : ''}
            </div>

            <!-- Cart Items List -->
            <div class="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              ${posCart.length > 0 ? posCart.map(item => `
                <div class="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] text-xs">
                  <div class="flex items-center space-x-2.5">
                    <img 
                      src="${item.image}" 
                      alt="${item.name}" 
                      class="w-10 h-10 rounded-lg object-cover border border-[var(--border-color)] shadow-2xs"
                      onerror="this.src='${item.fallbackImage}'"
                    />
                    <div>
                      <p class="font-bold text-[var(--text-main)] leading-snug">${item.name}</p>
                      <p class="text-[10px] text-[var(--text-light)]">
                        ${item.qty >= 1 ? `${item.qty} ${item.unit}` : `${Math.round(item.qty * 1000)}g`} × ₹${item.rate}/${item.unit}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center space-x-3">
                    <div class="flex items-center gap-1 bg-[var(--bg-subtle)] rounded-lg p-0.5 border border-[var(--border-color)]">
                      <button data-dec-cart="${item.id}" class="w-5 h-5 flex items-center justify-center rounded bg-[var(--bg-surface)] text-[var(--text-main)] font-bold text-xs hover:bg-[var(--brand-primary)] hover:text-white transition-colors">-</button>
                      <span class="text-xs font-extrabold px-1.5">${item.qty}</span>
                      <button data-inc-cart="${item.id}" class="w-5 h-5 flex items-center justify-center rounded bg-[var(--bg-surface)] text-[var(--text-main)] font-bold text-xs hover:bg-[var(--brand-primary)] hover:text-white transition-colors">+</button>
                    </div>
                    <span class="font-bold text-[var(--text-main)] w-14 text-right">₹${Math.round(item.qty * item.rate)}</span>
                    <button data-remove-cart="${item.id}" class="text-stone-300 hover:text-rose-500 transition-colors p-1" title="Remove item">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                    </button>
                  </div>
                </div>
              `).join('') : `
                <div class="text-center py-10 text-[var(--text-light)]">
                  <div class="w-12 h-12 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center mx-auto mb-2 text-xl">🛍️</div>
                  <p class="font-medium text-xs">Counter cart is currently empty</p>
                  <p class="text-[10px] mt-0.5">Select delicious sweets or use quick weight buttons (100g, 250g, 500g, 1kg)</p>
                </div>
              `}
            </div>

            <!-- Optional Order Notes -->
            <div class="mt-4 pt-3 border-t border-[var(--border-color)]">
              <label class="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Add Note (Optional)</label>
              <input 
                id="pos-order-note"
                type="text" 
                placeholder="e.g. Festival gift packing, low sugar..." 
                class="w-full px-3 py-1.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] placeholder-[var(--text-light)] focus:bg-[var(--bg-surface)] focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>

            <!-- Financial Calculation Breakdown -->
            <div class="mt-4 bg-[var(--bg-subtle)] rounded-xl p-3.5 space-y-2 text-xs">
              <div class="flex justify-between text-[var(--text-muted)]">
                <span>Subtotal</span>
                <span class="font-bold text-[var(--text-main)]">₹${cartSubtotal}</span>
              </div>
              <div class="flex items-center justify-between text-[var(--text-muted)]">
                <span class="flex items-center gap-1">
                  Discount
                  <select id="pos-discount-select" class="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-1 text-[11px] font-bold">
                    <option value="0" ${discountPercent === 0 ? 'selected' : ''}>0%</option>
                    <option value="5" ${discountPercent === 5 ? 'selected' : ''}>5% (Regular)</option>
                    <option value="10" ${discountPercent === 10 ? 'selected' : ''}>10% (Festival)</option>
                    <option value="15" ${discountPercent === 15 ? 'selected' : ''}>15% (VIP Member)</option>
                  </select>
                </span>
                <span class="font-bold text-emerald-600">- ₹${discountAmount}</span>
              </div>
              <div class="flex justify-between text-[var(--text-muted)]">
                <span>GST (0% - Fresh Sweets Exemption)</span>
                <span class="text-[var(--text-main)]">₹0</span>
              </div>
              <div class="border-t border-[var(--border-color)] pt-2 flex justify-between font-extrabold text-sm sm:text-base text-[var(--text-main)]">
                <span>Total Payable</span>
                <span class="text-[var(--brand-primary)]">₹${totalPayable}</span>
              </div>
            </div>
          </div>

          <!-- Proceed to Checkout Action -->
          <button 
            id="pos-proceed-checkout-btn"
            ${posCart.length === 0 ? 'disabled' : ''}
            class="w-full mt-4 py-3 px-4 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98"
          >
            <span>Proceed to Checkout</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}
