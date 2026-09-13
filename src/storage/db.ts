const DB_NAME = 'notes-db';
const DB_VERSION = 2;
export const STORE_NAME = 'notes';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('tags', 'tags', { multiEntry: true });
        return;
      }

      const store = request.transaction!.objectStore(STORE_NAME);
      if (!store.indexNames.contains('tags')) {
        store.createIndex('tags', 'tags', { multiEntry: true });
      }

      // Notes created before Story 2 do not have tags. Normalize them during
      // the v2 upgrade so every Note returned to the UI has the current shape.
      const cursorRequest = store.openCursor();
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result;
        if (!cursor) return;

        const note = cursor.value;
        if (!Array.isArray(note.tags)) {
          cursor.update({ ...note, tags: [] });
        }
        cursor.continue();
      };
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = openDb();
  }
  return dbPromise;
}

/**
 * Test-only: closes the current connection (if any) and clears the cache,
 * so the next getDb() opens a fresh one. Must close the real connection —
 * otherwise a subsequent deleteDatabase() call blocks forever.
 */
export async function resetDbConnectionForTests(): Promise<void> {
  const previousDbPromise = dbPromise;
  dbPromise = null;

  if (previousDbPromise) {
    const db = await previousDbPromise;
    db.close();
  }
}
