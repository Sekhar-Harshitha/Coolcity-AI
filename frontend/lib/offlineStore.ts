import { openDB as idbOpenDB, IDBPDatabase } from 'idb';

let _db: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (_db) return _db;
  _db = idbOpenDB('coolcity-ai-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('analyses')) {
        db.createObjectStore('analyses');
      }
      if (!db.objectStoreNames.contains('simulations')) {
        db.createObjectStore('simulations');
      }
    },
  });
  return _db;
}

export async function saveAnalysis(bbox: string, result: any) {
  const db = await getDB();
  await db.put('analyses', { ...result, timestamp: Date.now() }, bbox);
}

export async function getAnalysis(bbox: string) {
  const db = await getDB();
  return db.get('analyses', bbox);
}

export async function getRecentAnalyses(limit: number = 5) {
  const db = await getDB();
  const tx = db.transaction('analyses', 'readonly');
  const store = tx.objectStore('analyses');

  const results: any[] = [];
  let cursor = await store.openCursor(null, 'prev');

  while (cursor && results.length < limit) {
    results.push({
      bbox_str: cursor.key as string,
      ...cursor.value,
    });
    cursor = await cursor.continue();
  }

  return results;
}

export async function saveSimulation(key: string, result: any) {
  const db = await getDB();
  await db.put('simulations', { ...result, timestamp: Date.now() }, key);
}

export async function getSimulation(key: string) {
  const db = await getDB();
  return db.get('simulations', key);
}

export async function clearOldEntries(maxAgeDays: number = 7) {
  const db = await getDB();
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;

  const processStore = async (storeName: 'analyses' | 'simulations') => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    let cursor = await store.openCursor();
    while (cursor) {
      if (cursor.value.timestamp < cutoff) {
        await cursor.delete();
      }
      cursor = await cursor.continue();
    }
    await tx.done;
  };

  await Promise.all([processStore('analyses'), processStore('simulations')]);
}
