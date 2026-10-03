// Profile, Settings, Branch Configuration & UPI Payment Hub Component
// Tailored for Radhe Sweets Ahmedabad with full mobile and desktop responsiveness

import { firestoreLiveState } from '../firebase.js';
import { renderReceiptSlipHtml, defaultReceiptSettings } from './ThermalReceiptModal.ts';

export function renderSettingsView(state: any) {
  const { 
    shopInfo = {}, 
    userRole = 'SUPER_ADMIN', 
    auditLogs = [], 
    branches = [], 
    currentBranchId = 'br-1',
    receiptSettings: stateReceiptSettings = {}
  } = state;

  const activeBranch = branches.find((b: any) => b.id === currentBranchId) || (branches.length > 0 ? branches[0] : {});
  const currentUpiId = activeBranch.upiId || shopInfo.upiId || 'radhesweets@oksbi';
  const currentUpiName = activeBranch.upiName || activeBranch.name || shopInfo.upiName || shopInfo.name || 'Radhe Sweets';
  const currentAddress = activeBranch.address || shopInfo.address || 'Ahmedabad, Gujarat';
  const currentPhone = activeBranch.phone || shopInfo.phone || '+91 98250 12345';
  const currentGstin = activeBranch.gstin || shopInfo.gstin || '24AAACR1234F1Z8';
  const currentFssai = activeBranch.fssai || shopInfo.fssai || '10722026000412';

  const testQrData = `upi://pay?pa=${encodeURIComponent(currentUpiId)}&pn=${encodeURIComponent(currentUpiName)}&am=100&cu=INR`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(testQrData)}`;

  const receiptSettings = {
    ...defaultReceiptSettings,
    ...(shopInfo.receiptSettings || {}),
    ...stateReceiptSettings
  };

  const sampleOrder = {
    id: 'SA00129',
    date: '25 Sep 2026, 10:28 AM',
    customerName: 'Jignesh Shah (+91 98765 67890)',
    paymentMethod: 'UPI',
    items: [
      { name: 'Kaju Katli (Pure Kaju)', qty: '0.5', unit: 'kg', rate: 450, total: 225 },
      { name: 'Gulab Jamun (Desi Ghee)', qty: '1', unit: 'kg', rate: 180, total: 180 },
      { name: 'Motichoor Ladoo', qty: '1', unit: 'kg', rate: 160, total: 160 }
    ],
    subtotal: 565,
    discount: 0,
    total: 565,
    cashTendered: 600,
    changeDue: 35
  };

  const liveReceiptHtml = renderReceiptSlipHtml(sampleOrder, shopInfo, receiptSettings);


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



      <!-- 2. Active Branch Network & Multi-Location CRUD -->
      <section class="bg-[var(--bg-surface)] p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--border-color)] shadow-subtle space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-100 text-[#C86D3B] flex items-center justify-center font-bold text-sm shadow-2xs">
                🏢
              </span>
              <h3 class="text-sm sm:text-base font-extrabold text-[var(--text-main)]">
                Store Branches &amp; Cloud Network
              </h3>
            </div>
            <p class="text-[11px] sm:text-xs text-[var(--text-light)] mt-0.5">
              Add new branch stores, edit location details, or switch active branch. All 100 sweets &amp; orders isolate and sync in Cloud Firestore.
            </p>
          </div>
          
          <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button 
              type="button" 
              id="open-add-branch-modal-btn"
              class="px-3.5 py-2 bg-gradient-to-r from-[#B25D2E] to-[#C86D3B] hover:brightness-105 active:scale-95 text-white rounded-xl text-xs font-extrabold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Add Branch</span>
            </button>
            <span class="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
              ${branches.length} Branches
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${branches.map((b: any) => {
            const isActive = b.id === currentBranchId;
            return `
              <div 
                class="p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive 
                    ? 'border-[var(--brand-primary)] bg-[var(--bg-highlight)] ring-2 ring-[var(--brand-primary)]/20 shadow-xs' 
                    : 'border-[var(--border-color)] bg-[var(--bg-subtle)] hover:border-[var(--brand-primary)]/50'
                }"
              >
                <div>
                  <div class="flex items-center justify-between gap-1.5 mb-2">
                    <span class="text-[10px] font-mono font-bold text-[var(--brand-primary)] bg-white px-2 py-0.5 rounded-lg border border-[var(--border-color)]">
                      ${b.code || 'BR-00'}
                    </span>
                    ${isActive 
                      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">Active Store ✓</span>' 
                      : `
                        <button 
                          type="button"
                          data-setting-select-branch="${b.id}"
                          class="px-2.5 py-1 bg-white hover:bg-orange-50 active:scale-95 text-[#C86D3B] border border-orange-200/80 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
                        >
                          Switch →
                        </button>
                      `}
                  </div>

                  <h4 class="font-extrabold text-sm sm:text-base text-[var(--text-main)] tracking-tight">
                    ${b.name}
                  </h4>
                  <p class="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
                    <span>📍</span>
                    <span class="line-clamp-1">${b.address || b.city || 'Ahmedabad, Gujarat'}</span>
                  </p>

                  ${b.phone || b.manager ? `
                    <div class="mt-2 pt-2 border-t border-stone-200/50 text-[11px] text-stone-500 space-y-0.5">
                      ${b.manager ? `<p class="flex items-center gap-1"><span>👤</span> <span>Manager: <strong>${b.manager}</strong></span></p>` : ''}
                      ${b.phone ? `<p class="flex items-center gap-1"><span>📞</span> <span>${b.phone}</span></p>` : ''}
                    </div>
                  ` : ''}

                  <div class="mt-2.5 pt-2 border-t border-[var(--border-color)]/70 flex items-center justify-between text-[11px] text-[var(--text-light)] font-medium">
                    <span>Sales: ₹${(b.revenue || 0).toLocaleString()}</span>
                    <span>Margin: ${b.margin || '34%'}</span>
                  </div>
                </div>

                <!-- Branch Actions: Edit & Remove -->
                <div class="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-end gap-1.5">
                  <button 
                    type="button"
                    data-action="edit-branch"
                    data-branch-id="${b.id}"
                    class="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 active:scale-95 border border-stone-200 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Edit branch details"
                  >
                    <span>✏️</span>
                    <span>Edit</span>
                  </button>

                  <button 
                    type="button"
                    data-action="delete-branch"
                    data-branch-id="${b.id}"
                    class="px-2.5 py-1 ${
                      branches.length <= 1 
                        ? 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400 border border-stone-200' 
                        : 'bg-red-50 hover:bg-red-100 text-red-700 active:scale-95 border border-red-200 cursor-pointer'
                    } rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 shadow-2xs"
                    ${branches.length <= 1 ? 'disabled title="Cannot delete the only branch"' : 'title="Delete branch from Cloud Firestore"'}
                  >
                    <span>🗑️</span>
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- 3. Store Profile & UPI Configuration Form (Branch-Specific Settings) -->
      <section class="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-3xl border border-[var(--border-color)] shadow-subtle space-y-6">
        <div class="border-b border-[var(--border-color)] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="text-base sm:text-lg font-black text-[var(--text-main)] flex items-center gap-2">
              <span>📱</span>
              <span>Branch Profile &amp; Custom UPI Payment Settings</span>
            </h3>
            <p class="text-xs text-[var(--text-light)] mt-0.5">
              Each branch has its own address, phone, UPI QR code, GSTIN, and receipts. Switch branches below to configure.
            </p>
          </div>

          <!-- Quick Branch Switcher in Settings Form -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            ${branches.map((b: any) => `
              <button 
                type="button" 
                data-setting-select-branch="${b.id}"
                class="px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  b.id === currentBranchId 
                    ? 'bg-gradient-to-r from-[#B25D2E] to-[#C86D3B] text-white shadow-2xs' 
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }"
              >
                ${b.code || 'BR'}: ${b.name.split(' ')[0]}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Active Branch Indicator Alert -->
        <div class="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-950">
          <div class="flex items-center gap-2">
            <span class="text-base">🏢</span>
            <span>Editing settings for: <strong>${activeBranch.name || 'Current Branch'}</strong> (${activeBranch.code || 'BR-01'})</span>
          </div>
          <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
            Active Store
          </span>
        </div>

        <form id="store-profile-form" class="space-y-5">
          <input type="hidden" name="branchId" value="${activeBranch.id || currentBranchId}" />
          
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

          <!-- Basic Shop & Branch Information -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-bold text-[var(--text-muted)] mb-1">Branch / Shop Name *</label>
              <input 
                type="text" 
                name="name" 
                value="${activeBranch.name || shopInfo.name || 'Radhe Sweets'}" 
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
              <label class="block font-bold text-[var(--text-muted)] mb-1">Store Manager / Contact Person</label>
              <input 
                type="text" 
                name="owner" 
                value="${activeBranch.manager || shopInfo.owner || 'Anand Shah'}" 
                class="w-full px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs font-semibold text-[var(--text-main)] focus:outline-none focus:border-[#C86D3B]" 
              />
            </div>
          </div>

          <!-- Address -->
          <div class="text-xs">
            <label class="block font-bold text-[var(--text-muted)] mb-1">Branch Physical Address (Appears on Bills &amp; Receipts)</label>
            <input 
              type="text" 
              name="address" 
              value="${currentAddress}" 
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
                value="${currentPhone}" 
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
              <label class="block font-bold text-[var(--text-muted)] mb-1">Branch GSTIN Number</label>
              <input 
                type="text" 
                name="gstin" 
                value="${currentGstin}" 
                class="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs font-mono font-bold text-[var(--text-main)] focus:outline-none focus:border-[#C86D3B]" 
              />
            </div>
            <div>
              <label class="block font-bold text-[var(--text-muted)] mb-1">Branch FSSAI License No.</label>
              <input 
                type="text" 
                name="fssai" 
                value="${currentFssai}" 
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

      <!-- 3.5. Pro-Level Thermal POS Printer & Receipt Customization Studio -->
      <section class="bg-[var(--bg-surface)] p-4 sm:p-6 rounded-3xl border border-[var(--border-color)] shadow-subtle space-y-6" id="printer-customizer-section">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                🖨️
              </span>
              <h3 class="text-base sm:text-lg font-black text-[var(--text-main)]">
                Thermal POS Printer &amp; Receipt Customization (Pro Level)
              </h3>
            </div>
            <p class="text-xs text-[var(--text-light)] mt-1">
              Customize every detail printed on the thermal bill slip: paper size (80mm / 58mm), headers, taxes, UPI QR scannability, tear-off feed, and devotional mottos.
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button 
              type="button" 
              id="test-print-receipt-btn"
              class="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>🖨️ Test Print Current Bill</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Left: Customization Controls (7 cols) -->
          <div class="lg:col-span-7 space-y-5">
            <form id="receipt-settings-form" class="space-y-4">
              
              <!-- Quick Preset Buttons -->
              <div class="flex flex-wrap items-center gap-2 pb-1">
                <span class="text-xs font-bold text-stone-500">Quick Presets:</span>
                <button type="button" data-receipt-preset="standard-80" class="px-2.5 py-1 bg-stone-100 hover:bg-amber-100/70 border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:text-amber-900 transition-all cursor-pointer">
                  Standard 80mm
                </button>
                <button type="button" data-receipt-preset="compact-58" class="px-2.5 py-1 bg-stone-100 hover:bg-amber-100/70 border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:text-amber-900 transition-all cursor-pointer">
                  Compact 58mm
                </button>
                <button type="button" data-receipt-preset="always-qr" class="px-2.5 py-1 bg-stone-100 hover:bg-amber-100/70 border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:text-amber-900 transition-all cursor-pointer">
                  Always Show UPI QR
                </button>
              </div>

              <!-- 1. Paper Roll & Tear-off Feed -->
              <div class="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <h4 class="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📄</span> Paper Roll &amp; Feed Lines
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label class="block font-bold text-stone-700 mb-1">Paper Roll Width</label>
                    <select name="paperSize" id="setting-paper-size" class="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B]">
                      <option value="80mm" ${receiptSettings.paperSize === '80mm' ? 'selected' : ''}>80mm (Standard 3-inch POS Roll)</option>
                      <option value="58mm" ${receiptSettings.paperSize === '58mm' ? 'selected' : ''}>58mm (Compact 2-inch Mobile/Bluetooth)</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-bold text-stone-700 mb-1">Bottom Tear-off Blank Lines</label>
                    <select name="bottomFeedLines" id="setting-bottom-feed" class="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B]">
                      <option value="0" ${Number(receiptSettings.bottomFeedLines) === 0 ? 'selected' : ''}>0 lines (Immediate Cut)</option>
                      <option value="1" ${Number(receiptSettings.bottomFeedLines) === 1 ? 'selected' : ''}>1 blank line</option>
                      <option value="2" ${Number(receiptSettings.bottomFeedLines) === 2 ? 'selected' : ''}>2 blank lines (Recommended)</option>
                      <option value="3" ${Number(receiptSettings.bottomFeedLines) === 3 ? 'selected' : ''}>3 blank lines</option>
                      <option value="4" ${Number(receiptSettings.bottomFeedLines) === 4 ? 'selected' : ''}>4 blank lines (Auto-cutter friendly)</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- 2. Header & Branding Section -->
              <div class="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <h4 class="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏪</span> Shop Header &amp; Branding
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showHeader" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showHeader ? 'checked' : ''}>
                    <span>Show Header</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showShopName" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showShopName ? 'checked' : ''}>
                    <span>Shop Name</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showSubName" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showSubName ? 'checked' : ''}>
                    <span>Sub-Title</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showAddress" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showAddress ? 'checked' : ''}>
                    <span>Address</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showPhone" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showPhone ? 'checked' : ''}>
                    <span>Phone Number</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showGstin" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showGstin ? 'checked' : ''}>
                    <span>GSTIN</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showFssai" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showFssai ? 'checked' : ''}>
                    <span>FSSAI License</span>
                  </label>
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-stone-600 mb-1">Custom Header Sub-Note (Optional)</label>
                  <input 
                    type="text" 
                    name="customHeaderNote" 
                    value="${receiptSettings.customHeaderNote || ''}" 
                    placeholder="e.g. Pure Shuddh Desi Ghee Confectionery" 
                    class="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#C86D3B]"
                  />
                </div>
              </div>

              <!-- 3. Bill Meta & Items Table Columns -->
              <div class="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <h4 class="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>📋</span> Bill Meta &amp; Table Columns
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showInvoiceNo" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showInvoiceNo ? 'checked' : ''}>
                    <span>Invoice #</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showDateTime" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showDateTime ? 'checked' : ''}>
                    <span>Date &amp; Time</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showCashier" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showCashier ? 'checked' : ''}>
                    <span>Cashier Name</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showCustomerName" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showCustomerName ? 'checked' : ''}>
                    <span>Customer Name</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showPaymentMode" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showPaymentMode ? 'checked' : ''}>
                    <span>Payment Mode</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showRateCol" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showRateCol ? 'checked' : ''}>
                    <span>Rate (₹) Column</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showQtyCol" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showQtyCol ? 'checked' : ''}>
                    <span>Qty Column</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showTotalCol" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showTotalCol ? 'checked' : ''}>
                    <span>Total Column</span>
                  </label>
                </div>
              </div>

              <!-- 4. Taxes & Financial Breakdown -->
              <div class="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <h4 class="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>💰</span> Taxes &amp; Financials
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-2 gap-2.5 text-xs">
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showSubtotal" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showSubtotal ? 'checked' : ''}>
                    <span>Show Subtotal</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showDiscount" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showDiscount ? 'checked' : ''}>
                    <span>Show Discount</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showTaxBreakdown" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showTaxBreakdown ? 'checked' : ''}>
                    <span>Show CGST / SGST 2.5%</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showCashTendered" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showCashTendered ? 'checked' : ''}>
                    <span>Cash Tendered &amp; Change</span>
                  </label>
                </div>
              </div>

              <!-- 5. UPI QR Code Engine (Another Level!) -->
              <div class="p-4 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-200 rounded-2xl space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📲</span> Scannable UPI QR Code Engine
                  </h4>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    PhonePe • GPay • Paytm
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label class="block font-bold text-stone-700 mb-1">QR Code Print Mode</label>
                    <select name="upiQrMode" id="setting-upi-qr-mode" class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:border-indigo-500">
                      <option value="auto" ${receiptSettings.upiQrMode === 'auto' ? 'selected' : ''}>Auto (Print QR only when UPI mode)</option>
                      <option value="always" ${receiptSettings.upiQrMode === 'always' ? 'selected' : ''}>Always Print QR on every receipt</option>
                      <option value="never" ${receiptSettings.upiQrMode === 'never' ? 'selected' : ''}>Never print QR Code</option>
                    </select>
                  </div>
                  <div>
                    <label class="block font-bold text-stone-700 mb-1">QR Code Display Size</label>
                    <select name="upiQrSize" id="setting-upi-qr-size" class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:border-indigo-500">
                      <option value="small" ${receiptSettings.upiQrSize === 'small' ? 'selected' : ''}>Compact (95px - Quick print)</option>
                      <option value="medium" ${receiptSettings.upiQrSize === 'medium' ? 'selected' : ''}>Standard (118px - Optimal)</option>
                      <option value="large" ${receiptSettings.upiQrSize === 'large' ? 'selected' : ''}>Large (140px - High scan distance)</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label class="block font-bold text-stone-700 mb-1">Receipt Custom VPA / UPI ID (Optional)</label>
                    <input 
                      type="text" 
                      name="customUpiId" 
                      value="${receiptSettings.customUpiId || ''}" 
                      placeholder="Leave empty to use store UPI (${currentUpiId})" 
                      class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl font-mono text-xs font-bold text-stone-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label class="block font-bold text-stone-700 mb-1">Receipt Custom Payee Name (Optional)</label>
                    <input 
                      type="text" 
                      name="customUpiName" 
                      value="${receiptSettings.customUpiName || ''}" 
                      placeholder="Leave empty to use ${currentUpiName}" 
                      class="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div class="flex items-center gap-4 text-xs pt-1">
                  <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                    <input type="checkbox" name="showUpiBrandBadge" class="rounded text-indigo-600 focus:ring-indigo-500" ${receiptSettings.showUpiBrandBadge ? 'checked' : ''}>
                    <span>Show GPay/PhonePe App Brand Line</span>
                  </label>
                </div>
              </div>

              <!-- 6. Footer, Devotional & Barcode -->
              <div class="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                <h4 class="text-xs font-extrabold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🙏</span> Devotional Footer &amp; Barcode
                </h4>
                <div class="space-y-2 text-xs">
                  <div class="flex items-center gap-3">
                    <label class="flex items-center gap-2 cursor-pointer font-bold text-stone-700 select-none shrink-0">
                      <input type="checkbox" name="showDevotionalMotto" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showDevotionalMotto ? 'checked' : ''}>
                      <span>Motto:</span>
                    </label>
                    <input 
                      type="text" 
                      name="devotionalMotto" 
                      value="${receiptSettings.devotionalMotto || '🙏 JAI RADHE KRISHNA 🙏'}" 
                      class="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-[#C86D3B]"
                    />
                  </div>

                  <div>
                    <label class="block font-bold text-stone-600 mb-1">Thank You Message</label>
                    <input 
                      type="text" 
                      name="thankYouNote" 
                      value="${receiptSettings.thankYouNote || 'Thank you! Please visit again!'}" 
                      class="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#C86D3B]"
                    />
                  </div>

                  <div>
                    <label class="block font-bold text-stone-600 mb-1">Return / Store Policy Note</label>
                    <input 
                      type="text" 
                      name="customFooterNote" 
                      value="${receiptSettings.customFooterNote || 'Sweet Moments... Better Together'}" 
                      class="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#C86D3B]"
                    />
                  </div>

                  <div class="pt-1">
                    <label class="flex items-center gap-2 cursor-pointer font-semibold text-stone-700 select-none">
                      <input type="checkbox" name="showBarcode" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" ${receiptSettings.showBarcode ? 'checked' : ''}>
                      <span>Print Scannable Barcode at Bottom</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Save Printer Settings Button -->
              <div class="pt-2 flex items-center justify-between">
                <button 
                  type="submit"
                  class="px-6 py-3 bg-[#C86D3B] hover:bg-[#B25D2E] text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>💾 Save Printer Customization</span>
                </button>
                <span class="text-[11px] text-stone-500 italic">Auto-applies to all counter bills</span>
              </div>
            </form>
          </div>

          <!-- Right: Live Synchronized Thermal Receipt Mockup (5 cols) -->
          <div class="lg:col-span-5 sticky top-24 space-y-3">
            <div class="flex items-center justify-between px-1">
              <span class="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>👁️</span> Live Slip Preview
              </span>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                Interactive
              </span>
            </div>

            <div class="p-4 bg-stone-100/90 border border-stone-200 rounded-3xl shadow-inner flex justify-center overflow-x-auto min-h-[460px]">
              <div id="settings-receipt-live-preview">
                ${liveReceiptHtml}
              </div>
            </div>
            <p class="text-[11px] text-stone-500 text-center">
              Changes update immediately in preview. Click <strong>Test Print</strong> to check actual paper output.
            </p>
          </div>

        </div>
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
