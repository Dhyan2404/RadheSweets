// Radhe Sweets - High-Performance Rolling Number Counter & Financial Ticker
// Buttery-smooth 60fps/120fps hardware-accelerated number animator
// Features: requestAnimationFrame ease-out easing, Indian locale formatting (en-IN), 
// zero DOM bloat, zero layout thrashing, resilient to rapid branch switching & tab changes.

export interface CounterProps {
  value: number | string;
  fontSize?: number | string;
  padding?: number;
  places?: Array<number | string>;
  gap?: number;
  borderRadius?: number;
  horizontalPadding?: number;
  textColor?: string;
  fontWeight?: number | string;
  digitPlaceHolders?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
  containerStyle?: string;
  counterStyle?: string;
  digitStyle?: string;
  gradientHeight?: number;
  gradientFrom?: string;
  gradientTo?: string;
  topGradientStyle?: string;
  bottomGradientStyle?: string;
  id?: string;
  duration?: number;
}

/**
 * Parses numeric value from raw number or string (e.g. "₹42,850", "126 kg", 42850)
 */
function parseRawNumber(val: number | string): { num: number; decimals: number } {
  if (typeof val === 'number') {
    const decStr = val.toString().split('.')[1];
    return { num: val, decimals: decStr ? decStr.length : 0 };
  }
  const cleanStr = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleanStr) || 0;
  const decStr = cleanStr.split('.')[1];
  return { num, decimals: decStr ? decStr.length : 0 };
}

/**
 * Format number into Indian numbering system (e.g. 1,42,850)
 */
export function formatIndianNumber(val: number, decimals: number = 0): string {
  if (isNaN(val)) return '0';
  if (decimals > 0) {
    return val.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
  return Math.round(val).toLocaleString('en-IN');
}

/**
 * Render rolling number counter HTML
 * Generates an ultra-clean semantic container with data attributes for animation
 */
export function renderCounter(props: CounterProps): string {
  const {
    value,
    fontSize,
    textColor = 'inherit',
    fontWeight = 'inherit',
    prefix = '',
    suffix = '',
    className = '',
    containerStyle = '',
    counterStyle = '',
    id
  } = props;

  const { num, decimals } = parseRawNumber(value);
  const formattedInitial = formatIndianNumber(num, decimals);
  const fontSizeStyle = fontSize 
    ? (typeof fontSize === 'number' ? `${fontSize}px` : fontSize) 
    : 'inherit';

  return `
    <span 
      ${id ? `id="${id}"` : ''} 
      class="counter-root inline-flex items-baseline font-bold tabular-nums select-none ${className}"
      data-counter-target="${num}"
      data-counter-current="${num}"
      data-decimals="${decimals}"
      style="
        color: ${textColor}; 
        font-weight: ${fontWeight}; 
        font-size: ${fontSizeStyle};
        line-height: 1;
        ${containerStyle};
        ${counterStyle}
      "
    >
      ${prefix ? `<span class="counter-prefix mr-0.5 font-semibold text-[0.85em] opacity-85 select-none">${prefix}</span>` : ''}
      <span class="counter-value font-extrabold tracking-tight">${formattedInitial}</span>
      ${suffix ? `<span class="counter-suffix ml-0.5 font-semibold text-[0.85em] opacity-85 select-none">${suffix}</span>` : ''}
    </span>
  `;
}

// Ease Out Expo Curve: Fast dynamic start with ultra-smooth organic deceleration
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

// Track active animations for cleanup
const activeAnimationMap = new WeakMap<HTMLElement, number>();

/**
 * Animate a specific counter element from start to target value
 */
export function animateCounterElement(
  el: HTMLElement, 
  targetVal: number, 
  durationMs: number = 750, 
  startVal: number = 0
): void {
  const valSpan = el.querySelector('.counter-value') as HTMLElement | null;
  if (!valSpan) return;

  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

  // Cancel any existing running frame for this element
  const existingFrame = activeAnimationMap.get(el);
  if (existingFrame) {
    cancelAnimationFrame(existingFrame);
    activeAnimationMap.delete(el);
  }

  // If start equals target or reduced motion requested, set immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || durationMs <= 0 || startVal === targetVal) {
    valSpan.textContent = formatIndianNumber(targetVal, decimals);
    el.setAttribute('data-counter-current', String(targetVal));
    return;
  }

  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const rawProgress = Math.min(elapsed / durationMs, 1);
    const easedProgress = easeOutExpo(rawProgress);

    const currentVal = startVal + (targetVal - startVal) * easedProgress;
    valSpan!.textContent = formatIndianNumber(currentVal, decimals);

    if (rawProgress < 1) {
      const frameId = requestAnimationFrame(step);
      activeAnimationMap.set(el, frameId);
    } else {
      valSpan!.textContent = formatIndianNumber(targetVal, decimals);
      el.setAttribute('data-counter-current', String(targetVal));
      activeAnimationMap.delete(el);
    }
  }

  const initialFrame = requestAnimationFrame(step);
  activeAnimationMap.set(el, initialFrame);
}

/**
 * Initializes and triggers smooth count-up animations for all counters in the DOM
 */
export function initAllCounters(root: Document | HTMLElement = document): void {
  const counterElements = root.querySelectorAll('.counter-root[data-counter-target]');

  counterElements.forEach((el, idx) => {
    const htmlEl = el as HTMLElement;
    const target = parseFloat(htmlEl.getAttribute('data-counter-target') || '0');
    const isAnimated = htmlEl.getAttribute('data-animated') === 'true';
    const currentVal = parseFloat(htmlEl.getAttribute('data-counter-current') || '0');

    // Skip if already at target and marked as animated to avoid re-animation stutter
    if (isAnimated && currentVal === target) {
      return;
    }

    htmlEl.setAttribute('data-animated', 'true');

    // Stagger slightly for natural premium feel across multiple KPI cards
    const delay = Math.min(idx * 20, 80);
    const duration = 550 + Math.min(idx * 25, 150);

    const start = isAnimated ? currentVal : 0;
    if (delay > 0) {
      setTimeout(() => {
        animateCounterElement(htmlEl, target, duration, start);
      }, delay);
    } else {
      animateCounterElement(htmlEl, target, duration, start);
    }
  });
}

/**
 * Smoothly rolls an existing counter element to a new value
 */
export function updateCounter(counterEl: HTMLElement, newValue: number | string): void {
  if (!counterEl) return;
  const { num, decimals } = parseRawNumber(newValue);
  const currentVal = parseFloat(counterEl.getAttribute('data-counter-current') || '0');
  
  counterEl.setAttribute('data-counter-target', String(num));
  counterEl.setAttribute('data-decimals', String(decimals));

  animateCounterElement(counterEl, num, 600, currentVal);
}

export const Counter = renderCounter;
export default renderCounter;
