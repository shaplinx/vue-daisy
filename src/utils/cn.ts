/** Values accepted by the class-name joiner. */
export type ClassValue =
  | string
  | false
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>

/**
 * Join class names, ignoring falsy values.
 */
export function cn(...values: ClassValue[]): string {
  const classes: string[] = []
  for (const value of values) {
    if (!value) continue
    if (typeof value === 'string') {
      classes.push(value)
    } else if (Array.isArray(value)) {
      classes.push(cn(...value))
    } else if (typeof value === 'object') {
      for (const [key, enabled] of Object.entries(value)) {
        if (enabled) classes.push(key)
      }
    }
  }
  return classes.filter(Boolean).join(' ')
}
