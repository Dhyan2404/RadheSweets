// Expenses Management View Component
// Radhe Sweets - Comprehensive Confectionery Ledger & Raw Material Inward Costs

export function renderExpensesView(state: any) {
  const { expenses = { total: 0, change: '+0%', breakdown: [], items: [] }, expensesFilterCategory = 'All' } = state;

  const categories = ["All", "Raw Materials", "Utilities", "Staff Salary", "Marketing", "Other"];

  // Filter items based on active category & branch allocation
  const branchFilter = state?.expensesBranchFilter || 'all';
  const filteredItems = (expenses.items || []).filter((item: any) => {
    const categoryMatch = !expensesFilterCategory || expensesFilterCategory === 'All' || item.category === expensesFilterCategory;
    const itemBranch = item.branchId || 'all';
    const branchMatch = branchFilter === 'all' || itemBranch === 'all' || itemBranch === branchFilter;
    return categoryMatch && branchMatch;
  });

  // Calculate Raw Materials specific metric
  const rawMaterialsTotal = (expenses.items || [])
    .filter((i: any) => i.category === 'Raw Materials')
    .reduce((sum: number, i: any) => sum + (Number(i.amount) || 0), 0);

  const rawMaterialsCount = (expenses.items || [])
    .filter((i: any) => i.category === 'Raw Materials').length;

  return `
    <div class="space-y-6">
      <!-- Header -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-[var(--text-main)] tracking-tight">Expenses Ledger</h2>
          <p class="text-xs text-[var(--text-muted)] mt-0.5">Track and audit confectionery raw material inward costs, staff salaries, marketing &amp; store utilities</p>
        </div>

        <button id="open-add-expense-modal-btn" class="px-4 py-2 bg-[var(--brand-primary)] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[var(--brand-primary-hover)] transition-all flex items-center gap-1.5 self-start sm:self-auto hover:scale-102 active:scale-98 cursor-pointer">
          <span>+</span> Add Expense
        </button>
      </section>

      <!-- Expense Summary & Breakdown Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Total Expenses & Raw Materials Highlight (5 Cols) -->
        <div class="lg:col-span-5 bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Operational Spend</span>
              <span class="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                ↗ ${expenses.change || '+5.6%'}
              </span>
            </div>
            <div class="text-3xl sm:text-4xl font-black text-[var(--text-main)] mt-2">
              ₹${(expenses.total || 0).toLocaleString()}
            </div>
            <p class="text-xs text-[var(--text-light)] mt-1">Total recorded operating expenditures</p>
          </div>

          <!-- Highlight Card for Raw Materials Procurement -->
          <div class="p-3.5 bg-gradient-to-r from-amber-50/90 to-orange-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
            <div class="flex items-center space-x-2.5">
              <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-base select-none">
                🌾
              </div>
              <div>
                <p class="text-xs font-bold text-[#2A1F1D]">Raw Materials Inward</p>
                <p class="text-[10px] text-[#7C7267]">${rawMaterialsCount} procurement bills logged</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-black text-[#C86D3B]">₹${rawMaterialsTotal.toLocaleString()}</p>
              <span class="text-[10px] font-semibold text-amber-800">${expenses.total > 0 ? Math.round((rawMaterialsTotal / expenses.total) * 100) : 0}% of spend</span>
            </div>
          </div>

          <!-- Trendline SVG -->
          <div class="pt-1">
            <svg class="w-full h-10" fill="none" viewBox="0 0 200 40" preserveAspectRatio="none">
              <path d="M0 28 Q 40 32, 80 20 T 140 24 T 200 8" fill="none" stroke="#F43F5E" stroke-width="2.5" stroke-linecap="round"></path>
              <path d="M0 28 Q 40 32, 80 20 T 140 24 T 200 8 L 200 40 L 0 40 Z" fill="#F43F5E" opacity="0.12"></path>
            </svg>
          </div>
        </div>

        <!-- Expense Category Breakdown (7 Cols) -->
        <div class="lg:col-span-7 bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-3.5">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-[var(--text-main)]">Expense Category Distribution</h3>
            <span class="text-xs text-[var(--text-muted)] font-medium">By Cost Center</span>
          </div>
          <div class="space-y-3">
            ${(expenses.breakdown || []).map((b: any) => `
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-[var(--text-main)] flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${b.color};"></span>
                    ${b.category === 'Raw Materials' ? '🌾 Raw Materials (Ghee, Mawa, Sugar)' : b.category}
                  </span>
                  <span class="text-[var(--text-muted)]">
                    ₹${(b.amount || 0).toLocaleString()} <span class="text-[10px] text-[var(--text-light)] font-normal">(${b.percentage}%)</span>
                  </span>
                </div>
                <div class="w-full h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500" style="width: ${b.percentage}%; background-color: ${b.color};"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Detailed Expenses Ledger Table with Category Tabs & Branch Filter -->
      <section class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] shadow-subtle overflow-hidden space-y-0">
        <div class="p-4 sm:p-5 border-b border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-[var(--text-main)]">Expense Transactions</h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                ${filteredItems.length} Entries
              </span>
            </div>
            <p class="text-xs text-[var(--text-muted)] mt-0.5">Filter expenses by retail branch outlet or view combined shared overhead</p>
          </div>

          <!-- Dual Filter Toolbar: Branch Selector & Category Tabs -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Branch Store Filter -->
            <div class="flex items-center gap-1.5 bg-[var(--bg-subtle)] px-2.5 py-1 rounded-xl border border-[var(--border-color)] shadow-2xs">
              <span class="text-xs">🏢</span>
              <select id="expenses-branch-filter" class="bg-transparent text-xs font-bold text-[var(--text-main)] outline-none cursor-pointer">
                <option value="all" ${branchFilter === 'all' ? 'selected' : ''}>🌐 All Outlets (Combined &amp; Shared)</option>
                ${(state?.branches || []).map((b: any) => `
                  <option value="${b.id}" ${branchFilter === b.id ? 'selected' : ''}>🏢 ${b.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Category Filter Tabs -->
            <div class="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              ${categories.map(cat => {
                const isActive = (expensesFilterCategory || 'All') === cat;
                return `
                  <button 
                    data-expenses-category="${cat}"
                    class="px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[var(--brand-primary)] text-white shadow-xs' 
                        : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                    }"
                  >
                    ${cat === 'Raw Materials' ? '🌾 Raw Materials' : cat}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr class="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] text-[var(--text-muted)] font-semibold text-[11px] uppercase tracking-wider">
                <th class="py-3.5 px-5">Date</th>
                <th class="py-3.5 px-4">Description / Vendor</th>
                <th class="py-3.5 px-4">Category</th>
                <th class="py-3.5 px-4">Branch Allocation</th>
                <th class="py-3.5 px-4">Amount</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]/70">
              ${filteredItems.length === 0 ? `
                <tr>
                  <td colspan="7" class="py-12 text-center text-[var(--text-muted)]">
                    <p class="font-bold text-sm">No expenses found for this selection</p>
                    <p class="text-xs mt-1">Try switching branch or category filter, or click "+ Add Expense" above.</p>
                  </td>
                </tr>
              ` : filteredItems.map((item: any) => {
                const isRawMaterial = item.category === 'Raw Materials';
                const isAllBranches = !item.branchId || item.branchId === 'all';
                return `
                  <tr class="hover:bg-[var(--bg-highlight)]/40 transition-colors ${isRawMaterial ? 'bg-amber-50/20' : ''}">
                    <td class="py-3.5 px-5 font-bold text-[var(--text-main)] whitespace-nowrap">
                      ${item.date}
                    </td>
                    <td class="py-3.5 px-4 text-[var(--text-main)] font-semibold">
                      <div class="flex items-center gap-2">
                        ${isRawMaterial ? '<span class="text-base select-none">🌾</span>' : ''}
                        <span>${item.description}</span>
                      </div>
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                      <span class="inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                        isRawMaterial 
                          ? 'bg-[#FFF7ED] text-[#C86D3B] border border-[#FED7AA]'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]'
                      }">
                        ${isRawMaterial ? '🌾 Raw Materials' : item.category}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                        isAllBranches
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }">
                        ${isAllBranches ? '🌐 All Branches (Combined)' : `🏢 ${item.branchName || 'Branch'}`}
                      </span>
                    </td>
                    <td class="py-3.5 px-4 font-extrabold text-[var(--text-main)] tabular-nums whitespace-nowrap">
                      ₹${(Number(item.amount) || 0).toLocaleString()}
                    </td>
                    <td class="py-3.5 px-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ${item.status || 'Paid'}
                      </span>
                    </td>
                    <td class="py-3.5 px-5 text-right whitespace-nowrap">
                      <button 
                        data-delete-expense="${item.id}"
                        class="text-[var(--text-light)] hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 text-xs transition-colors cursor-pointer"
                        title="Delete expense"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

// Add Expense Modal - Fast, Instant-Close & Multi-Branch Supported
export function renderAddExpenseModal(state?: any) {
  const todayDate = new Date().toISOString().split('T')[0];
  const branches = state?.branches || [];

  return `
    <div class="modal-backdrop" id="add-expense-modal">
      <div class="modal-content p-6 space-y-4 max-w-md animate-fadeIn">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-orange-100 text-[#C86D3B] flex items-center justify-center font-bold text-sm">
              🧾
            </span>
            <div>
              <h3 class="text-base font-bold text-[var(--text-main)]">
                Record New Expense
              </h3>
              <p class="text-[11px] text-[var(--text-muted)]">
                Log raw material purchase, marketing campaign, or store utility bill
              </p>
            </div>
          </div>
          <button id="close-add-expense-btn" class="text-[var(--text-light)] hover:text-[var(--text-main)] p-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer" title="Close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </button>
        </div>

        <!-- New Expense Form (Closes immediately upon Save) -->
        <form id="add-expense-form" class="space-y-3.5 text-xs">
          <!-- Branch Allocation Selector -->
          <div>
            <label class="block font-bold text-[var(--text-main)] mb-1">
              Branch Store / Cost Center Allocation <span class="text-rose-500">*</span>
            </label>
            <select 
              name="branchId" 
              id="expense-branch-select"
              class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none font-bold"
            >
              <option value="all" ${state?.currentBranchId === 'all' ? 'selected' : ''}>
                🌐 All Branches (Enterprise Combined / Shared Overhead)
              </option>
              <optgroup label="Specific Gandhinagar Retail Outlets">
                ${branches.map((b: any) => `
                  <option value="${b.id}" ${b.id === state?.currentBranchId ? 'selected' : ''}>
                    🏢 ${b.name} (${b.city || 'Gandhinagar'})
                  </option>
                `).join('')}
              </optgroup>
            </select>
            <p class="text-[10px] text-stone-500 mt-1">
              Select <strong>"All Branches"</strong> for shared costs like bulk raw materials procurement or festival marketing. Or choose a specific outlet.
            </p>
          </div>

          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Description / Vendor *</label>
            <input 
              type="text" 
              name="description" 
              required 
              placeholder="e.g. Pure Desi Ghee 50kg, Kesar Saffron, Festive Hoardings" 
              class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-[var(--text-muted)] mb-1">Category</label>
              <select 
                name="category"
                class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none font-semibold"
              >
                <option value="Raw Materials" selected>🌾 Raw Materials</option>
                <option value="Utilities">⚡ Utilities</option>
                <option value="Staff Salary">👨‍🍳 Staff Salary</option>
                <option value="Marketing">📢 Marketing &amp; Banners</option>
                <option value="Other">📦 Other / Packaging</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-[var(--text-muted)] mb-1">Amount (₹) *</label>
              <input 
                type="number" 
                name="amount" 
                required 
                min="1"
                step="1"
                placeholder="e.g. 12450" 
                class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block font-semibold text-[var(--text-muted)]">Expense Date</label>
              <span class="text-[10px] text-stone-500 font-medium">Default: Current Day</span>
            </div>
            <input 
              type="date" 
              name="date" 
              id="expense-date-input"
              value="${todayDate}" 
              class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] font-semibold focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-2.5 pt-2">
            <button 
              type="button" 
              id="cancel-add-expense-btn"
              class="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="w-full py-2.5 bg-gradient-to-r from-[#B25D2E] to-[#C86D3B] hover:brightness-105 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>💾</span>
              <span>Save Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
