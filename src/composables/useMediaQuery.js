import { onScopeDispose, ref } from 'vue'

/**
 * Reactive media query helper used for responsive layout decisions.
 */
export function useMediaQuery(query) {
  const matches = ref(false)
  let mediaQuery

  const update = (event) => {
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
