// Profile, Settings, Branch Configuration & UPI Payment Hub Component
// Tailored for Radhe Sweets Ahmedabad with full mobile and desktop responsiveness

export function renderSettingsView(state: any) {
  const { 
    shopInfo = {}, 
    userRole = 'SUPER_ADMIN', 
    auditLogs = [], 
    branches = [], 
    currentBranchId = 'br-1' 
  } = state;

  const currentUpiId = shopInfo.upiId || 'radhesweets@oksbi';
  const currentUpiName = shopInfo.upiName || shopInfo.name || 'Radhe Sweets';
  const testQrData = `upi://pay?pa=${encodeURIComponent(currentUpiId)}&pn=${encodeURIComponent(currentUpiName)}&am=100&cu=INR`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(testQrData)}`;

  return `
    <div class="space-y-6 max-w-4xl mx-auto pb-12" data-purpose="settings-view">
      
      <!-- 1. Header -->
      <section class="space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-2xl sm:text-3xl font-black text-[var(--text-main)] tracking-tight">Settings &amp; Store Profile</h2>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
            Admin Console
          </span>
        </div>
        <p class="text-xs sm:text-sm text-[var(--text-muted)]">
          Configure shop details, custom UPI ID, dynamic counter QR code, branch locations, and system preferences.
        </p>
      </section>

      <!-- 2. Active Branch Location Selector -->
      <section class="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-3xl border border-[var(--border-color)] shadow-subtle space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-[var(--text-main)] flex items-center gap-2">
              <span>🏢</span>
              <span>Active Branch Location</span>
            </h3>
            <p class="text-xs text-[var(--text-light)]">Switch between Ahmedabad confectionery branches. Real-time sales and inventory will reflect this branch.</p>
          </div>
          <span class="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 self-start sm:self-auto">
            Multi-Branch Mode
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          ${branches.map((b: any) => `
            <div 
              data-setting-select-branch="${b.id}"
              class="p-4 rounded-2xl border cursor-pointer transition-all ${
                b.id === currentBranchId 
                  ? 'border-[var(--brand-primary)] bg-[var(--bg-highlight)] ring-2 ring-[var(--brand-primary)]/20 shadow-xs' 
                  : 'border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[var(--brand-primary)]'
              }"
            >
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono font-bold text-[var(--brand-primary)] bg-white px-2 py-0.5 rounded border border-[var(--border-color)]">${b.code}</span>
                ${b.id === currentBranchId 
                  ? '<span class="text-xs text-emerald-600 font-extrabold">Active ✓</span>' 
                  : '<span class="text-xs text-[var(--brand-primary)] font-bold">Switch →</span>'}
              </div>
              <h4 class="font-extrabold text-sm text-[var(--text-main)] mt-2">${b.name}</h4>
              <p class="text-xs text-[var(--text-muted)]">${b.city || 'Ahmedabad'}</p>
              <p class="text-[11px] text-[var(--text-light)] mt-2 font-medium">Revenue: ₹${(b.revenue || 0).toLocaleString()} • Margin: ${b.margin || '34%'}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- 3. Store Profile & UPI Configuration Form (Set Anything!) -->
      <section class="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-3xl border border-[var(--border-color)] shadow-subtle space-y-6">
        <div class="border-b border-[var(--border-color)] pb-3">
          <h3 class="text-base sm:text-lg font-black text-[var(--text-main)] flex items-center gap-2">
            <span>📱</span>
            <span>Store Profile &amp; Custom UPI Payment Settings</span>
          </h3>
          <p class="text-xs text-[var(--text-light)] mt-0.5">
            Set your shop's official UPI ID, merchant name, contact details, GST, and delivery terms. Changes instantly update the POS checkout QR code, storefront bag, and receipts.
          </p>
        </div>

        <form id="store-profile-form" class="space-y-5">
          
          <!-- UPI Configuration Box with Live QR Preview -->
          <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-purple-50/40 border border-amber-200/90 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-[#C86D3B] text-white flex items-center justify-center font-black text-sm shadow-xs">
                  ₹
                </span>
                <div>
                  <h4 class="font-extrabold text-sm text-stone-900">Custom Counter UPI / QR Setup</h4>
                  <p class="text-xs text-stone-600">All customer payments via GPay, PhonePe, Paytm or BHIM will route to this UPI ID</p>
                </div>
              </div>
              <span class="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Live &amp; Active
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div class="md:col-span-2 space-y-3 text-xs">
                <div>
                  <label class="block font-bold text-stone-800 mb-1">
                    Store UPI ID / VPA <span class="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="upiId" 
                    id="setting-upi-id-input"
                    value="${currentUpiId}" 
                    placeholder="e.g. radhesweets@okhdfcbank or 9876543210@paytm" 
                    class="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl font-mono text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#C86D3B]/40 focus:border-[#C86D3B] shadow-2xs" 
                    required
                  />
                  <p class="text-[11px] text-stone-500 mt-1">
                    💡 You can enter any UPI ID here (e.g. HDFC, ICICI, SBI, Paytm, Google Pay, PhonePe).
                  </p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block font-bold text-stone-800 mb-1">UPI Payee / Merchant Display Name</label>
                    <input 
                      type="text" 
                      name="upiName" 
                      id="setting-upi-name-input"
                      value="${currentUpiName}" 
                      placeholder="e.g. Radhe Sweets Ahmedabad" 
                      class="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:border-[#C86D3B]" 
                    />
                  </div>
                  <div>
                    <label class="block font-bold text-stone-800 mb-1">Currency Symbol</label>
                    <input 
                      type="text" 
                      name="currency" 
                      value="${shopInfo.currency || '₹'}" 
                      class="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:border-[#C86D3B]" 
                    />
                  </div>
                </div>
              </div>

              <!-- Live QR Preview Card -->
              <div class="bg-white p-3.5 rounded-2xl border border-amber-200 text-center space-y-2 shadow-xs">
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 block">Current Counter QR Preview</span>
                <div class="w-28 h-28 mx-auto p-1.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-center">
                  <img 
                    src="${qrApiUrl}" 
                    alt="Current UPI QR Code" 
                    class="w-full h-full object-contain"
                    onerror="this.src='/favicon.svg'"
                  />
                </div>
                <div class="text-[11px] font-mono font-bold text-stone-700 truncate" title="${currentUpiId}">
                  ${currentUpiId}
                </div>
                <span class="inline-block text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  ✓ Valid UPI Format
                </span>
              </div>
            </div>
          </div>

          <!-- Basic Shop Information -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-bold text-[var(--text-muted)] mb-1">Shop Name</label>
              <input 
                type="text" 
                name="name" 
                value="${shopInfo.name || 'Radhe Sweets'}" 
                class="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl font-extrabold text-sm text-[var(--text-main)] focus:outline-none focus:border-[#C86D3B]" 
                required
              />
            </div>

            <div>
              <label class="block font-bold text-[var(--text-muted)] mb-1">Brand Tagline / Subtitle</label>
              <input 
                type="text" 
                name="subName" 
                value="${shopInfo.subName || 'SWEETS & MORE'}" 
                class="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl font-bold text-xs text-[var(--text-main)] focus:outline-none focus:border-[#C86D3B]" 
              />
            </div>
          </div>

          <!-- Slogan & Devotional Motto -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-bold text-[var(--text-muted)] mb-1">Devotional Motto (Thermal Receipt Header/Footer)</label>
              <input 
                type="text" 
                name="motto" 
                value="${shopInfo.motto || 'Sweet Moments With Radhe Krishna'}" 
                class="w-full px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-main)] focus:outline-none focus:border-[#C86D3B]" 
              />
            </div>

            <div>
              <label class="block font-bold text-[var(--text-muted)] mb-1">Owner / Primary Contact Person</label>
              <input 
                type="text" 
                name="owner" 
                value="${shopInfo.owner || 'Anand Shah'}" 
                class="w-full px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-main)] focus:outline-none focus:border-[#C86D3B]" 
              />
            </div>
          </div>

          <!-- Address -->
          <div class="text-xs">
            <label class="block font-bold text-[var(--text-muted)] mb-1">Store Address (Appears on Bills &amp; Storefront)</label>
            <input 
              type="text" 
              name="address" 
              value="${shopInfo.address || 'Shop No. 12-14, Shivalik Plaza, IIM Road, Ahmedabad, Gujarat 380015'}" 
              class="w-full px-3.5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[#C86D3B]" 
            />
          </div>

          <!-- Phone, Email, GSTIN, FSSAI -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label class="block font-bold text-[var(--text-muted)] mb-1">Phone / WhatsApp Orders</label>
              <input 
                type="text" 
                name="phone" 
                value="${shopInfo.phone || '+91 98765 43210'}" 
                class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[#C86D3B]" 
              />
            </div>
            <div>
              <label class="block font-bold text-[var(--text-muted)] mb-1">Store Email</label>
              <input 
                type="email" 
                name="email" 
                value="${shopInfo.email || 'contact@radhesweets.com'}" 
                class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-main)] focus:outline-none focus:border-[#C86D3B]" 
              />
            </div>
            <div>
              <label class="block font-bold text-[var(--text-muted)] mb-1">GSTIN Number</label>
              <input 
                type="text" 
                name="gstin" 
                value="${shopInfo.gstin || '24AAACR1234F1Z8'}" 
                class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs font-mono font-bold text-[var(--text-main)] focus:outline-none focus:border-[#C86D3B]" 
              />
            </div>
            <div>
              <label class="block font-bold text-[var(--text-muted)] mb-1">FSSAI License No.</label>
              <input 
                type="text" 
                name="fssai" 
                value="${shopInfo.fssai || '10721026000452'}" 
                class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs font-mono font-bold text-[var(--text-main)] focus:outline-none focus:border-[#C86D3B]" 
              />
            </div>
          </div>

          <!-- Online Delivery Controls -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
            <div>
              <label class="block font-bold text-stone-700 mb-1">Free Delivery Minimum Order (₹)</label>
              <input 
                type="number" 
                name="freeDeliveryAbove" 
                value="${shopInfo.freeDeliveryAbove || 500}" 
                class="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-900 focus:outline-none focus:border-[#C86D3B]" 
              />
              <p class="text-[10px] text-stone-500 mt-1">Orders above this amount get free doorstep delivery in Ahmedabad</p>
            </div>
            <div>
              <label class="block font-bold text-stone-700 mb-1">Standard Delivery Fee (₹)</label>
              <input 
                type="number" 
                name="deliveryFee" 
                value="${shopInfo.deliveryFee || 40}" 
                class="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-900 focus:outline-none focus:border-[#C86D3B]" 
              />
              <p class="text-[10px] text-stone-500 mt-1">Fee applied when order is below free threshold</p>
            </div>
          </div>

          <!-- Save Button -->
          <div class="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-color)]">
            <button 
              type="submit" 
              class="px-6 py-3.5 bg-gradient-to-r from-[#C86D3B] to-[#A84C1C] hover:from-[#B55C2C] hover:to-[#933F14] text-white font-black text-sm rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>💾</span>
              <span>Save Settings &amp; Update UPI ID</span>
            </button>

            <button 
              id="reset-all-data-btn" 
              type="button" 
              class="px-4 py-2.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            >
              ⚠️ Reset Local Defaults
            </button>
          </div>
        </form>
      </section>

      <!-- 4. Security & Audit Trail Logs -->
      <section class="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-3xl border border-[var(--border-color)] shadow-subtle space-y-4">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-[var(--text-main)] flex items-center gap-2">
              <span>🛡️</span>
              <span>System Activity &amp; Audit Trail</span>
            </h3>
            <p class="text-xs text-[var(--text-light)]">Audit record of discounts, payments, bill parks, and catalog modifications</p>
          </div>
          <span class="text-[11px] font-mono text-[var(--text-light)]">Real-time log</span>
        </div>

        <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
          ${auditLogs.length === 0 ? `
            <p class="text-xs text-stone-400 py-4 text-center">No recent audit logs.</p>
          ` : auditLogs.slice(0, 8).map((log: any) => `
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

    </div>
  `;
}
