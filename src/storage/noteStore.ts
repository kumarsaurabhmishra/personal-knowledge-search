import type { Note } from '../models/note';
import { getDb, STORE_NAME } from './db';

function withStore<T>(
  mode: IDBTransactionMode,
  work: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return getDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        const request = work(store);

        let result: T;
        request.onsuccess = () => {
          result = request.result;
        };
        request.onerror = () => reject(request.error);

        // Resolve only once the whole transaction commits — resolving on
        // request.onsuccess alone can race with an immediate db.close()
        // (e.g. in tests simulating a refresh) before the write is durable.
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      }),
  );
}

export function addNote(note: Note): Promise<void> {
  return withStore('readwrite', (store) => store.add(note)).then(() => undefined);
}

export function getNote(id: string): Promise<Note | undefined> {
  return withStore('readonly', (store) => store.get(id));
}

export function getAllNotes(): Promise<Note[]> {
  return withStore('readonly', (store) => store.getAll());
}

export function putNote(note: Note): Promise<void> {
  return withStore('readwrite', (store) => store.put(note)).then(() => undefined);
}

export function deleteNote(id: string): Promise<void> {
  return withStore('readwrite', (store) => store.delete(id)).then(() => undefined);
}