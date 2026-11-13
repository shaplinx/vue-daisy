import { loadAuthConfig, writeDriverOverride } from './auth.config'
import { createAuthDriver } from './auth.factory'
import type { AuthConfig, AuthDriver } from './auth.types'
import type { AuthDriverInterface } from './drivers/AuthDriver'
import { SanctumSpaDriver } from './drivers/SanctumSpaDriver'
import { installMockAuthBackend } from './mock/mockBackend'
import { http, registerHttpAuthHooks } from '@/services/http'

/**
 * Central authentication provider.
 *
 * Resolves the configuration once at startup, creates exactly one active
 * driver, and injects its behaviour into the shared HTTP client. Pages and
 * components never instantiate drivers — they use the store / `useAuth`.
 */

interface AuthProviderState {
  config: AuthConfig
  driver: AuthDriverInterface
}

let state: AuthProviderState | null = null
const unauthorizedListeners = new Set<() => void>()

function requireState(): AuthProviderState {
  if (!state) {
    throw new Error('[auth] installAuth() must run during application startup.')
  }
  return state
}

/**
 * Install the authentication provider. Call once from `main.ts` before the
 * router is installed so the first navigation sees the auth state.
 */
export function installAuth(): AuthConfig {
  if (state) return state.config

  const config = loadAuthConfig()
  const driver = createAuthDriver(config, http)
  state = { config, driver }

  // The single HTTP client follows the active driver.
  http.defaults.baseURL = config.apiBaseUrl

  registerHttpAuthHooks({
    getAuthHeaders: () => state?.driver.getAuthHeaders?.() ?? {},
    onUnauthorized: () => {
      for (const listener of unauthorizedListeners) listener()
    },
    refreshCsrf: async () => {
      const active = state?.driver
      if (active instanceof SanctumSpaDriver) await active.refreshCsrf()
    },
  })

  // Simulated Laravel backend for local development. Installed for every
  // driver so a runtime switch needs no adapter re-wiring.
  if (config.mock) {
    installMockAuthBackend(http, config, () => state?.driver.name ?? config.driver)
    console.info(
      '[auth] Simulated Laravel Sanctum backend active (VITE_AUTH_MOCK). ' +
        'No real authentication requests are made.',
    )
  }

  return config
}

/** Active driver — the only entry point to authentication operations. */
export function getAuthDriver(): AuthDriverInterface {
  return requireState().driver
}

/** Active configuration (driver, endpoints, redirects, mock flag…). */
export function getAuthConfig(): AuthConfig {
  return requireState().config
}

/** Register a callback fired on HTTP 401. Returns an unsubscribe function. */
export function onAuthUnauthorized(listener: () => void): () => void {
  unauthorizedListeners.add(listener)
  return () => unauthorizedListeners.delete(listener)
}

/**
 * Switch the active driver at runtime.
 *
 * Disposes credentials of the previous driver, persists the development
 * override, creates and initializes the new driver, and updates the shared
 * client. Route access must be re-evaluated by the caller (the store does so
 * after reinitializing).
 */
export async function switchAuthDriver(name: AuthDriver): Promise<AuthConfig> {
  const current = requireState()
  if (name === current.config.driver) return current.config

  current.driver.dispose?.()

  if (current.config.allowRuntimeSwitch) writeDriverOverride(name)

  const config: AuthConfig = { ...current.config, driver: name }
  const driver = createAuthDriver(config, http)

  state = { config, driver }
  await driver.initialize()

  return config
}

/** Remove a stored development driver override (deployment config resumes). */
export function clearAuthDriverOverride(): void {
  writeDriverOverride(null)
}
