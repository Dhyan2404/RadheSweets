// Customer Phone Dialer & Database Search/Registration Modal Component
// Modern Dual-Pane Truecaller / Smartphone Dialer with Zero-Flicker In-Place Updates

export function formatDialerPhone(rawDigits: string): string {
  const digits = (rawDigits || '').replace(/\D/g, '').slice(0, 10);
  if (digits.length > 5) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  } else if (digits.length > 0) {
    return `+91 ${digits}`;
  }
  return '+91 ';
}

export function filterDialerCustomers(customers: any[], query: string): any[] {
  const clean = (query || '').trim().toLowerCase();
  if (!clean) {
    // If empty query, show frequent / recent customers
    return customers.slice(0, 5);
  }

  const cleanDigits = clean.replace(/\D/g, '');

  return customers.filter(c => {
    const custDigits = (c.phone || '').replace(/\D/g, '');
    const phoneMatch = cleanDigits.length > 0 && custDigits.includes(cleanDigits);
    const nameMatch = (c.name || '').toLowerCase().includes(clean);
    return phoneMatch || nameMatch;
  });
}

export function renderDialerMatchesHtml(customers: any[], query: string, rawDigits: string): string {
  const matches = filterDialerCustomers(customers, query);
  const cleanDigits = (rawDigits || '').replace(/\D/g, '').slice(0, 10);
  const is10Digits = cleanDigits.length === 10;
  const exactMatch = matches.find(c => (c.phone || '').replace(/\D/g, '').endsWith(cleanDigits));

  if (matches.length === 0) {
    return `
      <div class="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-3 animate-fadeIn text-center">
        <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-700 font-bold text-xl flex items-center justify-center mx-auto">
          👤+
        </div>
        <div>
          <h4 class="font-bold text-sm text-amber-950">New Customer — Quick Register</h4>
          <p class="text-xs text-amber-800 mt-0.5">No existing customer with "${query}". Add name to attach & give +50 points bonus!</p>
        </div>

        <form id="dialer-quick-add-form" class="text-left space-y-2.5 pt-1">
          <div>
            <label class="block text-[11px] font-bold text-amber-900 mb-0.5">Customer Name *</label>
            <input 
              type="text" 
              id="dialer-new-name" 
              name="name" 
              required 
              placeholder="e.g. Ramesh Patel, Shaileshbhai"
              class="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-[var(--text-main)] focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-amber-900 mb-0.5">Mobile Number</label>
            <input 
              type="tel" 
              id="dialer-new-phone" 
              name="phone" 
              value="${cleanDigits}" 
              placeholder="10 digit mobile"
              class="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-[var(--text-main)] focus:ring-2 focus:ring-[var(--brand-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-amber-900 mb-0.5">Customer Tier</label>
            <select id="dialer-new-tier" name="tier" class="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-semibold text-[var(--text-main)]">
              <option value="Regular">Regular Customer</option>
              <option value="VIP">VIP Gold Tier</option>
              <option value="Corporate">Corporate Khata</option>
            </select>
          </div>
          <button 
            type="submit" 
            class="w-full py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5"
          >
            <span>✓ Save & Attach to Order</span>
          </button>
        </form>
      </div>
    `;
  }

  return `
    <div class="space-y-2 max-h-[380px] overflow-y-auto pr-1">
      ${matches.map(c => {
        const isSelected = exactMatch && exactMatch.id === c.id;
        const initials = (c.name || 'C').split(' ').map((n: string) => n[0]).join('').slice(0, 2);
        return `
          <div 
            class="p-3 rounded-2xl border ${isSelected ? 'border-emerald-400 bg-emerald-50/80 ring-2 ring-emerald-300' : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--brand-primary-light)]'} transition-all flex items-center justify-between gap-3 group"
          >
            <div class="flex items-center space-x-3 min-w-0">
              <div class="w-10 h-10 rounded-full ${isSelected ? 'bg-emerald-600' : 'bg-stone-700'} text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                ${initials}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="font-extrabold text-xs sm:text-sm text-[var(--text-main)] truncate">${c.name}</span>
                  <span class="text-[9px] px-1.5 py-0.2 rounded font-bold ${c.tier === 'VIP' ? 'bg-amber-500 text-white' : c.tier === 'Corporate' ? 'bg-indigo-600 text-white' : 'bg-stone-200 text-stone-700'}">
                    ${c.tier || 'Regular'}
                  </span>
                </div>
                <p class="text-xs font-mono font-semibold text-[var(--text-muted)] mt-0.5">${c.phone}</p>
                <div class="flex items-center gap-2 mt-1 text-[10px] text-[var(--text-light)]">
                  <span>⭐ ${c.loyaltyPoints || 0} pts</span>
                  <span>•</span>
                  <span>Spent: ₹${c.totalSpent || 0}</span>
                  ${c.khataBalance > 0 ? `
                    <span>•</span>
                    <span class="text-rose-600 font-bold">Khata: ₹${c.khataBalance}</span>
                  ` : ''}
                </div>
              </div>
            </div>

            <button 
              type="button"
              data-dialer-pick-customer="${c.id}"
              class="px-3 py-2 rounded-xl ${isSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[var(--bg-subtle)] text-[var(--brand-primary)] group-hover:bg-[var(--brand-primary)] group-hover:text-white'} text-xs font-bold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1 shrink-0"
            >
              <span>✓ Select</span>
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function renderCustomerDialerModal(state: any) {
  const { customers = [], dialerInput = '' } = state;
  const rawDigits = (dialerInput || '').replace(/\D/g, '').slice(0, 10);
  const formattedPhone = formatDialerPhone(rawDigits);

  return `
    <div class="modal-backdrop" id="customer-dialer-modal">
      <div class="modal-content p-5 sm:p-6 space-y-4 max-w-3xl w-full select-none">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div class="flex items-center space-x-2.5">
            <span class="w-9 h-9 rounded-2xl bg-[var(--brand-primary-light)] text-[var(--brand-primary)] flex items-center justify-center font-bold text-base shadow-xs">
              📞
            </span>
            <div>
              <h3 class="text-base sm:text-lg font-bold text-[var(--text-main)]">Patron Phone Dialer & Live Directory</h3>
              <p class="text-[11px] text-[var(--text-muted)]">Instant lookup as you dial digits or search by customer name</p>
            </div>
          </div>
          <button type="button" id="close-dialer-btn" class="p-1.5 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </button>
        </div>

        <!-- 2-Column Split: Left Dialpad (Smartphone) | Right Live Matches (Truecaller Style) -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          <!-- Left Column: Phone Display & 12-Key Dialpad (5 Cols) -->
          <div class="md:col-span-5 space-y-3 bg-[var(--bg-subtle)] p-4 rounded-2xl border border-[var(--border-color)]">
            <!-- Screen Display -->
            <div class="bg-[var(--bg-surface)] p-3.5 rounded-xl border border-[var(--border-color)] text-center space-y-1 relative shadow-inner">
              <p class="text-[10px] uppercase font-bold text-[var(--text-light)] tracking-widest">
                Dialing Number
              </p>
              <div class="flex items-center justify-center space-x-2">
                <span id="dialer-phone-display" class="text-2xl font-mono font-black text-[var(--text-main)] tracking-wider">
                  ${formattedPhone}
                </span>
                <button 
                  type="button" 
                  id="dialer-backspace-btn" 
                  class="p-1.5 text-stone-400 hover:text-rose-500 transition-colors" 
                  title="Backspace"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H20a2 2 0 012 2v10a2 2 0 01-2 2h-9.172a2 2 0 01-1.414-.586L3 12z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                </button>
              </div>
              <p id="dialer-digit-count" class="text-[10px] font-semibold text-[var(--text-muted)]">
                ${rawDigits.length} / 10 digits
              </p>
            </div>

            <!-- Touch Keypad (0-9, Backspace, Clear) -->
            <div class="grid grid-cols-3 gap-2">
              <button type="button" data-dial-digit="1" class="dial-key-btn">
                <span class="dial-num">1</span>
                <span class="dial-letters">~</span>
              </button>
              <button type="button" data-dial-digit="2" class="dial-key-btn">
                <span class="dial-num">2</span>
                <span class="dial-letters">ABC</span>
              </button>
              <button type="button" data-dial-digit="3" class="dial-key-btn">
                <span class="dial-num">3</span>
                <span class="dial-letters">DEF</span>
              </button>
              <button type="button" data-dial-digit="4" class="dial-key-btn">
                <span class="dial-num">4</span>
                <span class="dial-letters">GHI</span>
              </button>
              <button type="button" data-dial-digit="5" class="dial-key-btn">
                <span class="dial-num">5</span>
                <span class="dial-letters">JKL</span>
              </button>
              <button type="button" data-dial-digit="6" class="dial-key-btn">
                <span class="dial-num">6</span>
                <span class="dial-letters">MNO</span>
              </button>
              <button type="button" data-dial-digit="7" class="dial-key-btn">
                <span class="dial-num">7</span>
                <span class="dial-letters">PQRS</span>
              </button>
              <button type="button" data-dial-digit="8" class="dial-key-btn">
                <span class="dial-num">8</span>
                <span class="dial-letters">TUV</span>
              </button>
              <button type="button" data-dial-digit="9" class="dial-key-btn">
                <span class="dial-num">9</span>
                <span class="dial-letters">WXYZ</span>
              </button>
              <button type="button" id="dialer-clear-btn" class="dial-key-btn text-rose-500">
                <span class="dial-num text-xs">CLR</span>
                <span class="dial-letters">Clear</span>
              </button>
              <button type="button" data-dial-digit="0" class="dial-key-btn">
                <span class="dial-num">0</span>
                <span class="dial-letters">+</span>
              </button>
              <button type="button" id="dialer-backspace-key" class="dial-key-btn text-stone-600">
                <span class="dial-num text-sm">⌫</span>
                <span class="dial-letters">Delete</span>
              </button>
            </div>

            <!-- Instant Counter Walk-in Quick Button -->
            <button 
              type="button"
              id="dialer-instant-walkin-btn" 
              class="w-full py-2.5 px-3 bg-[var(--bg-surface)] hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-[var(--border-color)] text-[var(--text-main)] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>⚡ Quick Walk-in (No Number)</span>
            </button>
          </div>

          <!-- Right Column: Live Directory Search, Matches & Add by Name (7 Cols) -->
          <div class="md:col-span-7 space-y-3">
            <!-- Search & Filter Bar (by Name or Number) -->
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-light)]">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
              </span>
              <input 
                type="text" 
                id="dialer-search-input" 
                value="${dialerInput}"
                placeholder="Search older customers by Name or Phone..." 
                class="w-full pl-9 pr-24 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
              />
              <button 
                type="button" 
                id="dialer-toggle-add-btn" 
                class="absolute right-1.5 top-1.5 px-2.5 py-1 text-[11px] font-bold bg-[var(--brand-primary-light)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white rounded-lg transition-colors"
              >
                + Add by Name
              </button>
            </div>

            <!-- Header Label for Matches -->
            <div class="flex items-center justify-between px-1">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Store Customers Directory
              </span>
              <span class="text-[10px] font-semibold text-[var(--text-light)]">
                Tap to select for order
              </span>
            </div>

            <!-- Matching Patrons Live Container (Updated in-place with zero flicker) -->
            <div id="dialer-matches-container">
              ${renderDialerMatchesHtml(customers, dialerInput, rawDigits)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
