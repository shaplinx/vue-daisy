/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Authentication driver: `sanctum-spa` | `sanctum-token` | `none`. */
  readonly VITE_AUTH_DRIVER?: string
  /** Base URL of the Laravel backend, e.g. `http://localhost:8000`. */
  readonly VITE_API_BASE_URL?: string
  readonly VITE_AUTH_LOGIN_ENDPOINT?: string
  readonly VITE_AUTH_LOGOUT_ENDPOINT?: string
  readonly VITE_AUTH_USER_ENDPOINT?: string
  readonly VITE_AUTH_CSRF_ENDPOINT?: string
  readonly VITE_AUTH_FORGOT_PASSWORD_ENDPOINT?: string
  readonly VITE_AUTH_RESET_PASSWORD_ENDPOINT?: string
  /** Token driver: `memory` | `sessionStorage`. */
  readonly VITE_AUTH_TOKEN_STORAGE?: string
  /** Token driver: dot path of the token in the login response. */
  readonly VITE_AUTH_TOKEN_RESPONSE_PATH?: string
  /** Simulate a Laravel Sanctum backend in the axios adapter (`true`/`false`). */
  readonly VITE_AUTH_MOCK?: string
  /** Allow switching the auth driver at runtime outside development. */
  readonly VITE_AUTH_ALLOW_RUNTIME_SWITCH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
