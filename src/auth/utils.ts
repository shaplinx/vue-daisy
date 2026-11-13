import { AxiosError } from 'axios'
import type { User } from './auth.types'
import { AuthError } from './auth.types'

/** Read a dot path (`data.token`) out of an unknown response payload. */
export function getPath(source: unknown, path: string): unknown {
  let current: unknown = source
  for (const segment of path.split('.')) {
    if (current === null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[segment]
  }
  return current
}

/**
 * Extract a user record from a response payload. Laravel's `/api/user`
 * returns the model directly; some backends wrap it in `data`.
 */
export function extractUser(payload: unknown): User | null {
  const candidate =
    payload && typeof payload === 'object' && 'id' in payload
      ? payload
      : getPath(payload, 'data')
  if (!candidate || typeof candidate !== 'object') return null
  const record = candidate as Record<string, unknown>
  if (record.id === undefined || typeof record.email !== 'string') return null
  return record as User
}

/**
 * Normalize any failure thrown during an auth operation into an
 * `AuthError`, preserving Laravel's validation messages (HTTP 422) and
 * authentication failures (HTTP 401) for display on the auth pages.
 */
export function toAuthError(error: unknown, fallback: string): AuthError {
  if (error instanceof AuthError) return error
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined
    if (status === 422 && data?.errors) {
      const first = Object.values(data.errors)[0]?.[0]
      return new AuthError(first || data.message || fallback, status, data.errors)
    }
    if (status === 401) {
      return new AuthError(data?.message || 'These credentials do not match our records.', status)
    }
    if (status === 419) {
      return new AuthError('Your session expired. Please try again.', status)
    }
    if (status === 429) {
      return new AuthError(data?.message || 'Too many attempts. Please try again later.', status)
    }
    if (!error.response) {
      return new AuthError('Cannot reach the authentication server. Check your connection.')
    }
    return new AuthError(data?.message || fallback, status)
  }
  if (error instanceof Error) return new AuthError(error.message)
  return new AuthError(fallback)
}
