# Radhe Sweets POS & Shop Management — Master Production Gap Audit (100 Items)

This document tracks all 100 critical items, real-world retail edge cases, legal compliance requirements, and hardware failure modes that must be addressed for Radhe Sweets to operate reliably in an active retail shop counter.

---

## 1. POS Billing & Checkout Fallbacks (Items 1–15)
- [ ] 001. Park Bill / Hold Order: Cashier cannot hold a cart when customer steps away and resume it later. `high` — 2026-10-01
- [ ] 002. Void / Cancel Order with Inventory Restoration: Placed orders cannot be voided or canceled with automatic stock replenishment. `high` — 2026-10-01
- [ ] 003. Order Return & Item Exchange: No workflow for counter item exchanges or customer returns. `high` — 2026-10-01
- [ ] 004. Sequential Contiguous Bill Numbering: Invoice numbers reset or clash based on local array length instead of financial year series (e.g. RS/26-27/0001). `high` — 2026-10-01
- [ ] 005. Split Tender Payments: Cannot split payment (e.g. ₹300 Cash + ₹250 UPI on single invoice). `high` — 2026-10-01
- [ ] 006. Cart Item Rate Override: Cashier with manager PIN cannot apply special discounts or custom per-kg price negotiated for bulk weddings. `medium` — 2026-10-01
- [ ] 007. Box Packaging Charge: Extra charges for decorative festive packaging / tin boxes are missing. `medium` — 2026-10-01
- [ ] 008. Cash Tendered & Change Due Calculator: Cashier is not prompted with "Received ₹1000 -> Give Change ₹240" modal. `high` — 2026-10-01
- [ ] 009. Instant Sound / Audio Feedback: Audio chime/beep for adding sweet, scanning barcode, and successful payment is missing. `medium` — 2026-10-01
- [ ] 010. Duplicate Item Aggregation in POS Cart: Ensure adding the same sweet merges line items and re-sums weights smoothly. `high` — 2026-10-01
- [ ] 011. Fast Clear Cart Confirmation: Single click on clear cart has no undo or confirmation safety guard. `medium` — 2026-10-01
- [ ] 012. Order Notes on Thermal Receipt: Kitchen / packaging notes (e.g. "Pack in 2 separate boxes of 500g") not printed on thermal receipt. `medium` — 2026-10-01
- [ ] 013. Quick Cash Denomination Buttons: Quick-pay buttons (₹100, ₹200, ₹500, ₹2000) for one-touch cash checkout. `medium` — 2026-10-01
- [ ] 014. Zero Total / Free Sample Line Item: Counter billing should support promotional complimentary boxes (100% discount on single line). `low` — 2026-10-01
- [ ] 015. Minimum Order Amount Threshold: Configurable warning if order amount is below minimum for card/UPI processing fees. `low` — 2026-10-01

---

## 2. Weighing Scale & Metrology Math (Items 16–25)
- [ ] 016. Box Tare Weight Deduction: Sweet box weight (empty box ~50g–80g) must be deducted from gross scale weight as mandated by Legal Metrology Act. `high` — 2026-10-01
- [ ] 017. Web Serial / USB Weighing Scale API: Live serial port integration (9600 baud scale protocols) to read weight directly into cart. `high` — 2026-10-01
- [ ] 018. Cash Rounding to Nearest Rupee: Fractional prices (e.g. ₹137.50) must round according to RBI cash rounding rules. `high` — 2026-10-01
- [ ] 019. Gram vs Kilogram Automatic Unit Detection: Typing "250" should auto-detect grams if value is > 20 and unit is kg. `high` — 2026-10-01
- [ ] 020. Piece / Plate Sweet Math: Sweets sold per piece (e.g. Rasgulla, Gulab Jamun, Rajbhog) need dedicated pcs mode. `high` — 2026-10-01
- [ ] 021. Maximum Weight Warning: Alert if entered weight exceeds realistic counter sweet weight (e.g. typing 50 instead of 0.50 kg). `medium` — 2026-10-01
- [ ] 022. Mixed Sweet Box Weight Calculation: Custom assortment boxes (e.g. 250g Kaju Katli + 250g Peda in one 500g box) weighted average pricing. `medium` — 2026-10-01
- [ ] 023. Scale Calibration Lock Indicator: Visual indicator showing whether connected digital scale is stable and zeroed. `low` — 2026-10-01
- [ ] 024. Dynamic Price-by-Weight Label Generation: Generate barcode stickers for pre-weighed trays (EAN-13 price embedded). `low` — 2026-10-01
- [ ] 025. Density / Syrup Tare Factor: Deduction option for heavy sugar syrup in dry packaging. `low` — 2026-10-01

---

## 3. Hardware, Thermal Printing & Peripherals (Items 26–35)
- [ ] 026. WebUSB / WebBluetooth Direct Thermal ESC/POS Printing: Bypass clumsy browser print dialogs directly to 58mm/80mm receipt printers. `high` — 2026-10-01
- [ ] 027. Electronic Cash Drawer Kick Trigger: Send ESC/POS pulse (`\x1b\x70\x00\x19\xfa`) to automatically open cash drawer upon cash checkout. `high` — 2026-10-01
- [ ] 028. Dual Customer Display / Secondary Pole Display: HDMI / USB pole display integration showing line items and subtotal to patron. `medium` — 2026-10-01
- [ ] 029. Barcode Scanner Hardware Keystroke Trapping: Catch hardware USB barcode reader scans regardless of active DOM element focus. `high` — 2026-10-01
- [ ] 030. 80mm vs 58mm Paper Roll Template Switching: Responsive thermal receipts formatted cleanly for both 2-inch and 3-inch roll widths. `high` — 2026-10-01
- [ ] 031. Thermal Printer Offline Buffer Queue: If printer is out of paper or disconnected, buffer print job and notify cashier. `medium` — 2026-10-01
- [ ] 032. Kitchen / Production Token Slip (KOT): Print dedicated kitchen slip for hot snack section (Kachori, Samosa, Fafda). `medium` — 2026-10-01
- [ ] 033. Print Merchant Copy vs Customer Copy: Option to print duplicate summary receipt for accountant drawer records. `low` — 2026-10-01
- [ ] 034. Thermal Print Test Utility: Dedicated "Test Printer Connection & Paper Feed" button in settings. `low` — 2026-10-01
- [ ] 035. Font Encoding Support for Gujarati / Hindi: Unicode Gujarati/Hindi sweet names on ESC/POS thermal printers. `medium` — 2026-10-01

---

## 4. Inventory & Shelf-Life Management (Items 36–45)
- [ ] 036. Perishable Shelf-Life & Expiry Alert: Milk sweets (Mawa/Bengali, 2-day expiry) must flag visual alerts when nearing expiry. `high` — 2026-10-01
- [ ] 037. Production Batch & Kitchen Make-Time: Tag incoming daily trays with kitchen preparation time and batch number. `high` — 2026-10-01
- [ ] 038. Out-of-Stock Checkout Prevention: Toggle setting to prevent counter sale of sweets with 0 kg remaining stock. `high` — 2026-10-01
- [ ] 039. Wastage / Spoilage Write-Off Workflow: Record daily unsold/spoiled sweets with cost deduction from gross profit. `high` — 2026-10-01
- [ ] 040. Raw Material Inventory Auto-Consumption (BOM / Recipe): Selling 1kg Kaju Katli auto-deducts 0.7kg Cashew Nuts and 0.3kg Sugar. `medium` — 2026-10-01
- [ ] 041. Reorder Threshold Push Notification: Low-stock toast and alert sound when counter stock drops below 5kg. `medium` — 2026-10-01
- [ ] 042. Physical Tray Stock Audit & Variance Reconciliation: End-of-shift count vs system theoretical stock discrepancy calculation. `medium` — 2026-10-01
- [ ] 043. Inter-Branch Stock Transfer (Gate Pass): Transfer sweets from Central Workshop/Factory to Naroda/Vastrapur retail branch. `medium` — 2026-10-01
- [ ] 044. Supplier Purchase Order & GRN (Goods Received Note): Record dry fruit and dairy raw material deliveries. `low` — 2026-10-01
- [ ] 045. Batch QR/Barcode Labels: Print sticky labels with Packing Date, Expiry Date, Batch No, and FSSAI license. `medium` — 2026-10-01

---

## 5. Customer Khata, Loyalty & Phone Lookups (Items 46–55)
- [ ] 046. Khata Credit Limit Enforcement: Block or require manager PIN if Khata due exceeds allowed credit limit (e.g. ₹5,000). `high` — 2026-10-01
- [ ] 047. Partial Khata Settlement Workflow: Dedicated counter screen to collect Khata payment (Cash/UPI), deduct balance, and print receipt. `high` — 2026-10-01
- [ ] 048. Khata Ledger Statement Export: Export customer Khata PDF statement with all debit orders and credit repayments. `medium` — 2026-10-01
- [ ] 049. WhatsApp Balance Reminder: 1-click WhatsApp message to Khata patron with payment link and outstanding dues. `high` — 2026-10-01
- [ ] 050. Loyalty Points Redemption at Checkout: Allow patrons to redeem points for cash discount (e.g. 100 pts = ₹50 off). `high` — 2026-10-01
- [ ] 051. Duplicate Phone Number Prevention: Prevent duplicate customer registration with same 10-digit mobile number. `high` — 2026-10-01
- [ ] 052. Patron Birthday / Anniversary Reminders: Automated festive greetings and special sweet discount coupon codes. `low` — 2026-10-01
- [ ] 053. Caller ID Integration: Auto-populate customer profile when caller rings the shop phone line. `low` — 2026-10-01
- [ ] 054. Customer Blacklist / Bad Debt Flagging: Flag delinquent Khata accounts with visual red alert on counter dialer. `medium` — 2026-10-01
- [ ] 055. GSTIN & Corporate B2B Billing Details: Capture Corporate GSTIN and billing address for corporate Diwali orders. `high` — 2026-10-01

---

## 6. Payment Gateways, Split Tender & Dynamic UPI (Items 56–65)
- [ ] 056. Dynamic UPI QR Code Generation: Generate instant on-screen UPI QR code with exact invoice amount (`upi://pay?pa=...&am=...`). `high` — 2026-10-01
- [ ] 057. UPI Payment Confirmation Verification: Prevent cashier from clicking "Paid" without transaction reference or verification. `high` — 2026-10-01
- [ ] 058. Soundbox / Audio Speaker Confirmation: Integration with Paytm / PhonePe Soundbox webhook for voice alert ("₹550 received on UPI"). `medium` — 2026-10-01
- [ ] 059. Card EDC Machine Integration: Plutus / PineLabs POS terminal integration via cloud or USB webhook. `low` — 2026-10-01
- [ ] 060. Digital Wallet Tender: Record Sodexo / Meal Voucher payments common in high-end sweet confectionery stores. `low` — 2026-10-01
- [ ] 061. Pre-Payment / Advance Booking Token: Accept 50% advance for wedding sweet boxes and track pending balance. `high` — 2026-10-01
- [ ] 062. Refund / Chargeback Ledger: Track card/UPI chargebacks and customer refunds with audit logging. `medium` — 2026-10-01
- [ ] 063. Cash Over/Short Daily Variance Tracker: Record if physical cash drawer has surplus or shortage against system totals. `high` — 2026-10-01
- [ ] 064. Delivery Partner Tender (Swiggy / Zomato): Separate aggregator commission deduction and merchant payout tracking. `medium` — 2026-10-01
- [ ] 065. Payment Gateway Fee Reconciliation: Deduct 1.5% MDR on card transactions for accurate net profit KPIs. `low` — 2026-10-01

---

## 7. Taxation, GST & Legal Compliance (Items 66–75)
- [ ] 066. GST Tax Rate Breakup on Invoices: Mandated 5% GST (2.5% CGST + 2.5% SGST) itemized on thermal invoice with HSN code 2106. `high` — 2026-10-01
- [ ] 067. Tax-Inclusive vs Tax-Exclusive Pricing Toggle: Option to calculate whether counter retail rate includes GST or adds at checkout. `high` — 2026-10-01
- [ ] 068. FSSAI License Number Printing on Receipts: Food Safety and Standards Authority license number must print on all customer bills. `high` — 2026-10-01
- [ ] 069. Monthly GSTR-1 JSON / Excel Report: Export all B2C and B2B invoices in official GST portal format for tax filing. `high` — 2026-10-01
- [ ] 070. E-Way Bill Generation for Large B2B Shipments: E-Way bill threshold check for consignments exceeding ₹50,000. `low` — 2026-10-01
- [ ] 071. Tax Exemption on Unbranded Basic Food Items: Distinct tax rates for Milk/Curd (0%) vs Sweets (5%) vs Chocolates (18%). `medium` — 2026-10-01
- [ ] 072. Financial Year Reset Handling: Clean fiscal transition on April 1st without corrupting historic orders. `medium` — 2026-10-01
- [ ] 073. Legal Metrology Compliance Header: "Best Before" date and net weight disclosure required by consumer protection rules. `high` — 2026-10-01
- [ ] 074. Non-Erasable Audit Trail (Govt Mandated): All billing edits and voids must be immutably recorded with timestamp and user ID. `high` — 2026-10-01
- [ ] 075. Shop & Establishment License Display: Display municipal registration details in shop settings and footer. `low` — 2026-10-01

---

## 8. Cash Drawer, Day Closing (Z-Report) & Reconciliation (Items 76–85)
- [ ] 076. Morning Shift Opening Float Cash Entry: Record initial petty cash in drawer (e.g. ₹2,000 for change) before billing starts. `high` — 2026-10-01
- [ ] 077. Cash Drop / Safe Transfer during Shift: Record cash removed from drawer and transferred to master safe during high-volume rush. `high` — 2026-10-01
- [ ] 078. End-of-Day Z-Report Generation: Comprehensive closing report totaling Cash, UPI, Card, Khata, Gross Profit, and Expenses. `high` — 2026-10-01
- [ ] 079. X-Report (Mid-Day Shift Handover): Cashier shift change report without closing the master business day. `medium` — 2026-10-01
- [ ] 080. Petty Cash Counter Expense Logging: Immediate cash deduction from drawer when buying milk, gas cylinder, or packaging tape. `high` — 2026-10-01
- [ ] 081. Cash Drawer Discrepancy Alert: Flag red alert if physical counted cash deviates from expected system cash by > ₹50. `high` — 2026-10-01
- [ ] 082. Thermal Z-Report Printout: Print condensed 80mm closing summary strip for owner sign-off and filing. `high` — 2026-10-01
- [ ] 083. Daily Sales Email / WhatsApp Summary to Owner: Automatically send day summary report to owner's phone at closing. `medium` — 2026-10-01
- [ ] 084. Cash Denomination Counter Tool: Integrated tool to tally count of ₹500, ₹200, ₹100, ₹50, ₹20, ₹10 notes. `medium` — 2026-10-01
- [ ] 085. Previous Days Historic Z-Report Archive: Ability to view and reprint historic Z-reports by date. `medium` — 2026-10-01

---

## 9. Multi-Branch, Roles & Security Controls (Items 86–92)
- [ ] 086. Role-Based Access Control (RBAC): Cashier cannot edit product rates, view master profit margins, or delete bills. `high` — 2026-10-01
- [ ] 087. Manager Override PIN: Prompt for 4-digit supervisor PIN for manual discounts, bill voids, or Khata credit limit override. `high` — 2026-10-01
- [ ] 088. Branch-Isolated Inventory & Orders: Ensure Naroda, Vastrapur, and Maninagar branches do not overwrite each other's live cart. `high` — 2026-10-01
- [ ] 089. Central Consolidated Multi-Branch Owner Dashboard: Aggregate all branches into single master revenue and stock screen. `medium` — 2026-10-01
- [ ] 090. Staff Shift Attendance & Clock-In Biometrics: Timecard logging for counter sales staff and halwais. `low` — 2026-10-01
- [ ] 091. Session Auto-Lock on Inactivity: Screen locks after 5 minutes of counter inactivity to prevent unauthorized billing. `medium` — 2026-10-01
- [ ] 092. Security Audit Log for Critical Actions: Log timestamp and user for rate changes, stock write-offs, and manual discounts. `medium` — 2026-10-01

---

## 10. Offline Resiliency & Data Persistence (Items 93–100)
- [ ] 093. IndexedDB Storage Engine: Migrate from 5MB localStorage limit to unlimited IndexedDB for high-volume order archives. `high` — 2026-10-01
- [ ] 094. Full Offline Mode with Auto Background Cloud Sync: Allow continuous billing when Wi-Fi cuts out, queuing sync until online. `high` — 2026-10-01
- [ ] 095. PWA Service Worker Asset Caching: Full offline app loading via Service Worker (`manifest.json` + `sw.js`). `high` — 2026-10-01
- [ ] 096. Corrupted LocalStorage Recovery: Safe fallback if local state JSON becomes invalid or partially written. `high` — 2026-10-01
- [ ] 097. Automatic Periodic Cloud Backup: Scheduled snapshot export of orders and customers to prevent data loss. `medium` — 2026-10-01
- [ ] 098. Conflict Resolution on Concurrent Orders: Handle multiple counter cashiers placing orders simultaneously in same branch. `medium` — 2026-10-01
- [ ] 099. Offline Storage Quota Warning: Banner warning when local disk storage is nearing browser capacity. `low` — 2026-10-01
- [ ] 100. Database Export & One-Click System Restore: Download full JSON backup and restore entire shop database on new POS tablet. `high` — 2026-10-01
- [x] 101. Fix POS render crash (branches destructuring in PosView.ts) and CustomersView import path `high` — 2026-10-04
- [x] 102. Eliminate 100x refresh loop in Firestore subscribeToBranches and startup branch sync `high` — 2026-10-04
- [x] 103. Strictly hide desktop sidebar and navigation elements on mobile viewports `high` — 2026-10-04

---

## 11. Code Defects, Bugs & Calculation Issues Audit (67 Concrete Issues Found & Fix Roadmap)

- [x] 104. Stock decrement decimal rounding bug: `sweet.stock - cartItem.qty` leaves floating point residues like `49.75000000000001kg` instead of clean rounded decimal. `high` — 2026-10-04
- [x] 105. Void order inventory restore bug: `item.quantity` used when items store `item.qty`, restoring `undefined` or 1kg fallback. `high` — 2026-10-04
- [x] 106. POS quick-weight chips overwrite cart item quantity instead of adding weight to existing line item. `high` — 2026-10-04
- [x] 107. Hardcoded order date `'25 Sep 2026'` instead of real dynamic date in counter order creation. `high` — 2026-10-04
- [x] 108. Multi-branch switch loses in-memory orders snapshot when switching branches. `high` — 2026-10-04
- [x] 109. Staff salary expense logging misses `branchId` and `branchName`, causing ledger leakage across branches. `high` — 2026-10-04
- [x] 110. Phone lookup matching uses loose substring (`cDigits.includes(cleanPhoneDigits)`), falsely matching 98250 to 9825012345. `high` — 2026-10-04
- [x] 111. Fallback shop address hardcoded to `'Ahmedabad, Gujarat'` instead of actual store branch Gandhinagar. `medium` — 2026-10-04
- [x] 112. Parked bills token index collision using `parkedBills.length` instead of monotonically incrementing ID. `high` — 2026-10-04
- [x] 113. Offline UPI QR code fails because `api.qrserver.com` requires active internet connection; must use local SVG generator. `high` — 2026-10-04
- [x] 114. Piece-based sweets (`unit: 'pcs'`) display gram buttons (250g, 500g, 1kg) in POS, resulting in fractional piece quantities. `high` — 2026-10-04
- [x] 115. Quick cash chips array `[100, 200, 500, 1000, 2000]` returns empty `[]` when `totalPayable > 2000`. `medium` — 2026-10-04
- [x] 116. LocalStorage quota overflow throws unhandled `QuotaExceededError` during `saveState`, crashing the app. `high` — 2026-10-04
- [x] 117. Voiding a Khata payment order fails to reduce customer's `khataDue` outstanding balance. `high` — 2026-10-04
- [x] 118. Thermal printout in dark mode prints white/faded text because styles use theme variables instead of solid `#000000`. `high` — 2026-10-04
- [x] 119. Customer deletion doesn't clear `GLOBAL_CUSTOMERS_KEY`, reviving deleted customers on page refresh. `high` — 2026-10-04
- [x] 120. Deleting an expense doesn't update `state.expenses.breakdown` percentages or recalculate `state.kpis.cost`. `medium` — 2026-10-04
- [x] 121. Staff salary disbursement does not update `state.expenses.breakdown` or recalculate `state.kpis.cost`. `medium` — 2026-10-04
- [x] 122. Stock adjust modal sets status to `'Low Stock'` when stock is 0 instead of `'Out of Stock'`. `medium` — 2026-10-04
- [x] 123. Analytics view hardcodes month 8 (September 2026), filtering out all expenses and orders in other months. `high` — 2026-10-04
- [x] 124. Profit modal injects hardcoded fake baseline orders from Sep 2026 into real shop profit calculations. `high` — 2026-10-04
- [x] 125. Stock adjust modal doesn't round decimal weights when adding or subtracting fractional inventory. `medium` — 2026-10-04
- [x] 126. Held cart modal doesn't filter by branch ID, displaying held carts from other branch locations. `high` — 2026-10-04
- [ ] 127. Search modal sweet search doesn't handle special characters or accented strings gracefully. `medium` — 2026-10-04
- [ ] 128. POS cart item removal doesn't reset active card counter action button in sweet card grid. `medium` — 2026-10-04
- [x] 129. Discount percentage input allows values `< 0` or `> 100`, resulting in negative bill totals or negative profit. `high` — 2026-10-04
- [ ] 130. Cart subtotal floating point precision issue in tax calculation: `Math.round((totalPayable * 0.05) / 1.05)` can mismatch item sums. `medium` — 2026-10-04
- [ ] 131. Mobile cart sticky bar total does not update dynamically when cart items are incremented/decremented inside the drawer. `medium` — 2026-10-04
- [ ] 132. Quick cash tender input does not update change due display in real-time when user types manually. `medium` — 2026-10-04
- [ ] 133. Slide to checkout handle gets stuck if touch drag is released outside the container window. `medium` — 2026-10-04
- [ ] 134. Advance order modal accepts delivery date in the past without validation error. `medium` — 2026-10-04
- [ ] 135. Customer dialer modal doesn't strip spaces, dashes or `+91` prefix when checking for duplicate phone numbers. `medium` — 2026-10-04
- [ ] 136. Branch delete modal allows deleting the currently active branch without switching to another branch first. `high` — 2026-10-04
- [ ] 137. Product catalog CSV export breaks if sweet description contains commas or quotes without CSV escaping. `medium` — 2026-10-04
- [ ] 138. Inventory valuation uses hardcoded `0.6` multiplier when `costPrice` is 0 instead of flagging missing cost. `low` — 2026-10-04
- [ ] 139. Low stock banner counter includes discontinued/inactive sweets. `low` — 2026-10-04
- [ ] 140. Staff view daily wage attendance calculation multiplies negative attendance if days are set below 0. `medium` — 2026-10-04
- [ ] 141. Order details modal does not show payment method for UPI transactions (displays blank instead of UTR). `low` — 2026-10-04
- [ ] 142. Thermal receipt modal QR toggle button disappears or fails to re-render QR code SVG after closing and reopening. `medium` — 2026-10-04
- [ ] 143. Toast notification container overlaps with mobile sticky bottom navigation bar. `medium` — 2026-10-04
- [ ] 144. Sweet category filter "Bengali & Chhena" fails to match items categorized as "Bengali Sweets". `medium` — 2026-10-04
- [ ] 145. Cashier role can access owner financial analytics by manually setting URL hash or inspecting elements. `high` — 2026-10-04
- [ ] 146. Order reprint button in Orders table view doesn't load branch specific thermal header data. `medium` — 2026-10-04
- [ ] 147. Customer total orders count increments even when order fails or is parked. `medium` — 2026-10-04
- [ ] 148. Expense category dropdown does not sanitize custom category input, leading to broken breakdown chart colors. `low` — 2026-10-04
- [ ] 149. Mobile drawer overlay does not lock background body scrolling on iOS Safari. `medium` — 2026-10-04
- [ ] 150. Parked bill restore does not validate if sweet items still exist in active branch inventory. `medium` — 2026-10-04
- [ ] 151. Khata settlement payment does not record an offsetting entry in expenses or ledger. `high` — 2026-10-04
- [ ] 152. Customer profile modal lifetime spend metric fails to parse string totals like `"₹1,500"`. `medium` — 2026-10-04
- [ ] 153. POS search bar autofocus triggers virtual keyboard layout jump on mobile devices. `low` — 2026-10-04
- [ ] 154. Stock audit log doesn't record branch ID, mixing audit trails across multi-store locations. `medium` — 2026-10-04
- [ ] 155. Order search input in Orders view crashes if user types regular expression special characters like `[` or `(`. `medium` — 2026-10-04
- [ ] 156. WhatsApp invoice link generation fails when customer phone has fewer than 10 digits or invalid country code. `medium` — 2026-10-04
- [ ] 157. Dashboard revenue card percentage change calculation divides by zero when previous period sales are 0. `medium` — 2026-10-04
- [ ] 158. Multi-branch switcher dropdown in top bar closes unexpectedly when clicking the search sub-input. `medium` — 2026-10-04
- [ ] 159. Adding a new sweet with duplicate name or code overwrites existing item without warning. `medium` — 2026-10-04
- [ ] 160. Quick weight buttons in desktop cart do not recalculate line item total when clicked. `high` — 2026-10-04
- [ ] 161. Customer edit form does not validate email format or phone number digit length. `medium` — 2026-10-04
- [ ] 162. Expense date picker defaults to empty instead of today's date in add expense modal. `low` — 2026-10-04
- [ ] 163. Profit modal margin percentage shows `NaN%` when total sales are ₹0. `medium` — 2026-10-04
- [ ] 164. Thermal receipt paper size selector (58mm vs 80mm) does not persist cashier preference in localStorage. `low` — 2026-10-04
- [ ] 165. SwipeRow swipe-to-delete action triggers accidental deletion if dragged too quickly without confirmation. `high` — 2026-10-04
- [ ] 166. Kitchen packing order status update does not notify or reflect in live orders count badge. `medium` — 2026-10-04
- [ ] 167. Raw materials inward cost is not deducted from daily net cash drawer balance. `medium` — 2026-10-04
- [ ] 168. Offline queue retry mechanism loops indefinitely on malformed payload without exponential backoff. `high` — 2026-10-04
- [ ] 169. Settings view shop name update does not sync to active branch name in Firestore. `medium` — 2026-10-04
- [ ] 170. Restock batch modal accepts negative quantity inputs, corrupting inventory stock count. `medium` — 2026-10-04

