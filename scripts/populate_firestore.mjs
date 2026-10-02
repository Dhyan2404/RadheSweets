import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initialData } from '../src/data.js';

const config = {
  apiKey: 'AIzaSyBwwDF69fFaa0dT7praHTIpwmL4RlQ24i0',
  authDomain: 'radhesweets0.firebaseapp.com',
  projectId: 'radhesweets0',
  messagingSenderId: '968718161119',
  appId: '1:968718161119:web:30822e03e06865eb25056a'
};

const app = initializeApp(config);
const db = getFirestore(app, 'default');

async function populate() {
  console.log('🚀 Pushing full Radhe Sweets ERP dataset to Cloud Firestore (database "default")...');

  // 1. Branches & 100 Sweets Catalog
  const branches = [
    { id: 'br-1', name: 'Navrangpura Flagship', code: 'BR-NAV-01' },
    { id: 'br-2', name: 'Satellite Luxury Boutique', code: 'BR-SAT-02' },
    { id: 'br-3', name: 'SG Highway Central Kitchen', code: 'BR-SGH-03' }
  ];

  for (const b of branches) {
    console.log(`Uploading Branch ${b.name} (${initialData.sweets.length} sweets)...`);
    const branchDoc = doc(db, 'branches', b.id);
    await setDoc(branchDoc, {
      branchId: b.id,
      name: b.name,
      code: b.code,
      sweets: initialData.sweets,
      sweetsCount: initialData.sweets.length,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  }

  // 2. Customers
  console.log(`Uploading ${initialData.customers.length} customers...`);
  for (const c of initialData.customers) {
    await setDoc(doc(db, 'customers', c.id), c, { merge: true });
  }

  // 3. Staff
  console.log(`Uploading ${initialData.staff.length} staff members...`);
  for (const s of initialData.staff) {
    await setDoc(doc(db, 'staff', s.id), s, { merge: true });
  }

  // 4. Orders
  console.log(`Uploading initial orders...`);
  for (const o of (initialData.orders || []).slice(0, 20)) {
    await setDoc(doc(db, 'orders', o.id), o, { merge: true });
    await setDoc(doc(db, 'branches', 'br-1', 'orders', o.id), o, { merge: true });
  }

  // 5. Expenses
  if (initialData.expenses && initialData.expenses.items) {
    console.log(`Uploading ${initialData.expenses.items.length} expenses...`);
    for (const exp of initialData.expenses.items) {
      await setDoc(doc(db, 'expenses', exp.id), exp, { merge: true });
    }
  }

  console.log('🎉 COMPLETE! All sweets, orders, customers, staff and branches successfully written to Cloud Firestore!');
  process.exit(0);
}

populate().catch(err => {
  console.error('Populate failed:', err);
  process.exit(1);
});
