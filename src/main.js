/**
 * PathShare - Phase 1
 * Main Entry Point
 * 
 * Simple initialization:
 * 1. Create Vue app
 * 2. Register router
 * 3. Register PWA (if supported)
 * 4. Mount app
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './store'
import { initStore } from './store/storyStore'
// ============================================================================
// CREATE VUE APP
// ============================================================================
 
const app = createApp(App)
 
// Use Pinia first
app.use(pinia)
 
// Use router
app.use(router)
 
// ============================================================================
// LOAD GOOGLE SIGN-IN SDK
// ============================================================================
 
function loadGoogleSDK() {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log('[Boot] Google SDK loaded')
 
      // Initialize Google Sign-In
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      if (!clientId) {
        console.warn('[Boot] VITE_GOOGLE_CLIENT_ID not set in .env.local')
        resolve()
        return
      }
 
      window.google?.accounts?.id?.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false
      })
 
      console.log('[Boot] ✅ Google Sign-In initialized')
      resolve()
    }
    script.onerror = () => {
      console.warn('[Boot] Failed to load Google SDK')
      resolve()
    }
    document.head.appendChild(script)
  })
}
 
/**
 * Callback untuk Google Sign-In response
 */
function handleCredentialResponse(response) {
  console.log('[Boot] Google response received')
  console.log('[Boot] Token:', response.credential?.substring(0, 20) + '...')
 
  // Store akan handle token processing
  // (Handle di LoginView component)
}

// ============================================================================
// INITIALIZE STORE
// ============================================================================
 
initStore()
  .then(() => {
    console.log('[Boot] Store initialized')
  })
  .catch((error) => {
    console.error('[Boot] Failed to initialize store:', error)
  })

// ============================================================================
// 2. REGISTER SERVICE WORKER (PWA)
// ============================================================================

// Simple SW registration for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('[PWA] Service Worker registered:', registration)
      })
      .catch(err => {
        console.warn('[PWA] Service Worker registration failed:', err)
      })
  })
}

// ============================================================================
// 3. MOUNT APP
// ============================================================================

app.mount('#app')

console.log('[Boot] PathShare Phase 1 initialized')