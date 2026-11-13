import type { AxiosInstance } from 'axios'
import type { AuthConfig, LoginCredentials, ResetPasswordPayload, User } from '../auth.types'
import { AuthError } from '../auth.types'
import { createTokenStorage } from '../tokenStorage'
import type { TokenStorage } from '../tokenStorage'
import { extractUser, getPath, toAuthError } from '../utils'
import type { AuthDriverInterface } from './AuthDriver'

/**
 * Driver B — Laravel Sanctum personal access tokens.
 *
 * Credentials are exchanged at a configurable endpoint, the token is read
 * from a configurable dot path (`token`, `data.token`, …), and the HTTP
 * client attaches it as `Authorization: Bearer <token>`. Tokens default to
 * in-memory storage and are never logged.
 */
export class SanctumTokenDriver implements AuthDriverInterface {
  readonly name = 'sanctum-token' as const

  private user: User | null = null
  private readonly storage: TokenStorage

  constructor(
    private readonly config: AuthConfig,
    private readonly http: AxiosInstance,
  ) {
    this.storage = createTokenStorage(config.token.storage)
  }

  async initialize(): Promise<void> {
    // The stored token (when sessionStorage is configured) is picked up by
    // `getAuthHeaders`; the profile is loaded by `checkAuth` during boot.
  }

  async login(credentials: LoginCredentials): Promise<void> {
    try {
      const response = await this.http.post(this.config.endpoints.login, {
        email: credentials.email,
        password: credentials.password,
        device_name: 'vue-daisy-spa',
      })

      const token = getPath(response.data, this.config.token.responsePath)
      if (typeof token !== 'string' || token === '') {
        throw new AuthError(
          `No access token at response path "${this.config.token.responsePath}". ` +
            'Check VITE_AUTH_TOKEN_RESPONSE_PATH against your backend response.',
        )
      }

      this.storage.set(token)

      // Prefer the user embedded in the login response; fall back to the
      // profile endpoint like a backend that only returns `{ token }`.
      const embedded =
        extractUser(getPath(response.data, 'user')) ?? extractUser(getPath(response.data, 'data.user'))
      this.user = embedded ?? (await this.fetchUser())
      if (!this.user) {
        this.storage.clear()
        throw new AuthError('Signed in, but the user profile could not be loaded.')
      }
    } catch (error) {
      throw toAuthError(error, 'Sign in failed. Please try again.')
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.storage.get()) await this.http.post(this.config.endpoints.logout)
    } catch {
      // Revocation is best-effort; local credentials are cleared regardless.
    } finally {
      this.storage.clear()
      this.user = null
    }
  }

  async getUser(options: { force?: boolean } = {}): Promise<User | null> {
    if (this.user && !options.force) return this.user
    this.user = await this.fetchUser()
    return this.user
  }

  private async fetchUser(): Promise<User | null> {
    if (!this.storage.get()) return null
    try {
      const response = await this.http.get(this.config.endpoints.user)
      return extractUser(response.data)
    } catch (error) {
      if (isUnauthorized(error)) {
        this.storage.clear()
        return null
      }
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
    const token = this.storage.get()
    if (!token) return {}
    return { [this.config.token.headerName]: `${this.config.token.prefix} ${token}` }
  }

  async forgotPassword(email: string): Promise<void> {
    if (!this.config.endpoints.forgotPassword) {
      throw new AuthError('Password reset is not configured for this backend.')
    }
    try {
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
      await this.http.post(this.config.endpoints.resetPassword, payload)
    } catch (error) {
      throw toAuthError(error, 'Could not reset the password.')
    }
  }

  handleUnauthorized(): void {
    this.storage.clear()
    this.user = null
  }

  /** Clear any stored token when this driver is replaced (e.g. switch to `none`). */
  dispose(): void {
    this.storage.clear()
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
