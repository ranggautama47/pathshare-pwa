import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Auth Store
 * Manage authentication state (Google Sign-In)
 */
export const useAuthStore = defineStore('auth', () => {
  // ============================================================================
  // STATE
  // ============================================================================

  const user = ref(null)
  const googleToken = ref(null)
  const isAuthenticated = computed(() => !!user.value && !!googleToken.value)

  // ============================================================================
  // ACTIONS
  // ============================================================================

  /**
   * Set user after successful login
   */
  function setUser(userData) {
    console.log('[AuthStore] Setting user:', userData.name)
    user.value = {
      id: userData.id || 'user-' + Date.now(),
      name: userData.name || 'User',
      email: userData.email || '',
      picture: userData.picture || null
    }
    saveToStorage()
  }

  /**
   * Set Google token
   */
  function setGoogleToken(token) {
    console.log('[AuthStore] Setting Google token')
    googleToken.value = token
    saveToStorage()
  }

  /**
   * Logout
   */
  function logout() {
    console.log('[AuthStore] Logging out...')
    user.value = null
    googleToken.value = null
    localStorage.removeItem('pathshare_auth')

    // Revoke Google token jika ada
    if (window.google?.accounts) {
      window.google.accounts.id.disableAutoSelect()
    }

    console.log('[AuthStore] ✅ Logged out')
  }

  /**
   * Load auth dari localStorage
   */
  function loadUserFromStorage() {
    try {
      const stored = localStorage.getItem('pathshare_auth')
      if (stored) {
        const { user: storedUser, googleToken: storedToken } = JSON.parse(stored)
        user.value = storedUser
        googleToken.value = storedToken
        console.log('[AuthStore] ✅ Auth loaded from storage')
        return true
      }
    } catch (error) {
      console.error('[AuthStore] Error loading from storage:', error)
    }
    return false
  }

  /**
   * Save auth ke localStorage
   */
  function saveToStorage() {
    try {
      localStorage.setItem(
        'pathshare_auth',
        JSON.stringify({
          user: user.value,
          googleToken: googleToken.value
        })
      )
      console.log('[AuthStore] ✅ Auth saved to storage')
    } catch (error) {
      console.error('[AuthStore] Error saving to storage:', error)
    }
  }

  /**
   * Get current user
   */
  function getUser() {
    return user.value
  }

  /**
   * Get Google token
   */
  function getToken() {
    return googleToken.value
  }

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    user,
    googleToken,
    isAuthenticated,

    // Actions
    setUser,
    setGoogleToken,
    logout,
    loadUserFromStorage,
    saveToStorage,
    getUser,
    getToken
  }
})