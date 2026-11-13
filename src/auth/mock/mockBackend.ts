import axios, { AxiosError, AxiosHeaders } from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { AuthConfig, AuthDriver, User } from '../auth.types'

/**
 * Simulated Laravel Sanctum backend.
 *
 * Runs as an Axios adapter so the real drivers keep making real HTTP calls
 * through the real client and interceptors — only the server is simulated.
 * It is enabled in development (`VITE_AUTH_MOCK`, default on) and answers on
 * the configured auth endpoints:
 *
 *   GET  {csrfCookie}   → sets the XSRF-TOKEN cookie, 204
 *   POST {login}        → session (SPA) or `{ token, user }` (token driver)
 *   POST {logout}       → revokes the session / access token, 204
 *   GET  {user}         → current profile, or 401 `{ message: 'Unauthenticated.' }`
 *   POST {forgotPassword} / {resetPassword}
 *
 * This is NOT real Sanctum authentication. Point `VITE_API_BASE_URL` at a
 * real Laravel application and set `VITE_AUTH_MOCK=false` to switch over.
 */

const LATENCY_MS = 360
const SESSION_KEY = 'vue-daisy:mock-auth-session'
const TOKENS_KEY = 'vue-daisy:mock-auth-tokens'
const XSRF_COOKIE = 'XSRF-TOKEN'
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000

/** Credentials seeded into the simulated backend, shown on the login page. */
export const MOCK_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'password',
} as const

export interface MockUser extends User {
  password: string
}

const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: 'Reza Irfan',
    email: 'admin@example.com',
    password: 'password',
    avatar: null,
    roles: ['admin'],
    permissions: ['users.view', 'users.create', 'users.update', 'users.delete', 'settings.manage'],
  },
  {
    id: 2,
    name: 'Jordan Blake',
    email: 'demo@example.com',
    password: 'password',
    avatar: null,
    roles: ['viewer'],
    permissions: ['users.view'],
  },
]

type MockRoute = 'csrf' | 'login' | 'logout' | 'user' | 'forgot' | 'reset'

interface StoredToken {
  token: string
  email: string
  expiresAt: number
}

interface RequestLike extends InternalAxiosRequestConfig {
  __mockRoute?: MockRoute
}

/* ------------------------------------------------------------------ */
/* Simulated server state                                             */
/* ------------------------------------------------------------------ */

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable — state lives for this page load only.
  }
}

/** The simulated session cookie: an email kept in sessionStorage. */
function getSession(): string | null {
  return readJson<string | null>(SESSION_KEY, null)
}

function setSession(email: string | null): void {
  if (email === null) {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      // Ignore.
    }
    return
  }
  writeJson(SESSION_KEY, email)
}

function getTokens(): StoredToken[] {
  return readJson<StoredToken[]>(TOKENS_KEY, [])
}

function saveTokens(tokens: StoredToken[]): void {
  writeJson(TOKENS_KEY, tokens)
}

function issueToken(email: string): string {
  const token = `${Date.now()}|${crypto.randomUUID()}`
  const tokens = getTokens().filter((item) => item.expiresAt > Date.now())
  tokens.push({ token, email, expiresAt: Date.now() + TOKEN_TTL_MS })
  saveTokens(tokens)
  return token
}

function resolveToken(raw: string | null): MockUser | null {
  if (!raw) return null
  const value = raw.replace(/^Bearer\s+/i, '').trim()
  const now = Date.now()
  const tokens = getTokens()
  const found = tokens.find((item) => item.token === value)
  if (!found) return null
  if (found.expiresAt <= now) {
    saveTokens(tokens.filter((item) => item.token !== value))
    return null
  }
  return findUser(found.email)
}

function revokeToken(raw: string | null): boolean {
  if (!raw) return false
  const value = raw.replace(/^Bearer\s+/i, '').trim()
  const tokens = getTokens()
  const next = tokens.filter((item) => item.token !== value)
  saveTokens(next)
  return next.length !== tokens.length
}

function findUser(email: string): MockUser | null {
  return MOCK_USERS.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null
}

function publicUser(user: MockUser): User {
  const { password: _password, ...profile } = user
  return profile
}

/* ------------------------------------------------------------------ */
/* Cookies (XSRF)                                                     */
/* ------------------------------------------------------------------ */

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeXsrfCookie(): string {
  const value = crypto.randomUUID()
  document.cookie = `${XSRF_COOKIE}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
  return value
}

/* ------------------------------------------------------------------ */
/* Adapter                                                            */
/* ------------------------------------------------------------------ */

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function pathOf(request: InternalAxiosRequestConfig): string {
  const base = request.baseURL || window.location.origin
  try {
    return new URL(request.url ?? '', base).pathname
  } catch {
    return request.url ?? ''
  }
}

function normalizePath(path: string): string {
  const trimmed = path.split('?')[0].replace(/\/+$/, '')
  return trimmed || '/'
}

function matchRoute(pathname: string, config: AuthConfig): MockRoute | null {
  const path = normalizePath(pathname)
  const candidates: Array<[MockRoute, string | undefined]> = [
    ['csrf', config.endpoints.csrfCookie],
    ['login', config.endpoints.login],
    ['logout', config.endpoints.logout],
    ['user', config.endpoints.user],
    ['forgot', config.endpoints.forgotPassword],
    ['reset', config.endpoints.resetPassword],
  ]
  for (const [route, endpoint] of candidates) {
    if (endpoint && normalizePath(endpoint) === path) return route
  }
  return null
}

function parseBody(request: InternalAxiosRequestConfig): Record<string, unknown> {
  if (!request.data) return {}
  if (typeof request.data === 'string') {
    try {
      return JSON.parse(request.data) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  if (typeof request.data === 'object') return request.data as Record<string, unknown>
  return {}
}

function headerOf(request: InternalAxiosRequestConfig, name: string): string | null {
  const headers = request.headers as AxiosHeaders
  const value = typeof headers?.get === 'function' ? headers.get(name) : headers?.[name]
  return value == null ? null : String(value)
}

/**
 * Emulate the browser adapter's XSRF behaviour: Axios reads the
 * `XSRF-TOKEN` cookie and attaches it as `X-XSRF-TOKEN` inside the real
 * adapter, which this mock replaces — so it must be applied here.
 */
function attachXsrfHeader(request: InternalAxiosRequestConfig): void {
  const cookie = readCookie(XSRF_COOKIE)
  if (!cookie) return
  const headers = request.headers as AxiosHeaders
  if (headers && typeof headers.set === 'function') {
    headers.set('X-XSRF-TOKEN', decodeURIComponent(cookie))
  }
}

function statusText(status: number): string {
  const map: Record<number, string> = {
    200: 'OK',
    204: 'No Content',
    401: 'Unauthorized',
    404: 'Not Found',
    419: 'Page Expired',
    422: 'Unprocessable Content',
  }
  return map[status] ?? ''
}

function responseOf<T>(
  request: InternalAxiosRequestConfig,
  status: number,
  data: T,
): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: statusText(status),
    headers: new AxiosHeaders({ 'content-type': 'application/json' }),
    config: request,
    request: {},
  }
}

function fail(
  request: InternalAxiosRequestConfig,
  status: number,
  data: { message: string; errors?: Record<string, string[]> },
): never {
  throw new AxiosError(
    data.message,
    status === 401 ? 'ERR_UNAUTHORIZED' : 'ERR_BAD_RESPONSE',
    request,
    {},
    responseOf(request, status, data),
  )
}

const UNAUTHENTICATED = { message: 'Unauthenticated.' }
const CSRF_MISMATCH = { message: 'CSRF token mismatch.' }
const INVALID_CREDENTIALS = {
  message: 'These credentials do not match our records.',
  errors: { email: ['These credentials do not match our records.'] },
}

function validateCredentials(body: Record<string, unknown>): MockUser {
  const email = typeof body.email === 'string' ? body.email : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const user = findUser(email)
  if (!user || user.password !== password) fail({} as RequestLike, 422, INVALID_CREDENTIALS)
  return user
}

function isValidCsrf(request: InternalAxiosRequestConfig): boolean {
  const cookie = readCookie(XSRF_COOKIE)
  const header = headerOf(request, 'X-XSRF-TOKEN')
  return Boolean(cookie && header && decodeURIComponent(header) === cookie)
}

function handleSpaLogin(
  request: InternalAxiosRequestConfig,
  body: Record<string, unknown>,
): AxiosResponse {
  if (!isValidCsrf(request)) fail(request, 419, CSRF_MISMATCH)
  const user = validateCredentials(body)
  setSession(user.email)
  return responseOf(request, 204, null)
}

function handleTokenLogin(
  request: InternalAxiosRequestConfig,
  body: Record<string, unknown>,
): AxiosResponse {
  const user = validateCredentials(body)
  return responseOf(request, 200, { token: issueToken(user.email), user: publicUser(user) })
}

function handleRoute(
  route: MockRoute,
  request: InternalAxiosRequestConfig,
  driver: AuthDriver,
): AxiosResponse {
  const body = parseBody(request)

  if (route === 'csrf') {
    writeXsrfCookie()
    return responseOf(request, 204, null)
  }

  if (route === 'login') {
    if (driver === 'sanctum-token') return handleTokenLogin(request, body)
    return handleSpaLogin(request, body)
  }

  if (route === 'logout') {
    if (driver === 'sanctum-token') {
      if (!revokeToken(headerOf(request, 'Authorization'))) fail(request, 401, UNAUTHENTICATED)
      return responseOf(request, 204, null)
    }
    // Laravel's web middleware verifies CSRF on stateful requests.
    if (!isValidCsrf(request)) fail(request, 419, CSRF_MISMATCH)
    setSession(null)
    return responseOf(request, 204, null)
  }

  if (route === 'user') {
    if (driver === 'sanctum-token') {
      const user = resolveToken(headerOf(request, 'Authorization'))
      if (!user) fail(request, 401, UNAUTHENTICATED)
      return responseOf(request, 200, publicUser(user))
    }
    const email = getSession()
    const user = email ? findUser(email) : null
    if (!user) fail(request, 401, UNAUTHENTICATED)
    return responseOf(request, 200, publicUser(user))
  }

  if (route === 'forgot') {
    // Laravel answers 200 regardless of whether the address exists.
    return responseOf(request, 200, {
      message: 'If that address exists, a password reset link has been sent.',
    })
  }

  // route === 'reset'
  const errors: Record<string, string[]> = {}
  if (typeof body.token !== 'string' || !body.token) errors.token = ['The reset token is required.']
  if (typeof body.email !== 'string' || !body.email) errors.email = ['The email field is required.']
  if (typeof body.password !== 'string' || body.password.length < 8) {
    errors.password = ['The password must be at least 8 characters.']
  }
  if (body.password !== body.password_confirmation) {
    errors.password = [...(errors.password ?? []), 'The password confirmation does not match.']
  }
  if (Object.keys(errors).length) {
    fail(request, 422, { message: Object.values(errors)[0][0], errors })
  }
  return responseOf(request, 200, { message: 'Your password has been reset.' })
}

/**
 * Wrap the real adapter: auth endpoints are answered by the simulated
 * backend, every other request (the DataTable mocks never hit HTTP) passes
 * straight through.
 */
export function installMockAuthBackend(
  http: AxiosInstance,
  config: AuthConfig,
  getDriver: () => AuthDriver,
): void {
  // `http.defaults.adapter` is a priority list of adapter names, so resolve
  // it to the actual transport first — unmatched requests pass through.
  const fallback = axios.getAdapter(http.defaults.adapter)

  http.defaults.adapter = async (request) => {
    const route = matchRoute(pathOf(request), config)
    if (!route) return fallback(request)
    attachXsrfHeader(request)
    await sleep(LATENCY_MS)
    return handleRoute(route, request, getDriver())
  }
}
