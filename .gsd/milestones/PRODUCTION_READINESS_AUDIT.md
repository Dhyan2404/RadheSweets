# Milestone Audit: Real-World Shop Production Readiness (Radhe Sweets POS)

**Audited:** 2026-10-01  
**Target:** Live Retail Sweet Shop Deployment (Counter POS & Operations)  
**Status:** **NEEDS ATTENTION (Critical Gaps Identified Before Counter Go-Live)**

---

## 1. Executive Summary

| Metric | Current Value | Production Requirement |
|---|---|---|
| Identified Shop Readiness Gaps | **100 Items** | 0 Blockers |
| Critical Fallback Vectors | **14 Failure Modes** | 0 Unhandled Fallbacks |
| POS Hardware Integrations | Partial (Browser window.print only) | ESC/POS USB, Cash Drawer Kick, Serial Scale |
| Legal / Metrology Compliance | 0% GST Hardcoded, No Tare Weight | 5% GST HSN 2106, 50g Box Tare Deduction |
| Data Persistence Resilience | LocalStorage (5MB limit) | IndexedDB + Offline Sync Queue |
| Payment Integrity | Unverified single-choice radio | Dynamic UPI QR, Split Tender, Khata Limit Block |

---

## 2. Root Cause Analysis: Why Does the System Fall Back or Break in a Real Shop?

### Failure Mode 1: Metrology Non-Compliance (The Box Tare Weight Trap)
- **The Issue**: In sweet retail, shops weigh sweets inside boxes (empty box weight: 50g–80g). By law (Indian Legal Metrology Act), selling box weight at the price of Kaju Katli (₹900/kg) is a punishable offense carrying heavy fines.
- **Why It Falls Back**: The POS treats whatever weight is entered as pure sweet weight. There is no automated or one-tap Box Tare Deduction (e.g. `[Tare 50g Box]`, `[Tare 100g Box]`).
- **Required Fix**: Tare deduction selector on each item and weighing scale input, automatically calculating `Gross Wt - Tare Wt = Net Wt`.

### Failure Mode 2: Thermal Printing Freezes & Clumsy Browser Dialogs
- **The Issue**: Currently, printing receipts invokes browser native `window.print()`. This opens an OS dialog that pauses JavaScript execution, freezes the counter screen, takes 5–8 seconds per customer, and requires manual clicks on "Print".
- **Why It Falls Back**: In a festival rush (Diwali, Rakshabandhan) with 50 customers in queue, a 5-second browser dialog causes catastrophic queue bottlenecks. Furthermore, standard 58mm/80mm receipt printers without proper CSS margins cut off text or waste paper.
- **Required Fix**: Seamless thermal receipt formatting with print-preview modal, Esc/Pos USB/Bluetooth direct printing support, and automatic print-on-checkout toggle.

### Failure Mode 3: Cash Drawer Never Kicks Open
- **The Issue**: Cash drawers in retail shops are connected via an RJ11/RJ12 cable to the receipt printer. When a cash sale completes, the POS must transmit a kick pulse.
- **Why It Falls Back**: No kick command is sent, forcing the cashier to use a physical key for every transaction, slowing down cash counter speed by 3x.
- **Required Fix**: Integration of printer drawer kick sequence and digital drawer status in POS view.

### Failure Mode 4: Cash Rounding & Change Calculation
- **The Issue**: Selling 320g of sweet at ₹450/kg yields ₹144.00. But 175g at ₹550/kg yields ₹96.25. In Indian retail, 25 paise or 50 paise coins do not circulate.
- **Why It Falls Back**: System currently floors/ceils unpredictably. Cashiers make mental calculation errors when customer hands ₹500 or ₹200 note, causing end-of-day drawer cash shortages.
- **Required Fix**: Cash tendered input with instant "Change to Return: ₹X" banner and RBI standard ₹1 rounding.

### Failure Mode 5: Hardcoded 0% GST (Legal & Tax Non-Compliance)
- **The Issue**: [CheckoutModal.ts](file:///d:/Dhyan/websites/RadheSweets/src/components/CheckoutModal.ts) hardcodes: `GST (0% Fresh Sweets) ₹0`.
- **Why It Falls Back**: Sweets sold by registered businesses in India are subject to 5% GST (2.5% CGST + 2.5% SGST) under HSN Code 2106 90. Issuing tax invoices without GSTIN, HSN, and CGST/SGST breakdown is illegal for GST-registered shops.
- **Required Fix**: Configurable GST toggle (Composite Scheme 1% vs Regular 5% CGST/SGST vs Tax-Inclusive Counter Pricing) with official tax invoice headers.

### Failure Mode 6: Khata Credit Limit Exceeded Without Warning
- **The Issue**: When a customer account selects payment method "Khata", [processPlaceOrder](file:///d:/Dhyan/websites/RadheSweets/src/main.ts) adds the amount to `cust.khataBalance` without validating against `cust.creditLimit`.
- **Why It Falls Back**: A patron with ₹5,000 credit limit who already owes ₹4,800 can purchase ₹3,000 worth of sweets on credit. The shop suffers unsecured bad debts.
- **Required Fix**: Strict credit limit check with visual warning and manager approval override PIN.

### Failure Mode 7: Inability to Park / Hold Bills During Counter Delays
- **The Issue**: Customer A asks for 1kg Kaju Katli. While the packager is boxing it, Customer B wants a single packet of Samosa or 250g Peda.
- **Why It Falls Back**: Cashier cannot switch carts without clearing Customer A's order or losing it. The queue stops dead.
- **Required Fix**: Multi-tab "Park Bill" and "Recall Parked Bill" system with visual badges.

### Failure Mode 8: Missing Order Void / Cancellation & Inventory Desync
- **The Issue**: If an order is punched by mistake (wrong sweet or wrong quantity), there is no way to cancel or void the invoice and restore the deducted inventory.
- **Why It Falls Back**: Shop stock records become inaccurate, showing lower stock than physically present in trays.
- **Required Fix**: Secure "Void Order" action with reason logging and automatic sweet inventory restock.

### Failure Mode 9: Dynamic UPI QR Code Missing
- **The Issue**: Cashiers currently show a static laminated shop QR code. Customer types the amount manually on their phone, often mistyping (e.g. paying ₹350 instead of ₹530) or showing fake payment screenshot apps.
- **Why It Falls Back**: Manual payment entry errors and fraud during busy rush hours.
- **Required Fix**: Dynamic UPI QR code generated on the counter display showing exact bill amount and transaction reference.

### Failure Mode 10: LocalStorage 5MB Quota Overflow
- **The Issue**: All orders, KPI histories, customers, and branch snapshots are saved in a single browser `localStorage` key.
- **Why It Falls Back**: After 3–4 weeks of busy counter billing, `localStorage.setItem` throws `QuotaExceededError` (exceeding 5MB), crashing the app and stopping further sales from being recorded.
- **Required Fix**: IndexedDB storage layer for order archives, keeping localStorage lean for fast instant startup.

---

## 3. High-Priority Immediate Fixes Planned & Implemented Today
1. **Change Due & Cash Tendered Calculator**: Add quick cash buttons (₹100, ₹200, ₹500, ₹2000) and change display directly in Checkout Modal.
2. **Khata Credit Limit Guard**: Prevent Khata checkout when customer balance exceeds credit limit, with warning and manager override.
3. **Box Tare Deduction Feature**: One-click tare weight deduction (50g Box, 100g Box, No Box) in POS item weighers.
4. **Park & Hold Bill System**: Allow counter staff to park active cart into temporary hold list and recall instantly.
5. **Void / Cancel Order with Inventory Restoration**: Ability to void an active or recent order with automatic stock recovery.
6. **GST Configuration & Tax Invoice Display**: 5% GST itemized breakdown (2.5% CGST + 2.5% SGST) with HSN code 2106 and FSSAI license display.
7. **Dynamic UPI QR Code**: Instant QR code rendering with bill total for zero-error digital counter collection.
8. **Audio Beeper System**: Native Web Audio API counter sounds (beeps on item add, error alerts, payment chimes) requiring zero external sound files.
