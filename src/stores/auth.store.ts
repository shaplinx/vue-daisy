import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import type {
  AuthConfig,
  AuthDriver,
  LoginCredentials,
  ResetPasswordPayload,
  User,
} from '@/auth/auth.types'
import { AuthError } from '@/auth/auth.types'
import { getAuthConfig, getAuthDriver, switchAuthDriver } from '@/auth/auth.provider'
import { toAuthError } from '@/auth/utils'

/**
 * Centralized Pinia authentication store.
 *
 * Owns all authentication state and delegates every operation to the active
 * driver through the auth provider. Components must consume this via
 * `useAuth()` — never talk to drivers directly, and never keep their own
 * copy of the authentication state.
 */
export const useAuthStore = defineStore('auth', () => {
  const config = shallowRef<AuthConfig>(getAuthConfig())
  const enabled = ref(config.value.driver !== 'none')
  const driver = ref<AuthDriver>(config.value.driver)

  const user = ref<User | null>(null)
  const isAuthenticated = ref(!enabled.value)
  const isLoading = ref(false)
  const initialized = ref(false)
  const error = ref<string | null>(null)

  /** Deduplicates boot work across the first navigations. */
  let bootPromise: Promise<void> | null = null

  /** True only for a real, authenticated identity (never for `none`). */
  const hasUser = computed(() => enabled.value && isAuthenticated.value && user.value !== null)

  function clearAuth(): void {
    user.value = null
    isAuthenticated.value = !enabled.value
    error.value = null
  }

  function setError(message: string | null): void {
    error.value = message
  }

  /**
   * Handle an HTTP 401 from the shared client by clearing the local session.
   *
   * A 401 during boot or sign-in is a normal "not authenticated yet" answer,
   * not an expiring session. Returns `true` only when an active session was
   * invalidated, so the caller (the router guard) can redirect to login.
   */
  function expireSession(): boolean {
    if (!initialized.value || !enabled.value) return false
    const wasAuthenticated = isAuthenticated.value
    clearAuth()
    if (!wasAuthenticated) return false

    error.value = 'Your session has expired. Please sign in again.'
    return true
  }

  /**
   * Initialize authentication exactly once. Safe to await on every
   * navigation: after the first run it resolves immediately without
   * re-fetching the current user.
   */
  async function initializeAuth(): Promise<void> {
    if (initialized.value) return
    if (bootPromise) return bootPromise

    bootPromise = (async () => {
      const active = getAuthDriver()
      config.value = getAuthConfig()
      driver.value = config.value.driver
      enabled.value = config.value.driver !== 'none'
      isLoading.value = true
      error.value = null

      try {
        await active.initialize()
        if (!enabled.value) {
          // Disabled: predictable state, no requests, no fake user.
          user.value = null
          isAuthenticated.value = true
        } else {
          user.value = await active.getUser()
          isAuthenticated.value = user.value !== null
        }
      } catch (cause) {
        const authError = toAuthError(cause, 'Authentication could not be initialized.')
        error.value = authError.message
        user.value = null
        isAuthenticated.value = false
      } finally {
        isLoading.value = false
        initialized.value = true
      }
    })()

    return bootPromise
  }

  /** Explicitly re-fetch the current user (`useAuth().refreshAuth`). */
  async function refreshAuth(): Promise<User | null> {
    if (!enabled.value) {
      user.value = null
      return null
    }
    isLoading.value = true
    error.value = null
    try {
      const profile = await getAuthDriver().getUser({ force: true })
      user.value = profile
      isAuthenticated.value = profile !== null
      return profile
    } catch (cause) {
      let authError = toAuthError(cause, 'Could not refresh the session.')
      if (authError.status === 401) {
        authError = new AuthError('Your session has expired. Please sign in again.', 401)
      }
      error.value = authError.message
      throw authError
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser(): Promise<User | null> {
    return refreshAuth()
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    if (!enabled.value) {
      throw new AuthError('Authentication is disabled for this deployment.')
    }
    isLoading.value = true
    error.value = null
    try {
      const active = getAuthDriver()
      await active.login(credentials)
      user.value = await active.getUser()
      isAuthenticated.value = user.value !== null
    } catch (cause) {
      const authError = toAuthError(cause, 'Sign in failed. Please try again.')
      error.value = authError.message
      throw authError
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    isLoading.value = true
    try {
      await getAuthDriver().logout()
    } catch {
      // Revocation is best-effort; local state always clears.
    } finally {
      clearAuth()
      isLoading.value = false
    }
  }

  async function forgotPassword(email: string): Promise<void> {
    const driverImpl = getAuthDriver()
    if (!driverImpl.forgotPassword) {
      throw new AuthError('Password reset is not configured for this backend.')
    }
    await driverImpl.forgotPassword(email)
  }

  async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
    const driverImpl = getAuthDriver()
    if (!driverImpl.resetPassword) {
      throw new AuthError('Password reset is not configured for this backend.')
    }
    await driverImpl.resetPassword(payload)
  }

  /**
   * Switch the authentication driver at runtime (development driver
   * selector). Clears prior credentials, initializes the new driver and
   * leaves route re-evaluation to the caller/guard.
   */
  async function switchDriver(name: AuthDriver): Promise<void> {
    if (name === driver.value) return
    isLoading.value = true
    try {
      await switchAuthDriver(name)
      config.value = getAuthConfig()
      driver.value = config.value.driver
      enabled.value = config.value.driver !== 'none'
      initialized.value = false
      bootPromise = null
      clearAuth()
      await initializeAuth()
    } finally {
      isLoading.value = false
    }
  }

  return {
    // state
    enabled,
    driver,
    config,
    user,
    isAuthenticated,
    isLoading,
    initialized,
    error,
    hasUser,
    // actions
    initializeAuth,
    refreshAuth,
    fetchUser,
    login,
    logout,
    forgotPassword,
    resetPassword,
    switchDriver,
    clearAuth,
    expireSession,
    setError,
  }
})
