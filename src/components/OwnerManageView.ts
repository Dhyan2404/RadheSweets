// Owner & Branch Admin User Management Component
// Supports Role-Based Access Control (RBAC): Owner, Branch Admin, Kitchen Manager, Inventory Auditor, Cashier, Delivery Dispatch
// Includes fine-grained page permissions, live credential edits, and Cloud Firestore sync

export function renderOwnerManageView(state: any): string {
  const currentUser = state.currentUser || { role: 'owner', name: 'Owner', password: 'admin' };
  const isOwner = currentUser.role === 'owner';
  const userBranchId = currentUser.branchId || state.currentBranchId || 'br-1';
  
  // Find current user's branch object if branch admin
  const userBranch = (state.branches || []).find((b: any) => b.id === userBranchId);
  const branchName = userBranch ? userBranch.name : 'Active Branch';

  const allUsers = state.users || [];

  // Branch Admins only see users belonging to their specific branch
  const displayedUsers = isOwner 
    ? allUsers 
    : allUsers.filter((u: any) => u.branchId === userBranchId && u.role !== 'owner');

  const ownerCount = allUsers.filter((u: any) => u.role === 'owner').length;
  const branchAdminCount = allUsers.filter((u: any) => u.role === 'branch_admin').length;
  const staffCount = allUsers.filter((u: any) => u.role !== 'owner' && u.role !== 'branch_admin').length;

  return `
    <div class="space-y-6 animate-fadeIn select-none max-w-6xl mx-auto" data-purpose="user-role-management">
      
      <!-- Top Header & Action Row -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)]">
        <div>
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="w-8 h-8 rounded-xl bg-orange-100 text-[#C86D3B] flex items-center justify-center font-black text-sm">
              ${isOwner ? '👑' : '🏢'}
            </span>
            <h1 class="text-2xl sm:text-3xl font-black text-[#2A1F1D] tracking-tight">
              ${isOwner ? 'Owner Manage • User & Role Center' : `${branchName} • Staff & Cashier Access`}
            </h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isOwner 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-blue-100 text-blue-900 border border-blue-300'
            }">
              ${isOwner ? 'Master Super Admin' : `Branch Admin (${branchName})`}
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#7C7267] font-medium mt-1">
            ${isOwner 
              ? 'Create system users, modify credentials, assign branch roles, and control page permissions across all outlets.'
              : `Create counter cashiers & kitchen staff for ${branchName} and configure page permissions.`
            }
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button 
            type="button" 
            id="open-create-user-modal-btn"
            class="px-4 py-2.5 bg-[#C86D3B] hover:bg-[#b05a2b] text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <span class="text-base leading-none">+</span>
            <span>${isOwner ? 'Create New User' : 'Add Branch Staff'}</span>
          </button>
          
          <button 
            type="button" 
            data-action="app-logout"
            class="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 font-extrabold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title="Sign Out of Radhe Sweets"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </section>

      <!-- Instant Credential Update Card for Logged-in User (Owner / Manager) -->
      <section class="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-white rounded-3xl border border-amber-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
            ${currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👑'}
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-sm sm:text-base font-extrabold text-[#2A1F1D]">My Account Credentials</h2>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-200/90 text-amber-950 border border-amber-300">
                ${currentUser.role?.replace('_', ' ')}
              </span>
            </div>
            <p class="text-xs text-stone-500 mt-0.5">
              Change your username or password anytime with instant Cloud Firestore sync.
            </p>
          </div>
        </div>

        <!-- Quick Form to change own username & password -->
        <form id="quick-edit-self-form" class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-stone-500 block uppercase">Username</span>
            <input 
              type="text" 
              name="myUsername" 
              value="${currentUser.name || ''}" 
              placeholder="Username" 
              required 
              class="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B] min-w-[130px]"
            />
          </div>
          <div class="space-y-1">
            <span class="text-[10px] font-bold text-stone-500 block uppercase">Password</span>
            <input 
              type="text" 
              name="myPassword" 
              value="${currentUser.password || ''}" 
              placeholder="Password" 
              required 
              class="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B] min-w-[130px]"
            />
          </div>
          <div class="pt-5">
            <button 
              type="submit" 
              class="px-4 py-2.5 bg-[#1F1917] hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <span>💾</span>
              <span>Update My Credentials</span>
            </button>
          </div>
        </form>
      </section>

      <!-- KPI Summary Cards -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="p-4 bg-white rounded-2xl border border-[#F0ECE4] shadow-xs space-y-1">
          <span class="text-[11px] font-bold text-stone-500 uppercase tracking-wide">Total Users</span>
          <div class="text-2xl font-black text-[#2A1F1D]">${displayedUsers.length}</div>
          <p class="text-[11px] text-stone-400 font-medium">Active roster accounts</p>
        </div>

        ${isOwner ? `
          <div class="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-xs space-y-1">
            <span class="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Super Admins</span>
            <div class="text-2xl font-black text-amber-950">${ownerCount}</div>
            <p class="text-[11px] text-amber-700/80 font-medium">Full global access</p>
          </div>

          <div class="p-4 bg-white rounded-2xl border border-blue-200/80 shadow-xs space-y-1">
            <span class="text-[11px] font-bold text-blue-800 uppercase tracking-wide">Branch Admins</span>
            <div class="text-2xl font-black text-blue-950">${branchAdminCount}</div>
            <p class="text-[11px] text-blue-700/80 font-medium">Outlet managers</p>
          </div>
        ` : ''}

        <div class="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-xs space-y-1">
          <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">Staff &amp; Cashiers</span>
          <div class="text-2xl font-black text-emerald-950">${isOwner ? staffCount : displayedUsers.length}</div>
          <p class="text-[11px] text-emerald-700/80 font-medium">Counter, kitchen &amp; delivery</p>
        </div>

      </section>

      <!-- Users Table & Cards List -->
      <section class="bg-white rounded-3xl p-6 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] space-y-4">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4EFE9] pb-4">
          <div>
            <h2 class="text-lg font-extrabold text-[#2A1F1D]">Active Users &amp; Credentials Roster</h2>
            <p class="text-xs text-stone-500">Edit usernames, reset passwords, change roles, and assign outlet permissions</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1 rounded-xl">
              Cloud Firestore Synced 🟢
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border border-stone-200/70 rounded-2xl overflow-hidden">
            <thead class="bg-stone-50 text-stone-700 uppercase font-black text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th class="p-3.5">User Handle</th>
                <th class="p-3.5">Role</th>
                <th class="p-3.5">Assigned Branch</th>
                <th class="p-3.5">Permissions / Pages</th>
                <th class="p-3.5">Password</th>
                <th class="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100 text-stone-800">
              ${displayedUsers.map((u: any) => {
                const branchObj = (state.branches || []).find((b: any) => b.id === u.branchId);
                const branchDisplay = u.role === 'owner' ? 'All Outlets (Global)' : (branchObj ? branchObj.name : (u.branchName || 'Unassigned'));

                let roleBadgeClass = 'bg-stone-100 text-stone-800 border-stone-300';
                let roleLabel = 'Staff / Operator';
                let roleIcon = '👤';

                if (u.role === 'owner') {
                  roleBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
                  roleLabel = 'Owner (Super Admin)';
                  roleIcon = '👑';
                } else if (u.role === 'branch_admin') {
                  roleBadgeClass = 'bg-blue-100 text-blue-900 border-blue-300';
                  roleLabel = 'Branch Admin';
                  roleIcon = '🏢';
                } else if (u.role === 'kitchen_manager') {
                  roleBadgeClass = 'bg-orange-100 text-orange-900 border-orange-300';
                  roleLabel = 'Kitchen Manager / Halwai';
                  roleIcon = '👨‍🍳';
                } else if (u.role === 'inventory_auditor') {
                  roleBadgeClass = 'bg-purple-100 text-purple-900 border-purple-300';
                  roleLabel = 'Inventory & Stock Auditor';
                  roleIcon = '📦';
                } else if (u.role === 'cashier') {
                  roleBadgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                  roleLabel = 'Cashier / Counter Staff';
                  roleIcon = '🛍️';
                } else if (u.role === 'delivery_dispatch') {
                  roleBadgeClass = 'bg-teal-100 text-teal-900 border-teal-300';
                  roleLabel = 'Delivery & Dispatch';
                  roleIcon = '🛵';
                }

                const allowed = u.allowedPages || (u.role === 'owner' ? ['all'] : ['pos']);

                return `
                  <tr class="hover:bg-amber-50/30 transition-colors">
                    
                    <!-- User Name & Avatar -->
                    <td class="p-3.5 font-bold">
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-extrabold text-stone-700 shrink-0">
                          ${u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <span class="text-sm font-extrabold text-[#2A1F1D] block">${u.name}</span>
                          <span class="text-[10px] text-stone-400 font-mono">ID: ${u.id || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    <!-- Role Badge -->
                    <td class="p-3.5">
                      <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${roleBadgeClass}">
                        <span>${roleIcon}</span>
                        <span>${roleLabel}</span>
                      </span>
                    </td>

                    <!-- Branch -->
                    <td class="p-3.5 font-semibold text-stone-700">
                      <span class="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-800 font-bold text-xs">
                        ${branchDisplay}
                      </span>
                    </td>

                    <!-- Allowed Pages -->
                    <td class="p-3.5">
                      <div class="flex items-center gap-1 flex-wrap max-w-xs">
                        ${u.role === 'owner' ? `
                          <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase">All Pages &amp; Settings</span>
                        ` : u.role === 'branch_admin' ? `
                          <span class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[10px] font-extrabold uppercase">Full Branch Operations + Staff</span>
                        ` : (allowed || []).map((page: string) => `
                          <span class="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold border border-stone-200">
                            ${page.toUpperCase()}
                          </span>
                        `).join('')}
                      </div>
                    </td>

                    <!-- Password Peek -->
                    <td class="p-3.5 font-mono text-xs text-stone-600">
                      <span class="bg-stone-100 px-2 py-1 rounded-lg border border-stone-200/80 font-bold select-all">
                        ${u.password || '••••••'}
                      </span>
                    </td>

                    <!-- Actions: Edit & Delete -->
                    <td class="p-3.5 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        <button 
                          type="button"
                          data-action="edit-user"
                          data-user-id="${u.id}"
                          class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer border border-amber-200"
                          title="Edit username, password, or permissions"
                        >
                          ✏️ Edit
                        </button>
                        ${u.name?.toLowerCase() === 'owner' && u.role === 'owner' ? `
                          <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200">
                            Root
                          </span>
                        ` : `
                          <button 
                            type="button"
                            data-action="delete-user"
                            data-user-id="${u.id}"
                            data-user-name="${u.name}"
                            class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer border border-rose-200"
                          >
                            🗑️
                          </button>
                        `}
                      </div>
                    </td>

                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

      </section>

      <!-- 4. Owner Handover & Clean Slate Factory Reset (Exclusive to Owner) -->
      ${isOwner ? `
      <section class="p-5 sm:p-6 bg-gradient-to-br from-rose-50/80 via-amber-50/30 to-white rounded-3xl border-2 border-rose-200/90 shadow-subtle space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              🧹
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base sm:text-lg font-black text-stone-900">
                  Store Factory Reset • Clean Slate for New Owner
                </h3>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-300">
                  Handover &amp; Resale Tool
                </span>
              </div>
              <p class="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Selling or deploying this POS system to a sweet shop owner? Wipe all test sales, sample orders, demo expenses, audit logs, and parked counter bills with 1-click. <strong>Your 100+ sweets catalog, pricing, recipes, branch outlets, user accounts, and shop settings remain 100% intact.</strong>
              </p>
            </div>
          </div>

          <button 
            type="button" 
            id="owner-factory-reset-btn"
            class="px-5 py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>⚡ Wipe All Back Data (Clean Slate)</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
          <div class="p-3 bg-white/90 rounded-xl border border-emerald-200 flex items-center gap-2 text-stone-700">
            <span class="text-emerald-600 font-bold">✓ Preserves:</span>
            <span>100+ Sweets, Prices &amp; Categories</span>
          </div>
          <div class="p-3 bg-white/90 rounded-xl border border-emerald-200 flex items-center gap-2 text-stone-700">
            <span class="text-emerald-600 font-bold">✓ Preserves:</span>
            <span>Branches, UPI &amp; Printer Settings</span>
          </div>
          <div class="p-3 bg-white/90 rounded-xl border border-rose-200 flex items-center gap-2 text-stone-700">
            <span class="text-rose-600 font-bold">✕ Wipes:</span>
            <span>All Demo Orders, Expenses &amp; Logs</span>
          </div>
        </div>
      </section>
      ` : ''}

    </div>
  `;
}

// Create New User Modal HTML
export function renderCreateUserModal(state: any): string {
  const currentUser = state.currentUser || { role: 'owner' };
  const isOwner = currentUser.role === 'owner';
  const userBranchId = currentUser.branchId || state.currentBranchId || 'br-1';

  return `
    <div id="create-user-modal-backdrop" class="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div class="w-full max-w-lg bg-white rounded-[28px] shadow-2xl border border-stone-200 overflow-hidden animate-slideUp">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-orange-100 text-[#C86D3B] flex items-center justify-center font-bold text-sm">
              👤
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#2A1F1D]">
                ${isOwner ? 'Create New System User' : 'Add Branch Staff & Cashier'}
              </h3>
              <p class="text-[11px] text-stone-500 font-medium">
                Set credentials and designate role &amp; accessible tabs
              </p>
            </div>
          </div>
          <button 
            type="button" 
            id="close-create-user-modal-btn"
            class="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>

        <!-- Form Body -->
        <form id="create-user-form" class="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          
          <!-- Field 1: Name -->
          <div class="space-y-1 text-left">
            <label class="text-[11px] font-bold text-stone-600">User Name / Login Handle *</label>
            <input 
              type="text" 
              name="userName" 
              required 
              placeholder="e.g. Ramesh Cashier, Satellite Manager"
              class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C86D3B]"
            />
          </div>

          <!-- Field 2: Password -->
          <div class="space-y-1 text-left">
            <label class="text-[11px] font-bold text-stone-600">Password *</label>
            <input 
              type="text" 
              name="userPassword" 
              required 
              placeholder="e.g. cash123, radhe2026"
              class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C86D3B]"
            />
          </div>

          <!-- Field 3: Role Dropdown (Expanded with rich roles!) -->
          <div class="space-y-1 text-left">
            <label class="text-[11px] font-bold text-stone-600">User Role *</label>
            ${isOwner ? `
              <select 
                id="create-user-role-select" 
                name="userRole" 
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B]"
              >
                <option value="branch_admin" selected>🏢 Branch Admin (Full management of assigned branch &amp; its staff)</option>
                <option value="cashier">🛍️ Cashier (Front POS Counter &amp; Invoices)</option>
                <option value="kitchen_manager">👨‍🍳 Kitchen Manager / Master Halwai (Stock, Recipes &amp; Expenses)</option>
                <option value="inventory_auditor">📦 Inventory &amp; Stock Auditor (Stock Batches &amp; Audits)</option>
                <option value="delivery_dispatch">🛵 Delivery &amp; Dispatch (Orders &amp; Customer Directory)</option>
                <option value="owner">👑 Owner (Super Admin - All branches, settings &amp; users)</option>
                <option value="custom">⚙️ Custom Staff Role (Tailored page access)</option>
              </select>
            ` : `
              <select 
                id="create-user-role-select" 
                name="userRole" 
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B]"
              >
                <option value="cashier" selected>🛍️ Cashier (Front POS Counter &amp; Invoices)</option>
                <option value="kitchen_manager">👨‍🍳 Kitchen Staff / Halwai (Stock &amp; Recipes)</option>
                <option value="delivery_dispatch">🛵 Delivery &amp; Dispatch (Orders)</option>
                <option value="custom">⚙️ Custom Staff</option>
              </select>
            `}
          </div>

          <!-- Field 4: Branch Assignment -->
          <div id="branch-select-container" class="space-y-1 text-left">
            <label class="text-[11px] font-bold text-stone-600">Assigned Branch *</label>
            ${isOwner ? `
              <select 
                id="user-branch-select"
                name="userBranchId" 
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B]"
              >
                ${(state.branches || []).map((b: any) => `
                  <option value="${b.id}" ${b.id === state.currentBranchId ? 'selected' : ''}>
                    ${b.name} (${b.city || 'Gandhinagar'})
                  </option>
                `).join('')}
              </select>
            ` : `
              <input type="hidden" name="userBranchId" value="${userBranchId}" />
              <div class="px-3.5 py-2.5 bg-stone-100 rounded-xl text-stone-700 font-bold">
                ${(state.branches || []).find((b: any) => b.id === userBranchId)?.name || 'Assigned Branch'}
              </div>
            `}
          </div>

          <!-- Dynamic Role Explanation Notice -->
          <div id="role-notice-card" class="p-3.5 ${isOwner ? 'bg-blue-50/90 border-blue-200' : 'bg-emerald-50/90 border-emerald-200'} border rounded-2xl text-left space-y-1">
            <div id="role-notice-title" class="flex items-center gap-2 ${isOwner ? 'text-blue-950' : 'text-emerald-950'} font-extrabold text-xs">
              <span>${isOwner ? '🏢' : '🛍️'}</span>
              <span>${isOwner ? 'Branch Admin Operational Command' : 'Cashier / Counter Executive'}</span>
            </div>
            <p id="role-notice-desc" class="text-[11px] ${isOwner ? 'text-blue-900' : 'text-emerald-900'} leading-relaxed font-semibold">
              ${isOwner 
                ? 'Automatically granted full management of all daily operations for this branch: POS Billing, Orders &amp; Invoices, Customers, Sweets &amp; Stock Restock, Store Expenses, Daily Profit &amp; Reports, Halwais/Staff Ledger, and Branch Cashier Management.'
                : 'Front counter POS sales, instant weight pricing, customer mobile dialer, and thermal receipt printing.'
              }
            </p>
          </div>

          <!-- Field 5: Allowed Pages (Checkboxes) -->
          <div id="allowed-pages-container" class="space-y-2 text-left pt-2 border-t border-stone-100 block">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-bold text-stone-700 block">
                Grant Page Access:
              </label>
              <span class="text-[10px] text-[#C86D3B] font-extrabold">Add / Remove Pages</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                <input type="checkbox" name="allowedPages" value="pos" checked class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                <span class="font-bold text-stone-800">🛍️ Sell / POS Counter</span>
              </label>

              <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                <input type="checkbox" name="allowedPages" value="dashboard" checked class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                <span class="font-bold text-stone-800">📊 Shop Dashboard</span>
              </label>

              <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                <input type="checkbox" name="allowedPages" value="orders" checked class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                <span class="font-bold text-stone-800">📦 Orders &amp; Invoices</span>
              </label>

              <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                <input type="checkbox" name="allowedPages" value="customers" checked class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                <span class="font-bold text-stone-800">👥 Customers Directory</span>
              </label>

              <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                <input type="checkbox" name="allowedPages" value="products" checked class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                <span class="font-bold text-stone-800">🍬 Sweets &amp; Stock</span>
              </label>

              <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                <input type="checkbox" name="allowedPages" value="expenses" checked class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                <span class="font-bold text-stone-800">💸 Store Expenses</span>
              </label>

              <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                <input type="checkbox" name="allowedPages" value="staff" checked class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                <span class="font-bold text-stone-800">👨‍🍳 Staff &amp; Halwais</span>
              </label>

              <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                <input type="checkbox" name="allowedPages" value="branch-admin" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                <span class="font-bold text-stone-800">🏢 Branch Admin Console</span>
              </label>

              <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                <input type="checkbox" name="allowedPages" value="analytics" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                <span class="font-bold text-stone-800">📈 Reports &amp; Profit</span>
              </label>

              <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                <input type="checkbox" name="allowedPages" value="settings" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                <span class="font-bold text-stone-800">⚙️ Store Settings</span>
              </label>

              <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                <input type="checkbox" name="allowedPages" value="owner-manage" class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                <span class="font-bold text-stone-800">👑 User Management</span>
              </label>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
            <button 
              type="button" 
              id="cancel-create-user-modal-btn"
              class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 bg-[#C86D3B] hover:bg-[#b05a2b] text-white font-extrabold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Save User to Cloud
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}

// Edit Existing User Modal HTML
export function renderEditUserModal(state: any): string {
  const targetUser = state.editingUser;
  if (!targetUser) return '';

  const currentUser = state.currentUser || { role: 'owner' };
  const isOwner = currentUser.role === 'owner';
  const isMasterOwner = targetUser.name?.toLowerCase() === 'owner' && targetUser.role === 'owner';

  const userRole = targetUser.role || 'cashier';
  const userAllowed = targetUser.allowedPages || [];

  return `
    <div id="edit-user-modal-backdrop" class="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div class="w-full max-w-lg bg-white rounded-[28px] shadow-2xl border border-stone-200 overflow-hidden animate-slideUp">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              ✏️
            </div>
            <div>
              <h3 class="text-base font-extrabold text-[#2A1F1D]">
                Edit User: ${targetUser.name}
              </h3>
              <p class="text-[11px] text-stone-500 font-medium">
                Update username, password, branch location, and permitted pages
              </p>
            </div>
          </div>
          <button 
            type="button" 
            id="close-edit-user-modal-btn"
            class="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>

        <!-- Form Body -->
        <form id="edit-user-form" class="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          <input type="hidden" name="userId" value="${targetUser.id}" />

          <!-- Field 1: Name -->
          <div class="space-y-1 text-left">
            <label class="text-[11px] font-bold text-stone-600">Username / Login Handle *</label>
            <input 
              type="text" 
              name="userName" 
              value="${targetUser.name || ''}" 
              required 
              class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B]"
            />
          </div>

          <!-- Field 2: Password -->
          <div class="space-y-1 text-left">
            <label class="text-[11px] font-bold text-stone-600">Password *</label>
            <input 
              type="text" 
              name="userPassword" 
              value="${targetUser.password || ''}" 
              required 
              class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B]"
            />
          </div>

          <!-- Field 3: Role -->
          <div class="space-y-1 text-left">
            <label class="text-[11px] font-bold text-stone-600">Role</label>
            ${isMasterOwner ? `
              <input type="hidden" name="userRole" value="owner" />
              <div class="px-3.5 py-2.5 bg-amber-50 rounded-xl text-amber-950 font-bold border border-amber-200 flex items-center justify-between">
                <span>👑 Root Owner (Super Admin)</span>
                <span class="text-[10px] text-amber-700 uppercase font-mono">Full Global Access</span>
              </div>
            ` : isOwner ? `
              <select 
                id="edit-user-role-select" 
                name="userRole" 
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B]"
              >
                <option value="owner" ${userRole === 'owner' ? 'selected' : ''}>👑 Owner (Super Admin - All Outlets)</option>
                <option value="branch_admin" ${userRole === 'branch_admin' ? 'selected' : ''}>🏢 Branch Admin (Full Branch Command)</option>
                <option value="cashier" ${userRole === 'cashier' ? 'selected' : ''}>🛍️ Cashier (POS Counter &amp; Invoices)</option>
                <option value="kitchen_manager" ${userRole === 'kitchen_manager' ? 'selected' : ''}>👨‍🍳 Kitchen Manager (Production &amp; Stock)</option>
                <option value="inventory_auditor" ${userRole === 'inventory_auditor' ? 'selected' : ''}>📦 Inventory Auditor</option>
                <option value="delivery_dispatch" ${userRole === 'delivery_dispatch' ? 'selected' : ''}>🛵 Delivery &amp; Dispatch</option>
                <option value="custom" ${userRole === 'custom' ? 'selected' : ''}>⚙️ Custom Staff</option>
              </select>
            ` : `
              <input type="hidden" name="userRole" value="${userRole}" />
              <div class="px-3.5 py-2.5 bg-stone-100 rounded-xl text-stone-700 font-bold">
                ${userRole.toUpperCase()}
              </div>
            `}
          </div>

          <!-- Field 4: Branch -->
          <div id="edit-branch-select-container" class="space-y-1 text-left" style="${userRole === 'owner' ? 'display: none;' : ''}">
            <label class="text-[11px] font-bold text-stone-600">Assigned Branch</label>
            ${isOwner ? `
              <select 
                name="userBranchId" 
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:outline-none focus:border-[#C86D3B]"
              >
                ${(state.branches || []).map((b: any) => `
                  <option value="${b.id}" ${b.id === targetUser.branchId ? 'selected' : ''}>
                    ${b.name} (${b.city || 'Gandhinagar'})
                  </option>
                `).join('')}
              </select>
            ` : `
              <input type="hidden" name="userBranchId" value="${targetUser.branchId}" />
              <div class="px-3.5 py-2.5 bg-stone-100 rounded-xl text-stone-700 font-bold">
                ${(state.branches || []).find((b: any) => b.id === targetUser.branchId)?.name || 'Assigned Branch'}
              </div>
            `}
          </div>

          <!-- Field 5: Allowed Pages -->
          <div id="edit-allowed-pages-container" class="space-y-2 text-left pt-2 border-t border-stone-100 block">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-bold text-stone-700 block">Permitted Pages for this Account:</label>
              <span class="text-[10px] text-[#C86D3B] font-extrabold">Add / Remove Pages</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              ${[
                { id: 'pos', label: '🛍️ Sell / POS Counter' },
                { id: 'dashboard', label: '📊 Shop Dashboard' },
                { id: 'orders', label: '📦 Orders & Invoices' },
                { id: 'customers', label: '👥 Customers Directory' },
                { id: 'products', label: '🍬 Sweets & Stock' },
                { id: 'expenses', label: '💸 Store Expenses' },
                { id: 'staff', label: '👨‍🍳 Staff & Halwais' },
                { id: 'branch-admin', label: '🏢 Branch Admin Console' },
                { id: 'analytics', label: '📈 Reports & Profit' },
                { id: 'settings', label: '⚙️ Store Settings' },
                { id: 'owner-manage', label: '👑 User Management' }
              ].map(p => `
                <label class="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200/80 cursor-pointer hover:bg-stone-100">
                  <input type="checkbox" name="allowedPages" value="${p.id}" ${userAllowed.includes(p.id) ? 'checked' : ''} class="rounded text-[#C86D3B] focus:ring-[#C86D3B]" />
                  <span class="font-bold text-stone-800">${p.label}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
            <button 
              type="button" 
              id="cancel-edit-user-modal-btn"
              class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 bg-[#C86D3B] hover:bg-[#b05a2b] text-white font-extrabold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Save Credentials &amp; Role
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
