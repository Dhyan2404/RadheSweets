// Factory Reset & Clean Slate Handover Modal Component
// Allows Owner to completely wipe all operational back data (orders, sales history, expenses, audit logs, parked bills)
// for selling or handing over the software to a new sweet shop owner with zero test data.

export function renderFactoryResetModal(): string {
  return `
    <div id="factory-reset-modal-backdrop" class="fixed inset-0 bg-stone-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div class="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border-2 border-rose-300 animate-slide-up space-y-4">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-stone-200 pb-3">
          <div class="flex items-center gap-3">
            <span class="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-black shadow-xs shrink-0">
              🧹
            </span>
            <div>
              <h3 class="font-black text-base sm:text-lg text-stone-900">Confirm Store Factory Reset</h3>
              <p class="text-xs text-rose-600 font-bold">Wipe All Back Data for Software Resale</p>
            </div>
          </div>
          <button 
            type="button" 
            id="close-factory-reset-modal-btn" 
            class="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center font-bold text-sm cursor-pointer transition-all"
            title="Cancel"
          >
            ✕
          </button>
        </div>

        <!-- Warning & Erase Checklist -->
        <div class="space-y-3 text-xs text-stone-600 leading-relaxed">
          <p class="font-bold text-stone-800">
            You are preparing to hand over this system to a new store owner. This will permanently clear all demo/test back data:
          </p>

          <div class="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 space-y-1.5 text-[11px]">
            <div class="flex items-center gap-2 text-rose-800 font-semibold">
              <span>✕</span> <span>All Sales Orders &amp; Historical Invoices (state.orders = 0)</span>
            </div>
            <div class="flex items-center gap-2 text-rose-800 font-semibold">
              <span>✕</span> <span>All Recorded Operating Expenses &amp; Vendor Raw Material Bills</span>
            </div>
            <div class="flex items-center gap-2 text-rose-800 font-semibold">
              <span>✕</span> <span>All System Activity Logs &amp; Cashier Discount Trails</span>
            </div>
            <div class="flex items-center gap-2 text-rose-800 font-semibold">
              <span>✕</span> <span>All Parked Counter OTC Bills &amp; Active POS Carts</span>
            </div>
            <div class="flex items-center gap-2 text-rose-800 font-semibold">
              <span>✕</span> <span>Reset Customer Spent Amounts &amp; Order Counters to 0</span>
            </div>
            <div class="flex items-center gap-2 text-emerald-800 font-bold pt-1.5 border-t border-rose-200/80">
              <span>✓</span> <span>100+ Sweets Catalog, Prices, Recipes, Outlets &amp; Logins are KEPT intact.</span>
            </div>
          </div>

          <div class="space-y-1.5 pt-1">
            <label class="block text-xs font-black text-stone-800">
              Type <strong class="text-rose-600 font-mono tracking-wider">RESET</strong> to confirm permanent wipe:
            </label>
            <input 
              type="text" 
              id="factory-reset-confirm-input" 
              placeholder='Type "RESET" here...' 
              class="w-full px-4 py-3 bg-stone-50 border-2 border-stone-300 focus:border-rose-500 rounded-xl text-sm font-mono font-black text-center uppercase tracking-widest text-stone-900 outline-none focus:ring-4 focus:ring-rose-500/20"
              autocomplete="off"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2.5 pt-2 border-t border-stone-200">
          <button 
            type="button" 
            id="cancel-factory-reset-btn" 
            class="flex-1 py-3 px-4 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
          >
            Cancel (Keep Data)
          </button>
          <button 
            type="button" 
            id="execute-factory-reset-btn" 
            disabled
            class="flex-1 py-3 px-4 rounded-xl bg-stone-200 text-stone-400 font-extrabold text-xs transition-all cursor-not-allowed flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Wipe All Back Data</span>
          </button>
        </div>

      </div>
    </div>
  `;
}
