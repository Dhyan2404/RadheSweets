// Radhe Sweets - Master Controller & Application Runtime
import './styles.css';
import './firebase.js';
import { initialData } from './data.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderTopBar } from './components/TopBar.js';
import { renderMobileBottomNav, renderMobileDrawer } from './components/MobileNav.js';
import { renderDashboardView } from './components/DashboardView.js';
import { renderPosView } from './components/PosView.js';
import { renderCheckoutModal } from './components/CheckoutModal.js';
import { renderOrderSuccessModal } from './components/OrderSuccessModal.js';
import { renderThermalReceiptModal } from './components/ThermalReceiptModal.js';
import { renderOrdersView } from './components/OrdersView.js';
import { renderOrderDetailsModal } from './components/OrderDetailsModal.js';
import { renderCustomersView, renderAddCustomerModal } from './components/CustomersView.js';
import { renderProductsView, renderAddProductModal } from './components/ProductsView.js';
import { renderExpensesView, renderAddExpenseModal } from './components/ExpensesView.js';
import { renderAnalyticsView } from './components/AnalyticsView.js';
import { renderSettingsView } from './components/SettingsView.js';
import { renderSplashView } from './components/SplashView.js';
import { renderCustomerDialerModal } from './components/CustomerDialerModal.js';

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
  sweets: stored?.sweets || [...initialData.sweets],
  customers: stored?.customers || [...initialData.customers],
  orders: stored?.orders || [...initialData.orders],
  expenses: stored?.expenses || { ...initialData.expenses },
  analytics: stored?.analytics || { ...initialData.analytics },

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
  activeTab: (stored?.activeTab && stored.activeTab !== 'recipes' && stored.activeTab !== 'products') ? stored.activeTab : 'dashboard',
  deviceMode: stored?.deviceMode || 'desktop', // 'desktop' or 'mobile'
  currentTheme: stored?.currentTheme || 'warm', // 'warm' or 'ice'
  isDarkMode: stored?.isDarkMode || false,

  // Filters & Search
  searchQuery: '',
  posSearchQuery: '',
  ordersSearchQuery: '',
  customersSearchQuery: '',
  productsSearchQuery: '',
  activeCategory: 'All',
  ordersFilterTab: 'all',
  customersFilterTab: 'all',
  productsFilterCategory: 'All',
  timeFilter: 'month',

  // POS State
  selectedCustomer: stored?.selectedCustomer || initialData.customers[0],
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
  showAddProductModal: false,
  showSplashModal: false,
  showCustomerDialerModal: false,
  showMobileDrawer: false,
  dialerInput: '',
  activeOrder: null,
  lastPlacedOrder: null,
  unreadNotifications: 2
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
      quickCart: state.quickCart
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// Master Render Function
export function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Apply theme classes to body
  document.body.classList.toggle('theme-serene-ice', state.currentTheme === 'ice');
  document.body.classList.toggle('dark-mode', state.isDarkMode);

  // Fully Responsive Layout: Auto-adjusts cleanly between Phone and PC Web without upper bar
  appContainer.innerHTML = `
    <div class="min-h-screen flex flex-col md:flex-row antialiased bg-[#FAF7F2] text-[#2A1F1D]">
      <!-- Desktop Sidebar Navigation (Visible on md and up) -->
      <div class="hidden md:flex flex-shrink-0">
        ${renderSidebar(state.activeTab)}
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <!-- Top Navigation Header (Clean 1:1 match with reference image) -->
        ${renderTopBar(state)}

        <!-- Active Tab Body -->
        <main class="flex-1 p-4 sm:p-6 lg:p-7 space-y-6 pb-24 md:pb-8">
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
    ${state.showAddProductModal ? renderAddProductModal() : ''}
    ${state.showAddExpenseModal ? renderAddExpenseModal() : ''}
    ${state.showSplashModal ? renderSplashView({ isModal: true }) : ''}
    ${state.showCustomerDialerModal ? renderCustomerDialerModal(state) : ''}
    ${state.showMobileDrawer ? renderMobileDrawer(state) : ''}
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

  // Active Branch Switcher (Only Changeable in Settings)
  document.querySelectorAll('[data-setting-select-branch]').forEach(el => {
    el.addEventListener('click', () => {
      const branchId = el.getAttribute('data-setting-select-branch');
      if (branchId && branchId !== state.currentBranchId) {
        state.currentBranchId = branchId;
        saveState();
        renderApp();
      }
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
            image: sweet.image,
            fallbackImage: sweet.fallbackImage
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

  // Stock Adjustment (+5 / -1) in Products View
  document.querySelectorAll('[data-stock-adjust]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sweetId = btn.getAttribute('data-stock-adjust');
      const delta = parseFloat(btn.getAttribute('data-stock-delta') || '0');
      const sweet = state.sweets.find(s => s.id === sweetId);
      if (sweet) {
        sweet.stock = Math.max(0, Math.round((sweet.stock + delta) * 10) / 10);
        sweet.stockStatus = sweet.stock <= 15 ? 'Low Stock' : 'In Stock';
        saveState();
        renderApp();
        showToast(`Stock updated for ${sweet.name}: ${sweet.stock} ${sweet.unit}`, 'info');
      }
    });
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
    if (!state.selectedCustomer) {
      state.showCustomerDialerModal = true;
      state.dialerInput = '';
      alert('Customer mobile number is required for counter billing! Please enter customer phone number on the dialer.');
      renderApp();
      return;
    }
    state.showCheckoutModal = true;
    renderApp();
  };
  document.getElementById('pos-proceed-checkout-btn')?.addEventListener('click', handleOpenCheckout);
  document.getElementById('dashboard-checkout-btn')?.addEventListener('click', () => {
    state.activeTab = 'pos';
    if (!state.selectedCustomer) {
      state.showCustomerDialerModal = true;
      state.dialerInput = '';
    } else {
      state.showCheckoutModal = true;
    }
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
      customerId: state.selectedCustomer?.id || 'cust-1',
      customerName: state.selectedCustomer?.name || 'Walk-in Customer',
      customerPhone: state.selectedCustomer?.phone || '+91 98765 67890',
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
    state.orderStatusCounts.delivered += 1;
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

  document.getElementById('customers-search-input')?.addEventListener('input', (e) => {
    state.customersSearchQuery = e.target.value;
    renderApp();
  });

  document.querySelectorAll('[data-select-for-pos]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-select-for-pos');
      const customer = state.customers.find(c => c.id === id);
      if (customer) {
        state.selectedCustomer = customer;
        state.activeTab = 'pos';
        saveState();
        renderApp();
      }
    });
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

  document.getElementById('add-customer-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newCust = {
      id: `cust-${Date.now()}`,
      name: fd.get('name'),
      phone: `+91 ${fd.get('phone')}`,
      email: fd.get('email') || '',
      address: fd.get('address') || 'Ahmedabad, Gujarat',
      type: fd.get('tier') || 'Regular',
      tier: fd.get('tier') || 'Regular',
      totalOrders: 0,
      totalSpent: 0,
      notes: fd.get('notes') || ''
    };
    state.customers.unshift(newCust);
    state.selectedCustomer = newCust;
    state.kpis.customers.value += 1;
    state.showAddCustomerModal = false;
    saveState();
    renderApp();
  });

  // Products View Handlers
  document.querySelectorAll('[data-products-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.productsFilterCategory = btn.getAttribute('data-products-category');
      renderApp();
    });
  });

  document.getElementById('products-search-input')?.addEventListener('input', (e) => {
    state.productsSearchQuery = e.target.value;
    renderApp();
  });

  // Stock adjustments
  document.querySelectorAll('[data-stock-adjust]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sweetId = btn.getAttribute('data-stock-adjust');
      const delta = Number(btn.getAttribute('data-stock-delta'));
      const sweet = state.sweets.find(s => s.id === sweetId);
      if (sweet) {
        sweet.stock = Math.max(0, sweet.stock + delta);
        sweet.stockStatus = sweet.stock <= 10 ? 'Low Stock' : 'In Stock';
        saveState();
        renderApp();
      }
    });
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

  document.getElementById('add-product-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newSweet = {
      id: `sw-${Date.now()}`,
      name: fd.get('name'),
      tagline: fd.get('category'),
      category: fd.get('category'),
      pricePerKg: Number(fd.get('price')),
      stock: Number(fd.get('stock') || 25),
      unit: fd.get('category') === 'Beverages' ? 'litres' : 'kg',
      stockStatus: fd.get('stockStatus') || 'In Stock',
      badge: fd.get('stockStatus') || 'In Stock',
      code: fd.get('name').slice(0, 2).toUpperCase(),
      description: fd.get('description') || 'Freshly made with pure ingredients.',
      image: fd.get('image') || 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=600&q=80'
    };
    state.sweets.unshift(newSweet);
    state.showAddProductModal = false;
    saveState();
    renderApp();
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
      const item = state.expenses.items.find(i => i.id === id);
      if (item) {
        state.expenses.total = Math.max(0, state.expenses.total - item.amount);
        state.expenses.items = state.expenses.items.filter(i => i.id !== id);
        saveState();
        renderApp();
      }
    });
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
  document.getElementById('branch-select')?.addEventListener('change', (e) => {
    state.currentBranchId = e.target.value;
    state.auditLogs.unshift({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: state.shopInfo.owner,
      action: 'Branch Switched',
      details: `Switched active branch to ${e.target.value}`
    });
    saveState();
    renderApp();
  });

  document.querySelectorAll('[data-switch-branch]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentBranchId = btn.getAttribute('data-switch-branch');
      saveState();
      renderApp();
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
            image: sweet.image,
            fallbackImage: sweet.fallbackImage
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

  // Customer Phone Call Dialer Handlers
  document.getElementById('close-dialer-btn')?.addEventListener('click', () => {
    state.showCustomerDialerModal = false;
    renderApp();
  });

  // Dial Pad Digit Buttons (0-9)
  document.querySelectorAll('[data-dial-digit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const digit = btn.getAttribute('data-dial-digit');
      if (state.dialerInput.length < 10) {
        state.dialerInput += digit;
        renderApp();
      }
    });
  });

  // Dialer Backspace & Clear
  const handleDialerBackspace = () => {
    state.dialerInput = state.dialerInput.slice(0, -1);
    renderApp();
  };
  document.getElementById('dialer-backspace-btn')?.addEventListener('click', handleDialerBackspace);
  document.getElementById('dialer-backspace-key')?.addEventListener('click', handleDialerBackspace);
  document.getElementById('dialer-clear-btn')?.addEventListener('click', () => {
    state.dialerInput = '';
    renderApp();
  });

  // Dialer Select Existing Customer
  const handleSelectCustomerFromDialer = (custId) => {
    const cust = state.customers.find(c => c.id === custId);
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

  document.getElementById('dialer-select-existing-btn')?.addEventListener('click', (e) => {
    const custId = e.currentTarget.getAttribute('data-customer-id');
    handleSelectCustomerFromDialer(custId);
  });

  document.querySelectorAll('[data-dialer-pick-customer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const custId = btn.getAttribute('data-dialer-pick-customer');
      handleSelectCustomerFromDialer(custId);
    });
  });

  // Dialer Register New Customer Form (When number does not exist)
  document.getElementById('dialer-new-customer-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const phoneDigits = fd.get('phone');
    const name = fd.get('name');
    const tier = fd.get('tier') || 'Regular';
    const address = fd.get('address') || 'Ahmedabad, Gujarat';

    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: name,
      phone: `+91 ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`,
      email: '',
      address: address,
      type: tier,
      tier: tier,
      loyaltyPoints: 50,
      khataBalance: 0,
      creditLimit: 5000,
      totalOrders: 0,
      totalSpent: 0,
      notes: 'Registered via Counter Phone Dialer'
    };

    state.customers.unshift(newCustomer);
    state.selectedCustomer = newCustomer;
    state.showCustomerDialerModal = false;
    state.kpis.customers.value += 1;
    state.auditLogs.unshift({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: state.shopInfo.owner,
      action: 'Customer Registered',
      details: `New customer ${name} (${newCustomer.phone}) registered via Phone Dialer.`
    });
    saveState();
    alert(`✓ Customer ${name} registered successfully with 50 Welcome Loyalty Points! Selected for active order.`);
    renderApp();
  });
}

// Physical Keyboard Numpad listener for Dialer
window.addEventListener('keydown', (e) => {
  if (!state.showCustomerDialerModal) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (/^[0-9]$/.test(e.key)) {
    if (state.dialerInput.length < 10) {
      state.dialerInput += e.key;
      renderApp();
    }
  } else if (e.key === 'Backspace') {
    state.dialerInput = state.dialerInput.slice(0, -1);
    renderApp();
  } else if (e.key === 'Escape') {
    state.showCustomerDialerModal = false;
    renderApp();
  }
});

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
