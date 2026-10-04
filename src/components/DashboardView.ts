// Dashboard View Component
// 1. Owner Mode: Consolidated Multi-Branch Enterprise Command Center
//    - Combined orders across all outlets
//    - Combined customers across all outlets
//    - Combined sales, profit & cost metrics
//    - Outlets Performance Arena (Side-by-side branch comparison cards)
//    - Cross-Branch Product Stock Monitor Matrix ("which branch has how much left")
//    - Combined Live Orders Stream across all outlets
// 2. Branch Manager / Cashier Mode: Strictly Branch-Level Isolated Dashboard
//    - Only current branch metrics, stock, orders, and counter quick billing

import { renderCounter } from './Counter.ts';
import { getBranchDefaultCatalog } from '../firebase.js';
import { initialData } from '../data.js';

export function renderDashboardView(state: any) {
  const currentUser = state.currentUser || { role: 'owner', name: 'Owner' };
  const isOwner = currentUser.role === 'owner';
  const timeFilter = state.timeFilter || 'month';
  const branches = state.branches || initialData.branches || [];

  // Active branch details
  const currentBranchId = state.currentBranchId || 'br-1';
  const activeBranchObj = branches.find((b: any) => b.id === currentBranchId) || branches[0] || { name: 'Active Outlet', code: 'BR-01' };

  // =========================================================================
  // MULTI-BRANCH DATA AGGREGATION SYSTEM (For Owner Combined Dashboard)
  // =========================================================================
  const branchDataMap: Record<string, {
    branch: any;
    sweets: any[];
    orders: any[];
    customers: any[];
    kpis: any;
    revenue: number;
    ordersCount: number;
  }> = {};

  branches.forEach((b: any) => {
    if (b.id === currentBranchId) {
      const bOrders = state.orders || [];
      const bRev = bOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0) || b.revenue || 0;
      branchDataMap[b.id] = {
        branch: b,
        sweets: state.sweets || [],
        orders: bOrders,
        customers: state.customers || [],
        kpis: state.kpis || {},
        revenue: bRev,
        ordersCount: bOrders.length || b.orders || 0
      };
    } else {
      let snap: any = null;
      try {
        const raw = localStorage.getItem(`radhe_branch_${b.id}_snapshot_v2`);
        if (raw) snap = JSON.parse(raw);
      } catch (_) {}

      if (snap) {
        const snapOrders = snap.orders || [];
        const snapRev = snapOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0) || b.revenue || 0;
        branchDataMap[b.id] = {
          branch: b,
          sweets: snap.sweets || [],
          orders: snapOrders,
          customers: snap.customers || [],
          kpis: snap.kpis || {},
          revenue: snapRev,
          ordersCount: snapOrders.length || b.orders || 0
        };
      } else {
        const defaults = getBranchDefaultCatalog(b.id);
        branchDataMap[b.id] = {
          branch: b,
          sweets: defaults.sweets || [],
          orders: [],
          customers: [],
          kpis: defaults.kpis || {},
          revenue: b.revenue || 0,
          ordersCount: b.orders || 0
        };
      }
    }
  });

  // User-selected Dashboard view: 'all' for overall combined vs branch ID for branch-wise view
  const dashboardBranchFilter = state.dashboardBranchFilter || (isOwner ? 'all' : currentBranchId);
  const isOverall = dashboardBranchFilter === 'all';
  const displayBranchObj = branches.find((b: any) => b.id === dashboardBranchFilter) || activeBranchObj;

  // Calculate Consolidated Metrics for Owner vs Branch-Level for Branch Manager
  let ordersList: any[] = [];
  let sweetsList: any[] = [];
  let customersCount = 0;
  let salesVal = 0;
  let costVal = 0;
  let profitVal = 0;
  let ordersVal = 0;

  if (isOverall) {
    // 1. Combined Orders with branch attribution tags across all 11 outlets
    ordersList = [];
    branches.forEach((b: any) => {
      const bData = branchDataMap[b.id];
      if (bData && bData.orders) {
        bData.orders.forEach((o: any) => {
          ordersList.push({
            ...o,
            branchId: b.id,
            branchName: b.name,
            branchCode: b.code || b.id
          });
        });
      }
    });

    // Sort combined orders by creation time or date desc
    ordersList.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });

    // 2. Combined Sales across all 11 branches
    salesVal = branches.reduce((sum: number, b: any) => sum + (branchDataMap[b.id]?.revenue || 0), 0);
    if (salesVal === 0) salesVal = 48500;

    // 3. Combined Cost & Profit
    costVal = Math.round(salesVal * 0.62);
    profitVal = Math.max(0, salesVal - costVal);

    // 4. Combined Orders Count
    ordersVal = branches.reduce((sum: number, b: any) => sum + (branchDataMap[b.id]?.ordersCount || 0), 0);
    if (ordersVal === 0) ordersVal = 132;

    // 5. Combined Customers (Unique patrons enterprise-wide)
    const customerPhoneSet = new Set<string>();
    branches.forEach((b: any) => {
      const custs = branchDataMap[b.id]?.customers || [];
      custs.forEach((c: any) => {
        if (c.phone) customerPhoneSet.add(c.phone);
        else if (c.id) customerPhoneSet.add(c.id);
      });
    });
    customersCount = Math.max(customerPhoneSet.size, (state.customers?.length || 0), 110);
    sweetsList = state.sweets || [];
  } else {
    // Branch Wise View for specific branch
    const bData = branchDataMap[dashboardBranchFilter] || {
      orders: [],
      sweets: state.sweets || [],
      revenue: displayBranchObj.revenue || 0,
      ordersCount: displayBranchObj.orders || 0
    };
    ordersList = bData.orders || [];
    sweetsList = bData.sweets || state.sweets || [];
    salesVal = bData.revenue || displayBranchObj.revenue || 0;
    costVal = Math.round(salesVal * 0.62);
    profitVal = Math.max(0, salesVal - costVal);
    ordersVal = bData.ordersCount || ordersList.length || displayBranchObj.orders || 0;
    customersCount = (state.customers || []).filter((c: any) => c.branchId === dashboardBranchFilter).length || 10;
  }

  // Timeframe multiplier
  let periodMultiplier = 1;
  let periodLabel = 'This Month';
  if (timeFilter === 'today') {
    periodLabel = 'Today';
    periodMultiplier = 0.15;
  } else if (timeFilter === 'week') {
    periodLabel = 'This Week';
    periodMultiplier = 0.35;
  } else if (timeFilter === 'quarter') {
    periodLabel = 'Quarterly';
    periodMultiplier = 2.8;
  }

  const displaySales = Math.round(salesVal * (timeFilter === 'month' ? 1 : periodMultiplier));
  const displayCost = Math.round(costVal * (timeFilter === 'month' ? 1 : periodMultiplier));
  const displayProfit = Math.max(0, displaySales - displayCost);
  const displayOrders = Math.round(ordersVal * (timeFilter === 'month' ? 1 : periodMultiplier));
  const displayCustomers = Math.round(customersCount * (timeFilter === 'month' ? 1 : periodMultiplier));
  const displayReturning = Math.round(displayCustomers * 0.42);

  const profitMarginStr = displaySales > 0 ? `${((displayProfit / displaySales) * 100).toFixed(1)}% margin` : '0.0% margin';
  const costPercentStr = displaySales > 0 ? `${((displayCost / displaySales) * 100).toFixed(1)}%` : '0.0%';

  // Donut chart status calculations
  const totalOrders = displayOrders || 1;
  const completedOrders = Math.round(totalOrders * 0.88);
  const advanceOrders = Math.round(totalOrders * 0.08);
  const kitchenOrders = Math.max(0, totalOrders - completedOrders - advanceOrders);

  const completedPct = Math.round((completedOrders / totalOrders) * 100);
  const advancePct = Math.round((advanceOrders / totalOrders) * 100);
  const kitchenPct = Math.round((kitchenOrders / totalOrders) * 100);

  // Quick Cart for POS card
  const quickItems = state.quickCart || [];
  const quickSubtotal = quickItems.reduce((sum: number, it: any) => sum + (it.total || Math.round(it.qty * (it.rate || it.price || 0))), 0);

  // Master catalog of all 100 sweets for Cross-Branch Stock Matrix
  const masterCatalog = initialData.sweets || [];
  const matrixSearchQuery = (state.crossBranchSearchQuery || '').toLowerCase().trim();
  const matrixCategoryFilter = state.crossBranchFilterCategory || 'All';

  const filteredMatrixSweets = masterCatalog.filter((s: any) => {
    const matchesSearch = !matrixSearchQuery || 
      s.name.toLowerCase().includes(matrixSearchQuery) || 
      (s.category && s.category.toLowerCase().includes(matrixSearchQuery));

    let matchesCategory = true;
    if (matrixCategoryFilter === 'Low Stock Alert (<15kg)') {
      // Show if any branch has <= 15 kg
      matchesCategory = branches.some((b: any) => {
        const sw = (branchDataMap[b.id]?.sweets || []).find((bs: any) => bs.id === s.id || bs.name === s.name);
        return sw && sw.stock <= 15;
      });
    } else if (matrixCategoryFilter === 'Pure Desi Ghee') {
      matchesCategory = s.isPureGhee || (s.badge && s.badge.toLowerCase().includes('ghee'));
    } else if (matrixCategoryFilter !== 'All') {
      matchesCategory = s.category === matrixCategoryFilter;
    }
    return matchesSearch && matchesCategory;
  });

  return `
    <div class="space-y-6 animate-fadeIn select-none" data-purpose="radhe-dashboard">
      
      <!-- Greeting & Top Context Bar -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-3xl border border-[#DCCFB7] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)]" data-purpose="greeting-header">
        <div>
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="w-8 h-8 rounded-xl ${isOwner ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'} flex items-center justify-center font-black text-sm">
              ${isOwner ? (isOverall ? '👑' : '🏬') : '🏢'}
            </span>
            <h1 class="text-2xl sm:text-3xl font-black text-[#2A1F1D] tracking-tight">
              ${isOwner 
                ? (isOverall ? 'Multi-Branch Enterprise Dashboard' : `${displayBranchObj.name} Dashboard`) 
                : `${activeBranchObj.name} Dashboard`
              }
            </h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
              isOwner 
                ? (isOverall ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300')
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }">
              ${isOwner 
                ? (isOverall ? `Consolidated Enterprise (${branches.length} Gandhinagar Outlets)` : `Branch View • ${displayBranchObj.code || 'Gandhinagar Outlet'}`)
                : `Active Outlet • ${activeBranchObj.code || 'Branch'}`
              }
            </span>
          </div>
          <p class="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
            ${isOwner 
              ? (isOverall 
                  ? `Combined live orders, patron directory, and cross-branch inventory levels across all 11 Gandhinagar locations (Sector 21, Kudasan, Infocity, Sargasan, GIFT City & more).`
                  : `Individual counter operations, orders fulfillment, and inventory levels for ${displayBranchObj.name} (${displayBranchObj.address || 'Gandhinagar'}).`
                )
              : `Real-time counter billing, stock deduction, and orders fulfillment for ${activeBranchObj.name}.`
            }
          </p>
        </div>

        <!-- Controls: Branch View Selector, Timeframe Filter & Quick Branch Switch -->
        <div class="flex items-center gap-2.5 flex-wrap">
          ${isOwner ? `
            <div class="flex items-center gap-1.5">
              <div class="relative">
                <select id="dashboard-branch-select" class="appearance-none bg-amber-50/90 border border-amber-300 text-xs font-black text-amber-950 py-2 pl-3 pr-8 rounded-xl shadow-xs hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer transition-colors">
                  <option value="all" ${isOverall ? 'selected' : ''}>🌐 Overall (All 11 Branches Combined)</option>
                  <optgroup label="Gandhinagar Branches">
                    ${branches.map((b: any) => `
                      <option value="${b.id}" ${dashboardBranchFilter === b.id ? 'selected' : ''}>🏢 ${b.name} (${b.city || 'Gandhinagar'})</option>
                    `).join('')}
                  </optgroup>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                </div>
              </div>

              ${!isOverall ? `
                <button 
                  type="button" 
                  data-dashboard-branch="all" 
                  class="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-black text-xs flex items-center gap-1 border border-stone-300 shadow-2xs transition-all active:scale-95 cursor-pointer"
                  title="Switch back to enterprise-wide consolidated view"
                >
                  <span>← Overall</span>
                </button>
              ` : ''}
            </div>
          ` : `
            <span class="px-3 py-1.5 bg-stone-100 rounded-xl text-stone-700 font-bold text-xs border border-stone-200">
              📍 ${activeBranchObj.city || 'Gandhinagar'}
            </span>
          `}

          <!-- Time Filter Dropdown -->
          <div class="relative">
            <select id="dashboard-time-filter" class="appearance-none bg-white border border-[#DCCFB7] text-xs sm:text-sm font-bold text-stone-700 py-2 pl-3.5 pr-8 rounded-xl shadow-xs hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer transition-colors">
              <option value="month" ${timeFilter === 'month' ? 'selected' : ''}>This Month</option>
              <option value="today" ${timeFilter === 'today' ? 'selected' : ''}>Today</option>
              <option value="week" ${timeFilter === 'week' ? 'selected' : ''}>This Week</option>
              <option value="quarter" ${timeFilter === 'quarter' ? 'selected' : ''}>Quarterly</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-400">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
              </svg>
            </div>
          </div>

          <!-- Quick Header Logout Button -->
          <button 
            type="button" 
            id="dashboard-logout-btn" 
            data-action="app-logout" 
            class="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer"
            title="Sign Out of Radhe Sweets"
          >
            <svg class="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- 6 CONSOLIDATED / BRANCH KPI CARDS GRID                   -->
      <!-- ======================================================== -->
      <section id="kpi-tiles-container" class="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5" data-purpose="kpi-metrics-grid">
        
        <!-- CARD 1: Customers -->
        <article class="kpi-card animate-card-pop stagger-1 interactive-scale bg-gradient-to-br from-[#FFF9F5] via-[#FFF3EB] to-[#FCEAE0] border border-[#F6E7DC] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" data-tab="customers">
          <div class="kpi-top-row flex items-center justify-between">
            <span class="kpi-icon-badge w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FCEEE3] text-[#C86D3B] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
              </svg>
            </span>
            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isOwner ? 'bg-amber-200/80 text-amber-950' : 'bg-stone-200/80 text-stone-800'}">
              ${isOwner ? 'All Outlets' : 'Branch'}
            </span>
          </div>

          <div class="kpi-middle-row mt-2.5 sm:mt-4 z-10">
            <p class="kpi-stat-label text-xs sm:text-sm font-semibold text-[#5A4E4D]">
              ${isOwner ? 'Combined Patrons' : 'Branch Customers'}
            </p>
            <div class="kpi-stat-value text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">
              ${renderCounter({
                value: displayCustomers,
                fontWeight: 800,
                gradientHeight: 6,
                gradientFrom: 'rgba(255, 249, 245, 0.75)'
              })}
            </div>
          </div>

          <div class="kpi-trend-row mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="kpi-trend-badge flex items-center text-emerald-600 font-bold text-[10px] sm:text-xs z-10">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 17l10-10M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              <span>+14.2%</span>
            </div>
            <div class="text-[10px] text-stone-400 font-medium z-10">Active Loyalty Members</div>
          </div>
        </article>

        <!-- CARD 2: Sales (Royal Confectionery Golden Amber Temple Theme) -->
        <article class="kpi-card animate-card-pop stagger-2 interactive-scale bg-gradient-to-br from-[#FFFBF5] via-[#FFF3E6] to-[#FDE8D4] border border-[#FCD2B0] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" data-tab="pos">
          <div class="kpi-top-row flex items-center justify-between">
            <span class="kpi-icon-badge w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FFF0DF] text-[#C86D3B] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C9.5 2 7.8 3.5 7.4 5.5L4 7.2v1.5l1.6.8C5.2 11.2 5 13 5 15c0 4.4 3.1 7 7 7s7-2.6 7-7c0-2-.2-3.8-.6-5.5l1.6-.8V7.2l-3.4-1.7C16.2 3.5 14.5 2 12 2zm0 6c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm0 8c1.7 0 3 .9 3 2H9c0-1.1 1.3-2 3-2z"></path>
              </svg>
            </span>
            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isOwner ? 'bg-amber-200/80 text-amber-950' : 'bg-orange-100 text-orange-900 border border-orange-200'}">
              ${isOwner ? 'Combined Revenue' : 'Outlet Sales'}
            </span>
          </div>

          <div class="kpi-middle-row mt-2.5 sm:mt-4 z-10">
            <p class="kpi-stat-label text-xs sm:text-sm font-semibold text-[#5A4E4D]">
              ${isOwner ? 'Consolidated Sales' : 'Branch Sales'}
            </p>
            <div class="kpi-stat-value text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">
              ${renderCounter({
                value: displaySales,
                prefix: '₹',
                fontWeight: 800,
                gradientHeight: 6,
                gradientFrom: 'rgba(255, 248, 240, 0.75)'
              })}
            </div>
          </div>

          <div class="kpi-trend-row mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="kpi-trend-badge flex items-center text-[#C86D3B] font-bold text-[10px] sm:text-xs z-10">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M7 17l10-10M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              <span>+9.6%</span>
            </div>
            <div class="text-[10px] text-stone-400 font-medium z-10">${periodLabel}</div>
          </div>
        </article>

        <!-- CARD 3: Orders -->
        <article class="kpi-card animate-card-pop stagger-3 interactive-scale bg-gradient-to-br from-[#F8F5FD] via-[#EFEBF9] to-[#E8E0F7] border border-[#E9E2F5] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" data-tab="orders">
          <div class="kpi-top-row flex items-center justify-between">
            <span class="kpi-icon-badge w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F3EEFC] text-[#7C3AED] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isOwner ? 'bg-purple-200/80 text-purple-950' : 'bg-stone-200/80 text-stone-800'}">
              ${isOwner ? 'All Branches' : 'Counter'}
            </span>
          </div>

          <div class="kpi-middle-row mt-2.5 sm:mt-4 z-10">
            <p class="kpi-stat-label text-xs sm:text-sm font-semibold text-[#5A4E4D]">
              ${isOwner ? 'Combined Orders' : 'Branch Orders'}
            </p>
            <div class="kpi-stat-value text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">
              ${renderCounter({
                value: displayOrders,
                fontWeight: 800,
                gradientHeight: 6,
                gradientFrom: 'rgba(248, 245, 253, 0.75)'
              })}
            </div>
          </div>

          <div class="kpi-trend-row mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="kpi-trend-badge flex items-center text-purple-600 font-bold text-[10px] sm:text-xs z-10">
              <span>${ordersList.length} live bills</span>
            </div>
            <div class="text-[10px] text-stone-400 font-medium z-10">Counter &amp; Advance</div>
          </div>
        </article>

        <!-- CARD 4: Profit -->
        <article id="kpi-profit-card" class="kpi-card animate-card-pop stagger-4 interactive-scale bg-gradient-to-br from-[#F1FAF5] via-[#E4F5EB] to-[#D5EFE0] border border-[#CEE9DC] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" title="Click to view full profit intelligence & breakdown">
          <div class="kpi-top-row flex items-center justify-between">
            <span class="kpi-icon-badge w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#E5F7ED] text-[#0D9488] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-200/80 text-teal-950">
              Net Profit
            </span>
          </div>

          <div class="kpi-middle-row mt-2.5 sm:mt-4 z-10">
            <p class="kpi-stat-label text-xs sm:text-sm font-semibold text-[#5A4E4D]">
              ${isOwner ? 'Consolidated Profit' : 'Branch Profit'}
            </p>
            <div class="kpi-stat-value text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">
              ${renderCounter({
                value: displayProfit,
                prefix: '₹',
                fontWeight: 800,
                gradientHeight: 6,
                gradientFrom: 'rgba(241, 250, 245, 0.75)'
              })}
            </div>
          </div>

          <div class="kpi-trend-row mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="kpi-trend-badge text-[#0D9488] font-bold text-[10px] sm:text-xs z-10 flex items-center gap-1">
              <span>${profitMarginStr}</span>
            </div>
            <div class="text-[10px] text-teal-700 font-extrabold z-10">⚡ High Margin</div>
          </div>
        </article>

        <!-- CARD 5: Cost -->
        <article class="kpi-card animate-card-pop stagger-5 interactive-scale bg-gradient-to-br from-[#FDF5F4] via-[#FCECEB] to-[#FADEDB] border border-[#F7DDDC] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" data-tab="expenses">
          <div class="kpi-top-row flex items-center justify-between">
            <span class="kpi-icon-badge w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FEECEB] text-[#E11D48] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>
              </svg>
            </span>
            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-950">
              Raw Materials &amp; Dairy
            </span>
          </div>

          <div class="kpi-middle-row mt-2.5 sm:mt-4 z-10">
            <p class="kpi-stat-label text-xs sm:text-sm font-semibold text-[#5A4E4D]">
              ${isOwner ? 'Combined Expenses' : 'Branch Inward Cost'}
            </p>
            <div class="kpi-stat-value text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">
              ${renderCounter({
                value: displayCost,
                prefix: '₹',
                fontWeight: 800,
                gradientHeight: 6,
                gradientFrom: 'rgba(253, 245, 244, 0.75)'
              })}
            </div>
          </div>

          <div class="kpi-trend-row mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="kpi-trend-badge text-rose-500 font-bold text-[10px] sm:text-xs z-10">
              <span>${costPercentStr} of revenue</span>
            </div>
            <div class="text-[10px] text-stone-400 font-medium z-10">Ghee, Cashews, Milk</div>
          </div>
        </article>

        <!-- CARD 6: Returning Patrons -->
        <article class="kpi-card animate-card-pop stagger-6 interactive-scale bg-gradient-to-br from-[#F2F7FD] via-[#ECF3FC] to-[#E0EDFA] border border-[#DBE7F6] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-[0_2px_10px_rgba(74,58,47,0.04)] hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer" data-tab="customers">
          <div class="kpi-top-row flex items-center justify-between">
            <span class="kpi-icon-badge w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#EAF4FD] text-[#0284C7] flex items-center justify-center shadow-2xs">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-200/80 text-sky-950">
              Returning
            </span>
          </div>

          <div class="kpi-middle-row mt-2.5 sm:mt-4 z-10">
            <p class="kpi-stat-label text-xs sm:text-sm font-semibold text-[#5A4E4D]">
              ${isOwner ? 'Combined Returning' : 'Repeat Customers'}
            </p>
            <div class="kpi-stat-value text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1615] tracking-tight mt-0.5 sm:mt-1">
              ${renderCounter({
                value: displayReturning,
                suffix: ' patrons',
                fontWeight: 800,
                gradientHeight: 6,
                gradientFrom: 'rgba(242, 247, 253, 0.75)'
              })}
            </div>
          </div>

          <div class="kpi-trend-row mt-2.5 sm:mt-4 flex items-end justify-between relative">
            <div class="kpi-trend-badge flex items-center text-sky-600 font-bold text-[10px] sm:text-xs z-10">
              <span>42.0% Repeat Rate</span>
            </div>
            <div class="text-[10px] text-stone-400 font-medium z-10">Gandhinagar Patrons</div>
          </div>
        </article>

      </section>

      <!-- ======================================================== -->
      <!-- OWNER EXCLUSIVE: OUTLETS PERFORMANCE ARENA               -->
      <!-- ======================================================== -->
      ${isOwner ? `
        <section class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCCFB7] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-4" data-purpose="outlets-arena">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EFE9] pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-base sm:text-lg font-black text-[#2A1F1D]">🏢 Outlets Performance Arena</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                  Side-By-Side Comparison (11 Branches)
                </span>
              </div>
              <p class="text-xs text-stone-500">Live operational status, orders volume, and revenue across every Gandhinagar store outlet</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-xs font-bold text-stone-500">
                Total Outlets: <span class="text-[#C86D3B] font-black">${branches.length}</span>
              </div>
              <button 
                type="button" 
                data-action="open-add-branch" 
                id="dashboard-add-branch-btn" 
                class="px-3 py-1.5 bg-[#C86D3B] hover:bg-[#b05a2b] text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                title="Add a new store branch"
              >
                <span>+ Add Branch</span>
              </button>
            </div>
          </div>

          <!-- Branch Comparison Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            ${branches.map((b: any, bIdx: number) => {
              const bData = branchDataMap[b.id] || { revenue: b.revenue || 0, ordersCount: b.orders || 0, sweets: [] };
              const bRev = bData.revenue;
              const bOrders = bData.ordersCount;
              const lowStockCount = (bData.sweets || []).filter((s: any) => s.stock <= 15).length;
              const isCurrentActive = b.id === currentBranchId;

              const colors = [
                { bg: 'from-amber-500/10 to-orange-500/5', border: 'border-amber-200', tag: 'bg-amber-100 text-amber-950', badge: 'Flagship' },
                { bg: 'from-blue-500/10 to-indigo-500/5', border: 'border-blue-200', tag: 'bg-blue-100 text-blue-950', badge: 'Outlet' },
                { bg: 'from-emerald-500/10 to-teal-500/5', border: 'border-emerald-200', tag: 'bg-emerald-100 text-emerald-950', badge: 'Hub' },
                { bg: 'from-purple-500/10 to-pink-500/5', border: 'border-purple-200', tag: 'bg-purple-100 text-purple-950', badge: 'Express' }
              ];
              const theme = colors[bIdx % colors.length];

              return `
                <div class="p-4 rounded-2xl bg-gradient-to-br ${theme.bg} border ${theme.border} shadow-2xs space-y-3 relative group">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${theme.tag}">
                      ${b.code || `BRANCH-0${bIdx + 1}`}
                    </span>
                    ${isCurrentActive ? `
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                        Active Terminal 🟢
                      </span>
                    ` : ''}
                  </div>

                  <div>
                    <div class="flex items-center justify-between gap-1">
                      <h3 class="font-extrabold text-sm text-[#2A1F1D] truncate" title="${b.name}">${b.name}</h3>
                      ${b.mapUrl ? `
                        <a href="${b.mapUrl}" target="_blank" rel="noopener noreferrer" class="text-[10px] font-black text-blue-600 hover:text-blue-800 hover:underline shrink-0 flex items-center gap-0.5" title="Open Google Maps">
                          <span>Map 📍</span>
                        </a>
                      ` : ''}
                    </div>
                    <p class="text-[11px] text-stone-500 truncate" title="${b.address || b.city || 'Gandhinagar'}">${b.address || b.city || 'Gandhinagar'}</p>
                    ${b.phone ? `<p class="text-[10px] font-mono font-semibold text-stone-400 mt-0.5 truncate">📞 ${b.phone}</p>` : ''}
                  </div>

                  <div class="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200/60 text-xs">
                    <div>
                      <span class="text-[10px] text-stone-400 font-bold uppercase block">Revenue</span>
                      <span class="font-black text-stone-900 text-sm">₹${bRev.toLocaleString()}</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-stone-400 font-bold uppercase block">Live Orders</span>
                      <span class="font-black text-stone-900 text-sm">${bOrders}</span>
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-[11px] font-semibold text-stone-600 pt-1">
                    <span class="${lowStockCount > 0 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}">
                      ${lowStockCount > 0 ? `⚠️ ${lowStockCount} Low` : '✅ In Stock'}
                    </span>
                    <div class="flex items-center gap-1.5">
                      <button 
                        type="button"
                        data-dashboard-branch="${b.id}"
                        class="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-bold text-[11px] shadow-2xs transition-all active:scale-95 cursor-pointer"
                        title="View Dashboard metrics for this branch"
                      >
                        Metrics 📊
                      </button>
                      <button 
                        type="button"
                        data-switch-branch="${b.id}"
                        class="px-2.5 py-1 ${isCurrentActive ? 'bg-emerald-600 text-white font-extrabold' : 'bg-white hover:bg-stone-50 text-[#C86D3B] font-bold'} border border-stone-200 rounded-lg text-[11px] shadow-2xs transition-all active:scale-95 cursor-pointer"
                        title="${isCurrentActive ? 'Active POS terminal' : 'Switch active POS to this branch'}"
                      >
                        ${isCurrentActive ? 'POS 🟢' : 'POS ⚡'}
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>
      ` : ''}

      <!-- ======================================================== -->
      <!-- OWNER EXCLUSIVE: CROSS-BRANCH PRODUCT STOCK MONITOR      -->
      <!-- "WHICH BRANCH HOW MUCH LEFT" MATRIX TABLE                 -->
      <!-- ======================================================== -->
      ${isOwner ? `
        <section class="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCCFB7] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-4" data-purpose="cross-branch-stock-matrix">
          
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#F4EFE9] pb-4">
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-base sm:text-lg font-black text-[#2A1F1D]">🏬 Cross-Branch Product Stock Monitor Matrix</span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-300">
                  Which Branch Has How Much Left
                </span>
              </div>
              <p class="text-xs text-stone-500 mt-0.5">
                Real-time comparative inventory balances across all outlets with low-stock warnings and restock recommendations.
              </p>
            </div>

            <!-- Matrix Search & Category Filter Pills -->
            <div class="flex items-center gap-2 flex-wrap w-full lg:w-auto">
              <div class="relative flex-1 sm:w-64">
                <input 
                  type="text" 
                  id="cross-branch-stock-search"
                  value="${state.crossBranchSearchQuery || ''}"
                  placeholder="Search sweets across branches..." 
                  class="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B]"
                />
                <span class="absolute left-2.5 top-2.5 text-stone-400">🔍</span>
              </div>
            </div>
          </div>

          <!-- Quick Filter Pills -->
          <div class="flex items-center gap-1.5 flex-wrap text-xs pb-1">
            ${[
              'All',
              'Low Stock Alert (<15kg)',
              'Pure Desi Ghee',
              'Mawa Sweets',
              'Kaju Sweets',
              'Bengali Sweets',
              'Farsan & Namkeen'
            ].map(cat => `
              <button 
                type="button"
                data-matrix-filter="${cat}"
                class="px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  (state.crossBranchFilterCategory || 'All') === cat 
                    ? 'bg-[#1F1917] text-white shadow-2xs font-black' 
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }"
              >
                ${cat}
              </button>
            `).join('')}
          </div>

          <!-- Responsive Cross-Branch Matrix Table -->
          <div class="overflow-x-auto border border-stone-200/80 rounded-2xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-stone-50/90 text-stone-700 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th class="p-3.5 min-w-[200px]">Sweet Name &amp; Category</th>
                  ${branches.map((b: any) => `
                    <th class="p-3.5 text-center min-w-[130px] border-l border-stone-200/60">
                      <span class="block truncate text-stone-900">${b.name}</span>
                      <span class="text-[9px] text-stone-400 font-normal">Stock Level</span>
                    </th>
                  `).join('')}
                  <th class="p-3.5 text-center min-w-[120px] border-l border-stone-200/60 bg-amber-50/60">
                    <span class="block text-amber-950 font-black">Combined Stock</span>
                    <span class="text-[9px] text-amber-700 font-normal">All Outlets</span>
                  </th>
                  <th class="p-3.5 text-right min-w-[150px] border-l border-stone-200/60">
                    Inventory Status &amp; Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-100 text-stone-800">
                ${filteredMatrixSweets.slice(0, 15).map((sweet: any) => {
                  let totalSweetStock = 0;
                  const perBranchStock: Record<string, number> = {};
                  let anyLow = false;
                  let anyOut = false;
                  let lowBranchNames: string[] = [];

                  branches.forEach((b: any) => {
                    const bSweets = branchDataMap[b.id]?.sweets || [];
                    const found = bSweets.find((s: any) => s.id === sweet.id || s.name === sweet.name);
                    const stock = found ? Number(found.stock) || 0 : Number(sweet.stock) || 0;
                    perBranchStock[b.id] = stock;
                    totalSweetStock += stock;
                    if (stock === 0) {
                      anyOut = true;
                      lowBranchNames.push(`${b.name.split(' ')[0]} (0 kg)`);
                    } else if (stock <= 15) {
                      anyLow = true;
                      lowBranchNames.push(`${b.name.split(' ')[0]} (${stock} kg)`);
                    }
                  });

                  return `
                    <tr class="hover:bg-amber-50/30 transition-colors">
                      
                      <!-- Sweet Name, Image & Category -->
                      <td class="p-3.5">
                        <div class="flex items-center gap-2.5">
                          <img 
                            src="${sweet.image || `/assets/sweets/${sweet.id}.png`}" 
                            alt="${sweet.name}" 
                            class="w-8 h-8 rounded-lg object-cover border border-amber-200 shadow-2xs shrink-0" 
                            onerror="this.onerror=null; this.src='/assets/sweets/sw-1.png';"
                          />
                          <div class="min-w-0">
                            <span class="font-extrabold text-[#2A1F1D] block truncate">${sweet.name}</span>
                            <span class="text-[10px] text-stone-400">${sweet.category || 'Mithai'} • ₹${sweet.pricePerKg}/${sweet.unit || 'kg'}</span>
                          </div>
                        </div>
                      </td>

                      <!-- Per-Branch Stock Columns -->
                      ${branches.map((b: any) => {
                        const stock = perBranchStock[b.id] || 0;
                        const isOut = stock === 0;
                        const isLow = stock <= 15;

                        return `
                          <td class="p-3.5 text-center border-l border-stone-200/60">
                            <span class="inline-flex items-center px-2.5 py-1 rounded-xl font-bold font-mono text-[11px] ${
                              isOut 
                                ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                                : isLow 
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }">
                              ${stock} ${sweet.unit || 'kg'}
                            </span>
                          </td>
                        `;
                      }).join('')}

                      <!-- Total Combined Stock Column -->
                      <td class="p-3.5 text-center border-l border-stone-200/60 bg-amber-50/40">
                        <span class="font-black text-amber-950 text-xs font-mono">
                          ${totalSweetStock} ${sweet.unit || 'kg'}
                        </span>
                      </td>

                      <!-- Health & Recommendation -->
                      <td class="p-3.5 text-right border-l border-stone-200/60">
                        ${anyOut ? `
                          <span class="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 font-extrabold text-[10px] border border-rose-200 block truncate" title="Stock out at: ${lowBranchNames.join(', ')}">
                            🚨 Out at ${lowBranchNames.join(', ')}
                          </span>
                        ` : anyLow ? `
                          <span class="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-[10px] border border-amber-300 block truncate" title="Low stock at: ${lowBranchNames.join(', ')}">
                            ⚠️ Low at ${lowBranchNames.join(', ')}
                          </span>
                        ` : `
                          <span class="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                            ✓ Well Balanced
                          </span>
                        `}
                      </td>

                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="flex items-center justify-between text-xs text-stone-500 pt-1">
            <span>Showing top ${Math.min(15, filteredMatrixSweets.length)} of ${filteredMatrixSweets.length} sweets across ${branches.length} branches</span>
            <button type="button" data-tab="products" class="font-extrabold text-[#C86D3B] hover:underline cursor-pointer">
              View Complete 100 Sweets Inventory Catalog →
            </button>
          </div>

        </section>
      ` : ''}

      <!-- ======================================================== -->
      <!-- MAIN 12-COLUMN DASHBOARD GRID                            -->
      <!-- Left (8 cols): Orders & Trajectory / Right (4 cols):     -->
      <!-- Status Donut & Quick Billing POS                         -->
      <!-- ======================================================== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6" data-purpose="main-dashboard-grid">
        
        <!-- ====================================================== -->
        <!-- LEFT COLUMN (8 COLS): Sales & Fast Selling / Combined Orders -->
        <!-- ====================================================== -->
        <div class="lg:col-span-8 space-y-6">
          
          <!-- SECTION 1: Sales Overview Area Chart -->
          <section id="section-sales-overview" class="scroll-reveal-item bg-white p-5 sm:p-6 rounded-3xl border border-[#DCCFB7] shadow-[0_2px_10px_rgba(74,58,47,0.04)]" data-purpose="sales-chart-card">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DCCFB7]/70 gap-2">
              <div>
                <h3 class="text-base font-bold text-[#2A1F1D]">
                  ${isOwner ? 'Consolidated Sales Trajectory' : 'Branch Sales Overview'}
                </h3>
                <p class="text-xs text-stone-400">
                  ${isOwner ? 'Aggregated daily revenue spikes across all outlets' : 'Daily counter receipts & billing spikes'}
                </p>
              </div>

              <!-- Legend -->
              <div class="flex items-center space-x-3 text-xs">
                <span class="flex items-center text-stone-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#10B981] mr-1.5"></span>
                  Gross Revenue
                </span>
                <span class="flex items-center text-stone-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#C86D3B] mr-1.5"></span>
                  Cost &amp; Inward
                </span>
              </div>
            </div>

            <!-- Trajectory Wave SVG -->
            <div class="pt-4">
              <div class="w-full h-44 sm:h-52 relative">
                <svg class="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#10B981" stop-opacity="0.3"></stop>
                      <stop offset="100%" stop-color="#10B981" stop-opacity="0.0"></stop>
                    </linearGradient>
                  </defs>
                  <!-- Baseline lines -->
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#F5EFE9" stroke-width="1" stroke-dasharray="4 4" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#F5EFE9" stroke-width="1" stroke-dasharray="4 4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#F5EFE9" stroke-width="1" stroke-dasharray="4 4" />

                  <!-- Revenue Curve Area -->
                  <path d="M 0 130 Q 80 110, 150 70 T 300 50 T 420 30 T 500 20 L 500 160 L 0 160 Z" fill="url(#salesGrad)" />
                  <!-- Revenue Curve Line -->
                  <path d="M 0 130 Q 80 110, 150 70 T 300 50 T 420 30 T 500 20" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" />

                  <!-- Cost Line -->
                  <path d="M 0 145 Q 80 135, 150 110 T 300 95 T 420 80 T 500 70" fill="none" stroke="#C86D3B" stroke-width="2" stroke-dasharray="3 3" stroke-linecap="round" />
                </svg>
              </div>
              <div class="flex justify-between text-[11px] text-stone-400 font-mono pt-2">
                <span>01 Sep</span>
                <span>08 Sep</span>
                <span>15 Sep</span>
                <span>22 Sep</span>
                <span>30 Sep</span>
              </div>
            </div>
          </section>

          <!-- SECTION 2: Fast Selling Sweets or Live Combined Orders Table -->
          ${isOwner ? `
            <!-- OWNER: Combined Live Orders Across Outlets -->
            <section class="bg-white rounded-3xl border border-[#DCCFB7] shadow-[0_2px_10px_rgba(74,58,47,0.04)] overflow-hidden" data-purpose="combined-orders-table">
              <div class="p-5 border-b border-[#DCCFB7] flex items-center justify-between">
                <div>
                  <h3 class="text-base font-bold text-[#2A1F1D]">Combined Live Orders Across Outlets</h3>
                  <p class="text-xs text-stone-400">Chronological feed of bills generated at all store outlets</p>
                </div>
                <button class="text-xs font-bold text-[#C86D3B] hover:underline cursor-pointer" data-tab="orders">
                  View All Orders →
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                      <th class="py-3 px-4">Order #</th>
                      <th class="py-3 px-4">Outlet Source</th>
                      <th class="py-3 px-4">Patron</th>
                      <th class="py-3 px-4">Items Summary</th>
                      <th class="py-3 px-4">Amount</th>
                      <th class="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-stone-100">
                    ${(ordersList.length > 0 ? ordersList.slice(0, 6) : []).map((ord: any) => `
                      <tr class="hover:bg-amber-50/30 transition-colors">
                        <td class="py-3 px-4 font-mono font-bold text-stone-900">${ord.orderNumber || ord.id}</td>
                        <td class="py-3 px-4">
                          <span class="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-800 font-bold text-[10px] border border-stone-200">
                            ${ord.branchName || 'Active Outlet'}
                          </span>
                        </td>
                        <td class="py-3 px-4 font-semibold text-stone-800">
                          ${ord.customer?.name || ord.customerName || 'Walk-in OTC'}
                        </td>
                        <td class="py-3 px-4 text-stone-500 max-w-[180px] truncate">
                          ${(ord.items || []).map((i: any) => `${i.name} (${i.qty || 1}${i.unit || 'kg'})`).join(', ') || 'Assorted Mithai'}
                        </td>
                        <td class="py-3 px-4 font-black text-stone-900">₹${ord.total || 0}</td>
                        <td class="py-3 px-4 text-right">
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            ord.paymentStatus === 'Paid' || ord.status === 'Completed' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }">
                            ${ord.paymentStatus || 'Completed'}
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                    ${ordersList.length === 0 ? `
                      <tr>
                        <td colspan="6" class="py-8 text-center text-stone-400">
                          No recent orders in the queue.
                        </td>
                      </tr>
                    ` : ''}
                  </tbody>
                </table>
              </div>
            </section>
          ` : `
            <!-- BRANCH MANAGER: Fast Selling Sweets & Stock Table -->
            <section id="section-fast-selling" class="scroll-reveal-item bg-white rounded-3xl border border-[#DCCFB7] shadow-[0_2px_10px_rgba(74,58,47,0.04)] overflow-hidden" data-purpose="fast-selling-sweets-table">
              <div class="p-5 border-b border-[#DCCFB7] flex items-center justify-between">
                <div>
                  <h3 class="text-base font-bold text-[#2A1F1D]">Fast Selling Sweets &amp; Stock</h3>
                  <p class="text-xs text-stone-400">Live fresh batch stock for ${activeBranchObj.name}</p>
                </div>
                <button class="text-xs font-semibold text-[#C86D3B] hover:underline cursor-pointer" data-tab="products">
                  View Full Menu →
                </button>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr class="bg-stone-50 border-b border-[#DCCFB7] text-stone-500 font-semibold text-[11px] uppercase tracking-wider">
                      <th class="py-3 px-5">Sweet Name</th>
                      <th class="py-3 px-4">Category</th>
                      <th class="py-3 px-4">Rate (₹)</th>
                      <th class="py-3 px-4">Stock Status</th>
                      <th class="py-3 px-4 text-right">Quick Order</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#F0ECE4]/60">
                    ${(sweetsList.length > 0 ? sweetsList.slice(0, 6) : []).map((sweet: any) => {
                      const isLow = sweet.stock <= (sweet.minStock || 15) || sweet.stockStatus === 'Low Stock';
                      const isOutOfStock = sweet.stock === 0;
                      return `
                        <tr class="table-row-hover transition-all cursor-pointer">
                          <td class="py-3 px-5 flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-lg overflow-hidden border border-amber-200 bg-amber-50 shrink-0 shadow-2xs">
                              <img src="${sweet.image || `/assets/sweets/${sweet.id}.png`}" alt="${sweet.name}" class="w-full h-full object-cover" loading="lazy" onerror="this.onerror=null; this.src='/assets/sweets/sw-1.png';" />
                            </div>
                            <div class="min-w-0">
                              <span class="font-semibold text-[#2A1F1D] block truncate">${sweet.name}</span>
                              <span class="text-[10px] text-stone-400 font-mono">Stock: ${sweet.stock} ${sweet.unit || 'kg'}</span>
                            </div>
                          </td>
                          <td class="py-3 px-4 text-stone-500">${sweet.category || 'Traditional'}</td>
                          <td class="py-3 px-4 font-semibold text-[#2A1F1D]">₹${sweet.pricePerKg} <span class="text-[11px] font-normal text-stone-400">/${sweet.unit || 'kg'}</span></td>
                          <td class="py-3 px-4">
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              isOutOfStock ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              isLow ? 'bg-amber-50 text-amber-700 border border-amber-300' :
                              'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }">
                              ${isOutOfStock ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td class="py-3 px-4 text-right">
                            <button 
                              class="quick-add-to-cart-btn interactive-scale px-2.5 py-1 rounded-lg text-xs font-semibold text-[#C86D3B] bg-orange-50 hover:bg-[#C86D3B] hover:text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                              data-id="${sweet.id}" 
                              data-name="${sweet.name}" 
                              data-price="${sweet.pricePerKg}"
                            >
                              + Add
                            </button>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </section>
          `}

        </div>

        <!-- ====================================================== -->
        <!-- RIGHT COLUMN (4 COLS): Order Status Donut & Quick POS  -->
        <!-- ====================================================== -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- SECTION 3: Order Status Donut Chart -->
          <section id="section-order-status" class="scroll-reveal-item bg-white p-5 sm:p-6 rounded-3xl border border-[#DCCFB7] shadow-[0_2px_10px_rgba(74,58,47,0.04)]" data-purpose="order-status-card">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-bold text-[#2A1F1D]">
                ${isOwner ? 'Consolidated Orders Breakdown' : 'Branch Order Status'}
              </h3>
              <span class="text-xs text-stone-400">Live Today</span>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between pt-2">
              <!-- SVG Donut Chart with Center Text -->
              <div class="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14.5" fill="none" stroke="#F5EFE9" stroke-width="3.8"></circle>
                  ${totalOrders > 0 ? `
                    <circle cx="18" cy="18" r="14.5" fill="none" stroke="#10B981" stroke-width="3.8" stroke-dasharray="${completedPct} 100" stroke-dashoffset="0" class="donut-segment"></circle>
                    <circle cx="18" cy="18" r="14.5" fill="none" stroke="#0284C7" stroke-width="3.8" stroke-dasharray="${advancePct} 100" stroke-dashoffset="-${completedPct}" class="donut-segment"></circle>
                    <circle cx="18" cy="18" r="14.5" fill="none" stroke="#F59E0B" stroke-width="3.8" stroke-dasharray="${kitchenPct} 100" stroke-dashoffset="-${completedPct + advancePct}" class="donut-segment"></circle>
                  ` : ''}
                </svg>

                <div class="absolute text-center flex flex-col items-center justify-center pointer-events-none">
                  <div class="text-xl font-bold text-[#2A1F1D] leading-tight flex items-center justify-center">
                    ${renderCounter({
                      value: totalOrders,
                      fontWeight: 700,
                      gradientHeight: 4,
                      gradientFrom: 'rgba(255, 255, 255, 0.85)'
                    })}
                  </div>
                  <span class="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">Orders</span>
                </div>
              </div>

              <!-- Donut Chart Legend -->
              <div class="mt-4 sm:mt-0 sm:ml-4 flex-1 space-y-2.5 text-xs w-full">
                <div class="flex items-center justify-between">
                  <span class="flex items-center text-stone-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>
                    Completed Counter
                  </span>
                  <span class="font-bold text-[#2A1F1D]">
                    ${renderCounter({ value: completedOrders, fontWeight: 700 })}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center text-stone-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-sky-500 mr-2"></span>
                    Advance Bookings
                  </span>
                  <span class="font-bold text-[#2A1F1D]">
                    ${renderCounter({ value: advanceOrders, fontWeight: 700 })}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center text-stone-600">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></span>
                    Kitchen Packing
                  </span>
                  <span class="font-bold text-[#2A1F1D]">
                    ${renderCounter({ value: kitchenOrders, fontWeight: 700 })}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- SECTION 4: Quick Billing (POS) Widget -->
          <section id="section-quick-billing" class="scroll-reveal-item bg-white p-5 rounded-3xl border border-[#DCCFB7] shadow-[0_2px_10px_rgba(74,58,47,0.04)] flex flex-col justify-between" data-purpose="quick-pos-widget">
            <div>
              <div class="flex items-center justify-between border-b border-[#DCCFB7] pb-3 mb-4">
                <div>
                  <h3 class="text-base font-bold text-[#2A1F1D]">Quick Counter POS</h3>
                  <p class="text-xs text-stone-400">${activeBranchObj.name}</p>
                </div>
                <span class="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#C86D3B] text-[11px] font-semibold">Counter 1</span>
              </div>

              <!-- Selected Customer Pill -->
              <div class="bg-[var(--bg-subtle)] rounded-xl p-3 border border-[var(--border-color)] mb-4 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-9 h-9 rounded-full ${state.selectedCustomer ? 'bg-amber-200/80 text-amber-900' : 'bg-stone-200 text-stone-700'} font-bold text-xs flex items-center justify-center shadow-2xs">
                    ${state.selectedCustomer ? state.selectedCustomer.name.split(' ').map((n: string)=>n[0]).join('').slice(0, 2) : 'WC'}
                  </div>
                  <div>
                    <div class="flex items-center space-x-1.5">
                      <span class="font-semibold text-xs text-[#2A1F1D]">${state.selectedCustomer ? state.selectedCustomer.name : 'Walk-in Customer'}</span>
                      <span class="text-[9px] ${state.selectedCustomer ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-emerald-100 text-emerald-800'} font-bold px-1.5 py-0.2 rounded">${state.selectedCustomer ? 'Registered Patron' : 'OTC Sale'}</span>
                    </div>
                    <p class="text-[11px] text-stone-500">${state.selectedCustomer ? state.selectedCustomer.phone : 'No phone attached'}</p>
                  </div>
                </div>
              </div>

              <!-- Quick Order Selected Sweets Line Items -->
              ${quickItems.length > 0 ? `
                <div class="space-y-2 mb-4 text-xs">
                  ${quickItems.slice(0, 3).map((item: any) => `
                    <div class="flex items-center justify-between py-1 border-b border-stone-100">
                      <div>
                        <p class="font-semibold text-stone-800">${item.name}</p>
                        <p class="text-[10px] text-stone-400">${item.qty} ${item.unit || 'kg'} × ₹${item.rate || item.price || 0}</p>
                      </div>
                      <span class="font-bold text-[#2A1F1D]">₹${item.total || Math.round(item.qty * (item.rate || item.price || 0))}</span>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="py-4 text-center text-stone-400 space-y-1 border border-dashed border-stone-200 rounded-xl mb-4 bg-stone-50/60 flex flex-col items-center justify-center">
                  <p class="text-xs font-semibold text-stone-600">Quick Cart Ready</p>
                  <p class="text-[10px] text-stone-400">Launch POS for high-speed barcode &amp; weight billing</p>
                </div>
              `}
            </div>

            <!-- Quick POS Launch Bar with Temple Brand Color -->
            <div class="mt-4 pt-3 border-t border-[#DCCFB7] flex items-center gap-2">
              <button 
                id="proceed-to-checkout-btn"
                data-tab="pos"
                class="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#C86D3B] to-[#B25D2E] hover:from-[#B85D2A] hover:to-[#9E4A20] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-[#C86D3B]/25 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#A54F22]"
              >
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                <span>Open POS &rarr;</span>
              </button>
              <button 
                type="button"
                data-tab="pos"
                class="py-3 px-3 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-xl border border-stone-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                title="New OTC Order"
              >
                <span>+ Order</span>
              </button>
              <button 
                type="button"
                data-tab="orders"
                class="py-3 px-3 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-xl border border-stone-300 transition-all cursor-pointer flex items-center gap-1 shrink-0"
                title="View All Orders"
              >
                <span>Bills</span>
              </button>
            </div>
          </section>

        </div>

      </div>

    </div>
  `;
}
