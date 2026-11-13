import type { LoginCredentials, ResetPasswordPayload, User } from '../auth.types'
import { AuthError } from '../auth.types'
import type { AuthDriverInterface } from './AuthDriver'

/**
 * Driver C — authentication disabled.
 *
 * Intended for local development, the component showcase, UI testing and
 * public deployments. No auth requests, no CSRF, no tokens, no redirects.
 * `isAuthenticated` is always `true` so guards stay open, but it is NOT
 * proof of a real user — consumers must check `enabled` (see `useAuth`).
 */
export class NoAuthDriver implements AuthDriverInterface {
  readonly name = 'none' as const

  async initialize(): Promise<void> {}

  async login(_credentials: LoginCredentials): Promise<void> {
    throw new AuthError('Authentication is disabled for this deployment.')
  }

  async logout(): Promise<void> {}

  async getUser(options?: { force?: boolean }): Promise<User | null> {
    return null
  }

  async checkAuth(): Promise<boolean> {
    return true
  }

  isAuthenticated(): boolean {
    return true
  }

  getAuthHeaders(): Record<string, string> {
    return {}
  }

  async forgotPassword(_email: string): Promise<void> {
    throw new AuthError('Authentication is disabled for this deployment.')
  }

  async resetPassword(_payload: ResetPasswordPayload): Promise<void> {
    throw new AuthError('Authentication is disabled for this deployment.')
  }

  handleUnauthorized(): void {}

  dispose(): void {}
}
