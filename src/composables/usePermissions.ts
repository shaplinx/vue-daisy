import { computed } from 'vue'
import { useAuth } from './useAuth'

/**
 * Role- and permission-based UI helpers.
 *
 * Roles and permissions come from the authenticated user profile
 * (`user.roles` / `user.permissions`). Permissions are checked against the
 * token abilities exposed by the backend *and* any explicit list returned
 * with the profile.
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth()

  const roles = computed<string[]>(() => user.value?.roles ?? [])
  const permissions = computed<string[]>(() => user.value?.permissions ?? [])

  function asList(value: string | string[]): string[] {
    return Array.isArray(value) ? value : [value]
  }

  /** True when the user has at least one of the given roles. */
  function hasRole(role: string | string[]): boolean {
    if (!isAuthenticated.value) return false
    const wanted = asList(role)
    return wanted.some((item) => roles.value.includes(item))
  }

  /** True when the user has at least one of the given permissions. */
  function hasPermission(permission: string | string[]): boolean {
    if (!isAuthenticated.value) return false
    const wanted = asList(permission)
    return wanted.some((item) => permissions.value.includes(item))
  }

  /** True when the user has every given permission. */
  function hasAllPermissions(required: string | string[]): boolean {
    if (!isAuthenticated.value) return false
    return asList(required).every((item) => permissions.value.includes(item))
  }

  /** Any of the given roles (explicit alias used by guards/menus). */
  const hasAnyRole = hasRole
  /** Any of the given permissions (explicit alias used by guards/menus). */
  const hasAnyPermission = hasPermission

  return {
    roles,
    permissions,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }
}
