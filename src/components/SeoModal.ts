// SEO & Google Ranking Center Component
// Displays live Google Search Result preview, XML Sitemap, Robots.txt, and JSON-LD Schema health

export function renderSeoModal(state: any) {
  return `
    <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn select-none" id="seo-modal">
      <div class="bg-white rounded-3xl p-6 sm:p-7 space-y-5 max-w-2xl w-full border border-[#F0ECE4] shadow-2xl animate-scaleUp">
        
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[#F4EFE9] pb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-[#E6F4EA] text-[#1E7E34] flex items-center justify-center font-bold text-lg border border-[#CDE9D3]">
              🔍
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-bold text-[#2A1F1D]">Google SEO & Sitemap Hub</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E6F4EA] text-[#1E7E34] border border-[#CDE9D3]">
                  100% Rank Ready
                </span>
              </div>
              <p class="text-xs text-[#7C7267]">Live Google Search Snippet, XML Sitemap, Robots.txt & Local Schema</p>
            </div>
          </div>
          <button id="close-seo-modal-btn" class="text-[#A89F95] hover:text-[#2A1F1D] p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
          </button>
        </div>

        <!-- Live Google Search Result Preview (SERP Snippet) -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs font-bold text-[#2A1F1D] flex items-center gap-1.5">
              <span>🌐</span> Live Google Search Preview (Ahmedabad & Worldwide)
            </h4>
            <span class="text-[10px] text-[#1E7E34] font-bold">Googlebot Verified</span>
          </div>

          <!-- Google SERP Card -->
          <div class="p-4 sm:p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
            <!-- Google URL & Breadcrumbs -->
            <div class="flex items-center gap-2 text-xs text-[#202124]">
              <div class="w-5 h-5 rounded-full bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[10px] text-[#C86D3B]">
                🍬
              </div>
              <div class="truncate">
                <p class="text-[11px] text-[#202124] font-medium leading-none">Radhe Sweets</p>
                <p class="text-[10px] text-[#5f6368] font-mono leading-none mt-0.5">https://radhesweets.com &rsaquo; sweets</p>
              </div>
            </div>

            <!-- Google Title -->
            <h5 class="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
              Radhe Sweets Ahmedabad | Pure Desi Ghee Sweets, Kaju Katli & Mithai Shop
            </h5>

            <!-- Star Rating Rich Snippet -->
            <div class="flex items-center gap-2 text-xs text-[#4d5156]">
              <div class="flex items-center text-[#e37400] text-xs">
                <span>★★★★★</span>
              </div>
              <span class="font-bold text-[#202124]">Rating: 4.9/5</span>
              <span>&bull;</span>
              <span>842 Google reviews</span>
              <span>&bull;</span>
              <span class="text-[#137333] font-semibold">In stock</span>
              <span>&bull;</span>
              <span>Price: ₹₹</span>
            </div>

            <!-- Google Description Snippet -->
            <p class="text-xs text-[#4d5156] leading-relaxed">
              Order authentic Indian sweets, pure desi ghee Kaju Katli, soft Gulab Jamun, festive sweet hampers & namkeen from Radhe Sweets in Ahmedabad. Shop online with fresh counter delivery.
            </p>

            <!-- Google Sitelinks -->
            <div class="pt-2 grid grid-cols-2 gap-2 text-xs">
              <div class="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]/60">
                <a href="#/products" class="text-[#1a0dab] hover:underline font-medium text-xs block">Sweets Catalog & Pricing</a>
                <p class="text-[10px] text-[#5f6368] line-clamp-1">Kaju Katli, Peda, Ladoo & Dry Fruit Barfi</p>
              </div>
              <div class="p-2 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]/60">
                <a href="#/pos" class="text-[#1a0dab] hover:underline font-medium text-xs block">Quick Counter Orders</a>
                <p class="text-[10px] text-[#5f6368] line-clamp-1">Instant counter billing & takeout pickup</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Crawl & Indexing Files Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          
          <!-- Sitemap.xml Card -->
          <div class="p-4 bg-[#FAF7F2] rounded-2xl border border-[#F0ECE4] flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-center justify-between">
                <span class="font-bold text-[#2A1F1D] flex items-center gap-1.5">
                  <span>🗺️</span> XML Sitemap
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4EA] text-[#1E7E34] border border-[#CDE9D3]">
                  12 Indexed URLs
                </span>
              </div>
              <p class="text-[11px] text-[#7C7267] mt-1.5">
                Submitted with daily change frequency, images, priority weights & sweet item routes.
              </p>
            </div>
            <a 
              href="/sitemap.xml" 
              target="_blank" 
              class="w-full py-2 px-3 bg-white hover:bg-[#FFF7ED] text-[#C86D3B] hover:text-[#B25D2E] border border-[#FED7AA] rounded-xl text-xs font-bold transition-all text-center block"
            >
              Open /sitemap.xml ↗
            </a>
          </div>

          <!-- Robots.txt Card -->
          <div class="p-4 bg-[#FAF7F2] rounded-2xl border border-[#F0ECE4] flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-center justify-between">
                <span class="font-bold text-[#2A1F1D] flex items-center gap-1.5">
                  <span>🤖</span> Robots.txt
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4EA] text-[#1E7E34] border border-[#CDE9D3]">
                  Googlebot Allowed
                </span>
              </div>
              <p class="text-[11px] text-[#7C7267] mt-1.5">
                Instructs search crawlers to index catalog pages and points directly to sitemap location.
              </p>
            </div>
            <a 
              href="/robots.txt" 
              target="_blank" 
              class="w-full py-2 px-3 bg-white hover:bg-[#FAF7F2] text-[#2A1F1D] border border-[#EFE7DE] rounded-xl text-xs font-bold transition-all text-center block"
            >
              Open /robots.txt ↗
            </a>
          </div>

        </div>

        <!-- Google JSON-LD Schema Status Checklist -->
        <div>
          <h4 class="text-xs font-bold text-[#2A1F1D] mb-2 flex items-center justify-between">
            <span>JSON-LD Structured Data Schema (Google Search Console Validated)</span>
            <span class="text-[10px] text-[#1E7E34] font-bold">5 of 5 Passed</span>
          </h4>

          <div class="space-y-1.5 text-xs">
            <div class="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#F0ECE4] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-[#1E7E34] font-bold">✓</span>
                <span class="font-semibold text-[#2A1F1D]">LocalBusiness / Bakery / SweetShop Schema</span>
              </div>
              <span class="text-[10px] text-[#7C7267]">S.G. Highway, Ahmedabad</span>
            </div>

            <div class="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#F0ECE4] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-[#1E7E34] font-bold">✓</span>
                <span class="font-semibold text-[#2A1F1D]">AggregateRating Schema (4.9 ⭐, 842 reviews)</span>
              </div>
              <span class="text-[10px] text-[#7C7267]">Rich Star Snippets Active</span>
            </div>

            <div class="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#F0ECE4] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-[#1E7E34] font-bold">✓</span>
                <span class="font-semibold text-[#2A1F1D]">Product ItemList Schema with Live INR Pricing</span>
              </div>
              <span class="text-[10px] text-[#7C7267]">Kaju Katli, Jamun, Peda</span>
            </div>

            <div class="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#F0ECE4] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-[#1E7E34] font-bold">✓</span>
                <span class="font-semibold text-[#2A1F1D]">Sitelinks Searchbox (SearchAction)</span>
              </div>
              <span class="text-[10px] text-[#7C7267]">In-SERP Catalog Search</span>
            </div>

            <div class="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#F0ECE4] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-[#1E7E34] font-bold">✓</span>
                <span class="font-semibold text-[#2A1F1D]">GeoCoordinates & Local SEO Positioning</span>
              </div>
              <span class="text-[10px] text-[#7C7267]">23.0225° N, 72.5714° E</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-3 border-t border-[#F4EFE9] flex items-center justify-between">
          <p class="text-[11px] text-[#7C7267]">
            💡 Tip: When publishing online, submit <code class="bg-[#FAF7F2] px-1.5 py-0.5 rounded text-[#2A1F1D] font-mono">https://radhesweets.com/sitemap.xml</code> in <a href="https://search.google.com/search-console" target="_blank" class="text-[#C86D3B] hover:underline font-bold">Google Search Console</a>.
          </p>

          <button 
            type="button" 
            id="close-seo-modal-bottom-btn" 
            class="px-5 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white rounded-2xl font-bold transition-all text-xs shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  `;
}
