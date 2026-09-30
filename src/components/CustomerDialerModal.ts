// Customer Phone Dialer & Database Search/Registration Modal Component

export function renderCustomerDialerModal(state) {
  const { customers = [], dialerInput = '', dialerMatchedCustomer = null, dialerIsNewCustomer = false } = state;

  // Clean phone string to digits
  const rawDigits = (dialerInput || '').replace(/\D/g, '').slice(0, 10);
  
  // Format as +91 XXXXX XXXXX
  let formattedPhone = '';
  if (rawDigits.length > 5) {
    formattedPhone = `+91 ${rawDigits.slice(0, 5)} ${rawDigits.slice(5)}`;
  } else if (rawDigits.length > 0) {
    formattedPhone = `+91 ${rawDigits}`;
  } else {
    formattedPhone = '+91 ';
  }

  // Find matches in existing database
  const matchingCustomers = rawDigits.length >= 3 
    ? customers.filter(c => c.phone.replace(/\D/g, '').includes(rawDigits))
    : [];

  const exactMatch = rawDigits.length === 10
    ? customers.find(c => c.phone.replace(/\D/g, '').endsWith(rawDigits))
    : (matchingCustomers.length === 1 && rawDigits.length >= 8 ? matchingCustomers[0] : null);

  const isCompleteNumber = rawDigits.length === 10;
  const isNew = isCompleteNumber && !exactMatch;

  return `
    <div class="modal-backdrop" id="customer-dialer-modal">
      <div class="modal-content p-6 space-y-4 max-w-md w-full select-none">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div class="flex items-center space-x-2">
            <span class="w-8 h-8 rounded-full bg-[var(--brand-primary-light)] text-[var(--brand-primary)] flex items-center justify-center font-bold text-sm">
              📞
            </span>
            <div>
              <h3 class="text-base font-bold text-[var(--text-main)]">Customer Phone Lookup</h3>
              <p class="text-[10px] text-[var(--text-muted)]">Customer details required for billing & loyalty rewards</p>
            </div>
          </div>
          <button id="close-dialer-btn" class="p-1.5 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </button>
        </div>

        <!-- Phone Number Display Screen -->
        <div class="bg-[var(--bg-subtle)] p-4 rounded-2xl border border-[var(--border-color)] text-center space-y-1 relative">
          <p class="text-[10px] uppercase font-bold text-[var(--text-light)] tracking-widest">
            Enter Customer Mobile Number
          </p>
          <div class="flex items-center justify-center space-x-2">
            <span class="text-2xl sm:text-3xl font-mono font-black text-[var(--text-main)] tracking-wider">
              ${formattedPhone}
            </span>
            ${rawDigits.length > 0 ? `
              <button id="dialer-backspace-btn" class="p-2 text-stone-400 hover:text-rose-500 transition-colors" title="Backspace">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H20a2 2 0 012 2v10a2 2 0 01-2 2h-9.172a2 2 0 01-1.414-.586L3 12z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
              </button>
            ` : ''}
          </div>
          <p class="text-[10px] font-semibold text-[var(--text-muted)]">
            ${rawDigits.length} / 10 digits ${rawDigits.length === 10 ? '✓ Ready' : ''}
          </p>
        </div>

        <!-- Live Database Match or New Customer Card -->
        ${exactMatch ? `
          <!-- Existing Customer Found in Database -->
          <div class="bg-emerald-50/80 border border-emerald-300 p-3.5 rounded-2xl space-y-2 animate-fadeIn">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-2.5">
                <div class="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  ${exactMatch.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <div class="flex items-center space-x-1.5">
                    <span class="font-extrabold text-sm text-emerald-950">${exactMatch.name}</span>
                    <span class="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded">${exactMatch.tier || 'VIP'}</span>
                  </div>
                  <p class="text-xs text-emerald-800 font-semibold">${exactMatch.phone}</p>
                </div>
              </div>
              <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                ✓ Exists in Database
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-emerald-200">
              <div class="bg-white/70 p-1.5 rounded-xl">
                <p class="text-[9px] text-emerald-700">Loyalty Points</p>
                <p class="font-extrabold text-emerald-900">⭐ ${exactMatch.loyaltyPoints || 0}</p>
              </div>
              <div class="bg-white/70 p-1.5 rounded-xl">
                <p class="text-[9px] text-emerald-700">Khata Due</p>
                <p class="font-extrabold ${exactMatch.khataBalance > 0 ? 'text-rose-600' : 'text-emerald-900'}">₹${exactMatch.khataBalance || 0}</p>
              </div>
              <div class="bg-white/70 p-1.5 rounded-xl">
                <p class="text-[9px] text-emerald-700">Total Spent</p>
                <p class="font-extrabold text-emerald-900">₹${exactMatch.totalSpent || 0}</p>
              </div>
            </div>

            <button 
              id="dialer-select-existing-btn"
              data-customer-id="${exactMatch.id}"
              class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 active:scale-98"
            >
              <span>✓ Select ${exactMatch.name} & Continue</span>
            </button>
          </div>
        ` : isNew ? `
          <!-- New Customer Not in Database -> Instant Registration Form -->
          <div class="bg-amber-50/90 border border-amber-300 p-3.5 rounded-2xl space-y-2.5 animate-fadeIn">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-amber-900 flex items-center gap-1">
                <span>👤</span> Unregistered Number — Create Customer
              </span>
              <span class="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                +50 Pts Bonus
              </span>
            </div>

            <form id="dialer-new-customer-form" class="space-y-2 text-xs">
              <input type="hidden" name="phone" value="${rawDigits}" />
              <div>
                <label class="block font-semibold text-amber-900 text-[11px] mb-0.5">Customer Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  id="dialer-new-customer-name"
                  required 
                  placeholder="e.g. Ramesh Patel, Shailesh Shah" 
                  autofocus
                  class="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block font-semibold text-amber-900 text-[10px] mb-0.5">Tier</label>
                  <select name="tier" class="w-full px-2 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-[var(--text-main)]">
                    <option value="Regular">Regular Customer</option>
                    <option value="VIP">VIP Gold Tier</option>
                    <option value="Corporate">Corporate Khata</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-amber-900 text-[10px] mb-0.5">City / Area</label>
                  <input type="text" name="address" value="Ahmedabad, Gujarat" class="w-full px-2 py-1.5 bg-white border border-amber-300 rounded-lg text-xs text-[var(--text-main)]" />
                </div>
              </div>

              <button 
                type="submit" 
                class="w-full py-2.5 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98"
              >
                ✓ Save Customer & Proceed to Order
              </button>
            </form>
          </div>
        ` : matchingCustomers.length > 0 ? `
          <!-- Partial Matches Found -->
          <div class="bg-[var(--bg-subtle)] p-2.5 rounded-xl border border-[var(--border-color)] space-y-1.5">
            <p class="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Matching Customers in Store (${matchingCustomers.length})</p>
            <div class="space-y-1 max-h-24 overflow-y-auto pr-1">
              ${matchingCustomers.slice(0, 3).map(c => `
                <div 
                  data-dialer-pick-customer="${c.id}"
                  class="p-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--brand-primary-light)] border border-[var(--border-subtle)] flex items-center justify-between cursor-pointer transition-colors text-xs"
                >
                  <div class="flex items-center space-x-2">
                    <span class="font-bold text-[var(--text-main)]">${c.name}</span>
                    <span class="text-[10px] text-[var(--text-light)]">${c.phone}</span>
                  </div>
                  <span class="text-[10px] font-bold text-[var(--brand-primary)]">Pick →</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="p-2 text-center text-[11px] text-[var(--text-light)]">
            Dial 10-digit mobile number or pick from recent customers below
          </div>
        `}

        <!-- Phone Touch Dialer Keypad (12-Key Pad) -->
        <div class="grid grid-cols-3 gap-2.5 pt-1">
          <!-- 1 -->
          <button data-dial-digit="1" class="dial-key-btn">
            <span class="dial-num">1</span>
            <span class="dial-letters">~</span>
          </button>
          <!-- 2 -->
          <button data-dial-digit="2" class="dial-key-btn">
            <span class="dial-num">2</span>
            <span class="dial-letters">ABC</span>
          </button>
          <!-- 3 -->
          <button data-dial-digit="3" class="dial-key-btn">
            <span class="dial-num">3</span>
            <span class="dial-letters">DEF</span>
          </button>
          <!-- 4 -->
          <button data-dial-digit="4" class="dial-key-btn">
            <span class="dial-num">4</span>
            <span class="dial-letters">GHI</span>
          </button>
          <!-- 5 -->
          <button data-dial-digit="5" class="dial-key-btn">
            <span class="dial-num">5</span>
            <span class="dial-letters">JKL</span>
          </button>
          <!-- 6 -->
          <button data-dial-digit="6" class="dial-key-btn">
            <span class="dial-num">6</span>
            <span class="dial-letters">MNO</span>
          </button>
          <!-- 7 -->
          <button data-dial-digit="7" class="dial-key-btn">
            <span class="dial-num">7</span>
            <span class="dial-letters">PQRS</span>
          </button>
          <!-- 8 -->
          <button data-dial-digit="8" class="dial-key-btn">
            <span class="dial-num">8</span>
            <span class="dial-letters">TUV</span>
          </button>
          <!-- 9 -->
          <button data-dial-digit="9" class="dial-key-btn">
            <span class="dial-num">9</span>
            <span class="dial-letters">WXYZ</span>
          </button>
          <!-- Clear / * -->
          <button id="dialer-clear-btn" class="dial-key-btn text-rose-500">
            <span class="dial-num text-sm">CLR</span>
            <span class="dial-letters">Reset</span>
          </button>
          <!-- 0 -->
          <button data-dial-digit="0" class="dial-key-btn">
            <span class="dial-num">0</span>
            <span class="dial-letters">+</span>
          </button>
          <!-- Backspace / # -->
          <button id="dialer-backspace-key" class="dial-key-btn text-stone-600">
            <span class="dial-num text-lg">⌫</span>
            <span class="dial-letters">Delete</span>
          </button>
        </div>

        <!-- Quick Pick Recent Customers Strip -->
        <div class="pt-2 border-t border-[var(--border-color)]">
          <p class="text-[10px] font-bold text-[var(--text-light)] uppercase tracking-wider mb-1.5">Quick Pick Frequent Customers</p>
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
            ${customers.slice(0, 4).map(c => `
              <button 
                data-dialer-pick-customer="${c.id}"
                class="px-2.5 py-1 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--brand-primary-light)] hover:text-[var(--brand-primary)] border border-[var(--border-color)] text-[11px] font-bold whitespace-nowrap transition-colors flex items-center gap-1"
              >
                <span>👤</span>
                <span>${c.name.split(' ')[0]}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
