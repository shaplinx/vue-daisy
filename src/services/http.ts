import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

/**
 * Centralized HTTP client.
 *
 * Single Axios instance shared by the authentication drivers and any future
 * real API services. Authentication behaviour is injected at startup by the
 * auth provider (`registerHttpAuthHooks`) so this module never imports a
 * driver — DataTable services, for example, stay unaware of the active
 * authentication mode.
 *
 * Session cookies are browser-managed (`withCredentials`), and the XSRF
 * token cookie is forwarded automatically (`withXSRFToken`) for Sanctum's
 * stateful SPA mode.
 */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  withCredentials: true,
  withXSRFToken: true,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export interface HttpAuthHooks {
  /** Headers to attach (Bearer token in token mode, nothing otherwise). */
  getAuthHeaders: () => Record<string, string>
  /** Called on HTTP 401 so the store can clear state / redirect once. */
  onUnauthorized: () => void
  /** Stateful SPA only: refresh the CSRF cookie before retrying a 419. */
  refreshCsrf: (() => Promise<void>) | null
}

let hooks: HttpAuthHooks | null = null
let hooksInstalled = false

/** Wire authentication behaviour into the shared client (called once). */
export function registerHttpAuthHooks(next: HttpAuthHooks): void {
  hooks = next

  if (hooksInstalled) return
  hooksInstalled = true

  http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const headers = hooks?.getAuthHeaders() ?? {}
    for (const [name, value] of Object.entries(headers)) {
      config.headers.set(name, value)
    }
    return config
  })

  http.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as
        | (InternalAxiosRequestConfig & { __csrfRetried?: boolean })
        | undefined

      // 419 — CSRF token expired: refresh the cookie and retry exactly once.
      if (error.response?.status === 419 && hooks?.refreshCsrf && config && !config.__csrfRetried) {
        config.__csrfRetried = true
        try {
          await hooks.refreshCsrf()
          return await http.request(config)
        } catch {
          // Refresh failed — fall through and surface the original 419.
        }
      }

      // 401 — let the auth layer decide (init-time 401s are normal).
      if (error.response?.status === 401) hooks?.onUnauthorized()

      return Promise.reject(error)
    },
  )
}
