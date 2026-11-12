/**
 * Custom FormKit validation rules used by the form examples.
 *
 * Rules are plain functions. FormKit passes a context object for object-style
 * rules (the shape used here) and skips rules when the value is empty, so
 * `required` remains the single source of truth for empty fields.
 */

export interface FormKitRuleContext {
  value: unknown
}

const DISPOSABLE_DOMAINS = [
  'mailinator.com',
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
]

/** At least 8 characters with lower, upper and numeric characters. */
export function strongPassword({ value }: FormKitRuleContext): boolean {
  const password = String(value ?? '')
  if (!password) return true
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  )
}

/** Read a file's size from a raw `File` or FormKit's `{ name, file }` entry. */
function fileSize(entry: unknown): number | undefined {
  if (typeof File !== 'undefined' && entry instanceof File) return entry.size
  if (entry && typeof entry === 'object' && 'file' in entry) {
    const file = (entry as { file?: unknown }).file
    if (typeof File !== 'undefined' && file instanceof File) return file.size
  }
  return undefined
}

/** Reject files larger than the given size in megabytes (default 5 MB). */
export function maxFileSize({ value }: FormKitRuleContext, maxMb = 5): boolean {
  const files = Array.isArray(value) ? value : []
  const limit = Number(maxMb) * 1024 * 1024
  return files.every((entry) => {
    const size = fileSize(entry)
    return size === undefined || size <= limit
  })
}

/** Reject a small list of well-known disposable email domains. */
export function noDisposableEmail({ value }: FormKitRuleContext): boolean {
  const email = String(value ?? '').toLowerCase()
  if (!email) return true
  const domain = email.split('@')[1] ?? ''
  return !DISPOSABLE_DOMAINS.includes(domain)
}

const TAKEN_USERNAMES = new Set(['admin', 'root', 'formkit', 'daisy', 'support'])

/**
 * Async availability check. The short delay makes FormKit's async validation
 * state visible in the registration example.
 */
export async function availableUsername({ value }: FormKitRuleContext): Promise<boolean> {
  const username = String(value ?? '').toLowerCase()
  if (!username) return true
  await new Promise((resolve) => setTimeout(resolve, 350))
  return !TAKEN_USERNAMES.has(username)
}
