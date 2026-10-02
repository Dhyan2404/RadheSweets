// Advance Bulk & Event Order Modals
// Radhe Sweets - Comprehensive Festival & Catering Advance Booking System

export function renderAddAdvanceOrderModal(state: any) {
  const today = new Date().toISOString().split('T')[0];

  return `
    <div id="add-advance-modal-backdrop" class="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div class="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 animate-slide-up max-h-[92vh] overflow-y-auto space-y-4">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200/80 text-[#C86D3B] flex items-center justify-center font-bold text-base shadow-2xs">
              📅
            </span>
            <div>
              <h3 class="font-extrabold text-base sm:text-lg text-[#2A1F1D] tracking-tight">Book Advance Order</h3>
              <p class="text-[11px] text-stone-500">Log bulk wedding, festival or corporate gifting sweet bookings</p>
            </div>
          </div>
          <button 
            type="button"
            id="close-add-advance-modal-btn" 
            class="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center font-bold text-sm cursor-pointer transition-all active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <!-- Form -->
        <form id="add-advance-order-form" class="space-y-4 text-xs">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Customer / Host Name -->
            <div class="sm:col-span-2">
              <label class="block font-bold text-stone-700 mb-1">Customer / Host / Organization Name *</label>
              <input 
                type="text" 
                name="customerName" 
                required 
                placeholder="e.g. Patel Family Wedding, Reliance Petro Corp" 
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-bold text-[#2A1F1D] outline-none transition-all shadow-2xs"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block font-bold text-stone-700 mb-1">Contact Phone / WhatsApp *</label>
              <input 
                type="tel" 
                name="customerPhone" 
                required 
                placeholder="e.g. +91 98765 43210" 
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs text-[#2A1F1D] outline-none font-semibold transition-all shadow-2xs"
              />
            </div>

            <!-- Event Date -->
            <div>
              <label class="block font-bold text-stone-700 mb-1">Delivery / Event Date *</label>
              <input 
                type="date" 
                name="eventDate" 
                required 
                value="${today}"
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-semibold text-[#2A1F1D] outline-none transition-all shadow-2xs"
              />
            </div>

            <!-- Event Type -->
            <div class="sm:col-span-2">
              <label class="block font-bold text-stone-700 mb-1">Event / Booking Category</label>
              <select 
                name="eventType" 
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-semibold text-[#2A1F1D] outline-none transition-all shadow-2xs"
              >
                <option value="Wedding Catering" selected>💒 Wedding Catering</option>
                <option value="Corporate Festival Hampers">🏢 Corporate Festival Hampers</option>
                <option value="House Warming / Griha Pravesh">🏡 House Warming / Griha Pravesh</option>
                <option value="Diwali / Festive Bulk">🪔 Diwali / Festive Bulk</option>
                <option value="Birthday / Anniversary">🎂 Birthday / Anniversary</option>
                <option value="Religious Puja / Prasadam">🙏 Religious Puja / Prasadam</option>
                <option value="General Bulk Order">📦 General Bulk Order</option>
              </select>
            </div>

            <!-- Items & Quantities Summary -->
            <div class="sm:col-span-2">
              <label class="block font-bold text-stone-700 mb-1">Mithais, Items &amp; Packaging Breakdown *</label>
              <textarea 
                name="itemsSummary" 
                rows="2" 
                required 
                placeholder="e.g. 50kg Pure Kaju Katli in 1kg gift boxes, 25kg Motichoor Ladoo in Desi Ghee"
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-medium text-[#2A1F1D] outline-none transition-all shadow-2xs resize-none"
              ></textarea>
            </div>

            <!-- Financials: Total & Deposit -->
            <div>
              <label class="block font-bold text-stone-700 mb-1">Total Order Value (₹) *</label>
              <input 
                type="number" 
                id="adv-total-amount"
                name="totalAmount" 
                required 
                min="0" 
                step="1"
                placeholder="e.g. 25000" 
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-bold text-[#2A1F1D] outline-none transition-all shadow-2xs"
              />
            </div>

            <div>
              <label class="block font-bold text-stone-700 mb-1">Advance Deposit Paid (₹)</label>
              <input 
                type="number" 
                id="adv-deposit-paid"
                name="depositPaid" 
                value="0" 
                min="0" 
                step="1"
                placeholder="e.g. 10000" 
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-bold text-emerald-700 outline-none transition-all shadow-2xs"
              />
            </div>

            <!-- Status -->
            <div class="sm:col-span-2">
              <label class="block font-bold text-stone-700 mb-1">Order Status</label>
              <select 
                name="status" 
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-bold text-[#2A1F1D] outline-none transition-all shadow-2xs"
              >
                <option value="Confirmed" selected>✓ Confirmed (Booking Logged)</option>
                <option value="In Preparation">👨‍🍳 In Preparation (Kitchen Active)</option>
                <option value="Ready">📦 Ready For Handover</option>
                <option value="Completed">🏁 Completed &amp; Delivered</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
            <button 
              type="button" 
              id="cancel-add-advance-modal-btn"
              class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-5 py-2.5 bg-gradient-to-r from-[#B25D2E] to-[#C86D3B] hover:brightness-105 active:scale-95 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>💾</span>
              <span>Save Advance Order</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  `;
}

export function renderEditAdvanceOrderModal(order: any) {
  if (!order) return '';

  return `
    <div id="edit-advance-modal-backdrop" class="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div class="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 animate-slide-up max-h-[92vh] overflow-y-auto space-y-4">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200/80 text-[#C86D3B] flex items-center justify-center font-bold text-base shadow-2xs">
              ✏️
            </span>
            <div>
              <h3 class="font-extrabold text-base sm:text-lg text-[#2A1F1D] tracking-tight">Edit Advance Order</h3>
              <p class="text-[11px] text-stone-500">Order #${order.id} • ${order.customerName}</p>
            </div>
          </div>
          <button 
            type="button" 
            id="close-edit-advance-modal-btn" 
            class="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center font-bold text-sm cursor-pointer transition-all active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <!-- Form -->
        <form id="edit-advance-order-form" class="space-y-4 text-xs">
          <input type="hidden" name="orderId" value="${order.id}" />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Customer / Host Name -->
            <div class="sm:col-span-2">
              <label class="block font-bold text-stone-700 mb-1">Customer / Host / Organization Name *</label>
              <input 
                type="text" 
                name="customerName" 
                required 
                value="${order.customerName || ''}"
                placeholder="e.g. Patel Family Wedding" 
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-bold text-[#2A1F1D] outline-none transition-all shadow-2xs"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block font-bold text-stone-700 mb-1">Contact Phone / WhatsApp *</label>
              <input 
                type="tel" 
                name="customerPhone" 
                required 
                value="${order.customerPhone || ''}"
                placeholder="e.g. +91 98765 43210" 
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs text-[#2A1F1D] outline-none font-semibold transition-all shadow-2xs"
              />
            </div>

            <!-- Event Date -->
            <div>
              <label class="block font-bold text-stone-700 mb-1">Delivery / Event Date *</label>
              <input 
                type="text" 
                name="eventDate" 
                required 
                value="${order.eventDate || order.deliveryDate || ''}"
                placeholder="e.g. 2026-10-15 or 15 Oct 2026"
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-semibold text-[#2A1F1D] outline-none transition-all shadow-2xs"
              />
            </div>

            <!-- Event Type -->
            <div class="sm:col-span-2">
              <label class="block font-bold text-stone-700 mb-1">Event / Booking Category</label>
              <select 
                name="eventType" 
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-semibold text-[#2A1F1D] outline-none transition-all shadow-2xs"
              >
                ${['Wedding Catering', 'Corporate Festival Hampers', 'House Warming / Griha Pravesh', 'Diwali / Festive Bulk', 'Birthday / Anniversary', 'Religious Puja / Prasadam', 'General Bulk Order'].map(opt => `
                  <option value="${opt}" ${order.eventType === opt ? 'selected' : ''}>${opt}</option>
                `).join('')}
              </select>
            </div>

            <!-- Items & Quantities Summary -->
            <div class="sm:col-span-2">
              <label class="block font-bold text-stone-700 mb-1">Mithais, Items &amp; Packaging Breakdown *</label>
              <textarea 
                name="itemsSummary" 
                rows="2" 
                required 
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-medium text-[#2A1F1D] outline-none transition-all shadow-2xs resize-none"
              >${order.itemsSummary || order.event || ''}</textarea>
            </div>

            <!-- Financials: Total & Deposit -->
            <div>
              <label class="block font-bold text-stone-700 mb-1">Total Order Value (₹) *</label>
              <input 
                type="number" 
                name="totalAmount" 
                required 
                min="0" 
                step="1"
                value="${order.totalAmount || order.total || 0}"
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-bold text-[#2A1F1D] outline-none transition-all shadow-2xs"
              />
            </div>

            <div>
              <label class="block font-bold text-stone-700 mb-1">Advance Deposit Paid (₹)</label>
              <input 
                type="number" 
                name="depositPaid" 
                value="${order.depositPaid || 0}" 
                min="0" 
                step="1"
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-bold text-emerald-700 outline-none transition-all shadow-2xs"
              />
            </div>

            <!-- Status -->
            <div class="sm:col-span-2">
              <label class="block font-bold text-stone-700 mb-1">Order Status</label>
              <select 
                name="status" 
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs font-bold text-[#2A1F1D] outline-none transition-all shadow-2xs"
              >
                ${['Confirmed', 'In Preparation', 'Ready', 'Completed'].map(st => `
                  <option value="${st}" ${order.status === st ? 'selected' : ''}>${st}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
            <button 
              type="button" 
              id="cancel-edit-advance-modal-btn"
              class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-5 py-2.5 bg-gradient-to-r from-[#B25D2E] to-[#C86D3B] hover:brightness-105 active:scale-95 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>💾</span>
              <span>Update Advance Order</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  `;
}
