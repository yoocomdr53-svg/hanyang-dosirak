import { MenuItem, DailyNoticeState, StoreStatusState } from '../types';

const DB_NAME = 'hanyang_dosirak_db_v2';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';

/**
 * Open or upgrade IndexedDB database for permanent storage.
 * IndexedDB has ample capacity (hundreds of megabytes) allowing
 * full custom menus, uploaded high-resolution photos, and categories
 * without hitting browser 5MB localStorage quota limits.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Save arbitrary data to IndexedDB
 */
export async function saveToDB<T>(key: string, value: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn(`[IndexedDB Save Error: ${key}]`, err);
  }
}

/**
 * Load data from IndexedDB
 */
export async function loadFromDB<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        resolve((req.result as T) ?? null);
      };
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn(`[IndexedDB Load Error: ${key}]`, err);
    return null;
  }
}

/**
 * Export all current state to a downloadable JSON file
 */
export function exportAppStateJSON(data: {
  menus: MenuItem[];
  notice: DailyNoticeState;
  storeStatus: StoreStatusState;
  categories: string[];
}): void {
  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    ...data,
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `hanyang-dosirak-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse imported JSON backup file
 */
export function parseAppStateJSON(jsonStr: string): {
  menus?: MenuItem[];
  notice?: DailyNoticeState;
  storeStatus?: StoreStatusState;
  categories?: string[];
} | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && typeof parsed === 'object') {
      return {
        menus: Array.isArray(parsed.menus) ? parsed.menus : undefined,
        notice: parsed.notice && typeof parsed.notice === 'object' ? parsed.notice : undefined,
        storeStatus: parsed.storeStatus && typeof parsed.storeStatus === 'object' ? parsed.storeStatus : undefined,
        categories: Array.isArray(parsed.categories) ? parsed.categories : undefined,
      };
    }
  } catch (e) {
    console.error('Backup parse failed', e);
  }
  return null;
}
