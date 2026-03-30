export async function openAdoptionDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('adoption-db', 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('zones')) {
        const store = db.createObjectStore('zones', { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
      }
    };
    request.onsuccess = (e: any) => resolve(e.target.result);
    request.onerror = (e: any) => reject(e.target.error);
  });
}

// Simple hash for bbox string to use as ID
function bboxToId(bbox: any) {
  return JSON.stringify(bbox).replace(/[^a-zA-Z0-9]/g, '');
}

export async function adoptZone(bbox: any, userId: string, zoneName: string) {
  const db = await openAdoptionDB();
  const tx = db.transaction('zones', 'readwrite');
  const store = tx.objectStore('zones');
  
  const zone = {
    id: bboxToId(bbox),
    bbox,
    userId,
    zoneName,
    adoptedAt: Date.now(),
    history: []
  };
  
  store.put(zone);
  return new Promise(res => tx.oncomplete = res);
}

export async function getAdoptedZones() {
  const db = await openAdoptionDB();
  const tx = db.transaction('zones', 'readonly');
  const store = tx.objectStore('zones');
  return new Promise<any[]>((resolve) => {
    const request = store.getAll();
    request.onsuccess = (e: any) => resolve(e.target.result || []);
  });
}

export async function isAdopted(bbox: any) {
  const db = await openAdoptionDB();
  const tx = db.transaction('zones', 'readonly');
  const store = tx.objectStore('zones');
  return new Promise<boolean>((resolve) => {
    const request = store.get(bboxToId(bbox));
    request.onsuccess = (e: any) => resolve(!!e.target.result);
  });
}

export async function getMyZones(userId: string) {
  const db = await openAdoptionDB();
  const tx = db.transaction('zones', 'readonly');
  const store = tx.objectStore('zones');
  const index = store.index('userId');
  return new Promise<any[]>((resolve) => {
    const request = index.getAll(userId);
    request.onsuccess = (e: any) => resolve(e.target.result || []);
  });
}
