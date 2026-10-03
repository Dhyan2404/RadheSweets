// Thermal Receipt Modal & Live Preview Component for Authentic POS Bill Printing with Dynamic UPI QR
import QRCode from 'qrcode';

export function generateUpiQrSvg(upiString: string, size = 114): string {
  try {
    const qrLib: any = (QRCode as any)?.default || QRCode;
    if (qrLib && typeof qrLib.create === 'function') {
      const qrData = qrLib.create(upiString, { errorCorrectionLevel: 'M' });
      const modCount = qrData.modules.size;
      const margin = 2;
      const totalCount = modCount + margin * 2;
      const scale = size / totalCount;

      let path = '';
      for (let r = 0; r < modCount; r++) {
        let runStart = -1;
        for (let c = 0; c < modCount; c++) {
          const isDark = qrData.modules.get(r, c);
          if (isDark) {
            if (runStart === -1) runStart = c;
          } else {
            if (runStart !== -1) {
              const w = c - runStart;
              path += `M${((runStart + margin) * scale).toFixed(1)},${((r + margin) * scale).toFixed(1)}h${(w * scale).toFixed(1)}v${scale.toFixed(1)}h-${(w * scale).toFixed(1)}z `;
              runStart = -1;
            }
          }
        }
        if (runStart !== -1) {
          const w = modCount - runStart;
          path += `M${((runStart + margin) * scale).toFixed(1)},${((r + margin) * scale).toFixed(1)}h${(w * scale).toFixed(1)}v${scale.toFixed(1)}h-${(w * scale).toFixed(1)}z `;
        }
      }

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="mx-auto block" shape-rendering="crispEdges">
        <rect width="100%" height="100%" fill="#ffffff"/>
        <path d="${path.trim()}" fill="#000000"/>
      </svg>`;
    }
  } catch (err) {
    console.error('Error generating offline QR code:', err);
  }

  // Robust fallback: instant scannable QR image via reliable public API
  const encoded = encodeURIComponent(upiString);
  return `<img src="https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&margin=2&format=svg" alt="UPI QR Code" width="${size}" height="${size}" class="mx-auto block bg-white" loading="eager" />`;
}

export const defaultReceiptSettings = {
  paperSize: '80mm', // '80mm' | '58mm'
  bottomFeedLines: 2,
  
  // Header
  showHeader: true,
  showShopName: true,
  showSubName: true,
  showAddress: true,
  showPhone: true,
  showGstin: true,
  showFssai: true,
  customHeaderNote: '',
  
  // Bill Meta
  showInvoiceNo: true,
  showDateTime: true,
  showCashier: true,
  showCustomerName: true,
  showPaymentMode: true,
  
  // Items Table
  showRateCol: true,
  showQtyCol: true,
  showTotalCol: true,
  
  // Totals & Taxes
  showSubtotal: true,
  showTaxBreakdown: true,
  showDiscount: true,
  showCashTendered: true,
  
  // UPI QR Code
  upiQrMode: 'auto', // 'auto' | 'always' | 'never'
  upiQrSize: 'medium', // 'small' | 'medium' | 'large'
  customUpiId: '',
  customUpiName: '',
  showUpiBrandBadge: true,
  customUpiNote: '',
  
  // Footer & Devotional
  showDevotionalMotto: true,
  devotionalMotto: '🙏 JAI RADHE KRISHNA 🙏',
  thankYouNote: 'Thank you! Please visit again!',
  showBarcode: true,
  customFooterNote: 'Sweet Moments... Better Together'
};

/**
 * Pure HTML generator for the thermal receipt slip.
 * Used both by the print modal and the Settings live preview!
 */
export function renderReceiptSlipHtml(order: any, shopInfo: any, settingsInput?: any) {
  if (!order) return '';

  const cfg = { ...defaultReceiptSettings, ...(shopInfo?.receiptSettings || {}), ...(settingsInput || {}) };
  const safeShopInfo = shopInfo || {};

  const shopName = order.branchName || safeShopInfo.name || 'Radhe Sweets';
  const subName = order.branchReceiptHeader || safeShopInfo.subName || 'SWEETS & MORE';
  const address = order.branchAddress || safeShopInfo.address || 'Opposite Iscon Mall, S.G. Highway, Satellite, Ahmedabad, Gujarat 380015';
  const phone = order.branchPhone || safeShopInfo.phone || '+91 98765 43210';
  const gstin = order.branchGstin || safeShopInfo.gstin || '24AAACR1234F1Z8';
  const fssai = order.branchFssai || safeShopInfo.fssai || '10722026000412';

  const storeUpiId = cfg.customUpiId || order.branchUpiId || safeShopInfo.upiId || 'radhesweets@oksbi';
  const storeUpiName = cfg.customUpiName || order.branchUpiName || safeShopInfo.upiName || shopName;

  // Determine if UPI QR code should be rendered
  const paymentMethod = String(order.paymentMethod || '').trim();
  const isUpiMethod = paymentMethod.toUpperCase().includes('UPI');

  let showQr = false;
  if (cfg.upiQrMode === 'always') {
    showQr = true;
  } else if (cfg.upiQrMode === 'never') {
    showQr = false;
  } else {
    showQr = isUpiMethod;
  }
  // Manual override from cashier button
  if (order.showUpiQr !== undefined) {
    showQr = !!order.showUpiQr;
  }

  // QR Size calculation
  const paperSize = order.branchPaperSize || cfg.paperSize || '80mm';
  const is58mm = paperSize === '58mm';

  let qrPixelSize = 116;
  if (is58mm) {
    qrPixelSize = 92;
  } else if (cfg.upiQrSize === 'small') {
    qrPixelSize = 95;
  } else if (cfg.upiQrSize === 'large') {
    qrPixelSize = 140;
  }

  // Build compliant UPI URI
  const billAmount = Number(order.total || 0).toFixed(2);
  const upiUri = `upi://pay?pa=${storeUpiId}&pn=${encodeURIComponent(storeUpiName)}&am=${billAmount}&cu=INR&tn=${encodeURIComponent('Bill ' + (order.id || 'BILL'))}`;
  const qrSvgHtml = showQr ? generateUpiQrSvg(upiUri, qrPixelSize) : '';

  const dateStr = order.date ? (order.date.includes(',') ? order.date.split(',')[0] : order.date) : new Date().toLocaleDateString('en-IN');
  const timeStr = order.date && order.date.includes(',') ? order.date.split(',')[1].trim() : new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const widthClass = is58mm ? 'size-58mm max-w-[240px] text-[10px]' : 'size-80mm max-w-[320px] text-[11px]';

  return `
    <div class="thermal-receipt font-mono text-stone-900 border border-stone-200 ${widthClass}">
      <!-- Brand Header -->
      ${cfg.showHeader ? `
        <div class="text-center space-y-0.5 pb-2">
          ${cfg.showShopName ? `<h2 class="text-base font-black tracking-tight uppercase">${shopName}</h2>` : ''}
          ${cfg.showSubName ? `<p class="text-[10px] font-bold text-stone-600 tracking-wider">${subName}</p>` : ''}
          ${cfg.customHeaderNote ? `<p class="text-[9px] font-semibold text-stone-700 italic">${cfg.customHeaderNote}</p>` : ''}
          ${cfg.showAddress ? `<p class="text-[9px] text-stone-500">${address}</p>` : ''}
          ${cfg.showPhone ? `<p class="text-[9px] text-stone-500">Ph: ${phone}</p>` : ''}
          ${(cfg.showGstin || cfg.showFssai) ? `
            <p class="text-[9px] text-stone-500">
              ${cfg.showGstin ? `GSTIN: ${gstin}` : ''}
              ${(cfg.showGstin && cfg.showFssai) ? ' | ' : ''}
              ${cfg.showFssai ? `FSSAI: ${fssai}` : ''}
            </p>
          ` : ''}
        </div>
        <hr/>
      ` : ''}

      <!-- Bill Meta -->
      <div class="text-[10px] space-y-0.5">
        ${(cfg.showInvoiceNo || cfg.showDateTime) ? `
          <div class="flex justify-between">
            ${cfg.showInvoiceNo ? `<span>Invoice: #${order.id}</span>` : '<span></span>'}
            ${cfg.showDateTime ? `<span>Date: ${dateStr}</span>` : ''}
          </div>
        ` : ''}
        ${(cfg.showDateTime || cfg.showCashier) ? `
          <div class="flex justify-between">
            ${cfg.showDateTime ? `<span>Time: ${timeStr}</span>` : '<span></span>'}
            ${cfg.showCashier ? `<span>Cashier: Admin (C1)</span>` : ''}
          </div>
        ` : ''}
        ${(cfg.showCustomerName || cfg.showPaymentMode) ? `
          <div class="flex justify-between">
            ${cfg.showCustomerName ? `<span>Customer: ${order.customerName || 'Walk-in Counter'}${order.customerId ? ` (#${order.customerId.toUpperCase()})` : ''}</span>` : '<span></span>'}
            ${cfg.showPaymentMode ? `<span>Mode: ${order.paymentMethod || 'Cash'}</span>` : ''}
          </div>
        ` : ''}
      </div>

      <hr/>

      <!-- Items Table -->
      <table class="w-full text-[10px] text-left">
        <thead>
          <tr class="border-b border-dashed border-stone-400 font-bold">
            <th class="py-1">ITEM</th>
            ${cfg.showQtyCol ? `<th class="py-1 text-center">QTY</th>` : ''}
            ${cfg.showRateCol ? `<th class="py-1 text-right">RATE</th>` : ''}
            ${cfg.showTotalCol ? `<th class="py-1 text-right">TOTAL</th>` : ''}
          </tr>
        </thead>
        <tbody class="divide-y divide-dashed divide-stone-200">
          ${(order.items || []).map((item: any) => `
            <tr>
              <td class="py-1 pr-1 font-semibold">${item.name}</td>
              ${cfg.showQtyCol ? `<td class="py-1 text-center">${item.quantity || item.qty} ${item.unit || 'kg'}</td>` : ''}
              ${cfg.showRateCol ? `<td class="py-1 text-right">₹${item.rate}</td>` : ''}
              ${cfg.showTotalCol ? `<td class="py-1 text-right font-bold">₹${item.total || ((item.quantity || item.qty) * item.rate)}</td>` : ''}
            </tr>
          `).join('')}
        </tbody>
      </table>

      <hr/>

      <!-- Financial Totals -->
      <div class="text-[11px] space-y-1">
        ${cfg.showSubtotal ? `
          <div class="flex justify-between">
            <span>Subtotal:</span>
            <span>₹${order.subtotal || order.total}</span>
          </div>
        ` : ''}
        ${(cfg.showDiscount && order.discount) ? `
          <div class="flex justify-between text-emerald-700 font-semibold">
            <span>Discount:</span>
            <span>- ₹${order.discount}</span>
          </div>
        ` : ''}
        ${cfg.showTaxBreakdown ? `
          <div class="flex justify-between text-[10px] text-stone-600">
            <span>CGST (2.5% HSN 2106):</span>
            <span>₹${Math.round(((order.total || 0) * 0.025) / 1.05)}</span>
          </div>
          <div class="flex justify-between text-[10px] text-stone-600">
            <span>SGST (2.5% HSN 2106):</span>
            <span>₹${Math.round(((order.total || 0) * 0.025) / 1.05)}</span>
          </div>
        ` : ''}
        <div class="flex justify-between text-sm font-black pt-1 border-t border-dashed border-stone-400">
          <span>NET PAYABLE:</span>
          <span>₹${order.total}</span>
        </div>

        ${(cfg.showCashTendered && order.cashTendered) ? `
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

      ${showQr ? `
        <hr/>
        <!-- UPI QR Code Scannable Block -->
        <div class="my-2 py-2 px-1 border border-dashed border-stone-800 rounded text-center bg-stone-50 print:bg-white print:border-black print:p-1">
          <div class="text-[10px] font-black tracking-wider text-stone-900 uppercase">
            📲 SCAN &amp; PAY VIA UPI
          </div>
          <div class="my-1.5 flex justify-center">
            <div class="p-1.5 bg-white border border-stone-300 rounded inline-block print:border-none print:p-0 shadow-2xs">
              ${qrSvgHtml}
            </div>
          </div>
          <div class="text-[9px] font-mono font-bold text-stone-900 tracking-tight">
            ${storeUpiId}
          </div>
          ${cfg.showUpiBrandBadge ? `
            <div class="text-[8px] text-stone-600 mt-0.5">
              PhonePe • Google Pay • Paytm • BHIM
            </div>
          ` : ''}
          ${cfg.customUpiNote ? `
            <div class="text-[8px] text-stone-600 italic mt-0.5">${cfg.customUpiNote}</div>
          ` : ''}
          <div class="text-[10px] font-black text-stone-900 mt-1 pt-1 border-t border-dotted border-stone-300">
            Amount to Pay: ₹${order.total}
          </div>
        </div>
      ` : ''}

      <hr/>

      <!-- Devotional Footer Motto & Barcode -->
      <div class="text-center pt-1 space-y-1">
        ${cfg.showDevotionalMotto ? `<p class="text-[10px] font-bold">${cfg.devotionalMotto || '🙏 JAI RADHE KRISHNA 🙏'}</p>` : ''}
        ${cfg.thankYouNote ? `<p class="text-[9px] italic text-stone-600">"${cfg.thankYouNote}"</p>` : ''}
        ${(order.branchReceiptFooter || cfg.customFooterNote) ? `<p class="text-[8px] text-stone-500">${order.branchReceiptFooter || cfg.customFooterNote}</p>` : ''}

        ${cfg.showBarcode ? `
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
        ` : ''}

        ${Number(cfg.bottomFeedLines) > 0 ? `
          <div style="height: ${Number(cfg.bottomFeedLines) * 12}px;" class="print:block"></div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * Renders the modal with preview backdrop, header, and action buttons.
 */
export function renderThermalReceiptModal(order: any, shopInfo: any, settingsInput?: any) {
  if (!order) return '';

  const cfg = { ...defaultReceiptSettings, ...(shopInfo?.receiptSettings || {}), ...(settingsInput || {}) };
  const paymentMethod = String(order.paymentMethod || '').trim();
  const isUpiMethod = paymentMethod.toUpperCase().includes('UPI');

  let showQr = false;
  if (cfg.upiQrMode === 'always') {
    showQr = true;
  } else if (cfg.upiQrMode === 'never') {
    showQr = false;
  } else {
    showQr = isUpiMethod;
  }
  if (order.showUpiQr !== undefined) {
    showQr = !!order.showUpiQr;
  }

  const receiptHtml = renderReceiptSlipHtml(order, shopInfo, cfg);

  return `
    <div class="modal-backdrop" id="thermal-receipt-modal">
      <div class="modal-content p-6 max-w-sm">
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-[var(--brand-primary)]">Thermal Receipt Preview</span>
            <span class="text-[10px] font-mono px-2 py-0.5 bg-stone-100 rounded text-stone-600 font-bold">${cfg.paperSize || '80mm'}</span>
          </div>
          <button id="close-receipt-btn" class="text-[var(--text-light)] hover:text-[var(--text-main)] p-1 cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </button>
        </div>

        <!-- The Printable Thermal Area -->
        <div class="printable-area">
          ${receiptHtml}
        </div>

        <!-- Print Action -->
        <div class="mt-4 flex gap-2 receipt-modal-actions">
          <button 
            id="trigger-print-btn"
            class="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span>🖨️ Print Now</span>
          </button>
          <button 
            id="toggle-receipt-qr-btn"
            class="py-2.5 px-3 rounded-xl font-bold text-xs border transition-all flex items-center gap-1 cursor-pointer active:scale-98 ${showQr ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100' : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'}"
            title="Toggle UPI QR Code on receipt"
          >
            <span>${showQr ? '✅ QR Code ON' : '➕ Add UPI QR'}</span>
          </button>
          <button 
            id="dismiss-receipt-btn"
            class="py-2.5 px-3 bg-[var(--bg-subtle)] text-[var(--text-muted)] font-semibold text-xs rounded-xl hover:bg-[var(--border-color)] transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `;
}
