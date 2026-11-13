import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Single composable the application uses for authentication.
 *
 * Wraps the Pinia store so components never talk to drivers directly and
 * never duplicate authentication state.
 *
 *   const { user, isAuthenticated, login, logout } = useAuth()
 */
export function useAuth() {
  const store = useAuthStore()
  const { enabled, driver, config, user, isAuthenticated, isLoading, initialized, error, hasUser } =
    storeToRefs(store)

  const isAuthEnabled = computed(() => enabled.value)

  return {
    // state
    enabled,
    driver,
    config,
    user,
    isAuthenticated,
    hasUser,
    isLoading,
    initialized,
    error,
    isAuthEnabled,
    // actions
    initializeAuth: store.initializeAuth,
    refreshAuth: store.refreshAuth,
    fetchUser: store.fetchUser,
    login: store.login,
    logout: store.logout,
    forgotPassword: store.forgotPassword,
    resetPassword: store.resetPassword,
    switchDriver: store.switchDriver,
    clearAuth: store.clearAuth,
    setError: store.setError,
  }
}
