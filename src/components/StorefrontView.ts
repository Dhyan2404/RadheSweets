// Public-Facing Customer Storefront Component for Radhe Sweets Ahmedabad
// Designed for patrons, sweet lovers, wedding gift planners, and online home delivery / takeaway orders.

export function renderStorefrontView(state: any) {
  const { sweets = [], branches = [], currentBranchId = 'br-1', shopInfo = {} } = state;
  const activeBranch = branches.find((b: any) => b.id === currentBranchId) || branches[0] || { name: 'Navrangpura Flagship' };
  const userCart = state.userCart || [];
  const cartCount = userCart.reduce((sum: number, it: any) => sum + (it.qty || 1), 0);
  const cartSubtotal = userCart.reduce((sum: number, it: any) => sum + (it.price * it.qty), 0);
  const activeDiet = state.customerDietFilter || 'All';
  const searchQuery = (state.customerSearchQuery || '').toLowerCase().trim();
  const freeThreshold = Number(shopInfo.freeDeliveryAbove) || 500;
  const stdDeliveryFee = Number(shopInfo.deliveryFee) || 40;
  const deliveryCharge = cartSubtotal >= freeThreshold ? 0 : stdDeliveryFee;

  // Filter sweets for consumer showcase
  const filteredSweets = sweets.filter((sw: any) => {
    const matchesDiet = 
      activeDiet === 'All' ? true :
      activeDiet === 'Ghee' ? (sw.category === 'Desi Ghee' || (sw.description || '').toLowerCase().includes('ghee')) :
      activeDiet === 'Kaju' ? (sw.category === 'Kaju & Dryfruit' || (sw.name || '').toLowerCase().includes('kaju') || (sw.name || '').toLowerCase().includes('pista')) :
      activeDiet === 'Mawa' ? (sw.category === 'Mawa / Milk' || sw.category === 'Bengali') :
      activeDiet === 'Namkeen' ? (sw.category === 'Namkeen & Farsan' || (sw.description || '').toLowerCase().includes('crispy')) :
      activeDiet === 'Hampers' ? (sw.category === 'Gift Boxes' || (sw.name || '').toLowerCase().includes('box') || (sw.name || '').toLowerCase().includes('hamper')) :
      activeDiet === 'Jain' ? (sw.isJain || (sw.description || '').toLowerCase().includes('jain') || sw.category !== 'Egg') : true;

    const matchesSearch = !searchQuery || 
      (sw.name || '').toLowerCase().includes(searchQuery) || 
      (sw.description || '').toLowerCase().includes(searchQuery);

    return matchesDiet && matchesSearch;
  });

  return `
    <div class="space-y-8 max-w-7xl mx-auto pb-16" data-purpose="customer-storefront">
      
      <!-- 1. Hero Showcase Banner -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#4A1E14] via-[#7B331E] to-[#C86D3B] text-white p-6 sm:p-10 md:p-14 shadow-2xl border border-amber-900/40">
        <!-- Decorative Traditional Gold Rangoli Motif Background -->
        <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-orange-500/15 blur-2xl pointer-events-none"></div>
        
        <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="space-y-4 max-w-2xl text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-200 shadow-xs">
              <span>🪔</span>
              <span>Ahmedabad’s Heritage Confectionery • Since 1984</span>
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-sm">
              Pure Shuddh Desi Ghee Sweets & Handcrafted Dry Fruit Delicacies
            </h1>

            <p class="text-sm sm:text-base text-amber-100/90 leading-relaxed font-normal">
              Slow-cooked in authentic Bilona cow ghee, Goan cashews, Kashmiri saffron, and organic dairy. Order fresh sweets online with express same-day doorstep delivery across Ahmedabad.
            </p>

            <!-- Trust Highlights Badges -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-semibold text-amber-200">
              <span class="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl border border-white/10">
                <span class="text-emerald-400">✓</span> 100% Pure Desi Ghee
              </span>
              <span class="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl border border-white/10">
                <span class="text-emerald-400">✓</span> Freshly Made Daily
              </span>
              <span class="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl border border-white/10">
                <span class="text-emerald-400">✓</span> FSSAI Certified (#${shopInfo.fssai || '10722026000412'})
              </span>
              <span class="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl border border-white/10">
                <span class="text-emerald-400">✓</span> Free Delivery &gt; ₹${freeThreshold}
              </span>
            </div>

            <!-- Call to Actions -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-4">
              <a 
                href="#sweets-menu-section" 
                class="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold text-sm sm:text-base shadow-xl hover:shadow-amber-400/25 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span>🛒 Order Sweets Online</span>
                <span class="text-xs">➔</span>
              </a>
              <button 
                type="button" 
                id="storefront-wedding-inquiry-btn"
                class="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🎁 Wedding & Corporate Hampers</span>
              </button>
              <button 
                type="button" 
                id="storefront-check-loyalty-btn"
                class="px-4 py-3.5 rounded-2xl bg-emerald-700/60 hover:bg-emerald-600/80 text-emerald-100 font-bold text-sm border border-emerald-400/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>⭐ Check Patron Loyalty / Khata</span>
              </button>
            </div>
          </div>

          <!-- Hero Visual Feature Card -->
          <div class="w-full lg:w-96 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-2xl text-stone-900 space-y-4">
            <div class="relative rounded-2xl overflow-hidden aspect-4/3 bg-amber-950/40 border border-white/15">
              <img 
                src="/assets/sweets/sw-1.png" 
                alt="Radhe Sweets Master Confection" 
                class="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                onerror="this.src='https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=600&auto=format&fit=crop&q=80'"
              />
              <span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-extrabold shadow-md">
                ⭐ Today’s Fresh Batch
              </span>
              <span class="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-amber-200 text-xs font-black">
                ₹900 / kg
              </span>
            </div>

            <div class="text-white space-y-1">
              <div class="flex justify-between items-center">
                <h3 class="font-extrabold text-base text-amber-100">Shuddh Silver Kaju Katli</h3>
                <span class="text-xs text-emerald-300 font-bold">In Stock</span>
              </div>
              <p class="text-xs text-amber-200/80">Made with 100% premium Goan cashews, pure silver vark, and natural sulfurless sugar.</p>
            </div>

            <div class="pt-1 flex gap-2">
              <button 
                type="button" 
                data-user-add-direct="sw-1" 
                class="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>➕ Add 500g to Bag (₹450)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Interactive Storefront Navigation Bar -->
      <section class="sticky top-20 z-20 bg-white/95 backdrop-blur-xl border border-[#F0ECE4] shadow-md rounded-2xl p-3.5 space-y-3" id="sweets-menu-section">
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          
          <!-- Category Filter Pills -->
          <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            ${[
              { id: 'All', label: 'All Sweets (100)', icon: '🍬' },
              { id: 'Ghee', label: 'Pure Desi Ghee', icon: '🥛' },
              { id: 'Kaju', label: 'Kaju & Dry Fruit', icon: '🥜' },
              { id: 'Mawa', label: 'Mawa & Bengali', icon: '🍮' },
              { id: 'Namkeen', label: 'Farsan & Namkeen', icon: '🥨' },
              { id: 'Hampers', label: 'Festive Hampers', icon: '🎁' },
              { id: 'Jain', label: 'Jain Friendly', icon: '🌿' }
            ].map(pill => `
              <button 
                type="button"
                data-customer-diet="${pill.id}"
                class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  activeDiet === pill.id
                    ? 'bg-[#C86D3B] text-white shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                }"
              >
                <span>${pill.icon}</span>
                <span>${pill.label}</span>
              </button>
            `).join('')}
          </div>

          <!-- Customer Live Search Bar & Cart View Trigger -->
          <div class="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <div class="relative w-full md:w-64">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input 
                id="customer-search-input"
                type="text" 
                placeholder="Search sweets by name..." 
                value="${state.customerSearchQuery || ''}"
                class="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#C86D3B] rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#C86D3B]/20"
              />
            </div>

            <!-- Customer Bag Trigger Button with Counter Badge -->
            <button 
              type="button" 
              id="storefront-open-bag-btn"
              class="relative px-4 py-2 rounded-xl bg-[#2A1F1D] hover:bg-[#3D2E2B] text-amber-200 font-extrabold text-xs shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>🛍️ Bag</span>
              <span class="px-1.5 py-0.2 rounded-full bg-[#C86D3B] text-white text-[11px] font-black">${cartCount}</span>
              <span class="hidden sm:inline text-white font-bold">• ₹${cartSubtotal}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 3. Sweets Showcase Grid -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-[#2A1F1D]">Fresh Handcrafted Sweets</h2>
            <p class="text-xs text-stone-500">Showing ${filteredSweets.length} items available for pickup or delivery from <strong>${activeBranch.name}</strong></p>
          </div>
          <span class="text-xs text-stone-400 font-semibold">100% Shuddh Shakahari (Pure Veg)</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          ${filteredSweets.map((sweet: any) => {
            const inBag = userCart.find((it: any) => it.id === sweet.id);
            const rateKg = sweet.pricePerKg || sweet.rate || 400;
            const isGhee = (sweet.description || '').toLowerCase().includes('ghee') || sweet.category === 'Desi Ghee';
            const isJain = sweet.isJain || (sweet.description || '').toLowerCase().includes('jain');

            return `
              <div class="bg-white rounded-2xl border border-[#F0ECE4] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1">
                <div>
                  <!-- Sweet Image Frame with Badges -->
                  <div class="relative aspect-4/3 bg-stone-100 overflow-hidden">
                    <img 
                      src="${sweet.image || `/assets/sweets/${sweet.id}.png`}" 
                      alt="${sweet.name}" 
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onerror="this.src='https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500&auto=format&fit=crop&q=80'"
                    />

                    <!-- Dietary & Authentic Badges -->
                    <div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span class="w-4 h-4 rounded-xs border-2 border-emerald-600 bg-white p-0.5 flex items-center justify-center shadow-xs" title="100% Pure Vegetarian">
                        <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                      </span>
                      ${isGhee ? `
                        <span class="px-2 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[9px] shadow-xs">
                          Desi Ghee
                        </span>
                      ` : ''}
                      ${isJain ? `
                        <span class="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[9px] shadow-xs">
                          Jain
                        </span>
                      ` : ''}
                    </div>

                    <div class="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white text-xs font-black">
                      ₹${rateKg} / kg
                    </div>
                  </div>

                  <!-- Details -->
                  <div class="p-4 space-y-2">
                    <div class="flex items-start justify-between gap-1">
                      <h3 class="font-extrabold text-sm sm:text-base text-[#2A1F1D] leading-tight group-hover:text-[#C86D3B] transition-colors">
                        ${sweet.name}
                      </h3>
                      <span class="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full shrink-0">
                        ${sweet.category || 'Traditional'}
                      </span>
                    </div>

                    <p class="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      ${sweet.description || 'Authentic traditional recipe made fresh daily with pure desi ghee and premium nuts.'}
                    </p>

                    <!-- Pack Sizes Selection (250g, 500g, 1kg) -->
                    <div class="pt-2">
                      <label class="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Select Pack Size:</label>
                      <div class="grid grid-cols-3 gap-1.5 text-center">
                        <button 
                          type="button" 
                          data-user-pack="0.25" 
                          data-sweet-id="${sweet.id}" 
                          class="py-1 rounded-lg border text-xs font-bold cursor-pointer transition-all hover:border-[#C86D3B] hover:text-[#C86D3B] ${
                            inBag && inBag.qty === 0.25 ? 'bg-orange-50 border-[#C86D3B] text-[#C86D3B]' : 'bg-stone-50 border-stone-200 text-stone-700'
                          }"
                        >
                          250g • ₹${Math.round(rateKg * 0.25)}
                        </button>
                        <button 
                          type="button" 
                          data-user-pack="0.5" 
                          data-sweet-id="${sweet.id}" 
                          class="py-1 rounded-lg border text-xs font-bold cursor-pointer transition-all hover:border-[#C86D3B] hover:text-[#C86D3B] ${
                            !inBag || inBag.qty === 0.5 ? 'bg-orange-50 border-[#C86D3B] text-[#C86D3B]' : 'bg-stone-50 border-stone-200 text-stone-700'
                          }"
                        >
                          500g • ₹${Math.round(rateKg * 0.5)}
                        </button>
                        <button 
                          type="button" 
                          data-user-pack="1" 
                          data-sweet-id="${sweet.id}" 
                          class="py-1 rounded-lg border text-xs font-bold cursor-pointer transition-all hover:border-[#C86D3B] hover:text-[#C86D3B] ${
                            inBag && inBag.qty === 1 ? 'bg-orange-50 border-[#C86D3B] text-[#C86D3B]' : 'bg-stone-50 border-stone-200 text-stone-700'
                          }"
                        >
                          1kg • ₹${rateKg}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add to Bag / Added State Actions -->
                <div class="p-4 pt-0">
                  <div class="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <button 
                      type="button"
                      data-storefront-add="${sweet.id}"
                      class="flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                        inBag 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
                          : 'bg-[#C86D3B] hover:bg-[#A84C1C] text-white shadow-xs'
                      }"
                    >
                      <span>${inBag ? '✓ Added in Bag' : '➕ Add to Bag'}</span>
                    </button>

                    <!-- Instant WhatsApp Quick Buy -->
                    <button 
                      type="button"
                      data-storefront-whatsapp-buy="${sweet.id}"
                      class="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all cursor-pointer"
                      title="Order this sweet instantly on WhatsApp"
                    >
                      <span class="text-sm">💬</span>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- 4. Why Ahmedabad Loves Radhe Sweets Trust Grid -->
      <section class="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-10 space-y-6">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <span class="text-xs font-black text-amber-800 uppercase tracking-widest">Tradition & Quality</span>
          <h2 class="text-2xl sm:text-3xl font-black text-[#2A1F1D]">Why Ahmedabad Prefers Radhe Sweets</h2>
          <p class="text-xs sm:text-sm text-stone-600">Serving pure, authentic taste for four decades with uncompromised quality standards.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold">
              🧈
            </div>
            <h4 class="font-extrabold text-stone-900 text-sm">100% Shuddh Bilona Ghee</h4>
            <p class="text-xs text-stone-500 leading-relaxed">No palm oil, no artificial flavors, and zero preservatives. Pure goodness in every bite.</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
            <div class="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center text-xl font-bold">
              👨‍🍳
            </div>
            <h4 class="font-extrabold text-stone-900 text-sm">Master Halwai Heritage</h4>
            <p class="text-xs text-stone-500 leading-relaxed">Traditional wood-fired mawa reduction and artisanal handcrafted techniques perfected over 40 years.</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
              🚚
            </div>
            <h4 class="font-extrabold text-stone-900 text-sm">Express Ahmedabad Delivery</h4>
            <p class="text-xs text-stone-500 leading-relaxed">Same-day fresh pack dispatch from Navrangpura, Satellite, and SG Highway branches.</p>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl font-bold">
              🎁
            </div>
            <h4 class="font-extrabold text-stone-900 text-sm">Festive & Wedding Hampers</h4>
            <p class="text-xs text-stone-500 leading-relaxed">Custom printed luxury sweet boxes with customized assortment for corporate events & marriages.</p>
          </div>
        </div>
      </section>

      <!-- 5. Ahmedabad Store Locator & Visiting Hours -->
      <section class="bg-white border border-[#F0ECE4] rounded-3xl p-6 sm:p-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <span class="text-[11px] font-black text-[#C86D3B] uppercase tracking-wider">Store Locations</span>
            <h3 class="text-xl font-black text-[#2A1F1D]">Visit Our Stores in Ahmedabad</h3>
          </div>
          <p class="text-xs text-stone-500">Open 7 Days • 8:00 AM to 10:30 PM</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${branches.map((b: any) => `
            <div class="p-4 rounded-2xl border border-stone-200 hover:border-[#C86D3B] transition-colors space-y-3 bg-stone-50/50">
              <div class="flex items-center justify-between">
                <h4 class="font-black text-stone-900 text-sm flex items-center gap-1.5">
                  <span>📍</span> ${b.name}
                </h4>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Open Now</span>
              </div>
              <p class="text-xs text-stone-600 leading-relaxed">
                ${b.address || 'Ahmedabad, Gujarat • Pure Sweets & Fresh Milk Counter'}
              </p>
              <div class="pt-1 flex items-center justify-between text-xs font-bold text-[#C86D3B]">
                <a href="tel:+919876543210" class="hover:underline flex items-center gap-1">
                  <span>📞</span> +91 98765 43210
                </a>
                <button 
                  type="button" 
                  data-switch-branch="${b.id}"
                  class="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-900 transition-all cursor-pointer"
                >
                  Order from Here ➔
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- 6. Floating Customer Bag Drawer / Modal (Only visible when open) -->
      ${state.showCustomerBagModal ? `
        <div id="customer-bag-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-scale-up">
            
            <!-- Drawer Header -->
            <div class="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div class="flex items-center gap-2">
                <span class="text-lg">🛍️</span>
                <div>
                  <h3 class="font-extrabold text-base text-[#2A1F1D] leading-tight">Your Sweet Bag</h3>
                  <p class="text-xs text-stone-500">${cartCount} item(s) selected from ${activeBranch.name}</p>
                </div>
              </div>
              <button type="button" id="close-customer-bag-btn" class="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer">
                ✕
              </button>
            </div>

            <!-- Bag Line Items List -->
            <div class="p-5 space-y-3 overflow-y-auto flex-1">
              ${userCart.length === 0 ? `
                <div class="text-center py-10 space-y-3">
                  <span class="text-4xl">🍬</span>
                  <p class="text-sm font-bold text-stone-700">Your sweet bag is currently empty.</p>
                  <p class="text-xs text-stone-400">Select any sweet from our catalog to add to your order.</p>
                  <button type="button" id="bag-empty-browse-btn" class="px-5 py-2 rounded-xl bg-[#C86D3B] text-white font-bold text-xs cursor-pointer">
                    Browse Sweets
                  </button>
                </div>
              ` : `
                ${userCart.map((item: any) => `
                  <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <img 
                      src="${item.image || `/assets/sweets/${item.id}.png`}" 
                      alt="${item.name}" 
                      class="w-12 h-12 rounded-lg object-cover bg-stone-200 shrink-0"
                      onerror="this.src='https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=200&auto=format&fit=crop&q=80'"
                    />
                    <div class="flex-1 min-w-0">
                      <h4 class="font-extrabold text-xs text-stone-900 truncate">${item.name}</h4>
                      <p class="text-[11px] text-stone-500">${item.weightLabel || `${item.qty}kg`} • ₹${item.price} per pack</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="font-extrabold text-sm text-[#C86D3B]">₹${item.price * item.qty}</span>
                      <button type="button" data-user-remove-cart="${item.id}" class="text-stone-400 hover:text-rose-600 text-xs p-1 cursor-pointer">
                        ✕
                      </button>
                    </div>
                  </div>
                `).join('')}
              `}
            </div>

            <!-- Customer Details & Order Form -->
            ${userCart.length > 0 ? `
              <div class="p-5 bg-stone-50 border-t border-stone-200 space-y-4">
                
                <!-- Delivery vs Pickup Switcher -->
                <div class="grid grid-cols-2 gap-2 p-1 bg-stone-200/80 rounded-xl text-xs font-bold">
                  <button 
                    type="button" 
                    id="bag-set-delivery-btn"
                    class="py-2 rounded-lg transition-all cursor-pointer ${
                      (state.customerDeliveryType || 'delivery') === 'delivery' 
                        ? 'bg-white text-[#C86D3B] shadow-2xs' 
                        : 'text-stone-600 hover:text-stone-900'
                    }"
                  >
                    🚚 Home Delivery (Ahmedabad)
                  </button>
                  <button 
                    type="button" 
                    id="bag-set-pickup-btn"
                    class="py-2 rounded-lg transition-all cursor-pointer ${
                      state.customerDeliveryType === 'pickup' 
                        ? 'bg-white text-[#C86D3B] shadow-2xs' 
                        : 'text-stone-600 hover:text-stone-900'
                    }"
                  >
                    🏪 Store Self-Pickup
                  </button>
                </div>

                <!-- Input Fields for Customer Contact -->
                <div class="space-y-2">
                  <div class="grid grid-cols-2 gap-2">
                    <input 
                      id="bag-customer-name" 
                      type="text" 
                      placeholder="Your Full Name *" 
                      value="${state.customerName || ''}"
                      class="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#C86D3B]"
                    />
                    <input 
                      id="bag-customer-phone" 
                      type="tel" 
                      placeholder="10-digit Mobile Number *" 
                      value="${state.customerPhone || ''}"
                      maxlength="10"
                      class="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#C86D3B]"
                    />
                  </div>

                  ${(state.customerDeliveryType || 'delivery') === 'delivery' ? `
                    <textarea 
                      id="bag-customer-address" 
                      rows="2" 
                      placeholder="Complete Ahmedabad Delivery Address with Flat/Society & Landmark *"
                      class="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#C86D3B]"
                    >${state.customerAddress || ''}</textarea>
                  ` : `
                    <div class="p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-xs text-orange-950 font-medium">
                      📍 Pickup Counter: <strong>${activeBranch.name}</strong> • ${activeBranch.address || 'Ahmedabad'}
                    </div>
                  `}
                </div>

                <!-- Bill Breakdown -->
                <div class="space-y-1.5 text-xs text-stone-600">
                  <div class="flex justify-between">
                    <span>Sweets Subtotal:</span>
                    <span class="font-bold text-stone-900">₹${cartSubtotal}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span class="font-bold text-emerald-600">${deliveryCharge === 0 ? `FREE (Orders &gt; ₹${freeThreshold})` : `₹${stdDeliveryFee}`}</span>
                  </div>
                  <div class="flex justify-between text-sm font-black text-stone-900 border-t border-stone-200 pt-2">
                    <span>Total Amount:</span>
                    <span class="text-[#C86D3B]">₹${cartSubtotal + deliveryCharge}</span>
                  </div>
                </div>

                <!-- Action Buttons: WhatsApp Order & Direct Online Order -->
                <div class="space-y-2 pt-1">
                  <button 
                    type="button" 
                    id="bag-submit-whatsapp-btn"
                    class="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>💬 Order via WhatsApp (Instant Confirmation)</span>
                  </button>

                  <button 
                    type="button" 
                    id="bag-submit-online-btn"
                    class="w-full py-3 px-4 bg-[#C86D3B] hover:bg-[#A84C1C] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>⚡ Place Online Order (Pay on Delivery / UPI)</span>
                  </button>
                </div>

              </div>
            ` : ''}

          </div>
        </div>
      ` : ''}

      <!-- 7. Patron Khata & Loyalty Points Modal -->
      ${state.showLoyaltyCheckModal ? `
        <div id="loyalty-modal-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scale-up">
            <div class="flex items-center justify-between border-b border-stone-100 pb-3">
              <div class="flex items-center gap-2">
                <span class="text-xl">⭐</span>
                <div>
                  <h3 class="font-extrabold text-base text-[#2A1F1D]">Patron Loyalty & Khata</h3>
                  <p class="text-xs text-stone-400">Lookup VIP benefits & credit ledger</p>
                </div>
              </div>
              <button type="button" id="close-loyalty-modal-btn" class="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs cursor-pointer">
                ✕
              </button>
            </div>

            <div class="space-y-3">
              <label class="block text-xs font-bold text-stone-700">Enter Your 10-Digit Mobile Number:</label>
              <div class="flex gap-2">
                <input 
                  id="loyalty-search-phone" 
                  type="tel" 
                  placeholder="e.g. 9876543210" 
                  maxlength="10" 
                  class="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-900 focus:outline-none focus:border-[#C86D3B]"
                />
                <button 
                  type="button" 
                  id="loyalty-lookup-submit-btn" 
                  class="px-4 py-2 bg-[#C86D3B] hover:bg-[#A84C1C] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Lookup
                </button>
              </div>
            </div>

            <!-- Query Result Container -->
            <div id="loyalty-query-result" class="space-y-3 pt-2">
              ${renderLoyaltyResult(state.loyaltyQueryResult)}
            </div>
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

function renderLoyaltyResult(result: any) {
  if (!result) {
    return `
      <div class="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-center space-y-1">
        <p class="text-xs font-bold text-amber-900">✨ Earn 1 Loyalty Point for every ₹100 spent</p>
        <p class="text-[11px] text-amber-700">Redeem points on festive gift hampers & dry fruit boxes!</p>
      </div>
    `;
  }

  if (result.notFound) {
    return `
      <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
        <p class="text-xs font-bold text-rose-800">No patron account found for this mobile.</p>
        <p class="text-[11px] text-rose-600">Place an order or dial your number at our counter to activate welcome 50 points!</p>
      </div>
    `;
  }

  return `
    <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
      <div class="flex items-center justify-between border-b border-emerald-200/60 pb-2">
        <div>
          <h4 class="font-extrabold text-sm text-emerald-950">${result.name}</h4>
          <p class="text-[11px] text-emerald-700">${result.phone} • Tier: <strong>${result.tier || 'Regular'}</strong></p>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-xs">
          ⭐ ${result.loyaltyPoints || 0} Points
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="p-2.5 bg-white rounded-xl border border-emerald-100">
          <span class="text-stone-400 block text-[10px]">Total Orders</span>
          <span class="font-black text-stone-900">${result.totalOrders || 0} visits</span>
        </div>
        <div class="p-2.5 bg-white rounded-xl border border-emerald-100">
          <span class="text-stone-400 block text-[10px]">Khata Balance</span>
          <span class="font-black ${(result.khataBalance || 0) > 0 ? 'text-amber-700' : 'text-emerald-700'}">
            ₹${(result.khataBalance || 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  `;
}
