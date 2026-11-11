import { onScopeDispose, ref } from 'vue'
import type { Ref } from 'vue'

/**
 * Reactive media query helper used for responsive layout decisions.
 */
export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref(false)
  let mediaQuery: MediaQueryList | undefined

  const update = (event: MediaQueryListEvent): void => {
    matches.value = event.matches
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    mediaQuery = window.matchMedia(query)
    matches.value = mediaQuery.matches
    mediaQuery.addEventListener('change', update)
  }

  onScopeDispose(() => {
    mediaQuery?.removeEventListener('change', update)
  })

  return matches
}
