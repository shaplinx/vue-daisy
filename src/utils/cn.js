/**
 * Join class names, ignoring falsy values.
 * @param {...(string|false|null|undefined|Record<string, boolean>)} values
 * @returns {string}
 */
export function cn(...values) {
  const classes = []
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
