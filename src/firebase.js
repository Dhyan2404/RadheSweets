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
  collection, 
  getDocs, 
  onSnapshot 
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

// Initialize Firebase App & Services
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // Silent fallback
}
export { analytics };

// Distinct Initial Sweets and Stock by Branch
export const branchDefaultCatalog = {
  "br-1": {
    name: "Navrangpura Flagship",
    kpis: {
      revenue: { value: 42850, target: 45000, progress: 95.2, change: "+12.4% vs last week" },
      orders: { value: 126, target: 140, progress: 90.0, change: "+8.1% vs last week" },
      sweetsSold: { value: 184, unit: "kg", target: 200, progress: 92.0, change: "+15.2% vs last week" },
      customers: { value: 98, target: 110, progress: 89.1, change: "+6.3% vs last week" }
    },
    sweets: [
      { id: "sw-1", name: "Kaju Katli", tagline: "Diamond Silver Cut", category: "Sweets", pricePerKg: 450, costPrice: 280, grossMargin: "37.8%", stock: 35, unit: "kg", stockStatus: "In Stock", badge: "Bestseller", code: "KK", image: "./assets/kaju_katli.png", fallbackImage: "./assets/kaju_katli.png" },
      { id: "sw-2", name: "Gulab Jamun", tagline: "Shuddh Desi Ghee", category: "Sweets", pricePerKg: 180, costPrice: 110, grossMargin: "38.9%", stock: 18, unit: "kg", stockStatus: "In Stock", badge: "Fresh Daily", code: "GJ", image: "./assets/gulab_jamun.png", fallbackImage: "./assets/gulab_jamun.png" },
      { id: "sw-3", name: "Rasgulla", tagline: "Spongy Chhena", category: "Sweets", pricePerKg: 160, costPrice: 95, grossMargin: "40.6%", stock: 22, unit: "kg", stockStatus: "In Stock", badge: "Chilled", code: "RG", image: "./assets/rasgulla.png", fallbackImage: "./assets/rasgulla.png" },
      { id: "sw-4", name: "Motichoor Ladoo", tagline: "Desi Ghee Boondi", category: "Sweets", pricePerKg: 160, costPrice: 98, grossMargin: "38.8%", stock: 45, unit: "kg", stockStatus: "In Stock", badge: "Pooja Special", code: "ML", image: "./assets/motichoor_ladoo.png", fallbackImage: "./assets/motichoor_ladoo.png" },
      { id: "sw-5", name: "Kesar Peda", tagline: "Special Milk Peda", category: "Sweets", pricePerKg: 380, costPrice: 235, grossMargin: "38.2%", stock: 12, unit: "kg", stockStatus: "Low Stock", badge: "Low Stock", code: "KP", image: "./assets/kesar_peda.png", fallbackImage: "./assets/kesar_peda.png" },
      { id: "sw-6", name: "Dry Fruit Barfi", tagline: "Dry Fruit Sweet", category: "Sweets", pricePerKg: 420, costPrice: 260, grossMargin: "38.1%", stock: 28, unit: "kg", stockStatus: "In Stock", badge: "In Stock", code: "DF", image: "./assets/dry_fruit_barfi.png", fallbackImage: "./assets/dry_fruit_barfi.png" },
      { id: "sw-7", name: "Milk Cake", tagline: "Caramelized Mawa", category: "Sweets", pricePerKg: 300, costPrice: 185, grossMargin: "38.3%", stock: 34, unit: "kg", stockStatus: "In Stock", badge: "In Stock", code: "MC", image: "./assets/milk_cake.png", fallbackImage: "./assets/milk_cake.png" },
      { id: "sw-8", name: "Soan Papdi", tagline: "Desi Ghee", category: "Sweets", pricePerKg: 200, costPrice: 120, grossMargin: "40.0%", stock: 40, unit: "kg", stockStatus: "In Stock", badge: "In Stock", code: "SP", image: "./assets/soan_papdi.png", fallbackImage: "./assets/soan_papdi.png" },
      { id: "sw-9", name: "Special Punjabi Samosa", tagline: "Crisp Fried Farsan", category: "Snacks", pricePerKg: 180, costPrice: 95, grossMargin: "47.2%", stock: 50, unit: "kg", stockStatus: "In Stock", badge: "In Stock", code: "SS", image: "./assets/special_punjabi_samosa.png", fallbackImage: "./assets/special_punjabi_samosa.png" },
      { id: "sw-10", name: "Khaman Dhokla", tagline: "Nylon Steamed Snack", category: "Snacks", pricePerKg: 140, costPrice: 70, grossMargin: "50.0%", stock: 30, unit: "kg", stockStatus: "In Stock", badge: "In Stock", code: "KD", image: "./assets/khaman_dhokla.png", fallbackImage: "./assets/khaman_dhokla.png" }
    ]
  },
  "br-2": {
    name: "Satellite Luxury Boutique",
    kpis: {
      revenue: { value: 31400, target: 35000, progress: 89.7, change: "+9.8% vs last week" },
      orders: { value: 88, target: 100, progress: 88.0, change: "+5.4% vs last week" },
      sweetsSold: { value: 92, unit: "kg", target: 110, progress: 83.6, change: "+11.0% vs last week" },
      customers: { value: 74, target: 85, progress: 87.0, change: "+8.2% vs last week" }
    },
    sweets: [
      { id: "sw-b2-1", name: "Kaju Katli (Royal Vark)", tagline: "Premium Diamond Cut", category: "Sweets", pricePerKg: 480, costPrice: 290, grossMargin: "39.5%", stock: 48, unit: "kg", stockStatus: "In Stock", badge: "Luxury", code: "KK-LUX", image: "./assets/kaju_katli.png", fallbackImage: "./assets/kaju_katli.png" },
      { id: "sw-b2-2", name: "Dry Fruit Anjeer Roll", tagline: "Sugar-free Dried Figs & Pistachio", category: "Sweets", pricePerKg: 520, costPrice: 310, grossMargin: "40.3%", stock: 25, unit: "kg", stockStatus: "In Stock", badge: "Sugar-free", code: "AR", image: "./assets/dry_fruit_barfi.png", fallbackImage: "./assets/dry_fruit_barfi.png" },
      { id: "sw-b2-3", name: "Kesar Peda (Saffron Infused)", tagline: "Kashmiri Mawa Fudge", category: "Sweets", pricePerKg: 420, costPrice: 240, grossMargin: "42.8%", stock: 30, unit: "kg", stockStatus: "In Stock", badge: "Premium", code: "KP-PREM", image: "./assets/kesar_peda.png", fallbackImage: "./assets/kesar_peda.png" },
      { id: "sw-b2-4", name: "Pista Ghari", tagline: "Surati Festive Luxury Ghee Sweet", category: "Sweets", pricePerKg: 580, costPrice: 340, grossMargin: "41.3%", stock: 20, unit: "kg", stockStatus: "In Stock", badge: "Festive", code: "PG", image: "./assets/milk_cake.png", fallbackImage: "./assets/milk_cake.png" },
      { id: "sw-b2-5", name: "Kaju Pista Roll", tagline: "Artisanal Cashew & Green Pistachio", category: "Sweets", pricePerKg: 490, costPrice: 295, grossMargin: "39.7%", stock: 22, unit: "kg", stockStatus: "In Stock", badge: "Bestseller", code: "KPR", image: "./assets/kaju_katli.png", fallbackImage: "./assets/kaju_katli.png" },
      { id: "sw-b2-6", name: "Alwar Milk Cake", tagline: "Caramelized Rich Brown Mawa", category: "Sweets", pricePerKg: 320, costPrice: 190, grossMargin: "40.6%", stock: 20, unit: "kg", stockStatus: "In Stock", badge: "Rich Flavor", code: "MC-ALW", image: "./assets/milk_cake.png", fallbackImage: "./assets/milk_cake.png" },
      { id: "sw-b2-7", name: "Rasgulla", tagline: "Pure Cow Milk Chhena", category: "Sweets", pricePerKg: 170, costPrice: 100, grossMargin: "41.1%", stock: 25, unit: "kg", stockStatus: "In Stock", badge: "Fresh", code: "RG", image: "./assets/rasgulla.png", fallbackImage: "./assets/rasgulla.png" }
    ]
  },
  "br-3": {
    name: "SG Highway Central Kitchen",
    kpis: {
      revenue: { value: 58200, target: 60000, progress: 97.0, change: "+18.3% vs last week" },
      orders: { value: 174, target: 180, progress: 96.6, change: "+14.2% vs last week" },
      sweetsSold: { value: 340, unit: "kg", target: 350, progress: 97.1, change: "+22.0% vs last week" },
      customers: { value: 142, target: 150, progress: 94.6, change: "+11.5% vs last week" }
    },
    sweets: [
      { id: "sw-b3-1", name: "Motichoor Ladoo (Wholesale Batch)", tagline: "Desi Ghee Wedding Standard", category: "Sweets", pricePerKg: 150, costPrice: 90, grossMargin: "40.0%", stock: 120, unit: "kg", stockStatus: "In Stock", badge: "Bulk Batch", code: "ML-BULK", image: "./assets/motichoor_ladoo.png", fallbackImage: "./assets/motichoor_ladoo.png" },
      { id: "sw-b3-2", name: "Special Punjabi Samosa", tagline: "Large Golden Crisp Farsan", category: "Snacks", pricePerKg: 160, costPrice: 80, grossMargin: "50.0%", stock: 150, unit: "kg", stockStatus: "In Stock", badge: "High Volume", code: "SS-BULK", image: "./assets/special_punjabi_samosa.png", fallbackImage: "./assets/special_punjabi_samosa.png" },
      { id: "sw-b3-3", name: "Khaman Dhokla", tagline: "Fresh Steamed Nylon Farsan", category: "Snacks", pricePerKg: 130, costPrice: 65, grossMargin: "50.0%", stock: 80, unit: "kg", stockStatus: "In Stock", badge: "Morning Batch", code: "KD-BULK", image: "./assets/khaman_dhokla.png", fallbackImage: "./assets/khaman_dhokla.png" },
      { id: "sw-b3-4", name: "Jalebi Fafda Special", tagline: "Pure Desi Ghee Crispy Jalebi", category: "Snacks", pricePerKg: 240, costPrice: 120, grossMargin: "50.0%", stock: 65, unit: "kg", stockStatus: "In Stock", badge: "Morning Rush", code: "JF", image: "./assets/special_punjabi_samosa.png", fallbackImage: "./assets/special_punjabi_samosa.png" },
      { id: "sw-b3-5", name: "Gulab Jamun (Kitchen Batch)", tagline: "Deep Fried Hot Mawa Jamun", category: "Sweets", pricePerKg: 170, costPrice: 100, grossMargin: "41.1%", stock: 80, unit: "kg", stockStatus: "In Stock", badge: "Fresh Daily", code: "GJ-BULK", image: "./assets/gulab_jamun.png", fallbackImage: "./assets/gulab_jamun.png" },
      { id: "sw-b3-6", name: "Rasgulla Tin Cans", tagline: "Chilled Cottage Cheese Balls", category: "Sweets", pricePerKg: 150, costPrice: 90, grossMargin: "40.0%", stock: 95, unit: "kg", stockStatus: "In Stock", badge: "Tin Pack", code: "RG-TIN", image: "./assets/rasgulla.png", fallbackImage: "./assets/rasgulla.png" },
      { id: "sw-b3-7", name: "Soan Papdi (Box Pack)", tagline: "Layered Desi Ghee Flakes", category: "Sweets", pricePerKg: 190, costPrice: 110, grossMargin: "42.1%", stock: 90, unit: "kg", stockStatus: "In Stock", badge: "Sealed Box", code: "SP-BOX", image: "./assets/soan_papdi.png", fallbackImage: "./assets/soan_papdi.png" },
      { id: "sw-b3-8", name: "Kaju Katli (Factory Fresh)", tagline: "Standard Goan Cashew Diamond", category: "Sweets", pricePerKg: 440, costPrice: 270, grossMargin: "38.6%", stock: 60, unit: "kg", stockStatus: "In Stock", badge: "Factory Pack", code: "KK-FAC", image: "./assets/kaju_katli.png", fallbackImage: "./assets/kaju_katli.png" }
    ]
  }
};

/**
 * Save branch-specific sweets & stock to Cloud Firestore
 */
export async function saveBranchSweetsToCloud(branchId, sweets) {
  try {
    const branchDocRef = doc(db, "branches", branchId);
    await setDoc(branchDocRef, {
      sweets: sweets,
      branchId: branchId,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    localStorage.setItem(`radhe_branch_${branchId}_sweets`, JSON.stringify(sweets));
    return true;
  } catch (error) {
    console.warn(`[Firebase] Branch ${branchId} sweets sync fallback to local:`, error.message);
    localStorage.setItem(`radhe_branch_${branchId}_sweets`, JSON.stringify(sweets));
    return false;
  }
}

/**
 * Save branch-specific orders to Cloud Firestore
 */
export async function saveBranchOrderToCloud(branchId, order) {
  try {
    const orderDocRef = doc(db, "branches", branchId, "orders", order.id);
    await setDoc(orderDocRef, {
      ...order,
      branchId,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.warn(`[Firebase] Order ${order.id} sync fallback:`, error.message);
    return false;
  }
}

/**
 * Save branch-specific KPIs & revenue to Cloud Firestore
 */
export async function saveBranchKpisToCloud(branchId, kpis) {
  try {
    const kpiDocRef = doc(db, "branches", branchId, "kpis", "today");
    await setDoc(kpiDocRef, {
      ...kpis,
      branchId,
      updatedAt: new Date().toISOString()
    });
    localStorage.setItem(`radhe_branch_${branchId}_kpis`, JSON.stringify(kpis));
    return true;
  } catch (error) {
    console.warn(`[Firebase] Branch ${branchId} KPIs sync fallback:`, error.message);
    localStorage.setItem(`radhe_branch_${branchId}_kpis`, JSON.stringify(kpis));
    return false;
  }
}

/**
 * Save customer to Cloud Firestore
 */
export async function saveCustomerToCloud(customer) {
  try {
    const custDocRef = doc(db, "customers", customer.id);
    await setDoc(custDocRef, {
      ...customer,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn(`[Firebase] Customer ${customer.id} sync fallback:`, error.message);
    return false;
  }
}

/**
 * Load complete branch data (sweets, kpis) from Cloud Firestore with local seed fallback
 */
export async function loadBranchDataFromCloud(branchId) {
  const seed = branchDefaultCatalog[branchId] || branchDefaultCatalog["br-1"];

  try {
    const branchDocRef = doc(db, "branches", branchId);
    const snap = await getDoc(branchDocRef);
    if (snap.exists() && snap.data().sweets) {
      const data = snap.data();
      return {
        sweets: data.sweets,
        kpis: data.kpis || seed.kpis
      };
    } else {
      // Document does not exist yet on cloud -> Seed it now into Firestore!
      await setDoc(branchDocRef, {
        sweets: seed.sweets,
        kpis: seed.kpis,
        name: seed.name,
        branchId: branchId,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    }
  } catch (error) {
    console.warn(`[Firebase] Load branch ${branchId} from cloud fallback to cache:`, error.message);
  }

  // Return cached version if exists
  const cachedSweets = localStorage.getItem(`radhe_branch_${branchId}_sweets`);
  const cachedKpis = localStorage.getItem(`radhe_branch_${branchId}_kpis`);
  
  return {
    sweets: cachedSweets ? JSON.parse(cachedSweets) : seed.sweets,
    kpis: cachedKpis ? JSON.parse(cachedKpis) : seed.kpis
  };
}
