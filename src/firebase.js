// Firebase Cloud Firestore ERP Integration for Radhe Sweets
// Real-time Cloud persistence per store branch (Navrangpura, Satellite, SG Highway)
// Project: radhesweets0 - Pure Cloud Firestore (No Storage)

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  deleteDoc,
  collection, 
  onSnapshot,
  query,
  limit,
  serverTimestamp
} from "firebase/firestore";
import { initialData } from "./data.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBwwDF69fFaa0dT7praHTIpwmL4RlQ24i0",
  authDomain: "radhesweets0.firebaseapp.com",
  projectId: "radhesweets0",
  messagingSenderId: "968718161119",
  appId: "1:968718161119:web:30822e03e06865eb25056a",
  measurementId: "G-6S1GR5B6TF"
};

// Initialize Firebase App & Firestore Database (Targeting database 'default' in asia-south1)
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "default");

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
  syncStatus: 'synced', // 'synced' | 'syncing' | 'needs_db_create' | 'offline'
  activeBranchId: 'br-1',
  errorDetails: null
};

const statusListeners = new Set();
export function onFirestoreStatusChange(cb) {
  statusListeners.add(cb);
  return () => statusListeners.delete(cb);
}

function updateStatus(newStatus, error = null) {
  firestoreLiveState.syncStatus = newStatus;
  firestoreLiveState.lastSyncTime = new Date();
  if (error) firestoreLiveState.errorDetails = error;
  if (newStatus === 'synced') firestoreLiveState.connected = true;
  statusListeners.forEach(cb => {
    try { cb(firestoreLiveState); } catch(e) {}
  });
}

// Graceful error handler with explicit Firestore diagnostics
export function handleFirestoreError(label, err) {
  if (!err) return;
  const msg = err?.message || String(err);
  if (
    msg.includes('not found') || 
    msg.includes('(default)') ||
    err?.code === 'not-found'
  ) {
    firestoreLiveState.connected = false;
    updateStatus('needs_db_create', 'Firestore (default) database not yet created in Firebase Console.');
    console.warn(`[Firebase Firestore] Note: Database not yet created in project radhesweets0. To enable cross-device cloud sync, click "Create database" at: https://console.firebase.google.com/project/radhesweets0/firestore`);
    return;
  }
  if (msg.includes('offline') || msg.includes('unavailable') || err?.code === 'unavailable') {
    firestoreLiveState.connected = false;
    updateStatus('offline', msg);
    return;
  }
  console.warn(`[Firebase Firestore] ${label}:`, msg);
}

/**
 * Diagnostic & Active Connection Ping for Cloud Firestore
 */
export async function testFirestoreConnection() {
  updateStatus('syncing');
  try {
    const pingRef = doc(db, "_system", "connection_test");
    await setDoc(pingRef, {
      ping: true,
      timestamp: new Date().toISOString(),
      clientTime: Date.now(),
      status: "online"
    });
    updateStatus('synced');
    firestoreLiveState.connected = true;
    firestoreLiveState.errorDetails = null;
    return { success: true, message: 'Firestore connection verified successfully!' };
  } catch (err) {
    const msg = err?.message || String(err);
    const code = err?.code || 'unknown';
    handleFirestoreError('Connection Test', err);
    return { 
      success: false, 
      code,
      message: msg,
      needsDbCreate: msg.includes('not found') || msg.includes('(default)') || code === 'not-found'
    };
  }
}

/**
 * Generate Branch Catalog with all 100 sweets, customized stock & rates per branch
 */
export function getBranchDefaultCatalog(branchId) {
  const masterSweets = initialData.sweets || [];
  
  if (branchId === "br-2") {
    return {
      name: "Satellite Luxury Boutique",
      branchId: "br-2",
      kpis: {
        revenue: { value: 0, target: 35000, progress: 0, change: "0.0% margin" },
        orders: { value: 0, target: 100, progress: 0, change: "0 orders" },
        sweetsSold: { value: 0, unit: "kg", target: 110, progress: 0, change: "0 kg" },
        customers: { value: 0, target: 85, progress: 0, change: "0 patrons" },
        profit: { value: 0, change: "0.0% margin", isUp: false, formatted: "₹0" },
        sales: { value: 0, formatted: "₹0" },
        cost: { value: 0, formatted: "₹0" },
        returningCustomers: { value: 0 }
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
    return {
      name: "SG Highway Central Kitchen",
      branchId: "br-3",
      kpis: {
        revenue: { value: 0, target: 60000, progress: 0, change: "0.0% margin" },
        orders: { value: 0, target: 180, progress: 0, change: "0 orders" },
        sweetsSold: { value: 0, unit: "kg", target: 350, progress: 0, change: "0 kg" },
        customers: { value: 0, target: 150, progress: 0, change: "0 patrons" },
        profit: { value: 0, change: "0.0% margin", isUp: false, formatted: "₹0" },
        sales: { value: 0, formatted: "₹0" },
        cost: { value: 0, formatted: "₹0" },
        returningCustomers: { value: 0 }
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
    return {
      name: "Navrangpura Flagship",
      branchId: "br-1",
      kpis: {
        revenue: { value: 42850, target: 45000, progress: 95.2, change: "+12.4% vs last week" },
        orders: { value: 126, target: 140, progress: 90.0, change: "+8.1% vs last week" },
        sweetsSold: { value: 184, unit: "kg", target: 200, progress: 92.0, change: "+15.2% vs last week" },
        customers: { value: 98, target: 110, progress: 89.1, change: "+6.3% vs last week" },
        profit: { value: 14620, change: "34.1% margin", isUp: true, formatted: "₹14,620" },
        sales: { value: 42850, formatted: "₹42,850" },
        cost: { value: 28230, formatted: "₹28,230" },
        returningCustomers: { value: 76 }
      },
      sweets: masterSweets.map(s => ({ ...s }))
    };
  }
}

/**
 * Save branch details directly to Cloud Firestore (both branch document and metadata index)
 * Saves EVERY detail: name, code, city, address, phone, manager, targets, revenue, margin, status, etc.
 */
export async function saveBranchToCloud(branch, allBranches = null) {
  updateStatus('syncing');
  try {
    const branchDocRef = doc(db, "branches", branch.id);
    const branchPayload = {
      id: branch.id,
      name: branch.name || 'Unnamed Branch',
      code: branch.code || '',
      city: branch.city || 'Ahmedabad',
      address: branch.address || '',
      phone: branch.phone || '',
      manager: branch.manager || '',
      revenue: Number(branch.revenue) || 0,
      orders: Number(branch.orders) || 0,
      margin: branch.margin || '34%',
      targetDailyRevenue: Number(branch.targetDailyRevenue || branch.targetDailySales) || 50000,
      targetDailySales: Number(branch.targetDailyRevenue || branch.targetDailySales) || 50000,
      targetMargin: branch.targetMargin || '35%',
      status: branch.status || 'Active',
      sweetsCount: branch.sweetsCount || 100,
      createdAt: branch.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(branchDocRef, branchPayload, { merge: true });

    if (allBranches && Array.isArray(allBranches)) {
      const metaRef = doc(db, "metadata", "branches");
      await setDoc(metaRef, {
        list: allBranches.map(b => b.id === branch.id ? { ...b, ...branchPayload } : b),
        count: allBranches.length,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    }

    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Save branch ${branch.id}`, error);
    return false;
  }
}

/**
 * Delete branch from Cloud Firestore
 */
export async function deleteBranchFromCloud(branchId, remainingBranches = null) {
  updateStatus('syncing');
  try {
    const branchDocRef = doc(db, "branches", branchId);
    await deleteDoc(branchDocRef);

    if (remainingBranches && Array.isArray(remainingBranches)) {
      const metaRef = doc(db, "metadata", "branches");
      await setDoc(metaRef, {
        list: remainingBranches,
        count: remainingBranches.length,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    }

    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Delete branch ${branchId}`, error);
    return false;
  }
}

/**
 * Real-time listener for branch updates across all devices and tabs
 * Uses Firestore collection listener for instant multi-device reflection
 */
export function subscribeToBranches(callback) {
  try {
    const branchesCol = collection(db, "branches");
    return onSnapshot(branchesCol, (snapshot) => {
      if (snapshot.empty) return;
      const list = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          name: d.name || docSnap.id,
          code: d.code || 'BR-LOC',
          city: d.city || 'Ahmedabad',
          address: d.address || '',
          phone: d.phone || '',
          manager: d.manager || '',
          revenue: Number(d.revenue) || 0,
          orders: Number(d.orders) || 0,
          margin: d.margin || '34%',
          targetDailyRevenue: Number(d.targetDailyRevenue || d.targetDailySales) || 50000,
          targetDailySales: Number(d.targetDailyRevenue || d.targetDailySales) || 50000,
          targetMargin: d.targetMargin || '35%',
          status: d.status || 'Active',
          sweetsCount: d.sweetsCount || (d.sweets ? d.sweets.length : 100),
          createdAt: d.createdAt || null,
          updatedAt: d.updatedAt || null
        });
      });
      if (list.length > 0) {
        updateStatus('synced');
        callback(list);
      }
    }, (err) => {
      handleFirestoreError('Branches collection listener', err);
    });
  } catch (e) {
    handleFirestoreError('Failed to subscribe to branches', e);
    return () => {};
  }
}

/**
 * Load all branches directly from Cloud Firestore
 */
export async function loadBranchesFromCloud() {
  try {
    const snap = await Promise.race([
      getDocs(collection(db, "branches")),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);
    if (snap && snap.docs && snap.docs.length > 0) {
      const list = [];
      snap.forEach(docSnap => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          name: d.name || docSnap.id,
          code: d.code || 'BR-LOC',
          city: d.city || 'Ahmedabad',
          address: d.address || '',
          phone: d.phone || '',
          manager: d.manager || '',
          revenue: Number(d.revenue) || 0,
          orders: Number(d.orders) || 0,
          margin: d.margin || '34%',
          targetDailyRevenue: Number(d.targetDailyRevenue || d.targetDailySales) || 50000,
          targetDailySales: Number(d.targetDailyRevenue || d.targetDailySales) || 50000,
          targetMargin: d.targetMargin || '35%',
          status: d.status || 'Active',
          sweetsCount: d.sweetsCount || (d.sweets ? d.sweets.length : 100),
          createdAt: d.createdAt || null,
          updatedAt: d.updatedAt || null
        });
      });
      updateStatus('synced');
      return list;
    }
  } catch (error) {
    handleFirestoreError('Load branches from cloud', error);
  }
  return null;
}

/**
 * Load complete branch data (all 100 sweets, KPIs) from Cloud Firestore
 */
export async function loadBranchDataFromCloud(branchId) {
  const seed = getBranchDefaultCatalog(branchId);
  try {
    const branchDocRef = doc(db, "branches", branchId);
    const snap = await Promise.race([
      getDoc(branchDocRef),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ]);
    if (snap && snap.exists && snap.exists() && snap.data()?.sweets && snap.data().sweets.length >= 50) {
      const data = snap.data();
      let branchKpis = data.kpis || seed.kpis;
      updateStatus('synced');
      return { sweets: data.sweets, kpis: branchKpis };
    }
  } catch (error) {
    handleFirestoreError(`Load branch ${branchId}`, error);
  }

  // Fallback to local snapshot
  try {
    const localSnap = JSON.parse(localStorage.getItem(`radhe_branch_${branchId}_snapshot`) || 'null');
    if (localSnap && localSnap.sweets && localSnap.sweets.length >= 50) {
      return { sweets: localSnap.sweets, kpis: localSnap.kpis || seed.kpis };
    }
  } catch(e) {}
  return { sweets: seed.sweets, kpis: seed.kpis };
}

/**
 * Save branch-specific sweets & stock directly to Cloud Firestore
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
    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Branch ${branchId} sweets sync`, error);
    return false;
  }
}

/**
 * Real-time Listener for Branch Sweets Catalog & Stock (Firestore)
 */
export function subscribeToBranchSweets(branchId, callback) {
  try {
    const branchDocRef = doc(db, "branches", branchId);
    return onSnapshot(branchDocRef, (snap) => {
      if (snap.exists() && snap.data()?.sweets && snap.data().sweets.length > 0) {
        updateStatus('synced');
        callback(snap.data().sweets, snap.data().categories, snap.data().receiptSettings);
      }
    }, (err) => {
      handleFirestoreError('Sweets listener', err);
    });
  } catch (e) {
    handleFirestoreError('Failed to subscribe to sweets', e);
    return () => {};
  }
}

/**
 * Save branch receipt settings & preferences to Cloud Firestore
 */
export async function saveBranchSettingsToCloud(branchId, settings) {
  updateStatus('syncing');
  try {
    const branchDocRef = doc(db, "branches", branchId);
    await setDoc(branchDocRef, {
      receiptSettings: settings,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Branch ${branchId} settings sync`, error);
    return false;
  }
}

/**
 * Save custom categories to Cloud Firestore
 */
export async function saveBranchCategoriesToCloud(branchId, categories) {
  updateStatus('syncing');
  try {
    const branchDocRef = doc(db, "branches", branchId);
    await setDoc(branchDocRef, {
      categories: categories,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Branch ${branchId} categories sync`, error);
    return false;
  }
}

/**
 * Save order directly to Cloud Firestore
 */
export async function saveBranchOrderToCloud(branchId, order, currentSweets = [], allCustomers = []) {
  updateStatus('syncing');
  try {
    // 1. Save to branch orders subcollection
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

    // 4. Update Customer details & loyalty points in Firestore
    if (order.customerId) {
      await updateCustomerStatsInCloud(order.customerId, order.total);
    }

    // 5. Update branch KPIs & Revenue in Firestore
    await updateBranchProfitInCloud(branchId, order, currentSweets);

    // 6. Clear active counter checkout draft
    await clearActiveCheckoutInCloud(branchId);

    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Order ${order.id} sync`, error);
    return false;
  }
}

/**
 * Delete order from Cloud Firestore
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
    handleFirestoreError(`Delete order ${orderId}`, error);
    return false;
  }
}

/**
 * Real-time Listener for Branch Orders (Firestore)
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
      updateStatus('synced');
      callback(orders);
    }, (err) => {
      handleFirestoreError('Orders listener', err);
    });
  } catch (e) {
    handleFirestoreError('Failed to subscribe to orders', e);
    return () => {};
  }
}

/**
 * Save customer to Cloud Firestore
 */
export async function saveCustomerToCloud(customer, branchId = null) {
  updateStatus('syncing');
  try {
    const custDocRef = doc(db, "customers", customer.id);
    await setDoc(custDocRef, {
      ...customer,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    if (branchId) {
      const branchCustRef = doc(db, "branches", branchId, "customers", customer.id);
      await setDoc(branchCustRef, {
        ...customer,
        branchId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Customer ${customer.id} sync`, error);
    return false;
  }
}

export async function saveBranchCustomerToCloud(branchId, customer) {
  return saveCustomerToCloud(customer, branchId);
}

export async function saveAllBranchCustomersToCloud(branchId, customers) {
  for (const cust of customers) {
    await saveCustomerToCloud(cust, branchId);
  }
}

/**
 * Update Customer metrics in Firestore
 */
export async function updateCustomerStatsInCloud(customerId, orderAmount) {
  if (!customerId) return;
  try {
    const custRef = doc(db, "customers", customerId);
    const snap = await getDoc(custRef);
    if (snap.exists()) {
      const data = snap.data();
      const newOrders = (data.totalOrders || 0) + 1;
      const newSpent = (data.totalSpent || 0) + orderAmount;
      const newPoints = (data.loyaltyPoints || 0) + Math.floor(orderAmount / 100);

      await setDoc(custRef, {
        totalOrders: newOrders,
        totalSpent: newSpent,
        loyaltyPoints: newPoints,
        lastOrderDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (e) {
    handleFirestoreError('Customer stats update', e);
  }
}

/**
 * Real-time Listener for Branch Customers Directory (Firestore)
 */
export function subscribeToBranchCustomers(branchId, callback) {
  try {
    const branchCustCol = collection(db, "branches", branchId, "customers");
    return onSnapshot(branchCustCol, (snapshot) => {
      if (snapshot.empty) {
        callback(branchId === "br-1" ? initialData.customers : []);
        return;
      }
      const cloudCustomers = [];
      snapshot.forEach(docSnap => {
        cloudCustomers.push(docSnap.data());
      });

      if (branchId === "br-1") {
        const merged = initialData.customers.map(c => {
          const match = cloudCustomers.find(cc => cc.id === c.id);
          return match ? { ...c, ...match } : c;
        });
        cloudCustomers.forEach(cc => {
          if (!merged.some(m => m.id === cc.id)) merged.push(cc);
        });
        updateStatus('synced');
        callback(merged);
      } else {
        updateStatus('synced');
        callback(cloudCustomers);
      }
    }, (err) => {
      handleFirestoreError(`Branch ${branchId} customers listener`, err);
    });
  } catch (e) {
    handleFirestoreError('Failed to subscribe to branch customers', e);
    return () => {};
  }
}

/**
 * Real-time Listener for Customers Directory (Global)
 */
export function subscribeToCustomers(callback) {
  try {
    const custCol = collection(db, "customers");
    return onSnapshot(custCol, async (snapshot) => {
      if (snapshot.empty) {
        callback(initialData.customers);
        return;
      }
      const customers = [];
      snapshot.forEach(docSnap => {
        customers.push(docSnap.data());
      });
      updateStatus('synced');
      callback(customers);
    }, (err) => {
      handleFirestoreError('Customers listener', err);
    });
  } catch (e) {
    handleFirestoreError('Failed to subscribe to customers', e);
    return () => {};
  }
}

/**
 * Save Staff Member to Cloud Firestore
 */
export async function saveStaffMemberToCloud(staffMember, branchId = null) {
  updateStatus('syncing');
  try {
    const staffDocRef = doc(db, "staff", staffMember.id);
    await setDoc(staffDocRef, {
      ...staffMember,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    if (branchId) {
      const branchStaffRef = doc(db, "branches", branchId, "staff", staffMember.id);
      await setDoc(branchStaffRef, {
        ...staffMember,
        branchId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Staff ${staffMember.id} sync`, error);
    return false;
  }
}

export async function deleteStaffMemberFromCloud(staffId, branchId = null) {
  updateStatus('syncing');
  try {
    await deleteDoc(doc(db, "staff", staffId));
    if (branchId) {
      await deleteDoc(doc(db, "branches", branchId, "staff", staffId));
    }
    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Delete staff ${staffId}`, error);
    return false;
  }
}

export function subscribeToBranchStaff(branchId, callback) {
  try {
    const branchStaffCol = collection(db, "branches", branchId, "staff");
    return onSnapshot(branchStaffCol, (snapshot) => {
      if (snapshot.empty) {
        callback(initialData.staff || []);
        return;
      }
      const staffList = [];
      snapshot.forEach(docSnap => {
        staffList.push(docSnap.data());
      });
      updateStatus('synced');
      callback(staffList);
    }, (err) => {
      handleFirestoreError(`Branch ${branchId} staff listener`, err);
    });
  } catch (e) {
    handleFirestoreError('Failed to subscribe to branch staff', e);
    return () => {};
  }
}

/**
 * Save Expense to Cloud Firestore
 */
export async function saveExpenseToCloud(expense, branchId = null) {
  updateStatus('syncing');
  try {
    const expenseDocRef = doc(db, "expenses", expense.id);
    await setDoc(expenseDocRef, {
      ...expense,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    if (branchId) {
      const branchExpenseRef = doc(db, "branches", branchId, "expenses", expense.id);
      await setDoc(branchExpenseRef, {
        ...expense,
        branchId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Expense ${expense.id} sync`, error);
    return false;
  }
}

export async function deleteExpenseFromCloud(expenseId, branchId = null) {
  updateStatus('syncing');
  try {
    await deleteDoc(doc(db, "expenses", expenseId));
    if (branchId) {
      await deleteDoc(doc(db, "branches", branchId, "expenses", expenseId));
    }
    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Delete expense ${expenseId}`, error);
    return false;
  }
}

export function subscribeToBranchExpenses(branchId, callback) {
  try {
    const branchExpensesCol = collection(db, "branches", branchId, "expenses");
    return onSnapshot(branchExpensesCol, (snapshot) => {
      const expensesList = [];
      snapshot.forEach(docSnap => {
        expensesList.push(docSnap.data());
      });
      updateStatus('synced');
      callback({ total: expensesList.reduce((sum, e) => sum + (e.amount || 0), 0), items: expensesList });
    }, (err) => {
      handleFirestoreError(`Branch ${branchId} expenses listener`, err);
    });
  } catch (e) {
    handleFirestoreError('Failed to subscribe to branch expenses', e);
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
    updateStatus('synced');
    return true;
  } catch (error) {
    handleFirestoreError(`Branch ${branchId} KPIs sync`, error);
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
    const baseSales = existing.sales?.value ?? (branchId === 'br-1' ? 42850 : 0);
    const baseOrders = existing.orders?.value ?? (branchId === 'br-1' ? 126 : 0);
    const baseProfit = existing.profit?.value ?? (branchId === 'br-1' ? 14620 : 0);

    const curSales = baseSales + orderTotal;
    const curOrders = baseOrders + 1;
    const curProfit = baseProfit + orderProfit;
    const margin = curSales > 0 ? ((curProfit / curSales) * 100).toFixed(1) + '%' : '0.0%';

    const updatedKpis = {
      sales: { value: curSales, change: "+12.8% today", isUp: true, formatted: `₹${curSales.toLocaleString()}` },
      orders: { value: curOrders, change: "+8.5%", isUp: true, formatted: String(curOrders) },
      profit: { value: curProfit, change: `${margin} margin`, isUp: true, formatted: `₹${curProfit.toLocaleString()}` },
      cost: { value: Math.max(0, curSales - curProfit), change: "63.2%", isUp: false, formatted: `₹${Math.max(0, curSales - curProfit).toLocaleString()}` },
      updatedAt: new Date().toISOString()
    };

    await setDoc(kpiDocRef, updatedKpis, { merge: true });
    return updatedKpis;
  } catch (e) {
    handleFirestoreError('Update profit', e);
    return null;
  }
}

/**
 * Real-time Listener for Branch KPIs & Profits (Firestore)
 */
export function subscribeToBranchKpis(branchId, callback) {
  try {
    const kpiDocRef = doc(db, "branches", branchId, "kpis", "today");
    return onSnapshot(kpiDocRef, (snap) => {
      if (snap.exists()) {
        updateStatus('synced');
        callback(snap.data());
      }
    }, (err) => {
      handleFirestoreError('KPIs listener', err);
    });
  } catch (e) {
    handleFirestoreError('Failed to subscribe to KPIs', e);
    return () => {};
  }
}

/**
 * Live Active Checkout Details in Firestore
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
      handleFirestoreError('Active checkout sync', e);
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
    handleFirestoreError('Clear checkout', e);
  }
}

export function subscribeToActiveCheckout(branchId, callback) {
  try {
    const checkoutRef = doc(db, "branches", branchId, "activeCheckout", "current");
    return onSnapshot(checkoutRef, (snap) => {
      if (snap.exists()) {
        updateStatus('synced');
        callback(snap.data());
      }
    }, (err) => {
      handleFirestoreError('Active checkout listener', err);
    });
  } catch (e) {
    handleFirestoreError('Failed to subscribe to checkout', e);
    return () => {};
  }
}

/**
 * One-Click Full ERP Cloud Sync directly into Cloud Firestore
 */
export async function syncAllToFirebaseCloud(state) {
  updateStatus('syncing');
  const tasks = [];
  const branchId = state.currentBranchId || 'br-1';

  // 1. Sweets Catalog (All 100 sweets directly to Firestore)
  if (state.sweets && state.sweets.length > 0) {
    tasks.push(saveBranchSweetsToCloud(branchId, state.sweets));
  }

  // 2. Orders into Firestore
  if (state.orders && state.orders.length > 0) {
    state.orders.slice(0, 30).forEach(order => {
      tasks.push(saveBranchOrderToCloud(branchId, order, state.sweets, state.customers));
    });
  }

  // 3. Performance & KPIs into Firestore
  if (state.kpis) {
    tasks.push(saveBranchKpisToCloud(branchId, state.kpis));
  }

  // 4. Staff & Payroll into Firestore
  if (state.staff && state.staff.length > 0) {
    state.staff.forEach(member => {
      tasks.push(saveStaffMemberToCloud(member, branchId));
    });
  }

  // 5. Customers & Khata into Firestore
  if (state.customers && state.customers.length > 0) {
    state.customers.forEach(cust => {
      tasks.push(saveCustomerToCloud(cust, branchId));
    });
  }

  // 6. Expenses into Firestore
  if (state.expenses && Array.isArray(state.expenses.items)) {
    state.expenses.items.forEach(exp => {
      tasks.push(saveExpenseToCloud(exp, branchId));
    });
  }

  // 7. Categories into Firestore
  if (state.categories && state.categories.length > 0) {
    tasks.push(saveBranchCategoriesToCloud(branchId, state.categories));
  }

  // 8. Printer & Receipt Settings into Firestore
  if (state.receiptSettings) {
    tasks.push(saveBranchSettingsToCloud(branchId, state.receiptSettings));
  }

  const results = await Promise.allSettled(tasks);
  const successCount = results.filter(r => r.status === 'fulfilled').length;
  updateStatus('synced');
  return { success: true, count: successCount };
}
