// Profile, Settings, RBAC & Cash Drawer Z-Report Reconciliation Component

export function renderSettingsView(state) {
  const { shopInfo, currentTheme, isDarkMode, userRole = 'SUPER_ADMIN', zReports = [], auditLogs = [], branches = [], currentBranchId = 'br-1' } = state;

  return `
    <div class="space-y-6 max-w-4xl">
      <!-- Header -->
      <section>
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold text-[var(--text-main)] tracking-tight">Settings & Branch Configuration</h2>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Security & Administration
          </span>
        </div>
        <p class="text-xs text-[var(--text-muted)] mt-0.5">Switch active store branch, RBAC permissions, cash drawer Z-reports & tax localization</p>
      </section>

      <!-- Active Branch Location Selector (Changeable Only in Settings) -->
      <section class="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-3">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div>
            <h3 class="text-sm font-bold text-[var(--text-main)]">🏢 Active Branch Location</h3>
            <p class="text-[11px] text-[var(--text-light)]">Select which store branch to manage. Active branch is displayed on the top navigation bar.</p>
          </div>
          <span class="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Owner Only
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          ${branches.map(b => `
            <div 
              data-setting-select-branch="${b.id}"
              class="p-4 rounded-xl border cursor-pointer transition-all ${
                b.id === currentBranchId 
                  ? 'border-[var(--brand-primary)] bg-[var(--bg-highlight)] ring-2 ring-[var(--brand-primary)]/20 shadow-xs' 
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[var(--brand-primary)]'
              }"
            >
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono font-bold text-[var(--brand-primary)]">${b.code}</span>
                ${b.id === currentBranchId ? '<span class="text-xs text-emerald-600 font-bold">Active ✓</span>' : '<span class="text-xs text-[var(--brand-primary)] font-semibold">Switch →</span>'}
              </div>
              <h4 class="font-bold text-sm text-[var(--text-main)] mt-1">${b.name}</h4>
              <p class="text-[11px] text-[var(--text-muted)]">${b.city}</p>
              <p class="text-[10px] text-[var(--text-light)] mt-2">Revenue: ₹${b.revenue.toLocaleString()} • Margin: ${b.margin}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- User Session Card -->
      <section class="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-4">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 rounded-2xl bg-[var(--brand-primary)] text-white font-extrabold text-lg flex items-center justify-center shadow-xs">
              AS
            </div>
            <div>
              <h3 class="text-sm font-bold text-[var(--text-main)]">Active User Session</h3>
              <p class="text-xs text-[var(--text-muted)]">Anand Shah • Shop Owner</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Full System Access
            </span>
          </div>
        </div>

        <!-- Role Permissions Matrix -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Granular Role-Based Access Control (RBAC)</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-[var(--bg-subtle)] text-[var(--text-muted)] text-[10px] font-bold uppercase">
                  <th class="py-2 px-3">Role</th>
                  <th class="py-2 px-2 text-center">POS Billing</th>
                  <th class="py-2 px-2 text-center">Profit & Margins</th>
                  <th class="py-2 px-2 text-center">Cost Ledgers</th>
                  <th class="py-2 px-2 text-center">Price Overrides</th>
                  <th class="py-2 px-2 text-center">Void / Refunds</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--border-subtle)] text-[11px]">
                <tr class="${userRole === 'SUPER_ADMIN' ? 'bg-amber-50/50 font-bold' : ''}">
                  <td class="py-2.5 px-3 font-semibold text-[var(--text-main)]">👑 Super Admin (Owner)</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ Full</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ Full</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ Full</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ Allowed</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ Allowed</td>
                </tr>
                <tr class="${userRole === 'BRANCH_MANAGER' ? 'bg-amber-50/50 font-bold' : ''}">
                  <td class="py-2.5 px-3 font-semibold text-[var(--text-main)]">🏬 Branch Manager</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ Full</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ Branch Only</td>
                  <td class="py-2.5 px-2 text-center text-stone-400">View Only</td>
                  <td class="py-2.5 px-2 text-center text-amber-600">Supervised</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ Authorize</td>
                </tr>
                <tr class="${userRole === 'CASHIER' ? 'bg-amber-50/50 font-bold' : ''}">
                  <td class="py-2.5 px-3 font-semibold text-[var(--text-main)]">🧾 Cashier (Counter)</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ Speed POS</td>
                  <td class="py-2.5 px-2 text-center text-rose-500">✗ Hidden</td>
                  <td class="py-2.5 px-2 text-center text-rose-500">✗ Hidden</td>
                  <td class="py-2.5 px-2 text-center text-rose-500">✗ Locked</td>
                  <td class="py-2.5 px-2 text-center text-rose-500">✗ Manager Req.</td>
                </tr>
                <tr class="${userRole === 'HEAD_CHEF' ? 'bg-amber-50/50 font-bold' : ''}">
                  <td class="py-2.5 px-3 font-semibold text-[var(--text-main)]">👨‍🍳 Head Chef / Halwai</td>
                  <td class="py-2.5 px-2 text-center text-stone-400">✗ Hidden</td>
                  <td class="py-2.5 px-2 text-center text-stone-400">✗ Hidden</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ Batch Production</td>
                  <td class="py-2.5 px-2 text-center text-stone-400">✗ Hidden</td>
                  <td class="py-2.5 px-2 text-center text-stone-400">✗ Hidden</td>
                </tr>
                <tr class="${userRole === 'ACCOUNTANT' ? 'bg-amber-50/50 font-bold' : ''}">
                  <td class="py-2.5 px-3 font-semibold text-[var(--text-main)]">📊 Accountant</td>
                  <td class="py-2.5 px-2 text-center text-stone-400">Audit Only</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ P&L & GST</td>
                  <td class="py-2.5 px-2 text-center text-emerald-600">✓ Cost Ledger</td>
                  <td class="py-2.5 px-2 text-center text-stone-400">✗ Locked</td>
                  <td class="py-2.5 px-2 text-center text-stone-400">✗ Locked</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Cash Drawer Reconciliation (Z-Report Shift Handover) -->
      <section class="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-4">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div>
            <h3 class="text-sm font-bold text-[var(--text-main)]">💵 Cash Drawer Reconciliation (Z-Report)</h3>
            <p class="text-[11px] text-[var(--text-light)]">Register shift handover tracking comparing system expected cash with physical cash</p>
          </div>
          <span class="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Shift Register Active
          </span>
        </div>

        <form id="z-report-reconcile-form" class="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Opening Cash Float</label>
            <input type="number" id="z-opening-float" value="5000" disabled class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl font-bold text-[var(--text-main)]" />
          </div>
          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">System Expected Cash</label>
            <input type="number" id="z-expected-cash" value="18450" disabled class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl font-bold text-emerald-600" />
          </div>
          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Physically Counted Cash *</label>
            <input type="number" id="z-counted-cash" value="18450" class="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--brand-primary)] rounded-xl font-extrabold text-[var(--text-main)] focus:outline-none" />
          </div>
          <div class="flex items-end">
            <button type="submit" class="w-full py-2.5 bg-[var(--brand-primary)] text-white font-bold rounded-xl hover:bg-[var(--brand-primary-hover)] transition-all">
              ✓ Close Shift & Print Z-Report
            </button>
          </div>
        </form>

        <!-- Previous Shift Z-Report History -->
        <div class="mt-3">
          <p class="text-[11px] font-bold text-[var(--text-muted)] mb-2 uppercase">Recent Shift Closures</p>
          <div class="space-y-2">
            ${zReports.map(z => `
              <div class="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-between text-xs">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-[var(--text-main)] font-mono">${z.id}</span>
                    <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded font-bold">${z.status}</span>
                  </div>
                  <p class="text-[10px] text-[var(--text-light)] mt-0.5">${z.shift} • Cashier: ${z.cashier}</p>
                </div>
                <div class="text-right">
                  <p class="font-extrabold text-[var(--text-main)]">Expected: ₹${z.expectedCash.toLocaleString()} | Counted: ₹${z.countedCash.toLocaleString()}</p>
                  <p class="text-[10px] ${z.variance === 0 ? 'text-emerald-600' : 'text-rose-600'} font-bold">Variance: ₹${z.variance}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Audit Trail & Anti-Fraud Logs -->
      <section class="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-4">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div>
            <h3 class="text-sm font-bold text-[var(--text-main)]">🛡️ System Audit Trail & Anti-Fraud Logs</h3>
            <p class="text-[11px] text-[var(--text-light)]">Immutable log of cashier voids, discount overrides, inventory updates & shift changes</p>
          </div>
          <span class="text-[10px] font-mono text-[var(--text-light)]">Encrypted Ledger</span>
        </div>

        <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
          ${auditLogs.map(log => `
            <div class="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <div class="flex items-center space-x-3">
                <span class="text-[10px] font-mono font-bold text-[var(--brand-primary)] bg-white px-2 py-0.5 rounded border border-[var(--border-color)]">${log.time}</span>
                <div>
                  <span class="font-bold text-[var(--text-main)]">${log.action}</span>
                  <span class="text-[11px] text-[var(--text-light)]">by ${log.user}</span>
                  <p class="text-[11px] text-[var(--text-muted)] mt-0.5">${log.details}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Google SEO, Search Console & Sitemap Management (Cleanly moved to Settings) -->
      <section class="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-4">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-[#E6F4EA] border border-[#CDE9D3] text-[#1E7E34] flex items-center justify-center font-bold text-sm shadow-2xs">
              <span class="w-3 h-3 rounded-full bg-[#34A853] animate-pulse"></span>
            </div>
            <div>
              <h3 class="text-sm font-bold text-[var(--text-main)]">Google SEO, Sitemap &amp; Rich Schema Hub</h3>
              <p class="text-[11px] text-[var(--text-light)]">Technical search engine indexation, dynamic meta tags &amp; canonical routing</p>
            </div>
          </div>
          <button 
            type="button"
            id="settings-open-seo-modal-btn"
            class="px-4 py-2 rounded-xl text-xs font-bold bg-[#E6F4EA] hover:bg-[#D5EEDC] text-[#1E7E34] border border-[#CDE9D3] transition-all cursor-pointer shadow-2xs interactive-scale flex items-center gap-1.5"
          >
            <span>Launch Audit Hub</span>
            <span>→</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-700">XML Sitemap</span>
              <span class="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Active ✓</span>
            </div>
            <p class="text-[11px] text-stone-500 mt-1">public/sitemap.xml (8 tabs indexed)</p>
            <a href="/sitemap.xml" target="_blank" class="text-[10px] text-[#C86D3B] font-semibold hover:underline mt-1 inline-block">View XML →</a>
          </div>

          <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-700">Robots.txt</span>
              <span class="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Crawling Allowed ✓</span>
            </div>
            <p class="text-[11px] text-stone-500 mt-1">public/robots.txt (Allow: /)</p>
            <a href="/robots.txt" target="_blank" class="text-[10px] text-[#C86D3B] font-semibold hover:underline mt-1 inline-block">View File →</a>
          </div>

          <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div class="flex items-center justify-between">
              <span class="font-bold text-stone-700">Schema.org JSON-LD</span>
              <span class="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Rich Snippets ✓</span>
            </div>
            <p class="text-[11px] text-stone-500 mt-1">Bakery / Confectionery Store Schema</p>
            <span class="text-[10px] text-stone-400 mt-1 inline-block">Geo &amp; Opening Hours active</span>
          </div>
        </div>
      </section>

      <!-- Store Profile & Tax Localization Form -->
      <section class="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-subtle space-y-4">
        <h3 class="text-sm font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">
          🏬 Store Profile & Multi-Currency / Tax Localization
        </h3>

        <form id="store-profile-form" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold text-[var(--text-muted)] mb-1">Shop Name</label>
              <input type="text" name="name" value="${shopInfo.name}" class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] font-bold" />
            </div>
            <div>
              <label class="block font-semibold text-[var(--text-muted)] mb-1">Brand Tagline</label>
              <input type="text" name="subName" value="${shopInfo.subName}" class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] font-bold" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-[var(--text-muted)] mb-1">Address</label>
            <input type="text" name="address" value="${shopInfo.address}" class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)]" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-semibold text-[var(--text-muted)] mb-1">Phone</label>
              <input type="text" name="phone" value="${shopInfo.phone}" class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)]" />
            </div>
            <div>
              <label class="block font-semibold text-[var(--text-muted)] mb-1">GSTIN</label>
              <input type="text" name="gstin" value="${shopInfo.gstin}" class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] font-mono" />
            </div>
            <div>
              <label class="block font-semibold text-[var(--text-muted)] mb-1">FSSAI Lic. No.</label>
              <input type="text" name="fssai" value="${shopInfo.fssai}" class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] font-mono" />
            </div>
          </div>

          <div class="pt-2 flex items-center justify-between">
            <button type="submit" class="px-5 py-2.5 bg-[var(--brand-primary)] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[var(--brand-primary-hover)] transition-all">
              Save Configuration
            </button>
            <button id="reset-all-data-btn" type="button" class="text-xs font-semibold text-rose-500 hover:underline">
              Factory Reset Data
            </button>
          </div>
        </form>
      </section>
    </div>
  `;
}
