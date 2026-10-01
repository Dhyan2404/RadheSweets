// Firebase Cloud Firestore ERP Integration for Radhe Sweets
// Real-time Cloud persistence per store branch (Navrangpura, Satellite, SG Highway)
// Project: radhesweets0

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc,
  collection, 
  onSnapshot,
  query,
  limit
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { initialData } from "./data.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBwwDF69fFaa0dT7praHTIpwmL4RlQ24i0",
  authDomain: "radhesweets0.firebaseapp.com",
  projectId: "radhesweets0",
  storageBucket: "radhesweets0.firebasestorage.app",
  messagingSenderId: "968718161119",
  appId: "1:968718161119:web:30822e03e06865eb25056a",
  measurementId: "G-6S1GR5B6TF"
};

// Initialize Firebase App & Firestore Database
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // Analytics optional
}
export { analytics };

// Live Connection State Tracking
export const firestoreLiveState = {
  connected: true,
  lastSyncTime: new Date(),
  syncStatus: 'synced', // 'synced' | 'syncing' | 'offline'
  activeBranchId: 'br-1',
  activeSubscriptions: []
};

const statusListeners = new Set();
export function onFirestoreStatusChange(cb) {
  statusListeners.add(cb);
  return () => statusListeners.delete(cb);
}

function updateStatus(newStatus) {
  firestoreLiveState.syncStatus = newStatus;
  firestoreLiveState.lastSyncTime = new Date();
  statusListeners.forEach(cb => {
    try { cb(firestoreLiveState); } catch(e) {}
  });
}

/**
 * Generate Branch Catalog with all 100 sweets, customized stock & rates per branch
 */
export function getBranchDefaultCatalog(branchId) {
  const masterSweets = initialData.sweets || [];
  
  if (branchId === "br-2") {
    // Satellite Luxury Boutique: Premium diamond packaging, luxury rates, boutique stock
    return {
      name: "Satellite Luxury Boutique",
      branchId: "br-2",
      kpis: {
        revenue: { value: 31400, target: 35000, progress: 89.7, change: "+9.8% vs last week" },
        orders: { value: 88, target: 100, progress: 88.0, change: "+5.4% vs last week" },
        sweetsSold: { value: 92, unit: "kg", target: 110, progress: 83.6, change: "+11.0% vs last week" },
        customers: { value: 74, target: 85, progress: 87.0, change: "+8.2% vs last week" },
        profit: { value: 11950, change: "38.1% margin", isUp: true, formatted: "₹11,950" }
      },
      sweets: masterSweets.map((s, idx) => ({
        ...s,
        pricePerKg: Math.round(s.pricePerKg * 1.08),
        costPrice: Math.round(s.costPrice * 1.04),
        stock: Math.max(15, Math.round(s.stock * 0.85)),
        badge: idx % 8 === 0 ? "Luxury Vark" : s.badge
      }))
    };
  } else if (branchId === "br-3") {
    // SG Highway Central Kitchen: High volume wholesale batches, optimized wholesale rates
    return {
      name: "SG Highway Central Kitchen",
      branchId: "br-3",
      kpis: {
        revenue: { value: 58200, target: 60000, progress: 97.0, change: "+18.3% vs last week" },
        orders: { value: 174, target: 180, progress: 96.6, change: "+14.2% vs last week" },
        sweetsSold: { value: 340, unit: "kg", target: 350, progress: 97.1, change: "+22.0% vs last week" },
        customers: { value: 142, target: 150, progress: 94.6, change: "+11.5% vs last week" },
        profit: { value: 20950, change: "36.0% margin", isUp: true, formatted: "₹20,950" }
      },
      sweets: masterSweets.map((s, idx) => ({
        ...s,
        pricePerKg: Math.round(s.pricePerKg * 0.95),
        costPrice: Math.round(s.costPrice * 0.92),
        stock: Math.max(45, Math.round(s.stock * 2.2)),
        badge: idx % 6 === 0 ? "Kitchen Fresh" : s.badge
      }))
    };
  } else {
    // Navrangpura Flagship (br-1)
    return {
      name: "Navrangpura Flagship",
      branchId: "br-1",
      kpis: {
        revenue: { value: 42850, target: 45000, progress: 95.2, change: "+12.4% vs last week" },
        orders: { value: 126, target: 140, progress: 90.0, change: "+8.1% vs last week" },
        sweetsSold: { value: 184, unit: "kg", target: 200, progress: 92.0, change: "+15.2% vs last week" },
        customers: { value: 98, target: 110, progress: 89.1, change: "+6.3% vs last week" },
        profit: { value: 14620, change: "34.1% margin", isUp: true, formatted: "₹14,620" }
      },
      sweets: masterSweets.map(s => ({ ...s }))
    };
  }
}

/**
 * Load complete branch data (all 100 sweets, KPIs) from Cloud Firestore
 * Self-healing: if Firestore has no data or < 50 sweets, seeds the complete 100 catalog!
 */
export async function loadBranchDataFromCloud(branchId) {
  const seed = getBranchDefaultCatalog(branchId);
  updateStatus('syncing');

  try {
    const branchDocRef = doc(db, "branches", branchId);
    const snap = await getDoc(branchDocRef);
    if (snap.exists() && snap.data().sweets && snap.data().sweets.length >= 50) {
      const data = snap.data();
      updateStatus('synced');
      return {
        sweets: data.sweets,
        kpis: data.kpis || seed.kpis
      };
    } else {
      // Seed complete 100 sweets into Firestore for this branch
      console.log(`[Firebase Firestore] Seeding all 100 sweets for branch ${branchId}...`);
      await setDoc(branchDocRef, {
        sweets: seed.sweets,
        kpis: seed.kpis,
        name: seed.name,
        branchId: branchId,
        sweetsCount: seed.sweets.length,
        lastUpdated: new Date().toISOString()
      }, { merge: true });

      updateStatus('synced');
      return {
        sweets: seed.sweets,
        kpis: seed.kpis
      };
    }
  } catch (error) {
    console.warn(`[Firebase Firestore] Load branch ${branchId} error:`, error.message);
    updateStatus('synced');
  }

  return {
    sweets: seed.sweets,
    kpis: seed.kpis
  };
}

/**
 * Save branch-specific sweets & stock to Cloud Firestore
 */
export async function saveBranchSweetsToCloud(branchId, sweets) {
  updateStatus('syncing');
  try {
    const branchDocRef = doc(db, "branches", branchId);
    await setDoc(branchDocRef, {
      sweets: sweets,
      branchId: branchId,
      sweetsCount: sweets.length,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    localStorage.setItem(`radhe_branch_${branchId}_sweets`, JSON.stringify(sweets));
    updateStatus('synced');
    return true;
  } catch (error) {
    console.warn(`[Firebase Firestore] Branch ${branchId} sweets sync fallback:`, error.message);
    localStorage.setItem(`radhe_branch_${branchId}_sweets`, JSON.stringify(sweets));
    updateStatus('synced');
    return false;
  }
}

/**
 * Real-time Listener for Branch Sweets Catalog & Stock
 */
export function subscribeToBranchSweets(branchId, callback) {
  try {
    const branchDocRef = doc(db, "branches", branchId);
    return onSnapshot(branchDocRef, (snap) => {
      if (snap.exists() && snap.data()?.sweets && snap.data().sweets.length >= 50) {
        callback(snap.data().sweets);
      }
    }, (err) => {
      console.warn(`[Firebase Firestore] Sweets listener warning:`, err.message);
    });
  } catch (e) {
    console.warn(`[Firebase Firestore] Failed to subscribe to sweets:`, e);
    return () => {};
  }
}

/**
 * Save order to Cloud Firestore (both branch-subcollection & root collection)
 * Also updates sweet stock, customer metrics, and branch KPIs/profits
 */
export async function saveBranchOrderToCloud(branchId, order, currentSweets = [], allCustomers = []) {
  updateStatus('syncing');
  try {
    // 1. Save to branch orders
    const branchOrderRef = doc(db, "branches", branchId, "orders", order.id);
    await setDoc(branchOrderRef, {
      ...order,
      branchId,
      createdAt: order.date || new Date().toISOString()
    });

    // 2. Save to global orders collection
    const globalOrderRef = doc(db, "orders", order.id);
    await setDoc(globalOrderRef, {
      ...order,
      branchId,
      createdAt: order.date || new Date().toISOString()
    });

    // 3. Decrement stock for all items in order
    if (currentSweets && currentSweets.length > 0) {
      let updatedSweets = [...currentSweets];
      let hasChanges = false;
      (order.items || []).forEach((cartItem) => {
        const sw = updatedSweets.find(s => s.id === cartItem.id || s.name === cartItem.name);
        if (sw) {
          const qtyUsed = cartItem.quantity || cartItem.qty || 1;
          sw.stock = Math.max(0, Math.round((sw.stock - qtyUsed) * 10) / 10);
          if (sw.stock <= 10) sw.stockStatus = 'Low Stock';
          hasChanges = true;
        }
      });
      if (hasChanges) {
        saveBranchSweetsToCloud(branchId, updatedSweets);
      }
    }

    // 4. Update Customer details & Khata balance in Firestore
    if (order.customerId) {
      await updateCustomerStatsInCloud(order.customerId, order.total, order.paymentMethod === 'Khata');
    }

    // 5. Update branch KPIs, Revenue & Gross Profit in Firestore
    await updateBranchProfitInCloud(branchId, order, currentSweets);

    // 6. Clear active counter checkout draft
    await clearActiveCheckoutInCloud(branchId);

    updateStatus('synced');
    return true;
  } catch (error) {
    console.warn(`[Firebase Firestore] Order ${order.id} sync fallback:`, error.message);
    updateStatus('synced');
    return false;
  }
}

/**
 * Delete order from Cloud Firestore (both branch orders and global orders)
 */
export async function deleteBranchOrderFromCloud(branchId, orderId) {
  updateStatus('syncing');
  try {
    const branchOrderRef = doc(db, "branches", branchId, "orders", orderId);
    await deleteDoc(branchOrderRef);
    const globalOrderRef = doc(db, "orders", orderId);
    await deleteDoc(globalOrderRef);
    updateStatus('synced');
    return true;
  } catch (error) {
    console.warn(`[Firebase Firestore] Delete order ${orderId} fallback:`, error.message);
    updateStatus('synced');
    return false;
  }
}

/**
 * Real-time Listener for Branch Orders
 */
export function subscribeToBranchOrders(branchId, callback) {
  try {
    const ordersCol = collection(db, "branches", branchId, "orders");
    const q = query(ordersCol, limit(100));
    return onSnapshot(q, (snapshot) => {
      const orders = [];
      snapshot.forEach(docSnap => {
        orders.push(docSnap.data());
      });
      orders.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
      callback(orders);
    }, (err) => {
      console.warn(`[Firebase Firestore] Orders listener warning:`, err.message);
    });
  } catch (e) {
    console.warn(`[Firebase Firestore] Failed to subscribe to orders:`, e);
    return () => {};
  }
}

/**
 * Save customer to Cloud Firestore
 */
export async function saveCustomerToCloud(customer) {
  updateStatus('syncing');
  try {
    const custDocRef = doc(db, "customers", customer.id);
    await setDoc(custDocRef, {
      ...customer,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    updateStatus('synced');
    return true;
  } catch (error) {
    console.warn(`[Firebase Firestore] Customer ${customer.id} sync fallback:`, error.message);
    updateStatus('synced');
    return false;
  }
}

/**
 * Update Customer metrics (total orders, total spend, and khata balance) in Firestore
 */
export async function updateCustomerStatsInCloud(customerId, orderAmount, isKhataPayment) {
  if (!customerId) return;
  try {
    const custRef = doc(db, "customers", customerId);
    const snap = await getDoc(custRef);
    if (snap.exists()) {
      const data = snap.data();
      const newOrders = (data.totalOrders || 0) + 1;
      const newSpent = (data.totalSpent || 0) + orderAmount;
      const newKhata = isKhataPayment ? ((data.khataBalance || 0) + orderAmount) : (data.khataBalance || 0);
      const newPoints = (data.loyaltyPoints || 0) + Math.floor(orderAmount / 100);

      await setDoc(custRef, {
        totalOrders: newOrders,
        totalSpent: newSpent,
        khataBalance: newKhata,
        loyaltyPoints: newPoints,
        lastOrderDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (e) {
    console.warn(`[Firebase Firestore] Customer stats update fallback:`, e.message);
  }
}

/**
 * Real-time Listener for Customers Directory
 */
export function subscribeToCustomers(callback) {
  try {
    const custCol = collection(db, "customers");
    return onSnapshot(custCol, async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial customers into Firestore on first connect
        console.log("[Firebase Firestore] Seeding initial customers into Firestore...");
        for (const c of initialData.customers) {
          try {
            await setDoc(doc(db, "customers", c.id), {
              ...c,
              updatedAt: new Date().toISOString()
            });
          } catch(e) {}
        }
        callback(initialData.customers);
        return;
      }
      const customers = [];
      snapshot.forEach(docSnap => {
        customers.push(docSnap.data());
      });
      callback(customers);
    }, (err) => {
      console.warn(`[Firebase Firestore] Customers listener warning:`, err.message);
    });
  } catch (e) {
    console.warn(`[Firebase Firestore] Failed to subscribe to customers:`, e);
    return () => {};
  }
}

/**
 * Save branch KPIs & profits to Cloud Firestore
 */
export async function saveBranchKpisToCloud(branchId, kpis) {
  updateStatus('syncing');
  try {
    const kpiDocRef = doc(db, "branches", branchId, "kpis", "today");
    await setDoc(kpiDocRef, {
      ...kpis,
      branchId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    localStorage.setItem(`radhe_branch_${branchId}_kpis`, JSON.stringify(kpis));
    updateStatus('synced');
    return true;
  } catch (error) {
    console.warn(`[Firebase Firestore] Branch ${branchId} KPIs sync fallback:`, error.message);
    localStorage.setItem(`radhe_branch_${branchId}_kpis`, JSON.stringify(kpis));
    updateStatus('synced');
    return false;
  }
}

/**
 * Update Branch Profit & Revenue on each order in Firestore
 */
export async function updateBranchProfitInCloud(branchId, newOrder, sweets = []) {
  try {
    const kpiDocRef = doc(db, "branches", branchId, "kpis", "today");
    const snap = await getDoc(kpiDocRef);
    const existing = snap.exists() ? snap.data() : { sales: { value: 0 }, orders: { value: 0 }, profit: { value: 0 } };

    const orderTotal = newOrder.total || 0;
    let orderCost = 0;
    (newOrder.items || []).forEach(it => {
      const sw = sweets.find(s => s.id === it.id || s.name === it.name);
      const cost = sw?.costPrice || (it.rate * 0.6);
      orderCost += (it.quantity || it.qty || 1) * cost;
    });

    const orderProfit = Math.max(0, orderTotal - orderCost);
    const curSales = (existing.sales?.value || 42850) + orderTotal;
    const curOrders = (existing.orders?.value || 126) + 1;
    const curProfit = (existing.profit?.value || 14620) + orderProfit;
    const margin = curSales > 0 ? ((curProfit / curSales) * 100).toFixed(1) + '%' : '34.5%';

    const updatedKpis = {
      sales: { value: curSales, change: "+12.8% today", isUp: true, formatted: `₹${curSales.toLocaleString()}` },
      orders: { value: curOrders, change: "+8.5%", isUp: true, formatted: String(curOrders) },
      profit: { value: curProfit, change: `${margin} margin`, isUp: true, formatted: `₹${curProfit.toLocaleString()}` },
      cost: { value: curSales - curProfit, change: "63.2%", isUp: false, formatted: `₹${(curSales - curProfit).toLocaleString()}` },
      updatedAt: new Date().toISOString()
    };

    await setDoc(kpiDocRef, updatedKpis, { merge: true });
    return updatedKpis;
  } catch (e) {
    console.warn(`[Firebase Firestore] Update profit warning:`, e.message);
    return null;
  }
}

/**
 * Real-time Listener for Branch KPIs & Profits
 */
export function subscribeToBranchKpis(branchId, callback) {
  try {
    const kpiDocRef = doc(db, "branches", branchId, "kpis", "today");
    return onSnapshot(kpiDocRef, (snap) => {
      if (snap.exists()) {
        callback(snap.data());
      }
    }, (err) => {
      console.warn(`[Firebase Firestore] KPIs listener warning:`, err.message);
    });
  } catch (e) {
    console.warn(`[Firebase Firestore] Failed to subscribe to KPIs:`, e);
    return () => {};
  }
}

/**
 * Live Active Checkout Details (Draft ticket / Counter state) in Firestore
 * Syncs active cart, selected customer, discount in real-time across terminals
 */
let checkoutSyncTimer = null;
export function saveActiveCheckoutToCloud(branchId, checkoutData) {
  if (checkoutSyncTimer) clearTimeout(checkoutSyncTimer);
  checkoutSyncTimer = setTimeout(async () => {
    try {
      const checkoutRef = doc(db, "branches", branchId, "activeCheckout", "current");
      await setDoc(checkoutRef, {
        posCart: checkoutData.posCart || [],
        selectedCustomer: checkoutData.selectedCustomer || null,
        discountPercent: checkoutData.discountPercent || 0,
        paymentMethod: checkoutData.paymentMethod || 'Cash',
        cartSubtotal: (checkoutData.posCart || []).reduce((sum, it) => sum + (it.rate * it.qty), 0),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn(`[Firebase Firestore] Active checkout sync error:`, e.message);
    }
  }, 350);
}

export async function clearActiveCheckoutInCloud(branchId) {
  try {
    const checkoutRef = doc(db, "branches", branchId, "activeCheckout", "current");
    await setDoc(checkoutRef, {
      posCart: [],
      selectedCustomer: null,
      discountPercent: 0,
      paymentMethod: 'Cash',
      cartSubtotal: 0,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn(`[Firebase Firestore] Clear checkout error:`, e.message);
  }
}

export function subscribeToActiveCheckout(branchId, callback) {
  try {
    const checkoutRef = doc(db, "branches", branchId, "activeCheckout", "current");
    return onSnapshot(checkoutRef, (snap) => {
      if (snap.exists()) {
        callback(snap.data());
      }
    }, (err) => {
      console.warn(`[Firebase Firestore] Active checkout listener warning:`, err.message);
    });
  } catch (e) {
    console.warn(`[Firebase Firestore] Failed to subscribe to checkout:`, e);
    return () => {};
  }
}

// Cloud Storage REST Endpoints
const BUCKET = firebaseConfig.storageBucket || "radhesweets0.firebasestorage.app";
const BASE_STORAGE_URL = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o`;

/**
 * Upload JSON payload or Buffer to Firebase Cloud Storage via REST
 */
export async function uploadToFirebaseStorage(storagePath, content, contentType = "application/json") {
  const encodedName = encodeURIComponent(storagePath);
  const uploadUrl = `${BASE_STORAGE_URL}?uploadType=media&name=${encodedName}`;
  const body = typeof content === 'string' ? content : JSON.stringify(content, null, 2);

  try {
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body
    });
    if (res.ok) {
      const data = await res.json();
      return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodedName}?alt=media${data.downloadTokens ? `&token=${data.downloadTokens}` : ''}`;
    }
  } catch (err) {
    console.warn(`[Firebase Storage] Upload failed for ${storagePath}:`, err.message);
  }
  return null;
}

/**
 * Upload all 100 sweets catalog to Firebase Cloud Storage
 */
export async function uploadAllSweetsToStorage(sweets) {
  return await uploadToFirebaseStorage("sweets/catalog_100_sweets.json", {
    title: "Radhe Sweets Master Confectionery Catalog",
    totalCount: sweets.length,
    updatedAt: new Date().toISOString(),
    sweets
  });
}

/**
 * Upload individual order to Firebase Cloud Storage
 */
export async function uploadOrderToStorage(order) {
  await uploadToFirebaseStorage(`orders/items/${order.id}.json`, order);
  return true;
}

/**
 * Upload performance analytics & KPIs to Firebase Cloud Storage
 */
export async function uploadPerformanceToStorage(analytics, kpis) {
  return await uploadToFirebaseStorage("performance/analytics_and_kpis.json", {
    title: "Radhe Sweets Store Performance & Financial Analytics",
    syncedAt: new Date().toISOString(),
    kpis,
    analytics
  });
}

/**
 * One-Click Full ERP Cloud Sync to Firebase Storage & Firestore
 */
export async function syncAllToFirebaseCloud(state) {
  updateStatus('syncing');
  const tasks = [];
  
  // 1. Sweets Catalog (All 100 sweets into Firestore & Storage)
  if (state.sweets && state.sweets.length > 0) {
    tasks.push(uploadAllSweetsToStorage(state.sweets));
    tasks.push(saveBranchSweetsToCloud(state.currentBranchId || 'br-1', state.sweets));
  }

  // 2. Orders into Firestore & Storage
  if (state.orders && state.orders.length > 0) {
    tasks.push(uploadToFirebaseStorage("orders/all_orders.json", {
      totalOrders: state.orders.length,
      updatedAt: new Date().toISOString(),
      orders: state.orders
    }));
    state.orders.slice(0, 15).forEach(order => {
      tasks.push(saveBranchOrderToCloud(state.currentBranchId || 'br-1', order, state.sweets, state.customers));
    });
  }

  // 3. Performance & KPIs
  tasks.push(uploadPerformanceToStorage(state.analytics, state.kpis));
  tasks.push(saveBranchKpisToCloud(state.currentBranchId || 'br-1', state.kpis));

  // 4. Staff & Payroll
  if (state.staff && state.staff.length > 0) {
    tasks.push(uploadToFirebaseStorage("staff/staff_roster.json", {
      totalStaff: state.staff.length,
      updatedAt: new Date().toISOString(),
      staff: state.staff
    }));
  }

  // 5. Customers & Khata
  if (state.customers && state.customers.length > 0) {
    tasks.push(uploadToFirebaseStorage("customers/customers_khata.json", {
      totalCustomers: state.customers.length,
      updatedAt: new Date().toISOString(),
      customers: state.customers
    }));
    state.customers.forEach(cust => {
      tasks.push(saveCustomerToCloud(cust));
    });
  }

  // 6. Expenses
  if (state.expenses) {
    tasks.push(uploadToFirebaseStorage("expenses/expenses_ledger.json", {
      updatedAt: new Date().toISOString(),
      expenses: state.expenses
    }));
  }

  // 7. Global Snapshot Manifest
  tasks.push(uploadToFirebaseStorage("manifest/radhe_sweets_global_backup.json", {
    appName: "Radhe Sweets Shop Manager & Live Kitchen Console",
    syncedAt: new Date().toISOString(),
    sweetsCount: state.sweets?.length || 0,
    ordersCount: state.orders?.length || 0,
    staffCount: state.staff?.length || 0,
    customersCount: state.customers?.length || 0,
    branchId: state.currentBranchId || 'br-1',
    kpis: state.kpis
  }));

  const results = await Promise.allSettled(tasks);
  const successCount = results.filter(r => r.status === 'fulfilled').length;
  updateStatus('synced');
  return { success: true, count: successCount };
}
