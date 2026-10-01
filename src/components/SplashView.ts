// Cinematic Loading & Divine Welcome Page
// 100% Faithful to stitch_radhe_sweets_shop_manager/image.png_5/screen.png

export function renderSplashView(options: { isModal?: boolean; progress?: number; message?: string } = {}) {
  const { isModal = false, progress = 100, message = 'Jai Radhe Krishna 🙏 Console Ready!' } = options;

  return `
    <div 
      id="splash-loading-screen" 
      class="fixed inset-0 z-[100] flex flex-col items-center justify-between select-none overflow-hidden transition-opacity duration-500"
      style="background: #FAF7F2;"
    >
      <!-- Atmospheric Divine Golden Aura & Floating Particles -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <!-- Radial light beams centered behind the divine art -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full bg-gradient-to-r from-amber-200/35 via-orange-100/20 to-transparent blur-3xl animate-pulse"></div>
        <div class="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-300/15 blur-2xl"></div>
        <div class="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-orange-300/15 blur-2xl"></div>
        
        <!-- Floating Golden Sparkle Specks -->
        <span class="golden-speck" style="top: 20%; left: 15%; animation-delay: 0s;"></span>
        <span class="golden-speck" style="top: 35%; right: 18%; animation-delay: 0.8s;"></span>
        <span class="golden-speck" style="top: 65%; left: 22%; animation-delay: 1.5s;"></span>
        <span class="golden-speck" style="top: 75%; right: 25%; animation-delay: 2.1s;"></span>
        <span class="golden-speck" style="top: 15%; right: 30%; animation-delay: 1.2s;"></span>
      </div>

      <!-- Close Button (Always visible) -->
      <button 
        id="close-splash-btn" 
        class="absolute top-5 right-5 sm:top-7 sm:right-7 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md border border-amber-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        title="Return to Store"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </button>

      <!-- Top Subtle Devotional Header -->
      <div class="relative z-10 w-full pt-6 sm:pt-8 px-6 flex items-center justify-between max-w-5xl opacity-90">
        <div class="flex items-center space-x-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span class="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-stone-600">
            Navrangpura Flagship • Shuddh Desi Ghee
          </span>
        </div>

        <div class="flex items-center space-x-2 text-[11px] sm:text-xs font-semibold text-amber-900 bg-amber-50/80 border border-amber-200/80 px-3 py-1 rounded-full shadow-2xs">
          <span>🙏</span>
          <span>Jai Radhe Krishna</span>
        </div>
      </div>

      <!-- Center Main Artwork (1:1 with Stitch Reference) -->
      <div class="relative z-10 my-auto flex flex-col items-center justify-center px-4 max-w-4xl w-full text-center">
        
        <!-- Desktop Art (Visible on >= 640px) -->
        <div class="hidden sm:block relative w-full max-w-[620px] transition-transform duration-500 hover:scale-[1.015]">
          <div class="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(74,58,47,0.18)] border border-amber-200/70 bg-[#FAF7F2]">
            <img 
              src="./assets/radha_krishna_hero.png" 
              alt="Radhe Sweets - Sweet Moments With Radhe Krishna" 
              class="w-full h-auto object-cover max-h-[460px] mx-auto filter drop-shadow-sm"
              onerror="this.onerror=null; this.src='./assets/festive_banner.png';"
            />
          </div>
        </div>

        <!-- Mobile Art (Visible on < 640px) -->
        <div class="sm:hidden relative w-full max-w-[340px]">
          <div class="rounded-3xl overflow-hidden shadow-[0_20px_45px_-10px_rgba(74,58,47,0.18)] border border-amber-200/70 bg-[#FAF7F2]">
            <img 
              src="./assets/mobile_splash.png" 
              alt="Radhe Sweets - Sweet Moments With Radhe Krishna" 
              class="w-full h-auto max-h-[420px] object-contain mx-auto"
              onerror="this.onerror=null; this.src='./assets/radha_krishna_hero.png';"
            />
          </div>
        </div>

        <!-- Devotional Motto -->
        <p class="font-serif italic text-sm sm:text-base text-amber-950/80 mt-4 tracking-wide font-medium">
          "Sweet Moments With Radhe Krishna"
        </p>
      </div>

      <!-- Bottom Immediate Entry Controls -->
      <div class="relative z-10 w-full max-w-xl pb-7 sm:pb-9 px-6 flex flex-col items-center space-y-3.5">

        <!-- Action Buttons -->
        <div class="flex items-center justify-center gap-3 w-full pt-1">
          <button 
            id="enter-console-btn"
            class="spring-btn flex-1 py-3 px-6 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Enter Store Console</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>

          <button 
            id="enter-pos-from-splash"
            class="spring-btn py-3 px-5 bg-white hover:bg-orange-50/80 text-[var(--brand-primary)] border border-orange-200 font-extrabold text-xs sm:text-sm rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>⚡ POS Billing</span>
          </button>
        </div>

        <p class="text-[10px] text-stone-400 font-semibold tracking-wider uppercase">
          Press Space or Click Anywhere to Enter
        </p>
      </div>
    </div>
  `;
}
