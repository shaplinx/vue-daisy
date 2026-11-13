<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  RefreshCw,
  ServerCog,
  ShieldCheck,
} from '@lucide/vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import type { AuthDriver } from '@/auth/auth.types'
import { toAuthError } from '@/auth/utils'
import DzAvatar from '@/components/ui/data-display/DzAvatar.vue'

const {
  enabled,
  driver,
  config,
  user,
  isAuthenticated,
  isLoading,
  error,
  refreshAuth,
  switchDriver,
} = useAuth()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const DRIVER_OPTIONS: Array<{ value: AuthDriver; label: string; description: string }> = [
  {
    value: 'sanctum-spa',
    label: 'Sanctum Stateful SPA',
    description:
      'Cookie/session authentication. CSRF cookie, session cookie, no tokens in JavaScript.',
  },
  {
    value: 'sanctum-token',
    label: 'Sanctum Bearer Token',
    description:
      'Personal access token sent as an Authorization header. For API-only deployments.',
  },
  {
    value: 'none',
    label: 'No Authentication',
    description: 'Disables auth entirely: no requests, no redirects, all routes open.',
  },
]

const selected = ref<AuthDriver>(driver.value)
watch(driver, (value) => {
  selected.value = value
})

function labelFor(value: AuthDriver): string {
  return DRIVER_OPTIONS.find((option) => option.value === value)?.label ?? value
}

const pendingSwitch = ref<AuthDriver | null>(null)
const confirmOpen = computed({
  get: () => pendingSwitch.value !== null,
  set: (value: boolean) => {
    if (!value) pendingSwitch.value = null
  },
})

function requestSwitch(): void {
  if (selected.value === driver.value) return
  pendingSwitch.value = selected.value
}

async function reEvaluateRoute(): Promise<void> {
  if (!enabled.value) return
  if (route.meta.requiresAuth && !isAuthenticated.value) {
    await router.replace({ name: 'login', query: { redirect: route.fullPath } })
  } else if (route.meta.guestOnly && isAuthenticated.value) {
    await router.replace({ path: config.value.redirect.afterLogin })
  }
}

async function applySwitch(): Promise<void> {
  const next = pendingSwitch.value
  if (!next) return
  pendingSwitch.value = null
  try {
    await switchDriver(next)
    toast.success(`Authentication driver set to ${labelFor(next)}`)
    await reEvaluateRoute()
  } catch (cause) {
    toast.error(toAuthError(cause, 'Could not switch the authentication driver.').message)
  }
}

const checking = ref(false)

async function checkConnection(): Promise<void> {
  if (!enabled.value) {
    toast.info('Authentication is disabled — no requests are made.')
    return
  }
  checking.value = true
  try {
    const profile = await refreshAuth()
    if (profile) toast.success(`Connected as ${profile.name}`)
    else toast.warning('API reachable, but there is no active session.')
  } catch (cause) {
    toast.error(toAuthError(cause, 'Connection check failed.').message)
  } finally {
    checking.value = false
  }
}
</script>

<template>
  <div class="rounded-box border border-base-300 bg-base-100">
    <div class="border-b border-base-300 p-4">
      <h2 class="flex items-center gap-2 font-semibold">
        <ShieldCheck class="size-4 text-primary" aria-hidden="true" />
        Authentication
      </h2>
      <p class="mt-1 text-xs text-base-content/60">
        Pluggable driver configuration. The active driver powers route guards, the API client and
        the profile menu.
      </p>
    </div>

    <div class="space-y-5 p-4">
      <div class="flex flex-wrap items-center gap-2">
        <DzBadge :color="enabled ? 'success' : 'neutral'" variant="soft">
          {{ enabled ? 'Authentication enabled' : 'Authentication disabled' }}
        </DzBadge>
        <DzBadge color="primary" variant="outline">{{ labelFor(driver) }}</DzBadge>
        <DzBadge v-if="config.mock" color="warning" variant="soft">
          <FlaskConical class="size-3" aria-hidden="true" />
          Simulated backend
        </DzBadge>
      </div>

      <DzAlert v-if="config.mock" color="warning" variant="soft">
        <p class="text-sm font-medium">Local simulation active</p>
        <p class="mt-1 text-xs leading-relaxed">
          <code class="rounded bg-base-200 px-1">VITE_AUTH_MOCK</code> answers the auth endpoints
          with realistic Laravel Sanctum responses so every driver can be exercised without a
          backend. This is simulated authentication, not real Sanctum.
        </p>
      </DzAlert>

      <div
        v-if="enabled && isAuthenticated && user"
        class="flex items-center gap-3 rounded-box bg-base-200 p-3"
      >
        <DzAvatar
          size="sm"
          ring="primary"
          :alt="user.name"
          :placeholder="user.name.slice(0, 2).toUpperCase()"
        />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold">{{ user.name }}</p>
          <p class="truncate text-xs opacity-60">{{ user.email }}</p>
        </div>
        <div class="hidden gap-1 sm:flex">
          <DzBadge v-for="role in user.roles ?? []" :key="role" size="sm" color="accent" variant="outline">
            {{ role }}
          </DzBadge>
        </div>
      </div>

      <div v-else-if="enabled" class="flex flex-wrap items-center justify-between gap-3 rounded-box bg-base-200 p-3">
        <p class="text-sm opacity-70">No active session.</p>
        <DzButton size="xs" color="primary" to="/login">Sign in</DzButton>
      </div>

      <div v-else class="flex flex-wrap items-center justify-between gap-3 rounded-box bg-base-200 p-3">
        <p class="text-sm opacity-70">
          Authentication is disabled. The sign-in page is still available for reference.
        </p>
        <DzButton size="xs" variant="outline" to="/login">Open login page</DzButton>
      </div>

      <DzAlert v-if="error" color="error" variant="soft" role="alert">{{ error }}</DzAlert>

      <dl class="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div class="flex justify-between gap-4 sm:block">
          <dt class="text-xs opacity-60">API base URL</dt>
          <dd class="truncate font-mono text-xs">{{ config.apiBaseUrl }}</dd>
        </div>
        <div class="flex justify-between gap-4 sm:block">
          <dt class="text-xs opacity-60">Login endpoint</dt>
          <dd class="truncate font-mono text-xs">{{ config.endpoints.login }}</dd>
        </div>
        <div class="flex justify-between gap-4 sm:block">
          <dt class="text-xs opacity-60">Logout endpoint</dt>
          <dd class="truncate font-mono text-xs">{{ config.endpoints.logout }}</dd>
        </div>
        <div class="flex justify-between gap-4 sm:block">
          <dt class="text-xs opacity-60">Current user endpoint</dt>
          <dd class="truncate font-mono text-xs">{{ config.endpoints.user }}</dd>
        </div>
        <template v-if="driver === 'sanctum-spa'">
          <div class="flex justify-between gap-4 sm:block">
            <dt class="text-xs opacity-60">CSRF cookie endpoint</dt>
            <dd class="truncate font-mono text-xs">{{ config.endpoints.csrfCookie }}</dd>
          </div>
        </template>
        <template v-if="driver === 'sanctum-token'">
          <div class="flex justify-between gap-4 sm:block">
            <dt class="text-xs opacity-60">Token storage</dt>
            <dd class="font-mono text-xs">{{ config.token.storage }}</dd>
          </div>
          <div class="flex justify-between gap-4 sm:block">
            <dt class="text-xs opacity-60">Token response path</dt>
            <dd class="truncate font-mono text-xs">{{ config.token.responsePath }}</dd>
          </div>
        </template>
      </dl>

      <DzAlert
        v-if="driver === 'sanctum-token' && config.token.storage === 'sessionStorage'"
        color="warning"
        variant="soft"
        :icon="AlertTriangle"
      >
        <p class="text-xs leading-relaxed">
          Tokens are stored in <code class="rounded bg-base-200 px-1">sessionStorage</code>.
          JavaScript-accessible storage is vulnerable to token theft through XSS. Prefer
          <code class="rounded bg-base-200 px-1">memory</code> or the stateful SPA driver.
        </p>
      </DzAlert>

      <div class="flex flex-wrap items-center gap-2">
        <DzButton size="sm" variant="outline" :loading="checking" @click="checkConnection">
          <RefreshCw v-if="!checking" class="size-4" aria-hidden="true" />
          Check session
        </DzButton>
        <span v-if="enabled && isAuthenticated" class="inline-flex items-center gap-1 text-xs text-success">
          <CheckCircle2 class="size-3.5" aria-hidden="true" />
          Session active
        </span>
      </div>

      <div class="divider my-0" />

      <div v-if="config.allowRuntimeSwitch" class="space-y-3">
        <div class="flex items-start gap-2">
          <ServerCog class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p class="text-sm font-medium">Development driver selector</p>
            <p class="text-xs text-base-content/60">
              Switching clears the current driver's credentials, initializes the new driver and
              re-evaluates route access. Only available outside production.
            </p>
          </div>
        </div>

        <div class="grid gap-2">
          <label
            v-for="option in DRIVER_OPTIONS"
            :key="option.value"
            class="flex cursor-pointer items-start gap-3 rounded-box border p-3 transition-colors"
            :class="
              selected === option.value
                ? 'border-primary bg-primary/5'
                : 'border-base-300 hover:bg-base-200/60'
            "
          >
            <input
              v-model="selected"
              type="radio"
              class="radio radio-primary radio-sm mt-0.5"
              :value="option.value"
              :disabled="isLoading"
            />
            <span class="min-w-0">
              <span class="flex flex-wrap items-center gap-2 text-sm font-medium">
                {{ option.label }}
                <span v-if="option.value === driver" class="badge badge-ghost badge-xs">active</span>
              </span>
              <span class="mt-0.5 block text-xs leading-relaxed text-base-content/60">
                {{ option.description }}
              </span>
            </span>
          </label>
        </div>

        <DzButton
          color="primary"
          size="sm"
          :disabled="selected === driver || isLoading"
          :loading="isLoading"
          @click="requestSwitch"
        >
          Apply driver
        </DzButton>
      </div>

      <p v-else class="text-xs text-base-content/60">
        Driver selection is deployment-controlled through
        <code class="rounded bg-base-200 px-1">VITE_AUTH_DRIVER</code>.
      </p>

      <p class="text-[11px] leading-relaxed text-base-content/50">
        Passwords, tokens and session cookies are never displayed here or written to logs.
      </p>
    </div>

    <DzModal
      v-model="confirmOpen"
      size="sm"
      title="Switch authentication driver?"
      :description="`The app will switch to ${selected === driver ? driver : labelFor(selected)}.`"
    >
      <p class="text-sm text-base-content/70">
        Credentials associated with the current driver are cleared and the new driver is
        initialized. You may be redirected to the login page.
      </p>
      <template #footer>
        <DzButton variant="ghost" size="sm" @click="confirmOpen = false">Cancel</DzButton>
        <DzButton color="primary" size="sm" :loading="isLoading" @click="applySwitch">
          Switch driver
        </DzButton>
      </template>
    </DzModal>
  </div>
</template>
