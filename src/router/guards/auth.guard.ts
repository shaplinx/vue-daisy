import type { Router } from 'vue-router'
import { onAuthUnauthorized } from '@/auth/auth.provider'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth.store'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    breadcrumb?: string
    /** Requires an authenticated user when authentication is enabled. */
    requiresAuth?: boolean
    /** Only reachable while signed out (login, forgot/reset password). */
    guestOnly?: boolean
  }
}

/**
 * Authentication-aware navigation guard.
 *
 * - Initializes authentication before the first protected route resolves
 *   (and only once — later navigations reuse the cached state).
 * - With authentication disabled, navigation is never blocked. Auth pages
 *   remain reachable so the disabled state can be explained instead of
 *   silently redirecting away from them.
 * - When enabled, `requiresAuth` routes redirect guests to the login page
 *   with the intended destination preserved in `?redirect=`.
 * - `guestOnly` routes redirect authenticated users away.
 * - An HTTP 401 on an active session clears local state and redirects to
 *   login, preserving the intended destination.
 */
export function registerAuthGuard(router: Router): void {
  // A 401 during boot or sign-in is a normal "not authenticated yet" answer,
  // so only react when an active session actually expires.
  onAuthUnauthorized(() => {
    const auth = useAuthStore()
    if (!auth.expireSession()) return

    const current = router.currentRoute.value
    if (current.name === 'login') return
    useToast().warning('Your session expired. Please sign in again.')
    void router.push({ name: 'login', query: { redirect: current.fullPath } })
  })

  router.beforeEach(async (to) => {
    const auth = useAuthStore()
    await auth.initializeAuth()

    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const guestOnly = to.matched.some((record) => record.meta.guestOnly)

    // Disabled authentication never blocks navigation. The auth pages stay
    // reachable so they can show a clear "authentication disabled" state and
    // (in development) offer the simulated driver.
    if (!auth.enabled) return true

    if (requiresAuth && !auth.isAuthenticated) {
      return {
        name: 'login',
        query: to.fullPath && to.fullPath !== '/' ? { redirect: to.fullPath } : {},
      }
    }

    if (guestOnly && auth.isAuthenticated) {
      return { path: auth.config.redirect.afterLogin }
    }

    return true
  })
}
