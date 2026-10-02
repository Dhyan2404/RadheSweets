// Offline-First Queue & Cloud Auto-Sync Engine for Radhe Sweets
// Ensures 100% uninterrupted POS counter billing when internet drops,
// with persistent outbox and automatic background sync to Cloud Firestore.

const QUEUE_KEY = 'radhe_offline_orders_queue';

export interface OfflineOrderEntry {
  id: string;
  order: any;
  branchId: string;
  timestamp: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed';
  error?: string;
}

/**
 * Get all queued offline orders from localStorage
 */
export function getOfflineOrdersQueue(): OfflineOrderEntry[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('[OfflineQueue] Failed to read queue:', e);
    return [];
  }
}

/**
 * Save queue to localStorage
 */
function saveQueue(queue: OfflineOrderEntry[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('[OfflineQueue] Failed to persist queue:', e);
  }
}

/**
 * Add a newly billed order to the offline auto-sync queue
 */
export function enqueueOfflineOrder(order: any, branchId: string): void {
  const queue = getOfflineOrdersQueue();
  // Avoid duplicate queuing
  if (queue.some(item => item.id === order.id)) return;

  queue.push({
    id: order.id,
    order,
    branchId,
    timestamp: new Date().toISOString(),
    retryCount: 0,
    status: 'pending'
  });

  saveQueue(queue);
  dispatchQueueChangeEvent();
}

/**
 * Remove an order from the offline queue after successful sync
 */
export function dequeueOfflineOrder(orderId: string): void {
  const queue = getOfflineOrdersQueue().filter(item => item.id !== orderId);
  saveQueue(queue);
  dispatchQueueChangeEvent();
}

/**
 * Get count of pending offline orders
 */
export function getPendingOfflineOrdersCount(): number {
  return getOfflineOrdersQueue().length;
}

/**
 * Check if the browser currently has active internet connectivity
 */
export function isNetworkOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

/**
 * Dispatch a custom event so UI components can update their sync badges in real-time
 */
function dispatchQueueChangeEvent(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('radhe-offline-queue-changed', {
      detail: { count: getPendingOfflineOrdersCount(), isOnline: isNetworkOnline() }
    }));
  }
}

/**
 * Process and flush all queued offline orders to Cloud Firestore
 */
export async function syncOfflineOrdersQueue(
  saveBranchOrderToCloudFn: (branchId: string, order: any, sweets?: any[], customers?: any[]) => Promise<boolean>,
  currentSweets: any[] = [],
  allCustomers: any[] = []
): Promise<{ synced: number; failed: number; remaining: number }> {
  if (!isNetworkOnline()) {
    return { synced: 0, failed: 0, remaining: getPendingOfflineOrdersCount() };
  }

  const queue = getOfflineOrdersQueue();
  if (queue.length === 0) {
    return { synced: 0, failed: 0, remaining: 0 };
  }

  let syncedCount = 0;
  let failedCount = 0;

  for (const entry of queue) {
    try {
      entry.status = 'syncing';
      const success = await saveBranchOrderToCloudFn(
        entry.branchId,
        entry.order,
        currentSweets,
        allCustomers
      );

      if (success) {
        dequeueOfflineOrder(entry.id);
        syncedCount++;
      } else {
        entry.status = 'failed';
        entry.retryCount = (entry.retryCount || 0) + 1;
        failedCount++;
      }
    } catch (err: any) {
      console.warn(`[OfflineQueue] Sync failed for order #${entry.id}:`, err);
      entry.status = 'failed';
      entry.error = err?.message || 'Network error';
      entry.retryCount = (entry.retryCount || 0) + 1;
      failedCount++;
    }
  }

  // Update remaining queue
  const remaining = getPendingOfflineOrdersCount();
  dispatchQueueChangeEvent();

  return { synced: syncedCount, failed: failedCount, remaining };
}
