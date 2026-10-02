// Branch Management Modals: Add Branch & Edit Branch
// Tailored for Radhe Sweets Multi-Store ERP with Real-Time Cloud Firestore Sync

export function renderAddBranchModal(state: any) {
  const branches = state.branches || [];
  const nextNum = branches.length + 1;
  const suggestedCode = `BR-LOC-0${nextNum}`;

  return `
    <div id="add-branch-modal-backdrop" class="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div class="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-stone-200 animate-slide-up max-h-[92vh] overflow-y-auto space-y-4">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="w-9 h-9 rounded-2xl bg-orange-50 border border-orange-200/80 text-[#C86D3B] flex items-center justify-center font-bold text-base shadow-2xs">
              🏢
            </span>
            <div>
              <h3 class="font-extrabold text-base sm:text-lg text-[#2A1F1D] tracking-tight">Add New Branch</h3>
              <p class="text-[11px] text-stone-500">Add a store location with 100-sweet inventory &amp; cloud sync</p>
            </div>
          </div>
          <button 
            type="button"
            id="close-add-branch-modal-btn" 
            class="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center font-bold text-sm cursor-pointer transition-all active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <!-- Add Branch Form -->
        <form id="add-branch-form" class="space-y-4">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Branch Name -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Branch Store Name <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="branchName" 
                required 
                placeholder="e.g. Vastrapur Grand Boutique"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- Branch Code -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Store Code <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="branchCode" 
                required 
                value="${suggestedCode}"
                placeholder="e.g. BR-VAS-04"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-mono font-bold outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- City / Region -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                City / Locality <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="branchCity" 
                required 
                value="Ahmedabad"
                placeholder="e.g. Ahmedabad"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- Full Address -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Full Physical Address
              </label>
              <textarea 
                name="branchAddress" 
                rows="2"
                placeholder="e.g. Shop No. 5-7, Ground Floor, Shivalik Plaza, IIM Road, Ahmedabad"
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs resize-none"
              ></textarea>
            </div>

            <!-- Store Phone -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Contact Phone / WhatsApp
              </label>
              <input 
                type="tel" 
                name="branchPhone" 
                placeholder="e.g. +91 98250 12345"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- Branch Manager -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Store Manager Incharge
              </label>
              <input 
                type="text" 
                name="branchManager" 
                placeholder="e.g. Bhavesh Mehta"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- Daily Target -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Target Daily Revenue (₹)
              </label>
              <input 
                type="number" 
                name="branchTargetRevenue" 
                value="45000"
                min="0"
                step="1000"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- Target Margin -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Target Gross Margin (%)
              </label>
              <input 
                type="text" 
                name="branchMargin" 
                value="34.0%"
                placeholder="e.g. 34.0%"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>
          </div>

          <div class="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
            <span>✨</span>
            <p class="leading-tight">All 100 sweets with fresh stock will automatically initialize for this new branch in Cloud Firestore.</p>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
            <button 
              type="button" 
              id="cancel-add-branch-modal-btn"
              class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              id="submit-add-branch-btn"
              class="px-5 py-2.5 bg-gradient-to-r from-[#B25D2E] to-[#C86D3B] hover:brightness-105 active:scale-95 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <span>☁️ Create Branch &amp; Sync Cloud</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}

export function renderEditBranchModal(state: any) {
  const branch = state.editingBranch;
  if (!branch) return '';

  return `
    <div id="edit-branch-modal-backdrop" class="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div class="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-stone-200 animate-slide-up max-h-[92vh] overflow-y-auto space-y-4">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <div class="flex items-center gap-2.5">
            <span class="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-base shadow-2xs">
              ✏️
            </span>
            <div>
              <h3 class="font-extrabold text-base sm:text-lg text-[#2A1F1D] tracking-tight">Edit Branch Details</h3>
              <p class="text-[11px] text-stone-500">Updating ${branch.name} (${branch.code})</p>
            </div>
          </div>
          <button 
            type="button"
            id="close-edit-branch-modal-btn" 
            class="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center font-bold text-sm cursor-pointer transition-all active:scale-95"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <!-- Edit Branch Form -->
        <form id="edit-branch-form" class="space-y-4">
          <input type="hidden" name="branchId" value="${branch.id}" />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Branch Name -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Branch Store Name <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="branchName" 
                required 
                value="${branch.name || ''}"
                placeholder="e.g. Navrangpura Flagship"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-bold outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- Branch Code -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Store Code <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="branchCode" 
                required 
                value="${branch.code || ''}"
                placeholder="e.g. BR-NAV-01"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-mono font-bold outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- City / Region -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                City / Locality <span class="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="branchCity" 
                required 
                value="${branch.city || 'Ahmedabad'}"
                placeholder="e.g. Ahmedabad"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- Full Address -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Full Physical Address
              </label>
              <textarea 
                name="branchAddress" 
                rows="2"
                placeholder="e.g. Shop No. 12-14, Shivalik Plaza, IIM Road, Ahmedabad"
                class="w-full px-3.5 py-2 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs resize-none"
              >${branch.address || ''}</textarea>
            </div>

            <!-- Store Phone -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Contact Phone / WhatsApp
              </label>
              <input 
                type="tel" 
                name="branchPhone" 
                value="${branch.phone || ''}"
                placeholder="e.g. +91 98250 12345"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- Branch Manager -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Store Manager Incharge
              </label>
              <input 
                type="text" 
                name="branchManager" 
                value="${branch.manager || ''}"
                placeholder="e.g. Ramesh Patel"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- Daily Target -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Target Daily Revenue (₹)
              </label>
              <input 
                type="number" 
                name="branchTargetRevenue" 
                value="${branch.targetDailyRevenue || 50000}"
                min="0"
                step="1000"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>

            <!-- Target Margin -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                Target Gross Margin (%)
              </label>
              <input 
                type="text" 
                name="branchMargin" 
                value="${branch.margin || '34.0%'}"
                placeholder="e.g. 34.0%"
                class="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 focus:border-[#C86D3B] rounded-xl text-xs sm:text-sm text-[#2A1F1D] font-medium outline-none focus:ring-2 focus:ring-[#C86D3B]/20 transition-all shadow-2xs"
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
            <button 
              type="button" 
              id="cancel-edit-branch-modal-btn"
              class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              id="submit-edit-branch-btn"
              class="px-5 py-2.5 bg-gradient-to-r from-[#B25D2E] to-[#C86D3B] hover:brightness-105 active:scale-95 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <span>☁️ Save Changes in Cloud</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
