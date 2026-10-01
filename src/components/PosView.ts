// Point of Sale (POS / High-Speed Counter Billing) Component
// Features 100 Authentic Mithais with Image Sprite Support, Quick Weight Chips,
// and Instant Zero-Scroll Mobile Sticky Checkout Bar + Slide-up Cart Drawer.

export function renderPosView(state) {
  const { 
    sweets = [], 
    activeCategory = 'All', 
    selectedCustomer, 
    posCart = [], 
    posSearchQuery = '', 
    discountPercent = 0,
    parkedBills = [],
    selectedWeightUnit = 'kg', // 'kg' or 'g'
    showMobileCartSheet = false
  } = state;

  const categories = [
    "All", 
    "Kaju & Dry Fruit", 
    "Ladoo", 
    "Barfi & Peda", 
    "Bengali & Chhena", 
    "Desi Ghee & Fried", 
    "Halwa", 
    "Traditional & Milk", 
    "Traditional & Flaky", 
    "Traditional & Ghee", 
    "Mawa & Khoya",
    "Beverages"
  ];

  // Filter sweets by category and search
  const filteredSweets = sweets.filter(item => {
    const matchesCategory = !activeCategory || activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !posSearchQuery || 
      item.name.toLowerCase().includes(posSearchQuery.toLowerCase()) ||
      (item.tagline && item.tagline.toLowerCase().includes(posSearchQuery.toLowerCase())) ||
      (item.num && String(item.num) === posSearchQuery.trim());
    return matchesCategory && matchesSearch;
  });

  const cartSubtotal = posCart.reduce((sum, item) => sum + (item.rate * item.qty), 0);
  const discountAmount = Math.round((cartSubtotal * (discountPercent || 0)) / 100);
  const totalPayable = Math.max(0, cartSubtotal - discountAmount);

  return `
    <div class="space-y-5 select-none relative" data-purpose="pos-master-container">
      <!-- POS Top Header with Status & Stepper Progress -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h2 class="text-2xl font-bold text-[var(--text-main)] tracking-tight">Counter POS &amp; Billing</h2>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync (${sweets.length} Mithais)
            </span>
          </div>
          <p class="text-xs text-[var(--text-muted)] mt-0.5">High-speed dual-unit billing with 100 traditional mithais</p>
        </div>

        <!-- 3-Step Breadcrumb Flow -->
        <div class="flex items-center space-x-2 text-xs font-semibold">
          <span class="flex items-center gap-1.5 px-3 py-1 rounded-full ${selectedCustomer ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-700 border border-stone-200'}">
            <span class="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">1</span>
            ${selectedCustomer ? selectedCustomer.name.split(' ')[0] : 'Walk-in (OTC)'}
          </span>
          <span class="text-[var(--text-light)]">→</span>
          <span class="flex items-center gap-1.5 px-3 py-1 rounded-full ${posCart.length > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]'}">
            <span class="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">2</span>
            Add Sweets (${posCart.length})
          </span>
          <span class="text-[var(--text-light)]">→</span>
          <button id="pos-header-checkout-btn" class="flex items-center gap-1.5 px-3 py-1 rounded-full ${posCart.length > 0 ? 'bg-[var(--brand-primary)] text-white shadow-xs cursor-pointer active:scale-95' : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] cursor-not-allowed'} transition-all">
            <span class="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">3</span>
            Checkout
          </button>
        </div>
      </section>

      <!-- Main POS Grid: 8 Cols Sweets Catalog + 4 Cols Cart (Desktop) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Sweets Selection Area (8 Columns) -->
        <div class="lg:col-span-8 space-y-4">
          <!-- Step 1: Customer Selection Bar with Khata / Loyalty Status -->
          <div class="bg-[var(--bg-surface)] p-3.5 sm:p-4 rounded-2xl border border-[var(--border-color)] shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center space-x-3 w-full sm:w-auto">
              <span class="w-9 h-9 rounded-2xl ${selectedCustomer ? 'bg-emerald-600' : 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)]'} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                ${selectedCustomer ? '✓' : '👤'}
              </span>
              <div>
                <div class="flex items-center gap-2">
                  <p class="text-xs font-bold text-[var(--text-main)]">
                    ${selectedCustomer ? 'Attached Customer' : 'Walk-in Counter Customer (Cash / OTC)'}
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
                  <p class="text-[11px] text-[var(--text-muted)] font-medium">Standard OTC sales. Dial customer number or search name for loyalty &amp; khata</p>
                `}
              </div>
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              ${selectedCustomer ? `
                <button 
                  type="button" 
                  id="pos-clear-customer-btn" 
                  class="px-2.5 py-1.5 text-stone-400 hover:text-rose-500 text-xs font-semibold rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove customer and return to Walk-in"
                >
                  ✕ Detach
                </button>
              ` : ''}
              <button 
                type="button" 
                id="pos-select-customer-btn" 
                class="px-3.5 py-2 bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white border border-[var(--border-color)] text-[var(--text-main)] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>📞</span>
                <span>${selectedCustomer ? 'Switch Customer' : 'Dial Number / Attach Customer'}</span>
              </button>
            </div>
          </div>

          <!-- Step 2: Catalog Toolbar with Category Tabs, Search & Dual-Unit Weighing Mode -->
          <div class="space-y-3">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <!-- Category Filter Pills (Horizontal Scrollable) -->
              <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                ${categories.map(cat => `
                  <button 
                    data-pos-category="${cat}"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      activeCategory === cat 
                        ? 'bg-[var(--brand-primary)] text-white shadow-xs scale-102' 
                        : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]'
                    }"
                  >
                    ${cat}
                  </button>
                `).join('')}
              </div>

              <!-- Controls: Weighing Unit Toggle + Search -->
              <div class="flex items-center gap-2 shrink-0">
                <!-- Dual-Unit Selector Toggle (g vs kg) -->
                <div class="flex items-center bg-[var(--bg-subtle)] p-0.5 rounded-xl border border-[var(--border-color)] text-xs font-bold">
                  <button 
                    id="unit-toggle-kg"
                    class="px-2.5 py-1 rounded-lg transition-all cursor-pointer ${selectedWeightUnit === 'kg' ? 'bg-[var(--brand-primary)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}"
                    title="Weigh in Kilograms"
                  >
                    kg
                  </button>
                  <button 
                    id="unit-toggle-g"
                    class="px-2.5 py-1 rounded-lg transition-all cursor-pointer ${selectedWeightUnit === 'g' ? 'bg-[var(--brand-primary)] text-white shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}"
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
                    placeholder="Search 100 sweets..." 
                    class="w-full pl-9 pr-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] placeholder-[var(--text-light)] focus:outline-none focus:border-[var(--brand-primary)]"
                  />
                </div>
              </div>
            </div>

            <!-- Sweets Count Subtitle -->
            <div class="flex items-center justify-between text-xs text-stone-500 font-medium px-1">
              <span>Showing <strong>${filteredSweets.length}</strong> of ${sweets.length} Mithais</span>
              ${activeCategory !== 'All' ? `
                <button data-pos-category="All" class="text-[var(--brand-primary)] hover:underline font-bold text-[11px] cursor-pointer">
                  Clear Filter (Show All)
                </button>
              ` : ''}
            </div>

            <!-- Sweets Cards Grid (Touch Speed Grid with Margin and Quick Weight Chips) -->
            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 pb-20 lg:pb-0">
              ${filteredSweets.map(sweet => {
                const inCartItem = posCart.find(i => i.id === sweet.id);
                const hasSprite = sweet.gridPosX !== undefined && sweet.gridPosY !== undefined;

                return `
                  <div class="sweet-card flex flex-col justify-between group bg-white border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all">
                    <!-- Image Thumbnail cropped to exact size for each sweet -->
                    <div class="relative h-28 sm:h-32 overflow-hidden bg-stone-100">
                      <img 
                        src="${sweet.image || `/assets/sweets/${sweet.id}.png`}" 
                        alt="${sweet.name}" 
                        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onerror="this.src='/assets/sweets/${sweet.id}.png'"
                      />

                      <!-- Number & Stock Badge -->
                      <div class="absolute top-2 left-2 flex items-center gap-1">
                        ${sweet.num ? `
                          <span class="px-1.5 py-0.5 rounded text-[9px] font-black bg-black/75 text-amber-300 shadow-2xs backdrop-blur-xs">
                            #${sweet.num}
                          </span>
                        ` : ''}
                        <span class="px-1.5 py-0.5 rounded text-[9px] font-bold shadow-2xs ${
                          sweet.stockStatus === 'Low Stock' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }">
                          ${sweet.stock}${sweet.unit}
                        </span>
                      </div>
                      
                      <!-- Category / Tag Badge -->
                      <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-900/80 text-amber-200 backdrop-blur-xs shadow-2xs">
                        ${sweet.badge || 'Fresh'}
                      </span>
                    </div>

                    <div class="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 class="font-bold text-xs sm:text-sm text-[var(--text-main)] leading-snug line-clamp-1" title="${sweet.name}">
                          ${sweet.name}
                        </h4>
                        <div class="flex items-center justify-between text-[10px] text-[var(--text-light)] mt-0.5">
                          <span class="font-medium text-stone-500 truncate mr-1">${sweet.tagline || sweet.category}</span>
                          <span class="text-amber-700 font-semibold shrink-0">★ Shuddh</span>
                        </div>
                      </div>

                      <!-- Pricing and Quick Add Buttons -->
                      <div class="mt-2.5 pt-2 border-t border-[var(--border-subtle)]">
                        <div class="flex items-center justify-between mb-2">
                          <span class="font-extrabold text-xs sm:text-sm text-[var(--text-main)]">
                            ₹${sweet.pricePerKg} <span class="text-[10px] font-normal text-[var(--text-light)]">/${sweet.unit}</span>
                          </span>

                          <!-- Add or In-Cart Counter -->
                          ${inCartItem ? `
                            <div class="flex items-center gap-1 bg-[var(--bg-subtle)] p-0.5 rounded-lg border border-[var(--border-color)]">
                              <button data-dec-cart="${sweet.id}" class="w-6 h-6 rounded bg-[var(--bg-surface)] text-[var(--text-main)] font-bold text-xs hover:bg-[var(--brand-primary)] hover:text-white flex items-center justify-center transition-colors cursor-pointer">-</button>
                              <span class="text-xs font-extrabold px-1 text-[var(--brand-primary)]">${inCartItem.qty}</span>
                              <button data-inc-cart="${sweet.id}" class="w-6 h-6 rounded bg-[var(--bg-surface)] text-[var(--text-main)] font-bold text-xs hover:bg-[var(--brand-primary)] hover:text-white flex items-center justify-center transition-colors cursor-pointer">+</button>
                            </div>
                          ` : `
                            <button 
                              data-add-to-pos="${sweet.id}"
                              class="w-7 h-7 rounded-lg bg-[var(--brand-primary-light)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white font-bold text-sm flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-90"
                              title="Add to cart"
                            >
                              +
                            </button>
                          `}
                        </div>

                        <!-- Dual-Unit Weighing Quick Chips (250g, 500g, 750g, 1kg) -->
                        <div class="grid grid-cols-4 gap-1 text-[10px] font-semibold text-[var(--text-muted)]">
                          <button data-add-weight="${sweet.id}" data-weight="0.25" class="py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors text-center cursor-pointer active:scale-95" title="Add 250g">
                            250g
                          </button>
                          <button data-add-weight="${sweet.id}" data-weight="0.5" class="py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors text-center cursor-pointer active:scale-95" title="Add 500g">
                            500g
                          </button>
                          <button data-add-weight="${sweet.id}" data-weight="0.75" class="py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors text-center cursor-pointer active:scale-95" title="Add 750g">
                            750g
                          </button>
                          <button data-add-weight="${sweet.id}" data-weight="1.0" class="py-1 rounded bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors text-center cursor-pointer active:scale-95" title="Add 1kg">
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

        <!-- Live Cart Panel (Desktop 4 Columns) with Hold & Resume Parked Bills -->
        <div class="hidden lg:flex lg:col-span-4 bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-color)] shadow-subtle flex-col justify-between sticky top-20">
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
                    <button id="pos-hold-bill-btn" class="text-xs font-semibold px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all flex items-center gap-1 cursor-pointer" title="Park current bill for rush orders">
                      <span>⏸️</span> Hold
                    </button>
                    <button id="clear-pos-cart-btn" class="text-xs font-semibold text-rose-500 hover:underline cursor-pointer">Clear</button>
                  ` : ''}
                </div>
              </div>

              <!-- Parked Bills Status Bar (Rush Queue) -->
              ${parkedBills.length > 0 ? `
                <div class="flex items-center justify-between bg-amber-50/60 p-2 rounded-xl border border-amber-200 text-xs">
                  <span class="text-amber-900 font-semibold flex items-center gap-1">
                    <span>📌</span> <strong>${parkedBills.length}</strong> Parked Bill(s)
                  </span>
                  <button id="toggle-parked-bills-btn" class="text-xs font-bold text-[var(--brand-primary)] hover:underline cursor-pointer">
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
                      src="${item.image || `/assets/sweets/${item.id}.png`}" 
                      alt="${item.name}" 
                      class="w-10 h-10 rounded-lg object-cover border border-[var(--border-color)] shadow-2xs"
                      onerror="this.src='/assets/sweets/${item.id}.png'"
                    />
                    <div>
                      <p class="font-bold text-[var(--text-main)] leading-snug">${item.name}</p>
                      <p class="text-[10px] text-[var(--text-light)]">
                        ${item.qty >= 1 ? `${item.qty} ${item.unit}` : `${Math.round(item.qty * 1000)}g`} × ₹${item.rate}/${item.unit}
                      </p>
                      <!-- Preset Chips in Cart -->
                      <div class="flex items-center gap-1 mt-1">
                        ${[0.25, 0.5, 0.75, 1.0].map(w => `
                          <button 
                            type="button"
                            data-add-weight="${item.id}" 
                            data-weight="${w}" 
                            class="px-1.5 py-0.2 rounded text-[9px] font-bold transition-all cursor-pointer ${
                              Math.abs(item.qty - w) < 0.001 
                                ? 'bg-amber-600 text-white shadow-2xs' 
                                : 'bg-[var(--bg-subtle)] hover:bg-stone-200 text-stone-600'
                            }"
                          >
                            ${w >= 1 ? `${w}kg` : `${Math.round(w * 1000)}g`}
                          </button>
                        `).join('')}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-3">
                    <div class="flex items-center gap-1 bg-[var(--bg-subtle)] rounded-lg p-0.5 border border-[var(--border-color)]">
                      <button data-dec-cart="${item.id}" class="w-5 h-5 flex items-center justify-center rounded bg-[var(--bg-surface)] text-[var(--text-main)] font-bold text-xs hover:bg-[var(--brand-primary)] hover:text-white transition-colors cursor-pointer">-</button>
                      <span class="text-xs font-extrabold px-1.5">${item.qty}</span>
                      <button data-inc-cart="${item.id}" class="w-5 h-5 flex items-center justify-center rounded bg-[var(--bg-surface)] text-[var(--text-main)] font-bold text-xs hover:bg-[var(--brand-primary)] hover:text-white transition-colors cursor-pointer">+</button>
                    </div>
                    <span class="font-bold text-[var(--text-main)] w-14 text-right">₹${Math.round(item.qty * item.rate)}</span>
                    <button data-remove-cart="${item.id}" class="text-stone-300 hover:text-rose-500 transition-colors p-1 cursor-pointer" title="Remove item">
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
                  <select id="pos-discount-select" class="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded px-1 text-[11px] font-bold cursor-pointer">
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
            class="w-full mt-4 py-3 px-4 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- MOBILE ZERO-SCROLL INSTANT CHECKOUT SUITE                -->
      <!-- Pinned Floating Action Bar & Slide-up Cart Bottom Sheet  -->
      <!-- ======================================================== -->

      <!-- 1. Sticky Floating Mobile Checkout Bar (Always Visible on Mobile when items in cart) -->
      ${posCart.length > 0 ? `
        <aside 
          id="mobile-floating-checkout-bar" 
          class="lg:hidden fixed bottom-[4.25rem] inset-x-3 z-30 bg-gradient-to-r from-[#C86D3B] via-[#BD5E2A] to-[#A84C1C] text-white p-3 rounded-2xl shadow-[0_8px_25px_rgba(200,109,59,0.5)] border border-orange-300/40 flex items-center justify-between animate-card-pop"
          aria-label="Mobile Sticky Checkout Bar"
        >
          <button id="mobile-cart-toggle-btn" class="flex items-center gap-2.5 text-left cursor-pointer active:scale-95 transition-transform">
            <div class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-extrabold text-base text-white shadow-2xs">
              🛒
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-white leading-none">${posCart.length} item${posCart.length > 1 ? 's' : ''}</span>
                <span class="text-[10px] text-amber-200 font-semibold bg-white/10 px-1.5 py-0.5 rounded-full">View Items</span>
              </div>
              <p class="text-base font-black text-amber-200 leading-tight mt-0.5">₹${totalPayable}</p>
            </div>
          </button>

          <div class="flex items-center gap-2">
            <button 
              id="mobile-bar-pay-btn" 
              class="px-4 py-2 rounded-xl bg-white text-[#C86D3B] hover:bg-orange-50 font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Checkout ➔</span>
            </button>
          </div>
        </aside>
      ` : ''}

      <!-- 2. Mobile Slide-Up Cart Bottom Sheet Modal -->
      ${showMobileCartSheet ? `
        <div id="mobile-cart-sheet-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end lg:hidden animate-fadeIn">
          <div class="bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-stone-200 animate-slide-up">
            <!-- Sheet Handle & Header -->
            <div class="p-4 border-b border-stone-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-base font-extrabold text-[#2A1F1D]">🛒 Active Cart</span>
                <span class="px-2 py-0.5 rounded-full bg-orange-100 text-[#C86D3B] font-bold text-xs">
                  ${posCart.length} items
                </span>
              </div>
              <button id="close-mobile-cart-sheet-btn" class="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center font-bold text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <!-- Sheet Cart Items -->
            <div class="p-4 space-y-3 overflow-y-auto max-h-[45vh]">
              ${posCart.length > 0 ? posCart.map(item => `
                <div class="flex items-center justify-between py-2 border-b border-stone-100 text-xs">
                  <div class="flex items-center space-x-2.5">
                    <img 
                      src="${item.image || `/assets/sweets/${item.id}.png`}" 
                      alt="${item.name}" 
                      class="w-10 h-10 rounded-lg object-cover border border-stone-200 shadow-2xs"
                      onerror="this.src='/assets/sweets/${item.id}.png'"
                    />
                    <div>
                      <p class="font-bold text-[#2A1F1D]">${item.name}</p>
                      <p class="text-[10px] text-stone-500">
                        ${item.qty >= 1 ? `${item.qty} ${item.unit}` : `${Math.round(item.qty * 1000)}g`} × ₹${item.rate}/${item.unit}
                      </p>
                      <div class="flex items-center gap-1 mt-1">
                        ${[0.25, 0.5, 0.75, 1.0].map(w => `
                          <button 
                            type="button"
                            data-add-weight="${item.id}" 
                            data-weight="${w}" 
                            class="px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                              Math.abs(item.qty - w) < 0.001 
                                ? 'bg-amber-600 text-white shadow-2xs' 
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }"
                          >
                            ${w >= 1 ? `${w}kg` : `${Math.round(w * 1000)}g`}
                          </button>
                        `).join('')}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-2.5">
                    <div class="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                      <button data-dec-cart="${item.id}" class="w-6 h-6 flex items-center justify-center rounded bg-white text-stone-800 font-bold text-xs hover:bg-[#C86D3B] hover:text-white transition-colors cursor-pointer">-</button>
                      <span class="text-xs font-extrabold px-1.5">${item.qty}</span>
                      <button data-inc-cart="${item.id}" class="w-6 h-6 flex items-center justify-center rounded bg-white text-stone-800 font-bold text-xs hover:bg-[#C86D3B] hover:text-white transition-colors cursor-pointer">+</button>
                    </div>
                    <span class="font-bold text-[#2A1F1D] w-12 text-right">₹${Math.round(item.qty * item.rate)}</span>
                    <button data-remove-cart="${item.id}" class="text-stone-400 hover:text-rose-500 p-1 cursor-pointer">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                    </button>
                  </div>
                </div>
              `).join('') : `
                <div class="text-center py-6 text-stone-400 text-xs font-medium">Cart is currently empty</div>
              `}
            </div>

            <!-- Sheet Footer Breakdown & Checkout -->
            <div class="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
              <div class="flex justify-between text-xs text-stone-600">
                <span>Subtotal</span>
                <span class="font-bold text-stone-900">₹${cartSubtotal}</span>
              </div>
              <div class="flex justify-between items-center text-xs text-stone-600">
                <span>Discount</span>
                <span class="font-bold text-emerald-600">- ₹${discountAmount}</span>
              </div>
              <div class="border-t border-stone-200 pt-2 flex justify-between font-extrabold text-base text-stone-900">
                <span>Total Payable</span>
                <span class="text-[#C86D3B]">₹${totalPayable}</span>
              </div>

              <button 
                id="mobile-sheet-proceed-checkout-btn"
                ${posCart.length === 0 ? 'disabled' : ''}
                class="w-full py-3.5 px-4 bg-[#C86D3B] hover:bg-[#A84C1C] disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>Proceed to Pay ₹${totalPayable}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}
