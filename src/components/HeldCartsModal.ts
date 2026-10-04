// Held & Parked Carts Modal Component
// Supports holding and recalling multiple active carts during counter rushes

export function renderHeldCartsModal(state: any): string {
  const currentBranchId = state.currentBranchId || 'br-1';
  const parkedBills = (state.parkedBills || []).filter((b: any) => !b.branchId || b.branchId === currentBranchId);
  const currentCart = state.posCart || [];
  const currentCartSubtotal = currentCart.reduce((sum: number, it: any) => sum + (it.rate * it.qty), 0);
  const currentCartDiscount = Math.round((currentCartSubtotal * (state.discountPercent || 0)) / 100);
  const currentCartTotal = Math.max(0, currentCartSubtotal - currentCartDiscount);

  return `
    <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn select-none" id="held-carts-modal">
      <div class="bg-white rounded-3xl p-5 sm:p-7 space-y-5 max-w-2xl w-full border border-[#F0ECE4] shadow-2xl animate-scaleUp max-h-[90vh] flex flex-col">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4 shrink-0">
          <div class="flex items-center space-x-3">
            <div class="w-11 h-11 rounded-2xl bg-amber-100 text-[#C86D3B] flex items-center justify-center font-bold text-xl border border-amber-200 shadow-2xs">
              ⏸️
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg sm:text-xl font-extrabold text-[#2A1F1D]">Held &amp; Parked Carts</h3>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                  ${parkedBills.length} Active Hold${parkedBills.length === 1 ? '' : 's'}
                </span>
              </div>
              <p class="text-xs text-[#7C7267]">Park OTC patrons while they decide, serve the next customer, and recall anytime</p>
            </div>
          </div>
          <button type="button" id="close-held-carts-btn" class="text-stone-400 hover:text-stone-800 p-2 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>

        <!-- Quick Action: Park Current Cart if active -->
        ${currentCart.length > 0 ? `
          <div class="p-3.5 bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-white rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-2.5">
              <span class="text-xl">🛒</span>
              <div>
                <p class="text-xs font-bold text-stone-900">Current Counter Cart has ${currentCart.length} item(s) • ₹${currentCartTotal}</p>
                <p class="text-[11px] text-stone-600">Patron: <strong class="text-[#C86D3B]">${state.selectedCustomer?.name || 'Walk-in (OTC)'}</strong></p>
              </div>
            </div>
            <button 
              type="button" 
              id="modal-hold-current-cart-btn" 
              class="px-4 py-2 bg-[#C86D3B] hover:bg-[#B25D2E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <span>⏸️ Park Current Cart</span>
            </button>
          </div>
        ` : ''}

        <!-- Scrollable Carts List -->
        <div class="space-y-3 overflow-y-auto flex-1 pr-1">
          ${parkedBills.length === 0 ? `
            <div class="py-12 text-center bg-stone-50/80 rounded-2xl border border-dashed border-stone-200 space-y-2">
              <span class="text-4xl">🛍️</span>
              <p class="text-sm font-bold text-stone-800">No Carts Currently Held</p>
              <p class="text-xs text-stone-500 max-w-sm mx-auto">
                When a customer needs time to choose or call someone, click <strong>"Hold Cart"</strong> on the counter to serve the next customer without losing the bill.
              </p>
            </div>
          ` : parkedBills.map((bill: any, idx: number) => {
            const customerName = bill.customer?.name || 'Walk-in Counter Patron';
            const items = bill.items || [];
            const billTotal = bill.total || bill.items?.reduce((s: number, i: any) => s + (i.rate * i.qty), 0) || 0;

            return `
              <div class="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all space-y-3">
                <!-- Card Top Info -->
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <span class="w-8 h-8 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-2xs shrink-0">
                      #${idx + 1}
                    </span>
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <h4 class="font-extrabold text-sm text-stone-900">${customerName}</h4>
                        <span class="text-[10px] font-bold px-2 py-0.2 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                          ${bill.label || `Token #${idx + 1}`}
                        </span>
                      </div>
                      <p class="text-[11px] text-stone-500 font-medium">Held at ${bill.time || 'Recently'}</p>
                    </div>
                  </div>

                  <div class="text-right shrink-0">
                    <span class="text-xs text-stone-500 block">Total Value</span>
                    <span class="text-base font-black text-[#C86D3B]">₹${billTotal}</span>
                  </div>
                </div>

                <!-- Items Breakdown Pills -->
                <div class="bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  ${items.map((it: any) => `
                    <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-bold text-stone-800 shadow-2xs">
                      <img 
                        src="${it.image || (it.id && String(it.id).startsWith('sw-') ? `/assets/sweets/${it.id}.png` : '/assets/sweets/sw-1.png')}" 
                        alt="${it.name}" 
                        class="w-4 h-4 rounded object-cover"
                        onerror="this.style.display='none'"
                      />
                      <span>${it.name}</span>
                      <span class="text-amber-800 bg-amber-50 px-1 py-0.2 rounded text-[10px] font-mono">
                        ${it.qty >= 1 ? `${it.qty} ${it.unit || 'kg'}` : `${Math.round(it.qty * 1000)}g`}
                      </span>
                    </span>
                  `).join('')}
                </div>

                <!-- Optional Order Notes -->
                ${bill.orderNote ? `
                  <p class="text-[11px] text-stone-600 italic bg-amber-50/50 px-2.5 py-1 rounded-lg border border-amber-200/50">
                    Note: “${bill.orderNote}”
                  </p>
                ` : ''}

                <!-- Actions -->
                <div class="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button 
                    type="button" 
                    data-discard-parked-bill="${bill.id}"
                    class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 transition-all cursor-pointer flex items-center gap-1"
                    title="Discard this held cart"
                  >
                    <span>🗑️ Discard</span>
                  </button>

                  <button 
                    type="button" 
                    data-resume-parked-bill="${bill.id}"
                    class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>▶️ Resume &amp; Bill</span>
                    <span class="opacity-90">• ₹${billTotal}</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Footer -->
        <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-between shrink-0">
          <span class="text-xs text-stone-500">
            ${parkedBills.length} cart${parkedBills.length === 1 ? '' : 's'} on hold
          </span>
          <button 
            type="button" 
            id="close-held-carts-bottom-btn" 
            class="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl font-bold text-xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  `;
}
