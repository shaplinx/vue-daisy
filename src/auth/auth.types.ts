/**
 * Shared authentication types.
 *
 * Everything in the auth stack (drivers, store, guards, pages) speaks these
 * types — the application never depends on a concrete driver implementation.
 */

/** Available authentication drivers. */
export type AuthDriver = 'sanctum-spa' | 'sanctum-token' | 'none'

/** Authenticated user profile as returned by Laravel's `/api/user`. */
export interface User {
  id: number | string
  name: string
  email: string
  avatar?: string | null
  roles?: string[]
  permissions?: string[]
  [key: string]: unknown
}

/** Credentials accepted by the login endpoints of both Sanctum drivers. */
export interface LoginCredentials {
  email: string
  password: string
  /** Stateful SPA only — maps to Laravel's `remember` flag. */
  remember?: boolean
}

/** Payload for the configurable password-reset endpoint. */
export interface ResetPasswordPayload {
  token: string
  email: string
  password: string
  password_confirmation: string
}

/** Endpoint paths, relative to `apiBaseUrl`. */
export interface AuthEndpoints {
  login: string
  logout: string
  user: string
  csrfCookie: string
  forgotPassword?: string
  resetPassword?: string
}

/** Where the Bearer token lives between requests. */
export type TokenStorageKind = 'memory' | 'sessionStorage'

export interface TokenConfig {
  storage: TokenStorageKind
  /** Dot path to the token inside the login response, e.g. `token` or `data.token`. */
  responsePath: string
  headerName: string
  prefix: string
}

export interface AuthRedirects {
  login: string
  afterLogin: string
  afterLogout: string
}

/** Fully-resolved authentication configuration. */
export interface AuthConfig {
  driver: AuthDriver
  apiBaseUrl: string
  endpoints: AuthEndpoints
  token: TokenConfig
  redirect: AuthRedirects
  /**
   * Simulated Laravel backend for local development. The mock runs as an
   * axios adapter, so drivers still exercise the real HTTP pipeline — but no
   * real Sanctum server is involved. Never enable this against a real API.
   */
  mock: boolean
  /** Permit the runtime driver selector outside development mode. */
  allowRuntimeSwitch: boolean
}

/** Driver-agnostic error raised by auth operations. */
export class AuthError extends Error {
  /** HTTP status when the error came from a response (0 for local errors). */
  readonly status: number
  /** Laravel validation error map (`{ field: [messages] }`) for HTTP 422. */
  readonly errors: Record<string, string[]>

  constructor(message: string, status = 0, errors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'AuthError'
    this.status = status
    this.errors = errors
  }
}
