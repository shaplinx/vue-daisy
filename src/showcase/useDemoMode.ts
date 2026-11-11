import { inject, ref } from 'vue'

export const DEMO_MODE_KEY = Symbol('demo-mode')

/**
 * Injected by DemoSection so a single demo component can render a focused
 * "Preview" block and a denser "Variants" block without duplicating markup.
 */
export function useDemoMode() {
  return inject(DEMO_MODE_KEY, ref('preview'))
}
