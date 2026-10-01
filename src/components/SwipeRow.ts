// SwipeRow Component for Invoices & Orders - Radhe Sweets
// High-performance hardware-accelerated interactive swipeable row
// Features:
// 1. Option 1: WhatsApp message to customer with pre-formatted invoice
// 2. Option 2: View / edit order details & print thermal receipt
// 3. Option 3: Delete order with spring full-swipe commit & collapse animation
// Pure TypeScript + Hardware GPU accelerated DOM transitions (120 FPS)

export interface SwipeAction {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  dismiss?: boolean;
}

export interface SwipeRowOptions {
  id: string;
  actions?: SwipeAction[];
  actionColor?: string;
  drawerColor?: string;
  rowColor?: string;
  textColor?: string;
  height?: number;
  radius?: number;
  actionWidth?: number;
  direction?: 'left' | 'right';
  snapBounce?: number;
  resistance?: number;
  collapseMs?: number;
  commitAt?: number;
  fullSwipe?: boolean;
  disabled?: boolean;
  className?: string;
}

export const DEFAULT_INVOICE_ACTIONS: SwipeAction[] = [
  {
    id: 'delete',
    label: 'Delete',
    color: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    dismiss: true,
    icon: `<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
  },
  {
    id: 'view',
    label: 'View / Edit',
    color: 'linear-gradient(135deg, #F59E0B 0%, #C86D3B 100%)',
    dismiss: false,
    icon: `<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    dismiss: false,
    icon: `<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.761.82 2.791.82 3.181 0 5.768-2.587 5.768-5.766.001-3.182-2.585-5.806-5.768-5.806zm3.374 8.243c-.145.407-.741.777-1.033.826-.292.05-.67.072-1.077-.061-.258-.084-.59-.199-1.018-.387-1.796-.789-2.96-2.616-3.05-2.736-.09-.12-1.033-1.378-1.033-2.628 0-1.25.646-1.866.877-2.12.231-.254.508-.318.677-.318.17 0 .339.002.486.01.154.009.362-.058.566.432.215.518.736 1.792.8 1.923.064.13.107.283.02.454-.087.17-.13.277-.258.428-.128.151-.27.337-.386.452-.128.129-.262.27-.113.526.149.256.662 1.092 1.419 1.766.974.867 1.795 1.135 2.052 1.264.257.129.407.114.558-.06.151-.173.646-.752.818-1.01.172-.258.344-.216.578-.129.234.086 1.488.701 1.745.83.257.129.428.194.492.302.064.108.064.625-.081 1.032z"></path></svg>`
  }
];

export function renderSwipeRow(
  options: SwipeRowOptions,
  contentHtml: string
): string {
  const {
    id,
    actions = DEFAULT_INVOICE_ACTIONS,
    height = 80,
    radius = 20,
    actionWidth = 84,
    direction = 'left',
    collapseMs = 200,
    disabled = false,
    className = ''
  } = options;

  const n = actions.length;
  const primary = actions[0]; // Delete is primary
  const secondaryActions = actions.slice(1); // View / Edit, WhatsApp
  const s = direction === 'left' ? -1 : 1;

  return `
    <div
      id="swipe-row-${id}"
      class="swipe-row-root group relative select-none transition-all duration-200 mb-3 ${disabled ? 'opacity-55 pointer-events-none' : ''} ${className}"
      data-id="${id}"
      data-direction="${direction}"
      data-action-width="${actionWidth}"
      data-action-count="${n}"
      data-collapse-ms="${collapseMs}"
      style="
        height: ${height}px;
        border-radius: ${radius}px;
      "
    >
      <div 
        class="swipe-row-inner relative w-full h-full overflow-hidden" 
        style="border-radius: ${radius}px; background: transparent;"
      >
        <!-- Background Drawer Rail with Sleek Ergonomic Capsule Action Buttons -->
        <div
          id="swipe-rail-${id}"
          class="swipe-rail absolute inset-0 flex items-center justify-end z-0 pointer-events-auto p-1.5"
          style="background: linear-gradient(135deg, #18181B 0%, #292524 100%); border-radius: ${radius}px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);"
        >
          <!-- Secondary Actions (e.g. WhatsApp, View/Edit) -->
          ${secondaryActions.map((action, idx) => `
            <button
              type="button"
              data-action-id="${action.id}"
              data-row-id="${id}"
              class="swipe-action-btn absolute top-1.5 bottom-1.5 flex flex-col items-center justify-center cursor-pointer select-none text-white shadow-md active:scale-95 transition-all"
              style="
                width: ${actionWidth - 8}px;
                right: ${(idx + 1) * actionWidth + 4}px;
                background: ${action.color || '#3f3f46'};
                border-radius: ${Math.max(10, radius - 6)}px;
              "
              title="${action.label}"
            >
              <span class="inline-flex items-center justify-center mb-1">
                ${action.icon || ''}
              </span>
              <span class="text-[10px] sm:text-[11px] font-bold leading-tight tracking-tight">${action.label}</span>
            </button>
          `).join('')}

          <!-- Primary Action (Delete) that expands on full swipe -->
          ${primary ? `
            <div
              id="swipe-primary-block-${id}"
              class="swipe-primary-block absolute top-1.5 bottom-1.5 right-1.5 flex items-center justify-center cursor-pointer select-none text-white transition-all shadow-md"
              style="
                width: ${actionWidth - 8}px;
                background: ${primary.color || '#e5484d'};
                border-radius: ${Math.max(10, radius - 6)}px;
              "
            >
              <button
                type="button"
                data-action-id="${primary.id}"
                data-row-id="${id}"
                class="swipe-action-btn flex flex-col items-center justify-center w-full h-full text-white cursor-pointer active:scale-95"
                title="${primary.label}"
              >
                <span class="inline-flex items-center justify-center mb-1">
                  ${primary.icon || ''}
                </span>
                <span class="text-[10px] sm:text-[11px] font-bold leading-tight tracking-tight">${primary.label}</span>
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Foreground Surface Card with Luxury Porcelain Depth -->
        <div
          id="swipe-surface-${id}"
          class="swipe-surface relative z-10 w-full h-full flex items-center px-3.5 sm:px-5 bg-white dark:bg-[#201715] text-[#2A1F1D] dark:text-[#FAF7F2] rounded-[${radius}px] cursor-grab active:cursor-grabbing touch-pan-y"
          style="
            border-radius: ${radius}px;
            background: linear-gradient(180deg, #FFFFFF 0%, #FDFBF8 100%);
            box-shadow: 0 4px 16px -3px rgba(74, 58, 47, 0.05), 0 1px 3px rgba(74, 58, 47, 0.03);
            border: 1px solid rgba(228, 220, 208, 0.7);
            transform: translate3d(0, 0, 0);
          "
        >
          ${contentHtml}

          <!-- Visual Swipe Hint Indicator -->
          <div class="swipe-hint ml-2 shrink-0 text-stone-300 dark:text-stone-600 sm:hidden pointer-events-none">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Controller logic for SwipeRow
export interface SwipeRowCallbacks {
  onAction?: (actionId: string, rowId: string) => void;
  onCommit?: (actionId: string, rowId: string) => void;
}

export function initSwipeRow(
  rowElement: HTMLElement,
  callbacks: SwipeRowCallbacks = {}
): () => void {
  const rowId = rowElement.getAttribute('data-id');
  if (!rowId) return () => {};

  const surface = rowElement.querySelector<HTMLElement>(`#swipe-surface-${rowId}`);
  const rail = rowElement.querySelector<HTMLElement>(`#swipe-rail-${rowId}`);
  const primaryBlock = rowElement.querySelector<HTMLElement>(`#swipe-primary-block-${rowId}`);
  if (!surface) return () => {};

  const actionWidth = parseInt(rowElement.getAttribute('data-action-width') || '80', 10);
  const actionCount = parseInt(rowElement.getAttribute('data-action-count') || '3', 10);
  const totalDrawerWidth = actionCount * actionWidth;
  const collapseMs = parseInt(rowElement.getAttribute('data-collapse-ms') || '200', 10);

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let isDragging = false;
  let isHorizontal = false;
  let isCommitted = false;

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const rubber = (o: number, dim: number, c: number) => (o * dim * c) / (dim + c * Math.abs(o));

  const applyOffset = (offset: number, animate = false) => {
    surface.style.transition = animate ? 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)' : 'none';
    surface.style.transform = `translate3d(${offset}px, 0, 0)`;

    // If dragged past totalDrawerWidth (full swipe), expand primaryBlock
    if (primaryBlock) {
      const extra = Math.max(0, Math.abs(offset) - totalDrawerWidth);
      if (extra > 0 && offset < 0) {
        primaryBlock.style.width = `${(actionWidth - 8) + extra}px`;
      } else {
        primaryBlock.style.width = `${actionWidth - 8}px`;
      }
    }
  };

  const collapseAndRemove = (actionId: string) => {
    isCommitted = true;
    surface.style.transition = 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)';
    surface.style.transform = `translate3d(-${rowElement.offsetWidth + 20}px, 0, 0)`;

    setTimeout(() => {
      rowElement.style.transition = `height ${collapseMs}ms cubic-bezier(0.23, 1, 0.32, 1), margin ${collapseMs}ms cubic-bezier(0.23, 1, 0.32, 1), opacity ${collapseMs}ms ease`;
      rowElement.style.height = '0px';
      rowElement.style.marginBottom = '0px';
      rowElement.style.opacity = '0';
      rowElement.style.pointerEvents = 'none';

      setTimeout(() => {
        callbacks.onCommit?.(actionId, rowId);
      }, collapseMs);
    }, 150);
  };

  const onPointerDown = (e: PointerEvent) => {
    if (isCommitted || (e.button !== 0 && e.pointerType === 'mouse')) return;
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    isHorizontal = false;
    surface.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging || isCommitted) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!isHorizontal) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        isHorizontal = true;
      } else if (Math.abs(dy) > 8) {
        // Vertical scroll taking over
        isDragging = false;
        return;
      }
    }

    if (isHorizontal) {
      e.preventDefault();
      // Moving left is negative dx
      let targetX = currentX + dx;
      if (targetX > 0) {
        // Rubber-band forward drag
        targetX = rubber(targetX, 100, 0.3);
      } else if (Math.abs(targetX) > totalDrawerWidth) {
        // Full swipe territory
        const over = Math.abs(targetX) - totalDrawerWidth;
        targetX = -(totalDrawerWidth + rubber(over, rowElement.offsetWidth, 0.7));
      }
      applyOffset(targetX, false);
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging || isCommitted) return;
    isDragging = false;
    try {
      surface.releasePointerCapture(e.pointerId);
    } catch {}

    const dx = e.clientX - startX;
    const finalOffset = currentX + dx;
    const thresholdCommit = rowElement.offsetWidth * 0.58;

    // Check for full swipe commit (Delete)
    if (finalOffset < -thresholdCommit) {
      if (navigator.vibrate) navigator.vibrate(12);
      collapseAndRemove('delete');
      return;
    }

    // Check if opened past half drawer
    if (finalOffset < -actionWidth * 0.8) {
      // Snap open to reveal actions
      currentX = -totalDrawerWidth;
      applyOffset(currentX, true);
    } else {
      // Snap closed
      currentX = 0;
      applyOffset(0, true);
    }
  };

  surface.addEventListener('pointerdown', onPointerDown);
  surface.addEventListener('pointermove', onPointerMove);
  surface.addEventListener('pointerup', onPointerUp);
  surface.addEventListener('pointercancel', onPointerUp);

  // Wire action buttons inside the drawer
  const actionBtns = rowElement.querySelectorAll<HTMLButtonElement>('.swipe-action-btn');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const actionId = btn.getAttribute('data-action-id') || '';
      if (actionId === 'delete') {
        collapseAndRemove(actionId);
      } else {
        callbacks.onAction?.(actionId, rowId);
        // Snap closed smoothly after action
        currentX = 0;
        applyOffset(0, true);
      }
    });
  });

  return () => {
    surface.removeEventListener('pointerdown', onPointerDown);
    surface.removeEventListener('pointermove', onPointerMove);
    surface.removeEventListener('pointerup', onPointerUp);
    surface.removeEventListener('pointercancel', onPointerUp);
  };
}

// Helper to initialize all SwipeRows in a container
export function initAllSwipeRows(
  container: HTMLElement | Document = document,
  callbacks: SwipeRowCallbacks = {}
): () => void {
  const rows = container.querySelectorAll<HTMLElement>('.swipe-row-root');
  const cleanups: Array<() => void> = [];

  rows.forEach(row => {
    cleanups.push(initSwipeRow(row, callbacks));
  });

  return () => {
    cleanups.forEach(c => c());
  };
}
