/**
 * IndexedDB Service - Offline Cache Storage
 * 
 * Database: pathshare-db
 * Object Store: stories
 * 
 * Functions:
 * - saveStories(stories) - Simpan array stories
 * - getStories() - Ambil semua stories dari cache
 * - getStoryById(id) - Ambil single story
 * - clearStories() - Hapus semua cache
 */

const DB_NAME = 'pathshare-db'
const DB_VERSION = 1
const STORE_NAME = 'stories'

let db = null

/**
 * Initialize IndexedDB connection
 * Dipanggil sekali di app startup (atau lazy load)
 * @returns {Promise<IDBDatabase>}
 */
export async function initDB() {
  return new Promise((resolve, reject) => {
    // Jika sudah initialized, return langsung
    if (db) {
      resolve(db)
      return
    }

    console.log('[DB] Initializing IndexedDB...')

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    // Handle upgrade (create object store jika belum ada)
    request.onupgradeneeded = (event) => {
      const database = event.target.result

      // Create object store jika belum ada
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, {
          keyPath: 'id'
        })

        // Create index untuk query by userId
        

        console.log(`[DB] ✅ Object store '${STORE_NAME}' created`)
      }
    }

    // Handle success
    request.onsuccess = (event) => {
      db = event.target.result
      console.log('[DB] ✅ Database initialized')
      resolve(db)
    }

    // Handle error
    request.onerror = (event) => {
      const error = event.target.error
      console.error('[DB] ❌ Failed to initialize:', error)
      reject(error)
    }
  })
}

/**
 * Save stories ke IndexedDB
 * @param {Array} stories - Array of story objects
 * @returns {Promise<void>}
 */
export async function saveStories(stories) {
  try {
    // Ensure DB is initialized
    if (!db) {
      await initDB()
    }

    console.log(`[DB] Saving ${stories.length} stories...`)

    // Clear existing data
    await clearStories()

    // Open transaction
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    // Add each story
    for (const story of stories) {
      await new Promise((resolve, reject) => {
        const request = store.put(story)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    }

    console.log(`[DB] ✅ Saved ${stories.length} stories`)
  } catch (error) {
    console.error('[DB] ❌ Failed to save stories:', error)
    throw error
  }
}

/**
 * Get all stories dari IndexedDB
 * @returns {Promise<Array>} Array of stories
 */
export async function getStories() {
  try {
    // Ensure DB is initialized
    if (!db) {
      await initDB()
    }

    return new Promise((resolve, reject) => {
      console.log('[DB] Fetching stories from cache...')

      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = (event) => {
        const stories = event.target.result
        console.log(`[DB] ✅ Retrieved ${stories.length} stories from cache`)
        resolve(stories)
      }

      request.onerror = (event) => {
        const error = event.target.error
        console.error('[DB] ❌ Failed to fetch stories:', error)
        reject(error)
      }
    })
  } catch (error) {
    console.error('[DB] ❌ Error in getStories:', error)
    throw error
  }
}

/**
 * Get single story dari IndexedDB
 * @param {string} id - Story ID
 * @returns {Promise<Object|null>} Story object atau null jika tidak ada
 */
export async function getStoryById(id) {
  try {
    // Ensure DB is initialized
    if (!db) {
      await initDB()
    }

    return new Promise((resolve, reject) => {
      console.log(`[DB] Fetching story ${id} from cache...`)

      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = (event) => {
        const story = event.target.result
        if (story) {
          console.log(`[DB] ✅ Retrieved story: ${story.title}`)
        } else {
          console.warn(`[DB] ⚠️  Story ${id} not found in cache`)
        }
        resolve(story || null)
      }

      request.onerror = (event) => {
        const error = event.target.error
        console.error(`[DB] ❌ Failed to fetch story ${id}:`, error)
        reject(error)
      }
    })
  } catch (error) {
    console.error('[DB] ❌ Error in getStoryById:', error)
    throw error
  }
}

/**
 * Clear all stories dari IndexedDB
 * @returns {Promise<void>}
 */
export async function clearStories() {
  try {
    // Ensure DB is initialized
    if (!db) {
      await initDB()
    }

    return new Promise((resolve, reject) => {
      console.log('[DB] Clearing stories cache...')

      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => {
        console.log('[DB] ✅ Cache cleared')
        resolve()
      }

      request.onerror = (event) => {
        const error = event.target.error
        console.error('[DB] ❌ Failed to clear cache:', error)
        reject(error)
      }
    })
  } catch (error) {
    console.error('[DB] ❌ Error in clearStories:', error)
    throw error
  }
}

/**
 * Check if IndexedDB has any stories (untuk detect empty cache)
 * @returns {Promise<boolean>}
 */
export async function hasCachedStories() {
  try {
    // Ensure DB is initialized
    if (!db) {
      await initDB()
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.count()

      request.onsuccess = (event) => {
        const count = event.target.result
        resolve(count > 0)
      }

      request.onerror = (event) => {
        reject(event.target.error)
      }
    })
  } catch (error) {
    console.error('[DB] ❌ Error in hasCachedStories:', error)
    return false
  }
}