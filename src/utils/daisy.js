import { computed } from 'vue'

export const COLORS = [
  'neutral',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
]

export const SIZES = ['xs', 'sm', 'md', 'lg', 'xl']

/**
 * Build a DaisyUI modifier class such as `btn-primary`.
 * @param {string} prefix
 * @param {string|undefined} value
 * @param {string[]} allowed
 */
export function modifier(prefix, value, allowed) {
  if (!value || value === 'default') return ''
  return allowed.includes(value) ? `${prefix}-${value}` : ''
}

export function useColorClass(prefix, color) {
  return computed(() => modifier(prefix, color, COLORS))
}
