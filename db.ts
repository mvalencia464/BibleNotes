import { openDB, IDBPDatabase } from 'idb';
import { SermonCollection } from './types';

const DB_NAME = 'stitch-bible-pwa';
const DB_VERSION = 1;
const STORE_NAME = 'translations';
const SERMONS_KEY = 'sermons_spurgeon';

let dbPromise: Promise<IDBPDatabase> | null = null;

const initDB = () => {
    if (dbPromise) return dbPromise;
    
    dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
    return dbPromise;
};

// Key format: `${versionId}-${bookName}` e.g., 'kjv-Genesis'
// Data format: The JSON response from bible-api.com for a full book

export const saveBibleBook = async (versionId: string, versionName: string, bookName: string, data: any) => {
    const db = await initDB();
    const key = `${versionId}-${bookName}`;
    await db.put(STORE_NAME, data, key);

    // Also save metadata about the version
    const metaKey = `meta-${versionId}`;
    await db.put(STORE_NAME, {id: versionId, name: versionName}, metaKey);
};

export const getBibleBook = async (versionId: string, bookName: string) => {
    const db = await initDB();
    const key = `${versionId}-${bookName}`;
    return db.get(STORE_NAME, key);
};

export const getDownloadedVersions = async (): Promise<string[]> => {
    const db = await initDB();
    const allKeys = await db.getAllKeys(STORE_NAME);
    const versionKeys = allKeys.filter(key => typeof key === 'string' && key.startsWith('meta-'));
    
    const versions: string[] = [];
    for (const key of versionKeys) {
        const meta = await db.get(STORE_NAME, key);
        if (meta && meta.id) {
            versions.push(meta.id);
        }
    }
    return versions;
};

export const deleteBibleVersion = async (versionId: string) => {
    const db = await initDB();
    const allKeys = await db.getAllKeys(STORE_NAME);
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const deletePromises: Promise<any>[] = [];

    allKeys.forEach(key => {
        if (typeof key === 'string' && (key.startsWith(`${versionId}-`) || key === `meta-${versionId}`)) {
            deletePromises.push(tx.store.delete(key));
        }
    });

    await Promise.all(deletePromises);
    await tx.done;
};

export const saveSermons = async (data: SermonCollection) => {
    const db = await initDB();
    await db.put(STORE_NAME, data, SERMONS_KEY);
};

export const getSermons = async (): Promise<SermonCollection | undefined> => {
    const db = await initDB();
    return db.get(STORE_NAME, SERMONS_KEY);
};

export const deleteSermons = async () => {
    const db = await initDB();
    await db.delete(STORE_NAME, SERMONS_KEY);
};

export const areSermonsDownloaded = async (): Promise<boolean> => {
    const sermons = await getSermons();
    return !!sermons;
};