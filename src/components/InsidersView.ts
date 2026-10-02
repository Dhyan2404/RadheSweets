// Insiders Confidential Guide & Comprehensive ERP Specification
// Accessible exclusively via secret URL route: /insiders or #/insiders

export function renderInsidersView(state: any): string {
  return `
    <div class="space-y-8 select-text max-w-5xl mx-auto py-2 px-1 animate-fadeIn" data-purpose="insiders-master-guide">
      
      <!-- Top Secret Banner & Return Bar -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-[#241816] to-stone-900 text-white rounded-3xl shadow-xl border border-stone-800">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="px-3 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              🔒 Insiders Access Only
            </span>
            <span class="text-xs font-mono text-stone-400">/insiders</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Radhe Sweets ERP &amp; POS Master Blueprint</h1>
          <p class="text-xs sm:text-sm text-stone-300 font-medium">Complete architecture specification, operational flows, and module breakdown.</p>
        </div>

        <div class="flex items-center gap-2.5 shrink-0">
          <button 
            type="button" 
            data-tab="pos"
            class="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>🛍️ Go to Live POS</span>
          </button>
          <button 
            type="button" 
            data-tab="dashboard"
            class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 font-bold text-xs rounded-2xl transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Dashboard ➔</span>
          </button>
        </div>
      </section>

      <!-- Executive Overview Card -->
      <section class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-5">
        <div class="border-b border-[#F4EFE9] pb-4">
          <h2 class="text-xl font-extrabold text-[#2A1F1D] flex items-center gap-2.5">
            <span>✨</span>
            <span>Executive Overview</span>
          </h2>
          <p class="text-xs text-[#7C7267] mt-1">Radhe Sweets Confectionery Shop Manager &amp; High-Speed Cloud POS</p>
        </div>

        <p class="text-sm text-[#4A3A2F] leading-relaxed">
          <strong>Radhe Sweets</strong> is an enterprise confectionery ERP and lightning-speed Point of Sale (POS) system engineered specifically for high-volume traditional Indian sweet shops, mithai manufacturers, and festival caterers. It seamlessly combines zero-latency local billing, 100% offline-first resilience, multi-branch data isolation, and real-time synchronization with Google Cloud Firestore.
        </p>

        <!-- 4 Pillars Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div class="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
            <div class="text-xl">⚡</div>
            <h3 class="font-extrabold text-xs text-amber-950">High-Speed Billing</h3>
            <p class="text-[11px] text-stone-600 leading-normal">Zero lag, instant weight presets (100g to 1kg), dual unit pricing, and keyboard shortcuts.</p>
          </div>

          <div class="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-1.5">
            <div class="text-xl">📶</div>
            <h3 class="font-extrabold text-xs text-emerald-950">100% Offline-First</h3>
            <p class="text-[11px] text-stone-600 leading-normal">Billing continues if internet drops; receipts queue in local outbox and auto-sync when online.</p>
          </div>

          <div class="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-1.5">
            <div class="text-xl">🏢</div>
            <h3 class="font-extrabold text-xs text-blue-950">Multi-Branch Isolation</h3>
            <p class="text-[11px] text-stone-600 leading-normal">Separate stock, sales, expenses, UPI IDs, and addresses for Navrangpura, Satellite &amp; SG Highway.</p>
          </div>

          <div class="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl space-y-1.5">
            <div class="text-xl">👥</div>
            <h3 class="font-extrabold text-xs text-purple-950">Equal Patron CRM</h3>
            <p class="text-[11px] text-stone-600 leading-normal">All patrons treated equally without tiers or points. Unique #CUST-XXXX tracking with full bill history.</p>
          </div>
        </div>
      </section>

      <!-- Section 1: System Architecture & Core Philosophy -->
      <section class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-6">
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4">
          <div>
            <h2 class="text-xl font-extrabold text-[#2A1F1D] flex items-center gap-2.5">
              <span>🏛️</span>
              <span>1. System Architecture &amp; Core Philosophy</span>
            </h2>
            <p class="text-xs text-[#7C7267] mt-0.5">Foundational design standards and reliability mechanisms</p>
          </div>
          <span class="text-xs font-mono font-bold text-stone-400 bg-stone-100 px-2.5 py-1 rounded-xl">Core Tech</span>
        </div>

        <div class="space-y-4 text-xs sm:text-sm text-stone-700">
          <div class="flex items-start gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
            <span class="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
            <div>
              <strong class="text-stone-900 block text-sm">High-Speed Counter Billing (Zero Lag)</strong>
              <p class="text-xs text-stone-600 mt-0.5">Optimized for counter rushes during peak hours and major festivals (Diwali, Raksha Bandhan, Holi). Supports instant weighing, keyboard shortcuts, and zero full-page reloads.</p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
            <span class="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
            <div>
              <strong class="text-stone-900 block text-sm">100% Offline-First Resilience</strong>
              <p class="text-xs text-stone-600 mt-0.5">If the shop’s Wi-Fi drops, billing, receipt printing, inventory deduction, and customer management continue locally without interruption. Offline orders are stored in a persistent local queue (<code class="bg-stone-200 px-1.5 py-0.5 rounded text-[11px] font-mono">radhe_offline_orders_queue</code>) and automatically synced to <strong>Cloud Firestore</strong> the moment connection returns.</p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
            <span class="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
            <div>
              <strong class="text-stone-900 block text-sm">Multi-Branch Isolation</strong>
              <p class="text-xs text-stone-600 mt-0.5">Full multi-outlet support (e.g., <em>Navrangpura</em>, <em>Satellite</em>, <em>SG Highway</em>). Each branch maintains its own stock levels, sales records, expenses, UPI IDs (VPA), store addresses, and staff roster.</p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
            <span class="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
            <div>
              <strong class="text-stone-900 block text-sm">Equal Patron CRM</strong>
              <p class="text-xs text-stone-600 mt-0.5">All customers are treated with equal respect without loyalty points or tier segregation. Every customer receives a unique <code class="bg-stone-200 px-1.5 py-0.5 rounded text-[11px] font-mono">#CUST-XXXX</code> ID with full purchase and invoice history.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: Module-by-Module Breakdown -->
      <section class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-6">
        <div class="border-b border-[#F4EFE9] pb-4">
          <h2 class="text-xl font-extrabold text-[#2A1F1D] flex items-center gap-2.5">
            <span>📦</span>
            <span>2. Complete Module-by-Module Feature Breakdown</span>
          </h2>
          <p class="text-xs text-[#7C7267] mt-0.5">In-depth capabilities across all 8 functional domains</p>
        </div>

        <!-- Modules Accordion-style Display -->
        <div class="space-y-5">
          
          <!-- Module 1: POS -->
          <div class="p-5 rounded-2xl border border-amber-200/80 bg-amber-50/30 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-sm sm:text-base text-amber-950 flex items-center gap-2">
                <span>🛍️</span>
                <span>Module 1: Sell / POS Counter (<code class="text-xs font-mono text-amber-800">pos</code>)</span>
              </h3>
              <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">Counter Core</span>
            </div>
            <ul class="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
              <li><strong>100 Authentic Mithais Catalog:</strong> Sweets organized by category (<em>Traditional, Mawa &amp; Milk, Dry Fruit &amp; Kaju, Bengali, Festive</em>) with in-place live search without reloading.</li>
              <li><strong>Dual-Unit Weighing &amp; Quick Preset Chips:</strong> Fast 1-click selection for <strong>100g, 250g, 500g, 750g, 1kg</strong> with dynamic real-time rate math.</li>
              <li><strong>Hold &amp; Recall Multiple Active Carts:</strong> Park active customer carts under auto-generated tokens (e.g., <code class="bg-stone-100 px-1 py-0.2 rounded font-mono">Token #12 (Walk-in)</code>), view multiple held carts in a queue modal, and recall with auto-swap protection.</li>
              <li><strong>Tender &amp; Payment Methods:</strong> Cash (with quick change calculator), Dynamic Merchant UPI QR (live encoded with branch VPA &amp; amount), and Card EDC workflow.</li>
              <li><strong>Slide-to-Pay / Instant Checkout:</strong> Signature chocolate slider (<code class="text-xs font-mono text-stone-600">SlideCommit</code>) and instant click confirmation.</li>
              <li><strong>Mobile Zero-Scroll Checkout Bar:</strong> Frosted translucent black glass bar with slide-up cart sheet and haptic audio feedback.</li>
            </ul>
          </div>

          <!-- Module 2: Orders -->
          <div class="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <span>🧾</span>
                <span>Module 2: Orders &amp; Invoices (<code class="text-xs font-mono text-stone-700">orders</code>)</span>
              </h3>
              <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800">Audit &amp; Slips</span>
            </div>
            <ul class="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
              <li><strong>Invoice Cards &amp; List View:</strong> Displays invoice number, date/time, branch, customer name, itemized bill breakdown, and net total.</li>
              <li><strong>Interactive Swipe Rows (Mobile):</strong> Swipe left on any invoice to reveal 3 actions: <em>WhatsApp Share</em>, <em>View / Edit Bill</em>, and <em>Delete / Void Invoice</em> (with auto inventory restoration).</li>
              <li><strong>Thermal Printing:</strong> 2-inch and 3-inch ESC/POS slip generation with store logo, FSSAI number, HSN 2106 GST (2.5% CGST + 2.5% SGST), and footer UPI QR.</li>
            </ul>
          </div>

          <!-- Module 3: Customers & Advance Orders -->
          <div class="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <span>👥</span>
                <span>Module 3: Customer Directory &amp; Advance Orders (<code class="text-xs font-mono text-stone-700">customers</code>)</span>
              </h3>
              <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800">CRM &amp; Events</span>
            </div>
            <ul class="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
              <li><strong>Equal Treatment Directory:</strong> Customer profiles with unique <code class="bg-stone-200 px-1 py-0.2 rounded font-mono">#CUST-XXXX</code> IDs, phone, address, notes, and full purchase history.</li>
              <li><strong>Top 3 Spenders Podium:</strong> Showcase celebrating top lifetime confectionery patrons without artificial VIP tiers.</li>
              <li><strong>Multi-Criteria Sorting:</strong> Sort by <em>Most Spent</em>, <em>Least Spent</em>, <em>Newest</em>, <em>Oldest</em>, and <em>Name (A–Z)</em>.</li>
              <li><strong>Advance Bulk &amp; Event Orders:</strong> Full wedding catering and festival hamper management with event date, item breakdown, advance deposit paid, and balance due.</li>
              <li><strong>1-Click Status Cycling:</strong> Cycle through <code class="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">Confirmed</code> ➔ <code class="bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded">In Preparation</code> ➔ <code class="bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded">Ready</code> ➔ <code class="bg-stone-200 text-stone-800 px-1.5 py-0.2 rounded">Completed</code>.</li>
            </ul>
          </div>

          <!-- Module 4: Products -->
          <div class="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <span>🍬</span>
                <span>Module 4: Sweets Catalog &amp; Live Stock (<code class="text-xs font-mono text-stone-700">products</code>)</span>
              </h3>
              <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800">Inventory</span>
            </div>
            <ul class="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
              <li><strong>100 Traditional Confectionery Items:</strong> High-res imagery, unit rates, standard units (<code class="font-mono">kg</code> / <code class="font-mono">pc</code>), categories, and safety stock thresholds.</li>
              <li><strong>Device Photo Upload &amp; URL:</strong> Upload sweet photos directly from mobile/desktop with auto-compression, or link web URLs.</li>
              <li><strong>Quick Stock Adjustments:</strong> <code class="bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-mono">+5kg</code>, <code class="bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-mono">+10kg</code>, <code class="bg-rose-100 text-rose-900 px-1.5 py-0.2 rounded font-mono">-1kg</code> adjustments for counter alignment.</li>
              <li><strong>Raw Material PO Inward:</strong> Restock Mawa, Desi Ghee, Sugar, Cashews, Almonds, and Saffron with one click.</li>
              <li><strong>Category Master:</strong> Add, edit, or remove custom sweet categories.</li>
            </ul>
          </div>

          <!-- Module 5: Expenses -->
          <div class="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <span>💸</span>
                <span>Module 5: Daily Expenses &amp; Outflow (<code class="text-xs font-mono text-stone-700">expenses</code>)</span>
              </h3>
              <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800">Accounts</span>
            </div>
            <ul class="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
              <li><strong>Categorized Expense Tracking:</strong> Track Dairy/Mawa, Packaging, Staff/Labour, Utilities, Maintenance, and Marketing.</li>
              <li><strong>Date Filters:</strong> Filter by <em>Today</em>, <em>This Week</em>, <em>This Month</em>, <em>Quarterly</em>, or <em>Custom Date Range</em>.</li>
              <li><strong>Branch Expense Isolation:</strong> Outflows are tracked independently per physical branch.</li>
            </ul>
          </div>

          <!-- Module 6: Reports & Analytics -->
          <div class="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <span>📊</span>
                <span>Module 6: Financial Reports &amp; Profit (<code class="text-xs font-mono text-stone-700">analytics</code>)</span>
              </h3>
              <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800">P&amp;L Intelligence</span>
            </div>
            <ul class="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
              <li><strong>Executive Dashboard KPIs:</strong> Gross Revenue, Net Profit, Average Order Value (AOV), and Counter Visits.</li>
              <li><strong>HSN 2106 Tax Breakdown:</strong> Automated GST calculation (5% GST for fresh traditional sweets).</li>
              <li><strong>Per-Day &amp; Monthly Profit Deep-Dive:</strong> Compare revenue against ingredient costs and daily operational overheads.</li>
              <li><strong>CSV Export:</strong> 1-click export of sales, inventory, and expense ledgers.</li>
            </ul>
          </div>

          <!-- Module 7: Staff & Payroll -->
          <div class="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <span>👨‍🍳</span>
                <span>Module 7: Staff &amp; Payroll Management (<code class="text-xs font-mono text-stone-700">staff</code>)</span>
              </h3>
              <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800">HR &amp; Halwai</span>
            </div>
            <ul class="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
              <li><strong>Staff Roster:</strong> Manage Head Halwai, Cashiers, Packaging Staff, Store Managers, and Delivery Executives.</li>
              <li><strong>Payroll &amp; Advances:</strong> Base salary tracking, advance salary vouchers, and monthly disbursement records.</li>
              <li><strong>Attendance &amp; Leaves:</strong> Clock-in/out tracking and recorded leaves with reason logs.</li>
            </ul>
          </div>

          <!-- Module 8: Settings & Branches -->
          <div class="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
                <span>⚙️</span>
                <span>Module 8: Multi-Branch &amp; Store Configuration (<code class="text-xs font-mono text-stone-700">settings</code>)</span>
              </h3>
              <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800">Admin</span>
            </div>
            <ul class="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
              <li><strong>Branch Switcher:</strong> Toggle between Navrangpura, Satellite, and SG Highway branches or create new outlets.</li>
              <li><strong>Store UPI &amp; Address Master:</strong> Configure custom UPI VPAs and physical store addresses per branch.</li>
              <li><strong>Thermal Printer Settings:</strong> 58mm vs 80mm paper width, custom header/footer, and FSSAI license numbers.</li>
              <li><strong>Cloud Sync &amp; Backup:</strong> Force full cloud sync to Firestore and download offline JSON data backups.</li>
            </ul>
          </div>

        </div>
      </section>

      <!-- Section 3: Daily Operational Flow -->
      <section class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-5">
        <div class="border-b border-[#F4EFE9] pb-4">
          <h2 class="text-xl font-extrabold text-[#2A1F1D] flex items-center gap-2.5">
            <span>🔄</span>
            <span>3. Daily Operational Flow (A Day in the Life of Radhe Sweets)</span>
          </h2>
          <p class="text-xs text-[#7C7267] mt-0.5">End-to-end SOP from morning opening to night closing</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div class="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
            <span class="px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-black text-[10px] uppercase">1. Morning Setup</span>
            <ul class="text-[11px] text-stone-700 space-y-1">
              <li>• Switch to active branch</li>
              <li>• Check Advance Orders for today</li>
              <li>• Inward raw materials (Ghee/Mawa)</li>
            </ul>
          </div>

          <div class="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl space-y-2">
            <span class="px-2 py-0.5 rounded bg-orange-200 text-orange-950 font-black text-[10px] uppercase">2. Peak Counter Rush</span>
            <ul class="text-[11px] text-stone-700 space-y-1">
              <li>• Add sweets via weight presets</li>
              <li>• Hold cart if customer pauses</li>
              <li>• Recall held carts when ready</li>
              <li>• Instant scan UPI QR / Cash Pay</li>
            </ul>
          </div>

          <div class="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
            <span class="px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 font-black text-[10px] uppercase">3. Offline Contingency</span>
            <ul class="text-[11px] text-stone-700 space-y-1">
              <li>• Internet drops -> 100% Offline Mode</li>
              <li>• Bills queue in local outbox</li>
              <li>• Internet returns -> auto-syncs</li>
            </ul>
          </div>

          <div class="p-4 bg-stone-100 border border-stone-300 rounded-2xl space-y-2">
            <span class="px-2 py-0.5 rounded bg-stone-300 text-stone-950 font-black text-[10px] uppercase">4. Night Closing</span>
            <ul class="text-[11px] text-stone-700 space-y-1">
              <li>• Log petty cash expenses</li>
              <li>• Review Day's Profit &amp; P&amp;L</li>
              <li>• Check low-stock alerts for tomorrow</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Section 4: Technology Stack Summary Table -->
      <section class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-5">
        <div class="border-b border-[#F4EFE9] pb-4">
          <h2 class="text-xl font-extrabold text-[#2A1F1D] flex items-center gap-2.5">
            <span>⚙️</span>
            <span>4. Technology Stack Summary</span>
          </h2>
          <p class="text-xs text-[#7C7267] mt-0.5">Underlying technology layers powering the ERP</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border border-stone-200 rounded-2xl overflow-hidden">
            <thead class="bg-stone-100 text-stone-800 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th class="p-3 border-b border-stone-200">Layer</th>
                <th class="p-3 border-b border-stone-200">Technology</th>
                <th class="p-3 border-b border-stone-200">Purpose in Radhe Sweets</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 text-stone-700">
              <tr class="hover:bg-amber-50/40">
                <td class="p-3 font-bold text-stone-900">Frontend Framework</td>
                <td class="p-3 font-mono">Vanilla TypeScript + Vite 5</td>
                <td class="p-3">Instant HMR, zero framework overhead, ultra fast DOM rendering.</td>
              </tr>
              <tr class="hover:bg-amber-50/40">
                <td class="p-3 font-bold text-stone-900">Styling &amp; Design Tokens</td>
                <td class="p-3 font-mono">Tailwind CSS v4 + Vanilla CSS</td>
                <td class="p-3">Custom warm confectionery palette (terracotta, gold, roasted chocolate), frosted glassmorphism.</td>
              </tr>
              <tr class="hover:bg-amber-50/40">
                <td class="p-3 font-bold text-stone-900">Cloud Database</td>
                <td class="p-3 font-mono">Google Cloud Firestore (v12)</td>
                <td class="p-3">Real-time multi-device synchronization across store branches and smartphones.</td>
              </tr>
              <tr class="hover:bg-amber-50/40">
                <td class="p-3 font-bold text-stone-900">Offline-First Engine</td>
                <td class="p-3 font-mono">LocalStorage Outbox Queue</td>
                <td class="p-3">100% offline billing with automatic background sync and retry on reconnect.</td>
              </tr>
              <tr class="hover:bg-amber-50/40">
                <td class="p-3 font-bold text-stone-900">UPI Dynamic QR Engine</td>
                <td class="p-3 font-mono">qrcode Library</td>
                <td class="p-3">Generates live merchant dynamic UPI QR codes containing branch VPA and bill amount.</td>
              </tr>
              <tr class="hover:bg-amber-50/40">
                <td class="p-3 font-bold text-stone-900">Receipt Engine</td>
                <td class="p-3 font-mono">Browser Print API + HTML Canvas</td>
                <td class="p-3">Direct 2-inch and 3-inch thermal ESC/POS slip generation with HSN 2106 tax breakdown.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Bottom Quick Navigation -->
      <div class="text-center py-4">
        <p class="text-xs text-stone-500">
          This confidential blueprint is accessible exclusively via <code class="font-mono bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">/insiders</code> or <code class="font-mono bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">#/insiders</code>.
        </p>
      </div>

    </div>
  `;
}
