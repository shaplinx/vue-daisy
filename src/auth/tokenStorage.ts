import type { TokenStorageKind } from './auth.types'

/**
 * Token storage abstraction for the Bearer-token driver.
 *
 * Access tokens are never written to `localStorage`. The default is an
 * in-memory store (lost on refresh — the user simply signs in again), and
 * `sessionStorage` is available as an explicit opt-in.
 */
export interface TokenStorage {
  get(): string | null
  set(token: string): void
  clear(): void
}

class MemoryTokenStorage implements TokenStorage {
  private token: string | null = null

  get(): string | null {
    return this.token
  }

  set(token: string): void {
    this.token = token
  }

  clear(): void {
    this.token = null
  }
}

const SESSION_KEY = 'vue-daisy:auth-token'

/**
 * `sessionStorage` fallback, used only when explicitly configured.
 *
 * SECURITY WARNING: anything readable by JavaScript is vulnerable to token
 * theft through XSS. Prefer in-memory storage (default) or, better, the
 * stateful cookie-based SPA driver.
 */
class SessionTokenStorage implements TokenStorage {
  get(): string | null {
    try {
      return sessionStorage.getItem(SESSION_KEY)
    } catch {
      return null
    }
  }

  set(token: string): void {
    try {
      sessionStorage.setItem(SESSION_KEY, token)
    } catch {
      // Storage unavailable — the token stays usable for this page load only.
    }
  }

  clear(): void {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // Ignore storage failures.
    }
  }
}

export function createTokenStorage(kind: TokenStorageKind): TokenStorage {
  if (kind === 'sessionStorage') {
    console.warn(
      '[auth] Tokens are stored in sessionStorage. JavaScript-accessible storage is ' +
        'vulnerable to token theft through XSS. Use "memory" storage or the stateful ' +
        'Sanctum SPA driver in security-sensitive deployments.',
    )
    return new SessionTokenStorage()
  }
  return new MemoryTokenStorage()
}
