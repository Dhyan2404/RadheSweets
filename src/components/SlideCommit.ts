// Radhe Sweets - Interactive SlideCommit Slider Component
// High-performance hardware-accelerated slide-to-confirm controller
// Matches Radhe Sweets dark roasted chocolate brand aesthetics & emerald green checkout completion

export interface SlideCommitConfig {
  id?: string;
  label?: string;
  doneLabel?: string;
  errorLabel?: string;
  trackColor?: string;
  handleColor?: string;
  successColor?: string;
  dangerColor?: string;
  height?: number;
  radius?: number;
  totalPayable?: number;
  disabled?: boolean;
}

export function renderSlideCommit(config: SlideCommitConfig = {}): string {
  const {
    id = 'checkout-slider',
    label = 'Slide to checkout',
    doneLabel = 'Checked Out',
    errorLabel = 'Payment failed',
    // Chocolate brand palette
    trackColor = '#241816', // Deep dark roasted chocolate
    handleColor = '#C86D3B', // Warm signature terracotta amber
    successColor = '#16a34a', // Vibrant green for checked out
    dangerColor = '#e5484d',
    height = 56,
    radius = 28,
    totalPayable,
    disabled = false
  } = config;

  const displayLabel = totalPayable ? `${label} • ₹${totalPayable.toLocaleString()}` : label;

  return `
    <div 
      id="${id}-root" 
      class="slide-commit-root relative w-full select-none touch-none overflow-hidden ${disabled ? 'opacity-50 pointer-events-none' : ''}" 
      style="
        height: ${height}px; 
        border-radius: ${radius}px; 
        background: ${trackColor}; 
        box-shadow: inset 0 2px 6px rgba(0,0,0,0.35), 0 2px 8px rgba(36,24,22,0.15);
        border: 1px solid rgba(200, 109, 59, 0.25);
      "
      data-state="idle"
      data-disabled="${disabled ? 'true' : 'false'}"
    >
      <!-- Center Shimmering Guide Track Label -->
      <div 
        id="${id}-label" 
        class="absolute inset-0 flex items-center justify-center pointer-events-none text-xs sm:text-sm font-bold tracking-wide transition-opacity duration-200"
        style="color: rgba(250, 247, 242, 0.85); padding-left: ${height - 8}px; padding-right: 16px;"
      >
        <span class="truncate flex items-center gap-1.5 animate-pulse">
          <span>${displayLabel}</span>
          <svg class="w-4 h-4 text-[#DDA15E] inline-block opacity-80" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </div>

      <!-- Error Label (Hidden initially) -->
      <div 
        id="${id}-error-label" 
        class="absolute inset-0 hidden items-center justify-center pointer-events-none text-xs sm:text-sm font-bold text-white tracking-wide z-10"
        style="background: ${dangerColor};"
      >
        <span>⚠️ ${errorLabel}</span>
      </div>

      <!-- Success Done Pill (Fills track on complete) -->
      <div 
        id="${id}-done-overlay" 
        class="absolute inset-0 flex items-center justify-center pointer-events-none text-xs sm:text-sm font-black text-white tracking-wide opacity-0 transition-all duration-300 z-20 scale-95"
        style="background: linear-gradient(135deg, ${successColor}, #22c55e); border-radius: ${radius}px;"
      >
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>${doneLabel}</span>
        </div>
      </div>

      <!-- Drag Handle (Thumb Capsule) -->
      <div 
        id="${id}-handle" 
        class="absolute top-1 left-1 bottom-1 flex items-center justify-center cursor-grab active:cursor-grabbing text-white font-bold shadow-md transition-transform duration-75 z-10"
        style="
          width: ${height - 8}px; 
          height: ${height - 8}px; 
          border-radius: ${radius - 4}px; 
          background: linear-gradient(135deg, ${handleColor}, #B25D2E); 
          box-shadow: 0 4px 14px rgba(200, 109, 59, 0.45), inset 0 1px 1px rgba(255,255,255,0.4);
        "
      >
        <!-- Arrow Icon -->
        <div id="${id}-handle-arrow" class="transition-transform duration-150">
          <svg class="w-5 h-5 drop-shadow-xs" fill="none" stroke="currentColor" stroke-width="2.6" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>

        <!-- Spinner Icon (Hidden initially) -->
        <div id="${id}-handle-spinner" class="hidden animate-spin">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.6" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.4" stroke-opacity="0.25" />
            <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
          </svg>
        </div>
      </div>
    </div>
  `;
}

export function initSlideCommit(
  sliderId: string = 'checkout-slider',
  callbacks: {
    onConfirm: () => Promise<any> | void;
    onDone?: () => void;
    onError?: (err: any) => void;
  }
) {
  const root = document.getElementById(`${sliderId}-root`);
  const handle = document.getElementById(`${sliderId}-handle`);
  const label = document.getElementById(`${sliderId}-label`);
  const doneOverlay = document.getElementById(`${sliderId}-done-overlay`);
  const errorLabel = document.getElementById(`${sliderId}-error-label`);
  const arrow = document.getElementById(`${sliderId}-handle-arrow`);
  const spinner = document.getElementById(`${sliderId}-handle-spinner`);

  if (!root || !handle) return null;

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let maxTravel = 0;
  let isCommitted = false;

  const getTravel = () => {
    const rootWidth = root.clientWidth;
    const handleWidth = handle.clientWidth;
    return Math.max(1, rootWidth - handleWidth - 8); // 4px padding each side
  };

  const updatePosition = (x: number) => {
    currentX = Math.max(0, Math.min(x, maxTravel));
    handle.style.transform = `translate3d(${currentX}px, 0, 0)`;
    
    // Fade out guide label as handle slides
    if (label) {
      const progress = currentX / maxTravel;
      label.style.opacity = String(Math.max(0, 1 - progress * 1.8));
    }
  };

  const returnHome = (bounce: boolean = true) => {
    handle.style.transition = bounce ? 'transform 0.42s cubic-bezier(0.23, 1, 0.32, 1)' : 'transform 0.2s ease-out';
    updatePosition(0);
    setTimeout(() => {
      handle.style.transition = 'transform 0.05s ease-out';
    }, 450);
  };

  const executeCommit = async () => {
    if (isCommitted) return;
    isCommitted = true;
    root.setAttribute('data-state', 'pending');

    // Show spinner inside handle
    if (arrow) arrow.classList.add('hidden');
    if (spinner) spinner.classList.remove('hidden');

    try {
      const outcome = callbacks.onConfirm();
      if (outcome && typeof (outcome as any).then === 'function') {
        await outcome;
      }

      // Success transition
      root.setAttribute('data-state', 'done');
      if (doneOverlay) {
        doneOverlay.style.opacity = '1';
        doneOverlay.style.transform = 'scale(1)';
      }
      if (spinner) spinner.classList.add('hidden');

      // Haptic confirmation if supported on mobile
      try {
        if ('vibrate' in navigator) navigator.vibrate([20, 30, 20]);
      } catch (e) {}

      if (callbacks.onDone) {
        setTimeout(() => {
          callbacks.onDone?.();
        }, 300);
      }
    } catch (err) {
      root.setAttribute('data-state', 'error');
      if (errorLabel) errorLabel.classList.remove('hidden');
      if (arrow) arrow.classList.remove('hidden');
      if (spinner) spinner.classList.add('hidden');

      if (callbacks.onError) callbacks.onError(err);

      // Shake animation on error
      root.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-6px)' },
        { transform: 'translateX(6px)' },
        { transform: 'translateX(0)' }
      ], { duration: 400, easing: 'ease-out' });

      setTimeout(() => {
        if (errorLabel) errorLabel.classList.add('hidden');
        root.setAttribute('data-state', 'idle');
        isCommitted = false;
        returnHome(true);
      }, 1500);
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    if (isCommitted || root.getAttribute('data-disabled') === 'true' || e.button !== 0) return;
    isDragging = true;
    maxTravel = getTravel();
    startX = e.clientX - currentX;
    handle.style.transition = 'none';

    try {
      root.setPointerCapture(e.pointerId);
    } catch (err) {}

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    const nextX = e.clientX - startX;
    updatePosition(nextX);
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isDragging) return;
    isDragging = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);

    try {
      root.releasePointerCapture(e.pointerId);
    } catch (err) {}

    maxTravel = getTravel();
    if (currentX >= maxTravel * 0.88) {
      // Reached commit threshold!
      updatePosition(maxTravel);
      executeCommit();
    } else {
      // User let go before end -> spring back with bounce
      returnHome(true);
    }
  };

  handle.addEventListener('pointerdown', onPointerDown);

  // Keyboard accessibility
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e: KeyboardEvent) => {
    if (isCommitted || root.getAttribute('data-disabled') === 'true') return;
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      maxTravel = getTravel();
      handle.style.transition = 'transform 0.28s cubic-bezier(0.23, 1, 0.32, 1)';
      updatePosition(maxTravel);
      setTimeout(executeCommit, 290);
    }
  });

  return {
    reset: () => {
      isCommitted = false;
      root.setAttribute('data-state', 'idle');
      if (doneOverlay) {
        doneOverlay.style.opacity = '0';
        doneOverlay.style.transform = 'scale(0.95)';
      }
      if (errorLabel) errorLabel.classList.add('hidden');
      if (arrow) arrow.classList.remove('hidden');
      if (spinner) spinner.classList.add('hidden');
      returnHome(false);
    }
  };
}
