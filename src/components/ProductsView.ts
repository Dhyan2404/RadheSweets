// Products Catalog & Inventory Management Component
// Radhe Sweets - Warm Terracotta Confectionery Design System

export function renderProductsView(state: any) {
  const { 
    sweets = [], 
    productsFilterCategory = 'All', 
    productsSearchQuery = '', 
    productsViewMode = 'table', // 'table' or 'grid'
    rawMaterials = [] 
  } = state;

  const categories = ["All", "Sweets", "Snacks", "Beverages", "⚠️ Low Stock", "🌾 Raw Materials"];
  const isRawMaterialTab = productsFilterCategory === '🌾 Raw Materials' || productsFilterCategory === 'Raw Materials';
  const isLowStockTab = productsFilterCategory === '⚠️ Low Stock' || productsFilterCategory === 'Low Stock';

  // Compute Live Inventory Metrics
  const totalItemsCount = sweets.length;
  const totalStockKg = sweets.reduce((acc: number, s: any) => acc + (Number(s.stock) || 0), 0);
  const totalRetailValuation = sweets.reduce((acc: number, s: any) => acc + ((Number(s.stock) || 0) * (Number(s.pricePerKg) || 0)), 0);
  const totalCostValuation = sweets.reduce((acc: number, s: any) => acc + ((Number(s.stock) || 0) * (Number(s.costPrice) || Number(s.pricePerKg) * 0.6)), 0);
  const totalEstimatedProfit = Math.max(0, totalRetailValuation - totalCostValuation);
  const averageMargin = totalRetailValuation > 0 ? Math.round((totalEstimatedProfit / totalRetailValuation) * 100) : 38;

  const lowStockItems = sweets.filter((item: any) => (Number(item.stock) || 0) <= (item.minStock || 15));
  const outOfStockItems = sweets.filter((item: any) => (Number(item.stock) || 0) <= 0);

  // Filter products based on search and category
  const filteredProducts = sweets.filter((item: any) => {
    const matchesSearch = !productsSearchQuery || 
      item.name.toLowerCase().includes(productsSearchQuery.toLowerCase()) ||
      (item.code && item.code.toLowerCase().includes(productsSearchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(productsSearchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (isLowStockTab) {
      return (Number(item.stock) || 0) <= (item.minStock || 15);
    }
    if (productsFilterCategory === 'All' || !productsFilterCategory) {
      return true;
    }
    return item.category === productsFilterCategory;
  });

  // Badge Colors matching palette
  const getBadgeColors = (code: string) => {
    switch (code) {
      case 'KK': return 'bg-[#FFF7ED] text-[#C86D3B] border-[#FED7AA]';
      case 'RG': return 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]';
      case 'GJ': return 'bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]';
      case 'ML': return 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]';
      case 'KP': return 'bg-[#FFF7ED] text-[#C86D3B] border-[#FED7AA]';
      case 'DF': return 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]';
      case 'MC': return 'bg-[#FFF7ED] text-[#9A3412] border-[#FDBA74]';
      case 'SP': return 'bg-[#FAF7F2] text-[#2A1F1D] border-[#EFE7DE]';
      case 'SM': return 'bg-[#FFF7ED] text-[#C86D3B] border-[#FED7AA]';
      default: return 'bg-[#FAF7F2] text-[#2A1F1D] border-[#EFE7DE]';
    }
  };

  return `
    <div class="space-y-6 animate-fadeIn select-none">
      
      <!-- Top Title Bar with Quick Action Buttons -->
      <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">Inventory & Stock Control</h1>
            <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#1E7E34] border border-[#CDE9D3]">
              <span class="w-2 h-2 rounded-full bg-[#34A853] animate-pulse"></span>
              Live Synced
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#7C7267] mt-1 font-medium">Real-time confectionery batch tracking, stock valuation, shelf-life monitoring & kitchen inward logs</p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Restock Batch Button -->
          <button 
            id="open-restock-batch-modal-btn" 
            class="px-4 py-2.5 bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#C86D3B] border border-[#FED7AA] text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span class="text-sm">✨</span>
            <span>+ Kitchen Restock</span>
          </button>

          <!-- Stock Adjust Button -->
          <button 
            id="open-stock-adjust-modal-btn" 
            class="px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#F0ECE4] text-[#2A1F1D] border border-[#EFE7DE] text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span class="text-sm">⚖️</span>
            <span>Audit / Adjust</span>
          </button>

          <!-- Export CSV Button -->
          <button 
            id="export-inventory-csv-btn" 
            class="px-4 py-2.5 bg-[#FAF7F2] hover:bg-[#F0ECE4] text-[#7C7267] border border-[#EFE7DE] text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            title="Download full inventory CSV report"
          >
            <svg class="w-4 h-4 text-[#7C7267]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Export CSV</span>
          </button>

          <!-- Add Product Button -->
          <button 
            id="open-add-product-modal-btn" 
            class="px-4 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span class="text-base leading-none">+</span>
            <span>Add New Sweet</span>
          </button>
        </div>
      </section>

      <!-- 4 High-Impact Inventory Valuation & Health KPI Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <!-- CARD 1: Total Inventory Stock Valuation -->
        <article class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-[#7C7267]">Stock Valuation (Retail)</span>
            <div class="w-9 h-9 rounded-2xl bg-[#E6F4EA] flex items-center justify-center text-[#1E7E34]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 2a4 4 0 0 1 4 4v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11v6M10 13h4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <p class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">₹${totalRetailValuation.toLocaleString()}</p>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>Cost: ₹${totalCostValuation.toLocaleString()}</span>
              <span class="font-bold text-[#1E7E34]">+${averageMargin}% Margin</span>
            </div>
          </div>
        </article>

        <!-- CARD 2: Total Tracked Sweets & Volume -->
        <article class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-[#7C7267]">Total Finished Stock</span>
            <div class="w-9 h-9 rounded-2xl bg-[#FFF7ED] flex items-center justify-center text-[#C86D3B]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <p class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">${totalStockKg} <span class="text-sm font-normal text-[#7C7267]">kg/units</span></p>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>${totalItemsCount} Confectionery Items</span>
              <span class="font-bold text-[#C86D3B]">Pure Desi Ghee</span>
            </div>
          </div>
        </article>

        <!-- CARD 3: Low Stock Alerts -->
        <article 
          data-products-category="⚠️ Low Stock"
          class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between cursor-pointer hover:border-[#C86D3B] hover:shadow-md transition-all group"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-[#7C7267] group-hover:text-[#2A1F1D]">Low Stock Warnings</span>
            <div class="w-9 h-9 rounded-2xl ${lowStockItems.length > 0 ? 'bg-[#FFF7ED] text-[#C86D3B]' : 'bg-[#E6F4EA] text-[#1E7E34]'} flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="mt-3">
            <div class="flex items-baseline gap-2">
              <p class="text-2xl sm:text-3xl font-extrabold ${lowStockItems.length > 0 ? 'text-[#C86D3B]' : 'text-[#1E7E34]'} tracking-tight">${lowStockItems.length}</p>
              <span class="text-xs font-semibold text-[#7C7267]">items below threshold</span>
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>${outOfStockItems.length} Out of Stock</span>
              <span class="font-bold text-[#C86D3B] underline group-hover:text-[#B25D2E]">Click to View &rarr;</span>
            </div>
          </div>
        </article>

        <!-- CARD 4: Raw Material Pantry Ledger -->
        <article 
          data-products-category="🌾 Raw Materials"
          class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between cursor-pointer hover:border-[#DDA15E] hover:shadow-md transition-all group"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-[#7C7267] group-hover:text-[#2A1F1D]">Raw Materials & PO</span>
            <div class="w-9 h-9 rounded-2xl bg-[#FEF9C3] flex items-center justify-center text-[#A16207]">
              🌾
            </div>
          </div>
          <div class="mt-3">
            <p class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">${rawMaterials.length} <span class="text-sm font-normal text-[#7C7267]">ingredients</span></p>
            <div class="flex items-center justify-between text-[11px] text-[#7C7267] mt-1.5 pt-1.5 border-t border-[#F7F3EE]">
              <span>Ghee, Mawa, Sugar, Dry Fruits</span>
              <span class="font-bold text-[#A16207] underline">View Pantry &rarr;</span>
            </div>
          </div>
        </article>

      </section>

      <!-- Search, Category Filters & View Switcher -->
      <section class="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <!-- Category Filter Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            ${categories.map(cat => {
              const isActive = (productsFilterCategory || 'All') === cat;
              return `
                <button 
                  data-products-category="${cat}"
                  class="px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-[#C86D3B] text-white shadow-xs' 
                      : 'bg-[#FAF7F2] text-[#7C7267] hover:text-[#2A1F1D] hover:bg-[#F0ECE4] border border-[#EFE7DE]'
                  }"
                >
                  ${cat}
                  ${cat === '⚠️ Low Stock' && lowStockItems.length > 0 ? `
                    <span class="ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-800 font-extrabold'}">${lowStockItems.length}</span>
                  ` : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Search Input & View Switcher Toggle -->
          <div class="flex items-center gap-2.5 w-full md:w-auto">
            <!-- Search -->
            <div class="relative flex-1 md:w-64">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A89F95]">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <input 
                id="products-search-input"
                type="text" 
                value="${productsSearchQuery || ''}"
                placeholder="Search sweet name, code (KK, RG)..." 
                class="w-full pl-10 pr-8 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] placeholder-[#A89F95] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              />
              ${productsSearchQuery ? `
                <button id="clear-products-search-btn" class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#A89F95] hover:text-[#2A1F1D]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                </button>
              ` : ''}
            </div>

            <!-- View Switcher (Table vs Grid) -->
            ${!isRawMaterialTab ? `
              <div class="flex items-center p-1 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl">
                <button 
                  id="view-mode-table-btn"
                  class="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    productsViewMode === 'table' 
                      ? 'bg-white text-[#C86D3B] shadow-xs' 
                      : 'text-[#7C7267] hover:text-[#2A1F1D]'
                  }"
                  title="Table Ledger View"
                >
                  📋
                </button>
                <button 
                  id="view-mode-grid-btn"
                  class="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    productsViewMode === 'grid' 
                      ? 'bg-white text-[#C86D3B] shadow-xs' 
                      : 'text-[#7C7267] hover:text-[#2A1F1D]'
                  }"
                  title="Grid Cards View"
                >
                  🎴
                </button>
              </div>
            ` : ''}
          </div>

        </div>
      </section>

      ${isRawMaterialTab ? `
        <!-- Raw Material Stock Ledger Table -->
        <section class="bg-white rounded-3xl border border-[#F0ECE4] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.04)] overflow-hidden">
          <div class="p-5 sm:p-6 border-b border-[#F4EFE9] flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-[#2A1F1D]">Raw Material Stock Ledger & Pantry</h2>
              <p class="text-xs text-[#7C7267]">Inward procurement rates, safe threshold limits & expiry schedules</p>
            </div>
            <button id="open-add-rm-modal-btn" class="px-3.5 py-2 bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#C86D3B] border border-[#FED7AA] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5">
              <span>+</span>
              <span>Inward PO</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-[#FAF7F2] border-b border-[#EFE7DE] text-[#7C7267] font-bold text-[11px] uppercase tracking-wider">
                  <th class="py-3.5 px-5">Ingredient / Consumable</th>
                  <th class="py-3.5 px-4 text-center">Available Stock</th>
                  <th class="py-3.5 px-4 text-center">Procurement Cost</th>
                  <th class="py-3.5 px-4 text-center">Min. Reorder Threshold</th>
                  <th class="py-3.5 px-4 text-center">Shelf Life / Expiry</th>
                  <th class="py-3.5 px-4 text-center">Pantry Health</th>
                  <th class="py-3.5 px-5 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#F7F3EE]">
                ${rawMaterials.map((rm: any) => {
                  const isLow = (rm.stock || 0) <= (rm.reorderLevel || 20);
                  return `
                    <tr class="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td class="py-4 px-5">
                        <p class="font-bold text-[#2A1F1D] text-sm">${rm.name}</p>
                        <span class="text-[10px] font-mono font-semibold text-[#A89F95]">${rm.id}</span>
                      </td>
                      <td class="py-4 px-4 text-center">
                        <span class="text-sm font-extrabold text-[#2A1F1D] tabular-nums">${rm.stock}</span>
                        <span class="text-[11px] text-[#7C7267] ml-0.5">${rm.unit}</span>
                      </td>
                      <td class="py-4 px-4 text-center font-semibold text-[#2A1F1D] tabular-nums">
                        ₹${rm.unitCost} <span class="text-[10px] font-normal text-[#7C7267]">/${rm.unit.replace('boxes', 'box')}</span>
                      </td>
                      <td class="py-4 px-4 text-center text-[#7C7267]">
                        ${rm.reorderLevel} ${rm.unit}
                      </td>
                      <td class="py-4 px-4 text-center">
                        <span class="px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                          rm.isPerishable 
                            ? 'bg-[#FFF7ED] text-[#C86D3B] border border-[#FED7AA]' 
                            : 'bg-[#FAF7F2] text-[#7C7267] border border-[#EFE7DE]'
                        }">
                          ${rm.expiry}
                        </span>
                      </td>
                      <td class="py-4 px-4 text-center">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                          isLow 
                            ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]' 
                            : 'bg-[#E6F4EA] text-[#1E7E34] border border-[#CDE9D3]'
                        }">
                          <span class="w-1.5 h-1.5 rounded-full ${isLow ? 'bg-[#DC2626] animate-pulse' : 'bg-[#1E7E34]'}"></span>
                          ${isLow ? 'Order Needed' : 'Adequate'}
                        </span>
                      </td>
                      <td class="py-4 px-5 text-right">
                        <button 
                          data-restock-rm="${rm.id}" 
                          class="px-3.5 py-1.5 bg-[#FFF7ED] hover:bg-[#C86D3B] hover:text-white text-[#C86D3B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-all shadow-2xs"
                        >
                          + Inward PO
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
        <!-- Main Finished Confectionery Products Catalog -->
        ${filteredProducts.length === 0 ? `
          <div class="bg-white rounded-3xl border border-[#F0ECE4] p-12 text-center shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)]">
            <div class="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#F0ECE4] flex items-center justify-center mx-auto text-2xl mb-3 text-[#C86D3B]">
              🍬
            </div>
            <h3 class="text-base font-bold text-[#2A1F1D]">No sweet items found</h3>
            <p class="text-xs text-[#7C7267] mt-1 max-w-sm mx-auto">No sweet items match your current filter or search query. Try clearing the search or adding a new sweet.</p>
            <button id="reset-products-filter-btn" class="mt-4 px-4 py-2 bg-[#C86D3B] text-white text-xs font-bold rounded-2xl shadow-sm">
              Reset All Filters
            </button>
          </div>
        ` : productsViewMode === 'grid' ? `
          <!-- Visual Grid Cards View -->
          <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            ${filteredProducts.map((item: any) => {
              const badgeClass = getBadgeColors(item.code || item.name.substring(0, 2).toUpperCase());
              const currentStock = Number(item.stock) || 0;
              const minStock = Number(item.minStock) || 15;
              const isLow = currentStock <= minStock;
              const isZero = currentStock <= 0;
              const stockPct = Math.min(100, Math.round((currentStock / 60) * 100));

              return `
                <div class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] hover:shadow-card hover:border-[#FED7AA] transition-all flex flex-col justify-between group">
                  <div>
                    <div class="flex items-start justify-between">
                      <div class="w-12 h-12 rounded-2xl ${badgeClass} border flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
                        ${item.code || item.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isZero 
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]' 
                          : (isLow ? 'bg-[#FFF7ED] text-[#C86D3B] border border-[#FED7AA]' : 'bg-[#E6F4EA] text-[#1E7E34] border border-[#CDE9D3]')
                      }">
                        <span class="w-1.5 h-1.5 rounded-full ${isZero ? 'bg-[#DC2626]' : (isLow ? 'bg-[#C86D3B] animate-pulse' : 'bg-[#1E7E34]')}"></span>
                        ${isZero ? 'Out of Stock' : (isLow ? 'Low Stock' : 'Fresh Stock')}
                      </span>
                    </div>

                    <div class="mt-3">
                      <h3 class="font-bold text-base text-[#2A1F1D] group-hover:text-[#C86D3B] transition-colors line-clamp-1">${item.name}</h3>
                      <p class="text-xs text-[#7C7267] mt-0.5">${item.category} • SKU: ${item.id}</p>
                    </div>

                    <!-- Price & Stock Stats -->
                    <div class="mt-4 p-3 bg-[#FAF7F2] rounded-2xl border border-[#F0ECE4] space-y-2">
                      <div class="flex items-baseline justify-between">
                        <span class="text-xs text-[#7C7267]">Selling Rate</span>
                        <span class="text-base font-extrabold text-[#2A1F1D]">₹${item.pricePerKg} <span class="text-xs font-normal text-[#7C7267]">/${item.unit}</span></span>
                      </div>

                      <div>
                        <div class="flex justify-between text-[11px] mb-1">
                          <span class="text-[#7C7267]">Stock Level:</span>
                          <span class="font-bold ${isZero ? 'text-[#DC2626]' : (isLow ? 'text-[#C86D3B]' : 'text-[#2A1F1D]')}">${currentStock} ${item.unit}</span>
                        </div>
                        <div class="w-full bg-[#EFE7DE] h-1.5 rounded-full overflow-hidden">
                          <div 
                            class="h-full rounded-full transition-all duration-300 ${isZero ? 'bg-[#DC2626]' : (isLow ? 'bg-[#C86D3B]' : 'bg-[#1E7E34]')}" 
                            style="width: ${Math.max(4, stockPct)}%;"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Quick Stock Adjusters & Sell Button -->
                  <div class="mt-4 pt-3 border-t border-[#F4EFE9] space-y-2">
                    <div class="flex items-center justify-between gap-1.5">
                      <button 
                        data-stock-adjust="${item.id}" 
                        data-stock-delta="-1"
                        class="flex-1 py-1 bg-[#FAF7F2] hover:bg-[#F0ECE4] text-[#2A1F1D] border border-[#EFE7DE] rounded-xl text-xs font-bold transition-all text-center"
                        title="Deduct 1 kg"
                      >
                        -1
                      </button>
                      <button 
                        data-stock-adjust="${item.id}" 
                        data-stock-delta="5"
                        class="flex-1 py-1 bg-[#FAF7F2] hover:bg-[#FFF7ED] text-[#C86D3B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-all text-center"
                        title="Add 5 kg fresh batch"
                      >
                        +5
                      </button>
                      <button 
                        data-stock-adjust="${item.id}" 
                        data-stock-delta="10"
                        class="flex-1 py-1 bg-[#FAF7F2] hover:bg-[#FFF7ED] text-[#C86D3B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-all text-center"
                        title="Add 10 kg fresh batch"
                      >
                        +10
                      </button>
                      <button 
                        data-edit-product="${item.id}"
                        class="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#F0ECE4] text-[#7C7267] hover:text-[#2A1F1D] border border-[#EFE7DE] rounded-xl text-xs transition-all"
                        title="Edit Details"
                      >
                        ✏️
                      </button>
                    </div>

                    <button 
                      data-add-to-pos="${item.id}"
                      class="w-full py-2 bg-[#C86D3B] hover:bg-[#B25D2E] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>⚡</span>
                      <span>+ Sell in Counter POS</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </section>
        ` : `
          <!-- Full Confectionery Stock Ledger Table View -->
          <section class="bg-white rounded-3xl border border-[#F0ECE4] shadow-[0_4px_25px_-5px_rgba(74,58,47,0.04)] overflow-hidden">
            <div class="p-5 sm:p-6 border-b border-[#F4EFE9] flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-[#2A1F1D]">Confectionery Stock Ledger</h2>
                <p class="text-xs text-[#7C7267]">Showing ${filteredProducts.length} items (${productsFilterCategory || 'All'})</p>
              </div>
              
              <div class="text-right">
                <span class="text-xs font-bold text-[#7C7267]">Total Batch Value: </span>
                <span class="text-sm font-extrabold text-[#2A1F1D]">₹${filteredProducts.reduce((sum: number, item: any) => sum + ((item.stock || 0) * (item.pricePerKg || 0)), 0).toLocaleString()}</span>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr class="bg-[#FAF7F2] border-b border-[#EFE7DE] text-[#7C7267] font-bold text-[11px] uppercase tracking-wider">
                    <th class="py-3.5 px-5">Sweet & Details</th>
                    <th class="py-3.5 px-4">Category</th>
                    <th class="py-3.5 px-4 text-center">Stock Level & Gauge</th>
                    <th class="py-3.5 px-4">Selling Rate</th>
                    <th class="py-3.5 px-4">Kitchen Cost & Margin</th>
                    <th class="py-3.5 px-4 text-center">Status</th>
                    <th class="py-3.5 px-5 text-right">Quick Restock & POS</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#F7F3EE]">
                  ${filteredProducts.map((item: any) => {
                    const badgeClass = getBadgeColors(item.code || item.name.substring(0, 2).toUpperCase());
                    const currentStock = Number(item.stock) || 0;
                    const minStock = Number(item.minStock) || 15;
                    const isLow = currentStock <= minStock;
                    const isZero = currentStock <= 0;
                    const cost = Number(item.costPrice) || Math.round(item.pricePerKg * 0.62);
                    const marginPct = Math.round(((item.pricePerKg - cost) / item.pricePerKg) * 100);
                    const stockPct = Math.min(100, Math.round((currentStock / 60) * 100));

                    return `
                      <tr class="hover:bg-[#FAF7F2]/50 transition-colors group">
                        
                        <!-- Sweet Name & Details with Avatar -->
                        <td class="py-4 px-5">
                          <div class="flex items-center space-x-3.5">
                            <div class="w-10 h-10 rounded-2xl ${badgeClass} border flex items-center justify-center font-extrabold text-xs shadow-2xs shrink-0">
                              ${item.code || item.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div class="min-w-0">
                              <p class="font-bold text-[#2A1F1D] text-sm group-hover:text-[#C86D3B] transition-colors truncate">${item.name}</p>
                              <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-[10px] text-[#A89F95] font-mono">SKU: ${item.id}</span>
                                <span class="text-[10px] text-[#A89F95]">•</span>
                                <span class="text-[10px] text-[#7C7267] font-medium">Batch #${item.batchNumber || 'B-260925'}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <!-- Category Pill -->
                        <td class="py-4 px-4 whitespace-nowrap">
                          <span class="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#7C7267] border border-[#EFE7DE]">
                            ${item.category}
                          </span>
                        </td>

                        <!-- Stock Level with Visual Gauge Bar -->
                        <td class="py-4 px-4 text-center min-w-[140px]">
                          <div class="flex items-center justify-center gap-1.5">
                            <span class="text-base font-black ${isZero ? 'text-[#DC2626]' : (isLow ? 'text-[#C86D3B]' : 'text-[#2A1F1D]')} tabular-nums">
                              ${currentStock}
                            </span>
                            <span class="text-xs font-semibold text-[#7C7267]">${item.unit}</span>
                          </div>

                          <!-- Mini Capacity Progress Bar -->
                          <div class="w-full max-w-[110px] mx-auto bg-[#EFE7DE] h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div 
                              class="h-full rounded-full transition-all duration-300 ${
                                isZero 
                                  ? 'bg-[#DC2626] w-1' 
                                  : (isLow ? 'bg-[#C86D3B]' : 'bg-[#1E7E34]')
                              }" 
                              style="width: ${Math.max(4, stockPct)}%;"
                            ></div>
                          </div>
                          <span class="text-[10px] text-[#A89F95] mt-1 block">Min alert: ${minStock} ${item.unit}</span>
                        </td>

                        <!-- Selling Rate & Total Asset Value -->
                        <td class="py-4 px-4 whitespace-nowrap">
                          <p class="font-extrabold text-[#2A1F1D] text-sm tabular-nums">₹${item.pricePerKg} <span class="text-xs font-normal text-[#7C7267]">/${item.unit}</span></p>
                          <p class="text-[10px] text-[#7C7267] mt-0.5">Asset: ₹${(currentStock * item.pricePerKg).toLocaleString()}</p>
                        </td>

                        <!-- Kitchen Cost & Margin -->
                        <td class="py-4 px-4 whitespace-nowrap">
                          <p class="text-xs font-semibold text-[#7C7267] tabular-nums">Cost: ₹${cost}/${item.unit}</p>
                          <span class="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E6F4EA] text-[#1E7E34] border border-[#CDE9D3]">
                            +${marginPct}% Margin
                          </span>
                        </td>

                        <!-- Health Status Badge -->
                        <td class="py-4 px-4 text-center whitespace-nowrap">
                          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            isZero 
                              ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                              : (isLow 
                                  ? 'bg-[#FFF7ED] text-[#C86D3B] border border-[#FED7AA]' 
                                  : 'bg-[#E6F4EA] text-[#1E7E34] border border-[#CDE9D3]')
                          }">
                            <span class="w-1.5 h-1.5 rounded-full ${isZero ? 'bg-[#DC2626] animate-ping' : (isLow ? 'bg-[#C86D3B] animate-pulse' : 'bg-[#1E7E34]')}"></span>
                            ${isZero ? 'Out of Stock' : (isLow ? 'Low Stock' : 'Optimal')}
                          </span>
                        </td>

                        <!-- Quick Restock & POS Action Buttons -->
                        <td class="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                          <!-- Quick -1 kg -->
                          <button 
                            data-stock-adjust="${item.id}" 
                            data-stock-delta="-1"
                            class="px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-[#F0ECE4] text-[#2A1F1D] border border-[#EFE7DE] rounded-xl text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95"
                            title="Decrease 1 kg (Sale or Wastage)"
                          >
                            -1
                          </button>

                          <!-- Quick +5 kg (Fresh Kitchen Batch) -->
                          <button 
                            data-stock-adjust="${item.id}" 
                            data-stock-delta="5"
                            class="px-2.5 py-1.5 bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#C86D3B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95"
                            title="Add 5 kg fresh batch"
                          >
                            +5
                          </button>

                          <!-- Quick +10 kg -->
                          <button 
                            data-stock-adjust="${item.id}" 
                            data-stock-delta="10"
                            class="px-2.5 py-1.5 bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#C86D3B] border border-[#FED7AA] rounded-xl text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95"
                            title="Add 10 kg fresh batch"
                          >
                            +10
                          </button>

                          <!-- Edit Product -->
                          <button 
                            data-edit-product="${item.id}"
                            class="px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-[#F0ECE4] text-[#7C7267] hover:text-[#2A1F1D] border border-[#EFE7DE] rounded-xl text-xs font-semibold transition-all shadow-2xs"
                            title="Edit Product Details & Thresholds"
                          >
                            ✏️
                          </button>

                          <!-- Sell in POS -->
                          <button 
                            data-add-to-pos="${item.id}"
                            class="px-3.5 py-1.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white rounded-xl text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95"
                            title="Add directly to Counter POS Cart"
                          >
                            ⚡ + Sell
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
      `}
    </div>
  `;
}

// 1. Add Sweet Product Modal
export function renderAddProductModal() {
  return `
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none" id="add-product-modal">
      <div class="bg-white rounded-3xl p-6 sm:p-7 space-y-5 max-w-lg w-full border border-[#F0ECE4] shadow-2xl animate-scaleUp">
        
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-[#FFF7ED] text-[#C86D3B] flex items-center justify-center font-bold text-lg border border-[#FED7AA]">
              🍬
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2A1F1D]">Add New Sweet / Item</h3>
              <p class="text-xs text-[#7C7267]">Register a new confectionery item into catalog and stock ledger</p>
            </div>
          </div>
          <button id="close-add-product-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>

        <form id="add-product-form" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Item Name *</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="e.g. Kesar Pista Roll, Malai Chum Chum" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Category *</label>
              <select 
                name="category" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              >
                <option value="Sweets">Sweets</option>
                <option value="Snacks">Snacks / Namkeen</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Measurement Unit *</label>
              <select 
                name="unit" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              >
                <option value="kg">kg (Kilogram)</option>
                <option value="pcs">pcs (Pieces)</option>
                <option value="boxes">boxes (Gift Boxes)</option>
                <option value="litres">litres (Beverages)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Selling Price (₹) *</label>
              <input 
                type="number" 
                name="pricePerKg" 
                required 
                min="1" 
                placeholder="e.g. 480" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Kitchen Cost Price (₹) *</label>
              <input 
                type="number" 
                name="costPrice" 
                required 
                min="1" 
                placeholder="e.g. 290" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Opening Stock Qty *</label>
              <input 
                type="number" 
                name="stock" 
                required 
                min="0" 
                placeholder="e.g. 25" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Low Stock Reorder Alert (kg) *</label>
              <input 
                type="number" 
                name="minStock" 
                required 
                min="1" 
                value="15" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Flavor & Ingredients Notes</label>
            <input 
              type="text" 
              name="description" 
              placeholder="e.g. Pure Desi Ghee, Kashmiri saffron and premium dry fruits." 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
            />
          </div>

          <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-end gap-3">
            <button 
              type="button" 
              id="cancel-add-product-btn" 
              class="px-5 py-2.5 border border-[#E0D7CC] text-[#7C7267] hover:text-[#2A1F1D] rounded-2xl font-bold transition-all hover:bg-[#FAF7F2]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white rounded-2xl font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Sweet Item
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// 2. Edit Sweet Product Modal
export function renderEditProductModal(sweet: any) {
  if (!sweet) return '';
  return `
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none" id="edit-product-modal">
      <div class="bg-white rounded-3xl p-6 sm:p-7 space-y-5 max-w-lg w-full border border-[#F0ECE4] shadow-2xl animate-scaleUp">
        
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-[#FFF7ED] text-[#C86D3B] flex items-center justify-center font-bold text-lg border border-[#FED7AA]">
              ✏️
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2A1F1D]">Edit: ${sweet.name}</h3>
              <p class="text-xs text-[#7C7267]">Update pricing, reorder thresholds, and catalog details</p>
            </div>
          </div>
          <button id="close-edit-product-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>

        <form id="edit-product-form" class="space-y-4 text-xs" data-sweet-id="${sweet.id}">
          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Sweet Item Name *</label>
            <input 
              type="text" 
              name="name" 
              value="${sweet.name}" 
              required 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Category *</label>
              <select 
                name="category" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              >
                <option value="Sweets" ${sweet.category === 'Sweets' ? 'selected' : ''}>Sweets</option>
                <option value="Snacks" ${sweet.category === 'Snacks' ? 'selected' : ''}>Snacks / Namkeen</option>
                <option value="Beverages" ${sweet.category === 'Beverages' ? 'selected' : ''}>Beverages</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Unit *</label>
              <select 
                name="unit" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              >
                <option value="kg" ${sweet.unit === 'kg' ? 'selected' : ''}>kg (Kilogram)</option>
                <option value="pcs" ${sweet.unit === 'pcs' ? 'selected' : ''}>pcs (Pieces)</option>
                <option value="boxes" ${sweet.unit === 'boxes' ? 'selected' : ''}>boxes (Gift Boxes)</option>
                <option value="litres" ${sweet.unit === 'litres' ? 'selected' : ''}>litres (Beverages)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Selling Price (₹) *</label>
              <input 
                type="number" 
                name="pricePerKg" 
                value="${sweet.pricePerKg}" 
                required 
                min="1" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Kitchen Cost Price (₹) *</label>
              <input 
                type="number" 
                name="costPrice" 
                value="${sweet.costPrice || Math.round(sweet.pricePerKg * 0.62)}" 
                required 
                min="1" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Current Stock Level *</label>
              <input 
                type="number" 
                name="stock" 
                value="${sweet.stock}" 
                required 
                min="0" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Low Stock Reorder Alert Threshold *</label>
              <input 
                type="number" 
                name="minStock" 
                value="${sweet.minStock || 15}" 
                required 
                min="1" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Description & Flavor Profile</label>
            <input 
              type="text" 
              name="description" 
              value="${sweet.description || ''}" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
            />
          </div>

          <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-between">
            <button 
              type="button" 
              data-delete-sweet="${sweet.id}" 
              class="px-4 py-2 text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl font-bold transition-all text-xs"
            >
              Delete Sweet
            </button>

            <div class="flex items-center gap-2.5">
              <button 
                type="button" 
                id="cancel-edit-product-btn" 
                class="px-5 py-2.5 border border-[#E0D7CC] text-[#7C7267] hover:text-[#2A1F1D] rounded-2xl font-bold transition-all hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-6 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white rounded-2xl font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Update Sweet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
}

// 3. Fresh Kitchen Batch Restock Modal
export function renderRestockBatchModal(state: any) {
  const { sweets = [] } = state;
  const todayStr = "25 Sep 2026";
  const defaultBatchNo = `BATCH-${Date.now().toString().slice(-6)}`;

  return `
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none" id="restock-batch-modal">
      <div class="bg-white rounded-3xl p-6 sm:p-7 space-y-5 max-w-lg w-full border border-[#F0ECE4] shadow-2xl animate-scaleUp">
        
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#1E7E34] flex items-center justify-center font-bold text-lg">
              ✨
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2A1F1D]">Record Fresh Kitchen Batch</h3>
              <p class="text-xs text-[#7C7267]">Receive freshly made confectionery batch from central halwai kitchen</p>
            </div>
          </div>
          <button id="close-restock-batch-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>

        <form id="restock-batch-form" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Select Sweet Item *</label>
            <select 
              name="sweetId" 
              required
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            >
              ${sweets.map((s: any) => `
                <option value="${s.id}">${s.name} (Current Stock: ${s.stock} ${s.unit})</option>
              `).join('')}
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Batch Code # *</label>
              <input 
                type="text" 
                name="batchNumber" 
                value="${defaultBatchNo}" 
                required 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-mono font-bold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Fresh Inward Quantity *</label>
              <input 
                type="number" 
                name="quantity" 
                required 
                min="1" 
                placeholder="e.g. 15" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-black text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Production Date *</label>
              <input 
                type="text" 
                name="productionDate" 
                value="${todayStr}" 
                required 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Kitchen Station / Chef</label>
              <input 
                type="text" 
                name="chefName" 
                value="Head Halwai Ramesh (SG Highway Kitchen)" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Batch Quality Note</label>
            <input 
              type="text" 
              name="notes" 
              placeholder="e.g. Pure Bilona Desi Ghee aroma verified, fresh batch taste tested" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
            />
          </div>

          <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-end gap-3">
            <button 
              type="button" 
              id="cancel-restock-batch-btn" 
              class="px-5 py-2.5 border border-[#E0D7CC] text-[#7C7267] hover:text-[#2A1F1D] rounded-2xl font-bold transition-all hover:bg-[#FAF7F2]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 bg-[#1E7E34] hover:bg-[#166527] text-white rounded-2xl font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Confirm Fresh Batch Inward
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// 4. Stock Adjustment / Audit Recount Modal
export function renderStockAdjustModal(state: any) {
  const { sweets = [] } = state;

  return `
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none" id="stock-adjust-modal">
      <div class="bg-white rounded-3xl p-6 sm:p-7 space-y-5 max-w-lg w-full border border-[#F0ECE4] shadow-2xl animate-scaleUp">
        
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-[#FFF7ED] text-[#C86D3B] flex items-center justify-center font-bold text-lg border border-[#FED7AA]">
              ⚖️
            </div>
            <div>
              <h3 class="text-lg font-bold text-[#2A1F1D]">Stock Audit & Wastage Adjustment</h3>
              <p class="text-xs text-[#7C7267]">Record spoilage, customer sampling, or physical counter variance</p>
            </div>
          </div>
          <button id="close-stock-adjust-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>

        <form id="stock-adjust-form" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Select Sweet Item *</label>
            <select 
              name="sweetId" 
              required
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
            >
              ${sweets.map((s: any) => `
                <option value="${s.id}">${s.name} (Current Stock: ${s.stock} ${s.unit})</option>
              `).join('')}
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Reason for Adjustment *</label>
              <select 
                name="reason" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              >
                <option value="Physical Audit Recount">Physical Audit Recount (=)</option>
                <option value="Customer Tasting & Sampling">Customer Tasting & Sampling (-)</option>
                <option value="Kitchen Spoilage / Damage">Kitchen Spoilage / Damage (-)</option>
                <option value="Counter Return">Counter Return (+)</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-[#2A1F1D] mb-1.5">Adjustment Mode *</label>
              <select 
                name="mode" 
                class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-semibold text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all"
              >
                <option value="set">Set Exact Total Stock</option>
                <option value="subtract">Deduct Quantity (-)</option>
                <option value="add">Add Quantity (+)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Quantity / Value *</label>
            <input 
              type="number" 
              name="quantity" 
              required 
              min="0" 
              placeholder="e.g. 20" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs font-black text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
            />
          </div>

          <div>
            <label class="block font-bold text-[#2A1F1D] mb-1.5">Audit Note / Log Reference</label>
            <input 
              type="text" 
              name="notes" 
              placeholder="e.g. Evening closing physical count verified by Admin" 
              class="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#EFE7DE] rounded-2xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/20 focus:border-[#C86D3B] transition-all" 
            />
          </div>

          <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-end gap-3">
            <button 
              type="button" 
              id="cancel-stock-adjust-btn" 
              class="px-5 py-2.5 border border-[#E0D7CC] text-[#7C7267] hover:text-[#2A1F1D] rounded-2xl font-bold transition-all hover:bg-[#FAF7F2]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-6 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white rounded-2xl font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
