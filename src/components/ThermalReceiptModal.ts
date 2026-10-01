// Thermal Receipt Modal Component for Authentic POS Bill Printing

export function renderThermalReceiptModal(order, shopInfo) {
  if (!order) return '';

  return `
    <div class="modal-backdrop" id="thermal-receipt-modal">
      <div class="modal-content p-6 max-w-sm">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
          <span class="text-xs font-bold text-[var(--brand-primary)]">Thermal Receipt Preview</span>
          <button id="close-receipt-btn" class="text-[var(--text-light)] hover:text-[var(--text-main)] p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </button>
        </div>

        <!-- The Printable Thermal Area -->
        <div class="printable-area">
          <div class="thermal-receipt font-mono text-stone-900 border border-stone-200">
            <!-- Brand Header -->
            <div class="text-center space-y-0.5 pb-2">
              <h2 class="text-base font-black tracking-tight uppercase">${shopInfo.name}</h2>
              <p class="text-[10px] font-bold text-stone-600 tracking-wider">${shopInfo.subName}</p>
              <p class="text-[9px] text-stone-500">${shopInfo.address}</p>
              <p class="text-[9px] text-stone-500">Ph: ${shopInfo.phone}</p>
              <p class="text-[9px] text-stone-500">GSTIN: ${shopInfo.gstin} | FSSAI: ${shopInfo.fssai}</p>
            </div>

            <hr/>

            <!-- Bill Meta -->
            <div class="text-[10px] space-y-0.5">
              <div class="flex justify-between">
                <span>Invoice: #${order.id}</span>
                <span>Date: ${order.date.split(',')[0]}</span>
              </div>
              <div class="flex justify-between">
                <span>Time: ${order.date.split(',')[1] || '10:28 AM'}</span>
                <span>Cashier: Admin (C1)</span>
              </div>
              <div class="flex justify-between">
                <span>Customer: ${order.customerName}</span>
                <span>Mode: ${order.paymentMethod}</span>
              </div>
            </div>

            <hr/>

            <!-- Items Table -->
            <table class="w-full text-[10px] text-left">
              <thead>
                <tr class="border-b border-dashed border-stone-400">
                  <th class="py-1">ITEM</th>
                  <th class="py-1 text-center">QTY</th>
                  <th class="py-1 text-right">RATE</th>
                  <th class="py-1 text-right">TOTAL</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dashed divide-stone-200">
                ${(order.items || []).map(item => `
                  <tr>
                    <td class="py-1 pr-1 font-semibold">${item.name}</td>
                    <td class="py-1 text-center">${item.quantity || item.qty} ${item.unit || 'kg'}</td>
                    <td class="py-1 text-right">₹${item.rate}</td>
                    <td class="py-1 text-right font-bold">₹${item.total || ((item.quantity || item.qty) * item.rate)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <hr/>

            <!-- Financial Totals -->
            <div class="text-[11px] space-y-1">
              <div class="flex justify-between">
                <span>Subtotal:</span>
                <span>₹${order.subtotal || order.total}</span>
              </div>
              ${order.discount ? `
                <div class="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount:</span>
                  <span>- ₹${order.discount}</span>
                </div>
              ` : ''}
              <div class="flex justify-between text-[10px] text-stone-600">
                <span>CGST (2.5% HSN 2106):</span>
                <span>₹${Math.round(((order.total || 0) * 0.025) / 1.05)}</span>
              </div>
              <div class="flex justify-between text-[10px] text-stone-600">
                <span>SGST (2.5% HSN 2106):</span>
                <span>₹${Math.round(((order.total || 0) * 0.025) / 1.05)}</span>
              </div>
              <div class="flex justify-between text-sm font-black pt-1 border-t border-dashed border-stone-400">
                <span>NET PAYABLE:</span>
                <span>₹${order.total}</span>
              </div>

              ${order.cashTendered ? `
                <div class="pt-1 border-t border-dashed border-stone-300 text-[10px] space-y-0.5">
                  <div class="flex justify-between">
                    <span>Cash Tendered:</span>
                    <span class="font-bold">₹${order.cashTendered}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Change Returned:</span>
                    <span class="font-bold">₹${order.changeDue || 0}</span>
                  </div>
                </div>
              ` : ''}
            </div>

            <hr/>

            <!-- Devotional Footer Motto & Barcode -->
            <div class="text-center pt-1 space-y-1">
              <p class="text-[10px] font-bold">🙏 JAI RADHE KRISHNA 🙏</p>
              <p class="text-[9px] italic text-stone-600">"Sweet Moments With Radhe Krishna"</p>
              <p class="text-[9px] text-stone-500">Thank you! Please visit again!</p>
              <!-- Barcode Mock -->
              <div class="pt-2 flex justify-center">
                <svg class="w-40 h-8 text-stone-800" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <rect x="0" y="0" width="2" height="20" fill="currentColor"></rect>
                  <rect x="4" y="0" width="1" height="20" fill="currentColor"></rect>
                  <rect x="7" y="0" width="3" height="20" fill="currentColor"></rect>
                  <rect x="12" y="0" width="2" height="20" fill="currentColor"></rect>
                  <rect x="16" y="0" width="4" height="20" fill="currentColor"></rect>
                  <rect x="22" y="0" width="1" height="20" fill="currentColor"></rect>
                  <rect x="25" y="0" width="3" height="20" fill="currentColor"></rect>
                  <rect x="30" y="0" width="2" height="20" fill="currentColor"></rect>
                  <rect x="34" y="0" width="1" height="20" fill="currentColor"></rect>
                  <rect x="37" y="0" width="4" height="20" fill="currentColor"></rect>
                  <rect x="43" y="0" width="2" height="20" fill="currentColor"></rect>
                  <rect x="47" y="0" width="3" height="20" fill="currentColor"></rect>
                  <rect x="52" y="0" width="1" height="20" fill="currentColor"></rect>
                  <rect x="55" y="0" width="4" height="20" fill="currentColor"></rect>
                  <rect x="61" y="0" width="2" height="20" fill="currentColor"></rect>
                  <rect x="65" y="0" width="3" height="20" fill="currentColor"></rect>
                  <rect x="70" y="0" width="1" height="20" fill="currentColor"></rect>
                  <rect x="73" y="0" width="2" height="20" fill="currentColor"></rect>
                  <rect x="77" y="0" width="4" height="20" fill="currentColor"></rect>
                  <rect x="83" y="0" width="2" height="20" fill="currentColor"></rect>
                  <rect x="87" y="0" width="3" height="20" fill="currentColor"></rect>
                  <rect x="92" y="0" width="2" height="20" fill="currentColor"></rect>
                  <rect x="96" y="0" width="4" height="20" fill="currentColor"></rect>
                </svg>
              </div>
              <p class="text-[8px] text-stone-400">SA00129-25092026</p>
            </div>
          </div>
        </div>

        <!-- Print Action -->
        <div class="mt-4 flex gap-2">
          <button 
            id="trigger-print-btn"
            class="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>🖨️ Print Now</span>
          </button>
          <button 
            id="dismiss-receipt-btn"
            class="py-2.5 px-4 bg-[var(--bg-subtle)] text-[var(--text-muted)] font-semibold text-xs rounded-xl hover:bg-[var(--border-color)] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `;
}
