/**
 * Story Store - Simple State Management (tanpa Pinia)
 * 
 * Menggunakan Vue 3 reactive API
 * 
 * State:
 * - stories: Array of stories
 * - loading: boolean
 * - error: string | null
 * - lastFetchTime: timestamp
 * 
 * Functions:
 * - loadStories() - Fetch dari API atau fallback ke IndexedDB
 * - getStories() - Get state
 * - getStoryById(id) - Find story by ID
 */

import { reactive, computed } from 'vue'
import { fetchStoriesFromAPI, fetchStoryByIdFromAPI } from '../api/storyApi'
import {
  initDB,
  saveStories,
  getStories as getStoriesFromDB,
  getStoryById as getStoryByIdFromDB
} from '../services/db'

/**
 * Store state object
 */
const state = reactive({
  stories: [],
  loading: false,
  error: null,
  lastFetchTime: null,
  isOnline: navigator.onLine
})

/**
 * Load stories - Main function
 * 1. Try fetch dari API
 * 2. Save ke IndexedDB
 * 3. Fallback ke IndexedDB jika offline/error
 * @returns {Promise<void>}
 */
export async function loadStories() {
  try {
    state.loading = true
    state.error = null

    console.log('[Store] Loading stories...')

    // Step 1: Try fetch dari API
    if (navigator.onLine) {
      try {
        const apiStories = await fetchStoriesFromAPI()

        // Step 2: Save ke IndexedDB
        await saveStories(apiStories)

        // Update state
        state.stories = apiStories
        state.lastFetchTime = new Date()

        console.log('[Store] ✅ Stories loaded from API and cached')
        return
      } catch (apiError) {
        console.warn('[Store] ⚠️  API fetch failed:', apiError.message)
        // Lanjut ke fallback
      }
    } else {
      console.log('[Store] 📡 Currently offline, using cached data')
    }

    // Step 3: Fallback - ambil dari IndexedDB
    console.log('[Store] Fetching from cache...')
    const cachedStories = await getStoriesFromDB()

    if (cachedStories && cachedStories.length > 0) {
      state.stories = cachedStories
      console.log('[Store] ✅ Stories loaded from cache')
    } else {
      // Jika cache kosong dan tidak online
      if (!navigator.onLine) {
        state.error = 'Offline dan tidak ada data cached'
        console.warn('[Store] ❌ No cached data and offline')
      } else {
        state.error = 'Gagal memuat data'
      }
    }
  } catch (error) {
    console.error('[Store] ❌ Error loading stories:', error)
    state.error = error.message || 'Terjadi kesalahan'
  } finally {
    state.loading = false
  }
}

/**
 * Load single story by ID
 * @param {string} id - Story ID
 * @returns {Promise<Object|null>}
 */
export async function loadStoryById(id) {
  try {
    console.log(`[Store] Loading story ${id}...`)

    // Try API first
    if (navigator.onLine) {
      try {
        const story = await fetchStoryByIdFromAPI(id)
        console.log('[Store] ✅ Story loaded from API')
        return story
      } catch (apiError) {
        console.warn('[Store] ⚠️  API fetch failed, trying cache')
      }
    }

    // Fallback ke cache
    const cachedStory = await getStoryByIdFromDB(id)

    if (cachedStory) {
      console.log('[Store] ✅ Story loaded from cache')
      return cachedStory
    } else {
      console.warn(`[Store] ❌ Story ${id} not found`)
      return null
    }
  } catch (error) {
    console.error(`[Store] ❌ Error loading story ${id}:`, error)
    return null
  }
}

/**
 * Initialize DB (called at app startup)
 * @returns {Promise<void>}
 */
export async function initStore() {
  try {
    console.log('[Store] Initializing store...')
    await initDB()
    console.log('[Store] ✅ Store initialized')
  } catch (error) {
    console.error('[Store] ❌ Failed to initialize:', error)
  }
}

/**
 * Get all stories from state
 * @returns {Array}
 */
export function getStories() {
  return state.stories
}

/**
 * Get single story from state
 * @param {string} id
 * @returns {Object|null}
 */
export function getStoryById(id) {
  return state.stories.find(story => story.id === id) || null
}

/**
 * Get state (read-only)
 * @returns {Object}
 */
export function getState() {
  return state
}

/**
 * Computed - for reactive properties
 */
export const storyCount = computed(() => state.stories.length)
export const isLoading = computed(() => state.loading)
export const hasError = computed(() => state.error !== null)
export const errorMessage = computed(() => state.error)

/**
 * Setup online/offline listener
 */
export function setupOnlineListener() {
  window.addEventListener('online', () => {
    console.log('[Store] Back online! Reloading...')
    state.isOnline = true
    loadStories() // Auto reload saat online
  })

  window.addEventListener('offline', () => {
    console.log('[Store] Offline')
    state.isOnline = false
  })
}