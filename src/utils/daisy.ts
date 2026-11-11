import { computed } from 'vue'

/** Semantic DaisyUI colors shared by most component modifiers. */
export const COLORS = [
  'neutral',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const

export type DaisyColor = (typeof COLORS)[number]

/** Standard DaisyUI size modifiers. */
export const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export type DaisySize = (typeof SIZES)[number]

/**
 * Build a DaisyUI modifier class such as `btn-primary`.
 * Returns an empty string for missing or `default` values, or values outside
 * the allowed list (guards against typos producing dead classes).
 */
export function modifier(
  prefix: string,
  value: string | null | undefined,
  allowed: readonly string[],
): string {
  if (!value || value === 'default') return ''
  return allowed.includes(value) ? `${prefix}-${value}` : ''
}

/** Reactive color modifier, e.g. `useColorClass('btn', props.color)`. */
export function useColorClass(prefix: string, color: string | null | undefined) {
  return computed(() => modifier(prefix, color, COLORS))
}
