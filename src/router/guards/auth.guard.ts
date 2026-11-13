import type { Router } from 'vue-router'
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
 */
export function registerAuthGuard(router: Router): void {
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
