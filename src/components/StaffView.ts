// Staff, Attendance, Salary & Leaves Management Component
// Radhe Sweets - Shop Manager & Live Kitchen Console

export function renderStaffView(state: any) {
  const { 
    staff = [], 
    staffFilterTab = 'all', 
    staffSearchQuery = '', 
    staffDeptFilter = 'all',
    branches = [],
    selectedBranchId = 'all'
  } = state;

  // Filter tabs counts
  const presentCount = staff.filter((s: any) => s.attendanceToday === 'Present').length;
  const onLeaveCount = staff.filter((s: any) => s.attendanceToday === 'On Leave' || s.attendanceToday === 'Absent').length;
  const totalPayroll = staff.reduce((sum: number, s: any) => sum + (Number(s.baseSalary) || 0), 0);
  const paidPayroll = staff.filter((s: any) => s.salaryStatus === 'Paid').reduce((sum: number, s: any) => sum + (Number(s.baseSalary) || 0), 0);
  const pendingPayroll = totalPayroll - paidPayroll;
  const totalAdvances = staff.reduce((sum: number, s: any) => sum + (Number(s.advancesTaken) || 0), 0);

  const tabs = [
    { id: 'all', label: `All Staff (${staff.length})` },
    { id: 'attendance', label: `Attendance Today (${presentCount}/${staff.length})` },
    { id: 'payroll', label: `Salary & Payroll (₹${(totalPayroll / 1000).toFixed(0)}k)` },
    { id: 'leaves', label: `Leaves Ledger` },
    { id: 'advances', label: `Salary Advances (₹${totalAdvances.toLocaleString()})` }
  ];

  const departments = ['All', 'Kitchen / Halwai', 'Sales Counter', 'Store Ops', 'Logistics'];

  // Filter staff by department, search, and tab
  let filteredStaff = staff.filter((s: any) => {
    // Dept filter
    if (staffDeptFilter !== 'all' && s.department !== staffDeptFilter) return false;
    
    // Tab filter
    if (staffFilterTab === 'attendance' && s.attendanceToday === 'Absent') return true;
    if (staffFilterTab === 'payroll' && s.salaryStatus === 'Pending') return true;
    
    // Search query
    if (!staffSearchQuery) return true;
    const q = staffSearchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      (s.phone && s.phone.includes(q)) ||
      (s.department && s.department.toLowerCase().includes(q))
    );
  });

  return `
    <div class="space-y-6 animate-fadeIn select-none" data-purpose="staff-management-view">
      
      <!-- Top Title Header -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D] tracking-tight">Staff &amp; Payroll Management</h1>
            <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#FFF7ED] text-[#C86D3B] border border-[#FED7AA]">
              <span class="w-2 h-2 rounded-full bg-[#C86D3B] animate-pulse"></span>
              Live Shift Roster Active
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#7C7267] mt-1 font-medium">Manage master halwais, counter cashiers, attendance, monthly salary payout &amp; leaves</p>
        </div>

        <!-- Quick Top Action Buttons -->
        <div class="flex items-center gap-2 flex-wrap">
          <button 
            id="open-record-leave-btn"
            class="px-3.5 py-2.5 bg-white border border-[#F0ECE4] text-[#2A1F1D] hover:bg-stone-50 text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>🏖️</span>
            <span>Record Leave</span>
          </button>

          <button 
            id="open-record-advance-btn"
            class="px-3.5 py-2.5 bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>💵</span>
            <span>Staff Advance</span>
          </button>

          <button 
            id="open-add-staff-modal-btn" 
            class="px-4 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span class="text-base leading-none">+</span>
            <span>Add New Staff</span>
          </button>
        </div>
      </section>

      <!-- 4 Staff & Payroll KPI Stat Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <!-- CARD 1: Total Staff & Shifts -->
        <article class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267]">Active Staff Team</span>
            <span class="w-8 h-8 rounded-full bg-orange-50 text-[#C86D3B] flex items-center justify-center text-sm font-bold">
              👥
            </span>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D]">${staff.length} Members</h3>
            <p class="text-xs text-stone-500 mt-0.5">Across 3 Sweet Shop Kitchens &amp; Outlets</p>
          </div>
          <div class="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold">
            <span class="text-emerald-700">Halwais: ${staff.filter((s:any)=>s.department.includes('Kitchen')).length}</span>
            <span class="text-stone-400">•</span>
            <span class="text-sky-700">Counter: ${staff.filter((s:any)=>s.department.includes('Counter')).length}</span>
            <span class="text-stone-400">•</span>
            <span class="text-purple-700">Ops: ${staff.filter((s:any)=>s.department.includes('Ops') || s.department.includes('Logistics')).length}</span>
          </div>
        </article>

        <!-- CARD 2: Attendance Today -->
        <article class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267]">Attendance Today</span>
            <span class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
              ✓
            </span>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl sm:text-3xl font-extrabold text-emerald-700">${presentCount} Present</h3>
            <p class="text-xs text-stone-500 mt-0.5">${onLeaveCount > 0 ? `${onLeaveCount} Staff on Leave / Absent` : '100% Full Attendance Today'}</p>
          </div>
          <div class="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold">
            <span class="text-emerald-600">Rate: ${Math.round((presentCount / (staff.length || 1)) * 100)}%</span>
            <span class="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Shift Active</span>
          </div>
        </article>

        <!-- CARD 3: Monthly Payroll Total -->
        <article class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267]">Monthly Payroll</span>
            <span class="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-sm font-bold">
              ₹
            </span>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D]">₹${totalPayroll.toLocaleString()}</h3>
            <p class="text-xs text-stone-500 mt-0.5">₹${paidPayroll.toLocaleString()} Disbursed • ₹${pendingPayroll.toLocaleString()} Pending</p>
          </div>
          <div class="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold">
            <span class="${pendingPayroll === 0 ? 'text-emerald-700' : 'text-amber-800'}">
              ${pendingPayroll === 0 ? 'All Salaries Paid' : `${staff.filter((s:any)=>s.salaryStatus==='Pending').length} Pending Payout`}
            </span>
            <span class="text-[#C86D3B] hover:underline cursor-pointer" id="kpi-view-payroll-btn">Pay Salaries →</span>
          </div>
        </article>

        <!-- CARD 4: Salary Advances Disbursed -->
        <article class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_4px_20px_-4px_rgba(74,58,47,0.04)] flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#7C7267]">Staff Advances Active</span>
            <span class="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-sm font-bold">
              🤝
            </span>
          </div>
          <div class="mt-3">
            <h3 class="text-2xl sm:text-3xl font-extrabold text-[#2A1F1D]">₹${totalAdvances.toLocaleString()}</h3>
            <p class="text-xs text-stone-500 mt-0.5">Festival &amp; Personal Halwai Advances</p>
          </div>
          <div class="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold">
            <span class="text-purple-700">Deductible at Month-end</span>
            <span class="text-stone-400">${staff.filter((s:any)=>s.advancesTaken > 0).length} Staff Members</span>
          </div>
        </article>
      </section>

      <!-- Navigation Tabs & Search Controls -->
      <section class="bg-white rounded-3xl p-4 sm:p-5 border border-[#F0ECE4] shadow-xs space-y-4">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <!-- Main Tab Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
            ${tabs.map(t => `
              <button 
                data-staff-tab="${t.id}"
                class="px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  staffFilterTab === t.id 
                    ? 'bg-[#C86D3B] text-white shadow-xs' 
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/60'
                }"
              >
                ${t.label}
              </button>
            `).join('')}
          </div>

          <!-- Staff Search Bar -->
          <div class="relative w-full sm:w-72">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              id="staff-search-input"
              type="text" 
              value="${staffSearchQuery || ''}"
              placeholder="Search staff by name, role or phone..." 
              class="w-full pl-10 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#2A1F1D] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#C86D3B] transition-all"
            />
          </div>
        </div>

        <!-- Secondary Department Filter Pills -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span class="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">Department:</span>
          ${departments.map(d => `
            <button 
              data-staff-dept="${d}"
              class="px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                (staffDeptFilter === 'all' && d === 'All') || staffDeptFilter === d
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
              }"
            >
              ${d}
            </button>
          `).join('')}
        </div>
      </section>

      <!-- Staff List & Management Grid -->
      <section class="space-y-4">
        <div class="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
          <span>Showing <strong>${filteredStaff.length}</strong> staff member(s)</span>
          <span>Shift Timing: 07:00 AM – 10:30 PM</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          ${filteredStaff.map((person: any) => {
            const isPresent = person.attendanceToday === 'Present';
            const isOnLeave = person.attendanceToday === 'On Leave';
            const isPaid = person.salaryStatus === 'Paid';

            return `
              <article class="bg-white rounded-3xl p-5 border border-[#F0ECE4] shadow-[0_2px_12px_rgba(74,58,47,0.03)] hover:shadow-md hover:border-[#C86D3B]/40 transition-all flex flex-col justify-between relative group">
                
                <div>
                  <!-- Top Row: Avatar, Name, Designation & Department -->
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-2xl ${
                        person.department.includes('Kitchen') ? 'bg-orange-100 text-[#C86D3B]' :
                        person.department.includes('Counter') ? 'bg-sky-100 text-sky-700' :
                        'bg-purple-100 text-purple-700'
                      } flex items-center justify-center text-lg font-black shrink-0 shadow-2xs">
                        ${person.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <h3 class="text-sm sm:text-base font-extrabold text-[#2A1F1D] leading-tight">${person.name}</h3>
                        <p class="text-xs font-bold text-[#C86D3B] mt-0.5">${person.role}</p>
                        <p class="text-[11px] text-stone-400 font-medium">${person.branchName || 'Flagship Store'}</p>
                      </div>
                    </div>

                    <!-- Attendance Badge -->
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-2xs ${
                      isPresent ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      isOnLeave ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-rose-100 text-rose-800 border border-rose-300'
                    }">
                      ${person.attendanceToday || 'Present'}
                    </span>
                  </div>

                  <!-- Details Grid: Phone, Salary, Advance & Leaves -->
                  <div class="mt-4 p-3 bg-stone-50 rounded-2xl border border-stone-200/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Monthly Salary</span>
                      <span class="font-black text-[#2A1F1D] text-sm">₹${person.baseSalary?.toLocaleString() || 0}</span>
                      <span class="text-[9px] font-bold px-1.5 py-0.2 rounded ml-1 ${
                        isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                      }">
                        ${person.salaryStatus || 'Pending'}
                      </span>
                    </div>

                    <div>
                      <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Advance Due</span>
                      <span class="font-extrabold ${person.advancesTaken > 0 ? 'text-amber-900' : 'text-stone-600'} text-sm">
                        ${person.advancesTaken > 0 ? `₹${person.advancesTaken.toLocaleString()}` : 'None'}
                      </span>
                    </div>

                    <div class="pt-1 border-t border-stone-200/60">
                      <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Leaves Taken</span>
                      <span class="font-bold text-stone-700">${person.leavesTakenThisMonth || 0} / ${person.leavesAllowedPerMonth || 2} this mo</span>
                    </div>

                    <div class="pt-1 border-t border-stone-200/60">
                      <span class="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Phone Contact</span>
                      <span class="font-mono font-bold text-stone-700 text-[11px]">${person.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <!-- Bottom Row: Quick 1-Click Attendance Buttons + Management Actions -->
                <div class="mt-4 pt-3 border-t border-stone-100 space-y-2.5">
                  <!-- Attendance Quick Buttons -->
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Mark Today:</span>
                    <div class="flex items-center gap-1">
                      <button 
                        data-mark-attendance="${person.id}" 
                        data-status="Present"
                        class="px-2 py-0.8 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                          isPresent ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-stone-100 hover:bg-emerald-50 text-stone-600'
                        }"
                      >
                        ✓ Present
                      </button>
                      <button 
                        data-mark-attendance="${person.id}" 
                        data-status="Half Day"
                        class="px-2 py-0.8 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                          person.attendanceToday === 'Half Day' ? 'bg-amber-600 text-white shadow-2xs' : 'bg-stone-100 hover:bg-amber-50 text-stone-600'
                        }"
                      >
                        ½ Half
                      </button>
                      <button 
                        data-mark-attendance="${person.id}" 
                        data-status="On Leave"
                        class="px-2 py-0.8 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                          isOnLeave ? 'bg-amber-600 text-white shadow-2xs' : 'bg-stone-100 hover:bg-amber-50 text-stone-600'
                        }"
                      >
                        🏖️ Leave
                      </button>
                    </div>
                  </div>

                  <!-- Action Buttons: Pay Salary, Advance, Edit -->
                  <div class="grid grid-cols-3 gap-1.5 pt-1">
                    <button 
                      data-pay-staff-salary="${person.id}"
                      class="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                      title="Disburse / Record Monthly Salary"
                    >
                      <span>₹</span>
                      <span>Pay Salary</span>
                    </button>

                    <button 
                      data-staff-give-advance="${person.id}"
                      class="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                      title="Give Festival / Personal Advance"
                    >
                      <span>💵</span>
                      <span>Advance</span>
                    </button>

                    <button 
                      data-edit-staff="${person.id}"
                      class="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                      title="Edit Staff Member"
                    >
                      <span>✏️</span>
                      <span>Edit</span>
                    </button>
                  </div>
                </div>

              </article>
            `;
          }).join('')}
        </div>
      </section>

    </div>
  `;
}

// Modal 1: Add or Edit Staff Member Modal
export function renderAddStaffModal(state: any) {
  const { editingStaff, branches = [] } = state;
  const isEdit = !!editingStaff;

  return `
    <div id="staff-modal-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-orange-100 text-[#C86D3B] flex items-center justify-center font-bold text-sm">
              👥
            </span>
            <h3 class="text-lg font-bold text-[#2A1F1D]">${isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
          </div>
          <button id="close-staff-modal-btn" class="w-8 h-8 rounded-full bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>

        <form id="save-staff-form" class="space-y-4 text-xs">
          <input type="hidden" id="staff-form-id" value="${editingStaff?.id || ''}" />

          <div>
            <label class="block font-bold text-stone-700 mb-1">Full Name *</label>
            <input 
              id="staff-form-name" 
              type="text" 
              required 
              placeholder="e.g. Rameshwar Sharma"
              value="${editingStaff?.name || ''}"
              class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-stone-700 mb-1">Phone Number *</label>
              <input 
                id="staff-form-phone" 
                type="tel" 
                required 
                placeholder="+91 98765 12345"
                value="${editingStaff?.phone || ''}"
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
              />
            </div>

            <div>
              <label class="block font-bold text-stone-700 mb-1">Role / Designation *</label>
              <input 
                id="staff-form-role" 
                type="text" 
                required 
                placeholder="e.g. Head Halwai, Cashier"
                value="${editingStaff?.role || ''}"
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-stone-700 mb-1">Department *</label>
              <select 
                id="staff-form-dept" 
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
              >
                <option value="Kitchen / Halwai" ${editingStaff?.department === 'Kitchen / Halwai' ? 'selected' : ''}>Kitchen / Halwai</option>
                <option value="Sales Counter" ${editingStaff?.department === 'Sales Counter' ? 'selected' : ''}>Sales Counter &amp; Billing</option>
                <option value="Store Ops" ${editingStaff?.department === 'Store Ops' ? 'selected' : ''}>Store Operations &amp; Packaging</option>
                <option value="Logistics" ${editingStaff?.department === 'Logistics' ? 'selected' : ''}>Logistics &amp; Delivery</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-stone-700 mb-1">Base Monthly Salary (₹) *</label>
              <input 
                id="staff-form-salary" 
                type="number" 
                required 
                placeholder="25000"
                value="${editingStaff?.baseSalary || 22000}"
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-stone-700 mb-1">Branch Location</label>
              <select 
                id="staff-form-branch" 
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
              >
                ${branches.map((b: any) => `
                  <option value="${b.id}" ${editingStaff?.branchId === b.id ? 'selected' : ''}>${b.name}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block font-bold text-stone-700 mb-1">Joining Date</label>
              <input 
                id="staff-form-joining" 
                type="text" 
                placeholder="e.g. 15 Jan 2024"
                value="${editingStaff?.joiningDate || '25 Sep 2026'}"
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-stone-700 mb-1">Emergency Contact</label>
              <input 
                id="staff-form-emergency" 
                type="text" 
                placeholder="+91 98765 00000 (Wife/Parent)"
                value="${editingStaff?.emergencyContact || ''}"
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
              />
            </div>

            <div>
              <label class="block font-bold text-stone-700 mb-1">Aadhar Number (Optional)</label>
              <input 
                id="staff-form-aadhar" 
                type="text" 
                placeholder="XXXX-XXXX-1234"
                value="${editingStaff?.aadharNumber || ''}"
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
              />
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
            <button 
              type="button" 
              id="cancel-staff-modal-btn"
              class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-5 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white font-bold rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
            >
              ${isEdit ? 'Save Changes' : 'Create Staff Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Modal 2: Pay Salary Modal
export function renderPaySalaryModal(state: any) {
  const { payingStaff } = state;
  if (!payingStaff) return '';

  const advanceDeduction = payingStaff.advancesTaken || 0;
  const netPayable = Math.max(0, (payingStaff.baseSalary || 0) - advanceDeduction);

  return `
    <div id="pay-salary-modal-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-slide-up">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              ₹
            </span>
            <h3 class="text-lg font-bold text-[#2A1F1D]">Disburse Monthly Salary</h3>
          </div>
          <button id="close-pay-salary-modal-btn" class="w-8 h-8 rounded-full bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>

        <form id="confirm-pay-salary-form" class="space-y-4 text-xs">
          <div class="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="font-bold text-stone-600">Staff Member:</span>
              <span class="font-black text-[#2A1F1D] text-sm">${payingStaff.name}</span>
            </div>
            <div class="flex justify-between items-center text-[11px]">
              <span class="text-stone-500">Designation:</span>
              <span class="font-bold text-[#C86D3B]">${payingStaff.role}</span>
            </div>
            <div class="flex justify-between items-center text-[11px]">
              <span class="text-stone-500">Department:</span>
              <span class="font-semibold text-stone-700">${payingStaff.department}</span>
            </div>
          </div>

          <!-- Payout Breakdown -->
          <div class="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
            <div class="flex justify-between text-stone-600">
              <span>Base Monthly Salary:</span>
              <span class="font-bold text-stone-900">₹${payingStaff.baseSalary?.toLocaleString()}</span>
            </div>
            ${advanceDeduction > 0 ? `
              <div class="flex justify-between text-amber-900 font-medium">
                <span>Advance Deduction:</span>
                <span class="font-bold text-rose-600">- ₹${advanceDeduction.toLocaleString()}</span>
              </div>
            ` : ''}
            <div class="border-t border-emerald-200 pt-2 flex justify-between items-center font-black text-base text-emerald-900">
              <span>Net Payout:</span>
              <span class="text-lg text-emerald-700">₹${netPayable.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label class="block font-bold text-stone-700 mb-1">Payment Method</label>
            <select id="salary-payment-mode" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]">
              <option value="Bank Transfer">Direct Bank Transfer (NEFT/IMPS)</option>
              <option value="UPI">UPI / Google Pay</option>
              <option value="Cash">Cash (Counter Cash Payout)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-stone-700 mb-1">Salary Month</label>
            <input 
              id="salary-month-label" 
              type="text" 
              value="September 2026"
              class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D]"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button 
              type="button" 
              id="cancel-pay-salary-modal-btn"
              class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>✓ Confirm Payment (₹${netPayable.toLocaleString()})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Modal 3: Record Leave Modal
export function renderRecordLeaveModal(state: any) {
  const { staff = [] } = state;

  return `
    <div id="record-leave-modal-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-slide-up">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              🏖️
            </span>
            <h3 class="text-lg font-bold text-[#2A1F1D]">Record Staff Leave</h3>
          </div>
          <button id="close-leave-modal-btn" class="w-8 h-8 rounded-full bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>

        <form id="save-leave-form" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-stone-700 mb-1">Select Staff Member *</label>
            <select id="leave-staff-id" required class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]">
              ${staff.map((s: any) => `
                <option value="${s.id}">${s.name} (${s.role} - ${s.department})</option>
              `).join('')}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-stone-700 mb-1">Leave Type *</label>
              <select id="leave-type-select" class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]">
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Festival Leave">Festival Leave</option>
                <option value="Emergency Leave">Emergency</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-stone-700 mb-1">Number of Days *</label>
              <input 
                id="leave-days-count" 
                type="number" 
                min="0.5" 
                step="0.5" 
                value="1" 
                required
                class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-stone-700 mb-1">Reason / Notes</label>
            <input 
              id="leave-reason-input" 
              type="text" 
              placeholder="e.g. Village function, viral fever..."
              class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button 
              type="button" 
              id="cancel-leave-modal-btn"
              class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-5 py-2.5 bg-[#C86D3B] hover:bg-[#B25D2E] text-white font-bold rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
            >
              Approve &amp; Record Leave
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Modal 4: Record Salary Advance Modal
export function renderRecordAdvanceModal(state: any) {
  const { staff = [], advanceStaffId } = state;
  const preselected = staff.find((s: any) => s.id === advanceStaffId) || staff[0];

  return `
    <div id="advance-modal-backdrop" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-slide-up">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              💵
            </span>
            <h3 class="text-lg font-bold text-[#2A1F1D]">Give Staff Advance</h3>
          </div>
          <button id="close-advance-modal-btn" class="w-8 h-8 rounded-full bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>

        <form id="save-advance-form" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-stone-700 mb-1">Select Staff Member *</label>
            <select id="advance-staff-id" required class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]">
              ${staff.map((s: any) => `
                <option value="${s.id}" ${preselected?.id === s.id ? 'selected' : ''}>
                  ${s.name} (Current Advance: ₹${s.advancesTaken || 0})
                </option>
              `).join('')}
            </select>
          </div>

          <div>
            <label class="block font-bold text-stone-700 mb-1">Advance Amount (₹) *</label>
            <input 
              id="advance-amount-input" 
              type="number" 
              step="500" 
              min="500" 
              value="2000" 
              required
              class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
            />
          </div>

          <div>
            <label class="block font-bold text-stone-700 mb-1">Reason for Advance</label>
            <input 
              id="advance-reason-input" 
              type="text" 
              placeholder="e.g. Festival advance, medical..."
              value="Festival advance"
              class="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#2A1F1D] focus:bg-white focus:outline-none focus:border-[#C86D3B]"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button 
              type="button" 
              id="cancel-advance-modal-btn"
              class="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Disburse Advance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
