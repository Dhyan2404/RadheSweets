// Expenses Management View Component

export function renderExpensesView(state) {
  const { expenses } = state;

  return `
    <div class="space-y-6">
      <!-- Header -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-[var(--text-main)] tracking-tight">Expenses</h2>
          <p class="text-xs text-[var(--text-muted)] mt-0.5">Track and record your confectionery raw materials, utilities & shop expenses</p>
        </div>

        <button id="open-add-expense-modal-btn" class="px-4 py-2 bg-[var(--brand-primary)] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[var(--brand-primary-hover)] transition-all flex items-center gap-1.5 self-start sm:self-auto">
          <span>+</span> Add Expense
        </button>
      </section>

      <!-- Expense Summary & Breakdown Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Total Expenses KPI (5 Cols) -->
        <div class="lg:col-span-5 bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Expenses</span>
              <span class="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                ↗ ${expenses.change}
              </span>
            </div>
            <div class="text-3xl sm:text-4xl font-black text-[var(--text-main)] mt-2">
              ₹${expenses.total.toLocaleString()}
            </div>
            <p class="text-xs text-[var(--text-light)] mt-1">Total spend recorded for September 2026</p>
          </div>

          <!-- Trendline SVG -->
          <div class="mt-4 pt-2">
            <svg class="w-full h-12" fill="none" viewBox="0 0 200 40" preserveAspectRatio="none">
              <path d="M0 28 Q 40 32, 80 20 T 140 24 T 200 8" fill="none" stroke="#F43F5E" stroke-width="2.5" stroke-linecap="round"></path>
              <path d="M0 28 Q 40 32, 80 20 T 140 24 T 200 8 L 200 40 L 0 40 Z" fill="#F43F5E" opacity="0.12"></path>
            </svg>
          </div>
        </div>

        <!-- Expense Category Breakdown (7 Cols) -->
        <div class="lg:col-span-7 bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-3.5">
          <h3 class="text-sm font-bold text-[var(--text-main)]">Expense Breakdown</h3>
          <div class="space-y-3">
            ${expenses.breakdown.map(b => `
              <div>
                <div class="flex justify-between text-xs font-semibold mb-1">
                  <span class="text-[var(--text-main)] flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${b.color};"></span>
                    ${b.category}
                  </span>
                  <span class="text-[var(--text-muted)]">
                    ₹${b.amount.toLocaleString()} <span class="text-[10px] text-[var(--text-light)] font-normal">(${b.percentage}%)</span>
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

      <!-- Detailed Expenses Ledger Table -->
      <section class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] shadow-subtle overflow-hidden">
        <div class="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <h3 class="text-sm font-bold text-[var(--text-main)]">Expense Transactions</h3>
          <span class="text-xs text-[var(--text-light)] font-medium">This Month</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr class="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] text-[var(--text-muted)] font-semibold text-[11px] uppercase tracking-wider">
                <th class="py-3.5 px-5">Date</th>
                <th class="py-3.5 px-4">Description</th>
                <th class="py-3.5 px-4">Category</th>
                <th class="py-3.5 px-4">Amount</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-color)]/70">
              ${expenses.items.map(item => `
                <tr class="hover:bg-[var(--bg-highlight)]/40 transition-colors">
                  <td class="py-3.5 px-5 font-bold text-[var(--text-main)]">
                    ${item.date}
                  </td>
                  <td class="py-3.5 px-4 text-[var(--text-main)] font-semibold">
                    ${item.description}
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-color)]">
                      ${item.category}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-extrabold text-[var(--text-main)]">
                    ₹${item.amount.toLocaleString()}
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ${item.status || 'Paid'}
                    </span>
                  </td>
                  <td class="py-3.5 px-5 text-right">
                    <button 
                      data-delete-expense="${item.id}"
                      class="text-[var(--text-light)] hover:text-rose-500 p-1 text-xs transition-colors"
                      title="Delete expense"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

// Add Expense Modal
export function renderAddExpenseModal() {
  return `
    <div class="modal-backdrop" id="add-expense-modal">
      <div class="modal-content p-6 space-y-4 max-w-md">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <h3 class="text-base font-bold text-[var(--text-main)]">Record New Expense</h3>
          <button id="close-add-expense-btn" class="text-[var(--text-light)] hover:text-[var(--text-main)] p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </button>
        </div>

        <form id="add-expense-form" class="space-y-3.5 text-xs">
          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Description *</label>
            <input 
              type="text" 
              name="description" 
              required 
              placeholder="e.g. Milk & Khoya purchase, Kitchen gas cylinder" 
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
                <option value="Raw Materials">Raw Materials</option>
                <option value="Utilities">Utilities</option>
                <option value="Staff Salary">Staff Salary</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-[var(--text-muted)] mb-1">Amount (₹) *</label>
              <input 
                type="number" 
                name="amount" 
                required 
                placeholder="e.g. 2500" 
                class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none font-bold"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Date</label>
            <input 
              type="text" 
              name="date" 
              value="25 Sep" 
              class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:bg-[var(--bg-surface)] focus:border-[var(--brand-primary)] focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            class="w-full py-3 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
          >
            Save Expense
          </button>
        </form>
      </div>
    </div>
  `;
}
