// Login Screen Component for Radhe Sweets Confectionery ERP
// Matches ultra-clean floating frosted card mockup with Name & Password authentication

export function renderLoginView(state: any): string {
  const loginError = state.loginError || '';

  return `
    <div id="login-screen" class="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-gradient-to-br from-[#EAF4FF] via-[#F4F8FC] to-[#FFF7ED] select-none">
      
      <!-- Subtle Decorative Atmospheric Circles (1:1 with sky clouds mockup) -->
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-200/35 blur-3xl pointer-events-none"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/60 pointer-events-none opacity-50"></div>

      <!-- Main Login Floating Card -->
      <div class="relative z-10 w-full max-w-[420px] bg-white/90 backdrop-blur-2xl rounded-[32px] p-7 sm:p-9 border border-white/80 shadow-[0_20px_60px_-15px_rgba(42,31,29,0.12)] transition-all animate-fadeIn">
        
        <!-- Header Icon Pill (1:1 with mockup ->]) -->
        <div class="flex justify-center mb-5">
          <div class="w-14 h-14 rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-stone-100 flex items-center justify-center text-stone-800 transition-transform hover:scale-105">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 19v1a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2h10a2 2 0 012 2v1"/>
            </svg>
          </div>
        </div>

        <!-- Title & Subtitle -->
        <div class="text-center space-y-1.5 mb-6">
          <h1 class="text-2xl sm:text-[26px] font-black tracking-tight text-[#1F1917]">
            Sign in with credentials
          </h1>
          <p class="text-xs sm:text-[13px] text-stone-500 font-medium leading-relaxed max-w-xs mx-auto">
            Manage your sweet shop counters, orders, inventory, and staff together.
          </p>
        </div>

        <!-- Error Notification (if invalid credentials) -->
        ${loginError ? `
          <div class="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-shake">
            <span class="text-base">⚠️</span>
            <span>${loginError}</span>
          </div>
        ` : ''}

        <!-- Login Form -->
        <form id="app-login-form" class="space-y-4">
          
          <!-- Field 1: Name -->
          <div class="space-y-1.5 text-left">
            <label for="login-username" class="text-[11px] font-bold text-stone-600 block pl-1">
              Name
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <input 
                type="text" 
                id="login-username" 
                name="username" 
                required 
                autocomplete="username"
                placeholder="Owner"
                class="w-full pl-10 pr-4 py-3 bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-stone-300 rounded-2xl text-xs sm:text-sm font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition-all"
              />
            </div>
          </div>

          <!-- Field 2: Password -->
          <div class="space-y-1.5 text-left">
            <div class="flex items-center justify-between pl-1">
              <label for="login-password" class="text-[11px] font-bold text-stone-600">
                Password
              </label>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <input 
                type="password" 
                id="login-password" 
                name="password" 
                required 
                autocomplete="current-password"
                placeholder="admin"
                class="w-full pl-10 pr-11 py-3 bg-stone-100/80 hover:bg-stone-100 focus:bg-white border border-transparent focus:border-stone-300 rounded-2xl text-xs sm:text-sm font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 transition-all"
              />
              <button 
                type="button" 
                id="toggle-login-password-btn" 
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                title="Toggle password visibility"
              >
                <svg id="eye-icon-open" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg id="eye-icon-closed" class="w-4 h-4 hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit Button (Black/Dark Pill Button matching mockup) -->
          <div class="pt-2">
            <button 
              type="submit" 
              id="login-submit-btn"
              class="w-full py-3.5 px-5 bg-[#1F1917] hover:bg-black text-white font-extrabold text-sm rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>

        </form>

        <!-- Master Account Quick-Fill Card -->
        <div class="mt-6 pt-5 border-t border-stone-200/80 text-center space-y-2">
          <p class="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Default Master Account
          </p>
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 font-mono">
            <span>Name: <strong>Owner</strong></span>
            <span class="text-amber-300">•</span>
            <span>Pass: <strong>admin</strong></span>
          </div>
          <div>
            <button 
              type="button" 
              id="quick-fill-owner-btn" 
              class="text-[11px] font-bold text-[#C86D3B] hover:text-[#b05a2b] hover:underline cursor-pointer"
            >
              ⚡ Click to Auto-fill Master Credentials
            </button>
          </div>
        </div>

      </div>

      <!-- Footer Brand Watermark -->
      <div class="absolute bottom-3 text-center w-full pointer-events-none">
        <p class="text-[11px] text-stone-400 font-medium">Radhe Sweets Confectionery Management ERP • Multi-Branch Security</p>
      </div>

    </div>
  `;
}
