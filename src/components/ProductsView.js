// Products Catalog & Inventory Component
// Clean 100% BOM-Free, Enterprise Polish with shadcn-ui Tokens & Framer Motion Springs

export function renderProductsView(state) {
  const { sweets, productsFilterCategory, productsSearchQuery, rawMaterials = [] } = state;

  const categories = ["All", "Sweets", "Snacks", "Beverages", "Raw Materials"];
  const isRawMaterialTab = productsFilterCategory === 'Raw Materials';

  const filteredProducts = sweets.filter(item => {
    const matchesCategory = !productsFilterCategory || productsFilterCategory === 'All' || item.category === productsFilterCategory;
    const matchesSearch = !productsSearchQuery || item.name.toLowerCase().includes(productsSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Color palette for sweet avatars matching reference design
  const getBadgeColors = (code) => {
    switch (code) {
      case 'KK': return 'bg-amber-100/80 border-amber-300 text-amber-900';
      case 'RG': return 'bg-orange-100/80 border-orange-300 text-orange-900';
      case 'GJ': return 'bg-amber-900/10 border-amber-900/30 text-amber-950';
      case 'ML': return 'bg-yellow-100 border-yellow-300 text-amber-800';
      case 'KP': return 'bg-amber-100 border-amber-300 text-amber-900';
      case 'MC': return 'bg-orange-100/70 border-orange-300 text-orange-950';
      case 'DF': return 'bg-emerald-100/80 border-emerald-300 text-emerald-900';
      case 'SP': return 'bg-yellow-50 border-amber-200 text-amber-900';
      case 'SM': return 'bg-orange-50 border-orange-200 text-amber-900';
      default: return 'bg-stone-100 border-stone-300 text-stone-800';
    }
  };

  return `
    <div class="space-y-6 animate-fadeIn">
      <!-- Header -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2.5">
            <h2 class="text-2xl font-black text-[var(--text-main)] tracking-tight">Products & Stock Inventory</h2>
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Live Catalog
            </span>
          </div>
          <p class="text-xs text-[var(--text-muted)] mt-0.5">Manage confectionery sweet catalog, fresh batches, shelf stock & inventory levels</p>
        </div>

        <div class="flex items-center gap-2">
          <button id="open-add-product-modal-btn" class="spring-btn px-4 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto">
            <span>+</span> Add Product
          </button>
        </div>
      </section>

      <!-- Category Filter Pills & Search Bar -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
          ${categories.map(cat => `
            <button 
              data-products-category="${cat}"
              class="spring-btn px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                (productsFilterCategory || 'All') === cat 
                  ? 'bg-[var(--brand-primary)] text-white shadow-xs' 
                  : 'bg-white text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--text-main)]'
              }"
            >
              ${cat === 'Raw Materials' ? '🌾 Raw Materials & PO' : cat}
            </button>
          `).join('')}
        </div>

        <div class="relative w-full sm:max-w-xs">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </span>
          <input 
            id="products-search-input"
            type="text" 
            value="${productsSearchQuery || ''}"
            placeholder="Search products or ingredients..." 
            class="w-full pl-9 pr-3 py-2 bg-white border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-[var(--brand-primary)] transition-all"
          />
        </div>
      </section>

      ${isRawMaterialTab ? `
        <!-- Raw Material Stock Ledger Table -->
        <section class="bg-white rounded-2xl border border-[var(--border-color)] shadow-subtle overflow-hidden space-y-4 p-5">
          <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div>
              <h3 class="text-sm font-bold text-[var(--text-main)]">Raw Material Stock Ledger</h3>
              <p class="text-[11px] text-[var(--text-muted)]">Inward purchase costs, reorder warnings & shelf life</p>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              8 Tracked Ingredients
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-stone-50/70 border-b border-[var(--border-color)] text-stone-500 font-bold text-[10px] uppercase tracking-wider">
                  <th class="py-3 px-4">Ingredient / Item</th>
                  <th class="py-3 px-3 text-center">Available Balance</th>
                  <th class="py-3 px-3 text-center">Unit Cost</th>
                  <th class="py-3 px-3 text-center">Reorder Threshold</th>
                  <th class="py-3 px-3 text-center">Shelf Life / Expiry</th>
                  <th class="py-3 px-3 text-center">Status</th>
                  <th class="py-3 px-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100">
                ${rawMaterials.map(rm => {
                  const isLow = rm.stock <= rm.reorderLevel;
                  return `
                    <tr class="hover:bg-amber-50/30 transition-colors">
                      <td class="py-3 px-4">
                        <p class="font-bold text-[var(--text-main)]">${rm.name}</p>
                        <span class="text-[10px] font-mono text-[var(--brand-primary)]">${rm.id}</span>
                      </td>
                      <td class="py-3 px-3 text-center font-extrabold text-[var(--text-main)] text-sm tabular-nums">
                        ${rm.stock} ${rm.unit}
                      </td>
                      <td class="py-3 px-3 text-center font-semibold text-[var(--text-muted)] tabular-nums">
                        ₹${rm.unitCost}/${rm.unit.replace('boxes', 'box')}
                      </td>
                      <td class="py-3 px-3 text-center text-stone-500">
                        ${rm.reorderLevel} ${rm.unit}
                      </td>
                      <td class="py-3 px-3 text-center">
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold ${rm.isPerishable ? 'bg-amber-100/80 text-amber-900 border border-amber-300' : 'bg-stone-100 text-stone-700'}">
                          ${rm.expiry}
                        </span>
                      </td>
                      <td class="py-3 px-3 text-center">
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isLow ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}">
                          <span class="w-1.5 h-1.5 rounded-full ${isLow ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}"></span>
                          ${isLow ? 'Reorder Now' : 'Healthy'}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right">
                        <button data-restock-rm="${rm.id}" class="spring-btn px-2.5 py-1 bg-orange-50 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white rounded-lg text-xs font-bold transition-all shadow-2xs">
                          + Restock PO
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </section>
      ` : `
        <!-- Finished Confectionery Products Catalog Table (100% BOM-Free) -->
        <section class="bg-white rounded-2xl border border-[var(--border-color)] shadow-subtle overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr class="bg-stone-50/70 border-b border-[var(--border-color)] text-stone-500 font-semibold text-[11px] uppercase tracking-wider">
                  <th class="py-3.5 px-5">Sweet</th>
                  <th class="py-3.5 px-4">Category</th>
                  <th class="py-3.5 px-4">Selling Rate</th>
                  <th class="py-3.5 px-4">Freshness</th>
                  <th class="py-3.5 px-4 text-center">Available Stock</th>
                  <th class="py-3.5 px-4">Stock Status</th>
                  <th class="py-3.5 px-5 text-right">Adjust Stock & Sell</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100">
                ${filteredProducts.map(item => {
                  const badgeClass = getBadgeColors(item.code || item.name.substring(0, 2).toUpperCase());
                  return `
                    <tr class="hover:bg-amber-50/30 transition-colors group">
                      <!-- Sweet Name with Avatar Emblem -->
                      <td class="py-3.5 px-5 flex items-center space-x-3">
                        <div class="w-9 h-9 rounded-xl ${badgeClass} border flex items-center justify-center font-extrabold text-xs shadow-2xs shrink-0">
                          ${item.code || item.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p class="font-bold text-[var(--text-main)] leading-snug group-hover:text-[var(--brand-primary)] transition-colors">${item.name}</p>
                          <p class="text-[10px] text-stone-400 max-w-xs truncate">${item.tagline || item.description}</p>
                        </div>
                      </td>

                      <!-- Category -->
                      <td class="py-3.5 px-4 text-stone-600 font-medium">
                        ${item.category}
                      </td>

                      <!-- Selling Rate -->
                      <td class="py-3.5 px-4 font-bold text-[var(--text-main)] tabular-nums">
                        ₹${item.pricePerKg} <span class="text-[10px] font-normal text-stone-400">/${item.unit}</span>
                      </td>

                      <!-- Freshness Badge -->
                      <td class="py-3.5 px-4">
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                          <span>✨</span> Fresh Batch
                        </span>
                      </td>

                      <!-- Available Stock -->
                      <td class="py-3.5 px-4 text-center font-black text-[var(--text-main)] text-sm tabular-nums">
                        ${item.stock} <span class="text-[10px] font-normal text-stone-400">${item.unit}</span>
                      </td>

                      <!-- Status Badge -->
                      <td class="py-3.5 px-4">
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.stockStatus === 'Low Stock' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-300' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }">
                          <span class="w-1.5 h-1.5 rounded-full ${item.stockStatus === 'Low Stock' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}"></span>
                          ${item.stockStatus}
                        </span>
                      </td>

                      <!-- Action Buttons -->
                      <td class="py-3.5 px-5 text-right space-x-1.5 whitespace-nowrap">
                        <button 
                          data-stock-adjust="${item.id}" 
                          data-stock-delta="-1"
                          class="spring-btn px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold transition-all"
                          title="Decrease stock 1 kg"
                        >
                          -1
                        </button>
                        <button 
                          data-stock-adjust="${item.id}" 
                          data-stock-delta="5"
                          class="spring-btn px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-[var(--brand-primary)] border border-orange-200 rounded-lg text-xs font-bold transition-all"
                          title="Add 5 kg fresh batch"
                        >
                          +5
                        </button>
                        <button 
                          data-add-to-pos="${item.id}"
                          class="spring-btn px-3 py-1 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                          title="Add directly to Counter POS"
                        >
                          + Sell
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </section>
      `}
    </div>
  `;
}

// Add Product Modal
export function renderAddProductModal() {
  return `
    <div class="modal-backdrop" id="add-product-modal">
      <div class="modal-content p-6 space-y-4 max-w-md animate-fadeIn">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <h3 class="text-base font-bold text-[var(--text-main)]">Add New Sweet / Product</h3>
          <button id="close-add-product-btn" class="text-stone-400 hover:text-stone-700 p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </button>
        </div>

        <form id="add-product-form" class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-stone-700 mb-1">Sweet / Item Name *</label>
            <input type="text" name="name" required placeholder="e.g. Malai Peda, Dry Fruit Anjeer" class="w-full px-3 py-2 bg-stone-50 border border-[var(--border-color)] rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-[var(--brand-primary)]" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-stone-700 mb-1">Category</label>
              <select name="category" class="w-full px-3 py-2 bg-stone-50 border border-[var(--border-color)] rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-[var(--brand-primary)]">
                <option value="Sweets">Sweets</option>
                <option value="Snacks">Snacks / Namkeen</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-stone-700 mb-1">Unit</label>
              <select name="unit" class="w-full px-3 py-2 bg-stone-50 border border-[var(--border-color)] rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-[var(--brand-primary)]">
                <option value="kg">kg (Kilogram)</option>
                <option value="pcs">pcs (Pieces)</option>
                <option value="boxes">boxes (Boxes)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-stone-700 mb-1">Selling Rate (₹) *</label>
              <input type="number" name="pricePerKg" required min="1" placeholder="450" class="w-full px-3 py-2 bg-stone-50 border border-[var(--border-color)] rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-[var(--brand-primary)]" />
            </div>
            <div>
              <label class="block font-semibold text-stone-700 mb-1">Opening Stock *</label>
              <input type="number" name="stock" required min="0" placeholder="25" class="w-full px-3 py-2 bg-stone-50 border border-[var(--border-color)] rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-[var(--brand-primary)]" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-stone-700 mb-1">Tagline / Description</label>
            <input type="text" name="tagline" placeholder="e.g. Pure Desi Ghee & Kashmiri Kesar" class="w-full px-3 py-2 bg-stone-50 border border-[var(--border-color)] rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[var(--brand-primary)]" />
          </div>

          <div class="pt-2 flex justify-end gap-2">
            <button type="button" id="cancel-add-product-btn" class="px-4 py-2 border border-[var(--border-color)] text-stone-600 rounded-xl hover:bg-stone-50 font-bold transition-all">Cancel</button>
            <button type="submit" class="spring-btn px-4 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white rounded-xl font-bold shadow-xs transition-all">Save Sweet Item</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
