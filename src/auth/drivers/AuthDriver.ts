import type { AuthDriver, LoginCredentials, ResetPasswordPayload, User } from '../auth.types'

/**
 * Unified authentication driver interface.
 *
 * Every driver — cookie/session, Bearer token, or disabled — implements the
 * same contract. The store and composables only ever talk to this interface,
 * so swapping the active driver never touches application code.
 */
export interface AuthDriverInterface {
  /** Driver identifier, mirrors `AuthConfig['driver']`. */
  readonly name: AuthDriver

  /** One-time setup (prefetch CSRF cookie, restore token, …). */
  initialize(): Promise<void>

  /** Authenticate with credentials. Throws `AuthError` on failure. */
  login(credentials: LoginCredentials): Promise<void>

  /** End the session and revoke credentials where the backend supports it. */
  logout(): Promise<void>

  /** Current profile, fetching it once when not cached. `null` when signed out. */
  getUser(options?: { force?: boolean }): Promise<User | null>

  /** Verify with the backend whether a session/token is still valid. */
  checkAuth(): Promise<boolean>

  /** Synchronous view of the driver's authentication status. */
  isAuthenticated(): boolean

  /** `Authorization`-style headers the shared HTTP client should attach. */
  getAuthHeaders?(): Record<string, string>

  /** Start a password-reset email. Only when the endpoint is configured. */
  forgotPassword?(email: string): Promise<void>

  /** Complete a password reset. Only when the endpoint is configured. */
  resetPassword?(payload: ResetPasswordPayload): Promise<void>

  /**
   * Called by the HTTP client on HTTP 401. Drivers drop their cached
   * identity; the store decides whether a redirect is required.
   */
  handleUnauthorized?(): void

  /** Local cleanup when the driver is replaced or the app tears down. */
  dispose?(): void
}
