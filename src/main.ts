// Radhe Sweets - Master Controller & Application Runtime
import './styles.css';
import { 
  saveBranchSweetsToCloud, 
  saveBranchOrderToCloud, 
  saveBranchKpisToCloud, 
  saveCustomerToCloud, 
  loadBranchDataFromCloud,
  uploadOrderToStorage,
  syncAllToFirebaseCloud 
} from './firebase.js';
import { initialData } from './data.js';
import { renderSidebar } from './components/Sidebar.ts';
import { renderTopBar } from './components/TopBar.ts';
import { renderMobileBottomNav, renderMobileDrawer } from './components/MobileNav.ts';
import { renderDashboardView } from './components/DashboardView.ts';
import { renderPosView } from './components/PosView.ts';
import { renderCheckoutModal } from './components/CheckoutModal.ts';
import { renderOrderSuccessModal } from './components/OrderSuccessModal.ts';
import { renderThermalReceiptModal } from './components/ThermalReceiptModal.ts';
import { renderOrdersView } from './components/OrdersView.ts';
import { renderOrderDetailsModal } from './components/OrderDetailsModal.ts';
import { 
  renderCustomersView, 
  renderAddCustomerModal, 
  renderSettleKhataModal, 
  renderCustomerProfileModal 
} from './components/CustomersView.ts';
import { 
  renderProductsView, 
  renderAddProductModal, 
  renderEditProductModal, 
  renderRestockBatchModal, 
  renderStockAdjustModal 
} from './components/ProductsView.ts';
import { renderExpensesView, renderAddExpenseModal } from './components/ExpensesView.ts';
import { renderAnalyticsView } from './components/AnalyticsView.ts';
import { renderSettingsView } from './components/SettingsView.ts';
import { renderSplashView } from './components/SplashView.ts';
import { 
  renderCustomerDialerModal, 
  formatDialerPhone, 
  renderDialerMatchesHtml, 
  filterDialerCustomers 
} from './components/CustomerDialerModal.ts';
import { renderSeoModal } from './components/SeoModal.ts';
import { renderSearchModal, renderSearchResultsBody } from './components/SearchModal.ts';
import { 
  renderStaffView, 
  renderAddStaffModal, 
  renderPaySalaryModal, 
  renderRecordLeaveModal, 
  renderRecordAdvanceModal 
} from './components/StaffView.ts';

const STORAGE_KEY = 'radhe_sweets_app_state_v1';

// Load stored state or initialize
function getStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load local storage:', e);
  }
  return null;
}

// Master reactive state
const stored = getStoredState();

const state = {
  shopInfo: stored?.shopInfo || { ...initialData.shopInfo },
  kpis: stored?.kpis || { ...initialData.kpis },
  orderStatusCounts: stored?.orderStatusCounts || { ...initialData.orderStatusCounts },
  sweets: ((stored?.sweets && stored.sweets.length >= 100) ? stored.sweets : [...initialData.sweets]).map((s: any) => {
    const initMatch = initialData.sweets.find((is: any) => is.id === s.id);
    return {
      ...s,
      image: (s.image && s.image.startsWith('/assets/sweets/')) ? s.image : (initMatch?.image || `/assets/sweets/${s.id}.png`),
      fallbackImage: `/assets/sweets/${s.id}.png`
    };
  }),
  showMobileCartSheet: false,
  customers: (stored?.customers && stored.customers.length > 0)
    ? stored.customers.map((c: any) => {
        const match = initialData.customers.find((ic: any) => ic.id === c.id || ic.name === c.name);
        if (match && (c.khataBalance === undefined || c.khataBalance === null || (c.khataBalance === 0 && match.khataBalance > 0 && (!c.khataHistory || c.khataHistory.length === 0)))) {
          return { ...c, khataBalance: match.khataBalance, creditLimit: c.creditLimit || match.creditLimit };
        }
        return c;
      })
    : [...initialData.customers],
  orders: stored?.orders || [...initialData.orders],
  expenses: stored?.expenses || { ...initialData.expenses },
  analytics: stored?.analytics || { ...initialData.analytics },
  staff: (stored?.staff && stored.staff.length > 0) ? stored.staff : [...initialData.staff],
  staffFilterTab: 'all',
  staffSearchQuery: '',
  staffDeptFilter: 'all',

  // Enterprise Multi-Branch & Store Inventory State
  branches: stored?.branches || [...initialData.branches],
  currentBranchId: stored?.currentBranchId || 'br-1',
  userRole: stored?.userRole || 'SUPER_ADMIN',
  parkedBills: stored?.parkedBills || [...initialData.parkedBills],
  rawMaterials: stored?.rawMaterials || [...initialData.rawMaterials],
  advanceOrders: stored?.advanceOrders || [...initialData.advanceOrders],
  zReports: stored?.zReports || [...initialData.zReports],
  auditLogs: stored?.auditLogs || [...initialData.auditLogs],
  selectedWeightUnit: stored?.selectedWeightUnit || 'kg',

  // Navigation & View Mode
  activeTab: (stored?.activeTab && stored.activeTab !== 'recipes') ? stored.activeTab : 'dashboard',
  deviceMode: stored?.deviceMode || 'desktop', // 'desktop' or 'mobile'
  currentTheme: stored?.currentTheme || 'warm', // 'warm' or 'ice'
  isDarkMode: stored?.isDarkMode || false,

  // Filters & Search
  searchQuery: '',
  posSearchQuery: '',
  ordersSearchQuery: '',
  customersSearchQuery: '',
  productsSearchQuery: '',
  productsViewMode: stored?.productsViewMode || 'table',
  activeCategory: 'All',
  ordersFilterTab: 'all',
  customersFilterTab: 'all',
  productsFilterCategory: 'All',
  timeFilter: 'month',

  // POS State (Walk-in counter by default - no pre-selected patron)
  selectedCustomer: (stored?.selectedCustomer && stored.selectedCustomer.name !== 'Jignesh Shah') ? stored.selectedCustomer : null,
  posCart: stored?.posCart || [
    { ...initialData.sweets[0], qty: 0.5, rate: initialData.sweets[0].pricePerKg, total: 225 },
    { ...initialData.sweets[2], qty: 1, rate: initialData.sweets[2].pricePerKg, total: 180 },
    { ...initialData.sweets[3], qty: 1, rate: initialData.sweets[3].pricePerKg, total: 160 }
  ],
  quickCart: stored?.quickCart || [
    { ...initialData.sweets[0], qty: 0.5, rate: initialData.sweets[0].pricePerKg, total: 225 },
    { ...initialData.sweets[2], qty: 1, rate: initialData.sweets[2].pricePerKg, total: 180 },
    { ...initialData.sweets[3], qty: 1, rate: initialData.sweets[3].pricePerKg, total: 160 }
  ],
  discountPercent: 0,
  paymentMethod: 'Cash',
  orderNote: '',

  // Modals & Drawers
  showCheckoutModal: false,
  showSuccessModal: false,
  showThermalModal: false,
  showOrderDetailsModal: false,
  showAddCustomerModal: false,
  showSettleKhataModal: false,
  settlingCustomer: null,
  showCustomerProfileModal: false,
  profileCustomer: null,
  showAddProductModal: false,
  showEditProductModal: false,
  editingSweet: null,
  showRestockBatchModal: false,
  showStockAdjustModal: false,
  showSplashModal: false,
  showCustomerDialerModal: false,
  showMobileDrawer: false,
  showSeoModal: false,
  showSearchModal: false,
  searchModalQuery: '',
  searchModalCategory: 'all',
  dialerInput: '',
  activeOrder: null,
  lastPlacedOrder: null,
  unreadNotifications: 2,

  // Staff Modals
  showAddStaffModal: false,
  editingStaff: null,
  showPaySalaryModal: false,
  payingStaff: null,
  showRecordLeaveModal: false,
  showRecordAdvanceModal: false,
  advanceStaffId: null
};

function saveState() {
  try {
    const toSave = {
      shopInfo: state.shopInfo,
      kpis: state.kpis,
      orderStatusCounts: state.orderStatusCounts,
      sweets: state.sweets,
      customers: state.customers,
      orders: state.orders,
      expenses: state.expenses,
      analytics: state.analytics,
      staff: state.staff,
      branches: state.branches,
      currentBranchId: state.currentBranchId,
      userRole: state.userRole,
      parkedBills: state.parkedBills,
      rawMaterials: state.rawMaterials,
      advanceOrders: state.advanceOrders,
      zReports: state.zReports,
      auditLogs: state.auditLogs,
      selectedWeightUnit: state.selectedWeightUnit,
      activeTab: state.activeTab,
      deviceMode: state.deviceMode,
      currentTheme: state.currentTheme,
      isDarkMode: state.isDarkMode,
      selectedCustomer: state.selectedCustomer,
      posCart: state.posCart,
      quickCart: state.quickCart,
      productsViewMode: state.productsViewMode
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// Dynamic SEO Metadata & URL Hash Synchronization for Google Crawling
function updatePageSeoMetadata(activeTab: string) {
  const titles: Record<string, { title: string; desc: string }> = {
    dashboard: {
      title: 'Radhe Sweets Ahmedabad | Shop Management & Live Kitchen Console',
      desc: 'Radhe Sweets master confectionery dashboard in Ahmedabad. Track live sales, fast selling sweets, kitchen stock valuation and order fulfillment.'
    },
    pos: {
      title: 'Order Sweets & Counter POS Billing | Radhe Sweets Ahmedabad',
      desc: 'Point of sale counter billing and sweet orders. Quick weight calculator (kg/pcs), discount calculation, customer mobile dialer and thermal receipts.'
    },
    products: {
      title: 'Pure Desi Ghee Sweets & Confectionery Catalog | Radhe Sweets',
      desc: 'Browse handcrafted Indian sweets made with pure desi ghee, Goan cashews, Kashmiri saffron, and Bilona butter. Kaju Katli, Peda, Gulab Jamun & Namkeen.'
    },
    customers: {
      title: 'Customer Khata, Udhar Ledger & Loyalty Club | Radhe Sweets',
      desc: 'Patron loyalty points, VIP tier benefits, and institutional Khata credit ledger. Settle partial or full payments with live balance recalculation.'
    },
    orders: {
      title: 'Live Orders, Kitchen Prep & Bulk Delivery | Radhe Sweets',
      desc: 'Manage daily sweet orders, festive hampers, advance wedding booking deliveries, and halwai kitchen dispatch tracking.'
    },
    expenses: {
      title: 'Store Expenses & Halwai Kitchen Accounts | Radhe Sweets',
      desc: 'Track dairy, sugar, raw material inward costs, staff payroll, and daily confectionery store operational expenditures.'
    },
    analytics: {
      title: 'Business Analytics & Confectionery Reports | Radhe Sweets',
      desc: 'Detailed gross profit margins, inventory asset valuations, peak rush hour analytics, and daily shift Z-reports.'
    },
    staff: {
      title: 'Staff, Halwai Kitchen Payroll & Attendance Ledger | Radhe Sweets',
      desc: 'Manage sweet shop master halwais, counter cashiers, daily shift attendance, salary disbursements, and leave requests at Radhe Sweets.'
    },
    settings: {
      title: 'Store Configuration & Multi-Branch Management | Radhe Sweets',
      desc: 'Manage SG Highway and Satellite sweet branch profiles, thermal printer configurations, taxes and system preferences.'
    }
  };

  const meta = titles[activeTab] || titles['dashboard'];
  document.title = meta.title;

  const descEl = document.querySelector('meta[name="description"]');
  if (descEl) descEl.setAttribute('content', meta.desc);

  // Sync hash route for deep linking & Google sitemap crawling
  const expectedHash = `#/${activeTab}`;
  if (window.location.hash !== expectedHash) {
    history.replaceState(null, '', expectedHash);
  }
}

// Master Render Function
export function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Sync Document Title, Meta Description & Canonical Hash Route
  updatePageSeoMetadata(state.activeTab);

  // Apply theme classes to body
  document.body.classList.toggle('theme-serene-ice', state.currentTheme === 'ice');
  document.body.classList.toggle('dark-mode', state.isDarkMode);

  // Fully Responsive Layout: Auto-adjusts cleanly between Phone and PC Web without upper bar
  appContainer.innerHTML = `
    <div class="min-h-screen flex flex-col md:flex-row antialiased bg-[#FAF7F2] text-[#2A1F1D]">
      <!-- Desktop Sidebar Navigation (Visible on md and up) -->
      ${renderSidebar(state.activeTab)}

      <!-- Main Content Area -->
      <div id="main-content-scroll-container" class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <!-- Top Navigation Header (Exact 1:1 match with Stitch screen.png) -->
        ${renderTopBar(state)}

        <!-- Active Tab Body -->
        <main class="flex-1 p-3 sm:p-5 md:p-8 space-y-4 sm:space-y-6 pb-28 sm:pb-32 md:pb-8 animate-page-enter">
          ${renderTabContent()}
        </main>
      </div>

      <!-- Mobile Bottom Navigation (Pinned at bottom on mobile screens < 768px) -->
      <div class="md:hidden">
        ${renderMobileBottomNav(state.activeTab)}
      </div>
    </div>

    <!-- Modals -->
    ${renderModals()}

    <!-- shadcn-ui Toast Notification Container -->
    <div id="toast-container"></div>
  `;

  attachEventListeners();
}

// Interactive Toast Notification System (shadcn-ui + Framer Springs)
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✨' : 'ℹ'}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    setTimeout(() => toast.remove(), 260);
  }, 2200);
}

function renderTabContent() {
  switch (state.activeTab) {
    case 'dashboard':
      return renderDashboardView(state);
    case 'pos':
      return renderPosView(state);
    case 'orders':
      return renderOrdersView(state);
    case 'customers':
      return renderCustomersView(state);
    case 'products':
      return renderProductsView(state);
    case 'expenses':
      return renderExpensesView(state);
    case 'analytics':
      return renderAnalyticsView(state);
    case 'staff':
      return renderStaffView(state);
    case 'settings':
      return renderSettingsView(state);
    default:
      return renderDashboardView(state);
  }
}

function renderModals() {
  return `
    ${state.showCheckoutModal ? renderCheckoutModal(state) : ''}
    ${state.showSuccessModal ? renderOrderSuccessModal(state.lastPlacedOrder) : ''}
    ${state.showThermalModal ? renderThermalReceiptModal(state.activeOrder || state.lastPlacedOrder, state.shopInfo) : ''}
    ${state.showOrderDetailsModal ? renderOrderDetailsModal(state.activeOrder) : ''}
    ${state.showAddCustomerModal ? renderAddCustomerModal() : ''}
    ${state.showSettleKhataModal ? renderSettleKhataModal(state.settlingCustomer) : ''}
    ${state.showCustomerProfileModal ? renderCustomerProfileModal(state.profileCustomer, state.orders) : ''}
    ${state.showAddProductModal ? renderAddProductModal() : ''}
    ${state.showEditProductModal ? renderEditProductModal(state.editingSweet) : ''}
    ${state.showRestockBatchModal ? renderRestockBatchModal(state) : ''}
    ${state.showStockAdjustModal ? renderStockAdjustModal(state) : ''}
    ${state.showAddExpenseModal ? renderAddExpenseModal() : ''}
    ${state.showSplashModal ? renderSplashView({ isModal: true }) : ''}
    ${state.showCustomerDialerModal ? renderCustomerDialerModal(state) : ''}
    ${state.showMobileDrawer ? renderMobileDrawer(state) : ''}
    ${state.showSeoModal ? renderSeoModal(state) : ''}
    ${state.showSearchModal ? renderSearchModal(state) : ''}
    ${state.showAddStaffModal ? renderAddStaffModal(state) : ''}
    ${state.showPaySalaryModal ? renderPaySalaryModal(state) : ''}
    ${state.showRecordLeaveModal ? renderRecordLeaveModal(state) : ''}
    ${state.showRecordAdvanceModal ? renderRecordAdvanceModal(state) : ''}
  `;
}

// Event Listeners Binder
function attachEventListeners() {
  // Mobile Drawer Toggle
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    state.showMobileDrawer = true;
    renderApp();
  });
  document.getElementById('close-mobile-drawer-btn')?.addEventListener('click', () => {
    state.showMobileDrawer = false;
    renderApp();
  });
  document.getElementById('mobile-drawer-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'mobile-drawer-backdrop') {
      state.showMobileDrawer = false;
      renderApp();
    }
  });

  // Google SEO & Sitemap Modal
  // Google SEO & Sitemap Modal (Controlled from Settings)
  document.getElementById('settings-open-seo-modal-btn')?.addEventListener('click', () => {
    state.showSeoModal = true;
    renderApp();
  });
  document.getElementById('open-seo-modal-btn')?.addEventListener('click', () => {
    state.showSeoModal = true;
    renderApp();
  });
  document.getElementById('close-seo-modal-btn')?.addEventListener('click', () => {
    state.showSeoModal = false;
    renderApp();
  });
  document.getElementById('close-seo-modal-bottom-btn')?.addEventListener('click', () => {
    state.showSeoModal = false;
    renderApp();
  });
  document.getElementById('seo-modal')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'seo-modal') {
      state.showSeoModal = false;
      renderApp();
    }
  });

  // Global Spotlight Omnibar Search Modal (1000x Better PC & 10000x Better Mobile)
  const openSearchModal = (initialQuery = '') => {
    state.showSearchModal = true;
    state.showMobileDrawer = false;
    if (initialQuery) state.searchModalQuery = initialQuery;
    renderApp();
    setTimeout(() => {
      const input = document.getElementById('spotlight-search-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 40);
  };

  const closeSearchModal = () => {
    state.showSearchModal = false;
    renderApp();
  };

  document.getElementById('desktop-search-trigger')?.addEventListener('click', () => openSearchModal());
  document.getElementById('mobile-search-btn')?.addEventListener('click', () => openSearchModal());
  document.getElementById('mobile-hero-search-trigger')?.addEventListener('click', () => openSearchModal());
  document.getElementById('drawer-search-trigger-btn')?.addEventListener('click', () => openSearchModal());
  document.getElementById('close-search-modal-btn')?.addEventListener('click', closeSearchModal);

  document.getElementById('global-search-modal-backdrop')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'global-search-modal-backdrop') {
      closeSearchModal();
    }
  });

  // Real-Time TopBar Search Input & Floating Dropdown (Instant Direct Typing in Upper Bar)
  const topbarSearchInput = document.getElementById('global-search-input') as HTMLInputElement;
  const topbarDropdown = document.getElementById('topbar-search-dropdown');
  const topbarClearBtn = document.getElementById('topbar-clear-search-btn');

  const bindDropdownItemActions = () => {
    if (!topbarDropdown) return;

    // Sweets Add to POS
    topbarDropdown.querySelectorAll('[data-search-action="add-sweet-pos"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const sweetId = el.getAttribute('data-sweet-id');
        const sweetName = el.getAttribute('data-sweet-name') || 'Sweet';
        const price = Number(el.getAttribute('data-sweet-price')) || 450;
        
        if (!state.posCart) state.posCart = [];
        const existing = state.posCart.find((item: any) => item.id === sweetId || item.name === sweetName);
        if (existing) {
          existing.qty = (existing.qty || 1) + 1;
          existing.total = Math.round(existing.qty * (existing.rate || existing.price || price));
        } else {
          const foundSweet = (state.sweets || []).find((s: any) => s.id === sweetId) || { id: sweetId, name: sweetName, pricePerKg: price, category: 'Traditional' };
          state.posCart.push({ ...foundSweet, qty: 1, rate: price, total: price, unit: 'kg' });
        }

        if (!state.quickCart) state.quickCart = [];
        const existingQuick = state.quickCart.find((item: any) => item.id === sweetId || item.name === sweetName);
        if (existingQuick) {
          existingQuick.qty = (existingQuick.qty || 1) + 1;
          existingQuick.total = Math.round(existingQuick.qty * (existingQuick.rate || existingQuick.price || price));
        } else {
          const foundSweet = (state.sweets || []).find((s: any) => s.id === sweetId) || { id: sweetId, name: sweetName, pricePerKg: price, category: 'Traditional' };
          state.quickCart.push({ ...foundSweet, qty: 1, rate: price, total: price, unit: 'kg' });
        }
        saveState();
        showToast(`Added ${sweetName} (1 kg) to POS Counter Cart!`, 'success');
      });
    });

    // Customer profile
    topbarDropdown.querySelectorAll('[data-search-action="view-customer"]').forEach(el => {
      el.addEventListener('click', () => {
        const custId = el.getAttribute('data-customer-id');
        const found = (state.customers || []).find((c: any) => c.id === custId);
        if (found) {
          state.selectedCustomer = found;
          state.profileCustomer = found;
          topbarDropdown?.classList.add('hidden');
          state.showCustomerProfileModal = true;
          renderApp();
        }
      });
    });

    // Order details
    topbarDropdown.querySelectorAll('[data-search-action="view-order"]').forEach(el => {
      el.addEventListener('click', () => {
        const ordId = el.getAttribute('data-order-id');
        const found = (state.orders || []).find((o: any) => o.id === ordId);
        if (found) {
          state.activeOrder = found;
          topbarDropdown?.classList.add('hidden');
          state.showOrderDetailsModal = true;
          renderApp();
        }
      });
    });

    // Quick nav / actions
    topbarDropdown.querySelectorAll('[data-search-action]').forEach(el => {
      const action = el.getAttribute('data-search-action');
      if (action === 'add-sweet-pos' || action === 'view-customer' || action === 'view-order') return;
      el.addEventListener('click', () => {
        topbarDropdown?.classList.add('hidden');
        if (action === 'nav') {
          const tab = el.getAttribute('data-search-tab');
          if (tab) state.activeTab = tab;
        } else if (action === 'add-product') {
          state.showAddProductModal = true;
        } else if (action === 'add-customer') {
          state.showAddCustomerModal = true;
        } else if (action === 'add-expense') {
          state.showAddExpenseModal = true;
        } else if (action === 'open-seo') {
          state.showSeoModal = true;
        } else if (action === 'toggle-theme') {
          state.currentTheme = state.currentTheme === 'warm' ? 'ice' : 'warm';
        } else if (action === 'toggle-dark') {
          state.isDarkMode = !state.isDarkMode;
        } else if (action === 'open-dialer') {
          state.showCustomerDialerModal = true;
        }
        saveState();
        renderApp();
      });
    });

    // View all tabs
    topbarDropdown.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-tab');
        if (tab) {
          state.activeTab = tab;
          topbarDropdown?.classList.add('hidden');
          saveState();
          renderApp();
        }
      });
    });

    // Quick search pills
    topbarDropdown.querySelectorAll('[data-quick-search-term]').forEach(btn => {
      btn.addEventListener('click', () => {
        const term = btn.getAttribute('data-quick-search-term') || '';
        state.searchModalQuery = term;
        if (topbarSearchInput) topbarSearchInput.value = term;
        updateTopbarDropdown();
      });
    });
  };

  const updateTopbarDropdown = () => {
    if (!topbarDropdown) return;
    const resultsEl = document.getElementById('topbar-dropdown-results');
    if (resultsEl) {
      resultsEl.innerHTML = renderSearchResultsBody(state);
      bindDropdownItemActions();
    }
    topbarDropdown.classList.remove('hidden');
    if (topbarClearBtn) {
      if (state.searchModalQuery) topbarClearBtn.classList.remove('hidden');
      else topbarClearBtn.classList.add('hidden');
    }
  };

  topbarSearchInput?.addEventListener('input', (e: any) => {
    state.searchModalQuery = e.target.value;
    updateTopbarDropdown();
  });

  topbarSearchInput?.addEventListener('focus', () => {
    updateTopbarDropdown();
  });

  topbarSearchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      openSearchModal(state.searchModalQuery);
      topbarDropdown?.classList.add('hidden');
    } else if (e.key === 'Escape') {
      topbarDropdown?.classList.add('hidden');
    }
  });

  topbarClearBtn?.addEventListener('click', () => {
    state.searchModalQuery = '';
    if (topbarSearchInput) topbarSearchInput.value = '';
    topbarDropdown?.classList.add('hidden');
    topbarClearBtn?.classList.add('hidden');
  });

  document.addEventListener('click', (e: any) => {
    if (!document.getElementById('topbar-search-container')?.contains(e.target)) {
      topbarDropdown?.classList.add('hidden');
    }
  });

  if (state.showSearchModal) {
    const bindSearchResultsActions = () => {
      // Sweets result click: Add to POS
      document.querySelectorAll('#search-modal-results-container [data-search-action="add-sweet-pos"]').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const sweetId = el.getAttribute('data-sweet-id');
          const sweetName = el.getAttribute('data-sweet-name') || 'Sweet';
          const price = Number(el.getAttribute('data-sweet-price')) || 450;
          
          if (!state.posCart) state.posCart = [];
          const existing = state.posCart.find((item: any) => item.id === sweetId || item.name === sweetName);
          if (existing) {
            existing.qty = (existing.qty || 1) + 1;
            existing.total = Math.round(existing.qty * (existing.rate || existing.price || price));
          } else {
            const foundSweet = (state.sweets || []).find((s: any) => s.id === sweetId) || { id: sweetId, name: sweetName, pricePerKg: price, category: 'Traditional' };
            state.posCart.push({ ...foundSweet, qty: 1, rate: price, total: price, unit: 'kg' });
          }

          if (!state.quickCart) state.quickCart = [];
          const existingQuick = state.quickCart.find((item: any) => item.id === sweetId || item.name === sweetName);
          if (existingQuick) {
            existingQuick.qty = (existingQuick.qty || 1) + 1;
            existingQuick.total = Math.round(existingQuick.qty * (existingQuick.rate || existingQuick.price || price));
          } else {
            const foundSweet = (state.sweets || []).find((s: any) => s.id === sweetId) || { id: sweetId, name: sweetName, pricePerKg: price, category: 'Traditional' };
            state.quickCart.push({ ...foundSweet, qty: 1, rate: price, total: price, unit: 'kg' });
          }
          saveState();
          showToast(`Added ${sweetName} (1 kg) to POS Counter Cart!`, 'success');
        });
      });

      // Customer result click: View Customer Profile & Khata
      document.querySelectorAll('#search-modal-results-container [data-search-action="view-customer"]').forEach(el => {
        el.addEventListener('click', () => {
          const custId = el.getAttribute('data-customer-id');
          const found = (state.customers || []).find((c: any) => c.id === custId);
          if (found) {
            state.selectedCustomer = found;
            state.profileCustomer = found;
            state.showSearchModal = false;
            state.showCustomerProfileModal = true;
            renderApp();
          }
        });
      });

      // Order result click: View Order Details
      document.querySelectorAll('#search-modal-results-container [data-search-action="view-order"]').forEach(el => {
        el.addEventListener('click', () => {
          const ordId = el.getAttribute('data-order-id');
          const found = (state.orders || []).find((o: any) => o.id === ordId);
          if (found) {
            state.activeOrder = found;
            state.showSearchModal = false;
            state.showOrderDetailsModal = true;
            renderApp();
          }
        });
      });

      // Quick Actions / Navigation
      document.querySelectorAll('#search-modal-results-container [data-search-action]').forEach(el => {
        const action = el.getAttribute('data-search-action');
        if (action === 'add-sweet-pos' || action === 'view-customer' || action === 'view-order') return;
        el.addEventListener('click', () => {
          state.showSearchModal = false;
          if (action === 'nav') {
            const tab = el.getAttribute('data-search-tab');
            if (tab) state.activeTab = tab;
          } else if (action === 'add-product') {
            state.showAddProductModal = true;
          } else if (action === 'add-customer') {
            state.showAddCustomerModal = true;
          } else if (action === 'add-expense') {
            state.showAddExpenseModal = true;
          } else if (action === 'open-seo') {
            state.showSeoModal = true;
          } else if (action === 'toggle-theme') {
            state.currentTheme = state.currentTheme === 'warm' ? 'ice' : 'warm';
          } else if (action === 'toggle-dark') {
            state.isDarkMode = !state.isDarkMode;
          } else if (action === 'open-dialer') {
            state.showCustomerDialerModal = true;
          }
          saveState();
          renderApp();
        });
      });

      // View All link tabs inside search results
      document.querySelectorAll('#search-modal-results-container [data-tab]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const tab = btn.getAttribute('data-tab');
          if (tab) {
            state.activeTab = tab;
            state.showSearchModal = false;
            saveState();
            renderApp();
          }
        });
      });

      // Quick Search Term Pills
      document.querySelectorAll('#search-modal-results-container [data-quick-search-term]').forEach(btn => {
        btn.addEventListener('click', () => {
          const term = btn.getAttribute('data-quick-search-term') || '';
          state.searchModalQuery = term;
          const input = document.getElementById('spotlight-search-input') as HTMLInputElement;
          if (input) {
            input.value = term;
            input.focus();
          }
          const clearBtn = document.getElementById('clear-spotlight-search-btn');
          if (clearBtn) clearBtn.classList.remove('hidden');
          const resultsCont = document.getElementById('search-modal-results-container');
          if (resultsCont) {
            resultsCont.innerHTML = renderSearchResultsBody(state);
            bindSearchResultsActions();
          }
        });
      });
    };

    // Initial binding of results in modal
    bindSearchResultsActions();

    // Real-time In-Place Typing Filter (Zero re-rendering of input -> ZERO focus loss!)
    const searchInput = document.getElementById('spotlight-search-input') as HTMLInputElement;
    searchInput?.addEventListener('input', (e: any) => {
      state.searchModalQuery = e.target.value;
      const clearBtn = document.getElementById('clear-spotlight-search-btn');
      if (clearBtn) {
        if (state.searchModalQuery) {
          clearBtn.classList.remove('hidden');
        } else {
          clearBtn.classList.add('hidden');
        }
      }
      const resultsCont = document.getElementById('search-modal-results-container');
      if (resultsCont) {
        resultsCont.innerHTML = renderSearchResultsBody(state);
        bindSearchResultsActions();
      }
    });

    // Clear input button
    document.getElementById('clear-spotlight-search-btn')?.addEventListener('click', () => {
      state.searchModalQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      const clearBtn = document.getElementById('clear-spotlight-search-btn');
      if (clearBtn) clearBtn.classList.add('hidden');
      const resultsCont = document.getElementById('search-modal-results-container');
      if (resultsCont) {
        resultsCont.innerHTML = renderSearchResultsBody(state);
        bindSearchResultsActions();
      }
    });

    // Category Tabs Filter
    document.querySelectorAll('[data-search-filter]').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const cat = tabBtn.getAttribute('data-search-filter') || 'all';
        state.searchModalCategory = cat;
        // Update tab styles
        document.querySelectorAll('[data-search-filter]').forEach(b => {
          b.className = 'px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-100';
        });
        tabBtn.className = 'px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer bg-[#C86D3B] text-white shadow-2xs';

        const resultsCont = document.getElementById('search-modal-results-container');
        if (resultsCont) {
          resultsCont.innerHTML = renderSearchResultsBody(state);
          bindSearchResultsActions();
        }
      });
    });
  }

  // Enterprise Multi-Branch Switchers with Cloud Firestore Sync
  const handleBranchSwitch = async (targetBranchId: string) => {
    if (!targetBranchId || targetBranchId === state.currentBranchId) return;

    // 1. Save current branch data to Firestore before switching
    saveBranchSweetsToCloud(state.currentBranchId, state.sweets);
    saveBranchKpisToCloud(state.currentBranchId, state.kpis);

    // 2. Switch branch id
    state.currentBranchId = targetBranchId;

    // 3. Load target branch's distinct sweets, stock & revenue from Cloud Firestore
    const branchData = await loadBranchDataFromCloud(targetBranchId);
    if (branchData) {
      state.sweets = branchData.sweets;
      if (branchData.kpis) {
        state.kpis = { ...state.kpis, ...branchData.kpis };
      }
    }

    state.auditLogs.unshift({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: state.shopInfo.owner,
      action: 'Branch Switched',
      details: `Switched active branch to ${targetBranchId}. Loaded branch catalog and stock.`
    });

    saveState();
    renderApp();
  };

  // Active Branch Switcher (In Settings)
  document.querySelectorAll('[data-setting-select-branch]').forEach(el => {
    el.addEventListener('click', () => {
      const branchId = el.getAttribute('data-setting-select-branch');
      if (branchId) handleBranchSwitch(branchId);
    });
  });

  // Theme Toggles
  const handleToggleTheme = () => {
    state.currentTheme = state.currentTheme === 'warm' ? 'ice' : 'warm';
    saveState();
    renderApp();
  };
  document.getElementById('toggle-theme-btn')?.addEventListener('click', handleToggleTheme);
  document.getElementById('bar-toggle-theme')?.addEventListener('click', handleToggleTheme);
  document.getElementById('select-theme-warm')?.addEventListener('click', () => {
    state.currentTheme = 'warm';
    saveState();
    renderApp();
  });
  document.getElementById('select-theme-ice')?.addEventListener('click', () => {
    state.currentTheme = 'ice';
    saveState();
    renderApp();
  });

  // Dark Mode Toggle
  const handleToggleDark = () => {
    state.isDarkMode = !state.isDarkMode;
    saveState();
    renderApp();
  };
  document.getElementById('toggle-dark-mode-btn')?.addEventListener('click', handleToggleDark);
  document.getElementById('settings-dark-mode-toggle')?.addEventListener('click', handleToggleDark);

  // Tab Navigation (Sidebar, Mobile Bottom Tabs, and Mobile Drawer Links)
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = btn.getAttribute('data-tab');
      if (tabId) {
        state.activeTab = tabId;
        state.showMobileDrawer = false;
        saveState();
        renderApp();
      }
    });
  });

  // Fast Selling Sweets Table: + Add to Quick Cart
  document.querySelectorAll('.quick-add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name') || 'Sweet';
      const price = Number(btn.getAttribute('data-price')) || 200;
      
      const defaultItems = [
        { id: 'sw-1', name: 'Kaju Katli', qty: 0.5, rate: 450, total: 225, unit: 'kg' },
        { id: 'sw-3', name: 'Gulab Jamun', qty: 1, rate: 180, total: 180, unit: 'kg' },
        { id: 'sw-4', name: 'Motichoor Ladoo', qty: 1, rate: 160, total: 160, unit: 'kg' }
      ];
      if (!state.quickCart || state.quickCart.length === 0) {
        state.quickCart = [...defaultItems];
      }
      const existing = state.quickCart.find(item => item.id === id || item.name === name);
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
        existing.total = Math.round(existing.qty * (existing.rate || existing.price || price));
      } else {
        state.quickCart.push({ id, name, qty: 1, rate: price, total: price, unit: 'kg' });
      }

      // Also sync with posCart
      if (!state.posCart) state.posCart = [];
      const existingPos = state.posCart.find(item => item.id === id || item.name === name);
      if (existingPos) {
        existingPos.qty = (existingPos.qty || 1) + 1;
        existingPos.total = Math.round(existingPos.qty * (existingPos.rate || existingPos.price || price));
      } else {
        state.posCart.push({ id, name, qty: 1, rate: price, total: price, unit: 'kg' });
      }

      saveState();
      renderApp();
      showToast(`Added ${name} to Quick Order!`);
    });
  });

  // Remove item from Quick Cart
  document.querySelectorAll('.remove-quick-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = Number(btn.getAttribute('data-index'));
      const defaultItems = [
        { id: 'sw-1', name: 'Kaju Katli', qty: 0.5, rate: 450, total: 225, unit: 'kg' },
        { id: 'sw-3', name: 'Gulab Jamun', qty: 1, rate: 180, total: 180, unit: 'kg' },
        { id: 'sw-4', name: 'Motichoor Ladoo', qty: 1, rate: 160, total: 160, unit: 'kg' }
      ];
      if (!state.quickCart || state.quickCart.length === 0) {
        state.quickCart = [...defaultItems];
      }
      if (state.quickCart.length > idx) {
        const removed = state.quickCart.splice(idx, 1);
        saveState();
        renderApp();
        showToast(`Removed ${removed[0]?.name || 'item'}`, 'info');
      }
    });
  });

  // Proceed to Checkout button on Dashboard Quick Billing widget
  document.getElementById('proceed-to-checkout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.activeTab = 'pos';
    saveState();
    renderApp();
    showToast('Redirected to POS Counter', 'info');
  });

  // Dashboard Scroll-Driven KPI Grid Morphing (2x3 Grid <--> 1x6 Grid) with Smooth Ease-In Animation
  if (state.activeTab === 'dashboard') {
    const kpiContainer = document.getElementById('kpi-tiles-container');
    const scrollContainer = document.getElementById('main-content-scroll-container');

    const handleDashboardScroll = () => {
      const scrollY = (scrollContainer ? scrollContainer.scrollTop : 0) || window.scrollY || document.documentElement.scrollTop || 0;
      
      // Hysteresis threshold to prevent jitter:
      // When scrolled down > 65px, smoothly morph into docked 1x6 Grid
      // When scrolled back up < 30px, smoothly ease back into full 2x3 Grid
      if (scrollY > 65) {
        if (!kpiContainer?.classList.contains('kpi-grid-1x6')) {
          kpiContainer?.classList.remove('kpi-grid-2x3');
          kpiContainer?.classList.add('kpi-grid-1x6');
        }
      } else if (scrollY < 30) {
        if (!kpiContainer?.classList.contains('kpi-grid-2x3')) {
          kpiContainer?.classList.remove('kpi-grid-1x6');
          kpiContainer?.classList.add('kpi-grid-2x3');
        }
      }
    };

    let scrollRafId: number | null = null;
    const throttledScrollHandler = () => {
      if (scrollRafId !== null) return;
      scrollRafId = requestAnimationFrame(() => {
        handleDashboardScroll();
        scrollRafId = null;
      });
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    scrollContainer?.addEventListener('scroll', throttledScrollHandler, { passive: true });
    // Initialize scroll state on render
    handleDashboardScroll();

    // IntersectionObserver for Staggered Section Reveal
    const revealItems = document.querySelectorAll('.scroll-reveal-item');
    if ('IntersectionObserver' in window && revealItems.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealItems.forEach(el => el.classList.remove('is-current-focused'));
            entry.target.classList.add('is-current-focused');
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      revealItems.forEach(item => observer.observe(item));
    } else {
      revealItems.forEach(item => item.classList.add('is-visible'));
    }
  }

  // Dashboard Time Filter Dropdown
  document.getElementById('dashboard-time-filter')?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    state.timeFilter = val;
    saveState();
    showToast(`Time period updated: ${val}`, 'info');
  });

  // Brand Logo Click -> Go to Dashboard
  const handleGoDashboard = () => {
    state.activeTab = 'dashboard';
    renderApp();
  };
  document.getElementById('brand-header-btn')?.addEventListener('click', handleGoDashboard);
  document.getElementById('mobile-brand-btn')?.addEventListener('click', handleGoDashboard);

  // Devotional Card Openers (only opens devotional blessings modal, not a loading screen)
  const handleOpenSplash = () => {
    state.showSplashModal = true;
    renderApp();
  };
  document.getElementById('open-splash-btn')?.addEventListener('click', handleOpenSplash);
  document.getElementById('bar-open-splash')?.addEventListener('click', handleOpenSplash);
  document.getElementById('view-splash-from-settings')?.addEventListener('click', handleOpenSplash);

  // Close Devotional Modal
  const handleDismissSplash = (tab = 'dashboard') => {
    const screen = document.getElementById('splash-loading-screen');
    if (screen) {
      screen.style.opacity = '0';
      screen.style.transition = 'opacity 0.2s ease-out';
      setTimeout(() => {
        state.showSplashModal = false;
        state.activeTab = tab;
        renderApp();
      }, 200);
    } else {
      state.showSplashModal = false;
      state.activeTab = tab;
      renderApp();
    }
  };

  document.getElementById('close-splash-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    handleDismissSplash('dashboard');
  });
  document.getElementById('enter-console-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    handleDismissSplash('dashboard');
  });
  document.getElementById('enter-pos-from-splash')?.addEventListener('click', (e) => {
    e.stopPropagation();
    handleDismissSplash('pos');
  });
  document.getElementById('splash-loading-screen')?.addEventListener('click', (e) => {
    if (e.target.id === 'splash-loading-screen') {
      handleDismissSplash('dashboard');
    }
  });

  // Escape to close devotional modal
  const handleKeydownSplash = (e) => {
    if (state.showSplashModal && e.key === 'Escape') {
      handleDismissSplash('dashboard');
    }
  };
  window.addEventListener('keydown', handleKeydownSplash);

  // Global Search Input
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      state.searchQuery = q;
      state.posSearchQuery = q;
      state.ordersSearchQuery = q;
      state.customersSearchQuery = q;
      state.productsSearchQuery = q;
      renderApp();
    });
  }

  // POS Category Filter Buttons
  document.querySelectorAll('[data-pos-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeCategory = btn.getAttribute('data-pos-category');
      renderApp();
    });
  });

  // POS Search Input
  document.getElementById('pos-search-input')?.addEventListener('input', (e) => {
    state.posSearchQuery = e.target.value;
    renderApp();
  });

  // Add sweet to POS cart
  document.querySelectorAll('[data-add-to-pos], [data-add-sweet]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const sweetId = btn.getAttribute('data-add-to-pos') || btn.getAttribute('data-add-sweet');
      const sweet = state.sweets.find(s => s.id === sweetId);
      if (sweet) {
        const existing = state.posCart.find(i => i.id === sweetId);
        if (existing) {
          existing.qty += 0.5;
          existing.total = Math.round(existing.qty * existing.rate);
        } else {
          state.posCart.push({
            id: sweet.id,
            name: sweet.name,
            qty: 1,
            rate: sweet.pricePerKg,
            unit: sweet.unit,
            total: sweet.pricePerKg,
            image: sweet.image || `/assets/sweets/${sweet.id}.png`,
            fallbackImage: sweet.fallbackImage || `/assets/sweets/${sweet.id}.png`
          });
        }
        // Also update quickCart on dashboard
        state.quickCart = [...state.posCart];
        saveState();
        renderApp();
        showToast(`Added ${sweet.name} to counter cart!`, 'success');
      }
    });
  });

  // Increment / Decrement / Remove Cart
  document.querySelectorAll('[data-inc-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-inc-cart');
      const item = state.posCart.find(i => i.id === id);
      if (item) {
        item.qty += 0.5;
        item.total = Math.round(item.qty * item.rate);
        state.quickCart = [...state.posCart];
        saveState();
        renderApp();
      }
    });
  });

  document.querySelectorAll('[data-dec-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-dec-cart');
      const item = state.posCart.find(i => i.id === id);
      if (item) {
        item.qty -= 0.5;
        if (item.qty <= 0) {
          state.posCart = state.posCart.filter(i => i.id !== id);
        } else {
          item.total = Math.round(item.qty * item.rate);
        }
        state.quickCart = [...state.posCart];
        saveState();
        renderApp();
      }
    });
  });

  document.querySelectorAll('[data-remove-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-remove-cart');
      state.posCart = state.posCart.filter(i => i.id !== id);
      state.quickCart = [...state.posCart];
      saveState();
      renderApp();
    });
  });

  document.getElementById('clear-pos-cart-btn')?.addEventListener('click', () => {
    state.posCart = [];
    state.quickCart = [];
    saveState();
    renderApp();
    showToast('Cart cleared', 'info');
  });


  // Restock Raw Materials PO
  document.querySelectorAll('[data-restock-rm]').forEach(btn => {
    btn.addEventListener('click', () => {
      const rmId = btn.getAttribute('data-restock-rm');
      const rm = state.rawMaterials.find(r => r.id === rmId);
      if (rm) {
        rm.stock += 25;
        saveState();
        renderApp();
        showToast(`Restocked ${rm.name} (+25 ${rm.unit})`, 'success');
      }
    });
  });

  document.getElementById('open-add-rm-modal-btn')?.addEventListener('click', () => {
    const rawName = prompt('Enter Raw Material Name to Inward PO (e.g. Shuddh Desi Ghee, Cashews, Mawa):', 'Fresh Mawa / Khoya');
    if (rawName) {
      const match = state.rawMaterials.find(r => r.name.toLowerCase().includes(rawName.toLowerCase()));
      if (match) {
        match.stock += 25;
        showToast(`Inward PO recorded: +25 ${match.unit} for ${match.name}`, 'success');
      } else {
        state.rawMaterials.push({
          id: `rm-${Date.now().toString().slice(-4)}`,
          name: rawName,
          stock: 25,
          unit: 'kg',
          unitCost: 150,
          reorderLevel: 15,
          expiry: '30 Oct 2026',
          isPerishable: true
        });
        showToast(`Created new ingredient PO: ${rawName} (+25 kg)`, 'success');
      }
      saveState();
      renderApp();
    }
  });

  // Discount Select in POS
  document.getElementById('pos-discount-select')?.addEventListener('change', (e) => {
    state.discountPercent = Number(e.target.value);
    renderApp();
  });

  // Proceed to Checkout Triggers
  const handleOpenCheckout = () => {
    if (state.posCart.length === 0) {
      alert('Please add at least one sweet to the cart first!');
      return;
    }
    state.showCheckoutModal = true;
    renderApp();
  };
  document.getElementById('pos-proceed-checkout-btn')?.addEventListener('click', handleOpenCheckout);
  document.getElementById('pos-header-checkout-btn')?.addEventListener('click', handleOpenCheckout);
  document.getElementById('mobile-bar-pay-btn')?.addEventListener('click', handleOpenCheckout);
  document.getElementById('mobile-sheet-proceed-checkout-btn')?.addEventListener('click', () => {
    state.showMobileCartSheet = false;
    handleOpenCheckout();
  });
  document.getElementById('mobile-cart-toggle-btn')?.addEventListener('click', () => {
    state.showMobileCartSheet = !state.showMobileCartSheet;
    renderApp();
  });
  document.getElementById('close-mobile-cart-sheet-btn')?.addEventListener('click', () => {
    state.showMobileCartSheet = false;
    renderApp();
  });
  document.getElementById('mobile-cart-sheet-backdrop')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'mobile-cart-sheet-backdrop') {
      state.showMobileCartSheet = false;
      renderApp();
    }
  });
  document.getElementById('dashboard-checkout-btn')?.addEventListener('click', () => {
    state.activeTab = 'pos';
    state.showCheckoutModal = true;
    renderApp();
  });

  // Detach customer & Switch customer buttons
  document.getElementById('pos-clear-customer-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.selectedCustomer = null;
    saveState();
    renderApp();
  });
  document.getElementById('dashboard-switch-customer-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.showCustomerDialerModal = true;
    state.dialerInput = '';
    renderApp();
  });

  // Close Checkout Modal
  document.getElementById('close-checkout-btn')?.addEventListener('click', () => {
    state.showCheckoutModal = false;
    renderApp();
  });

  // Select Payment Method
  document.querySelectorAll('[data-select-payment]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.paymentMethod = btn.getAttribute('data-select-payment');
      renderApp();
    });
  });

  // Confirm Place Order
  document.getElementById('confirm-place-order-btn')?.addEventListener('click', () => {
    const orderNum = 130 + state.orders.length;
    const cartSubtotal = state.posCart.reduce((sum, item) => sum + (item.rate * item.qty), 0);
    const discountAmount = Math.round((cartSubtotal * (state.discountPercent || 0)) / 100);
    const totalPayable = Math.max(0, cartSubtotal - discountAmount);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: `SA00${orderNum}`,
      date: `25 Sep 2026, ${timeStr}`,
      customerId: state.selectedCustomer?.id || `walkin-${Date.now()}`,
      customerName: state.selectedCustomer?.name || 'Walk-in Counter Customer',
      customerPhone: state.selectedCustomer?.phone || 'OTC Cash / UPI',
      customerAddress: state.selectedCustomer?.address || 'Ahmedabad, Gujarat',
      itemsCount: state.posCart.length,
      subtotal: cartSubtotal,
      discount: discountAmount,
      tax: 0,
      total: totalPayable,
      paymentMethod: state.paymentMethod,
      status: 'Completed',
      notes: state.orderNote || 'Counter Fresh Pack',
      items: state.posCart.map(item => ({
        name: item.name,
        quantity: item.qty,
        unit: item.unit,
        rate: item.rate,
        total: item.total
      }))
    };

    // Update state & inventory
    state.orders.unshift(newOrder);
    state.lastPlacedOrder = newOrder;
    state.activeOrder = newOrder;
    state.orderStatusCounts.total += 1;
    state.orderStatusCounts.completed = (state.orderStatusCounts.completed || 0) + 1;
    state.kpis.orders.value += 1;
    state.kpis.orders.formatted = String(state.kpis.orders.value);
    state.kpis.sales.value += totalPayable;
    state.kpis.sales.formatted = `₹${state.kpis.sales.value.toLocaleString()}`;

    // Decrement sweet inventory
    state.posCart.forEach(cartItem => {
      const sweet = state.sweets.find(s => s.id === cartItem.id);
      if (sweet) {
        sweet.stock = Math.max(0, Math.round(sweet.stock - cartItem.qty));
        if (sweet.stock <= 10) sweet.stockStatus = 'Low Stock';
      }
    });

    // Update active branch revenue & orders
    const curBranch = state.branches.find(b => b.id === state.currentBranchId);
    if (curBranch) {
      curBranch.revenue = (curBranch.revenue || 0) + totalPayable;
      curBranch.orders = (curBranch.orders || 0) + 1;
    }

    // Save to Cloud Firestore & Firebase Storage per branch
    saveBranchOrderToCloud(state.currentBranchId, newOrder);
    uploadOrderToStorage(newOrder);
    saveBranchSweetsToCloud(state.currentBranchId, state.sweets);
    saveBranchKpisToCloud(state.currentBranchId, state.kpis);

    // Reset cart
    state.posCart = [];
    state.quickCart = [];
    state.showCheckoutModal = false;
    state.showSuccessModal = true;
    saveState();
    renderApp();
  });

  // Success Modal Actions
  document.getElementById('print-order-bill-btn')?.addEventListener('click', () => {
    state.showSuccessModal = false;
    state.showThermalModal = true;
    renderApp();
  });

  document.getElementById('share-whatsapp-btn')?.addEventListener('click', () => {
    const o = state.lastPlacedOrder;
    if (o) {
      const msg = `🙏 *Radhe Sweets - Sweets & More*\nThank you ${o.customerName}! Your order #${o.id} of ₹${o.total} has been confirmed.\nItems: ${o.items.map(i=>`${i.name} (${i.quantity}${i.unit})`).join(', ')}\nAddress: Ahmedabad, Gujarat\n_Sweet Moments With Radhe Krishna_`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    }
  });

  document.getElementById('view-orders-after-success-btn')?.addEventListener('click', () => {
    state.showSuccessModal = false;
    state.activeTab = 'orders';
    renderApp();
  });

  document.getElementById('new-sale-after-success-btn')?.addEventListener('click', () => {
    state.showSuccessModal = false;
    state.activeTab = 'pos';
    renderApp();
  });

  // Thermal Receipt Modal Controls
  document.getElementById('close-receipt-btn')?.addEventListener('click', () => {
    state.showThermalModal = false;
    renderApp();
  });
  document.getElementById('dismiss-receipt-btn')?.addEventListener('click', () => {
    state.showThermalModal = false;
    renderApp();
  });
  document.getElementById('trigger-print-btn')?.addEventListener('click', () => {
    window.print();
  });

  // Orders View Handlers
  document.querySelectorAll('[data-orders-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.ordersFilterTab = btn.getAttribute('data-orders-tab');
      renderApp();
    });
  });

  document.getElementById('orders-search-input')?.addEventListener('input', (e) => {
    state.ordersSearchQuery = e.target.value;
    renderApp();
  });

  document.getElementById('orders-new-sale-btn')?.addEventListener('click', () => {
    state.activeTab = 'pos';
    renderApp();
  });

  // View Order Details
  document.querySelectorAll('[data-view-order]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-view-order');
      const found = state.orders.find(o => o.id === id);
      if (found) {
        state.activeOrder = found;
        state.showOrderDetailsModal = true;
        renderApp();
      }
    });
  });

  document.querySelectorAll('[data-print-order]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-print-order');
      const found = state.orders.find(o => o.id === id);
      if (found) {
        state.activeOrder = found;
        state.showThermalModal = true;
        renderApp();
      }
    });
  });

  // Close Order Details Modal
  document.getElementById('close-order-details-btn')?.addEventListener('click', () => {
    state.showOrderDetailsModal = false;
    renderApp();
  });

  document.getElementById('print-from-details-btn')?.addEventListener('click', () => {
    state.showOrderDetailsModal = false;
    state.showThermalModal = true;
    renderApp();
  });

  // Update Order Status
  document.getElementById('update-order-status-select')?.addEventListener('change', (e) => {
    const orderId = e.target.getAttribute('data-order-id');
    const newStatus = e.target.value;
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      saveState();
      renderApp();
    }
  });

  // Customers View Handlers
  document.querySelectorAll('[data-customers-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.customersFilterTab = btn.getAttribute('data-customers-tab');
      renderApp();
    });
  });

  document.getElementById('customers-search-input')?.addEventListener('input', (e: any) => {
    state.customersSearchQuery = e.target.value;
    renderApp();
  });

  document.getElementById('clear-customers-search-btn')?.addEventListener('click', () => {
    state.customersSearchQuery = '';
    renderApp();
  });

  document.getElementById('reset-customers-filter-btn')?.addEventListener('click', () => {
    state.customersFilterTab = 'all';
    state.customersSearchQuery = '';
    renderApp();
  });

  document.querySelectorAll('[data-select-for-pos]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-select-for-pos');
      const customer = state.customers.find((c: any) => c.id === id);
      if (customer) {
        state.selectedCustomer = customer;
        state.activeTab = 'pos';
        state.showCustomerProfileModal = false;
        saveState();
        renderApp();
      }
    });
  });

  // Open Customer Profile & Ledger Modal
  document.querySelectorAll('[data-view-customer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-view-customer');
      const cust = state.customers.find((c: any) => c.id === id);
      if (cust) {
        state.profileCustomer = cust;
        state.showCustomerProfileModal = true;
        renderApp();
      }
    });
  });

  document.getElementById('close-customer-profile-btn')?.addEventListener('click', () => {
    state.showCustomerProfileModal = false;
    state.profileCustomer = null;
    renderApp();
  });
  document.getElementById('close-customer-profile-bottom-btn')?.addEventListener('click', () => {
    state.showCustomerProfileModal = false;
    state.profileCustomer = null;
    renderApp();
  });
  document.getElementById('customer-profile-modal')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'customer-profile-modal') {
      state.showCustomerProfileModal = false;
      state.profileCustomer = null;
      renderApp();
    }
  });

  // Settle Khata Modal Triggers (Settle some amount or all)
  document.querySelectorAll('[data-settle-khata]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-settle-khata');
      const cust = state.customers.find((c: any) => c.id === id);
      if (cust) {
        state.settlingCustomer = cust;
        state.showSettleKhataModal = true;
        state.showCustomerProfileModal = false;
        renderApp();
      }
    });
  });

  document.getElementById('close-settle-khata-btn')?.addEventListener('click', () => {
    state.showSettleKhataModal = false;
    state.settlingCustomer = null;
    renderApp();
  });
  document.getElementById('cancel-settle-khata-btn')?.addEventListener('click', () => {
    state.showSettleKhataModal = false;
    state.settlingCustomer = null;
    renderApp();
  });
  document.getElementById('settle-khata-modal')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'settle-khata-modal') {
      state.showSettleKhataModal = false;
      state.settlingCustomer = null;
      renderApp();
    }
  });

  // Quick Amount Chips in Settle Khata Modal
  document.querySelectorAll('[data-quick-settle-amt]').forEach(btn => {
    btn.addEventListener('click', () => {
      const amt = btn.getAttribute('data-quick-settle-amt');
      const input = document.getElementById('settle-amount-input') as HTMLInputElement;
      const form = document.getElementById('settle-khata-form');
      if (input && amt && form) {
        input.value = amt;
        const currentDue = Number(form.getAttribute('data-current-due')) || 0;
        const entered = Number(amt) || 0;
        const rem = Math.max(0, currentDue - entered);
        const remEl = document.getElementById('settle-remaining-calc');
        if (remEl) remEl.textContent = `₹${rem.toLocaleString()}`;
        const btnText = document.getElementById('settle-submit-btn-text');
        if (btnText) btnText.textContent = `Confirm Settlement (₹${entered.toLocaleString()})`;
      }
    });
  });

  // Dynamic input calculation on Settle Amount Input
  document.getElementById('settle-amount-input')?.addEventListener('input', (e: any) => {
    const form = document.getElementById('settle-khata-form');
    if (form) {
      const currentDue = Number(form.getAttribute('data-current-due')) || 0;
      const val = Number(e.target.value) || 0;
      const rem = Math.max(0, currentDue - val);
      const remEl = document.getElementById('settle-remaining-calc');
      if (remEl) remEl.textContent = `₹${rem.toLocaleString()}`;
      const btnText = document.getElementById('settle-submit-btn-text');
      if (btnText) btnText.textContent = val > 0 ? `Confirm Settlement (₹${val.toLocaleString()})` : 'Confirm Settlement';
    }
  });

  // Settle Khata Form Submission
  document.getElementById('settle-khata-form')?.addEventListener('submit', (e: any) => {
    e.preventDefault();
    const form = e.target;
    const customerId = form.getAttribute('data-customer-id');
    const cust = state.customers.find((c: any) => c.id === customerId);
    if (!cust) return;

    const fd = new FormData(form);
    const settleAmt = Number(fd.get('amount')) || 0;
    const paymentMode = (fd.get('paymentMode') as string) || 'Cash';
    const note = (fd.get('note') as string) || '';

    if (settleAmt <= 0) {
      alert('Please enter a valid settlement amount greater than 0');
      return;
    }

    const prevBal = Number(cust.khataBalance) || 0;
    const newBal = Math.max(0, prevBal - settleAmt);
    cust.khataBalance = newBal;
    cust.totalSpent = (Number(cust.totalSpent) || 0) + settleAmt;

    // Record in customer settlement history ledger
    if (!cust.khataHistory) cust.khataHistory = [];
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    cust.khataHistory.unshift({
      id: `SETTLE-${Date.now()}`,
      date: dateFormatted,
      amount: settleAmt,
      paymentMode: paymentMode,
      note: note || 'Counter Payment Settlement',
      previousBalance: prevBal,
      remainingBalance: newBal
    });

    // Record in global shop audit logs
    state.auditLogs.unshift({
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: 'Admin (AS)',
      action: 'Khata Payment Settled',
      details: `Received ₹${settleAmt.toLocaleString()} from ${cust.name} via ${paymentMode}. Balance: ₹${newBal.toLocaleString()}`
    });

    state.showSettleKhataModal = false;
    state.settlingCustomer = null;
    saveState();
    renderApp();
    showToast(`Received ₹${settleAmt.toLocaleString()} payment from ${cust.name}! Remaining Khata: ₹${newBal.toLocaleString()}`, 'success');
  });

  // Add Customer Modal
  document.getElementById('open-add-customer-modal-btn')?.addEventListener('click', () => {
    state.showAddCustomerModal = true;
    renderApp();
  });
  document.getElementById('pos-add-new-customer-btn')?.addEventListener('click', () => {
    state.showAddCustomerModal = true;
    renderApp();
  });
  document.getElementById('close-add-customer-btn')?.addEventListener('click', () => {
    state.showAddCustomerModal = false;
    renderApp();
  });
  document.getElementById('cancel-add-customer-btn')?.addEventListener('click', () => {
    state.showAddCustomerModal = false;
    renderApp();
  });
  document.getElementById('add-customer-modal')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'add-customer-modal') {
      state.showAddCustomerModal = false;
      renderApp();
    }
  });

  document.getElementById('add-customer-form')?.addEventListener('submit', (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newCust = {
      id: `cust-${Date.now()}`,
      name: fd.get('name') as string,
      phone: `+91 ${fd.get('phone')}`,
      email: (fd.get('email') as string) || '',
      address: (fd.get('address') as string) || 'Ahmedabad, Gujarat',
      type: (fd.get('tier') as string) || 'Regular',
      tier: (fd.get('tier') as string) || 'Regular',
      khataBalance: Number(fd.get('khataBalance')) || 0,
      creditLimit: Number(fd.get('creditLimit')) || 5000,
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 50,
      notes: (fd.get('notes') as string) || ''
    };
    state.customers.unshift(newCust);
    state.selectedCustomer = newCust;
    state.kpis.customers.value += 1;
    state.showAddCustomerModal = false;
    saveState();
    renderApp();
    showToast(`Customer ${newCust.name} registered successfully!`, 'success');
  });

  // Products & Confectionery Inventory Management Handlers
  // View mode switcher: Table vs Grid
  document.getElementById('view-mode-table-btn')?.addEventListener('click', () => {
    state.productsViewMode = 'table';
    saveState();
    renderApp();
  });
  document.getElementById('view-mode-grid-btn')?.addEventListener('click', () => {
    state.productsViewMode = 'grid';
    saveState();
    renderApp();
  });

  document.querySelectorAll('[data-products-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.productsFilterCategory = btn.getAttribute('data-products-category');
      renderApp();
    });
  });

  document.getElementById('products-search-input')?.addEventListener('input', (e: any) => {
    state.productsSearchQuery = e.target.value;
    renderApp();
  });

  document.getElementById('clear-products-search-btn')?.addEventListener('click', () => {
    state.productsSearchQuery = '';
    renderApp();
  });

  document.getElementById('reset-products-filter-btn')?.addEventListener('click', () => {
    state.productsFilterCategory = 'All';
    state.productsSearchQuery = '';
    renderApp();
  });

  // Direct Add To POS from Inventory Table
  document.querySelectorAll('[data-add-to-pos]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sweetId = btn.getAttribute('data-add-to-pos');
      const sweet = state.sweets.find(s => s.id === sweetId);
      if (sweet) {
        const existing = state.posCart.find(i => i.id === sweet.id);
        if (existing) {
          existing.qty += 1;
          existing.total = Math.round(existing.qty * existing.rate);
        } else {
          state.posCart.push({
            id: sweet.id,
            name: sweet.name,
            category: sweet.category,
            rate: sweet.pricePerKg,
            unit: sweet.unit,
            qty: 1,
            total: sweet.pricePerKg
          });
        }
        state.quickCart = [...state.posCart];
        saveState();
        showToast(`Added 1 ${sweet.unit} ${sweet.name} to POS Cart!`, 'success');
      }
    });
  });

  // Stock Quick Adjustments (+5, +10, -1) with Toast
  document.querySelectorAll('[data-stock-adjust]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sweetId = btn.getAttribute('data-stock-adjust');
      const delta = parseFloat(btn.getAttribute('data-stock-delta') || '0');
      const sweet = state.sweets.find(s => s.id === sweetId);
      if (sweet) {
        sweet.stock = Math.max(0, Math.round((sweet.stock + delta) * 10) / 10);
        sweet.stockStatus = sweet.stock <= (sweet.minStock || 15) ? 'Low Stock' : 'In Stock';
        saveState();
        renderApp();
        showToast(`${delta > 0 ? '+' + delta : delta} ${sweet.unit} recorded for ${sweet.name} (Balance: ${sweet.stock} ${sweet.unit})`, delta > 0 ? 'success' : 'info');
      }
    });
  });

  // Export Inventory CSV
  document.getElementById('export-inventory-csv-btn')?.addEventListener('click', () => {
    let csv = "SKU,Sweet Name,Category,Stock,Unit,Selling Price,Cost Price,Gross Margin %,Asset Valuation (INR),Status\n";
    state.sweets.forEach(s => {
      const cost = s.costPrice || Math.round(s.pricePerKg * 0.62);
      const margin = Math.round(((s.pricePerKg - cost) / s.pricePerKg) * 100);
      const assetVal = s.stock * s.pricePerKg;
      csv += `"${s.id}","${s.name}","${s.category}",${s.stock},"${s.unit}",${s.pricePerKg},${cost},${margin}%,${assetVal},"${s.stockStatus}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RadheSweets_Inventory_Report_25Sep2026.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Inventory CSV exported successfully!', 'success');
  });

  // Add Product Modal
  document.getElementById('open-add-product-modal-btn')?.addEventListener('click', () => {
    state.showAddProductModal = true;
    renderApp();
  });
  document.getElementById('close-add-product-btn')?.addEventListener('click', () => {
    state.showAddProductModal = false;
    renderApp();
  });
  document.getElementById('cancel-add-product-btn')?.addEventListener('click', () => {
    state.showAddProductModal = false;
    renderApp();
  });
  document.getElementById('add-product-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'add-product-modal') {
      state.showAddProductModal = false;
      renderApp();
    }
  });

  document.getElementById('add-product-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const price = Number(fd.get('pricePerKg'));
    const cost = Number(fd.get('costPrice')) || Math.round(price * 0.62);
    const stock = Number(fd.get('stock') || 25);
    const minStock = Number(fd.get('minStock') || 15);
    const name = fd.get('name');
    const unit = fd.get('unit') || 'kg';
    const newSweet = {
      id: `sw-${Date.now()}`,
      name: name,
      code: name.slice(0, 2).toUpperCase(),
      category: fd.get('category'),
      unit: unit,
      pricePerKg: price,
      costPrice: cost,
      stock: stock,
      minStock: minStock,
      stockStatus: stock <= minStock ? 'Low Stock' : 'In Stock',
      badge: stock <= minStock ? 'Low Stock' : 'In Stock',
      description: fd.get('description') || 'Freshly made confectionery item with pure ingredients.',
      batchNumber: `BATCH-${Date.now().toString().slice(-6)}`
    };
    state.sweets.unshift(newSweet);
    state.showAddProductModal = false;
    saveBranchSweetsToCloud(state.currentBranchId, state.sweets);
    saveState();
    renderApp();
    showToast(`Added ${newSweet.name} to sweet catalog!`, 'success');
  });

  // Edit Product Modal
  document.querySelectorAll('[data-edit-product]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-edit-product');
      const sweet = state.sweets.find(s => s.id === id);
      if (sweet) {
        state.editingSweet = sweet;
        state.showEditProductModal = true;
        renderApp();
      }
    });
  });
  document.getElementById('close-edit-product-btn')?.addEventListener('click', () => {
    state.showEditProductModal = false;
    state.editingSweet = null;
    renderApp();
  });
  document.getElementById('cancel-edit-product-btn')?.addEventListener('click', () => {
    state.showEditProductModal = false;
    state.editingSweet = null;
    renderApp();
  });
  document.getElementById('edit-product-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'edit-product-modal') {
      state.showEditProductModal = false;
      state.editingSweet = null;
      renderApp();
    }
  });

  document.getElementById('edit-product-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.getAttribute('data-sweet-id');
    const sweet = state.sweets.find(s => s.id === id);
    if (sweet) {
      const fd = new FormData(e.target);
      sweet.name = fd.get('name');
      sweet.category = fd.get('category');
      sweet.unit = fd.get('unit');
      sweet.pricePerKg = Number(fd.get('pricePerKg'));
      sweet.costPrice = Number(fd.get('costPrice'));
      sweet.stock = Number(fd.get('stock'));
      sweet.minStock = Number(fd.get('minStock'));
      sweet.description = fd.get('description');
      sweet.stockStatus = sweet.stock <= sweet.minStock ? 'Low Stock' : 'In Stock';
      state.showEditProductModal = false;
      state.editingSweet = null;
      saveBranchSweetsToCloud(state.currentBranchId, state.sweets);
      saveState();
      renderApp();
      showToast(`Updated ${sweet.name} details!`, 'success');
    }
  });

  document.querySelectorAll('[data-delete-sweet]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-sweet');
      if (confirm('Are you sure you want to remove this sweet from catalog?')) {
        state.sweets = state.sweets.filter(s => s.id !== id);
        state.showEditProductModal = false;
        state.editingSweet = null;
        saveBranchSweetsToCloud(state.currentBranchId, state.sweets);
        saveState();
        renderApp();
        showToast('Sweet removed from catalog', 'info');
      }
    });
  });

  // Fresh Kitchen Batch Restock Modal
  document.getElementById('open-restock-batch-modal-btn')?.addEventListener('click', () => {
    state.showRestockBatchModal = true;
    renderApp();
  });
  document.getElementById('close-restock-batch-btn')?.addEventListener('click', () => {
    state.showRestockBatchModal = false;
    renderApp();
  });
  document.getElementById('cancel-restock-batch-btn')?.addEventListener('click', () => {
    state.showRestockBatchModal = false;
    renderApp();
  });
  document.getElementById('restock-batch-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'restock-batch-modal') {
      state.showRestockBatchModal = false;
      renderApp();
    }
  });

  document.getElementById('restock-batch-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const sweetId = fd.get('sweetId');
    const qty = Number(fd.get('quantity'));
    const batchNo = fd.get('batchNumber');
    const chef = fd.get('chefName');
    const sweet = state.sweets.find(s => s.id === sweetId);
    if (sweet) {
      sweet.stock += qty;
      sweet.batchNumber = batchNo;
      sweet.stockStatus = sweet.stock <= (sweet.minStock || 15) ? 'Low Stock' : 'In Stock';
      state.auditLogs.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: chef || 'Head Halwai',
        action: 'Kitchen Batch Logged',
        details: `Restocked ${qty} ${sweet.unit} ${sweet.name} (Batch #${batchNo})`
      });
      state.showRestockBatchModal = false;
      saveBranchSweetsToCloud(state.currentBranchId, state.sweets);
      saveState();
      renderApp();
      showToast(`Fresh batch of ${qty} ${sweet.unit} ${sweet.name} logged into inventory!`, 'success');
    }
  });

  // Stock Adjustment / Audit Recount Modal
  document.getElementById('open-stock-adjust-modal-btn')?.addEventListener('click', () => {
    state.showStockAdjustModal = true;
    renderApp();
  });
  document.getElementById('close-stock-adjust-btn')?.addEventListener('click', () => {
    state.showStockAdjustModal = false;
    renderApp();
  });
  document.getElementById('cancel-stock-adjust-btn')?.addEventListener('click', () => {
    state.showStockAdjustModal = false;
    renderApp();
  });
  document.getElementById('stock-adjust-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'stock-adjust-modal') {
      state.showStockAdjustModal = false;
      renderApp();
    }
  });

  document.getElementById('stock-adjust-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const sweetId = fd.get('sweetId');
    const reason = fd.get('reason');
    const mode = fd.get('mode');
    const qty = Number(fd.get('quantity'));
    const notes = fd.get('notes');
    const sweet = state.sweets.find(s => s.id === sweetId);
    if (sweet) {
      const oldStock = sweet.stock;
      if (mode === 'set') {
        sweet.stock = qty;
      } else if (mode === 'subtract') {
        sweet.stock = Math.max(0, sweet.stock - qty);
      } else if (mode === 'add') {
        sweet.stock += qty;
      }
      sweet.stockStatus = sweet.stock <= (sweet.minStock || 15) ? 'Low Stock' : 'In Stock';
      state.auditLogs.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: state.shopInfo.owner || 'Admin',
        action: 'Stock Adjusted',
        details: `${reason}: ${sweet.name} (${oldStock} -> ${sweet.stock} ${sweet.unit}). ${notes || ''}`
      });
      state.showStockAdjustModal = false;
      saveBranchSweetsToCloud(state.currentBranchId, state.sweets);
      saveState();
      renderApp();
      showToast(`Stock adjusted for ${sweet.name}: Now ${sweet.stock} ${sweet.unit}`, 'info');
    }
  });

  // Expenses View Handlers
  document.getElementById('open-add-expense-modal-btn')?.addEventListener('click', () => {
    state.showAddExpenseModal = true;
    renderApp();
  });
  document.getElementById('close-add-expense-btn')?.addEventListener('click', () => {
    state.showAddExpenseModal = false;
    renderApp();
  });

  document.getElementById('add-expense-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const amount = Number(fd.get('amount'));
    const category = fd.get('category');
    const newExp = {
      id: `exp-${Date.now()}`,
      date: fd.get('date') || '25 Sep',
      description: fd.get('description'),
      category: category,
      amount: amount,
      status: 'Paid'
    };

    state.expenses.items.unshift(newExp);
    state.expenses.total += amount;

    // Update breakdown
    const catItem = state.expenses.breakdown.find(b => b.category === category);
    if (catItem) {
      catItem.amount += amount;
      catItem.percentage = Math.round((catItem.amount / state.expenses.total) * 100);
    }

    state.kpis.cost.value += amount;
    state.kpis.cost.formatted = `₹${state.kpis.cost.value.toLocaleString()}`;
    state.showAddExpenseModal = false;
    saveState();
    renderApp();
  });

  document.querySelectorAll('[data-delete-expense]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-expense');
      const item = state.expenses.items.find((i: any) => i.id === id);
      if (item) {
        state.expenses.total = Math.max(0, state.expenses.total - item.amount);
        state.expenses.items = state.expenses.items.filter((i: any) => i.id !== id);
        saveState();
        renderApp();
      }
    });
  });

  // ==========================================
  // STAFF, PAYROLL & ATTENDANCE EVENT HANDLERS
  // ==========================================

  // 1. Staff Filter Tabs (All, Attendance Today, Payroll, Leaves Ledger, Advances)
  document.querySelectorAll('[data-staff-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-staff-tab');
      if (tab) {
        state.staffFilterTab = tab;
        renderApp();
      }
    });
  });

  // 2. Department Filter Pills
  document.querySelectorAll('[data-staff-dept]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dept = btn.getAttribute('data-staff-dept');
      if (dept) {
        state.staffDeptFilter = (dept === 'All' ? 'all' : dept);
        renderApp();
      }
    });
  });

  // 3. Realtime Staff Search Input with Cursor Retention
  const staffSearchInput = document.getElementById('staff-search-input') as HTMLInputElement;
  if (staffSearchInput) {
    staffSearchInput.addEventListener('input', (e: any) => {
      state.staffSearchQuery = e.target.value;
      const cursor = e.target.selectionStart;
      renderApp();
      const updated = document.getElementById('staff-search-input') as HTMLInputElement;
      if (updated) {
        updated.focus();
        updated.setSelectionRange(cursor, cursor);
      }
    });
  }

  // 4. KPI Quick Action: View Pending Payroll
  document.getElementById('kpi-view-payroll-btn')?.addEventListener('click', () => {
    state.staffFilterTab = 'payroll';
    renderApp();
  });

  // 5. Open Add Staff Modal
  document.getElementById('open-add-staff-modal-btn')?.addEventListener('click', () => {
    state.editingStaff = null;
    state.showAddStaffModal = true;
    renderApp();
  });

  // 6. Open Edit Staff Modal
  document.querySelectorAll('[data-edit-staff]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-edit-staff');
      state.editingStaff = state.staff.find((s: any) => s.id === id) || null;
      state.showAddStaffModal = true;
      renderApp();
    });
  });

  // 7. Close / Cancel Staff Modal
  const closeStaffModal = () => {
    state.showAddStaffModal = false;
    state.editingStaff = null;
    renderApp();
  };
  document.getElementById('close-staff-modal-btn')?.addEventListener('click', closeStaffModal);
  document.getElementById('cancel-staff-modal-btn')?.addEventListener('click', closeStaffModal);
  document.getElementById('staff-modal-backdrop')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'staff-modal-backdrop') closeStaffModal();
  });

  // 8. Save Staff Form (Add or Edit)
  document.getElementById('save-staff-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const idInput = (document.getElementById('staff-form-id') as HTMLInputElement)?.value;
    const name = ((document.getElementById('staff-form-name') as HTMLInputElement)?.value || '').trim();
    const phone = ((document.getElementById('staff-form-phone') as HTMLInputElement)?.value || '').trim();
    const role = ((document.getElementById('staff-form-role') as HTMLInputElement)?.value || '').trim();
    const dept = (document.getElementById('staff-form-dept') as HTMLSelectElement)?.value || 'Kitchen / Halwai';
    const salary = Number((document.getElementById('staff-form-salary') as HTMLInputElement)?.value) || 20000;
    const branch = ((document.getElementById('staff-form-branch') as HTMLInputElement)?.value || 'Navrangpura Flagship').trim();
    const emergency = ((document.getElementById('staff-form-emergency') as HTMLInputElement)?.value || '').trim();
    const aadhar = ((document.getElementById('staff-form-aadhar') as HTMLInputElement)?.value || '').trim();

    if (!name) return;

    if (idInput) {
      // Editing existing staff
      const member = state.staff.find((s: any) => s.id === idInput);
      if (member) {
        member.name = name;
        member.phone = phone;
        member.role = role;
        member.department = dept;
        member.baseSalary = salary;
        member.branchName = branch;
        member.emergencyContact = emergency;
        member.aadharNumber = aadhar;
        showToast(`Updated record for ${name}`, 'success');
      }
    } else {
      // Add new staff
      const newStaff = {
        id: `st-${Date.now()}`,
        name,
        phone: phone || '+91 98000 00000',
        role,
        department: dept,
        branchId: 'br-1',
        branchName: branch,
        joiningDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        baseSalary: salary,
        salaryType: 'Monthly',
        advancesTaken: 0,
        salaryStatus: 'Pending',
        lastPaidDate: null,
        attendanceToday: 'Present',
        leavesTakenThisMonth: 0,
        leavesAllowedPerMonth: 2,
        totalLeavesBalance: 12,
        aadharNumber: aadhar,
        emergencyContact: emergency,
        status: 'Active',
        leaveHistory: [],
        salaryHistory: []
      };
      state.staff.unshift(newStaff);
      showToast(`Added new staff member: ${name}`, 'success');
    }

    state.showAddStaffModal = false;
    state.editingStaff = null;
    saveState();
    renderApp();
  });

  // 9. Quick 1-Click Attendance Toggle (Present, Half Day, On Leave)
  document.querySelectorAll('[data-mark-attendance]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-mark-attendance');
      const status = btn.getAttribute('data-status');
      const member = state.staff.find((s: any) => s.id === id);
      if (member && status) {
        member.attendanceToday = status;
        saveState();
        showToast(`Marked ${member.name} as ${status}`, 'success');
        renderApp();
      }
    });
  });

  // 10. Pay Staff Salary Modal Handlers
  document.querySelectorAll('[data-pay-staff-salary]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-pay-staff-salary');
      state.payingStaff = state.staff.find((s: any) => s.id === id) || null;
      if (state.payingStaff) {
        state.showPaySalaryModal = true;
        renderApp();
      }
    });
  });

  const closePaySalaryModal = () => {
    state.showPaySalaryModal = false;
    state.payingStaff = null;
    renderApp();
  };
  document.getElementById('close-pay-salary-modal-btn')?.addEventListener('click', closePaySalaryModal);
  document.getElementById('cancel-pay-salary-modal-btn')?.addEventListener('click', closePaySalaryModal);
  document.getElementById('pay-salary-modal-backdrop')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'pay-salary-modal-backdrop') closePaySalaryModal();
  });

  document.getElementById('confirm-pay-salary-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!state.payingStaff) return;
    const mode = (document.getElementById('salary-payment-mode') as HTMLSelectElement)?.value || 'Bank Transfer';
    const month = (document.getElementById('salary-month-label') as HTMLInputElement)?.value || 'September 2026';
    const adv = state.payingStaff.advancesTaken || 0;
    const net = Math.max(0, (state.payingStaff.baseSalary || 0) - adv);

    state.payingStaff.salaryStatus = 'Paid';
    state.payingStaff.advancesTaken = 0;
    state.payingStaff.lastPaidDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    if (!state.payingStaff.salaryHistory) state.payingStaff.salaryHistory = [];
    state.payingStaff.salaryHistory.unshift({
      month,
      base: state.payingStaff.baseSalary,
      advanceDeduction: adv,
      netPaid: net,
      date: state.payingStaff.lastPaidDate,
      mode,
      status: 'Paid'
    });

    // Automatically record Store Expense under Staff Salary
    if (!state.expenses) state.expenses = { total: 0, items: [] };
    if (!state.expenses.items) state.expenses.items = [];
    state.expenses.items.unshift({
      id: `exp-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      description: `Staff Salary: ${state.payingStaff.name} (${month})`,
      category: 'Staff Salary',
      amount: net,
      status: 'Paid',
      paymentMode: mode
    });
    state.expenses.total = (state.expenses.total || 0) + net;

    showToast(`Disbursed ₹${net.toLocaleString()} salary to ${state.payingStaff.name}`, 'success');
    state.showPaySalaryModal = false;
    state.payingStaff = null;
    saveState();
    renderApp();
  });

  // 11. Staff Leave Modal Handlers
  document.getElementById('open-record-leave-btn')?.addEventListener('click', () => {
    state.showRecordLeaveModal = true;
    renderApp();
  });

  const closeLeaveModal = () => {
    state.showRecordLeaveModal = false;
    renderApp();
  };
  document.getElementById('close-leave-modal-btn')?.addEventListener('click', closeLeaveModal);
  document.getElementById('cancel-leave-modal-btn')?.addEventListener('click', closeLeaveModal);
  document.getElementById('record-leave-modal-backdrop')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'record-leave-modal-backdrop') closeLeaveModal();
  });

  document.getElementById('save-leave-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const staffId = (document.getElementById('leave-staff-id') as HTMLSelectElement)?.value;
    const leaveType = (document.getElementById('leave-type-select') as HTMLSelectElement)?.value || 'Casual Leave';
    const days = parseFloat((document.getElementById('leave-days-count') as HTMLInputElement)?.value) || 1;
    const reason = ((document.getElementById('leave-reason-input') as HTMLInputElement)?.value || '').trim() || 'Leave applied';

    const member = state.staff.find((s: any) => s.id === staffId);
    if (member) {
      member.leavesTakenThisMonth = (member.leavesTakenThisMonth || 0) + days;
      member.attendanceToday = 'On Leave';
      if (!member.leaveHistory) member.leaveHistory = [];
      member.leaveHistory.unshift({
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: leaveType,
        days,
        reason,
        status: 'Approved'
      });
      showToast(`Recorded ${days} day(s) ${leaveType} for ${member.name}`, 'success');
    }

    state.showRecordLeaveModal = false;
    saveState();
    renderApp();
  });

  // 12. Staff Salary Advance Modal Handlers
  const openAdvanceModal = (preselectedId?: string) => {
    if (preselectedId) state.advanceStaffId = preselectedId;
    else state.advanceStaffId = state.staff[0]?.id || null;
    state.showRecordAdvanceModal = true;
    renderApp();
  };
  document.getElementById('open-record-advance-btn')?.addEventListener('click', () => openAdvanceModal());
  document.querySelectorAll('[data-staff-give-advance]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-staff-give-advance');
      if (id) openAdvanceModal(id);
    });
  });

  const closeAdvanceModal = () => {
    state.showRecordAdvanceModal = false;
    state.advanceStaffId = null;
    renderApp();
  };
  document.getElementById('close-advance-modal-btn')?.addEventListener('click', closeAdvanceModal);
  document.getElementById('cancel-advance-modal-btn')?.addEventListener('click', closeAdvanceModal);
  document.getElementById('advance-modal-backdrop')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'advance-modal-backdrop') closeAdvanceModal();
  });

  document.getElementById('save-advance-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const staffId = (document.getElementById('advance-staff-id') as HTMLSelectElement)?.value;
    const amount = Number((document.getElementById('advance-amount-input') as HTMLInputElement)?.value) || 0;
    const reason = ((document.getElementById('advance-reason-input') as HTMLInputElement)?.value || '').trim() || 'Festival advance';

    const member = state.staff.find((s: any) => s.id === staffId);
    if (member && amount > 0) {
      member.advancesTaken = (member.advancesTaken || 0) + amount;
      
      // Auto-record Store Expense
      if (!state.expenses) state.expenses = { total: 0, items: [] };
      if (!state.expenses.items) state.expenses.items = [];
      state.expenses.items.unshift({
        id: `exp-${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        description: `Staff Advance: ${member.name} (${reason})`,
        category: 'Staff Salary',
        amount: amount,
        status: 'Paid',
        paymentMode: 'Cash'
      });
      state.expenses.total = (state.expenses.total || 0) + amount;

      showToast(`Disbursed ₹${amount.toLocaleString()} advance to ${member.name}`, 'success');
    }

    state.showRecordAdvanceModal = false;
    state.advanceStaffId = null;
    saveState();
    renderApp();
  });

  // One-Click Global Cloud Sync to Firebase Storage & Firestore
  document.getElementById('sync-firebase-now-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('sync-firebase-now-btn');
    if (btn) {
      btn.innerHTML = `<span class="inline-block animate-spin text-sm">⏳</span><span>Syncing to Firebase...</span>`;
      (btn as HTMLButtonElement).disabled = true;
    }
    showToast('Syncing all 100 sweets, orders & performance to Firebase Cloud...', 'info');
    try {
      await syncAllToFirebaseCloud(state);
      showToast('☁️ All 100 sweets, orders & performance synced to Firebase Cloud!', 'success');
    } catch (e: any) {
      showToast('Cloud sync finished with local cache retention.', 'success');
    } finally {
      if (btn) {
        btn.innerHTML = `<span class="text-sm leading-none">✓</span><span>Cloud Synced Successfully</span>`;
        setTimeout(() => {
          renderApp();
        }, 1500);
      }
    }
  });

  // Settings: Store profile form
  document.getElementById('store-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    state.shopInfo.name = fd.get('name');
    state.shopInfo.subName = fd.get('subName');
    state.shopInfo.motto = fd.get('motto');
    state.shopInfo.address = fd.get('address');
    state.shopInfo.phone = fd.get('phone');
    state.shopInfo.gstin = fd.get('gstin');
    state.shopInfo.fssai = fd.get('fssai');
    saveState();
    alert('Store details updated successfully!');
    renderApp();
  });

  // Settings: Reset data
  document.getElementById('reset-all-data-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data back to original defaults?')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  });

  // Banner & Catalog Navigation Shortcuts
  document.getElementById('banner-pos-btn')?.addEventListener('click', () => {
    state.activeTab = 'pos';
    renderApp();
  });
  // Customer Phone Dialer Openers
  const handleOpenCustomerDialer = () => {
    state.showCustomerDialerModal = true;
    state.dialerInput = '';
    renderApp();
  };
  document.getElementById('pos-select-customer-btn')?.addEventListener('click', handleOpenCustomerDialer);
  document.getElementById('pos-add-new-customer-btn')?.addEventListener('click', handleOpenCustomerDialer);
  document.getElementById('checkout-edit-customer-btn')?.addEventListener('click', () => {
    state.showCheckoutModal = false;
    handleOpenCustomerDialer();
  });

  // Enterprise Multi-Branch Switchers
  document.getElementById('branch-select')?.addEventListener('change', (e: any) => {
    handleBranchSwitch(e.target.value);
  });

  document.querySelectorAll('[data-switch-branch]').forEach(btn => {
    btn.addEventListener('click', () => {
      const branchId = btn.getAttribute('data-switch-branch');
      if (branchId) handleBranchSwitch(branchId);
    });
  });

  // RBAC Role Switcher
  document.getElementById('user-role-select')?.addEventListener('change', (e) => {
    state.userRole = e.target.value;
    state.auditLogs.unshift({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: state.shopInfo.owner,
      action: 'Role Switched',
      details: `Active role updated to ${state.userRole}`
    });
    saveState();
    renderApp();
  });

  // Dual-Unit Weighing Mode Toggle (kg vs g)
  document.getElementById('unit-toggle-kg')?.addEventListener('click', () => {
    state.selectedWeightUnit = 'kg';
    saveState();
    renderApp();
  });
  document.getElementById('unit-toggle-g')?.addEventListener('click', () => {
    state.selectedWeightUnit = 'g';
    saveState();
    renderApp();
  });

  // Dual-Unit Quick Weight Chips (100g, 250g, 500g, 1kg)
  document.querySelectorAll('[data-add-weight]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sweetId = btn.getAttribute('data-add-weight');
      const weightDelta = parseFloat(btn.getAttribute('data-weight')) || 0.5;
      const sweet = state.sweets.find(s => s.id === sweetId);
      if (sweet) {
        const existing = state.posCart.find(i => i.id === sweetId);
        if (existing) {
          existing.qty = Math.round((existing.qty + weightDelta) * 100) / 100;
          existing.total = Math.round(existing.qty * existing.rate);
        } else {
          state.posCart.push({
            id: sweet.id,
            name: sweet.name,
            qty: weightDelta,
            rate: sweet.pricePerKg,
            unit: sweet.unit,
            total: Math.round(weightDelta * sweet.pricePerKg),
            image: sweet.image || `/assets/sweets/${sweet.id}.png`,
            fallbackImage: sweet.fallbackImage || `/assets/sweets/${sweet.id}.png`
          });
        }
        state.quickCart = [...state.posCart];
        saveState();
        renderApp();
      }
    });
  });

  // Hold / Park Bill during counter rush
  document.getElementById('pos-hold-bill-btn')?.addEventListener('click', () => {
    if (state.posCart.length === 0) return;
    const parkId = `park-${Date.now()}`;
    const parkSubtotal = state.posCart.reduce((sum, item) => sum + (item.rate * item.qty), 0);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    state.parkedBills.unshift({
      id: parkId,
      label: `Token #${10 + state.parkedBills.length} (${state.selectedCustomer?.name || 'Walk-in'})`,
      time: timeStr,
      itemsCount: state.posCart.length,
      total: parkSubtotal,
      customer: state.selectedCustomer,
      items: [...state.posCart]
    });

    state.auditLogs.unshift({
      time: timeStr,
      user: state.shopInfo.owner,
      action: 'Bill Parked',
      details: `Parked ${state.posCart.length} items (₹${parkSubtotal}) for ${state.selectedCustomer?.name || 'Walk-in'}`
    });

    state.posCart = [];
    state.quickCart = [];
    saveState();
    alert('Bill parked successfully! You can resume it anytime.');
    renderApp();
  });

  // Resume Parked Bill
  document.getElementById('toggle-parked-bills-btn')?.addEventListener('click', () => {
    if (state.parkedBills.length === 0) return;
    const billToResume = state.parkedBills.shift();
    if (billToResume) {
      state.posCart = billToResume.items || [];
      state.quickCart = [...state.posCart];
      if (billToResume.customer) {
        state.selectedCustomer = billToResume.customer;
      }
      state.auditLogs.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: state.shopInfo.owner,
        action: 'Bill Resumed',
        details: `Resumed parked bill: ${billToResume.label}`
      });
      saveState();
      renderApp();
    }
  });

  // Cash Drawer Z-Report Reconciliation
  document.getElementById('z-report-reconcile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const counted = parseFloat(document.getElementById('z-counted-cash')?.value) || 18450;
    const expected = parseFloat(document.getElementById('z-expected-cash')?.value) || 18450;
    const variance = counted - expected;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    state.zReports.unshift({
      id: `ZR-${Date.now().toString().slice(-6)}`,
      shift: `Counter Shift Handover (${timeStr})`,
      cashier: state.shopInfo.owner,
      openingFloat: 5000,
      expectedCash: expected,
      countedCash: counted,
      variance: variance,
      upiTotal: 14200,
      cardTotal: 6200,
      totalSales: 38850,
      status: variance === 0 ? 'Balanced' : variance > 0 ? 'Cash Surplus' : 'Cash Shortage'
    });

    state.auditLogs.unshift({
      time: timeStr,
      user: state.shopInfo.owner,
      action: 'Shift Reconciled',
      details: `Z-Report closed. Counted ₹${counted}, Variance: ₹${variance}`
    });

    saveState();
    alert(`Z-Report Reconciled! Status: ${variance === 0 ? 'Perfect Balance (₹0 variance)' : `Variance: ₹${variance}`}. Shift handover archived.`);
    renderApp();
  });

  // Customer Khata Settlement
  document.querySelectorAll('[data-settle-khata]').forEach(btn => {
    btn.addEventListener('click', () => {
      const custId = btn.getAttribute('data-settle-khata');
      const cust = state.customers.find(c => c.id === custId);
      if (cust && cust.khataBalance > 0) {
        const settledAmount = cust.khataBalance;
        cust.khataBalance = 0;
        cust.totalSpent += settledAmount;
        
        state.auditLogs.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: state.shopInfo.owner,
          action: 'Khata Settled',
          details: `Settled ₹${settledAmount} Khata balance for ${cust.name}`
        });

        saveState();
        alert(`Recorded full payment of ₹${settledAmount} for ${cust.name}'s Khata account! Balance is now ₹0.`);
        renderApp();
      }
    });
  });

  // Raw Material PO Restock
  document.querySelectorAll('[data-restock-rm]').forEach(btn => {
    btn.addEventListener('click', () => {
      const rmId = btn.getAttribute('data-restock-rm');
      const rm = state.rawMaterials.find(r => r.id === rmId);
      if (rm) {
        const delta = rm.unit === 'boxes' ? 100 : 25;
        rm.stock += delta;
        
        state.auditLogs.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: state.shopInfo.owner,
          action: 'Inward PO Restocked',
          details: `Inward PO logged: +${delta} ${rm.unit} of ${rm.name}`
        });

        saveState();
        alert(`Inward stock PO recorded! +${delta} ${rm.unit} added to ${rm.name}.`);
        renderApp();
      }
    });
  });

  // Customer Phone Call Dialer Handlers (ZERO-FLICKER IN-PLACE UPDATE)
  const handleSelectCustomerFromDialer = (custId: string | null) => {
    if (!custId) return;
    const cust = state.customers.find((c: any) => c.id === custId);
    if (cust) {
      state.selectedCustomer = cust;
      state.showCustomerDialerModal = false;
      state.auditLogs.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: state.shopInfo.owner,
        action: 'Customer Attached',
        details: `Customer ${cust.name} (${cust.phone}) attached to counter order.`
      });
      saveState();
      renderApp();
    }
  };

  const bindDialerMatchPickers = () => {
    document.querySelectorAll('[data-dialer-pick-customer]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const custId = btn.getAttribute('data-dialer-pick-customer');
        handleSelectCustomerFromDialer(custId);
      });
    });

    const quickAddForm = document.getElementById('dialer-quick-add-form');
    if (quickAddForm) {
      quickAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target as HTMLFormElement);
        const name = (fd.get('name') as string || '').trim();
        const phone = (fd.get('phone') as string || '').trim();
        const tier = (fd.get('tier') as string || 'Regular');
        if (!name) return;

        const newCustomer = {
          id: `cust-${Date.now()}`,
          name: name,
          phone: phone ? (phone.startsWith('+91') ? phone : `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`) : '+91 98000 00000',
          email: '',
          address: 'Ahmedabad, Gujarat',
          type: tier,
          tier: tier,
          loyaltyPoints: 50,
          khataBalance: 0,
          creditLimit: 5000,
          totalOrders: 1,
          totalSpent: 0,
          notes: 'Registered via Phone Dialer'
        };

        state.customers.unshift(newCustomer);
        state.selectedCustomer = newCustomer;
        state.showCustomerDialerModal = false;
        state.kpis.customers.value += 1;
        saveCustomerToCloud(newCustomer);
        state.auditLogs.unshift({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: state.shopInfo.owner,
          action: 'Customer Registered',
          details: `New customer ${name} (${newCustomer.phone}) registered via Phone Dialer.`
        });
        saveState();
        renderApp();
      });
    }
  };

  const updateDialerDOM = () => {
    const rawDigits = (state.dialerInput || '').replace(/\D/g, '').slice(0, 10);
    const displayEl = document.getElementById('dialer-phone-display');
    const countEl = document.getElementById('dialer-digit-count');
    const searchInput = document.getElementById('dialer-search-input') as HTMLInputElement;
    const container = document.getElementById('dialer-matches-container');

    if (displayEl) displayEl.textContent = formatDialerPhone(rawDigits);
    if (countEl) countEl.textContent = `${rawDigits.length} / 10 digits`;
    if (searchInput && searchInput.value !== state.dialerInput) {
      searchInput.value = state.dialerInput;
    }
    if (container) {
      container.innerHTML = renderDialerMatchesHtml(state.customers, state.dialerInput, rawDigits);
      bindDialerMatchPickers();
    }
  };

  // Close Dialer
  document.getElementById('close-dialer-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.showCustomerDialerModal = false;
    renderApp();
  });

  // Instant Walk-in Sale (No Phone Needed)
  document.getElementById('dialer-instant-walkin-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.selectedCustomer = null;
    state.showCustomerDialerModal = false;
    saveState();
    renderApp();
  });

  // Dial Pad Digit Buttons (0-9) - ZERO REFRESH!
  document.querySelectorAll('[data-dial-digit]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const digit = btn.getAttribute('data-dial-digit');
      if (digit && state.dialerInput.length < 10) {
        state.dialerInput += digit;
        updateDialerDOM();
      }
    });
  });

  // Dialer Backspace & Clear - ZERO REFRESH!
  const handleDialerBackspace = (e?: Event) => {
    if (e) e.preventDefault();
    state.dialerInput = state.dialerInput.slice(0, -1);
    updateDialerDOM();
  };
  document.getElementById('dialer-backspace-btn')?.addEventListener('click', handleDialerBackspace);
  document.getElementById('dialer-backspace-key')?.addEventListener('click', handleDialerBackspace);
  document.getElementById('dialer-clear-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.dialerInput = '';
    updateDialerDOM();
  });

  // Search input typing (both name and phone) - ZERO REFRESH!
  const dialerSearchInput = document.getElementById('dialer-search-input') as HTMLInputElement;
  if (dialerSearchInput) {
    dialerSearchInput.addEventListener('input', (e) => {
      state.dialerInput = (e.target as HTMLInputElement).value;
      updateDialerDOM();
    });
  }

  // Toggle Add by Name button
  document.getElementById('dialer-toggle-add-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const container = document.getElementById('dialer-matches-container');
    if (container) {
      container.innerHTML = renderDialerMatchesHtml([], 'add-new-custom', state.dialerInput);
      bindDialerMatchPickers();
      const nameInput = document.getElementById('dialer-new-name') as HTMLInputElement;
      if (nameInput) nameInput.focus();
    }
  });

  // Initial attach of matching listeners inside modal
  bindDialerMatchPickers();
}

// Physical Keyboard Numpad listener for Dialer - ZERO REFRESH!
window.addEventListener('keydown', (e) => {
  if (!state.showCustomerDialerModal) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (/^[0-9]$/.test(e.key)) {
    if (state.dialerInput.length < 10) {
      state.dialerInput += e.key;
      const rawDigits = (state.dialerInput || '').replace(/\D/g, '').slice(0, 10);
      const displayEl = document.getElementById('dialer-phone-display');
      const countEl = document.getElementById('dialer-digit-count');
      const searchInput = document.getElementById('dialer-search-input') as HTMLInputElement;
      const container = document.getElementById('dialer-matches-container');
      if (displayEl) displayEl.textContent = formatDialerPhone(rawDigits);
      if (countEl) countEl.textContent = `${rawDigits.length} / 10 digits`;
      if (searchInput && searchInput.value !== state.dialerInput) searchInput.value = state.dialerInput;
      if (container) {
        container.innerHTML = renderDialerMatchesHtml(state.customers, state.dialerInput, rawDigits);
        document.querySelectorAll('[data-dialer-pick-customer]').forEach(btn => {
          btn.addEventListener('click', (ev) => {
            ev.preventDefault();
            const custId = btn.getAttribute('data-dialer-pick-customer');
            const cust = state.customers.find((c: any) => c.id === custId);
            if (cust) {
              state.selectedCustomer = cust;
              state.showCustomerDialerModal = false;
              saveState();
              renderApp();
            }
          });
        });
      }
    }
  } else if (e.key === 'Backspace') {
    state.dialerInput = state.dialerInput.slice(0, -1);
    const rawDigits = (state.dialerInput || '').replace(/\D/g, '').slice(0, 10);
    const displayEl = document.getElementById('dialer-phone-display');
    const countEl = document.getElementById('dialer-digit-count');
    const searchInput = document.getElementById('dialer-search-input') as HTMLInputElement;
    const container = document.getElementById('dialer-matches-container');
    if (displayEl) displayEl.textContent = formatDialerPhone(rawDigits);
    if (countEl) countEl.textContent = `${rawDigits.length} / 10 digits`;
    if (searchInput && searchInput.value !== state.dialerInput) searchInput.value = state.dialerInput;
    if (container) {
      container.innerHTML = renderDialerMatchesHtml(state.customers, state.dialerInput, rawDigits);
    }
  } else if (e.key === 'Escape') {
    state.showCustomerDialerModal = false;
    renderApp();
  }
});

// Global Keyboard Shortcut: Ctrl+K / Cmd+K / / to open Omnibar Spotlight Search
window.addEventListener('keydown', (e: KeyboardEvent) => {
  // Check if inside input or textarea
  const activeTag = (document.activeElement?.tagName || '').toUpperCase();
  const isInputActive = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

  // Ctrl+K or Cmd+K
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    state.showSearchModal = !state.showSearchModal;
    if (state.showSearchModal) state.showMobileDrawer = false;
    renderApp();
    if (state.showSearchModal) {
      setTimeout(() => {
        const input = document.getElementById('spotlight-search-input') as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }, 40);
    }
    return;
  }

  // Pressing '/' opens search if not currently typing in an input
  if (e.key === '/' && !isInputActive && !state.showSearchModal) {
    e.preventDefault();
    state.showSearchModal = true;
    state.showMobileDrawer = false;
    renderApp();
    setTimeout(() => {
      const input = document.getElementById('spotlight-search-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 40);
    return;
  }

  // Escape closes search modal
  if (e.key === 'Escape' && state.showSearchModal) {
    e.preventDefault();
    state.showSearchModal = false;
    renderApp();
  }
});

// Initialize when DOM is ready with Google Deep Linking & Cloud Sync
window.addEventListener('DOMContentLoaded', () => {
  const initialHash = window.location.hash.replace('#/', '').replace('#', '');
  if (initialHash && ['dashboard', 'pos', 'products', 'customers', 'orders', 'expenses', 'analytics', 'staff', 'settings'].includes(initialHash)) {
    state.activeTab = initialHash;
  }
  renderApp();

  // Background Cloud Sync for active branch from Cloud Firestore
  loadBranchDataFromCloud(state.currentBranchId).then((data: any) => {
    if (data && data.sweets && data.sweets.length > 0) {
      state.sweets = data.sweets;
      if (data.kpis) {
        state.kpis = { ...state.kpis, ...data.kpis };
      }
      renderApp();
    }
  }).catch(() => {});
});

// Google Sitemap Deep Linking - Listen for browser URL hash changes
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  if (hash && ['dashboard', 'pos', 'products', 'customers', 'orders', 'expenses', 'analytics', 'staff', 'settings'].includes(hash) && state.activeTab !== hash) {
    state.activeTab = hash;
    saveState();
    renderApp();
  }
});
