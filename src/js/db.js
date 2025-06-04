import { openDB } from 'idb';

const DB_NAME = 'story-app-db';
const DB_VERSION = 1;
const STORY_STORE = 'stories';

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore(STORY_STORE, {
        // The 'id' property of the object will be the key.
        keyPath: 'id',
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
      // Create an index on the 'date' property
      store.createIndex('date', 'date');
    },
  });
};

// Save story to IndexedDB
export const saveStory = async (story) => {
  const db = await initDB();
  const tx = db.transaction(STORY_STORE, 'readwrite');
  const store = tx.objectStore(STORY_STORE);
  await store.add({
    ...story,
    date: new Date().toISOString(),
  });
  await tx.done;
};

// Get all stories from IndexedDB
export const getAllStories = async () => {
  const db = await initDB();
  const tx = db.transaction(STORY_STORE, 'readonly');
  const store = tx.objectStore(STORY_STORE);
  return store.getAll();
};

// Delete story from IndexedDB
export const deleteStory = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORY_STORE, 'readwrite');
  const store = tx.objectStore(STORY_STORE);
  await store.delete(id);
  await tx.done;
};

// Get a single story by ID
export const getStoryById = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORY_STORE, 'readonly');
  const store = tx.objectStore(STORY_STORE);
  return store.get(id);
}; 