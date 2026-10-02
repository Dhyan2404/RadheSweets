// Customer Phone Dialer & Database Search/Registration Modal Component
// Modern Dual-Pane Truecaller / Smartphone POS Dialer with Responsive Mobile Overhaul
// Optimized for Large Touch Targets, Zero-Overlap Input & Ergonomic Smartphone Thumb Usage

export function formatDialerPhone(rawDigits: string): string {
  const digits = (rawDigits || '').replace(/\D/g, '').slice(0, 10);
  if (digits.length > 5) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  } else if (digits.length > 0) {
    return `+91 ${digits}`;
  }
  return '+91 ••••• •••••';
}

export function filterDialerCustomers(customers: any[], query: string): any[] {
  const clean = (query || '').trim().toLowerCase();
  if (!clean) {
    // If empty query, show frequent / recent customers
    return customers.slice(0, 6);
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
  const formattedDialed = cleanDigits.length > 0 ? formatDialerPhone(cleanDigits) : '';
  const exactMatch = matches.find(c => {
    const cDigits = (c.phone || '').replace(/\D/g, '');
    return cleanDigits.length > 0 && (cDigits.endsWith(cleanDigits) || cleanDigits.endsWith(cDigits));
  });

  // If no matches found in directory for this query or dialed digits
  if (matches.length === 0) {
    return `
      <div class="p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-orange-50/70 border-2 border-amber-300 rounded-2xl space-y-4 animate-fadeIn">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
            👤+
          </div>
          <div>
            <h4 class="font-extrabold text-sm sm:text-base text-amber-950">New Customer Registration</h4>
            <p class="text-xs text-amber-800 font-medium">
              ${cleanDigits.length > 0 ? `Number: <strong>${formattedDialed}</strong> is not registered yet.` : 'Search found no registered customer.'}
            </p>
          </div>
        </div>

        <!-- 1-Click Instant Attach Button -->
        <button 
          type="button" 
          id="dialer-attach-new-instant-btn"
          class="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>⚡ Attach ${cleanDigits.length > 0 ? formattedDialed : 'This Number'} to Order (+50 Pts)</span>
        </button>

        <!-- Optional Name Section -->
        <div class="pt-3 border-t border-amber-200/80 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-900">Optional: Add Customer Name</span>
            <span class="text-[11px] text-amber-700 font-medium">Leave blank for quick attach</span>
          </div>
          <div class="flex gap-2">
            <input 
              type="text" 
              id="dialer-new-customer-name" 
              placeholder="e.g. Ramesh Patel, Shaileshbhai"
              class="flex-1 px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm font-bold text-[var(--text-main)] placeholder-stone-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <button 
              type="button" 
              id="dialer-save-named-customer-btn" 
              class="px-4 py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
            >
              Save &amp; Attach
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="space-y-3 max-h-[440px] overflow-y-auto pr-1">
      ${matches.map(c => {
        const isExact = exactMatch && exactMatch.id === c.id;
        const initials = (c.name || 'C').split(' ').filter(Boolean).map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
        return `
          <div 
            class="p-3.5 sm:p-4 rounded-2xl border ${
              isExact 
                ? 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-400/40 shadow-xs' 
                : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-amber-400 hover:bg-[var(--brand-primary-light)]'
            } transition-all flex items-center justify-between gap-3 group"
          >
            <div class="flex items-center space-x-3.5 min-w-0">
              <div class="w-12 h-12 rounded-2xl ${isExact ? 'bg-emerald-600' : 'bg-stone-700'} text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                ${initials}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-extrabold text-sm sm:text-base text-[var(--text-main)] truncate">${c.name}</span>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black font-mono bg-stone-100 text-stone-800 border border-stone-200">
                    #${(c.id || 'CUST').toUpperCase()}
                  </span>
                  ${isExact ? `
                    <span class="text-[10px] px-2 py-0.5 rounded-full font-black bg-emerald-600 text-white shadow-2xs">
                      ★ Matched
                    </span>
                  ` : ''}
                </div>
                <p class="text-xs sm:text-sm font-mono font-bold text-[var(--text-muted)] mt-0.5">${c.phone}</p>
                <div class="flex items-center gap-2 mt-1 text-xs text-[var(--text-light)] flex-wrap">
                  <span class="font-bold text-stone-800">Spent: ₹${(c.totalSpent || 0).toLocaleString()}</span>
                  <span>•</span>
                  <span>${c.totalOrders || 1} orders</span>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              data-dialer-pick-customer="${c.id}"
              class="px-4 sm:px-5 py-3 rounded-xl ${
                isExact 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
                  : 'bg-[var(--brand-primary-light)] text-[var(--brand-primary)] group-hover:bg-[var(--brand-primary)] group-hover:text-white'
              } text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>✓ Attach</span>
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
  const hasDigits = rawDigits.length > 0;
  const isComplete = rawDigits.length === 10;
  const matches = filterDialerCustomers(customers, dialerInput);

  return `
    <div class="modal-backdrop" id="customer-dialer-modal">
      <div class="modal-content modal-content-wide p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 max-w-5xl w-full select-none rounded-3xl shadow-2xl border border-[var(--border-color)] overflow-hidden max-h-[94vh] flex flex-col">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3.5 sm:pb-4 shrink-0">
          <div class="flex items-center space-x-3">
            <span class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 text-[var(--brand-primary)] flex items-center justify-center font-bold text-xl sm:text-2xl shadow-xs border border-amber-300/40">
              📞
            </span>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base sm:text-xl font-extrabold text-[var(--text-main)]">Patron Phone Dialer &amp; Directory</h3>
                <span class="hidden sm:inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Instant POS Link
                </span>
              </div>
              <p class="text-xs text-[var(--text-muted)] mt-0.5">Dial 10-digit mobile number or search existing patrons to attach to the active order</p>
            </div>
          </div>
          <button 
            type="button" 
            id="close-dialer-btn" 
            class="p-2.5 text-[var(--text-light)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] rounded-xl transition-colors cursor-pointer"
            title="Close Dialer (Esc)"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path></svg>
          </button>
        </div>

        <!-- Mobile View Mode Segmented Switcher (Visible on mobile < 768px for zero-cramp experience) -->
        <div class="flex md:hidden p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs font-bold gap-1 shrink-0">
          <button 
            type="button" 
            id="dialer-tab-keypad-btn" 
            class="flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white dark:bg-stone-900 text-[#C86D3B] shadow-2xs font-extrabold"
          >
            <span>🔢</span><span>Phone Keypad</span>
          </button>
          <button 
            type="button" 
            id="dialer-tab-directory-btn" 
            class="flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-stone-600 dark:text-stone-300 hover:text-stone-900 font-bold"
          >
            <span>👥</span><span>Directory (${matches.length})</span>
          </button>
        </div>

        <!-- 2-Column Split: Left Dialpad (Smartphone POS) | Right Live Directory Matches -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-7 items-start overflow-y-auto flex-1 pr-1">
          
          <!-- Left Column: Phone Display, 12-Key Large Dialpad & Hero Action (5 Cols on Desktop) -->
          <div id="dialer-keypad-column" class="md:col-span-5 space-y-3.5 sm:space-y-4 bg-[var(--bg-subtle)] p-3.5 sm:p-5 rounded-2xl border border-[var(--border-color)] shadow-xs">
            <!-- Screen Display -->
            <div class="bg-[var(--bg-surface)] p-3.5 sm:p-4 rounded-2xl border border-[var(--border-color)] text-center space-y-2 relative shadow-inner">
              <div class="flex items-center justify-between text-[11px] uppercase font-bold text-[var(--text-light)] tracking-widest px-1">
                <span>Dialing Mobile</span>
                <span id="dialer-digit-count" class="${
                  isComplete 
                    ? 'text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block shadow-2xs animate-pulse' 
                    : 'text-xs font-bold text-[var(--text-muted)]'
                }">
                  ${isComplete ? '✓ 10 Digits Complete' : `${rawDigits.length} / 10 digits`}
                </span>
              </div>
              
              <div class="flex items-center justify-center space-x-2 py-1">
                <span id="dialer-phone-display" class="text-2xl sm:text-3xl lg:text-4xl font-mono font-black text-[var(--text-main)] tracking-wider">
                  ${formattedPhone}
                </span>
                <button 
                  type="button" 
                  id="dialer-backspace-btn" 
                  class="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer" 
                  title="Backspace (Delete single digit)"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H20a2 2 0 012 2v10a2 2 0 01-2 2h-9.172a2 2 0 01-1.414-.586L3 12z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                </button>
              </div>
            </div>

            <!-- Touch Keypad (0-9, Backspace, Clear) with Large, Generous Buttons -->
            <div class="grid grid-cols-3 gap-2.5 sm:gap-3">
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
              <button type="button" id="dialer-clear-btn" class="dial-key-btn text-rose-500 hover:bg-rose-50 hover:border-rose-300">
                <span class="dial-num text-sm sm:text-base font-black">CLR</span>
                <span class="dial-letters text-rose-400">Clear</span>
              </button>
              <button type="button" data-dial-digit="0" class="dial-key-btn">
                <span class="dial-num">0</span>
                <span class="dial-letters">+</span>
              </button>
              <button type="button" id="dialer-backspace-key" class="dial-key-btn text-stone-600 hover:bg-stone-100">
                <span class="dial-num text-lg sm:text-xl font-black">⌫</span>
                <span class="dial-letters">Delete</span>
              </button>
            </div>

            <!-- Direct Primary Action: HERO ATTACH BUTTON -->
            <div class="space-y-2 pt-1">
              <button 
                type="button" 
                id="dialer-attach-number-btn" 
                ${hasDigits ? '' : 'disabled'}
                class="${
                  hasDigits 
                    ? 'w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer' 
                    : 'w-full py-4 px-4 bg-stone-200 dark:bg-stone-800 text-stone-400 font-bold text-sm rounded-2xl cursor-not-allowed flex items-center justify-center gap-2'
                }"
              >
                <span>${hasDigits ? `⚡ Attach ${formattedPhone} to Order` : '📞 Dial 10 digits to attach'}</span>
              </button>

              <!-- Secondary Walk-in Counter Button -->
              <button 
                type="button"
                id="dialer-instant-walkin-btn" 
                class="w-full py-3 px-3 bg-[var(--bg-surface)] hover:bg-stone-100 dark:hover:bg-stone-800 border border-[var(--border-color)] text-[var(--text-main)] rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>⚡ Walk-in Counter (No Number)</span>
              </button>
            </div>
          </div>

          <!-- Right Column: Live Directory Search & Matches (7 Cols on Desktop) -->
          <div id="dialer-directory-column" class="hidden md:block md:col-span-7 space-y-3.5">
            <!-- Search & Quick Add Bar (No Collision / Squeezed Placeholder!) -->
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-light)]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"></path></svg>
                </span>
                <input 
                  type="text" 
                  id="dialer-search-input" 
                  value="${dialerInput}"
                  placeholder="Search patrons by Name or Phone..." 
                  class="w-full pl-10 pr-3 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-xs sm:text-sm font-bold text-[var(--text-main)] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-2xs"
                />
              </div>

              <!-- Dedicated Quick Add Button Alongside Search (Zero Overlap!) -->
              <button 
                type="button" 
                id="dialer-toggle-add-btn" 
                class="px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-bold bg-[var(--brand-primary-light)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white border border-[var(--brand-primary)]/20 rounded-2xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-2xs"
              >
                <span>👤+</span>
                <span class="hidden sm:inline">Quick Add</span>
              </button>
            </div>

            <!-- Header Label for Matches -->
            <div class="flex items-center justify-between px-1">
              <span class="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">
                ${dialerInput ? 'Search &amp; Dial Results' : 'Frequent &amp; Recent Patrons'}
              </span>
              <span class="text-xs font-semibold text-[var(--text-light)]">
                Click Attach to select
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
