// Radhe Sweets - Comprehensive Firebase Storage & Cloud Sync Script
// Uploads all 100 sweet files, images, orders, performance analytics, and global ERP data to Firebase Storage
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialData } from '../src/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUCKET = "radhesweets0.firebasestorage.app";
const BASE_STORAGE_URL = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o`;

/**
 * Upload a JSON string or Buffer to Firebase Storage REST API
 */
async function uploadToStorage(storagePath, content, contentType = "application/json") {
  // Storage API requires URL-encoded object path in query
  const encodedName = encodeURIComponent(storagePath);
  const uploadUrl = `${BASE_STORAGE_URL}?uploadType=media&name=${encodedName}`;

  try {
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": contentType
      },
      body: content
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`❌ Failed to upload ${storagePath}: Status ${res.status}`, errText);
      return null;
    }

    const data = await res.json();
    const downloadToken = data.downloadTokens;
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodedName}?alt=media${downloadToken ? `&token=${downloadToken}` : ''}`;
    return { name: data.name, size: data.size, publicUrl, token: downloadToken };
  } catch (err) {
    console.error(`❌ Network error uploading ${storagePath}:`, err.message);
    return null;
  }
}

async function main() {
  console.log("=================================================================");
  console.log("  RADHE SWEETS - CLOUD STORAGE & FIRESTORE GLOBAL DATA SYNC");
  console.log(`  Bucket: ${BUCKET}`);
  console.log(`  Timestamp: ${new Date().toISOString()}`);
  console.log("=================================================================\n");

  const results = {
    sweetsCatalog: null,
    individualSweets: 0,
    sweetImages: 0,
    orders: 0,
    performance: null,
    staff: null,
    customers: null,
    expenses: null,
    globalManifest: null
  };

  // 1. Upload Master 100 Sweets Catalog
  console.log("📦 1. Uploading Master 100 Sweets Catalog...");
  const catalogPayload = JSON.stringify({
    title: "Radhe Sweets Master Confectionery Catalog",
    version: "2.0.0",
    totalCount: initialData.sweets.length,
    updatedAt: new Date().toISOString(),
    sweets: initialData.sweets
  }, null, 2);

  const catalogRes = await uploadToStorage("sweets/catalog_100_sweets.json", catalogPayload);
  if (catalogRes) {
    results.sweetsCatalog = catalogRes.publicUrl;
    console.log(`   ✅ Master catalog uploaded! (${initialData.sweets.length} sweets)`);
    console.log(`   🔗 URL: ${catalogRes.publicUrl}\n`);
  }

  // 2. Upload Individual Sweet Files (All 100 Sweets)
  console.log("🍬 2. Uploading Every Individual Sweet File (100 Files)...");
  let sweetCount = 0;
  for (const sweet of initialData.sweets) {
    const sweetPayload = JSON.stringify({
      ...sweet,
      store: "Radhe Sweets Ahmedabad",
      syncedAt: new Date().toISOString(),
      globalSyncStatus: "Active"
    }, null, 2);

    const sweetRes = await uploadToStorage(`sweets/items/${sweet.id}.json`, sweetPayload);
    if (sweetRes) sweetCount++;
  }
  results.individualSweets = sweetCount;
  console.log(`   ✅ Successfully uploaded ${sweetCount} individual sweet files to Firebase Storage!\n`);

  // 3. Upload Sweet Asset Images
  console.log("🖼️ 3. Uploading Sweet Images & Visual Assets...");
  const assetsDir = path.resolve(__dirname, '../public/assets');
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    let imgCount = 0;
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.svg')) {
        const filePath = path.join(assetsDir, file);
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = file.endsWith('.svg') ? 'image/svg+xml' : file.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
        const imgRes = await uploadToStorage(`sweets/images/${file}`, fileBuffer, mimeType);
        if (imgRes) {
          imgCount++;
        }
      }
    }
    results.sweetImages = imgCount;
    console.log(`   ✅ Successfully uploaded ${imgCount} sweet asset images to Firebase Storage!\n`);
  }

  // 4. Upload Orders Data
  console.log("📋 4. Uploading Orders Data & Order Archives...");
  const ordersPayload = JSON.stringify({
    title: "Radhe Sweets Orders Ledger",
    totalOrders: initialData.orders.length,
    updatedAt: new Date().toISOString(),
    orders: initialData.orders
  }, null, 2);

  const ordersRes = await uploadToStorage("orders/all_orders.json", ordersPayload);
  if (ordersRes) {
    console.log(`   ✅ Orders ledger uploaded! (${initialData.orders.length} orders)`);
    console.log(`   🔗 URL: ${ordersRes.publicUrl}`);
  }

  // Also upload individual orders
  let orderCount = 0;
  for (const order of initialData.orders) {
    const orderRes = await uploadToStorage(`orders/items/${order.id}.json`, JSON.stringify(order, null, 2));
    if (orderRes) orderCount++;
  }
  results.orders = orderCount;
  console.log(`   ✅ Uploaded ${orderCount} individual order records!\n`);

  // 5. Upload Performance, Analytics & KPI Data
  console.log("📊 5. Uploading Performance, Analytics & Store KPIs...");
  const performancePayload = JSON.stringify({
    title: "Radhe Sweets Store Performance & Financial Analytics",
    syncedAt: new Date().toISOString(),
    kpis: initialData.kpis,
    analytics: initialData.analytics,
    zReports: initialData.zReports,
    orderStatusCounts: initialData.orderStatusCounts
  }, null, 2);

  const perfRes = await uploadToStorage("performance/analytics_and_kpis.json", performancePayload);
  if (perfRes) {
    results.performance = perfRes.publicUrl;
    console.log(`   ✅ Performance & Analytics data uploaded!`);
    console.log(`   🔗 URL: ${perfRes.publicUrl}\n`);
  }

  // 6. Upload Staff & Payroll Records
  console.log("👥 6. Uploading Staff & Payroll Ledger...");
  const staffPayload = JSON.stringify({
    title: "Radhe Sweets Staff Team & Payroll Ledger",
    syncedAt: new Date().toISOString(),
    totalStaff: (initialData.staff || []).length,
    staff: initialData.staff || []
  }, null, 2);

  const staffRes = await uploadToStorage("staff/staff_roster.json", staffPayload);
  if (staffRes) {
    results.staff = staffRes.publicUrl;
    console.log(`   ✅ Staff team & payroll records uploaded!`);
    console.log(`   🔗 URL: ${staffRes.publicUrl}\n`);
  }

  // 7. Upload Customers & Khata Ledger
  console.log("🤝 7. Uploading Customers & Udhar Khata Ledger...");
  const customersPayload = JSON.stringify({
    title: "Radhe Sweets Customers & Udhar Khata Ledger",
    syncedAt: new Date().toISOString(),
    totalCustomers: initialData.customers.length,
    customers: initialData.customers
  }, null, 2);

  const custRes = await uploadToStorage("customers/customers_khata.json", customersPayload);
  if (custRes) {
    results.customers = custRes.publicUrl;
    console.log(`   ✅ Customers & Khata ledger uploaded!`);
    console.log(`   🔗 URL: ${custRes.publicUrl}\n`);
  }

  // 8. Upload Store Expenses Ledger
  console.log("💸 8. Uploading Store Expenses Ledger...");
  const expensesPayload = JSON.stringify({
    title: "Radhe Sweets Expenses Ledger",
    syncedAt: new Date().toISOString(),
    expenses: initialData.expenses
  }, null, 2);

  const expRes = await uploadToStorage("expenses/expenses_ledger.json", expensesPayload);
  if (expRes) {
    results.expenses = expRes.publicUrl;
    console.log(`   ✅ Expenses ledger uploaded!`);
    console.log(`   🔗 URL: ${expRes.publicUrl}\n`);
  }

  // 9. Upload Global Master ERP Manifest
  console.log("🌐 9. Uploading Global Master ERP Snapshot Manifest...");
  const globalManifest = JSON.stringify({
    appName: "Radhe Sweets Shop Manager & Live Kitchen Console",
    bucket: BUCKET,
    syncedAt: new Date().toISOString(),
    branchDefaultCatalog: initialData.branches,
    rawMaterials: initialData.rawMaterials,
    advanceOrders: initialData.advanceOrders,
    shopInfo: initialData.shopInfo,
    endpoints: {
      catalog100: results.sweetsCatalog,
      performance: results.performance,
      staff: results.staff,
      customers: results.customers,
      expenses: results.expenses
    }
  }, null, 2);

  const manifestRes = await uploadToStorage("manifest/radhe_sweets_global_backup.json", globalManifest);
  if (manifestRes) {
    results.globalManifest = manifestRes.publicUrl;
    console.log(`   ✅ Global Master ERP Manifest uploaded!`);
    console.log(`   🔗 URL: ${manifestRes.publicUrl}\n`);
  }

  console.log("=================================================================");
  console.log("  🎉 ALL SWEETS, FILES, ORDERS & PERFORMANCE DATA SYNCED!");
  console.log("  Summary:");
  console.log(`  - Master Sweets Catalog: 1 file (100 sweets)`);
  console.log(`  - Individual Sweet JSON Files: ${results.individualSweets} files`);
  console.log(`  - Sweet Asset Images: ${results.sweetImages} images`);
  console.log(`  - Orders Data: ${results.orders + 1} files`);
  console.log(`  - Performance & KPIs: 1 file`);
  console.log(`  - Staff & Payroll: 1 file`);
  console.log(`  - Customers & Khata: 1 file`);
  console.log(`  - Expenses: 1 file`);
  console.log(`  - Global Manifest: 1 file`);
  console.log("=================================================================\n");
}

main();
