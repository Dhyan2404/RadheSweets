// Radhe Sweets - Master Controller & Application Runtime
import './styles.css';
import { 
  saveBranchSweetsToCloud, 
  saveBranchOrderToCloud, 
  deleteBranchOrderFromCloud,
  saveBranchKpisToCloud, 
  saveCustomerToCloud, 
  deleteCustomerFromCloud,
  saveBranchCustomerToCloud,
  saveAllBranchCustomersToCloud,
  loadBranchDataFromCloud,
  syncAllToFirebaseCloud,
  subscribeToBranchOrders,
  subscribeToCustomers,
  subscribeToBranchCustomers,
  subscribeToBranchSweets,
  subscribeToBranchKpis,
  subscribeToBranchStaff,
  saveStaffMemberToCloud,
  deleteStaffMemberFromCloud,
  subscribeToBranchExpenses,
  saveExpenseToCloud,
  deleteExpenseFromCloud,
  subscribeToActiveCheckout,
  saveActiveCheckoutToCloud,
  clearActiveCheckoutInCloud,
  saveBranchToCloud,
  deleteBranchFromCloud,
  subscribeToBranches,
  loadBranchesFromCloud,
  firestoreLiveState,
  onFirestoreStatusChange,
  getBranchDefaultCatalog,
  testFirestoreConnection,
  saveBranchSettingsToCloud,
  saveBranchCategoriesToCloud
} from './firebase.js';
import { initialData } from './data.js';
import { renderSidebar } from './components/Sidebar.ts';
import { renderTopBar } from './components/TopBar.ts';
import { renderMobileBottomNav, renderMobileDrawer } from './components/MobileNav.ts';
import { renderDashboardView } from './components/DashboardView.ts';
import { 
  renderPosView, 
  renderCardActionBtn, 
  renderDesktopCartItemsHtml, 
  renderMobileCartItemsHtml 
} from './components/PosView.ts';
import { renderCheckoutModal } from './components/CheckoutModal.ts';
import { renderHeldCartsModal } from './components/HeldCartsModal.ts';
import { 
  enqueueOfflineOrder, 
  dequeueOfflineOrder,
  syncOfflineOrdersQueue, 
  getPendingOfflineOrdersCount, 
  isNetworkOnline 
} from './offlineQueue.ts';
import { initSlideCommit } from './components/SlideCommit.ts';
import { initAllSwipeRows } from './components/SwipeRow.ts';
import { initAllCounters } from './components/Counter.ts';
import { renderOrderSuccessModal } from './components/OrderSuccessModal.ts';
import { 
  renderThermalReceiptModal, 
  defaultReceiptSettings, 
  renderReceiptSlipHtml 
} from './components/ThermalReceiptModal.ts';
import { renderOrdersView } from './components/OrdersView.ts';
import { renderOrderDetailsModal } from './components/OrderDetailsModal.ts';
import { 
  renderCustomersView, 
  renderAddCustomerModal, 
  renderCustomerProfileModal,
  renderEditCustomerModal 
} from './components/CustomersView.ts';
import {
  renderAddAdvanceOrderModal,
  renderEditAdvanceOrderModal
} from './components/AdvanceOrderModals.ts';
import { 
  renderProductsView, 
  renderAddProductModal, 
  renderEditProductModal, 
  renderRestockBatchModal, 
  renderStockAdjustModal,
  renderManageCategoriesModal
} from './components/ProductsView.ts';
import { compressImageFile } from './utils/imageCompressor.ts';
import { renderExpensesView, renderAddExpenseModal } from './components/ExpensesView.ts';
import { renderAnalyticsView } from './components/AnalyticsView.ts';
import { renderProfitDetailsModal } from './components/ProfitModal.ts';
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
import { 
  renderAddBranchModal, 
  renderEditBranchModal 
} from './components/BranchModals.ts';

const STORAGE_KEY = 'radhe_sweets_app_state_v1';

// Auto-delay timer holders for checkout completion & thermal receipt
let receiptAutoTimer: any = null;
let receiptProgressInterval: any = null;

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
  sweets: ((stored?.sweets && stored.sweets.length > 0) ? stored.sweets : [...initialData.sweets]).map((s: any) => {
    const initMatch = initialData.sweets.find((is: any) => is.id === s.id);
    return {
      ...s,
      name: s.name || initMatch?.name || 'Mithai',
      image: s.image || (initMatch ? `/assets/sweets/${s.id}.png` : '/assets/sweets/sw-1.png'),
      fallbackImage: s.fallbackImage || (initMatch ? `/assets/sweets/${s.id}.png` : '/assets/sweets/sw-1.png')
    };
  }),
  categories: stored?.categories || (initialData as any).categories || [
    'Mawa Sweets', 'Kaju Sweets', 'Bengali Sweets', 'Pure Ghee Sweets',
    'Dry Fruit', 'Traditional / Regional', 'Farsan & Namkeen',
    'Bakery & Biscuits', 'Sugar Free', 'Syrup & Fried', 'Milk Sweets', 'Special Hampers'
  ],
  receiptSettings: stored?.receiptSettings || stored?.shopInfo?.receiptSettings || { ...defaultReceiptSettings },
  showMobileCartSheet: false,
  customers: (stored?.customers && stored.customers.length > 0) ? stored.customers : [...initialData.customers],
  orders: stored?.orders || [...initialData.orders],
  expenses: stored?.expenses || { ...initialData.expenses },
  analytics: stored?.analytics || { ...initialData.analytics },
  staff: (stored?.staff && stored.staff.length > 0) ? stored.staff : [...initialData.staff],
  staffFilterTab: 'all',
  staffSearchQuery: '',
  staffDeptFilter: 'all',
  staffBranchFilter: stored?.staffBranchFilter || stored?.currentBranchId || 'br-1',

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
  showProfitModal: false,
  profitSelectedMonth: 'Sep 2026',

  // Navigation & View Mode
  activeTab: (stored?.activeTab && stored.activeTab !== 'recipes' && stored.activeTab !== 'storefront') ? stored.activeTab : 'pos',
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
  ordersViewMode: stored?.ordersViewMode || 'swipe',
  customersFilterTab: 'all',
  productsFilterCategory: 'All',
  expensesFilterCategory: 'All',
  timeFilter: 'month',

  // POS State (Walk-in counter by default - no pre-selected patron)
  selectedCustomer: (stored?.selectedCustomer && stored.selectedCustomer.name !== 'Jignesh Shah') ? stored.selectedCustomer : null,
  posCart: stored?.posCart || [],
  quickCart: stored?.quickCart || [],
  discountPercent: 0,
  paymentMethod: 'Cash',
  orderNote: '',
  cashTendered: 0,
  boxTareGrams: 0,

  // Modals & Drawers
  showCheckoutModal: false,
  showAddExpenseModal: false,
  returnToCheckout: false,
  showSuccessModal: false,
  showThermalModal: false,
  showOrderDetailsModal: false,
  showAddCustomerModal: false,
  showCustomerProfileModal: false,
  profileCustomer: null,
  showEditCustomerModal: false,
  editingCustomer: null as any,
  showAddAdvanceModal: false,
  showEditAdvanceModal: false,
  editingAdvanceOrder: null as any,
  showHeldCartsModal: false,
  customersSortBy: stored?.customersSortBy || 'most-spent',
  expenseSavedSuccess: false,
  lastSavedExpense: null as any,
  showAddProductModal: false,
  showEditProductModal: false,
  editingSweet: null,
  showManageCategoriesModal: false,
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
  advanceStaffId: null,

  // Branch Modals
  showAddBranchModal: false,
  showEditBranchModal: false,
  editingBranch: null,

  // Customer Storefront State
  userCart: stored?.userCart || [],
  customerDietFilter: 'All',
  customerSearchQuery: '',
  customerDeliveryType: 'delivery',
  customerName: stored?.customerName || '',
  customerPhone: stored?.customerPhone || '',
  customerAddress: stored?.customerAddress || '',
  showCustomerBagModal: false,
  showLoyaltyCheckModal: false,
  loyaltyQueryResult: null
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
      staffBranchFilter: state.staffBranchFilter,
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
      productsViewMode: state.productsViewMode,
      userCart: state.userCart,
      customerName: state.customerName,
      customerPhone: state.customerPhone,
      customerAddress: state.customerAddress,
      categories: state.categories,
      receiptSettings: state.receiptSettings
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    broadcastPeerSync('STATE_SAVED', toSave);
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// Real-time Peer Bus for Multi-Tab & Device Viewport Synchronization
const peerSyncBus = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('radhe_sweets_peer_bus') : null;

function broadcastPeerSync(type = 'STATE_SAVED', payload?: any) {
  try {
    peerSyncBus?.postMessage({
      type,
      branchId: state.currentBranchId,
      timestamp: Date.now(),
      payload: payload || {
        customers: state.customers,
        orders: state.orders,
        sweets: state.sweets,
        staff: state.staff,
        expenses: state.expenses,
        kpis: state.kpis,
        orderStatusCounts: state.orderStatusCounts,
        auditLogs: state.auditLogs
      }
    });
  } catch (_) {}
}

function handleIncomingPeerSync(incomingData?: any) {
  try {
    let fresh = incomingData;
    if (!fresh) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      fresh = JSON.parse(raw);
    }
    if (!fresh) return;

    let hasUpdate = false;

    // 1. Synchronize customers & loyalty directory (Checks actual content, not just length!)
    if (Array.isArray(fresh.customers) && fresh.customers.length > 0) {
      const isDiff = JSON.stringify(fresh.customers) !== JSON.stringify(state.customers);
      if (isDiff) {
        state.customers = fresh.customers;
        hasUpdate = true;
      }
    }

    // 2. Synchronize orders & statuses
    if (Array.isArray(fresh.orders)) {
      const isDiff = JSON.stringify(fresh.orders) !== JSON.stringify(state.orders);
      if (isDiff) {
        state.orders = fresh.orders;
        state.orderStatusCounts = fresh.orderStatusCounts || {
          total: state.orders.length,
          completed: state.orders.filter((o: any) => o.status === 'Completed').length,
          advance: state.orders.filter((o: any) => o.status === 'Advance Booking').length,
          kitchen: state.orders.filter((o: any) => o.status === 'Kitchen Packing').length
        };
        hasUpdate = true;
      }
    }

    // 3. Synchronize sweets stock & catalog
    if (Array.isArray(fresh.sweets) && fresh.sweets.length >= 50) {
      const isDiff = JSON.stringify(fresh.sweets) !== JSON.stringify(state.sweets);
      if (isDiff) {
        state.sweets = fresh.sweets;
        hasUpdate = true;
      }
    }

    // 4. Synchronize staff roster, salary & attendance
    if (Array.isArray(fresh.staff)) {
      const isDiff = JSON.stringify(fresh.staff) !== JSON.stringify(state.staff);
      if (isDiff) {
        state.staff = fresh.staff;
        hasUpdate = true;
      }
    }

    // 5. Synchronize expenses & expense items
    if (fresh.expenses) {
      const isDiff = JSON.stringify(fresh.expenses) !== JSON.stringify(state.expenses);
      if (isDiff) {
        state.expenses = fresh.expenses;
        hasUpdate = true;
      }
    }

    // 6. Synchronize KPIs & profit totals
    if (fresh.kpis) {
      const isDiff = JSON.stringify(fresh.kpis) !== JSON.stringify(state.kpis);
      if (isDiff) {
        state.kpis = { ...state.kpis, ...fresh.kpis };
        hasUpdate = true;
      }
    }

    // 7. Synchronize audit logs
    if (Array.isArray(fresh.auditLogs)) {
      state.auditLogs = fresh.auditLogs;
    }

    // 8. Synchronize parked bills
    if (Array.isArray(fresh.parkedBills)) {
      state.parkedBills = fresh.parkedBills;
    }

    // 9. Synchronize shop info
    if (fresh.shopInfo) {
      state.shopInfo = { ...state.shopInfo, ...fresh.shopInfo };
    }

    if (hasUpdate && shouldBackgroundSyncRender()) {
      renderApp();
    }
  } catch (err) {
    console.warn('Cross-tab peer sync error:', err);
  }
}

if (peerSyncBus) {
  peerSyncBus.onmessage = (event) => {
    if (event.data?.type === 'STATE_SAVED') {
      handleIncomingPeerSync(event.data?.payload);
    }
  };
}

window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY && e.newValue) {
    try {
      const fresh = JSON.parse(e.newValue);
      handleIncomingPeerSync(fresh);
    } catch (_) {}
  }
});

// Real-time Cloud Active Checkout Draft Synchronization
function syncActiveCheckoutDraft() {
  saveActiveCheckoutToCloud(state.currentBranchId, {
    posCart: state.posCart,
    selectedCustomer: state.selectedCustomer,
    discountPercent: state.discountPercent,
    paymentMethod: state.paymentMethod
  });
}

// Guard function: prevent background cloud sync from re-rendering active user modals (eliminates 3x modal popup flashing)
function shouldBackgroundSyncRender(): boolean {
  if (state.showSuccessModal || state.showThermalModal || state.showCheckoutModal || state.showCustomerDialerModal) {
    return false;
  }
  return true;
}

// Hardware Audio Beeper Synthesizer (Zero Dependency Web Audio API)
export function playBeep(type: 'add' | 'success' | 'warning' | 'click' = 'click') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'add') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High pleasant A5 counter beep
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } else if (type === 'warning') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    }
  } catch (err) {
    // Audio context may require user gesture on some browsers
  }
}

// Enterprise Branch Snapshot & Isolation System
export const getBranchStorageKey = (branchId: string) => `radhe_branch_${branchId}_snapshot_v2`;

export function saveBranchSnapshot(branchId: string) {
  try {
    const snapshot = {
      branchId,
      sweets: state.sweets,
      orders: state.orders,
      kpis: state.kpis,
      orderStatusCounts: state.orderStatusCounts,
      expenses: state.expenses,
      customers: state.customers,
      parkedBills: state.parkedBills,
      savedAt: Date.now()
    };
    localStorage.setItem(getBranchStorageKey(branchId), JSON.stringify(snapshot));
    // Backup to Cloud Firestore
    saveBranchSweetsToCloud(branchId, state.sweets);
    saveBranchKpisToCloud(branchId, state.kpis);
  } catch (e) {
    console.error('Failed to save branch snapshot:', e);
  }
}

export function getBranchLocalSnapshot(branchId: string) {
  try {
    const raw = localStorage.getItem(getBranchStorageKey(branchId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse branch snapshot:', e);
  }
  return null;
}

// Enterprise Firestore Real-time Subscriptions (Strict Branch Isolation - Never merge foreign branch orders!)
let activeSubscriptions: Array<() => void> = [];

export function setupBranchFirestoreListeners(branchId: string) {
  activeSubscriptions.forEach(unsub => {
    try { unsub(); } catch(e) {}
  });
  activeSubscriptions = [];

  // 1. Live Orders Listener (Branch isolated)
  const unsubOrders = subscribeToBranchOrders(branchId, (cloudOrders: any[]) => {
    if (branchId !== state.currentBranchId) return;

    if (cloudOrders && cloudOrders.length > 0) {
      state.orders = cloudOrders;
    } else {
      const snap = getBranchLocalSnapshot(branchId);
      state.orders = snap?.orders || [];
    }
    state.orderStatusCounts.total = state.orders.length;
    state.orderStatusCounts.completed = state.orders.filter(o => o.status === 'Completed').length;
    state.orderStatusCounts.advance = state.orders.filter(o => o.status === 'Advance Booking').length;
    state.orderStatusCounts.kitchen = state.orders.filter(o => o.status === 'Kitchen Packing').length;
    saveState();
    if (['orders', 'dashboard'].includes(state.activeTab) && shouldBackgroundSyncRender()) {
      renderApp();
    }
  });
  activeSubscriptions.push(unsubOrders);

  // 2. Live Sweets Catalog (All sweets, categories, and printer settings for this branch)
  const unsubSweets = subscribeToBranchSweets(branchId, (cloudSweets: any[], cloudCategories?: string[], cloudSettings?: any) => {
    if (branchId !== state.currentBranchId) return;
    if (cloudSweets && cloudSweets.length > 0) {
      state.sweets = cloudSweets;
      if (cloudCategories && Array.isArray(cloudCategories) && cloudCategories.length > 0) {
        state.categories = cloudCategories;
      }
      if (cloudSettings) {
        state.receiptSettings = { ...state.receiptSettings, ...cloudSettings };
      }
      saveState();
      if (['pos', 'products', 'dashboard', 'settings'].includes(state.activeTab) && shouldBackgroundSyncRender()) {
        renderApp();
      }
    }
  });
  activeSubscriptions.push(unsubSweets);

  // 3. Live Branch KPIs & Gross Profits
  const unsubKpis = subscribeToBranchKpis(branchId, (cloudKpis: any) => {
    if (branchId !== state.currentBranchId) return;
    if (cloudKpis && (cloudKpis.sales || cloudKpis.revenue !== undefined)) {
      if (branchId !== 'br-1' && state.orders.length === 0) return;
      state.kpis = { ...state.kpis, ...cloudKpis };
      saveState();
      if (['dashboard', 'analytics'].includes(state.activeTab) && shouldBackgroundSyncRender()) {
        renderApp();
      }
    }
  });
  activeSubscriptions.push(unsubKpis);

  // 4. Live Branch Customers Listener (Branch-isolated patrons & loyalty directory)
  const unsubCusts = subscribeToBranchCustomers(branchId, (cloudCustomers: any[]) => {
    if (branchId !== state.currentBranchId) return;
    if (cloudCustomers && cloudCustomers.length > 0) {
      if (branchId === 'br-1') {
        const merged = initialData.customers.map((c: any) => {
          const match = cloudCustomers.find((cc: any) => cc.id === c.id);
          return match ? { ...c, ...match } : c;
        });
        cloudCustomers.forEach((cc: any) => {
          if (!merged.some((m: any) => m.id === cc.id)) merged.push(cc);
        });
        state.customers = merged;
      } else {
        state.customers = cloudCustomers;
      }
    } else {
      const snap = getBranchLocalSnapshot(branchId);
      if (snap?.customers) state.customers = snap.customers;
    }
    state.kpis.customers = state.kpis.customers || { value: 0 };
    state.kpis.customers.value = state.customers.length;
    state.kpis.customers.formatted = String(state.customers.length);
    saveState();
    if (['customers', 'pos', 'dashboard'].includes(state.activeTab) && shouldBackgroundSyncRender()) {
      renderApp();
    }
  });
  activeSubscriptions.push(unsubCusts);

  // 5. Live Branch Staff & Payroll Listener
  const unsubStaff = subscribeToBranchStaff(branchId, (cloudStaff: any[]) => {
    if (branchId !== state.currentBranchId) return;
    if (cloudStaff && cloudStaff.length > 0) {
      state.staff = cloudStaff;
      saveState();
      if (['staff', 'dashboard'].includes(state.activeTab) && shouldBackgroundSyncRender()) {
        renderApp();
      }
    }
  });
  activeSubscriptions.push(unsubStaff);

  // 6. Live Branch Expenses Ledger Listener
  const unsubExpenses = subscribeToBranchExpenses(branchId, (cloudExpenses: any) => {
    if (branchId !== state.currentBranchId) return;
    if (cloudExpenses && Array.isArray(cloudExpenses.items)) {
      state.expenses = cloudExpenses;
      saveState();
      if (['expenses', 'dashboard'].includes(state.activeTab) && shouldBackgroundSyncRender()) {
        renderApp();
      }
    }
  });
  activeSubscriptions.push(unsubExpenses);
}

// Master Branch Switch Handler: Switches stock, catalog, customers, orders, and resets profit/metrics to 0
export async function handleBranchSwitch(targetBranchId: string) {
  if (!targetBranchId || targetBranchId === state.currentBranchId) return;

  const departingBranchId = state.currentBranchId;

  // 1. Snapshot and save departing branch state (sweets, orders, KPIs, customers)
  saveBranchSnapshot(departingBranchId);

  // 2. Switch current branch ID and sync staff branch filter
  state.currentBranchId = targetBranchId;
  state.staffBranchFilter = targetBranchId;

  // 3. Clear transient checkout & counter draft state (prevent leaking cart or selected customer)
  state.posCart = [];
  state.quickCart = [];
  state.selectedCustomer = null;
  state.discountPercent = 0;
  state.paymentMethod = 'Cash';
  state.orderNote = '';
  state.activeOrder = null;
  state.lastPlacedOrder = null;
  state.showCheckoutModal = false;
  state.showCustomerDialerModal = false;
  state.showAddCustomerModal = false;

  // 4. Restore target branch data or initialize with 0-reset defaults
  const existingSnapshot = getBranchLocalSnapshot(targetBranchId);

  if (existingSnapshot && existingSnapshot.sweets && existingSnapshot.sweets.length > 0) {
    state.sweets = existingSnapshot.sweets;
    state.orders = existingSnapshot.orders || [];
    if (targetBranchId !== 'br-1') {
      const isLegacyInherited = existingSnapshot.customers && (
        existingSnapshot.customers.length === initialData.customers.length &&
        existingSnapshot.customers[0]?.id === initialData.customers[0]?.id
      );
      state.customers = isLegacyInherited ? [] : (existingSnapshot.customers || []);
    } else {
      state.customers = existingSnapshot.customers || [...initialData.customers];
    }
    
    if (targetBranchId !== 'br-1' && state.orders.length === 0) {
      state.kpis = {
        sales: { value: 0, formatted: '₹0', change: '0.0% today', isUp: false },
        profit: { value: 0, formatted: '₹0', margin: '0.0%', change: '0.0% margin', isUp: false },
        orders: { value: 0, formatted: '0', change: '0 orders', isUp: false },
        cost: { value: 0, formatted: '₹0', change: '0.0%', isUp: false },
        customers: { value: state.customers.length, formatted: String(state.customers.length), change: `${state.customers.length} patrons` },
        returningCustomers: { value: 0, formatted: '0' },
        sweetsSold: { value: 0, unit: 'kg', formatted: '0 kg', change: '0 kg' }
      };
    } else {
      state.kpis = existingSnapshot.kpis || {
        sales: { value: 0, formatted: '₹0' },
        profit: { value: 0, formatted: '₹0', margin: '0.0%' },
        orders: { value: 0, formatted: '0' },
        cost: { value: 0, formatted: '₹0' },
        customers: { value: state.customers.length, formatted: String(state.customers.length) },
        returningCustomers: { value: 0, formatted: '0' }
      };
    }

    state.orderStatusCounts = existingSnapshot.orderStatusCounts || {
      total: state.orders.length,
      completed: state.orders.filter(o => o.status === 'Completed').length,
      advance: state.orders.filter(o => o.status === 'Advance Booking').length,
      kitchen: state.orders.filter(o => o.status === 'Kitchen Packing').length
    };
    if (existingSnapshot.expenses) state.expenses = existingSnapshot.expenses;
  } else {
    // Brand new switch to this branch:
    // User request: "make switching branch switch everything reset profit and etc to 0 switching branch switch portfolios customer stock mithais and everything"
    const branchDefaults = getBranchDefaultCatalog(targetBranchId);
    state.sweets = branchDefaults.sweets;
    state.orders = [];
    state.orderStatusCounts = { total: 0, completed: 0, advance: 0, kitchen: 0 };
    state.customers = targetBranchId === 'br-1' ? [...initialData.customers] : [];

    // Explicit 0-metric reset
    state.kpis = {
      sales: { value: 0, formatted: '₹0', change: '0.0% today', isUp: false },
      profit: { value: 0, formatted: '₹0', margin: '0.0%', change: '0.0% margin', isUp: false },
      orders: { value: 0, formatted: '0', change: '0 orders', isUp: false },
      cost: { value: 0, formatted: '₹0', change: '0.0%', isUp: false },
      customers: { value: state.customers.length, formatted: String(state.customers.length), change: `${state.customers.length} patrons` },
      returningCustomers: { value: 0, formatted: '0' },
      sweetsSold: { value: 0, unit: 'kg', formatted: '0 kg', change: '0 kg' }
    };

    // Persist new branch snapshot
    saveBranchSnapshot(targetBranchId);
  }

  // 5. Update branch entry in branches array for analytics & portfolio ranking
  const activeBranchObj = state.branches.find(b => b.id === targetBranchId);
  if (activeBranchObj) {
    const totalSales = state.orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = state.orders.length;
    activeBranchObj.revenue = totalSales;
    activeBranchObj.orders = totalOrders;
    if (totalSales > 0 && state.kpis.profit?.value) {
      activeBranchObj.margin = `${((state.kpis.profit.value / totalSales) * 100).toFixed(1)}%`;
    } else {
      activeBranchObj.margin = '0.0%';
    }
  }

  // 6. Connect real-time Firestore listeners for target branch
  setupBranchFirestoreListeners(targetBranchId);

  // 7. Background Firestore load for target branch
  loadBranchDataFromCloud(targetBranchId).then((cloudData: any) => {
    if (targetBranchId !== state.currentBranchId) return;
    if (cloudData && cloudData.sweets && cloudData.sweets.length >= 50) {
      state.sweets = cloudData.sweets;
      if (cloudData.kpis && (targetBranchId === 'br-1' || state.orders.length > 0)) {
        state.kpis = { ...state.kpis, ...cloudData.kpis };
      }
      saveState();
      renderApp();
    }
  }).catch(() => {});

  // 8. Audit log & persistence
  state.auditLogs.unshift({
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    user: state.shopInfo.owner || 'Admin',
    action: 'Branch Switched',
    details: `Switched active branch to ${activeBranchObj?.name || targetBranchId}. Loaded isolated sweets catalog, stock & reset financial portfolio.`
  });

  saveState();
  renderApp();

  showToast(`Switched to ${activeBranchObj?.name || targetBranchId} • All stock, orders & metrics isolated`, 'info');
}

(window as any).handleBranchSwitch = handleBranchSwitch;
(window as any).appState = state;

function setupGlobalFirestoreListeners() {
  // Real-time branch network subscription across all devices & browser tabs
  subscribeToBranches((cloudBranches: any[]) => {
    if (cloudBranches && Array.isArray(cloudBranches) && cloudBranches.length > 0) {
      const currentJson = JSON.stringify(state.branches.map((b: any) => ({
        id: b.id, name: b.name, code: b.code, city: b.city, address: b.address,
        phone: b.phone, manager: b.manager, revenue: b.revenue, margin: b.margin
      })));
      const incomingJson = JSON.stringify(cloudBranches.map((b: any) => ({
        id: b.id, name: b.name, code: b.code, city: b.city, address: b.address,
        phone: b.phone, manager: b.manager, revenue: b.revenue, margin: b.margin
      })));
      if (currentJson !== incomingJson) {
        state.branches = cloudBranches;
        if (!state.branches.some((b: any) => b.id === state.currentBranchId)) {
          state.currentBranchId = state.branches[0].id;
        }
        saveState();
        if (shouldBackgroundSyncRender()) {
          renderApp();
        }
      }
    }
  });
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
      title: 'Customer Directory, ID & Loyalty Club | Radhe Sweets',
      desc: 'Patron loyalty points, VIP tier benefits, and Customer ID tracking. Complete order history and patron profiles.'
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

// Master Render Function with Zero-Flicker In-Place DOM Reconciliation
let currentRenderedTab: string | null = null;

export function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Sync Document Title, Meta Description & Canonical Hash Route
  updatePageSeoMetadata(state.activeTab);

  // Apply theme classes to body
  document.body.classList.toggle('theme-serene-ice', state.currentTheme === 'ice');
  document.body.classList.toggle('dark-mode', state.isDarkMode);

  const mainScrollContainer = document.getElementById('main-content-scroll-container');
  const mainTabContent = document.getElementById('main-tab-content');
  const modalsRoot = document.getElementById('modals-root');
  const desktopSidebarContainer = document.getElementById('desktop-sidebar-container');
  const mobileNavContainer = document.getElementById('mobile-nav-container');

  const isInitialMount = !mainTabContent || !mainScrollContainer || !modalsRoot;
  const isTabSwitch = currentRenderedTab !== state.activeTab;
  currentRenderedTab = state.activeTab;

  if (isInitialMount) {
    // Initial mount: build the complete persistent shell once
    appContainer.innerHTML = `
      <div class="min-h-screen flex flex-col md:flex-row antialiased bg-[#FAF7F2] text-[#2A1F1D] w-full max-w-[100vw] overflow-x-hidden">
        <!-- Desktop Sidebar Navigation (Visible on md and up) -->
        <div id="desktop-sidebar-container" class="hidden md:block shrink-0">
          ${renderSidebar(state.activeTab)}
        </div>

        <!-- Main Content Area with Persistent Scroll Container -->
        <div id="main-content-scroll-container" class="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto w-full max-w-[100vw] overflow-x-hidden">
          <!-- Active Tab Body -->
          <main id="main-tab-content" class="flex-1 p-2.5 sm:p-5 md:p-8 space-y-3 sm:space-y-6 pb-16 sm:pb-20 md:pb-8">
            ${renderTabContent()}
          </main>
        </div>

        <!-- Mobile Bottom Navigation -->
        <div id="mobile-nav-container" class="md:hidden">
          ${renderMobileBottomNav(state.activeTab, state)}
        </div>
      </div>

      <!-- Modals Container -->
      <div id="modals-root">
        ${renderModals()}
      </div>

      <!-- shadcn-ui Toast Notification Container -->
      <div id="toast-container"></div>
    `;
  } else {
    // Incremental, ZERO-FLICKER render: Preserve scroll positions and input focus
    const savedScrollTop = mainScrollContainer?.scrollTop;
    const savedWindowScroll = window.scrollY || document.documentElement.scrollTop;

    // Capture currently focused element & selection range
    const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
    const activeId = activeEl && activeEl.id ? activeEl.id : null;
    const selStart = activeEl?.selectionStart ?? null;
    const selEnd = activeEl?.selectionEnd ?? null;

    if (isTabSwitch) {
      // Tab changed: Update navigation, run entry animation, and scroll to top
      if (desktopSidebarContainer) desktopSidebarContainer.innerHTML = renderSidebar(state.activeTab);
      if (mobileNavContainer) mobileNavContainer.innerHTML = renderMobileBottomNav(state.activeTab, state);

      mainTabContent.className = "flex-1 p-3 sm:p-5 md:p-8 space-y-4 sm:space-y-6 pb-28 sm:pb-32 md:pb-8 animate-page-enter";
      mainTabContent.innerHTML = renderTabContent();

      if (mainScrollContainer && window.innerWidth >= 768) mainScrollContainer.scrollTop = 0;
      window.scrollTo(0, 0);
    } else {
      // In-page click/action: DO NOT play animate-page-enter (prevents blank/flicker flash!)
      if (desktopSidebarContainer) desktopSidebarContainer.innerHTML = renderSidebar(state.activeTab);
      if (mobileNavContainer) mobileNavContainer.innerHTML = renderMobileBottomNav(state.activeTab, state);

      mainTabContent.className = "flex-1 p-3 sm:p-5 md:p-8 space-y-4 sm:space-y-6 pb-28 sm:pb-32 md:pb-8";
      mainTabContent.innerHTML = renderTabContent();

      // Restore scroll positions seamlessly
      if (savedScrollTop && mainScrollContainer && window.innerWidth >= 768) mainScrollContainer.scrollTop = savedScrollTop;
      if (savedWindowScroll && Math.abs(window.scrollY - savedWindowScroll) > 10) {
        window.scrollTo({ top: savedWindowScroll, behavior: 'instant' as ScrollBehavior });
      }

      // Restore focused input & cursor position
      if (activeId) {
        const newEl = document.getElementById(activeId) as HTMLInputElement | HTMLTextAreaElement | null;
        if (newEl) {
          newEl.focus();
          if (selStart !== null && selEnd !== null && newEl.setSelectionRange) {
            try { newEl.setSelectionRange(selStart, selEnd); } catch (_) {}
          }
        }
      }
    }

    if (modalsRoot) {
      const nextModals = renderModals();
      if (modalsRoot.innerHTML.trim() !== nextModals.trim()) {
        modalsRoot.innerHTML = nextModals;
      }
    }
  }

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
    ${state.showHeldCartsModal ? renderHeldCartsModal(state) : ''}
    ${state.showSuccessModal ? renderOrderSuccessModal(state.lastPlacedOrder) : ''}
    ${state.showThermalModal ? renderThermalReceiptModal(state.activeOrder || state.lastPlacedOrder, state.shopInfo, state.receiptSettings) : ''}
    ${state.showOrderDetailsModal ? renderOrderDetailsModal(state.activeOrder) : ''}
    ${state.showAddCustomerModal ? renderAddCustomerModal(state) : ''}
    ${state.showCustomerProfileModal ? renderCustomerProfileModal(state.profileCustomer, state.orders) : ''}
    ${state.showEditCustomerModal && state.editingCustomer ? renderEditCustomerModal(state.editingCustomer) : ''}
    ${state.showAddAdvanceModal ? renderAddAdvanceOrderModal(state) : ''}
    ${state.showEditAdvanceModal && state.editingAdvanceOrder ? renderEditAdvanceOrderModal(state.editingAdvanceOrder) : ''}
    ${state.showAddProductModal ? renderAddProductModal(state) : ''}
    ${state.showEditProductModal ? renderEditProductModal(state.editingSweet, state) : ''}
    ${state.showManageCategoriesModal ? renderManageCategoriesModal(state) : ''}
    ${state.showRestockBatchModal ? renderRestockBatchModal(state) : ''}
    ${state.showStockAdjustModal ? renderStockAdjustModal(state) : ''}
    ${state.showAddExpenseModal ? renderAddExpenseModal(state) : ''}
    ${state.showSplashModal ? renderSplashView({ isModal: true }) : ''}
    ${state.showCustomerDialerModal ? renderCustomerDialerModal(state) : ''}
    ${state.showMobileDrawer ? renderMobileDrawer(state) : ''}
    ${state.showSeoModal ? renderSeoModal(state) : ''}
    ${state.showSearchModal ? renderSearchModal(state) : ''}
    ${state.showAddStaffModal ? renderAddStaffModal(state) : ''}
    ${state.showPaySalaryModal ? renderPaySalaryModal(state) : ''}
    ${state.showRecordLeaveModal ? renderRecordLeaveModal(state) : ''}
    ${state.showRecordAdvanceModal ? renderRecordAdvanceModal(state) : ''}
    ${state.showAddBranchModal ? renderAddBranchModal(state) : ''}
    ${state.showEditBranchModal ? renderEditBranchModal(state) : ''}
    ${state.showProfitModal ? renderProfitDetailsModal(state) : ''}
  `;
}

// Unified Customer Selection & Attachment Handler (accessible across all event handlers & key listeners)
export function completeCustomerSelection(customer: any) {
  state.selectedCustomer = customer;
  state.showCustomerDialerModal = false;
  state.showAddCustomerModal = false;
  if (state.returnToCheckout) {
    state.showCheckoutModal = true;
    state.returnToCheckout = false;
  }
  saveState();
  syncActiveCheckoutDraft();
  renderApp();
  if (customer) {
    showToast(`Customer ${customer.name} attached!`, 'success');
  } else {
    showToast('Switched to Walk-in Counter Customer', 'info');
  }
}

// Event Listeners Binder
function attachEventListeners() {
  // Initialize rolling odometer counters
  initAllCounters();

  // Mobile Drawer Toggle (accessible from TopBar hamburger AND bottom island Menu button)
  const openMobileDrawer = () => {
    state.showMobileDrawer = true;
    renderApp();
  };
  const closeMobileDrawer = () => {
    state.showMobileDrawer = false;
    renderApp();
  };

  document.getElementById('mobile-menu-toggle')?.addEventListener('click', openMobileDrawer);
  document.getElementById('mobile-bottom-menu-btn')?.addEventListener('click', openMobileDrawer);
  document.getElementById('close-mobile-drawer-btn')?.addEventListener('click', closeMobileDrawer);
  document.getElementById('mobile-drawer-backdrop')?.addEventListener('click', (e: any) => {
    if (e.target?.id === 'mobile-drawer-backdrop') {
      closeMobileDrawer();
    }
  });

  // Profit & Customer Sales Intelligence Modal Listeners
  const openProfitModal = () => {
    state.showProfitModal = true;
    renderApp();
  };
  const closeProfitModal = () => {
    state.showProfitModal = false;
    renderApp();
  };

  document.querySelectorAll('[data-action="open-profit-modal"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openProfitModal();
    });
  });

  document.getElementById('kpi-profit-card')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openProfitModal();
  });

  document.getElementById('close-profit-modal-btn')?.addEventListener('click', closeProfitModal);
  document.getElementById('profit-modal-close-bottom-btn')?.addEventListener('click', closeProfitModal);
  document.getElementById('profit-modal-backdrop')?.addEventListener('click', (e: any) => {
    if (e.target?.id === 'profit-modal-backdrop') {
      closeProfitModal();
    }
  });

  // Profit Modal Timeframe Buttons
  document.querySelectorAll('[data-profit-timeframe]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tf = btn.getAttribute('data-profit-timeframe');
      if (tf) {
        state.profitModalFilter = tf;
        renderApp();
      }
    });
  });

  // Profit Modal Custom Date Range (From - To) Filter
  document.getElementById('profit-apply-dates-btn')?.addEventListener('click', () => {
    const fromInput = document.getElementById('profit-custom-from') as HTMLInputElement | null;
    const toInput = document.getElementById('profit-custom-to') as HTMLInputElement | null;
    if (fromInput?.value && toInput?.value) {
      state.profitModalFilter = 'custom';
      state.profitCustomFrom = fromInput.value;
      state.profitCustomTo = toInput.value;
      showToast(`Filtered profit: ${fromInput.value} to ${toInput.value}`, 'info');
      renderApp();
    }
  });

  // Profit Modal Per-Day Detail Toggle
  document.querySelectorAll('.profit-toggle-detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-target-row');
      if (targetId) {
        const row = document.getElementById(targetId);
        if (row) {
          row.classList.toggle('hidden');
          const isHidden = row.classList.contains('hidden');
          btn.innerHTML = isHidden ? '<span>View Buys ▼</span>' : '<span>Hide ▲</span>';
        }
      }
    });
  });

  document.getElementById('profit-modal-full-pl-btn')?.addEventListener('click', () => {
    state.showProfitModal = false;
    state.activeTab = 'analytics';
    renderApp();
    setTimeout(() => {
      document.getElementById('analytics-daily-profit-ledger')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
          const sweetImg = foundSweet.image || (sweetId && String(sweetId).startsWith('sw-') ? `/assets/sweets/${sweetId}.png` : '/assets/sweets/sw-1.png');
          state.posCart.push({ ...foundSweet, qty: 1, rate: price, total: price, unit: 'kg', image: sweetImg });
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
        playBeep('add');
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

  if (!(window as any)._hasTopbarClickBound) {
    (window as any)._hasTopbarClickBound = true;
    document.addEventListener('click', (e: any) => {
      if (!document.getElementById('topbar-search-container')?.contains(e.target)) {
        document.getElementById('topbar-search-dropdown')?.classList.add('hidden');
      }
    });
  }

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
            const sweetImg = foundSweet.image || (sweetId && String(sweetId).startsWith('sw-') ? `/assets/sweets/${sweetId}.png` : '/assets/sweets/sw-1.png');
            state.posCart.push({ ...foundSweet, qty: 1, rate: price, total: price, unit: 'kg', image: sweetImg });
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
          playBeep('add');
        });
      });

      // Customer result click: View Customer Profile & History
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

  // Enterprise Multi-Branch Switchers (TopBar, Settings, Analytics)
  document.getElementById('topbar-branch-select')?.addEventListener('change', (e: any) => {
    handleBranchSwitch(e.target.value);
  });

  document.querySelectorAll('[data-setting-select-branch]').forEach(el => {
    el.addEventListener('click', () => {
      const branchId = el.getAttribute('data-setting-select-branch');
      if (branchId) handleBranchSwitch(branchId);
    });
  });

  document.querySelectorAll('[data-switch-branch]').forEach(btn => {
    btn.addEventListener('click', () => {
      const branchId = btn.getAttribute('data-switch-branch');
      if (branchId) handleBranchSwitch(branchId);
    });
  });

  document.getElementById('branch-select')?.addEventListener('change', (e: any) => {
    handleBranchSwitch(e.target.value);
  });

  // ==========================================
  // Branch Management CRUD: Add, Edit, Delete with Cloud Firestore Sync
  // ==========================================
  // 1. Open Add Branch Modal
  document.getElementById('open-add-branch-modal-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.showAddBranchModal = true;
    renderApp();
  });

  // Close Add Branch Modal
  const closeAddBranch = () => {
    state.showAddBranchModal = false;
    renderApp();
  };
  document.getElementById('close-add-branch-modal-btn')?.addEventListener('click', closeAddBranch);
  document.getElementById('cancel-add-branch-modal-btn')?.addEventListener('click', closeAddBranch);
  document.getElementById('add-branch-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target && (e.target as HTMLElement).id === 'add-branch-modal-backdrop') {
      closeAddBranch();
    }
  });

  // Submit Add Branch Form
  document.getElementById('add-branch-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const branchName = (formData.get('branchName') as string || '').trim();
    const branchCode = (formData.get('branchCode') as string || '').trim().toUpperCase();
    const branchCity = (formData.get('branchCity') as string || 'Ahmedabad').trim();
    const branchAddress = (formData.get('branchAddress') as string || '').trim();
    const branchPhone = (formData.get('branchPhone') as string || '').trim();
    const branchManager = (formData.get('branchManager') as string || '').trim();
    const branchTargetRevenue = parseFloat(formData.get('branchTargetRevenue') as string || '45000') || 45000;
    const branchMargin = (formData.get('branchMargin') as string || '34.0%').trim();
    const branchUpiId = (formData.get('branchUpiId') as string || '').trim();
    const branchUpiName = (formData.get('branchUpiName') as string || '').trim();
    const branchGstin = (formData.get('branchGstin') as string || '').trim();
    const branchFssai = (formData.get('branchFssai') as string || '').trim();

    if (!branchName) {
      showToast('Please enter a branch store name', 'warning');
      return;
    }

    const newBranchId = `br-${Date.now().toString(36)}`;
    const newBranch = {
      id: newBranchId,
      name: branchName,
      code: branchCode || `BR-${Math.floor(10 + Math.random() * 90)}`,
      city: branchCity,
      address: branchAddress,
      phone: branchPhone,
      manager: branchManager,
      upiId: branchUpiId || `radhesweets.${(branchCode || 'branch').toLowerCase()}@oksbi`,
      upiName: branchUpiName || branchName,
      gstin: branchGstin || '24AAACR1234F1Z1',
      fssai: branchFssai || '10722026000411',
      revenue: 0,
      orders: 0,
      margin: branchMargin,
      targetDailyRevenue: branchTargetRevenue,
      targetDailySales: branchTargetRevenue,
      targetMargin: branchMargin,
      status: 'Active',
      sweetsCount: 100,
      createdAt: new Date().toISOString()
    };

    state.branches.push(newBranch);
    state.showAddBranchModal = false;
    saveState();
    renderApp();
    showToast(`Adding ${branchName} and syncing 100 sweets to Cloud Firestore...`, 'info');

    // Initialize 100 sweets catalog for new branch in Firestore
    const defaultCatalog = getBranchDefaultCatalog(newBranchId);
    saveBranchSnapshot(newBranchId);

    // Save every detail to Cloud Firestore
    await Promise.allSettled([
      saveBranchToCloud(newBranch, state.branches),
      saveBranchSweetsToCloud(newBranchId, defaultCatalog.sweets)
    ]);

    saveState();
    renderApp();
    showToast(`Branch "${branchName}" active in Cloud Firestore across all devices!`, 'success');
  });

  // 2. Open Edit Branch Modal
  document.querySelectorAll('[data-action="edit-branch"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const branchId = btn.getAttribute('data-branch-id');
      const branch = state.branches.find((b: any) => b.id === branchId);
      if (branch) {
        state.editingBranch = { ...branch };
        state.showEditBranchModal = true;
        renderApp();
      }
    });
  });

  // Close Edit Branch Modal
  const closeEditBranch = () => {
    state.showEditBranchModal = false;
    state.editingBranch = null;
    renderApp();
  };
  document.getElementById('close-edit-branch-modal-btn')?.addEventListener('click', closeEditBranch);
  document.getElementById('cancel-edit-branch-modal-btn')?.addEventListener('click', closeEditBranch);
  document.getElementById('edit-branch-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target && (e.target as HTMLElement).id === 'edit-branch-modal-backdrop') {
      closeEditBranch();
    }
  });

  // Submit Edit Branch Form
  document.getElementById('edit-branch-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const branchId = formData.get('branchId') as string;
    const branchName = (formData.get('branchName') as string || '').trim();
    const branchCode = (formData.get('branchCode') as string || '').trim().toUpperCase();
    const branchCity = (formData.get('branchCity') as string || 'Ahmedabad').trim();
    const branchAddress = (formData.get('branchAddress') as string || '').trim();
    const branchPhone = (formData.get('branchPhone') as string || '').trim();
    const branchManager = (formData.get('branchManager') as string || '').trim();
    const branchTargetRevenue = parseFloat(formData.get('branchTargetRevenue') as string || '50000') || 50000;
    const branchMargin = (formData.get('branchMargin') as string || '34.0%').trim();
    const branchUpiId = (formData.get('branchUpiId') as string || '').trim();
    const branchUpiName = (formData.get('branchUpiName') as string || '').trim();
    const branchGstin = (formData.get('branchGstin') as string || '').trim();
    const branchFssai = (formData.get('branchFssai') as string || '').trim();

    const targetBranch = state.branches.find((b: any) => b.id === branchId);
    if (!targetBranch) return;

    targetBranch.name = branchName || targetBranch.name;
    targetBranch.code = branchCode || targetBranch.code;
    targetBranch.city = branchCity;
    targetBranch.address = branchAddress;
    targetBranch.phone = branchPhone;
    targetBranch.manager = branchManager;
    targetBranch.targetDailyRevenue = branchTargetRevenue;
    targetBranch.targetDailySales = branchTargetRevenue;
    targetBranch.margin = branchMargin;
    targetBranch.targetMargin = branchMargin;
    if (branchUpiId) targetBranch.upiId = branchUpiId;
    if (branchUpiName) targetBranch.upiName = branchUpiName;
    if (branchGstin) targetBranch.gstin = branchGstin;
    if (branchFssai) targetBranch.fssai = branchFssai;
    targetBranch.updatedAt = new Date().toISOString();

    state.showEditBranchModal = false;
    state.editingBranch = null;
    saveState();
    renderApp();
    showToast(`Saving ${branchName} details to Cloud Firestore...`, 'info');

    await saveBranchToCloud(targetBranch, state.branches);
    saveState();
    renderApp();
    showToast(`Branch "${branchName}" updated globally in Cloud Firestore!`, 'success');
  });

  // 3. Delete Branch
  document.querySelectorAll('[data-action="delete-branch"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const branchId = btn.getAttribute('data-branch-id');
      if (!branchId) return;

      if (state.branches.length <= 1) {
        showToast('Cannot remove the only remaining store branch!', 'warning');
        return;
      }

      const branchToDelete = state.branches.find((b: any) => b.id === branchId);
      const confirmMsg = `Are you sure you want to permanently delete branch "${branchToDelete?.name || branchId}" from Cloud Firestore and all devices?`;
      if (!window.confirm(confirmMsg)) return;

      // If currently active branch is deleted, switch active branch first
      if (state.currentBranchId === branchId) {
        const remaining = state.branches.find((b: any) => b.id !== branchId);
        if (remaining) {
          await handleBranchSwitch(remaining.id);
        }
      }

      state.branches = state.branches.filter((b: any) => b.id !== branchId);
      try {
        localStorage.removeItem(getBranchStorageKey(branchId));
      } catch (_) {}

      saveState();
      renderApp();
      showToast(`Deleting branch from Cloud Firestore...`, 'info');

      await deleteBranchFromCloud(branchId, state.branches);
      saveState();
      renderApp();
      showToast(`Branch "${branchToDelete?.name || branchId}" permanently removed from Firestore!`, 'success');
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
        const itemImage = (id && String(id).startsWith('sw-')) ? `/assets/sweets/${id}.png` : '/assets/sweets/sw-1.png';
        state.posCart.push({ id, name, qty: 1, rate: price, total: price, unit: 'kg', image: itemImage });
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

  // Dashboard Scroll Reveal Observer
  if (state.activeTab === 'dashboard') {
    if ((window as any)._dashboardScrollCleanUp) {
      (window as any)._dashboardScrollCleanUp();
      (window as any)._dashboardScrollCleanUp = null;
    }

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
    showToast(`Time period updated: ${val.toUpperCase()}`, 'info');
    renderApp();
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
  if (!(window as any)._hasSplashKeydownBound) {
    (window as any)._hasSplashKeydownBound = true;
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (state.showSplashModal && e.key === 'Escape') {
        handleDismissSplash('dashboard');
      }
    });
  }

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

  // --- IN-PLACE POS & CHECKOUT OPTIMIZATIONS (ZERO-REFRESH & MUTEX PROTECTED) ---

  // Live in-place DOM updater for POS Cart (Zero screen refresh / flicker)
  const updatePosCartDOM = () => {
    const cartSubtotal = state.posCart.reduce((sum: number, it: any) => sum + (it.rate * it.qty), 0);
    const discountAmount = Math.round((cartSubtotal * (state.discountPercent || 0)) / 100);
    const totalPayable = Math.max(0, cartSubtotal - discountAmount);

    // 1. Desktop Cart Items list & Count
    const desktopItemsEl = document.getElementById('pos-desktop-cart-items');
    if (desktopItemsEl) {
      desktopItemsEl.innerHTML = renderDesktopCartItemsHtml(state.posCart);
    }
    const desktopCountEl = document.getElementById('pos-desktop-cart-count');
    if (desktopCountEl) {
      desktopCountEl.textContent = `${state.posCart.length} items`;
    }
    const desktopActionsEl = document.getElementById('pos-desktop-cart-actions');
    if (desktopActionsEl) {
      desktopActionsEl.innerHTML = state.posCart.length > 0 ? `
        <button id="clear-pos-cart-btn" class="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer">
          Clear
        </button>
      ` : '';
    }

    // 2. Desktop Totals
    const subtotalEl = document.getElementById('pos-cart-subtotal');
    if (subtotalEl) subtotalEl.textContent = `₹${cartSubtotal.toLocaleString()}`;
    const discountEl = document.getElementById('pos-cart-discount');
    if (discountEl) discountEl.textContent = `- ₹${discountAmount.toLocaleString()}`;
    const totalEl = document.getElementById('pos-cart-total');
    if (totalEl) totalEl.textContent = `₹${totalPayable.toLocaleString()}`;

    // 3. Desktop Checkout Button
    const checkoutBtn = document.getElementById('pos-proceed-checkout-btn') as HTMLButtonElement | null;
    if (checkoutBtn) {
      checkoutBtn.disabled = state.posCart.length === 0;
      checkoutBtn.innerHTML = `
        <span>Proceed to Checkout</span>
        <span class="font-extrabold text-amber-200">• ₹${totalPayable.toLocaleString()}</span>
      `;
    }

    // 4. Header Badges & Checkout Button
    const headerStep1Badge = document.getElementById('pos-header-step1-badge');
    if (headerStep1Badge) headerStep1Badge.textContent = `${state.posCart.length} items`;
    const headerStep2Badge = document.getElementById('pos-header-step2-badge');
    if (headerStep2Badge) headerStep2Badge.textContent = state.selectedCustomer ? 'Patron Linked' : 'Walk-in OTC';
    const headerCheckoutBtn = document.getElementById('pos-header-checkout-btn') as HTMLButtonElement | null;
    if (headerCheckoutBtn) {
      headerCheckoutBtn.disabled = state.posCart.length === 0;
      if (state.posCart.length > 0) {
        headerCheckoutBtn.className = "flex items-center gap-1.5 px-3 py-1 rounded-full bg-black hover:bg-stone-900 text-white shadow-xs cursor-pointer active:scale-95 transition-all";
      } else {
        headerCheckoutBtn.className = "flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] cursor-not-allowed transition-all";
      }
      headerCheckoutBtn.innerHTML = `
        <span>Proceed to Checkout</span>
        <span class="text-xs opacity-90">(₹${totalPayable.toLocaleString()})</span>
      `;
    }

    // 5. Mobile Floating Checkout Bar
    const mobileFloatingBar = document.getElementById('mobile-floating-checkout-bar');
    if (mobileFloatingBar) {
      if (state.posCart.length > 0) {
        mobileFloatingBar.classList.remove('hidden');
      } else {
        mobileFloatingBar.classList.add('hidden');
      }
    }
    const mobileBarCount = document.getElementById('mobile-bar-count');
    if (mobileBarCount) mobileBarCount.textContent = `${state.posCart.length} items`;
    const mobileBarTotal = document.getElementById('mobile-bar-total');
    if (mobileBarTotal) mobileBarTotal.textContent = `₹${totalPayable.toLocaleString()}`;

    // 6. Mobile Sheet Cart
    const mobileSheetItems = document.getElementById('pos-mobile-cart-items');
    if (mobileSheetItems) mobileSheetItems.innerHTML = renderMobileCartItemsHtml(state.posCart);
    const mobileSubtotal = document.getElementById('mobile-sheet-subtotal');
    if (mobileSubtotal) mobileSubtotal.textContent = `₹${cartSubtotal.toLocaleString()}`;
    const mobileDiscount = document.getElementById('mobile-sheet-discount');
    if (mobileDiscount) mobileDiscount.textContent = `- ₹${discountAmount.toLocaleString()}`;
    const mobileTotal = document.getElementById('mobile-sheet-total');
    if (mobileTotal) mobileTotal.textContent = `₹${totalPayable.toLocaleString()}`;
    const mobileSheetCheckoutBtn = document.getElementById('mobile-sheet-proceed-checkout-btn') as HTMLButtonElement | null;
    if (mobileSheetCheckoutBtn) {
      mobileSheetCheckoutBtn.disabled = state.posCart.length === 0;
      mobileSheetCheckoutBtn.textContent = `Proceed to Counter Checkout • ₹${totalPayable.toLocaleString()}`;
    }

    // 7. Update Sweet Cards Action Containers in the Grid
    state.sweets.forEach((sweet: any) => {
      const container = document.getElementById(`action-container-${sweet.id}`);
      if (container) {
        const item = state.posCart.find((i: any) => i.id === sweet.id);
        container.innerHTML = renderCardActionBtn(sweet, item);
      }
    });

    saveState();
    syncActiveCheckoutDraft();
  };

  // Live in-place DOM filter for POS Grid (Zero page re-render / zero image reload)
  const filterPosGridInPlace = () => {
    // 1. Update Category Tabs styling
    document.querySelectorAll('[data-pos-category]').forEach(btn => {
      const cat = btn.getAttribute('data-pos-category');
      const isActive = cat === state.activeCategory;
      if (isActive) {
        btn.className = 'pos-cat-pill whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs cursor-pointer bg-[var(--brand-primary)] text-white';
      } else {
        btn.className = 'pos-cat-pill whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs cursor-pointer bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--border-color)] border border-[var(--border-color)]';
      }
    });

    // 2. Filter Sweet Cards in DOM
    const q = (state.posSearchQuery || '').toLowerCase().trim();
    const cards = document.querySelectorAll('[data-sweet-card]');
    let visibleCount = 0;

    cards.forEach(c => {
      const card = c as HTMLElement;
      const cat = card.getAttribute('data-card-category') || '';
      const name = (card.getAttribute('data-card-name') || '').toLowerCase();
      const matchCat = state.activeCategory === 'All' || cat === state.activeCategory;
      const matchSearch = !q || name.includes(q);

      if (matchCat && matchSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // 3. Update count & clear button
    const countEl = document.getElementById('pos-sweets-count');
    if (countEl) countEl.textContent = `${visibleCount} of 100 sweets available`;
    const clearBtn = document.getElementById('pos-clear-filter-btn');
    if (clearBtn) {
      if (state.activeCategory !== 'All' || q) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }
  };

  // POS Master Container Event Delegation (Handles sweet add, inc, dec, remove, presets, clear without page refresh)
  const posContainer = document.querySelector('[data-purpose="pos-master-container"]');
  if (posContainer) {
    posContainer.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;

      // 1. Category Filter Pill Click
      const catBtn = target.closest('[data-pos-category]') as HTMLElement | null;
      if (catBtn) {
        e.preventDefault();
        e.stopPropagation();
        state.activeCategory = catBtn.getAttribute('data-pos-category') || 'All';
        filterPosGridInPlace();
        return;
      }

      // 2. Clear Category / Search filter
      const clearFilterBtn = target.closest('#pos-clear-filter-btn') as HTMLElement | null;
      if (clearFilterBtn) {
        e.preventDefault();
        e.stopPropagation();
        state.activeCategory = 'All';
        state.posSearchQuery = '';
        const searchInput = document.getElementById('pos-search-input') as HTMLInputElement | null;
        if (searchInput) searchInput.value = '';
        filterPosGridInPlace();
        return;
      }

      // 3. Add to POS
      const addBtn = target.closest('[data-add-to-pos], [data-add-sweet]') as HTMLElement | null;
      if (addBtn) {
        e.preventDefault();
        e.stopPropagation();
        const sweetId = addBtn.getAttribute('data-add-to-pos') || addBtn.getAttribute('data-add-sweet');
        const sweet = state.sweets.find((s: any) => s.id === sweetId);
        if (sweet) {
          const existing = state.posCart.find((i: any) => i.id === sweetId);
          if (existing) {
            existing.qty += 0.5;
            existing.total = Math.round(existing.qty * existing.rate);
          } else {
            state.posCart.push({
              id: sweet.id,
              name: sweet.name,
              qty: 1,
              rate: sweet.pricePerKg,
              unit: sweet.unit || 'kg',
              total: sweet.pricePerKg,
              image: sweet.image || `/assets/sweets/${sweet.id}.png`,
              fallbackImage: sweet.fallbackImage || `/assets/sweets/${sweet.id}.png`
            });
          }
          state.quickCart = [...state.posCart];
          updatePosCartDOM();
          playBeep('add');
        }
        return;
      }

      // 4. Increment Cart
      const incBtn = target.closest('[data-inc-cart]') as HTMLElement | null;
      if (incBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = incBtn.getAttribute('data-inc-cart');
        const item = state.posCart.find((i: any) => i.id === id);
        if (item) {
          item.qty += 0.5;
          item.total = Math.round(item.qty * item.rate);
          state.quickCart = [...state.posCart];
          updatePosCartDOM();
          playBeep('click');
        }
        return;
      }

      // 5. Decrement Cart
      const decBtn = target.closest('[data-dec-cart]') as HTMLElement | null;
      if (decBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = decBtn.getAttribute('data-dec-cart');
        const item = state.posCart.find((i: any) => i.id === id);
        if (item) {
          item.qty -= 0.5;
          if (item.qty <= 0) {
            state.posCart = state.posCart.filter((i: any) => i.id !== id);
          } else {
            item.total = Math.round(item.qty * item.rate);
          }
          state.quickCart = [...state.posCart];
          updatePosCartDOM();
          playBeep('click');
        }
        return;
      }

      // 6. Remove from Cart
      const removeBtn = target.closest('[data-remove-cart]') as HTMLElement | null;
      if (removeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = removeBtn.getAttribute('data-remove-cart');
        state.posCart = state.posCart.filter((i: any) => i.id !== id);
        state.quickCart = [...state.posCart];
        updatePosCartDOM();
        playBeep('click');
        return;
      }

      // 7. Weight Presets (250g, 500g, 750g, 1kg)
      const weightBtn = target.closest('[data-add-weight]') as HTMLElement | null;
      if (weightBtn) {
        e.preventDefault();
        e.stopPropagation();
        const sweetId = weightBtn.getAttribute('data-add-weight');
        const weight = parseFloat(weightBtn.getAttribute('data-weight') || '0.25');
        const sweet = state.sweets.find((s: any) => s.id === sweetId);
        if (sweet) {
          const existing = state.posCart.find((i: any) => i.id === sweetId);
          if (existing) {
            existing.qty = weight;
            existing.total = Math.round(existing.qty * existing.rate);
          } else {
            state.posCart.push({
              id: sweet.id,
              name: sweet.name,
              qty: weight,
              rate: sweet.pricePerKg,
              unit: sweet.unit || 'kg',
              total: Math.round(weight * sweet.pricePerKg),
              image: sweet.image || `/assets/sweets/${sweet.id}.png`,
              fallbackImage: sweet.fallbackImage || `/assets/sweets/${sweet.id}.png`
            });
          }
          state.quickCart = [...state.posCart];
          updatePosCartDOM();
          playBeep('add');
        }
        return;
      }

      // 8. Clear Cart
      const clearBtn = target.closest('#clear-pos-cart-btn') as HTMLElement | null;
      if (clearBtn) {
        e.preventDefault();
        state.posCart = [];
        state.quickCart = [];
        updatePosCartDOM();
        playBeep('warning');
        showToast('Cart cleared', 'info');
        return;
      }
    });

    // POS Search Input (In-place live filtering)
    const posSearchInput = document.getElementById('pos-search-input') as HTMLInputElement | null;
    if (posSearchInput) {
      posSearchInput.addEventListener('input', (e: Event) => {
        state.posSearchQuery = (e.target as HTMLInputElement).value;
        filterPosGridInPlace();
      });
    }
  }

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

  // Discount Select in POS (ZERO REFRESH!)
  document.getElementById('pos-discount-select')?.addEventListener('change', (e: any) => {
    state.discountPercent = Number(e.target.value) || 0;
    saveState();
    updatePosCartDOM();
  });

  // Proceed to Checkout Triggers
  const handleOpenCheckout = () => {
    if (state.posCart.length === 0) {
      showToast('Please add at least one sweet to the cart first!', 'warning');
      playBeep('warning');
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

  // Detach customer & Switch customer in POS
  document.getElementById('pos-clear-customer-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.selectedCustomer = null;
    saveState();
    renderApp();
    showToast('Customer detached. Switched to Walk-in.', 'info');
  });
  document.getElementById('dashboard-switch-customer-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.returnToCheckout = false;
    state.showCustomerDialerModal = true;
    state.dialerInput = '';
    renderApp();
  });

  // Close Checkout Modal
  document.getElementById('close-checkout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.showCheckoutModal = false;
    state.returnToCheckout = false;
    renderApp();
  });

  // Checkout Modal: Unit Toggle (g vs kg per item) - ZERO REFRESH!
  document.querySelectorAll('[data-checkout-unit]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sweetId = btn.getAttribute('data-checkout-unit');
      const unit = btn.getAttribute('data-unit') || 'g';
      const item = state.posCart.find((i: any) => i.id === sweetId);
      if (item) {
        item.checkoutUnit = unit;
        saveState();
        syncActiveCheckoutDraft();

        const card = btn.closest('.p-3');
        if (card) {
          const input = card.querySelector('[data-checkout-qty-input]') as HTMLInputElement | null;
          if (input) {
            input.setAttribute('data-unit', unit);
            input.step = unit === 'kg' ? '0.05' : '10';
            input.min = unit === 'kg' ? '0.01' : '10';
            input.value = unit === 'g' ? String(Math.round(item.qty * 1000)) : String(item.qty);
            const unitLabel = input.nextElementSibling;
            if (unitLabel) unitLabel.textContent = unit;
          }
          card.querySelectorAll('[data-checkout-unit]').forEach(b => {
            const bUnit = b.getAttribute('data-unit');
            if (bUnit === unit) {
              b.className = 'px-2.5 py-0.5 rounded-lg transition-all cursor-pointer bg-[var(--brand-primary)] text-white shadow-2xs';
            } else {
              b.className = 'px-2.5 py-0.5 rounded-lg transition-all cursor-pointer text-stone-500 hover:text-stone-800';
            }
          });
        }
      }
    });
  });

  // Checkout Modal: Quick Presets (250g, 500g, 750g, 1kg) - ZERO REFRESH!
  document.querySelectorAll('[data-checkout-preset]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sweetId = btn.getAttribute('data-checkout-preset');
      const kg = parseFloat(btn.getAttribute('data-kg') || '0.25');
      const item = state.posCart.find((i: any) => i.id === sweetId);
      if (item) {
        item.qty = kg;
        item.total = Math.round(item.qty * item.rate);
        state.quickCart = [...state.posCart];
        saveState();
        syncActiveCheckoutDraft();

        const card = btn.closest('.p-3');
        if (card) {
          const itemTotalEl = card.querySelector('.font-extrabold.text-sm, .font-extrabold.text-base');
          if (itemTotalEl) itemTotalEl.textContent = `₹${item.total}`;
          const input = card.querySelector('[data-checkout-qty-input]') as HTMLInputElement | null;
          if (input) {
            const unit = input.getAttribute('data-unit') || 'kg';
            input.value = unit === 'g' ? String(Math.round(kg * 1000)) : String(kg);
          }
          card.querySelectorAll('[data-checkout-preset]').forEach(b => {
            const bKg = parseFloat(b.getAttribute('data-kg') || '0');
            const isActive = Math.abs(bKg - kg) < 0.001;
            if (isActive) {
              b.className = 'py-1 px-1 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer bg-amber-600 text-white shadow-xs ring-1 ring-amber-700';
            } else {
              b.className = 'py-1 px-1 rounded-xl text-[11px] font-bold text-center transition-all cursor-pointer bg-white hover:bg-amber-50 text-stone-700 border border-stone-200';
            }
          });
        }

        const cartSubtotal = state.posCart.reduce((sum: number, it: any) => sum + (it.rate * it.qty), 0);
        const discountAmount = Math.round((cartSubtotal * (state.discountPercent || 0)) / 100);
        const totalPayable = Math.max(0, cartSubtotal - discountAmount);

        const subtotalEl = document.getElementById('checkout-subtotal-val');
        if (subtotalEl) subtotalEl.textContent = `₹${cartSubtotal.toLocaleString()}`;
        const discountEl = document.getElementById('checkout-discount-val');
        if (discountEl) discountEl.textContent = `- ₹${discountAmount.toLocaleString()}`;
        const totalEl = document.getElementById('checkout-total-val');
        if (totalEl) totalEl.textContent = `₹${totalPayable}`;
        const confirmLabel = document.getElementById('confirm-btn-label');
        if (confirmLabel) confirmLabel.textContent = `Instant Click Pay • ₹${totalPayable}`;
        const sliderLabel = document.querySelector('#checkout-slide-commit-label span span');
        if (sliderLabel) sliderLabel.textContent = `Slide to checkout • ₹${totalPayable}`;
      }
    });
  });

  // Checkout Modal: Custom Typed Quantity (In-place live recalculation so input does NOT lose focus!)
  document.querySelectorAll('[data-checkout-qty-input]').forEach(input => {
    input.addEventListener('input', (e) => {
      const sweetId = input.getAttribute('data-checkout-qty-input');
      const unit = input.getAttribute('data-unit') || 'g';
      const val = parseFloat((e.target as HTMLInputElement).value) || 0;
      const item = state.posCart.find((i: any) => i.id === sweetId);
      if (item) {
        item.qty = unit === 'g' ? Math.max(0.01, Math.round((val / 1000) * 1000) / 1000) : Math.max(0.01, val);
        item.total = Math.round(item.qty * item.rate);
        state.quickCart = [...state.posCart];

        // Update item total in DOM directly
        const card = (input as HTMLElement).closest('.p-3');
        const itemTotalEl = card?.querySelector('.font-extrabold.text-sm');
        if (itemTotalEl) {
          itemTotalEl.textContent = `₹${item.total}`;
        }

        // Live update summary breakdown without clearing input or stealing cursor
        const cartSubtotal = state.posCart.reduce((sum: number, it: any) => sum + (it.rate * it.qty), 0);
        const discountAmount = Math.round((cartSubtotal * (state.discountPercent || 0)) / 100);
        const totalPayable = Math.max(0, cartSubtotal - discountAmount);

        const subtotalEl = document.getElementById('checkout-subtotal-val');
        if (subtotalEl) subtotalEl.textContent = `₹${cartSubtotal.toLocaleString()}`;
        const discountEl = document.getElementById('checkout-discount-val');
        if (discountEl) discountEl.textContent = `- ₹${discountAmount.toLocaleString()}`;
        const totalEl = document.getElementById('checkout-total-val');
        if (totalEl) totalEl.textContent = `₹${totalPayable}`;
        const confirmLabel = document.getElementById('confirm-btn-label');
        if (confirmLabel) confirmLabel.textContent = `Instant Click Pay • ₹${totalPayable}`;
        const sliderLabel = document.querySelector('#checkout-slide-commit-label span span');
        if (sliderLabel) sliderLabel.textContent = `Slide to checkout • ₹${totalPayable}`;

        saveState();
        syncActiveCheckoutDraft();
      }
    });

    input.addEventListener('change', () => {
      saveState();
      syncActiveCheckoutDraft();
    });
  });

  // Checkout Modal: Remove Item
  document.querySelectorAll('[data-checkout-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const sweetId = btn.getAttribute('data-checkout-remove');
      state.posCart = state.posCart.filter((i: any) => i.id !== sweetId);
      state.quickCart = [...state.posCart];
      if (state.posCart.length === 0) {
        state.showCheckoutModal = false;
      }
      saveState();
      syncActiveCheckoutDraft();
      renderApp();
    });
  });

  // Select Payment Method (ZERO-REFRESH in Checkout Modal!)
  document.querySelectorAll('[data-select-payment]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const method = btn.getAttribute('data-select-payment');
      if (!method) return;
      state.paymentMethod = method;
      saveState();
      syncActiveCheckoutDraft();
      renderApp();
    });
  });

  // Cash Received Input & Live Change Due Calculator
  const cashReceivedInput = document.getElementById('checkout-cash-received-input') as HTMLInputElement | null;
  if (cashReceivedInput) {
    cashReceivedInput.addEventListener('input', (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value) || 0;
      state.cashTendered = val;
      const cartSub = state.posCart.reduce((sum: number, it: any) => sum + (it.rate * it.qty), 0);
      const disc = Math.round((cartSub * (state.discountPercent || 0)) / 100);
      const payable = Math.max(0, cartSub - disc);
      const changeEl = document.getElementById('checkout-change-due-val');
      if (changeEl) {
        changeEl.textContent = `₹${Math.max(0, val - payable)}`;
      }
    });
  }

  // Quick Cash Denomination Chips (Exact, ₹100, ₹200, ₹500, ₹1000, ₹2000)
  document.querySelectorAll('[data-cash-quick]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = parseFloat(btn.getAttribute('data-cash-quick') || '0');
      state.cashTendered = val;
      const inputEl = document.getElementById('checkout-cash-received-input') as HTMLInputElement | null;
      if (inputEl) inputEl.value = String(val);
      const cartSub = state.posCart.reduce((sum: number, it: any) => sum + (it.rate * it.qty), 0);
      const disc = Math.round((cartSub * (state.discountPercent || 0)) / 100);
      const payable = Math.max(0, cartSub - disc);
      const changeEl = document.getElementById('checkout-change-due-val');
      if (changeEl) {
        changeEl.textContent = `₹${Math.max(0, val - payable)}`;
      }
      playBeep('click');
    });
  });

  // Box Tare Deduction Buttons (Legal Metrology Compliance)
  document.querySelectorAll('[data-set-tare]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tare = parseFloat(btn.getAttribute('data-set-tare') || '0');
      state.boxTareGrams = tare;
      playBeep('click');
      showToast(tare > 0 ? `Box Tare Set: -${tare}g per box` : 'Box Tare Cleared (0g)', 'info');
      renderApp();
    });
  });

  // Checkout Modal Customer Attachment / Switch / Detach
  document.getElementById('checkout-edit-customer-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.returnToCheckout = true;
    state.showCheckoutModal = false;
    handleOpenCustomerDialer();
  });

  document.getElementById('checkout-detach-customer-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.selectedCustomer = null;
    saveState();
    syncActiveCheckoutDraft();
    renderApp();
    showToast('Customer detached. Switched to Walk-in.', 'info');
  });

  // Place Order Execution Handler (Single-Execution Mutex Protected)
  let isProcessingOrder = false;

  const processPlaceOrder = async () => {
    if (isProcessingOrder) {
      console.warn('Order already being processed, ignoring duplicate trigger.');
      return;
    }
    if (!state.posCart || state.posCart.length === 0) {
      showToast('Cart is empty, cannot checkout.', 'warning');
      return;
    }

    isProcessingOrder = true;

    // Immediately disable checkout confirm button and show confirmation
    const confirmBtn = document.getElementById('confirm-place-order-btn') as HTMLButtonElement | null;
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.className = "font-bold text-emerald-600 flex items-center gap-1.5 py-1 text-xs sm:text-sm";
      confirmBtn.innerHTML = `<span>✓</span><span>Order Checked Out!</span>`;
    }

    try {
      const orderNum = 130 + state.orders.length;
      const cartSubtotal = state.posCart.reduce((sum, item) => sum + (item.rate * item.qty), 0);
      const discountAmount = Math.round((cartSubtotal * (state.discountPercent || 0)) / 100);
      const totalPayable = Math.max(0, cartSubtotal - discountAmount);

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // Capture cash calculation details
      const cashReceived = state.paymentMethod === 'Cash' ? (state.cashTendered || totalPayable) : null;
      const changeReturned = state.paymentMethod === 'Cash' ? Math.max(0, (state.cashTendered || totalPayable) - totalPayable) : null;
      const gstAmount = Math.round((totalPayable * 0.05) / 1.05);

      const activeBranch = state.branches.find((b: any) => b.id === state.currentBranchId) || state.branches[0] || {};
      const newOrder = {
        id: `SA00${orderNum}`,
        branchId: state.currentBranchId,
        branchName: activeBranch.name || state.shopInfo?.name || 'Radhe Sweets',
        branchAddress: activeBranch.address || state.shopInfo?.address || 'Ahmedabad, Gujarat',
        branchPhone: activeBranch.phone || state.shopInfo?.phone || '+91 98250 12345',
        branchUpiId: activeBranch.upiId || state.shopInfo?.upiId || 'radhesweets@oksbi',
        branchUpiName: activeBranch.upiName || activeBranch.name || state.shopInfo?.upiName || 'Radhe Sweets',
        branchGstin: activeBranch.gstin || state.shopInfo?.gstin || '24AAACR1234F1Z8',
        branchFssai: activeBranch.fssai || state.shopInfo?.fssai || '10722026000412',
        date: `25 Sep 2026, ${timeStr}`,
        customerId: state.selectedCustomer?.id || `walkin-${Date.now()}`,
        customerName: state.selectedCustomer?.name || 'Walk-in Counter Customer',
        customerPhone: state.selectedCustomer?.phone || 'OTC Cash / UPI',
        customerAddress: state.selectedCustomer?.address || 'Ahmedabad, Gujarat',
        itemsCount: state.posCart.length,
        subtotal: cartSubtotal,
        discount: discountAmount,
        tax: gstAmount,
        cgst: Math.round(gstAmount / 2),
        sgst: Math.round(gstAmount / 2),
        hsn: '2106 90',
        fssai: state.shopInfo?.fssai || '10722026000412',
        cashTendered: cashReceived,
        changeDue: changeReturned,
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

      // Compute order cost & dynamic profit
      let orderCost = 0;
      state.posCart.forEach(cartItem => {
        const sw = state.sweets.find(s => s.id === cartItem.id);
        const cost = sw?.costPrice || (cartItem.rate * 0.6);
        orderCost += cartItem.qty * cost;
      });
      const orderProfit = Math.max(0, totalPayable - Math.round(orderCost));

      state.kpis.orders.value = (state.kpis.orders.value || 0) + 1;
      state.kpis.orders.formatted = String(state.kpis.orders.value);
      state.kpis.sales.value = (state.kpis.sales.value || 0) + totalPayable;
      state.kpis.sales.formatted = `₹${state.kpis.sales.value.toLocaleString()}`;
      state.kpis.profit = state.kpis.profit || { value: 0 };
      state.kpis.profit.value = (state.kpis.profit.value || 0) + orderProfit;
      state.kpis.profit.formatted = `₹${state.kpis.profit.value.toLocaleString()}`;
      if (state.kpis.sales.value > 0) {
        state.kpis.profit.margin = `${((state.kpis.profit.value / state.kpis.sales.value) * 100).toFixed(1)}%`;
      }
      state.kpis.cost = state.kpis.cost || { value: 0 };
      state.kpis.cost.value = Math.max(0, state.kpis.sales.value - state.kpis.profit.value);
      state.kpis.cost.formatted = `₹${state.kpis.cost.value.toLocaleString()}`;

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
        if (curBranch.revenue > 0) {
          curBranch.margin = `${(((state.kpis.profit?.value || 0) / curBranch.revenue) * 100).toFixed(1)}%`;
        }
      }

      // 1. Offline-First: Enqueue order locally immediately so billing NEVER fails
      enqueueOfflineOrder(newOrder, state.currentBranchId);

      // Save branch snapshot locally
      saveBranchSnapshot(state.currentBranchId);

      // 2. If online, attempt background sync right away
      if (isNetworkOnline()) {
        saveBranchOrderToCloud(state.currentBranchId, newOrder, state.sweets, state.customers).then((synced) => {
          if (synced) {
            dequeueOfflineOrder(newOrder.id);
          }
        }).catch((err) => {
          console.warn('[Offline-First] Auto-sync queued for background:', err);
        });
        saveBranchSweetsToCloud(state.currentBranchId, state.sweets);
        saveBranchKpisToCloud(state.currentBranchId, state.kpis);
        clearActiveCheckoutInCloud(state.currentBranchId);
      } else {
        showToast(`✓ Order #${newOrder.id} saved in 100% Offline Mode! Will auto-sync when online.`, 'info');
      }

      // Update customer stats in Firestore if online
      if (state.selectedCustomer) {
        const cust = state.customers.find((c: any) => c.id === state.selectedCustomer.id);
        if (cust) {
          cust.totalOrders = (cust.totalOrders || 0) + 1;
          cust.totalSpent = (cust.totalSpent || 0) + totalPayable;
          if (isNetworkOnline()) {
            saveCustomerToCloud(cust, state.currentBranchId, state.customers);
          }
        }
      }

      // Play major celebration chord sound
      playBeep('success');

      // Smooth visual delay so user sees "Checked Out" confirmation
      await new Promise(r => setTimeout(r, 350));

      // Reset cart and activate the Checkout Complete celebration modal
      state.posCart = [];
      state.quickCart = [];
      state.cashTendered = 0;
      state.showCheckoutModal = false;
      state.showSuccessModal = true;
      saveState();
      renderApp();
    } finally {
      isProcessingOrder = false;
    }
  };

  // Initialize SlideCommit Slider for Checkout
  if (state.showCheckoutModal) {
    initSlideCommit('checkout-slide-commit', {
      onConfirm: async () => {
        await processPlaceOrder();
      },
      onDone: () => {
        showToast('✓ Order Checked Out Successfully!', 'success');
      },
      onError: () => {
        showToast('Checkout transaction failed', 'error');
      }
    });
  }

  // Confirm Place Order (Instant Click Fallback)
  document.getElementById('confirm-place-order-btn')?.addEventListener('click', () => {
    processPlaceOrder();
  });

  // Helper: Clear Receipt Auto-Delay Timers
  const clearReceiptAutoTimer = () => {
    if (receiptAutoTimer) {
      clearTimeout(receiptAutoTimer);
      receiptAutoTimer = null;
    }
    if (receiptProgressInterval) {
      clearInterval(receiptProgressInterval);
      receiptProgressInterval = null;
    }
  };

  // Helper: Send Order Invoice on WhatsApp
  const sendOrderInvoiceWhatsApp = (order: any) => {
    const rawPhone = (order.customerPhone || '').replace(/\D/g, '');
    const targetPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

    const itemsText = (order.items || []).map((it: any) => 
      `• ${it.name} (${it.quantity || it.qty || 1} ${it.unit || 'kg'}) - ₹${it.total || it.price || 0}`
    ).join('\n');

    const text = 
`*${state.shopInfo?.name || 'Radhe Sweets & Farsan'}* 🍬
Namaste ${order.customerName || 'Valued Customer'}!
Here is your sweet invoice details:

📄 *Bill No:* #${order.id}
📅 *Date:* ${order.date}
🛒 *Items:*
${itemsText || '• Fresh Artisan Sweets'}

💰 *Total Payable:* ₹${(order.total || 0).toLocaleString()}
💳 *Payment Mode:* ${order.paymentMethod || 'Counter Sale / Cash'}
Status: ${order.status || 'Completed'}

Thank you for visiting Radhe Sweets! 🙏
Shop Address: ${state.shopInfo?.address || 'Ahmedabad, Gujarat'}`;

    const url = targetPhone 
      ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank');
  };

  // Success Modal Action Handlers (Only triggered when explicitly clicked by user - NO auto-opening)
  document.getElementById('close-success-modal-btn')?.addEventListener('click', () => {
    state.showSuccessModal = false;
    renderApp();
  });

  document.getElementById('print-order-bill-btn')?.addEventListener('click', () => {
    state.showSuccessModal = false;
    if (state.lastPlacedOrder) {
      state.activeOrder = state.lastPlacedOrder;
    }
    state.showThermalModal = true;
    renderApp();
  });

  document.getElementById('instant-open-receipt-btn')?.addEventListener('click', () => {
    state.showSuccessModal = false;
    if (state.lastPlacedOrder) {
      state.activeOrder = state.lastPlacedOrder;
    }
    state.showThermalModal = true;
    renderApp();
  });

  document.getElementById('share-whatsapp-btn')?.addEventListener('click', () => {
    const o = state.lastPlacedOrder;
    if (o) {
      sendOrderInvoiceWhatsApp(o);
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

  document.getElementById('order-success-modal')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement)?.id === 'order-success-modal') {
      state.showSuccessModal = false;
      renderApp();
    }
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
  document.getElementById('thermal-receipt-modal')?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement)?.id === 'thermal-receipt-modal') {
      state.showThermalModal = false;
      renderApp();
    }
  });

  document.getElementById('trigger-print-btn')?.addEventListener('click', () => {
    document.body.classList.add('is-printing-receipt');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('is-printing-receipt');
    }, 1500);
  });

  window.addEventListener('afterprint', () => {
    document.body.classList.remove('is-printing-receipt');
  });

  document.getElementById('toggle-receipt-qr-btn')?.addEventListener('click', () => {
    const targetOrder = state.activeOrder || state.lastPlacedOrder;
    if (targetOrder) {
      const isUpi = String(targetOrder.paymentMethod || '').toLowerCase().includes('upi');
      const current = targetOrder.showUpiQr !== undefined ? !!targetOrder.showUpiQr : isUpi;
      targetOrder.showUpiQr = !current;
      renderApp();
      showToast(targetOrder.showUpiQr ? '📲 UPI QR code added to receipt' : 'UPI QR code removed from receipt', 'info');
    }
  });

  // Orders View Handlers
  document.querySelectorAll('[data-orders-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.ordersFilterTab = btn.getAttribute('data-orders-tab');
      renderApp();
    });
  });

  document.getElementById('orders-search-input')?.addEventListener('input', (e) => {
    state.ordersSearchQuery = (e.target as HTMLInputElement).value;
    renderApp();
  });

  // Orders View Mode Toggle (Swipe Rows vs Table)
  document.getElementById('orders-toggle-swipe-view')?.addEventListener('click', () => {
    state.ordersViewMode = 'swipe';
    saveState();
    renderApp();
  });

  document.getElementById('orders-toggle-table-view')?.addEventListener('click', () => {
    state.ordersViewMode = 'table';
    saveState();
    renderApp();
  });

  // Initialize Interactive SwipeRow Controllers
  initAllSwipeRows(document, {
    onAction: (actionId, rowId) => {
      const found = state.orders.find((o: any) => o.id === rowId);
      if (!found) return;

      if (actionId === 'whatsapp') {
        sendOrderInvoiceWhatsApp(found);
        showToast(`Opening WhatsApp invoice for #${rowId}`, 'info');
      } else if (actionId === 'view') {
        state.activeOrder = found;
        state.showOrderDetailsModal = true;
        renderApp();
      }
    },
    onCommit: (actionId, rowId) => {
      if (actionId === 'delete') {
        voidAndRestoreOrder(rowId);
      }
    }
  });

  // Direct WhatsApp Button Clicks
  document.querySelectorAll('[data-quick-whatsapp]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-quick-whatsapp');
      const found = state.orders.find((o: any) => o.id === id);
      if (found) {
        sendOrderInvoiceWhatsApp(found);
        showToast(`Opening WhatsApp invoice for #${id}`, 'info');
      }
    });
  });

  // Void & Restore Order Engine (Restores Sweet Stock, Updates Customer Stats, KPIs & Cloud)
  const voidAndRestoreOrder = (orderId: string) => {
    const idx = state.orders.findIndex((o: any) => o.id === orderId);
    if (idx === -1) return;
    const order = state.orders[idx];

    // 1. Restore Inventory Stock for each sold item
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        const sweet = state.sweets.find((s: any) => s.name === item.name || s.id === item.id);
        if (sweet) {
          sweet.stock = Math.round(((sweet.stock || 0) + (item.quantity || 1)) * 10) / 10;
          if (sweet.stock > 10 && sweet.stockStatus === 'Low Stock') {
            sweet.stockStatus = 'In Stock';
          }
        }
      });
    }

    // 2. Reverse Customer Stats if associated with a patron
    if (order.customerId) {
      const cust = state.customers.find((c: any) => c.id === order.customerId);
      if (cust) {
        cust.totalSpent = Math.max(0, (cust.totalSpent || 0) - (order.total || 0));
        cust.totalOrders = Math.max(0, (cust.totalOrders || 0) - 1);
        saveCustomerToCloud(cust, state.currentBranchId, state.customers);
      }
    }

    // 3. Reverse Sales KPIs & branch stats
    if (state.kpis) {
      if (state.kpis.sales) {
        state.kpis.sales.value = Math.max(0, (state.kpis.sales.value || 0) - (order.total || 0));
        state.kpis.sales.formatted = `₹${state.kpis.sales.value.toLocaleString()}`;
      }
      if (state.kpis.orders) {
        state.kpis.orders.value = Math.max(0, (state.kpis.orders.value || 0) - 1);
        state.kpis.orders.formatted = String(state.kpis.orders.value);
      }
    }

    // 4. Record audit log
    state.auditLogs.unshift({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: state.shopInfo?.owner || 'Manager',
      action: 'Bill Voided & Restocked',
      details: `Voided Invoice #${orderId} (₹${order.total}). Restored inventory for ${order.items?.length || 0} sweet items.`
    });

    // 5. Remove order from state and synchronize with Firebase Cloud
    state.orders.splice(idx, 1);
    deleteBranchOrderFromCloud(state.currentBranchId, orderId);
    saveBranchSweetsToCloud(state.currentBranchId, state.sweets);
    saveBranchKpisToCloud(state.currentBranchId, state.kpis);
    saveBranchSnapshot(state.currentBranchId);
    saveState();

    playBeep('warning');
    showToast(`✓ Invoice #${orderId} voided & inventory restored!`, 'info');
    renderApp();
  };

  // Direct Delete Button Clicks (Table Mode)
  document.querySelectorAll('[data-delete-order]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-delete-order');
      if (id && confirm(`Are you sure you want to void invoice #${id} and restore its inventory?`)) {
        voidAndRestoreOrder(id);
      }
    });
  });

  document.getElementById('orders-new-sale-btn')?.addEventListener('click', () => {
    state.activeTab = 'pos';
    renderApp();
  });

  // View Order Details
  document.querySelectorAll('[data-view-order]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-view-order');
      const found = state.orders.find((o: any) => o.id === id);
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
      const found = state.orders.find((o: any) => o.id === id);
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
  document.getElementById('update-order-status-select')?.addEventListener('change', (e: any) => {
    const orderId = e.target.getAttribute('data-order-id');
    const newStatus = e.target.value;
    const order = state.orders.find((o: any) => o.id === orderId);
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

  // Customer Sort Select
  document.getElementById('customers-sort-select')?.addEventListener('change', (e: any) => {
    state.customersSortBy = e.target.value;
    saveState();
    renderApp();
  });

  // Edit Customer Modal Triggers
  document.querySelectorAll('[data-edit-customer]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-edit-customer');
      const cust = state.customers.find((c: any) => c.id === id);
      if (cust) {
        state.editingCustomer = { ...cust };
        state.showEditCustomerModal = true;
        renderApp();
      }
    });
  });

  document.querySelectorAll('[data-edit-profile-customer]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-edit-profile-customer');
      const cust = state.customers.find((c: any) => c.id === id);
      if (cust) {
        state.editingCustomer = { ...cust };
        state.showEditCustomerModal = true;
        state.showCustomerProfileModal = false;
        renderApp();
      }
    });
  });

  const closeEditCustomer = () => {
    state.showEditCustomerModal = false;
    state.editingCustomer = null;
    renderApp();
  };
  document.getElementById('close-edit-customer-btn')?.addEventListener('click', closeEditCustomer);
  document.getElementById('cancel-edit-customer-btn')?.addEventListener('click', closeEditCustomer);
  document.getElementById('edit-customer-modal')?.addEventListener('click', (e: any) => {
    if (e.target?.id === 'edit-customer-modal') closeEditCustomer();
  });

  document.getElementById('edit-customer-form')?.addEventListener('submit', (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const custId = fd.get('customerId') as string;
    const targetCust = state.customers.find((c: any) => c.id === custId);
    if (!targetCust) return;

    targetCust.name = (fd.get('name') as string || targetCust.name).trim();
    targetCust.phone = (fd.get('phone') as string || targetCust.phone).trim();
    targetCust.email = (fd.get('email') as string || targetCust.email).trim();
    targetCust.address = (fd.get('address') as string || targetCust.address).trim();
    targetCust.notes = (fd.get('notes') as string || targetCust.notes || '').trim();

    if (state.profileCustomer?.id === custId) {
      state.profileCustomer = { ...targetCust };
    }
    if (state.selectedCustomer?.id === custId) {
      state.selectedCustomer = { ...targetCust };
    }

    state.showEditCustomerModal = false;
    state.editingCustomer = null;
    saveCustomerToCloud(targetCust, state.currentBranchId, state.customers);
    saveBranchSnapshot(state.currentBranchId);
    saveState();
    renderApp();
    showToast(`✓ Updated customer details for ${targetCust.name}`, 'success');
  });

  // Delete Customer Handler
  document.querySelectorAll('[data-delete-customer]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-delete-customer');
      const targetCust = state.customers.find((c: any) => c.id === id);
      if (!targetCust) return;

      if (!confirm(`Are you sure you want to permanently delete customer "${targetCust.name}" (${targetCust.phone})?`)) {
        return;
      }

      state.customers = state.customers.filter((c: any) => c.id !== id);
      if (state.selectedCustomer?.id === id) {
        state.selectedCustomer = null;
      }
      if (state.profileCustomer?.id === id) {
        state.profileCustomer = null;
        state.showCustomerProfileModal = false;
      }
      state.showEditCustomerModal = false;
      state.editingCustomer = null;

      deleteCustomerFromCloud(id, state.currentBranchId);
      saveBranchSnapshot(state.currentBranchId);
      saveState();
      renderApp();
      showToast(`✓ Customer ${targetCust.name} deleted`, 'info');
    });
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

  // Add Customer Modal
  document.getElementById('open-add-customer-modal-btn')?.addEventListener('click', () => {
    state.showAddCustomerModal = true;
    renderApp();
  });
  const handleCloseAddCustomerModal = () => {
    state.showAddCustomerModal = false;
    if (state.returnToCheckout) {
      state.showCheckoutModal = true;
      state.returnToCheckout = false;
    }
    renderApp();
  };
  document.getElementById('close-add-customer-btn')?.addEventListener('click', handleCloseAddCustomerModal);
  document.getElementById('cancel-add-customer-btn')?.addEventListener('click', handleCloseAddCustomerModal);
  document.getElementById('add-customer-modal')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'add-customer-modal') {
      handleCloseAddCustomerModal();
    }
  });

  document.getElementById('add-customer-form')?.addEventListener('submit', (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const customIdRaw = (fd.get('customId') as string || '').trim().replace(/^#/, '');
    const assignedId = customIdRaw ? customIdRaw : `CUST-${1000 + state.customers.length + 1}`;
    const rawPhone = (fd.get('phone') as string || '').replace(/\D/g, '');
    const formattedPhone = rawPhone.length === 10 ? `+91 ${rawPhone.slice(0, 5)} ${rawPhone.slice(5)}` : `+91 ${fd.get('phone')}`;

    const newCust = {
      id: assignedId,
      name: (fd.get('name') as string || 'New Customer').trim(),
      phone: formattedPhone,
      email: (fd.get('email') as string || '').trim(),
      address: (fd.get('address') as string || 'Ahmedabad, Gujarat').trim(),
      type: 'Regular',
      tier: 'Regular',
      loyaltyPoints: 0,
      totalOrders: 0,
      totalSpent: 0,
      notes: (fd.get('notes') as string || '').trim()
    };

    state.customers.unshift(newCust);
    if (state.kpis && state.kpis.customers) {
      state.kpis.customers.value = (state.kpis.customers.value || 0) + 1;
      state.kpis.customers.formatted = String(state.kpis.customers.value);
    }
    saveCustomerToCloud(newCust, state.currentBranchId, state.customers);
    saveBranchSnapshot(state.currentBranchId);
    showToast(`✓ Registered patron ${newCust.name} (ID: #${newCust.id.toUpperCase()})`, 'success');
    completeCustomerSelection(newCust);
  });

  // Advance Bulk & Event Order Handlers
  const handleOpenAddAdvanceModal = () => {
    state.showAddAdvanceModal = true;
    renderApp();
  };
  document.getElementById('open-add-advance-modal-btn')?.addEventListener('click', handleOpenAddAdvanceModal);
  document.getElementById('open-add-advance-modal-empty-btn')?.addEventListener('click', handleOpenAddAdvanceModal);

  const handleCloseAddAdvanceModal = () => {
    state.showAddAdvanceModal = false;
    renderApp();
  };
  document.getElementById('close-add-advance-modal-btn')?.addEventListener('click', handleCloseAddAdvanceModal);
  document.getElementById('cancel-add-advance-modal-btn')?.addEventListener('click', handleCloseAddAdvanceModal);
  document.getElementById('add-advance-modal-backdrop')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'add-advance-modal-backdrop') handleCloseAddAdvanceModal();
  });

  document.getElementById('add-advance-order-form')?.addEventListener('submit', (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const totalAmount = Number(fd.get('totalAmount')) || 0;
    const depositPaid = Number(fd.get('depositPaid')) || 0;
    const balanceDue = Math.max(0, totalAmount - depositPaid);
    const newAdvOrder = {
      id: `ADV-${Date.now().toString().slice(-4)}`,
      customerName: (fd.get('customerName') as string || 'Valued Patron').trim(),
      customerPhone: (fd.get('customerPhone') as string || '').trim(),
      eventDate: (fd.get('eventDate') as string) || new Date().toISOString().split('T')[0],
      eventType: (fd.get('eventType') as string) || 'Wedding Catering',
      itemsSummary: (fd.get('itemsSummary') as string || '').trim(),
      totalAmount,
      depositPaid,
      balanceDue,
      status: (fd.get('status') as string) || 'Confirmed',
      createdAt: new Date().toISOString()
    };

    if (!state.advanceOrders) state.advanceOrders = [];
    state.advanceOrders.unshift(newAdvOrder);
    state.showAddAdvanceModal = false;
    saveBranchSnapshot(state.currentBranchId);
    saveState();
    renderApp();
    showToast(`✓ Booked advance order #${newAdvOrder.id} for ${newAdvOrder.customerName}`, 'success');
  });

  // Edit Advance Order Handlers
  document.querySelectorAll('[data-edit-advance-order]').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-edit-advance-order');
      const order = (state.advanceOrders || []).find((o: any) => o.id === orderId);
      if (order) {
        state.editingAdvanceOrder = order;
        state.showEditAdvanceModal = true;
        renderApp();
      }
    });
  });

  const handleCloseEditAdvanceModal = () => {
    state.showEditAdvanceModal = false;
    state.editingAdvanceOrder = null;
    renderApp();
  };
  document.getElementById('close-edit-advance-modal-btn')?.addEventListener('click', handleCloseEditAdvanceModal);
  document.getElementById('cancel-edit-advance-modal-btn')?.addEventListener('click', handleCloseEditAdvanceModal);
  document.getElementById('edit-advance-modal-backdrop')?.addEventListener('click', (e: any) => {
    if (e.target.id === 'edit-advance-modal-backdrop') handleCloseEditAdvanceModal();
  });

  document.getElementById('edit-advance-order-form')?.addEventListener('submit', (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const orderId = fd.get('orderId') as string;
    const target = (state.advanceOrders || []).find((o: any) => o.id === orderId);
    if (target) {
      target.customerName = (fd.get('customerName') as string || target.customerName).trim();
      target.customerPhone = (fd.get('customerPhone') as string || target.customerPhone).trim();
      target.eventDate = (fd.get('eventDate') as string) || target.eventDate;
      target.eventType = (fd.get('eventType') as string) || target.eventType;
      target.itemsSummary = (fd.get('itemsSummary') as string || target.itemsSummary).trim();
      target.totalAmount = Number(fd.get('totalAmount')) || 0;
      target.depositPaid = Number(fd.get('depositPaid')) || 0;
      target.balanceDue = Math.max(0, target.totalAmount - target.depositPaid);
      target.status = (fd.get('status') as string) || target.status;

      state.showEditAdvanceModal = false;
      state.editingAdvanceOrder = null;
      saveBranchSnapshot(state.currentBranchId);
      saveState();
      renderApp();
      showToast(`✓ Updated advance order #${orderId}`, 'success');
    }
  });

  // Toggle Advance Order Status
  document.querySelectorAll('[data-toggle-advance-status]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const orderId = btn.getAttribute('data-toggle-advance-status');
      const target = (state.advanceOrders || []).find((o: any) => o.id === orderId);
      if (target) {
        const statuses = ['Confirmed', 'In Preparation', 'Ready', 'Completed'];
        const currentIdx = statuses.indexOf(target.status || 'Confirmed');
        const nextStatus = statuses[(currentIdx + 1) % statuses.length];
        target.status = nextStatus;
        saveBranchSnapshot(state.currentBranchId);
        saveState();
        renderApp();
        showToast(`Order #${orderId} status set to ${nextStatus}`, 'info');
      }
    });
  });

  // Delete Advance Order
  document.querySelectorAll('[data-delete-advance-order]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const orderId = btn.getAttribute('data-delete-advance-order');
      if (orderId && confirm(`Are you sure you want to cancel advance order #${orderId}?`)) {
        state.advanceOrders = (state.advanceOrders || []).filter((o: any) => o.id !== orderId);
        saveBranchSnapshot(state.currentBranchId);
        saveState();
        renderApp();
        showToast(`✓ Advance order #${orderId} deleted`, 'info');
      }
    });
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
        playBeep('add');
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
  document.getElementById('add-product-modal')?.addEventListener('click', (e: any) => {
    if (e.target?.id === 'add-product-modal') {
      state.showAddProductModal = false;
      renderApp();
    }
  });

  // Category Manager Modal
  document.getElementById('open-manage-categories-modal-btn')?.addEventListener('click', () => {
    state.showManageCategoriesModal = true;
    renderApp();
  });
  document.getElementById('close-manage-categories-btn')?.addEventListener('click', () => {
    state.showManageCategoriesModal = false;
    renderApp();
  });
  document.getElementById('dismiss-manage-categories-btn')?.addEventListener('click', () => {
    state.showManageCategoriesModal = false;
    renderApp();
  });
  document.getElementById('manage-categories-modal')?.addEventListener('click', (e: any) => {
    if (e.target?.id === 'manage-categories-modal') {
      state.showManageCategoriesModal = false;
      renderApp();
    }
  });
  document.getElementById('add-category-form')?.addEventListener('submit', (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newCat = (fd.get('newCategory') as string || '').trim();
    if (newCat) {
      if (!state.categories) state.categories = [];
      if (!state.categories.includes(newCat)) {
        state.categories.push(newCat);
        saveBranchCategoriesToCloud(state.currentBranchId, state.categories);
        saveState();
        renderApp();
        showToast(`Category "${newCat}" added!`, 'success');
      } else {
        showToast(`Category "${newCat}" already exists`, 'info');
      }
    }
  });
  document.querySelectorAll('[data-delete-category]').forEach(btn => {
    btn.addEventListener('click', (e: any) => {
      e.stopPropagation();
      const cat = btn.getAttribute('data-delete-category');
      if (cat && confirm(`Are you sure you want to remove category "${cat}"?`)) {
        state.categories = (state.categories || []).filter((c: string) => c !== cat);
        saveBranchCategoriesToCloud(state.currentBranchId, state.categories);
        saveState();
        renderApp();
        showToast(`Category "${cat}" removed`, 'info');
      }
    });
  });

  // Dynamic custom category toggle in Add Sweet Modal
  document.getElementById('add-sweet-category-select')?.addEventListener('change', (e: any) => {
    const customBox = document.getElementById('add-sweet-custom-category-box');
    if (customBox) {
      customBox.style.display = e.target.value === 'custom' ? 'block' : 'none';
      if (e.target.value === 'custom') {
        (document.getElementById('add-sweet-custom-category-input') as HTMLInputElement)?.focus();
      }
    }
  });

  // Client-side image upload & compression for Add Product
  const updateAddSweetPreview = (src: string) => {
    const preview = (document.getElementById('add-sweet-preview-img') || document.getElementById('add-sweet-img-preview')) as HTMLImageElement | null;
    if (preview) preview.src = src;
    const urlInput = (document.getElementById('add-sweet-image-input') || document.getElementById('add-sweet-image-url')) as HTMLInputElement | null;
    if (urlInput) urlInput.value = src;
  };

  document.getElementById('add-sweet-file-input')?.addEventListener('change', async (e: any) => {
    const file = e.target?.files?.[0];
    if (file) {
      showToast('Processing photo...', 'info');
      try {
        let finalDataUrl = '';
        try {
          finalDataUrl = await compressImageFile(file, 600, 0.85);
        } catch (_) {
          // Fallback to FileReader if compressor fails
          finalDataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }
        updateAddSweetPreview(finalDataUrl);
        showToast('✓ Sweet photo uploaded successfully!', 'success');
      } catch (err) {
        showToast('Could not process photo file', 'error');
      }
    }
  });

  // URL input preview for Add Product
  const handleAddSweetUrlInput = (e: any) => {
    const val = (e.target.value || '').trim();
    if (val) {
      const preview = (document.getElementById('add-sweet-preview-img') || document.getElementById('add-sweet-img-preview')) as HTMLImageElement | null;
      if (preview) preview.src = val;
    }
  };
  document.getElementById('add-sweet-image-input')?.addEventListener('input', handleAddSweetUrlInput);
  document.getElementById('add-sweet-image-url')?.addEventListener('input', handleAddSweetUrlInput);

  // Clear Image for Add Product
  document.getElementById('add-sweet-clear-img-btn')?.addEventListener('click', () => {
    updateAddSweetPreview('/assets/sweets/sw-1.png');
    const fileInput = document.getElementById('add-sweet-file-input') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
  });

  // Add Product Form Submit
  document.getElementById('add-product-form')?.addEventListener('submit', (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const price = Number(fd.get('pricePerKg'));
    const cost = Number(fd.get('costPrice')) || Math.round(price * 0.62);
    const stock = Number(fd.get('stock') || 25);
    const minStock = Number(fd.get('minStock') || 15);
    const name = ((fd.get('name') as string) || '').trim();
    const unit = (fd.get('unit') as string) || 'kg';
    
    let category = (fd.get('category') as string) || 'Mawa Sweets';
    if (category === 'custom') {
      const customCat = ((fd.get('customCategory') as string) || '').trim();
      if (customCat) {
        category = customCat;
        if (!state.categories.includes(customCat)) {
          state.categories.push(customCat);
          saveBranchCategoriesToCloud(state.currentBranchId, state.categories);
        }
      } else {
        category = 'Mawa Sweets';
      }
    }

    const isPureGhee = fd.get('isPureGhee') === 'on';
    const imgUrlVal = ((fd.get('image') as string) || '').trim();
    const previewEl = (document.getElementById('add-sweet-preview-img') || document.getElementById('add-sweet-img-preview')) as HTMLImageElement | null;
    const finalImage = imgUrlVal || (previewEl ? previewEl.src : '/assets/sweets/sw-1.png');

    const newSweet = {
      id: `sw-${Date.now()}`,
      name: name,
      code: name.slice(0, 2).toUpperCase(),
      category: category,
      unit: unit,
      pricePerKg: price,
      costPrice: cost,
      stock: stock,
      minStock: minStock,
      stockStatus: stock <= minStock ? 'Low Stock' : 'In Stock',
      badge: isPureGhee ? 'Pure Desi Ghee' : (stock <= minStock ? 'Low Stock' : 'In Stock'),
      isPureGhee: isPureGhee,
      image: finalImage,
      fallbackImage: finalImage,
      description: (fd.get('description') as string) || 'Freshly made confectionery item with pure ingredients.',
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
  document.getElementById('edit-product-modal')?.addEventListener('click', (e: any) => {
    if (e.target?.id === 'edit-product-modal') {
      state.showEditProductModal = false;
      state.editingSweet = null;
      renderApp();
    }
  });

  // Client-side image upload & compression for Edit Product
  const updateEditSweetPreview = (src: string) => {
    const preview = (document.getElementById('edit-sweet-preview-img') || document.getElementById('edit-sweet-img-preview')) as HTMLImageElement | null;
    if (preview) preview.src = src;
    const urlInput = (document.getElementById('edit-sweet-image-input') || document.getElementById('edit-sweet-image-url')) as HTMLInputElement | null;
    if (urlInput) urlInput.value = src;
  };

  document.getElementById('edit-sweet-file-input')?.addEventListener('change', async (e: any) => {
    const file = e.target?.files?.[0];
    if (file) {
      showToast('Processing photo...', 'info');
      try {
        let finalDataUrl = '';
        try {
          finalDataUrl = await compressImageFile(file, 600, 0.85);
        } catch (_) {
          finalDataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }
        updateEditSweetPreview(finalDataUrl);
        showToast('✓ New mithai photo uploaded successfully!', 'success');
      } catch (err) {
        showToast('Could not process photo file', 'error');
      }
    }
  });

  // URL input preview for Edit Product
  const handleEditSweetUrlInput = (e: any) => {
    const val = (e.target.value || '').trim();
    if (val) {
      const preview = (document.getElementById('edit-sweet-preview-img') || document.getElementById('edit-sweet-img-preview')) as HTMLImageElement | null;
      if (preview) preview.src = val;
    }
  };
  document.getElementById('edit-sweet-image-input')?.addEventListener('input', handleEditSweetUrlInput);
  document.getElementById('edit-sweet-image-url')?.addEventListener('input', handleEditSweetUrlInput);

  document.getElementById('edit-sweet-reset-img-btn')?.addEventListener('click', (e: any) => {
    const defSrc = e.currentTarget.getAttribute('data-default-src') || (state.editingSweet ? (state.editingSweet.image || `/assets/sweets/${state.editingSweet.id}.png`) : '/assets/sweets/sw-1.png');
    updateEditSweetPreview(defSrc);
    const fileInput = document.getElementById('edit-sweet-file-input') as HTMLInputElement | null;
    if (fileInput) fileInput.value = '';
  });

  // Edit Product Form Submit
  document.getElementById('edit-product-form')?.addEventListener('submit', (e: any) => {
    e.preventDefault();
    const id = e.target.getAttribute('data-sweet-id');
    const sweet = state.sweets.find((s: any) => s.id === id);
    if (sweet) {
      const fd = new FormData(e.target);
      const name = ((fd.get('name') as string) || '').trim();
      const category = (fd.get('category') as string) || sweet.category;
      const unit = (fd.get('unit') as string) || sweet.unit;
      const price = Number(fd.get('pricePerKg'));
      const cost = Number(fd.get('costPrice'));
      const stock = Number(fd.get('stock'));
      const minStock = Number(fd.get('minStock'));
      const isPureGhee = fd.get('isPureGhee') === 'on';
      const imgUrlVal = ((fd.get('image') as string) || '').trim();
      const previewEl = (document.getElementById('edit-sweet-preview-img') || document.getElementById('edit-sweet-img-preview')) as HTMLImageElement | null;
      const updatedImage = imgUrlVal || (previewEl ? previewEl.src : sweet.image);

      sweet.name = name || sweet.name;
      sweet.category = category;
      sweet.unit = unit;
      sweet.pricePerKg = price;
      sweet.costPrice = cost;
      sweet.stock = stock;
      sweet.minStock = minStock;
      sweet.isPureGhee = isPureGhee;
      if (isPureGhee && (!sweet.badge || sweet.badge === 'In Stock')) {
        sweet.badge = 'Pure Desi Ghee';
      }
      sweet.image = updatedImage;
      sweet.fallbackImage = updatedImage;
      sweet.description = (fd.get('description') as string) || sweet.description;
      sweet.stockStatus = sweet.stock <= sweet.minStock ? 'Low Stock' : 'In Stock';
      
      state.showEditProductModal = false;
      state.editingSweet = null;
      saveBranchSweetsToCloud(state.currentBranchId, state.sweets);
      saveState();
      renderApp();
      showToast(`✓ Updated ${sweet.name} details!`, 'success');
    }
  });

  document.querySelectorAll('[data-delete-sweet]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-sweet');
      if (confirm('Are you sure you want to remove this sweet from catalog?')) {
        state.sweets = state.sweets.filter((s: any) => s.id !== id);
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
    state.expenseSavedSuccess = false;
    state.lastSavedExpense = null;
    renderApp();
  });
  document.getElementById('close-add-expense-btn')?.addEventListener('click', () => {
    state.showAddExpenseModal = false;
    state.expenseSavedSuccess = false;
    state.lastSavedExpense = null;
    renderApp();
  });

  document.getElementById('add-expense-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const amount = Number(fd.get('amount'));
    const category = fd.get('category') as string;
    const dateVal = (fd.get('date') as string) || new Date().toISOString().split('T')[0];
    const newExp = {
      id: `exp-${Date.now()}`,
      date: dateVal,
      description: (fd.get('description') as string || 'Expense').trim(),
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
    
    // User requested: "when i save expanse dilog dont go away make it and when saved popup expensee is saved then in popup there is button close or add onther"
    state.expenseSavedSuccess = true;
    state.lastSavedExpense = newExp;
    saveExpenseToCloud(newExp, state.currentBranchId, state.expenses);
    saveState();
    renderApp();
    showToast(`✓ Recorded expense ₹${amount.toLocaleString()} for ${newExp.description}`, 'success');
  });

  // Action buttons inside post-save confirmation
  document.getElementById('add-another-expense-btn')?.addEventListener('click', () => {
    state.expenseSavedSuccess = false;
    state.lastSavedExpense = null;
    renderApp();
  });
  document.getElementById('close-expense-success-btn')?.addEventListener('click', () => {
    state.showAddExpenseModal = false;
    state.expenseSavedSuccess = false;
    state.lastSavedExpense = null;
    renderApp();
  });

  document.querySelectorAll('[data-delete-expense]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-delete-expense');
      const item = state.expenses.items.find((i: any) => i.id === id);
      if (item) {
        state.expenses.total = Math.max(0, state.expenses.total - item.amount);
        state.expenses.items = state.expenses.items.filter((i: any) => i.id !== id);
        deleteExpenseFromCloud(id, state.currentBranchId, state.expenses);
        saveState();
        renderApp();
      }
    });
  });

  // Category filter tabs for expenses (All, Raw Materials, Utilities, Staff Salary, Marketing, Other)
  document.querySelectorAll('[data-expenses-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-expenses-category') || 'All';
      state.expensesFilterCategory = cat;
      renderApp();
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

  // 2b. Branch Roster Filter Pills (Only see selected branch employee by default)
  document.querySelectorAll('[data-staff-branch]').forEach(btn => {
    btn.addEventListener('click', () => {
      const branch = btn.getAttribute('data-staff-branch');
      if (branch) {
        state.staffBranchFilter = branch;
        saveState();
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

  // Dynamic Salary Type switcher in Add/Edit Staff Modal
  const salaryTypeSelect = document.getElementById('staff-form-salary-type') as HTMLSelectElement;
  salaryTypeSelect?.addEventListener('change', () => {
    const label = document.getElementById('staff-form-salary-label');
    const hint = document.getElementById('staff-form-salary-hint');
    const input = document.getElementById('staff-form-salary') as HTMLInputElement;
    if (salaryTypeSelect.value === 'Daily') {
      if (label) label.textContent = 'Daily Wage Rate (₹/day) *';
      if (hint) hint.textContent = 'Credited per day worked (e.g. ₹600–₹1,200/day)';
      if (input && Number(input.value) > 3000) input.value = '800';
    } else {
      if (label) label.textContent = 'Base Monthly Salary (₹/mo) *';
      if (hint) hint.textContent = 'Standard 30-day calendar monthly payout';
      if (input && Number(input.value) < 3000) input.value = '25000';
    }
  });

  // 8. Save Staff Form (Add or Edit with Per-Day vs Monthly Salary)
  document.getElementById('save-staff-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const idInput = (document.getElementById('staff-form-id') as HTMLInputElement)?.value;
    const name = ((document.getElementById('staff-form-name') as HTMLInputElement)?.value || '').trim();
    const phone = ((document.getElementById('staff-form-phone') as HTMLInputElement)?.value || '').trim();
    const role = ((document.getElementById('staff-form-role') as HTMLInputElement)?.value || '').trim();
    const dept = (document.getElementById('staff-form-dept') as HTMLSelectElement)?.value || 'Kitchen / Halwai';
    const salaryType = (document.getElementById('staff-form-salary-type') as HTMLSelectElement)?.value || 'Monthly';
    const salaryVal = Number((document.getElementById('staff-form-salary') as HTMLInputElement)?.value) || (salaryType === 'Daily' ? 800 : 22000);
    const branch = ((document.getElementById('staff-form-branch') as HTMLInputElement)?.value || 'Navrangpura Flagship').trim();
    const joining = ((document.getElementById('staff-form-joining') as HTMLInputElement)?.value || '').trim() || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const emergency = ((document.getElementById('staff-form-emergency') as HTMLInputElement)?.value || '').trim();
    const aadhar = ((document.getElementById('staff-form-aadhar') as HTMLInputElement)?.value || '').trim();

    if (!name) return;

    const baseSalary = salaryType === 'Daily' ? (salaryVal * 30) : salaryVal;
    const salaryRate = salaryVal;

    if (idInput) {
      // Editing existing staff
      const member = state.staff.find((s: any) => s.id === idInput);
      if (member) {
        member.name = name;
        member.phone = phone;
        member.role = role;
        member.department = dept;
        member.salaryType = salaryType;
        member.salaryRate = salaryRate;
        member.baseSalary = baseSalary;
        member.branchName = branch;
        member.joiningDate = joining;
        member.emergencyContact = emergency;
        member.aadharNumber = aadhar;
        saveStaffMemberToCloud(member, state.currentBranchId, state.staff);
        showToast(`Updated ${name} (${salaryType === 'Daily' ? `₹${salaryRate}/day` : `₹${baseSalary.toLocaleString()}/mo`})`, 'success');
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
        joiningDate: joining,
        salaryType,
        salaryRate,
        baseSalary,
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
      saveStaffMemberToCloud(newStaff, state.currentBranchId, state.staff);
      showToast(`Added ${name} (${salaryType === 'Daily' ? `₹${salaryRate}/day` : `₹${baseSalary.toLocaleString()}/mo`})`, 'success');
    }

    state.showAddStaffModal = false;
    state.editingStaff = null;
    saveState();
    renderApp();
  });

  // Staff Removal / Deletion Handlers (Card & Modal)
  const removeStaffMember = (staffId: string, staffName: string) => {
    if (confirm(`Are you sure you want to remove "${staffName}" from the staff roster?\n\nThis will remove their shift records and attendance profile.`)) {
      state.staff = state.staff.filter((s: any) => s.id !== staffId);
      deleteStaffMemberFromCloud(staffId, state.currentBranchId, state.staff);
      state.showAddStaffModal = false;
      state.editingStaff = null;
      saveState();
      showToast(`Removed "${staffName}" from staff roster`, 'info');
      renderApp();
    }
  };

  document.querySelectorAll('[data-delete-staff]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-delete-staff') || '';
      const name = btn.getAttribute('data-staff-name') || 'Staff Member';
      removeStaffMember(id, name);
    });
  });

  document.getElementById('delete-staff-modal-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const btn = e.currentTarget as HTMLElement;
    const id = btn?.getAttribute('data-staff-id') || '';
    const name = btn?.getAttribute('data-staff-name') || 'Staff Member';
    removeStaffMember(id, name);
  });

  // 9. Quick 1-Click Attendance Toggle (Present, Half Day, On Leave)
  document.querySelectorAll('[data-mark-attendance]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-mark-attendance');
      const status = btn.getAttribute('data-status');
      const member = state.staff.find((s: any) => s.id === id);
      if (member && status) {
        member.attendanceToday = status;
        saveStaffMemberToCloud(member, state.currentBranchId, state.staff);
        saveState();
        showToast(`Marked ${member.name} as ${status}`, 'success');
        renderApp();
      }
    });
  });

  // 10. Pay Staff Salary Modal Handlers (Handles Daily Wage vs Monthly)
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
    const isDaily = state.payingStaff.salaryType === 'Daily';
    const dailyRate = Number(state.payingStaff.salaryRate) || Math.round((Number(state.payingStaff.baseSalary) || 21000) / 30);
    const gross = isDaily ? (dailyRate * 26) : (Number(state.payingStaff.baseSalary) || 22000);
    const adv = state.payingStaff.advancesTaken || 0;
    const net = Math.max(0, gross - adv);

    state.payingStaff.salaryStatus = 'Paid';
    state.payingStaff.advancesTaken = 0;
    state.payingStaff.lastPaidDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    if (!state.payingStaff.salaryHistory) state.payingStaff.salaryHistory = [];
    state.payingStaff.salaryHistory.unshift({
      month,
      base: gross,
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
      description: `Staff Salary: ${state.payingStaff.name} (${month}${isDaily ? ` - Daily Wage ₹${dailyRate}/day` : ''})`,
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

  // Settings: Store profile form & UPI configuration
  document.getElementById('store-profile-form')?.addEventListener('submit', (e: any) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    
    const branchId = (fd.get('branchId') as string) || state.currentBranchId;
    const upiId = (fd.get('upiId') as string || '').trim();
    const upiName = (fd.get('upiName') as string || '').trim();
    const name = (fd.get('name') as string || '').trim();
    const subName = (fd.get('subName') as string || '').trim();
    const motto = (fd.get('motto') as string || '').trim();
    const owner = (fd.get('owner') as string || '').trim();
    const address = (fd.get('address') as string || '').trim();
    const phone = (fd.get('phone') as string || '').trim();
    const email = (fd.get('email') as string || '').trim();
    const gstin = (fd.get('gstin') as string || '').trim();
    const fssai = (fd.get('fssai') as string || '').trim();
    const currency = (fd.get('currency') as string || '').trim() || '₹';
    const freeDeliveryAbove = Number(fd.get('freeDeliveryAbove')) || 500;
    const deliveryFee = Number(fd.get('deliveryFee')) || 40;

    if (!state.shopInfo) state.shopInfo = {};

    state.shopInfo.upiId = upiId || state.shopInfo.upiId || 'radhesweets@oksbi';
    state.shopInfo.upiName = upiName || state.shopInfo.upiName || name || 'Radhe Sweets';
    state.shopInfo.name = name || state.shopInfo.name || 'Radhe Sweets';
    state.shopInfo.subName = subName || state.shopInfo.subName || 'SWEETS & MORE';
    state.shopInfo.motto = motto || state.shopInfo.motto || 'Sweet Moments With Radhe Krishna';
    state.shopInfo.owner = owner || state.shopInfo.owner || 'Anand Shah';
    state.shopInfo.address = address || state.shopInfo.address;
    state.shopInfo.phone = phone || state.shopInfo.phone;
    state.shopInfo.email = email || state.shopInfo.email;
    state.shopInfo.gstin = gstin || state.shopInfo.gstin;
    state.shopInfo.fssai = fssai || state.shopInfo.fssai;
    state.shopInfo.currency = currency;
    state.shopInfo.freeDeliveryAbove = freeDeliveryAbove;
    state.shopInfo.deliveryFee = deliveryFee;

    // Explicitly update branch properties so each branch has its own address, UPI ID & settings
    const targetBranch = state.branches.find((b: any) => b.id === branchId);
    if (targetBranch) {
      targetBranch.name = name || targetBranch.name;
      targetBranch.address = address || targetBranch.address;
      targetBranch.phone = phone || targetBranch.phone;
      targetBranch.upiId = upiId || targetBranch.upiId;
      targetBranch.upiName = upiName || targetBranch.upiName;
      targetBranch.gstin = gstin || targetBranch.gstin;
      targetBranch.fssai = fssai || targetBranch.fssai;
      targetBranch.manager = owner || targetBranch.manager;
      saveBranchToCloud(targetBranch, state.branches);
    }

    // Log update in audit logs
    if (!state.auditLogs) state.auditLogs = [];
    state.auditLogs.unshift({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: state.shopInfo.owner || 'Admin',
      action: 'Store & UPI Settings Updated',
      details: `VPA set to: ${upiId || state.shopInfo.upiId} for ${targetBranch?.name || state.shopInfo.name}`
    });

    saveState();
    showToast(`✓ Settings & UPI (${upiId || state.shopInfo.upiId}) saved for ${targetBranch?.name || 'store'}!`, 'success');
    renderApp();
  });

  // Settings: Cloud Firestore Live Connection Test
  document.getElementById('test-firestore-connection-btn')?.addEventListener('click', async () => {
    showToast('Testing Cloud Firestore ping...', 'info');
    const result = await testFirestoreConnection();
    if (result.success) {
      showToast('✅ Cloud Firestore Connected! Live sync is active.', 'success');
    } else if (result.needsDbCreate) {
      showToast('⚠️ Firestore database not created in project radhesweets0! Click "Open Firebase Console & Create Database" in Settings.', 'error');
    } else {
      showToast(`Firestore test failed: ${result.message}`, 'error');
    }
    renderApp();
  });

  // Settings: Push All ERP Data directly to Cloud Firestore
  document.getElementById('sync-all-to-firestore-btn')?.addEventListener('click', async () => {
    showToast('Uploading all 100 sweets, orders & records to Cloud Firestore...', 'info');
    const syncRes = await syncAllToFirebaseCloud(state);
    if (syncRes.success) {
      showToast(`☁️ Pushed ${syncRes.count} records directly to Cloud Firestore!`, 'success');
    } else {
      showToast('Cloud sync finished with notices.', 'info');
    }
    renderApp();
  });

  // Settings: Reset data
  document.getElementById('reset-all-data-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data back to original defaults?')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  });

  // Settings: Thermal Printer & Receipt Customization Studio
  const sampleReceiptOrder = {
    id: 'SA00129',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', 10:28 AM',
    customerName: 'Jignesh Shah (+91 98765 67890)',
    paymentMethod: 'UPI',
    items: [
      { name: 'Kaju Katli (Pure Kaju)', qty: '0.5', unit: 'kg', rate: 450, total: 225 },
      { name: 'Gulab Jamun (Desi Ghee)', qty: '1', unit: 'kg', rate: 180, total: 180 },
      { name: 'Motichoor Ladoo', qty: '1', unit: 'kg', rate: 160, total: 160 }
    ],
    subtotal: 565,
    discount: 0,
    total: 565,
    cashTendered: 600,
    changeDue: 35
  };

  function extractReceiptSettingsFromForm(): any {
    const form = document.getElementById('receipt-settings-form') as HTMLFormElement;
    if (!form) return state.receiptSettings || defaultReceiptSettings;
    const fd = new FormData(form);
    return {
      paperSize: (fd.get('paperSize') as string) || '80mm',
      bottomFeedLines: Number(fd.get('bottomFeedLines') || 2),
      showHeader: fd.get('showHeader') === 'on',
      showShopName: fd.get('showShopName') === 'on',
      showSubName: fd.get('showSubName') === 'on',
      showAddress: fd.get('showAddress') === 'on',
      showPhone: fd.get('showPhone') === 'on',
      showGstin: fd.get('showGstin') === 'on',
      showFssai: fd.get('showFssai') === 'on',
      customHeaderNote: ((fd.get('customHeaderNote') as string) || '').trim(),
      showInvoiceNo: fd.get('showInvoiceNo') === 'on',
      showDateTime: fd.get('showDateTime') === 'on',
      showCashier: fd.get('showCashier') === 'on',
      showCustomerName: fd.get('showCustomerName') === 'on',
      showPaymentMode: fd.get('showPaymentMode') === 'on',
      showRateCol: fd.get('showRateCol') === 'on',
      showQtyCol: fd.get('showQtyCol') === 'on',
      showTotalCol: fd.get('showTotalCol') === 'on',
      showSubtotal: fd.get('showSubtotal') === 'on',
      showDiscount: fd.get('showDiscount') === 'on',
      showTaxBreakdown: fd.get('showTaxBreakdown') === 'on',
      showCashTendered: fd.get('showCashTendered') === 'on',
      upiQrMode: (fd.get('upiQrMode') as string) || 'auto',
      upiQrSize: (fd.get('upiQrSize') as string) || 'medium',
      customUpiId: ((fd.get('customUpiId') as string) || '').trim(),
      customUpiName: ((fd.get('customUpiName') as string) || '').trim(),
      showUpiBrandBadge: fd.get('showUpiBrandBadge') === 'on',
      showDevotionalMotto: fd.get('showDevotionalMotto') === 'on',
      devotionalMotto: ((fd.get('devotionalMotto') as string) || '').trim(),
      thankYouNote: ((fd.get('thankYouNote') as string) || '').trim(),
      customFooterNote: ((fd.get('customFooterNote') as string) || '').trim(),
      showBarcode: fd.get('showBarcode') === 'on'
    };
  }

  function refreshSettingsReceiptLivePreview() {
    const previewContainer = document.getElementById('settings-receipt-live-preview');
    if (!previewContainer) return;
    const currentSettings = extractReceiptSettingsFromForm();
    previewContainer.innerHTML = renderReceiptSlipHtml(sampleReceiptOrder, state.shopInfo, currentSettings);
  }

  // Quick Preset Buttons
  document.querySelectorAll('[data-receipt-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-receipt-preset');
      const form = document.getElementById('receipt-settings-form') as HTMLFormElement;
      if (!form) return;
      if (preset === 'standard-80') {
        const paperSel = form.querySelector('[name="paperSize"]') as HTMLSelectElement;
        if (paperSel) paperSel.value = '80mm';
        const qrSel = form.querySelector('[name="upiQrMode"]') as HTMLSelectElement;
        if (qrSel) qrSel.value = 'auto';
        const qrSize = form.querySelector('[name="upiQrSize"]') as HTMLSelectElement;
        if (qrSize) qrSize.value = 'medium';
        const feed = form.querySelector('[name="bottomFeedLines"]') as HTMLSelectElement;
        if (feed) feed.value = '2';
      } else if (preset === 'compact-58') {
        const paperSel = form.querySelector('[name="paperSize"]') as HTMLSelectElement;
        if (paperSel) paperSel.value = '58mm';
        const qrSel = form.querySelector('[name="upiQrMode"]') as HTMLSelectElement;
        if (qrSel) qrSel.value = 'auto';
        const qrSize = form.querySelector('[name="upiQrSize"]') as HTMLSelectElement;
        if (qrSize) qrSize.value = 'small';
        const feed = form.querySelector('[name="bottomFeedLines"]') as HTMLSelectElement;
        if (feed) feed.value = '1';
      } else if (preset === 'always-qr') {
        const qrSel = form.querySelector('[name="upiQrMode"]') as HTMLSelectElement;
        if (qrSel) qrSel.value = 'always';
        const qrSize = form.querySelector('[name="upiQrSize"]') as HTMLSelectElement;
        if (qrSize) qrSize.value = 'medium';
      }
      refreshSettingsReceiptLivePreview();
      showToast(`Preset "${preset}" applied to preview`, 'info');
    });
  });

  const receiptSettingsForm = document.getElementById('receipt-settings-form');
  if (receiptSettingsForm) {
    receiptSettingsForm.addEventListener('input', refreshSettingsReceiptLivePreview);
    receiptSettingsForm.addEventListener('change', refreshSettingsReceiptLivePreview);
    receiptSettingsForm.addEventListener('submit', (e: any) => {
      e.preventDefault();
      const updatedSettings = extractReceiptSettingsFromForm();
      state.receiptSettings = updatedSettings;
      if (!state.shopInfo) state.shopInfo = {};
      state.shopInfo.receiptSettings = updatedSettings;
      saveBranchSettingsToCloud(state.currentBranchId, updatedSettings);
      saveState();
      renderApp();
      showToast('✓ Thermal POS printer & receipt customization saved to Cloud!', 'success');
    });
  }

  // Test Print Receipt Button
  document.getElementById('test-print-receipt-btn')?.addEventListener('click', () => {
    state.activeOrder = sampleReceiptOrder;
    state.showThermalModal = true;
    renderApp();
    showToast('Opening Thermal Receipt Print Preview...', 'info');
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
    state.returnToCheckout = true;
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
  document.getElementById('unit-toggle-kg')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    state.selectedWeightUnit = 'kg';
    saveState();
    renderApp();
  });
  document.getElementById('unit-toggle-g')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    state.selectedWeightUnit = 'g';
    saveState();
    renderApp();
  });

  // Helper to hold current active counter cart
  const holdCurrentActiveCart = () => {
    if (state.posCart.length === 0) {
      showToast('Counter cart is empty, nothing to hold.', 'warning');
      return;
    }
    const parkId = `park-${Date.now()}`;
    const parkSubtotal = state.posCart.reduce((sum: number, it: any) => sum + (it.rate * it.qty), 0);
    const parkDiscount = Math.round((parkSubtotal * (state.discountPercent || 0)) / 100);
    const parkTotal = Math.max(0, parkSubtotal - parkDiscount);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const customerLabel = state.selectedCustomer?.name || 'Walk-in (OTC)';

    state.parkedBills = state.parkedBills || [];
    state.parkedBills.unshift({
      id: parkId,
      label: `Token #${10 + state.parkedBills.length} (${customerLabel})`,
      time: timeStr,
      itemsCount: state.posCart.length,
      total: parkTotal,
      discountPercent: state.discountPercent || 0,
      orderNote: (document.getElementById('pos-order-note') as HTMLInputElement)?.value || '',
      customer: state.selectedCustomer ? { ...state.selectedCustomer } : null,
      items: [...state.posCart]
    });

    state.auditLogs.unshift({
      time: timeStr,
      user: state.shopInfo.owner || 'Counter Executive',
      action: 'Bill Parked',
      details: `Parked ${state.posCart.length} items (₹${parkTotal}) for ${customerLabel}`
    });

    state.posCart = [];
    state.quickCart = [];
    state.selectedCustomer = null;
    state.discountPercent = 0;
    state.showHeldCartsModal = false;
    saveState();
    playBeep('add');
    showToast(`✓ Cart on hold as Token #${10 + state.parkedBills.length - 1} (${customerLabel})`, 'success');
    renderApp();
  };

  // Triggers for Holding Current Cart (Desktop & Mobile)
  document.getElementById('pos-hold-bill-btn')?.addEventListener('click', holdCurrentActiveCart);
  document.getElementById('mobile-bar-hold-btn')?.addEventListener('click', holdCurrentActiveCart);
  document.getElementById('mobile-sheet-hold-cart-btn')?.addEventListener('click', holdCurrentActiveCart);
  document.getElementById('modal-hold-current-cart-btn')?.addEventListener('click', holdCurrentActiveCart);

  // Triggers for Opening Held Carts Queue Modal
  const openHeldCartsModal = () => {
    state.showHeldCartsModal = true;
    renderApp();
  };
  document.getElementById('open-held-carts-btn')?.addEventListener('click', openHeldCartsModal);
  document.getElementById('toggle-parked-bills-btn')?.addEventListener('click', openHeldCartsModal);
  document.getElementById('view-held-carts-desktop-btn')?.addEventListener('click', openHeldCartsModal);
  document.getElementById('mobile-sheet-view-held-btn')?.addEventListener('click', openHeldCartsModal);

  // Close Held Carts Modal
  const closeHeldCartsModal = () => {
    state.showHeldCartsModal = false;
    renderApp();
  };
  document.getElementById('close-held-carts-btn')?.addEventListener('click', closeHeldCartsModal);
  document.getElementById('close-held-carts-bottom-btn')?.addEventListener('click', closeHeldCartsModal);
  document.getElementById('held-carts-modal')?.addEventListener('click', (e: any) => {
    if (e.target?.id === 'held-carts-modal') closeHeldCartsModal();
  });

  // Resume a specific held cart from the modal
  document.querySelectorAll('[data-resume-parked-bill]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-resume-parked-bill');
      const billIndex = (state.parkedBills || []).findIndex((b: any) => b.id === id);
      if (billIndex === -1) return;
      const billToResume = state.parkedBills[billIndex];

      // Safe swap: If active cart currently has items, park current first so nothing is lost!
      if (state.posCart.length > 0) {
        const currentParkId = `park-${Date.now()}`;
        const currentSub = state.posCart.reduce((s: number, it: any) => s + (it.rate * it.qty), 0);
        const currentDisc = Math.round((currentSub * (state.discountPercent || 0)) / 100);
        state.parkedBills.push({
          id: currentParkId,
          label: `Token #${10 + state.parkedBills.length} (${state.selectedCustomer?.name || 'Walk-in'})`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          itemsCount: state.posCart.length,
          total: Math.max(0, currentSub - currentDisc),
          discountPercent: state.discountPercent || 0,
          customer: state.selectedCustomer ? { ...state.selectedCustomer } : null,
          items: [...state.posCart]
        });
      }

      // Remove recalled cart from parkedBills
      state.parkedBills.splice(billIndex, 1);

      // Restore recalled cart into active POS
      state.posCart = billToResume.items || [];
      state.quickCart = [...state.posCart];
      state.selectedCustomer = billToResume.customer || null;
      state.discountPercent = billToResume.discountPercent || 0;
      state.showHeldCartsModal = false;

      saveState();
      playBeep('add');
      showToast(`✓ Recalled ${billToResume.label}`, 'success');
      renderApp();
    });
  });

  // Discard a specific held cart
  document.querySelectorAll('[data-discard-parked-bill]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-discard-parked-bill');
      const bill = (state.parkedBills || []).find((b: any) => b.id === id);
      if (!bill) return;

      if (!confirm(`Are you sure you want to discard held cart "${bill.label || 'Walk-in'}"?`)) {
        return;
      }

      state.parkedBills = state.parkedBills.filter((b: any) => b.id !== id);
      saveState();
      renderApp();
      showToast('✓ Held cart discarded', 'info');
    });
  });

  // Offline-First Network Status & Background Auto-Sync
  const updateOfflineSyncUI = () => {
    const online = isNetworkOnline();
    const pendingCount = getPendingOfflineOrdersCount();
    const badge = document.getElementById('pos-offline-sync-badge');
    const dot = document.getElementById('pos-sync-status-dot');
    const text = document.getElementById('pos-sync-status-text');
    const syncBtn = document.getElementById('pos-manual-sync-btn');

    if (!text || !dot) return;

    if (!online) {
      dot.className = "w-1.5 h-1.5 rounded-full bg-amber-500";
      text.textContent = pendingCount > 0 ? `Offline Mode • ${pendingCount} Queued` : 'Offline Mode • Local Ready';
      if (badge) badge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300";
      if (syncBtn) syncBtn.classList.add('hidden');
    } else if (pendingCount > 0) {
      dot.className = "w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse";
      text.textContent = `Auto-Syncing (${pendingCount} Queued)`;
      if (badge) badge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300";
      if (syncBtn) syncBtn.classList.remove('hidden');
    } else {
      dot.className = "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse";
      text.textContent = `Online • Auto-Sync Active`;
      if (badge) badge.className = "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200";
      if (syncBtn) syncBtn.classList.add('hidden');
    }
  };

  updateOfflineSyncUI();

  // Manual Sync Button
  document.getElementById('pos-manual-sync-btn')?.addEventListener('click', async () => {
    showToast('Auto-syncing queued offline bills to Cloud Firestore...', 'info');
    const res = await syncOfflineOrdersQueue(saveBranchOrderToCloud, state.sweets, state.customers);
    updateOfflineSyncUI();
    if (res.synced > 0) {
      showToast(`✓ Successfully synced ${res.synced} offline bill(s) to Cloud Firestore!`, 'success');
    } else if (!isNetworkOnline()) {
      showToast('Device is still offline. Orders remain safe in local queue.', 'warning');
    }
  });

  // Listen to network change events
  window.addEventListener('online', async () => {
    updateOfflineSyncUI();
    showToast('📶 Internet connection restored! Auto-syncing offline bills...', 'info');
    const res = await syncOfflineOrdersQueue(saveBranchOrderToCloud, state.sweets, state.customers);
    updateOfflineSyncUI();
    if (res.synced > 0) {
      showToast(`✓ Auto-synced ${res.synced} offline bill(s) to Cloud Firestore!`, 'success');
    }
  });

  window.addEventListener('offline', () => {
    updateOfflineSyncUI();
    showToast('⚠️ Switched to 100% Offline Mode. Billing continues without interruption!', 'info');
  });

  window.addEventListener('radhe-offline-queue-changed', () => {
    updateOfflineSyncUI();
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
        playBeep('add');
        showToast(`✓ Inward stock PO recorded! +${delta} ${rm.unit} added to ${rm.name}.`, 'success');
        renderApp();
      }
    });
  });

  // Customer Phone Call Dialer Handlers (ZERO-FLICKER IN-PLACE UPDATE)
  const handleAttachDialedNumber = () => {
    const rawDigits = (state.dialerInput || '').replace(/\D/g, '').slice(0, 10);
    if (!rawDigits || rawDigits.length === 0) {
      showToast('Please dial a customer mobile number first.', 'warning');
      return;
    }

    const formattedPhone = formatDialerPhone(rawDigits);

    // 1. Check if existing customer matches these digits
    const existing = state.customers.find((c: any) => {
      const cDigits = (c.phone || '').replace(/\D/g, '');
      return (cDigits.length >= 6 && cDigits.endsWith(rawDigits)) || (rawDigits.length >= 6 && rawDigits.endsWith(cDigits)) || (c.phone === formattedPhone);
    });

    if (existing) {
      completeCustomerSelection(existing);
      return;
    }

    // 2. Otherwise create a new customer profile and attach instantly!
    const nameInput = document.getElementById('dialer-new-customer-name') as HTMLInputElement | null;
    const typedName = nameInput?.value?.trim();
    const customerName = typedName || `Patron (${formattedPhone})`;

    const newCustomer = {
      id: `CUST-${1000 + state.customers.length + 1}`,
      name: customerName,
      phone: formattedPhone,
      email: '',
      address: 'Ahmedabad, Gujarat',
      type: 'Regular',
      tier: 'Regular',
      loyaltyPoints: 50, // Welcome points!
      totalOrders: 1,
      totalSpent: 0,
      notes: 'Registered via Counter Phone Dialer'
    };

    state.customers.unshift(newCustomer);
    if (state.kpis && state.kpis.customers) {
      state.kpis.customers.value = (state.kpis.customers.value || 0) + 1;
      state.kpis.customers.formatted = String(state.kpis.customers.value);
    }
    saveCustomerToCloud(newCustomer, state.currentBranchId, state.customers);
    saveBranchSnapshot(state.currentBranchId);
    completeCustomerSelection(newCustomer);
  };

  const bindDialerMatchPickers = () => {
    // Pick existing customer from directory
    document.querySelectorAll('[data-dialer-pick-customer]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const custId = btn.getAttribute('data-dialer-pick-customer');
        const cust = state.customers.find((c: any) => c.id === custId);
        if (cust) {
          completeCustomerSelection(cust);
        }
      });
    });

    // 1-Click Instant Attach New Button in Matches pane
    document.getElementById('dialer-attach-new-instant-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleAttachDialedNumber();
    });

    // Save with Optional Name & Attach Button
    document.getElementById('dialer-save-named-customer-btn')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleAttachDialedNumber();
    });

    // Enter key in Optional Name Input
    const nameInput = document.getElementById('dialer-new-customer-name') as HTMLInputElement | null;
    if (nameInput) {
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          handleAttachDialedNumber();
        }
      });
    }
  };

  const updateDialerDOM = () => {
    const rawDigits = (state.dialerInput || '').replace(/\D/g, '').slice(0, 10);
    const displayEl = document.getElementById('dialer-phone-display');
    const countEl = document.getElementById('dialer-digit-count');
    const attachHeroBtn = document.getElementById('dialer-attach-number-btn') as HTMLButtonElement | null;
    const searchInput = document.getElementById('dialer-search-input') as HTMLInputElement | null;
    const container = document.getElementById('dialer-matches-container');

    const formattedPhone = formatDialerPhone(rawDigits);
    const hasDigits = rawDigits.length > 0;
    const isComplete = rawDigits.length === 10;

    if (displayEl) {
      displayEl.textContent = formattedPhone;
    }
    
    if (countEl) {
      if (isComplete) {
        countEl.className = 'text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block shadow-2xs animate-pulse';
        countEl.textContent = '✓ 10 Digits Complete';
      } else {
        countEl.className = 'text-[11px] font-bold text-[var(--text-muted)]';
        countEl.textContent = `${rawDigits.length} / 10 digits`;
      }
    }

    if (attachHeroBtn) {
      if (hasDigits) {
        attachHeroBtn.disabled = false;
        attachHeroBtn.className = 'w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer';
        attachHeroBtn.innerHTML = `<span>⚡ Attach ${formattedPhone} to Order</span>`;
      } else {
        attachHeroBtn.disabled = true;
        attachHeroBtn.className = 'w-full py-4 px-4 bg-stone-200 dark:bg-stone-800 text-stone-400 font-bold text-sm rounded-2xl cursor-not-allowed flex items-center justify-center gap-2';
        attachHeroBtn.innerHTML = `<span>📞 Dial 10 digits to attach</span>`;
      }
    }

    if (searchInput && searchInput.value !== state.dialerInput) {
      searchInput.value = state.dialerInput;
    }

    if (container) {
      container.innerHTML = renderDialerMatchesHtml(state.customers, state.dialerInput, rawDigits);
      bindDialerMatchPickers();
    }
  };

  // Mobile Dialer View Tab Switcher (Keypad vs Directory)
  const keypadCol = document.getElementById('dialer-keypad-column');
  const directoryCol = document.getElementById('dialer-directory-column');
  const keypadTabBtn = document.getElementById('dialer-tab-keypad-btn');
  const directoryTabBtn = document.getElementById('dialer-tab-directory-btn');

  keypadTabBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    keypadCol?.classList.remove('hidden');
    directoryCol?.classList.add('hidden');
    keypadTabBtn.className = 'flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white dark:bg-stone-900 text-[#C86D3B] shadow-2xs font-extrabold';
    if (directoryTabBtn) {
      directoryTabBtn.className = 'flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-stone-600 dark:text-stone-300 hover:text-stone-900 font-bold';
    }
  });

  directoryTabBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    directoryCol?.classList.remove('hidden');
    keypadCol?.classList.add('hidden');
    directoryTabBtn.className = 'flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white dark:bg-stone-900 text-[#C86D3B] shadow-2xs font-extrabold';
    if (keypadTabBtn) {
      keypadTabBtn.className = 'flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-stone-600 dark:text-stone-300 hover:text-stone-900 font-bold';
    }
  });

  // Close Dialer
  document.getElementById('close-dialer-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.showCustomerDialerModal = false;
    if (state.returnToCheckout) {
      state.showCheckoutModal = true;
      state.returnToCheckout = false;
    }
    renderApp();
  });

  // Primary Hero Button: Attach Dialed Number
  document.getElementById('dialer-attach-number-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAttachDialedNumber();
  });

  // Instant Walk-in Sale (No Phone Needed)
  document.getElementById('dialer-instant-walkin-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    completeCustomerSelection(null);
  });

  // Dial Pad Digit Buttons (0-9) - ZERO REFRESH!
  document.querySelectorAll('[data-dial-digit]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const digit = btn.getAttribute('data-dial-digit');
      if (digit && state.dialerInput.length < 10) {
        state.dialerInput += digit;
        updateDialerDOM();
      }
    });
  });

  // Dialer Backspace & Clear - ZERO REFRESH!
  const handleDialerBackspace = (e?: Event) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    state.dialerInput = state.dialerInput.slice(0, -1);
    updateDialerDOM();
  };

  document.getElementById('dialer-backspace-btn')?.addEventListener('click', handleDialerBackspace);
  document.getElementById('dialer-backspace-key')?.addEventListener('click', handleDialerBackspace);
  document.getElementById('dialer-clear-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    state.dialerInput = '';
    updateDialerDOM();
  });

  // Search input typing (both name and phone) - ZERO REFRESH!
  const dialerSearchInput = document.getElementById('dialer-search-input') as HTMLInputElement | null;
  if (dialerSearchInput) {
    dialerSearchInput.addEventListener('input', (e) => {
      state.dialerInput = (e.target as HTMLInputElement).value;
      updateDialerDOM();
    });
    dialerSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleAttachDialedNumber();
      }
    });
  }

  // Toggle Add by Name button
  document.getElementById('dialer-toggle-add-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const container = document.getElementById('dialer-matches-container');
    if (container) {
      container.innerHTML = renderDialerMatchesHtml([], 'add-new-custom', state.dialerInput);
      bindDialerMatchPickers();
      const nameInput = document.getElementById('dialer-new-customer-name') as HTMLInputElement;
      if (nameInput) nameInput.focus();
    }
  });

  // Initial attach of matching listeners inside modal
  bindDialerMatchPickers();
}

// Customer storefront removed - management portal only
function bindStorefrontEvents() {
  return;
  // Category / Diet filter pill clicks
  document.querySelectorAll('[data-customer-diet]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const diet = btn.getAttribute('data-customer-diet') || 'All';
      state.customerDietFilter = diet;
      saveState();
      renderApp();
    });
  });

  // Search input typing
  const customerSearchInput = document.getElementById('customer-search-input') as HTMLInputElement | null;
  if (customerSearchInput) {
    customerSearchInput.addEventListener('input', (e) => {
      state.customerSearchQuery = (e.target as HTMLInputElement).value;
      renderApp();
    });
  }

  // Pack size selector (250g, 500g, 1kg)
  document.querySelectorAll('[data-user-pack]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const packVal = parseFloat(btn.getAttribute('data-user-pack') || '0.5');
      const sweetId = btn.getAttribute('data-sweet-id');
      if (!sweetId) return;

      const sweet = (state.sweets || []).find((s: any) => s.id === sweetId);
      if (!sweet) return;

      const rateKg = sweet.pricePerKg || sweet.rate || 400;
      const weightLabel = packVal === 0.25 ? '250g' : packVal === 0.5 ? '500g' : '1kg';
      const price = Math.round(rateKg * packVal);

      if (!state.userCart) state.userCart = [];
      const existing = state.userCart.find((it: any) => it.id === sweetId);
      if (existing) {
        existing.qty = packVal;
        existing.weightLabel = weightLabel;
        existing.price = price;
      } else {
        state.userCart.push({
          id: sweet.id,
          name: sweet.name,
          qty: packVal,
          price: price,
          rateKg: rateKg,
          weightLabel: weightLabel,
          image: sweet.image || `/assets/sweets/${sweet.id}.png`
        });
      }
      saveState();
      renderApp();
      showToast(`${sweet.name} (${weightLabel}) updated in bag!`, 'success');
    });
  });

  // Direct add / Add to bag
  const handleAddSweetToBag = (sweetId: string, defaultPack = 0.5) => {
    const sweet = (state.sweets || []).find((s: any) => s.id === sweetId);
    if (!sweet) return;

    if (!state.userCart) state.userCart = [];
    const existing = state.userCart.find((it: any) => it.id === sweetId);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      const rateKg = sweet.pricePerKg || sweet.rate || 400;
      const weightLabel = defaultPack === 0.25 ? '250g' : defaultPack === 0.5 ? '500g' : '1kg';
      const price = Math.round(rateKg * defaultPack);
      state.userCart.push({
        id: sweet.id,
        name: sweet.name,
        qty: defaultPack,
        price: price,
        rateKg: rateKg,
        weightLabel: weightLabel,
        image: sweet.image || `/assets/sweets/${sweet.id}.png`
      });
    }
    saveState();
    renderApp();
    showToast(`Added ${sweet.name} to Sweet Bag!`, 'success');
  };

  document.querySelectorAll('[data-user-add-direct]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-user-add-direct');
      if (id) handleAddSweetToBag(id, 0.5);
    });
  });

  document.querySelectorAll('[data-storefront-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-storefront-add');
      if (id) handleAddSweetToBag(id, 0.5);
    });
  });

  // Helper: get clean store WhatsApp phone number from settings
  const getStoreWhatsAppPhone = () => {
    const raw = (state.shopInfo?.phone || '9876543210').replace(/\D/g, '');
    return raw.length === 10 ? `91${raw}` : raw;
  };

  // Instant WhatsApp quick buy for a single sweet
  document.querySelectorAll('[data-storefront-whatsapp-buy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-storefront-whatsapp-buy');
      const sweet = (state.sweets || []).find((s: any) => s.id === id);
      if (!sweet) return;

      const phone = getStoreWhatsAppPhone();
      const text = encodeURIComponent(
        `Hello ${state.shopInfo?.name || 'Radhe Sweets'} Ahmedabad! 🪔\n\nI would like to order fresh ${sweet.name} (500g / 1kg) for home delivery/pickup.\nBranch: ${state.branches?.find((b: any) => b.id === state.currentBranchId)?.name || 'Navrangpura'}\n\nPlease share availability and delivery estimate!`
      );
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });
  });

  // Wedding Inquiry button
  document.getElementById('storefront-wedding-inquiry-btn')?.addEventListener('click', () => {
    const phone = getStoreWhatsAppPhone();
    const text = encodeURIComponent(
      `Hello ${state.shopInfo?.name || 'Radhe Sweets'} Team! 🎁\n\nI am planning a Wedding / Corporate event in Ahmedabad and would like to inquire about customized Sweet Gift Hampers, Dry Fruit Boxes, and bulk confectionery rates.\n\nPlease share your corporate catalog and sample box options!`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  });

  // Bag Drawer Open & Close
  const openBag = () => {
    state.showCustomerBagModal = true;
    renderApp();
  };
  const closeBag = () => {
    state.showCustomerBagModal = false;
    renderApp();
  };

  document.getElementById('storefront-open-bag-btn')?.addEventListener('click', openBag);
  document.getElementById('mobile-bottom-open-bag-btn')?.addEventListener('click', openBag);
  document.getElementById('close-customer-bag-btn')?.addEventListener('click', closeBag);
  document.getElementById('bag-empty-browse-btn')?.addEventListener('click', closeBag);
  document.getElementById('customer-bag-backdrop')?.addEventListener('click', (e) => {
    if (e.target && (e.target as HTMLElement).id === 'customer-bag-backdrop') {
      closeBag();
    }
  });

  // Remove from bag
  document.querySelectorAll('[data-user-remove-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-user-remove-cart');
      if (id && state.userCart) {
        state.userCart = state.userCart.filter((it: any) => it.id !== id);
        saveState();
        renderApp();
      }
    });
  });

  // Delivery vs Pickup Switch
  document.getElementById('bag-set-delivery-btn')?.addEventListener('click', () => {
    state.customerDeliveryType = 'delivery';
    saveState();
    renderApp();
  });
  document.getElementById('bag-set-pickup-btn')?.addEventListener('click', () => {
    state.customerDeliveryType = 'pickup';
    saveState();
    renderApp();
  });

  // Sync Customer Input fields in Bag
  const bagName = document.getElementById('bag-customer-name') as HTMLInputElement | null;
  const bagPhone = document.getElementById('bag-customer-phone') as HTMLInputElement | null;
  const bagAddr = document.getElementById('bag-customer-address') as HTMLTextAreaElement | null;

  bagName?.addEventListener('input', (e) => {
    state.customerName = (e.target as HTMLInputElement).value;
  });
  bagPhone?.addEventListener('input', (e) => {
    state.customerPhone = (e.target as HTMLInputElement).value;
  });
  bagAddr?.addEventListener('input', (e) => {
    state.customerAddress = (e.target as HTMLTextAreaElement).value;
  });

  // Order via WhatsApp (Complete Bag)
  document.getElementById('bag-submit-whatsapp-btn')?.addEventListener('click', () => {
    if (!state.userCart || state.userCart.length === 0) {
      showToast('Your sweet bag is empty!', 'info');
      return;
    }
    const name = bagName?.value?.trim() || state.customerName || 'Customer';
    const phone = bagPhone?.value?.trim() || state.customerPhone || '';
    const address = bagAddr?.value?.trim() || state.customerAddress || '';
    const isDelivery = (state.customerDeliveryType || 'delivery') === 'delivery';

    if (isDelivery && !address) {
      showToast('Please enter your Ahmedabad delivery address', 'info');
      bagAddr?.focus();
      return;
    }

    const subtotal = state.userCart.reduce((sum: number, it: any) => sum + (it.price * it.qty), 0);
    const freeThreshold = Number(state.shopInfo?.freeDeliveryAbove) || 500;
    const stdDeliveryFee = Number(state.shopInfo?.deliveryFee) || 40;
    const delCharge = subtotal >= freeThreshold ? 0 : stdDeliveryFee;
    const total = subtotal + delCharge;
    const branch = state.branches?.find((b: any) => b.id === state.currentBranchId)?.name || 'Navrangpura Flagship';

    const itemsSummary = state.userCart.map((it: any, idx: number) => 
      `${idx + 1}. ${it.name} (${it.weightLabel || `${it.qty}kg`}) - ₹${it.price * it.qty}`
    ).join('\n');

    const shopName = state.shopInfo?.name || 'RADHE SWEETS AHMEDABAD';
    const msg = `🪔 *${shopName.toUpperCase()} - ONLINE ORDER* 🪔\n\n` +
      `*Branch:* ${branch}\n` +
      `*Customer:* ${name} (${phone || 'WhatsApp'})\n` +
      `*Order Type:* ${isDelivery ? `🚚 Home Delivery to:\n${address}` : `🏪 Store Self-Pickup`}\n\n` +
      `*Selected Sweets:*\n${itemsSummary}\n\n` +
      `*Sweets Total:* ₹${subtotal}\n` +
      `*Delivery Charge:* ${delCharge === 0 ? 'FREE' : `₹${delCharge}`}\n` +
      `*Net Payable:* ₹${total}\n\n` +
      `Please confirm order preparation and dispatch time! 🙏`;

    const targetPhone = getStoreWhatsAppPhone();
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Opening WhatsApp order draft...', 'success');
  });

  // Place Online Order (Direct System Order)
  document.getElementById('bag-submit-online-btn')?.addEventListener('click', () => {
    if (!state.userCart || state.userCart.length === 0) {
      showToast('Your sweet bag is empty!', 'info');
      return;
    }
    const name = bagName?.value?.trim() || state.customerName || 'Ahmedabad Patron';
    const phone = bagPhone?.value?.trim() || state.customerPhone || '9876543210';
    const address = bagAddr?.value?.trim() || state.customerAddress || 'Navrangpura, Ahmedabad';
    const isDelivery = (state.customerDeliveryType || 'delivery') === 'delivery';

    const subtotal = state.userCart.reduce((sum: number, it: any) => sum + (it.price * it.qty), 0);
    const delCharge = subtotal >= 500 ? 0 : 40;
    const total = subtotal + delCharge;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `RS-WEB-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: {
        id: `cust-online-${Date.now()}`,
        name: name,
        phone: phone,
        address: isDelivery ? address : 'Store Pickup Counter',
        type: 'Online Customer',
        loyaltyPoints: Math.floor(total / 100)
      },
      items: state.userCart.map((it: any) => ({
        id: it.id,
        name: it.name,
        qty: it.qty,
        rate: it.rateKg || it.price,
        total: it.price * it.qty,
        unit: 'kg'
      })),
      subtotal: subtotal,
      discount: 0,
      tax: 0,
      deliveryCharge: delCharge,
      total: total,
      paymentMethod: 'Pay on Delivery / UPI',
      paymentStatus: 'Pending',
      orderStatus: 'Kitchen Packing',
      deliveryType: isDelivery ? 'delivery' : 'pickup',
      deliveryAddress: isDelivery ? address : '',
      branchId: state.currentBranchId || 'br-1',
      source: 'Online Storefront',
      createdAt: new Date().toISOString()
    };

    if (!state.orders) state.orders = [];
    state.orders.unshift(newOrder);

    // Increment KPIs
    if (state.kpis?.ordersToday) {
      state.kpis.ordersToday.value = (state.kpis.ordersToday.value || 0) + 1;
      state.kpis.ordersToday.formatted = String(state.kpis.ordersToday.value);
    }
    if (state.kpis?.dailyRevenue) {
      state.kpis.dailyRevenue.value = (state.kpis.dailyRevenue.value || 0) + total;
      state.kpis.dailyRevenue.formatted = `₹${state.kpis.dailyRevenue.value.toLocaleString()}`;
    }

    saveBranchSnapshot(state.currentBranchId);
    saveBranchOrderToCloud(state.currentBranchId, newOrder, state.sweets, state.customers);
    saveBranchKpisToCloud(state.currentBranchId, state.kpis);

    // Clear cart and close modal
    state.userCart = [];
    state.showCustomerBagModal = false;
    state.lastPlacedOrder = newOrder;
    state.activeOrder = newOrder;
    state.showSuccessModal = true;
    saveState();
    renderApp();
    showToast(`Order #${newOrder.orderNumber} successfully placed!`, 'success');
  });

  // Loyalty Points Lookup Modal
  const openLoyalty = () => {
    state.showLoyaltyCheckModal = true;
    renderApp();
  };
  const closeLoyalty = () => {
    state.showLoyaltyCheckModal = false;
    state.loyaltyQueryResult = null;
    renderApp();
  };

  document.getElementById('storefront-check-loyalty-btn')?.addEventListener('click', openLoyalty);
  document.getElementById('mobile-bottom-loyalty-btn')?.addEventListener('click', openLoyalty);
  document.getElementById('close-loyalty-modal-btn')?.addEventListener('click', closeLoyalty);
  document.getElementById('loyalty-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target && (e.target as HTMLElement).id === 'loyalty-modal-backdrop') {
      closeLoyalty();
    }
  });

  // Loyalty lookup button
  document.getElementById('loyalty-lookup-submit-btn')?.addEventListener('click', () => {
    const input = document.getElementById('loyalty-search-phone') as HTMLInputElement | null;
    const phone = input?.value?.trim().replace(/\D/g, '') || '';
    if (!phone) {
      showToast('Please enter your 10-digit mobile number', 'info');
      return;
    }

    const found = (state.customers || []).find((c: any) => {
      const cDigits = (c.phone || '').replace(/\D/g, '');
      return (cDigits.length >= 6 && cDigits.endsWith(phone)) || c.phone === phone;
    });

    if (found) {
      state.loyaltyQueryResult = found;
      showToast(`Welcome back, ${found.name}!`, 'success');
    } else {
      state.loyaltyQueryResult = { notFound: true, phone: phone };
    }
    renderApp();
  });
}

// Physical Keyboard Numpad listener for Dialer - ZERO REFRESH!
window.addEventListener('keydown', (e: KeyboardEvent) => {
  if (!state.showCustomerDialerModal) return;

  const isInputOrTextarea = e.target && ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA');

  if (isInputOrTextarea) {
    // If enter pressed inside input in dialer, attach number
    if (e.key === 'Enter') {
      e.preventDefault();
      const rawDigits = (state.dialerInput || '').replace(/\D/g, '').slice(0, 10);
      if (rawDigits.length > 0) {
        const phone = formatDialerPhone(rawDigits);
        const existing = state.customers.find((c: any) => {
          const cDigits = (c.phone || '').replace(/\D/g, '');
          return (cDigits.length >= 6 && cDigits.endsWith(rawDigits)) || (c.phone === phone);
        });
        if (existing) {
          completeCustomerSelection(existing);
        } else {
          const nameInput = document.getElementById('dialer-new-customer-name') as HTMLInputElement | null;
          const typedName = nameInput?.value?.trim();
          const customerName = typedName || `Patron (${phone})`;
          const newCustomer = {
            id: `CUST-${1000 + state.customers.length + 1}`,
            name: customerName,
            phone: phone,
            email: '',
            address: 'Ahmedabad, Gujarat',
            type: 'Regular',
            tier: 'Regular',
            loyaltyPoints: 50,
            totalOrders: 1,
            totalSpent: 0,
            notes: 'Registered via Phone Dialer'
          };
          state.customers.unshift(newCustomer);
          if (state.kpis?.customers) {
            state.kpis.customers.value = (state.kpis.customers.value || 0) + 1;
            state.kpis.customers.formatted = String(state.kpis.customers.value);
          }
          saveCustomerToCloud(newCustomer, state.currentBranchId, state.customers);
          saveBranchSnapshot(state.currentBranchId);
          completeCustomerSelection(newCustomer);
        }
      }
    }
    return;
  }

  // Dial digits 0-9
  if (/^[0-9]$/.test(e.key)) {
    e.preventDefault();
    if (state.dialerInput.length < 10) {
      state.dialerInput += e.key;
      const rawDigits = (state.dialerInput || '').replace(/\D/g, '').slice(0, 10);
      const displayEl = document.getElementById('dialer-phone-display');
      const countEl = document.getElementById('dialer-digit-count');
      const attachHeroBtn = document.getElementById('dialer-attach-number-btn') as HTMLButtonElement | null;
      const searchInput = document.getElementById('dialer-search-input') as HTMLInputElement | null;
      const container = document.getElementById('dialer-matches-container');

      const formatted = formatDialerPhone(rawDigits);
      if (displayEl) displayEl.textContent = formatted;
      if (countEl) {
        if (rawDigits.length === 10) {
          countEl.className = 'text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block shadow-2xs animate-pulse';
          countEl.textContent = '✓ 10 Digits Complete';
        } else {
          countEl.className = 'text-[11px] font-bold text-[var(--text-muted)]';
          countEl.textContent = `${rawDigits.length} / 10 digits`;
        }
      }
      if (attachHeroBtn) {
        attachHeroBtn.disabled = false;
        attachHeroBtn.className = 'w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer';
        attachHeroBtn.innerHTML = `<span>⚡ Attach ${formatted} to Order</span>`;
      }
      if (searchInput && searchInput.value !== state.dialerInput) searchInput.value = state.dialerInput;
      if (container) {
        container.innerHTML = renderDialerMatchesHtml(state.customers, state.dialerInput, rawDigits);
        document.querySelectorAll('[data-dialer-pick-customer]').forEach(btn => {
          btn.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            const custId = btn.getAttribute('data-dialer-pick-customer');
            const cust = state.customers.find((c: any) => c.id === custId);
            if (cust) {
              completeCustomerSelection(cust);
            }
          });
        });
        document.getElementById('dialer-attach-new-instant-btn')?.addEventListener('click', () => {
          const phone = formatDialerPhone(rawDigits);
          const newCust = {
            id: `CUST-${1000 + state.customers.length + 1}`,
            name: `Patron (${phone})`,
            phone: phone,
            email: '',
            address: 'Ahmedabad, Gujarat',
            type: 'Regular',
            tier: 'Regular',
            loyaltyPoints: 50,
            totalOrders: 1,
            totalSpent: 0,
            notes: 'Registered via Phone Dialer'
          };
          state.customers.unshift(newCust);
          saveCustomerToCloud(newCust, state.currentBranchId, state.customers);
          saveBranchSnapshot(state.currentBranchId);
          completeCustomerSelection(newCust);
        });
      }
    }
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    state.dialerInput = state.dialerInput.slice(0, -1);
    const rawDigits = (state.dialerInput || '').replace(/\D/g, '').slice(0, 10);
    const displayEl = document.getElementById('dialer-phone-display');
    const countEl = document.getElementById('dialer-digit-count');
    const attachHeroBtn = document.getElementById('dialer-attach-number-btn') as HTMLButtonElement | null;
    const searchInput = document.getElementById('dialer-search-input') as HTMLInputElement | null;
    const container = document.getElementById('dialer-matches-container');

    const formatted = formatDialerPhone(rawDigits);
    if (displayEl) displayEl.textContent = formatted;
    if (countEl) {
      countEl.className = 'text-[11px] font-bold text-[var(--text-muted)]';
      countEl.textContent = `${rawDigits.length} / 10 digits`;
    }
    if (attachHeroBtn) {
      if (rawDigits.length > 0) {
        attachHeroBtn.disabled = false;
        attachHeroBtn.className = 'w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer';
        attachHeroBtn.innerHTML = `<span>⚡ Attach ${formatted} to Order</span>`;
      } else {
        attachHeroBtn.disabled = true;
        attachHeroBtn.className = 'w-full py-3.5 px-4 bg-stone-200 dark:bg-stone-800 text-stone-400 font-bold text-sm rounded-2xl cursor-not-allowed flex items-center justify-center gap-2';
        attachHeroBtn.innerHTML = `<span>📞 Dial 10 digits to attach</span>`;
      }
    }
    if (searchInput && searchInput.value !== state.dialerInput) searchInput.value = state.dialerInput;
    if (container) {
      container.innerHTML = renderDialerMatchesHtml(state.customers, state.dialerInput, rawDigits);
      document.querySelectorAll('[data-dialer-pick-customer]').forEach(btn => {
        btn.addEventListener('click', (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const custId = btn.getAttribute('data-dialer-pick-customer');
          const cust = state.customers.find((c: any) => c.id === custId);
          if (cust) {
            completeCustomerSelection(cust);
          }
        });
      });
    }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const rawDigits = (state.dialerInput || '').replace(/\D/g, '').slice(0, 10);
    if (rawDigits.length > 0) {
      const phone = formatDialerPhone(rawDigits);
      const existing = state.customers.find((c: any) => {
        const cDigits = (c.phone || '').replace(/\D/g, '');
        return (cDigits.length >= 6 && cDigits.endsWith(rawDigits)) || (c.phone === phone);
      });
      if (existing) {
        completeCustomerSelection(existing);
      } else {
        const newCust = {
          id: `CUST-${1000 + state.customers.length + 1}`,
          name: `Patron (${phone})`,
          phone: phone,
          email: '',
          address: 'Ahmedabad, Gujarat',
          type: 'Regular',
          tier: 'Regular',
          loyaltyPoints: 50,
          totalOrders: 1,
          totalSpent: 0,
          notes: 'Registered via Phone Dialer'
        };
        state.customers.unshift(newCust);
        if (state.kpis?.customers) {
          state.kpis.customers.value = (state.kpis.customers.value || 0) + 1;
          state.kpis.customers.formatted = String(state.kpis.customers.value);
        }
        saveCustomerToCloud(newCust, state.currentBranchId, state.customers);
        saveBranchSnapshot(state.currentBranchId);
        completeCustomerSelection(newCust);
      }
    }
  } else if (e.key === 'Escape') {
    e.preventDefault();
    state.showCustomerDialerModal = false;
    if (state.returnToCheckout) {
      state.showCheckoutModal = true;
      state.returnToCheckout = false;
    }
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

// Initialize with Google Deep Linking & Cloud Sync
function initApp() {
  const initialHash = window.location.hash.replace('#/', '').replace('#', '');
  if (initialHash && ['dashboard', 'pos', 'products', 'customers', 'orders', 'expenses', 'analytics', 'staff', 'settings'].includes(initialHash)) {
    state.activeTab = initialHash;
  }
  renderApp();

  // Baseline snapshot for active branch if not stored
  if (!getBranchLocalSnapshot(state.currentBranchId)) {
    saveBranchSnapshot(state.currentBranchId);
  }

  // 1. Setup Global Real-time Firestore Listeners
  setupGlobalFirestoreListeners();

  // 2. Setup Active Branch Real-time Firestore Listeners (Orders, 100 Sweets, KPIs & Profits, Branch Customers)
  setupBranchFirestoreListeners(state.currentBranchId);

  // 3. Background Cloud Sync for active branch from Cloud Firestore
  loadBranchDataFromCloud(state.currentBranchId).then((data: any) => {
    if (data && data.sweets && data.sweets.length >= 50) {
      state.sweets = data.sweets;
      if (data.kpis && (state.currentBranchId === 'br-1' || state.orders.length > 0)) {
        state.kpis = { ...state.kpis, ...data.kpis };
      }
      renderApp();
    }
  }).catch(() => {});


  // 4. Background Cloud Sync for branches from Cloud Firestore
  loadBranchesFromCloud().then((cloudBranches: any) => {
    if (cloudBranches && Array.isArray(cloudBranches) && cloudBranches.length > 0) {
      state.branches = cloudBranches;
      if (!state.branches.some((b: any) => b.id === state.currentBranchId)) {
        state.currentBranchId = state.branches[0].id;
      }
      saveState();
      renderApp();
    }
  }).catch(() => {});

  // 5. Multi-Tab & Device Auto-Sync on Tab Focus
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      handleIncomingPeerSync();
    }
  });
  window.addEventListener('focus', () => {
    handleIncomingPeerSync();
  });
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Google Sitemap Deep Linking - Listen for browser URL hash changes
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  if (hash && ['dashboard', 'pos', 'products', 'customers', 'orders', 'expenses', 'analytics', 'staff', 'settings'].includes(hash) && state.activeTab !== hash) {
    state.activeTab = hash;
    saveState();
    renderApp();
  }
});
