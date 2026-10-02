// Insiders Confidential Guide & Comprehensive ERP Specification
// Accessible exclusively via secret URL route: /insiders or #/insiders
// Supports real-time English ⇄ Gujarati (ગુજરાતી) language switching

export function renderInsidersView(state: any): string {
  const lang = state.insidersLang || 'en';
  const isGuj = lang === 'gu';

  return `
    <div class="space-y-8 select-text max-w-5xl mx-auto py-3 px-1 sm:px-2 animate-fadeIn" data-purpose="insiders-master-guide">
      
      <!-- Top Confectionery Master Header (Warm Royal Theme) -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF3EA] to-[#F4E6D6] border border-amber-200/90 shadow-[0_10px_30px_-10px_rgba(200,109,59,0.12)] p-6 sm:p-8 transition-all">
        <!-- Subtle Decorative Background Glow -->
        <div class="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-amber-400/15 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-orange-400/10 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-2.5 max-w-2xl">
            <!-- Badges Row -->
            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-amber-500/15 text-amber-900 border border-amber-400/40 shadow-2xs">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                🔒 ${isGuj ? 'ગુપ્ત બ્લુપ્રિન્ટ • ફક્ત અધિકૃત સ્ટાફ' : 'Insiders Only • Confidential Blueprint'}
              </span>
              <span class="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold text-stone-500 bg-white/80 border border-amber-200/60 shadow-2xs">
                /insiders
              </span>
              <span class="px-2.5 py-0.5 rounded-lg text-xs font-bold text-amber-800 bg-amber-100/80 border border-amber-300/60 shadow-2xs">
                ${isGuj ? 'શાખા: ' : 'Active Outlet: '} ${state.shopInfo?.name || 'Radhe Sweets'}
              </span>
            </div>

            <!-- Main Heading -->
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2A1F1D] tracking-tight leading-snug">
              ${isGuj ? 'રાધે સ્વીટ્સ ERP અને POS માસ્ટર ગાઇડ' : 'Radhe Sweets ERP & POS Master Blueprint'}
            </h1>
            <p class="text-xs sm:text-sm text-[#7C7267] font-medium leading-relaxed">
              ${isGuj 
                ? 'ક્લાઉડ-કનેક્ટેડ, ૧૦૦% ઑફલાઇન-ફર્સ્ટ મીઠાઈ શોપ મેનેજમેન્ટ ERP અને સુપરફાસ્ટ કાઉન્ટર બિલિંગ સિસ્ટમ.'
                : 'Cloud-connected, offline-first Confectionery Management ERP & High-Speed Point of Sale system designed for traditional Indian sweet shops.'
              }
            </p>
          </div>

          <!-- Language Switcher & Quick Navigation Bar -->
          <div class="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
            
            <!-- Language Switcher Pill -->
            <div class="inline-flex items-center p-1 bg-white rounded-2xl border border-amber-200 shadow-sm">
              <button 
                type="button" 
                data-action="switch-insiders-lang" 
                data-lang="en"
                class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  !isGuj 
                    ? 'bg-[#C86D3B] text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }"
              >
                🇬🇧 English
              </button>
              <button 
                type="button" 
                data-action="switch-insiders-lang" 
                data-lang="gu"
                class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isGuj 
                    ? 'bg-[#C86D3B] text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }"
              >
                🇮🇳 ગુજરાતી
              </button>
            </div>

            <!-- Quick Jump Actions -->
            <div class="flex items-center gap-2">
              <button 
                type="button" 
                data-tab="pos"
                class="px-4 py-2 bg-[#C86D3B] hover:bg-[#b05a2b] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>🛍️</span>
                <span>${isGuj ? 'લાઈવ POS કાઉન્ટર' : 'Live POS Counter'}</span>
              </button>
              <button 
                type="button" 
                data-tab="dashboard"
                class="px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>📊</span>
                <span>${isGuj ? 'ડેશબોર્ડ' : 'Dashboard'}</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      <!-- Section 1: 4 Core Architecture Pillars -->
      <section class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-6">
        <div class="border-b border-[#F4EFE9] pb-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-extrabold text-[#2A1F1D] flex items-center gap-2.5">
              <span>🏛️</span>
              <span>${isGuj ? '૧. સિસ્ટમ આર્કિટેક્ચર અને મુખ્ય સિદ્ધાંતો' : '1. System Architecture & Core Philosophy'}</span>
            </h2>
            <p class="text-xs text-[#7C7267] mt-0.5">
              ${isGuj ? 'ઉચ્ચ સ્પીડ, ઑફલાઇન સદ્ધરતા અને મલ્ટિ-બ્રાન્ચ સુરક્ષા' : 'Zero-lag counter operations, 100% offline resilience & branch isolation'}
            </p>
          </div>
          <span class="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
            ${isGuj ? 'કોર એન્જિન' : 'Core Engine'}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Pillar 1 -->
          <div class="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2 hover:shadow-xs transition-shadow">
            <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center text-lg font-bold">⚡</div>
            <h3 class="font-extrabold text-sm text-amber-950">
              ${isGuj ? 'હાઈ-સ્પીડ બિલિંગ' : 'High-Speed Billing'}
            </h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              ${isGuj 
                ? 'દિવાળી કે તહેવારોની ભીડમાં પણ ઝીરો લેગ. ૧૦૦ ગ્રામથી ૧ કિલોના ક્વિક વજન બટન્સ, શોર્ટકટ્સ અને ઇન્સ્ટન્ટ રેટ ગણતરી.'
                : 'Zero counter lag during festive rushes. Instant weight presets (100g, 250g, 500g, 1kg), dynamic rate math, and keyboard shortcuts.'
              }
            </p>
          </div>

          <!-- Pillar 2 -->
          <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 hover:shadow-xs transition-shadow">
            <div class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-800 flex items-center justify-center text-lg font-bold">📶</div>
            <h3 class="font-extrabold text-sm text-emerald-950">
              ${isGuj ? '૧૦૦% ઑફલાઇન સદ્ધરતા' : '100% Offline-First'}
            </h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              ${isGuj 
                ? 'વાઇફાઇ બંધ થતાં જ બિલિંગ લોકલ સ્ટોરેજમાં ચાલુ રહે છે. નેટ આવતાં જ તમામ બિલો ફાયરસ્ટોરમાં ઑટો-સિંક થાય છે.'
                : 'Wi-Fi drops do not halt billing. Invoices queue in local outbox (radhe_offline_orders_queue) and auto-sync when online.'
              }
            </p>
          </div>

          <!-- Pillar 3 -->
          <div class="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2 hover:shadow-xs transition-shadow">
            <div class="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-800 flex items-center justify-center text-lg font-bold">🏢</div>
            <h3 class="font-extrabold text-sm text-blue-950">
              ${isGuj ? 'મલ્ટિ-બ્રાન્ચ આઇસોલેશન' : 'Multi-Branch Isolation'}
            </h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              ${isGuj 
                ? 'નવરંગપુરા, સેટેલાઇટ અને એસ.જી. હાઇવે બ્રાન્ચના સ્ટોક, વેચાણ, ખર્ચ અને UPI QR સંપૂર્ણપણે અલગ અને સુરક્ષિત.'
                : 'Isolated stock levels, sales audit, expenses, addresses, staff rosters, and UPI VPAs across all physical branches.'
              }
            </p>
          </div>

          <!-- Pillar 4 -->
          <div class="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2 hover:shadow-xs transition-shadow">
            <div class="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-800 flex items-center justify-center text-lg font-bold">👥</div>
            <h3 class="font-extrabold text-sm text-purple-950">
              ${isGuj ? 'સમાન ગ્રાહક સેવા (CRM)' : 'Equal Patron CRM'}
            </h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              ${isGuj 
                ? 'કોઈ ભેદભાવ કે પોઈન્ટ સિસ્ટમ વિના તમામ ગ્રાહકોને એકસમાન આદર. દરેક ગ્રાહકને યુનિક #CUST-XXXX આઈડી અને ઓર્ડર હિસ્ટ્રી.'
                : 'Every patron receives equal royal treatment without points or tier barriers. Dedicated #CUST-XXXX tracking with purchase history.'
              }
            </p>
          </div>
        </div>
      </section>

      <!-- Section 2: Complete Module-by-Module Breakdown -->
      <section class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-6">
        <div class="border-b border-[#F4EFE9] pb-4">
          <h2 class="text-xl font-extrabold text-[#2A1F1D] flex items-center gap-2.5">
            <span>📦</span>
            <span>${isGuj ? '૨. મોડ્યુલ મુજબ તમામ સુવિધાઓની વિગત' : '2. Complete Module-by-Module Feature Breakdown'}</span>
          </h2>
          <p class="text-xs text-[#7C7267] mt-0.5">
            ${isGuj ? 'દુકાનના તમામ ૮ મુખ્ય મોડ્યુલ અને તેમની કાર્યક્ષમતા' : 'Operational overview of all 8 core enterprise modules'}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

          <!-- Module 1 -->
          <div class="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-600 text-white">
                ${isGuj ? 'મોડ્યુલ ૧' : 'Module 1'}
              </span>
              <span class="text-xs font-mono text-stone-500">pos</span>
            </div>
            <h3 class="font-extrabold text-base text-[#2A1F1D] flex items-center gap-2">
              <span>🛍️</span>
              <span>${isGuj ? 'કાઉન્ટર વેચાણ અને POS (Sell / POS Counter)' : 'Sell / POS Counter'}</span>
            </h3>
            <ul class="text-xs text-stone-700 space-y-2 leading-relaxed">
              <li class="flex items-start gap-1.5">
                <span class="text-amber-600 font-bold">•</span>
                <span><strong>${isGuj ? '૧૦૦ અસલ મીઠાઈઓનું લાઈવ કેટલોગ:' : '100 Authentic Mithais:'}</strong> ${isGuj ? 'માવા, કાજુ, બંગાળી, શુદ્ધ ઘી અને ડ્રાય ફ્રૂટ કેટેગરીમાં ત્વરિત સર્ચ.' : 'Instant live search by name or code across traditional categories.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-amber-600 font-bold">•</span>
                <span><strong>${isGuj ? 'હોલ્ડ અને રિકોલ કાર્ટ્સ (⏸️):' : 'Hold & Recall Carts (⏸️):'}</strong> ${isGuj ? 'ગ્રાહક ફોન પર વાત કરતો હોય તો તેનું બિલ પાર્ક કરી બીજા ગ્રાહકનું બિલ બનાવી શકાય છે.' : 'Park active customer carts with auto-tokens and serve waiting customers immediately.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-amber-600 font-bold">•</span>
                <span><strong>${isGuj ? 'ડાયનેમિક UPI QR અને સ્લાઈડ-ટુ-પે:' : 'Dynamic UPI QR & Slide-to-Pay:'}</strong> ${isGuj ? 'બ્રાન્ચના VPA સાથે આપમેળે સ્કેનર ક્યૂઆર અને સેફ ચેકઆઉટ.' : 'Live UPI QR with exact bill amount, cash change calculator & swipe checkout.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-amber-600 font-bold">•</span>
                <span><strong>${isGuj ? 'મોબાઈલ ઝીરો-સ્ક્રોલ બાર:' : 'Mobile Zero-Scroll Bar:'}</strong> ${isGuj ? 'સ્માર્ટફોનમાં નીચે ફ્લોટિંગ ટ્રાન્સલુસન્ટ બાર જે કુલ રકમ અને કાર્ટ દર્શાવે છે.' : 'Translucent floating black bottom bar for quick 1-thumb smartphone cashiering.'}</span>
              </li>
            </ul>
          </div>

          <!-- Module 2 -->
          <div class="p-5 rounded-2xl bg-orange-50/40 border border-orange-200/70 space-y-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-600 text-white">
                ${isGuj ? 'મોડ્યુલ ૨' : 'Module 2'}
              </span>
              <span class="text-xs font-mono text-stone-500">orders</span>
            </div>
            <h3 class="font-extrabold text-base text-[#2A1F1D] flex items-center gap-2">
              <span>📦</span>
              <span>${isGuj ? 'ઓર્ડર્સ અને ઇન્વોઇસ બિલિંગ (Orders & Invoices)' : 'Orders & Invoices'}</span>
            </h3>
            <ul class="text-xs text-stone-700 space-y-2 leading-relaxed">
              <li class="flex items-start gap-1.5">
                <span class="text-orange-600 font-bold">•</span>
                <span><strong>${isGuj ? 'ઓર્ડર ઓડિટ ટ્રેઇલ:' : 'Complete Audit Trail:'}</strong> ${isGuj ? 'તમામ ઇન્વોઇસ નંબર, તારીખ, સમય, ગ્રાહક અને વિગતવાર લિસ્ટ.' : 'Invoice number, branch, customer details, item breakdown, and total.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-orange-600 font-bold">•</span>
                <span><strong>${isGuj ? 'મોબાઈલ સ્વાઇપ એક્શન્સ:' : 'Mobile Swipe Actions:'}</strong> ${isGuj ? 'ડાબી બાજુ સ્વાઇપ કરીને WhatsApp શેર, બિલ જુઓ અથવા સ્ટોક રીસ્ટોર સાથે રદ કરો.' : 'Swipe left for 1-click WhatsApp share, bill preview, or safe invoice voiding with stock restoration.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-orange-600 font-bold">•</span>
                <span><strong>${isGuj ? '૨" અને ૩" થર્મલ પ્રિન્ટિંગ:' : 'Thermal ESC/POS Slips:'}</strong> ${isGuj ? 'FSSAI નંબર, HSN 2106 GST 5% ટેક્સ બ્રેકડાઉન અને UPI QR સાથે બિલ પ્રિન્ટ.' : 'Store logo, FSSAI registration, GST HSN 2106 (2.5% CGST + 2.5% SGST), and QR.'}</span>
              </li>
            </ul>
          </div>

          <!-- Module 3 -->
          <div class="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/70 space-y-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white">
                ${isGuj ? 'મોડ્યુલ ૩' : 'Module 3'}
              </span>
              <span class="text-xs font-mono text-stone-500">customers</span>
            </div>
            <h3 class="font-extrabold text-base text-[#2A1F1D] flex items-center gap-2">
              <span>👥</span>
              <span>${isGuj ? 'ગ્રાહકો અને લગ્ન/બલ્ક એડવાન્સ ઓર્ડર' : 'Customers & Advance Bulk Orders'}</span>
            </h3>
            <ul class="text-xs text-stone-700 space-y-2 leading-relaxed">
              <li class="flex items-start gap-1.5">
                <span class="text-emerald-600 font-bold">•</span>
                <span><strong>${isGuj ? 'ગ્રાહક ડિરેક્ટરી અને પસંદગીઓ:' : 'Patron Directory & Preferences:'}</strong> ${isGuj ? 'મોબાઇલ નંબર, સરનામું અને મીઠાઈની પસંદગી (દા.ત. ઓછી ખાંડ).' : 'Full profile, phone, address, and personalized mithai preferences.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-emerald-600 font-bold">•</span>
                <span><strong>${isGuj ? 'ટોપ ૩ ગ્રાહક પોડિયમ:' : 'Top 3 Patrons Podium:'}</strong> ${isGuj ? 'દુકાનના સૌથી મોટા ગ્રાહકોનું સન્માન અને લિસ્ટિંગ.' : 'Showcase celebrating top lifetime spenders with total spending.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-emerald-600 font-bold">•</span>
                <span><strong>${isGuj ? 'લગ્ન અને બલ્ક ઓર્ડર ટ્રેકિંગ:' : 'Wedding & Corporate Booking:'}</strong> ${isGuj ? 'ડિલિવરી તારીખ, એડવાન્સ જમા રકમ, બાકી રકમ અને ૧-ક્લિક સ્ટેટસ અપડેટ.' : 'Event date, advance paid, balance due, and 1-click status cycling.'}</span>
              </li>
            </ul>
          </div>

          <!-- Module 4 -->
          <div class="p-5 rounded-2xl bg-rose-50/40 border border-rose-200/70 space-y-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">
                ${isGuj ? 'મોડ્યુલ ૪' : 'Module 4'}
              </span>
              <span class="text-xs font-mono text-stone-500">products</span>
            </div>
            <h3 class="font-extrabold text-base text-[#2A1F1D] flex items-center gap-2">
              <span>🍬</span>
              <span>${isGuj ? 'મીઠાઈ કેટલોગ અને લાઈવ સ્ટોક' : 'Sweets Catalog & Stock'}</span>
            </h3>
            <ul class="text-xs text-stone-700 space-y-2 leading-relaxed">
              <li class="flex items-start gap-1.5">
                <span class="text-rose-600 font-bold">•</span>
                <span><strong>${isGuj ? '૧૦૦ પરંપરાગત મીઠાઈઓ:' : '100 Sweets Master:'}</strong> ${isGuj ? 'હાઈ-રેઝોલ્યુશન ફોટો, કિલો દીઠ ભાવ, ન્યૂનતમ સ્ટોક એલર્ટ.' : 'High-res photos, rates per kg, standard units, and safety stock thresholds.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-rose-600 font-bold">•</span>
                <span><strong>${isGuj ? 'ફોટો અપલોડ અને કેમેરા:' : 'Direct Photo & URL Upload:'}</strong> ${isGuj ? 'ડિવાઇસમાંથી સીધો ફોટો અપલોડ (ઓટો કોમ્પ્રેસ) અથવા ઈમેજ લિંક.' : 'Upload photos directly from device camera/storage or paste web image URLs.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-rose-600 font-bold">•</span>
                <span><strong>${isGuj ? 'કાચા માલની ઇનવર્ડ એન્ટ્રી:' : 'Raw Material Inwarding:'}</strong> ${isGuj ? 'શુદ્ધ ઘી, માવો, બદામ, પિસ્તા, કેસર અને ખાંડનો સ્ટોક વધારો.' : '1-click inwarding for Desi Ghee, Mawa, Sugar, Almonds, Pistachios, and Saffron.'}</span>
              </li>
            </ul>
          </div>

          <!-- Module 5 -->
          <div class="p-5 rounded-2xl bg-blue-50/40 border border-blue-200/70 space-y-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white">
                ${isGuj ? 'મોડ્યુલ ૫' : 'Module 5'}
              </span>
              <span class="text-xs font-mono text-stone-500">expenses</span>
            </div>
            <h3 class="font-extrabold text-base text-[#2A1F1D] flex items-center gap-2">
              <span>💸</span>
              <span>${isGuj ? 'દૈનિક ખર્ચ મેનેજમેન્ટ' : 'Daily Expense Management'}</span>
            </h3>
            <ul class="text-xs text-stone-700 space-y-2 leading-relaxed">
              <li class="flex items-start gap-1.5">
                <span class="text-blue-600 font-bold">•</span>
                <span><strong>${isGuj ? 'વર્ગીકૃત ખર્ચ હિસાબ:' : 'Categorized Expenses:'}</strong> ${isGuj ? 'દૂધ/માવો, બોક્સ પેકિંગ, ગેસ/વીજળી, કારીગર મજૂરી અને મેન્ટેનન્સ.' : 'Dairy & Raw Materials, Packaging, Utilities & Fuel, Staff, and Marketing.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-blue-600 font-bold">•</span>
                <span><strong>${isGuj ? 'સમયગાળા મુજબ ફિલ્ટર:' : 'Date Filtering:'}</strong> ${isGuj ? 'આજે, આ અઠવાડિયે, આ મહિને અથવા ચોક્કસ તારીખથી તારીખ સુધી.' : 'Filter by Today, This Week, This Month, or Custom Date Ranges.'}</span>
              </li>
            </ul>
          </div>

          <!-- Module 6 -->
          <div class="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-200/70 space-y-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-600 text-white">
                ${isGuj ? 'મોડ્યુલ ૬' : 'Module 6'}
              </span>
              <span class="text-xs font-mono text-stone-500">analytics</span>
            </div>
            <h3 class="font-extrabold text-base text-[#2A1F1D] flex items-center gap-2">
              <span>📊</span>
              <span>${isGuj ? 'નફો અને નાણાકીય રિપોર્ટ્સ' : 'Profit & Financial Reports'}</span>
            </h3>
            <ul class="text-xs text-stone-700 space-y-2 leading-relaxed">
              <li class="flex items-start gap-1.5">
                <span class="text-indigo-600 font-bold">•</span>
                <span><strong>${isGuj ? 'મુખ્ય સૂચકાંકો (KPIs):' : 'Key Performance Indicators:'}</strong> ${isGuj ? 'કુલ વેચાણ, ચોખ્ખો નફો (Net Margin), સરેરાશ બિલ રકમ (AOV).' : 'Gross Revenue, Net Profit Margin, Average Order Value, and Footfall.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-indigo-600 font-bold">•</span>
                <span><strong>${isGuj ? 'દૈનિક P&L મોડલ અને CSV એક્સપોર્ટ:' : 'Daily P&L & CSV Export:'}</strong> ${isGuj ? 'દરેક દિવસના નફા-નુકસાનની વિગત અને CA ઓડિટ માટે ડેટા ડાઉનલોડ.' : 'Deep-dive daily profit ledger and CSV summary exports for CA accounting.'}</span>
              </li>
            </ul>
          </div>

          <!-- Module 7 -->
          <div class="p-5 rounded-2xl bg-teal-50/40 border border-teal-200/70 space-y-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-600 text-white">
                ${isGuj ? 'મોડ્યુલ ૭' : 'Module 7'}
              </span>
              <span class="text-xs font-mono text-stone-500">staff</span>
            </div>
            <h3 class="font-extrabold text-base text-[#2A1F1D] flex items-center gap-2">
              <span>👨‍🍳</span>
              <span>${isGuj ? 'કારીગર સ્ટાફ અને પગાર રજિસ્ટર' : 'Staff & Payroll Management'}</span>
            </h3>
            <ul class="text-xs text-stone-700 space-y-2 leading-relaxed">
              <li class="flex items-start gap-1.5">
                <span class="text-teal-600 font-bold">•</span>
                <span><strong>${isGuj ? 'કર્મચારી ભૂમિકાઓ:' : 'Tailored Roles:'}</strong> ${isGuj ? 'હેડ હલવાઈ (મુખ્ય કારીગર), કાઉન્ટર કેશિયર, પેકિંગ એક્ઝિક્યુટિવ, મેનેજર.' : 'Head Halwai (Chef), Counter Cashier, Packaging Executive, Store Manager.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-teal-600 font-bold">•</span>
                <span><strong>${isGuj ? 'પગાર અને એડવાન્સ ઉપાડ:' : 'Salary & Advance Logs:'}</strong> ${isGuj ? 'માસિક ફિક્સ પગાર, એડવાન્સ ઉપાડ અને હાજરી/રજા હિસાબ.' : 'Monthly base salary, advance cash tracking, and clock-in/out registers.'}</span>
              </li>
            </ul>
          </div>

          <!-- Module 8 -->
          <div class="p-5 rounded-2xl bg-stone-100 border border-stone-300/70 space-y-3">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-stone-800 text-white">
                ${isGuj ? 'મોડ્યુલ ૮' : 'Module 8'}
              </span>
              <span class="text-xs font-mono text-stone-500">settings</span>
            </div>
            <h3 class="font-extrabold text-base text-[#2A1F1D] flex items-center gap-2">
              <span>⚙️</span>
              <span>${isGuj ? 'મલ્ટિ-બ્રાન્ચ અને સિસ્ટમ સેટિંગ્સ' : 'Multi-Branch & Settings'}</span>
            </h3>
            <ul class="text-xs text-stone-700 space-y-2 leading-relaxed">
              <li class="flex items-start gap-1.5">
                <span class="text-stone-800 font-bold">•</span>
                <span><strong>${isGuj ? 'બ્રાન્ચ મેનેજમેન્ટ:' : 'Branch Switcher & Creator:'}</strong> ${isGuj ? 'નવી બ્રાન્ચ ઉમેરો, એડ્રેસ, ફોન અને કસ્ટમ UPI QR સેટ કરો.' : 'Add or switch branches (Navrangpura, Satellite, SG Highway) with independent VPAs.'}</span>
              </li>
              <li class="flex items-start gap-1.5">
                <span class="text-stone-800 font-bold">•</span>
                <span><strong>${isGuj ? 'પ્રિન્ટર અને ક્લાઉડ સિંક:' : 'Printer & Cloud Backup:'}</strong> ${isGuj ? '૫૮mm/૮૦mm થર્મલ સાઈઝ, FSSAI નંબર, અને ફાયરસ્ટોર ડેટા બેકઅપ.' : 'Paper width (58mm/80mm), FSSAI license header, and JSON cloud restore.'}</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      <!-- Section 3: Daily Operational SOP Timeline -->
      <section class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-6">
        <div class="border-b border-[#F4EFE9] pb-4">
          <h2 class="text-xl font-extrabold text-[#2A1F1D] flex items-center gap-2.5">
            <span>🔄</span>
            <span>${isGuj ? '૩. રોજિંદી દુકાન સંચાલન પ્રક્રિયા (Daily Operational SOP)' : '3. Daily Operational Flow (How to Run the Shop)'}</span>
          </h2>
          <p class="text-xs text-[#7C7267] mt-0.5">
            ${isGuj ? 'સવારથી રાત સુધી દુકાનની પદ્ધતિસરની કાર્યપ્રણાલી' : 'Step-by-step cashier and manager workflow from opening to closing'}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div class="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
            <span class="px-2.5 py-0.5 rounded-lg bg-amber-200 text-amber-950 font-black text-[10px] uppercase tracking-wide">
              ${isGuj ? '૧. સવારની તૈયારી' : '1. Morning Setup'}
            </span>
            <ul class="text-xs text-stone-700 space-y-1.5">
              <li>• ${isGuj ? 'સક્રિય બ્રાન્ચ પસંદ કરો' : 'Switch to active branch'}</li>
              <li>• ${isGuj ? 'લગ્ન ઓર્ડર્સની ડિલિવરી ચેક કરો' : 'Check Advance Wedding Orders'}</li>
              <li>• ${isGuj ? 'કાચો માલ (ઘી/માવો) ઇનવર્ડ કરો' : 'Inward raw materials (Ghee/Mawa)'}</li>
            </ul>
          </div>

          <div class="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-2">
            <span class="px-2.5 py-0.5 rounded-lg bg-orange-200 text-orange-950 font-black text-[10px] uppercase tracking-wide">
              ${isGuj ? '૨. પીક કાઉન્ટર રશ' : '2. Peak Counter Rush'}
            </span>
            <ul class="text-xs text-stone-700 space-y-1.5">
              <li>• ${isGuj ? 'વજન બટન્સથી મીઠાઈ ઉમેરો' : 'Add sweets via weight presets'}</li>
              <li>• ${isGuj ? 'ગ્રાહક થોભે તો Hold Cart કરો' : 'Use "Hold Cart" if customer pauses'}</li>
              <li>• ${isGuj ? 'પાર્ક કરેલ કાર્ટ પાછું બોલાવો' : 'Resume held carts seamlessly'}</li>
              <li>• ${isGuj ? 'UPI QR અથવા કેશ પેમેન્ટ' : 'Instant scan UPI QR / Cash Pay'}</li>
            </ul>
          </div>

          <div class="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <span class="px-2.5 py-0.5 rounded-lg bg-emerald-200 text-emerald-950 font-black text-[10px] uppercase tracking-wide">
              ${isGuj ? '૩. ઑફલાઇન કટોકટી' : '3. Offline Contingency'}
            </span>
            <ul class="text-xs text-stone-700 space-y-1.5">
              <li>• ${isGuj ? 'નેટ બંધ ➔ ૧૦૦% ઑફલાઇન મોડ' : 'Internet drops -> 100% Offline'}</li>
              <li>• ${isGuj ? 'બિલો લોકલ સ્ટોરેજમાં જમા' : 'Bills queue in local outbox'}</li>
              <li>• ${isGuj ? 'નેટ ચાલુ ➔ ફાયરસ્ટોર ઑટો-સિંક' : 'Internet returns -> auto-syncs'}</li>
            </ul>
          </div>

          <div class="p-4 bg-stone-100 border border-stone-300 rounded-2xl space-y-2">
            <span class="px-2.5 py-0.5 rounded-lg bg-stone-300 text-stone-950 font-black text-[10px] uppercase tracking-wide">
              ${isGuj ? '૪. રાત્રિ હિસાબ ક્લોઝિંગ' : '4. Night Closing'}
            </span>
            <ul class="text-xs text-stone-700 space-y-1.5">
              <li>• ${isGuj ? 'દૈનિક પરચુરણ ખર્ચ નોંધો' : 'Log counter petty expenses'}</li>
              <li>• ${isGuj ? 'નફો અને P&L રિપોર્ટ જુઓ' : "Review Day's Profit & P&L"}</li>
              <li>• ${isGuj ? 'આવતીકાલ માટે સ્ટોક ચેક કરો' : 'Check low-stock batch alerts'}</li>
            </ul>
          </div>

        </div>
      </section>

      <!-- Section 4: Technology Stack Summary Table -->
      <section class="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-5">
        <div class="border-b border-[#F4EFE9] pb-4">
          <h2 class="text-xl font-extrabold text-[#2A1F1D] flex items-center gap-2.5">
            <span>⚙️</span>
            <span>${isGuj ? '૪. ટેકનોલોજી સ્ટેક વિગતો' : '4. Technology Stack Summary'}</span>
          </h2>
          <p class="text-xs text-[#7C7267] mt-0.5">
            ${isGuj ? 'સિસ્ટમ પાવર કરતી આધુનિક વેબ અને ક્લાઉડ ટેકનોલોજી' : 'Underlying technology layers powering the Radhe Sweets ERP'}
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border border-stone-200 rounded-2xl overflow-hidden">
            <thead class="bg-stone-50 text-stone-800 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th class="p-3.5 border-b border-stone-200">${isGuj ? 'લેયર (Layer)' : 'Layer'}</th>
                <th class="p-3.5 border-b border-stone-200">${isGuj ? 'ટેકનોલોજી (Tech)' : 'Technology'}</th>
                <th class="p-3.5 border-b border-stone-200">${isGuj ? 'હેતુ અને ઉપયોગ (Purpose)' : 'Purpose in Radhe Sweets'}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 text-stone-700">
              <tr class="hover:bg-amber-50/40">
                <td class="p-3.5 font-bold text-stone-900">${isGuj ? 'ફ્રન્ટએન્ડ ફ્રેમવર્ક' : 'Frontend Framework'}</td>
                <td class="p-3.5 font-mono text-amber-800 font-bold">Vanilla TypeScript + Vite 5</td>
                <td class="p-3.5">${isGuj ? 'ઝીરો ફ્રેમવર્ક ઓવરહેડ, લાઈટનિંગ ફાસ્ટ રેન્ડરિંગ અને ત્વરિત HMR.' : 'Instant HMR, zero framework overhead, lightning fast DOM rendering.'}</td>
              </tr>
              <tr class="hover:bg-amber-50/40">
                <td class="p-3.5 font-bold text-stone-900">${isGuj ? 'સ્ટાઇલિંગ અને UI ટોકન્સ' : 'Styling & UI Tokens'}</td>
                <td class="p-3.5 font-mono text-amber-800 font-bold">Tailwind CSS v4 + Vanilla CSS</td>
                <td class="p-3.5">${isGuj ? 'અસલ કન્ફેક્શનરી કલર્સ (કેસરિયો, ગોલ્ડ, રોસ્ટેડ ચોકલેટ) અને ગ્લાસમોર્ફિઝમ.' : 'Custom warm confectionery palette (terracotta, gold, roasted chocolate), frosted glass.'}</td>
              </tr>
              <tr class="hover:bg-amber-50/40">
                <td class="p-3.5 font-bold text-stone-900">${isGuj ? 'ક્લાઉડ ડેટાબેઝ' : 'Cloud Database'}</td>
                <td class="p-3.5 font-mono text-amber-800 font-bold">Google Cloud Firestore (v12)</td>
                <td class="p-3.5">${isGuj ? 'તમામ બ્રાન્ચ અને ફોન વચ્ચે રિયલ-ટાઇમ મલ્ટિ-ડિવાઇસ ડેટા સિંક.' : 'Real-time multi-device synchronization across store branches and cashier smartphones.'}</td>
              </tr>
              <tr class="hover:bg-amber-50/40">
                <td class="p-3.5 font-bold text-stone-900">${isGuj ? 'ઑફલાઇન એન્જિન' : 'Offline Engine'}</td>
                <td class="p-3.5 font-mono text-amber-800 font-bold">LocalStorage Outbox Queue</td>
                <td class="p-3.5">${isGuj ? '૧૦૦% ઑફલાઇન બિલિંગ અને નેટ કનેક્ટ થતાં આપમેળે ફાયરસ્ટોર અપલોડ.' : '100% offline billing with automatic background sync and retry on reconnect.'}</td>
              </tr>
              <tr class="hover:bg-amber-50/40">
                <td class="p-3.5 font-bold text-stone-900">${isGuj ? 'ડાયનેમિક QR એન્જિન' : 'Dynamic QR Engine'}</td>
                <td class="p-3.5 font-mono text-amber-800 font-bold">qrcode Library</td>
                <td class="p-3.5">${isGuj ? 'દુકાનના VPA અને બિલ રકમ સાથે તાત્કાલિક UPI QR જનરેટ કરે છે.' : 'Generates live merchant dynamic UPI QR codes with branch VPA and bill amount.'}</td>
              </tr>
              <tr class="hover:bg-amber-50/40">
                <td class="p-3.5 font-bold text-stone-900">${isGuj ? 'પ્રિન્ટિંગ એન્જિન' : 'Receipt Engine'}</td>
                <td class="p-3.5 font-mono text-amber-800 font-bold">Browser Print API + HTML Canvas</td>
                <td class="p-3.5">${isGuj ? '૨-ઇંચ અને ૩-ઇંચ થર્મલ સ્લિપ, FSSAI અને GST HSN 2106 ટેક્સ સ્લિપ.' : 'Direct 2-inch and 3-inch thermal ESC/POS slip generation with HSN 2106 tax breakdown.'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Bottom Quick Navigation Footer -->
      <div class="text-center py-4 space-y-2">
        <p class="text-xs text-stone-500">
          ${isGuj 
            ? 'આ ગુપ્ત બ્લુપ્રિન્ટ ફક્ત યુઆરએલમાં <code class="font-mono bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">/insiders</code> ટાઇપ કરવાથી જ જોઈ શકાય છે.' 
            : 'This confidential blueprint is accessible exclusively via <code class="font-mono bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">/insiders</code> or <code class="font-mono bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">#/insiders</code>.'
          }
        </p>
      </div>

    </div>
  `;
}
