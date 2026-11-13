import type { AuthConfig, AuthDriver, TokenStorageKind } from './auth.types'

/**
 * Centralized authentication configuration.
 *
 * Resolution order for the driver:
 *   1. Runtime override (localStorage) — development only, unless
 *      `VITE_AUTH_ALLOW_RUNTIME_SWITCH=true` explicitly enables it.
 *   2. `VITE_AUTH_DRIVER` environment variable.
 *   3. `'none'` — the component library stays open by default.
 *
 * Invalid deployment configuration throws a descriptive error at startup;
 * invalid runtime overrides are ignored with a warning instead.
 */

export const AUTH_DRIVERS: readonly AuthDriver[] = ['sanctum-spa', 'sanctum-token', 'none']

/** localStorage key for the development-only driver override. */
export const AUTH_DRIVER_OVERRIDE_KEY = 'vue-daisy:auth-driver'

const DEFAULTS: AuthConfig = {
  driver: 'none',
  apiBaseUrl: 'http://localhost:8000',
  endpoints: {
    login: '/login',
    logout: '/logout',
    user: '/api/user',
    csrfCookie: '/sanctum/csrf-cookie',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
  },
  token: {
    storage: 'memory',
    responsePath: 'token',
    headerName: 'Authorization',
    prefix: 'Bearer',
  },
  redirect: {
    login: '/login',
    afterLogin: '/dashboard',
    afterLogout: '/login',
  },
  mock: import.meta.env.DEV,
  allowRuntimeSwitch: import.meta.env.DEV,
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined || value === '') return undefined
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

function isAuthDriver(value: unknown): value is AuthDriver {
  return typeof value === 'string' && (AUTH_DRIVERS as readonly string[]).includes(value)
}

function parseDeploymentDriver(value: string | undefined): AuthDriver {
  if (value === undefined || value === '') return DEFAULTS.driver
  if (isAuthDriver(value)) return value
  throw new Error(
    `[auth] Invalid VITE_AUTH_DRIVER "${value}". Valid drivers: ${AUTH_DRIVERS.join(', ')}.`,
  )
}

/** Read the development runtime override; `null` when absent or not allowed. */
export function readDriverOverride(allowRuntimeSwitch: boolean): AuthDriver | null {
  if (!allowRuntimeSwitch) return null
  try {
    const stored = localStorage.getItem(AUTH_DRIVER_OVERRIDE_KEY)
    if (stored === null) return null
    if (isAuthDriver(stored)) return stored
    console.warn(
      `[auth] Ignoring invalid stored driver override "${stored}". ` +
        `Valid drivers: ${AUTH_DRIVERS.join(', ')}.`,
    )
    localStorage.removeItem(AUTH_DRIVER_OVERRIDE_KEY)
  } catch {
    // Storage unavailable — fall through to deployment configuration.
  }
  return null
}

export function writeDriverOverride(driver: AuthDriver | null): void {
  try {
    if (driver === null) localStorage.removeItem(AUTH_DRIVER_OVERRIDE_KEY)
    else localStorage.setItem(AUTH_DRIVER_OVERRIDE_KEY, driver)
  } catch {
    // Storage unavailable; the in-memory switch still applies for this session.
  }
}

/** Resolve the effective authentication configuration. */
export function loadAuthConfig(): AuthConfig {
  const env = import.meta.env
  const allowRuntimeSwitch =
    parseBoolean(env.VITE_AUTH_ALLOW_RUNTIME_SWITCH) ?? DEFAULTS.allowRuntimeSwitch

  const tokenStorage = env.VITE_AUTH_TOKEN_STORAGE
  if (tokenStorage !== undefined && !['memory', 'sessionStorage'].includes(tokenStorage)) {
    throw new Error(
      `[auth] Invalid VITE_AUTH_TOKEN_STORAGE "${tokenStorage}". Use "memory" or "sessionStorage".`,
    )
  }

  return {
    driver: readDriverOverride(allowRuntimeSwitch) ?? parseDeploymentDriver(env.VITE_AUTH_DRIVER),
    apiBaseUrl: env.VITE_API_BASE_URL || DEFAULTS.apiBaseUrl,
    endpoints: {
      login: env.VITE_AUTH_LOGIN_ENDPOINT || DEFAULTS.endpoints.login,
      logout: env.VITE_AUTH_LOGOUT_ENDPOINT || DEFAULTS.endpoints.logout,
      user: env.VITE_AUTH_USER_ENDPOINT || DEFAULTS.endpoints.user,
      csrfCookie: env.VITE_AUTH_CSRF_ENDPOINT || DEFAULTS.endpoints.csrfCookie,
      forgotPassword:
        env.VITE_AUTH_FORGOT_PASSWORD_ENDPOINT ?? DEFAULTS.endpoints.forgotPassword,
      resetPassword: env.VITE_AUTH_RESET_PASSWORD_ENDPOINT ?? DEFAULTS.endpoints.resetPassword,
    },
    token: {
      storage: (tokenStorage as TokenStorageKind | undefined) ?? DEFAULTS.token.storage,
      responsePath: env.VITE_AUTH_TOKEN_RESPONSE_PATH || DEFAULTS.token.responsePath,
      headerName: DEFAULTS.token.headerName,
      prefix: DEFAULTS.token.prefix,
    },
    redirect: { ...DEFAULTS.redirect },
    mock: parseBoolean(env.VITE_AUTH_MOCK) ?? DEFAULTS.mock,
    allowRuntimeSwitch,
  }
}
