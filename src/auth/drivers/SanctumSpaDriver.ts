import type { AxiosInstance } from 'axios'
import type { AuthConfig, LoginCredentials, ResetPasswordPayload, User } from '../auth.types'
import { AuthError } from '../auth.types'
import { extractUser, toAuthError } from '../utils'
import type { AuthDriverInterface } from './AuthDriver'

/**
 * Driver A — Laravel Sanctum stateful SPA authentication.
 *
 * The browser owns the session cookie: this driver never reads or stores
 * credentials. It only requests the CSRF cookie, submits credentials, and
 * asks Laravel for the authenticated profile. `withCredentials` and
 * `withXSRFToken` are configured on the shared HTTP client, so Axios
 * attaches the `X-XSRF-TOKEN` header automatically.
 */
export class SanctumSpaDriver implements AuthDriverInterface {
  readonly name = 'sanctum-spa' as const

  private user: User | null = null
  private csrfLoaded = false

  constructor(
    private readonly config: AuthConfig,
    private readonly http: AxiosInstance,
  ) {}

  async initialize(): Promise<void> {
    // CSRF is fetched lazily before the first state-changing request so a
    // page load never touches the auth backend unless it has to.
  }

  /** Request a fresh CSRF cookie; Axios reads it on the next request. */
  async refreshCsrf(): Promise<void> {
    await this.http.get(this.config.endpoints.csrfCookie)
    this.csrfLoaded = true
  }

  private async ensureCsrf(): Promise<void> {
    if (this.csrfLoaded) return
    await this.refreshCsrf()
  }

  async login(credentials: LoginCredentials): Promise<void> {
    try {
      await this.ensureCsrf()
      await this.http.post(this.config.endpoints.login, {
        email: credentials.email,
        password: credentials.password,
        ...(credentials.remember !== undefined ? { remember: credentials.remember } : {}),
      })
      this.user = await this.fetchUser()
      if (!this.user) {
        throw new AuthError('Signed in, but the user profile could not be loaded.')
      }
    } catch (error) {
      throw toAuthError(error, 'Sign in failed. Please try again.')
    }
  }

  async logout(): Promise<void> {
    try {
      await this.http.post(this.config.endpoints.logout)
    } catch {
      // The session may already be gone server-side; local state still clears.
    } finally {
      this.user = null
      this.csrfLoaded = false
    }
  }

  async getUser(options: { force?: boolean } = {}): Promise<User | null> {
    if (this.user && !options.force) return this.user
    this.user = await this.fetchUser()
    return this.user
  }

  private async fetchUser(): Promise<User | null> {
    try {
      const response = await this.http.get(this.config.endpoints.user)
      return extractUser(response.data)
    } catch (error) {
      if (isUnauthorized(error)) return null
      throw toAuthError(error, 'Could not load the current user.')
    }
  }

  async checkAuth(): Promise<boolean> {
    return (await this.getUser()) !== null
  }

  isAuthenticated(): boolean {
    return this.user !== null
  }

  getAuthHeaders(): Record<string, string> {
    // Session cookies travel with `withCredentials`; no explicit headers.
    return {}
  }

  async forgotPassword(email: string): Promise<void> {
    if (!this.config.endpoints.forgotPassword) {
      throw new AuthError('Password reset is not configured for this backend.')
    }
    try {
      await this.ensureCsrf()
      await this.http.post(this.config.endpoints.forgotPassword, { email })
    } catch (error) {
      throw toAuthError(error, 'Could not send the password reset link.')
    }
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    if (!this.config.endpoints.resetPassword) {
      throw new AuthError('Password reset is not configured for this backend.')
    }
    try {
      await this.ensureCsrf()
      await this.http.post(this.config.endpoints.resetPassword, payload)
    } catch (error) {
      throw toAuthError(error, 'Could not reset the password.')
    }
  }

  handleUnauthorized(): void {
    this.user = null
  }
}

function isUnauthorized(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    (error as { response?: { status?: number } }).response?.status === 401
  )
}
