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
 *
 * NOTE: classes built here never appear as string literals in component
 * sources, so Tailwind cannot discover them by scanning. They are
 * safelisted with `@source inline(...)` patterns in src/assets/main.css —
 * whenever a new prefix/value is added here, mirror it there.
 */
export function modifier(
  prefix: string,
  value: string | null | undefined,
  allowed: readonly string[],
): string {
  if (!value || value === 'default') return ''
  return allowed.includes(value) ? `${prefix}-${value}` : ''
}
