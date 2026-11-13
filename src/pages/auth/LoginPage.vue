<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldAlert,
  Sparkles,
} from '@lucide/vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { toAuthError } from '@/auth/utils'
import { MOCK_CREDENTIALS } from '@/auth/mock/mockBackend'

interface LoginFormData {
  email: string
  password: string
  remember?: boolean
}

interface FormKitNodeLike {
  at?: (name: string) => { input?: (value: unknown) => Promise<unknown> } | undefined
  props?: Record<string, unknown>
}

interface FormKitFormLike {
  node?: FormKitNodeLike
}

const { login, switchDriver, isLoading, error, driver, config, enabled, setError } = useAuth()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const form = ref<FormKitFormLike | null>(null)
const passwordField = ref<FormKitFormLike | null>(null)

const passwordVisible = ref(false)
const capsLock = ref(false)
const enablingDemo = ref(false)

const isStatefulSpa = computed(() => driver.value === 'sanctum-spa')
const formDisabled = computed(() => !enabled.value || isLoading.value)

/** Email supplied by another page (for example after a password reset). */
const presetEmail = computed(() => {
  const value = route.query.email
  return typeof value === 'string' ? value : ''
})

const driverCopy = computed(() => {
  if (!enabled.value) {
    return 'Authentication is disabled, so sign-in is unavailable in this deployment.'
  }
  return isStatefulSpa.value
    ? 'Sign in with your account. A secure session cookie keeps you signed in.'
    : 'Sign in to receive a personal access token for API requests.'
})

/** The development-only shortcut to a working mock session. */
const canEnableDemo = computed(
  () => !enabled.value && config.value.mock && config.value.allowRuntimeSwitch,
)

function togglePassword(): void {
  passwordVisible.value = !passwordVisible.value
  // FormKit binds the DOM input's `type` to this prop.
  const props = passwordField.value?.node?.props
  if (props) props.type = passwordVisible.value ? 'text' : 'password'
}

function syncCapsLock(event: KeyboardEvent): void {
  capsLock.value = event.getModifierState?.('CapsLock') ?? false
}

/**
 * Brew a demo session: while the `none` driver is active nothing can be
 * submitted, so development builds offer a one-click switch to the simulated
 * Sanctum SPA driver.
 */
async function enableDemoSignIn(): Promise<void> {
  enablingDemo.value = true
  try {
    await switchDriver('sanctum-spa')
    setError(null)
    toast.success('Simulated Sanctum authentication enabled')
  } catch (cause) {
    setError(toAuthError(cause, 'Could not enable authentication.').message)
  } finally {
    enablingDemo.value = false
  }
}

function fillDemoCredentials(): void {
  const node = form.value?.node
  void node?.at?.('email')?.input?.(MOCK_CREDENTIALS.email)
  void node?.at?.('password')?.input?.(MOCK_CREDENTIALS.password)
}

/** Only allow same-origin, absolute-path redirects after sign-in. */
function safeRedirect(): string {
  const target = route.query.redirect
  if (typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')) {
    return target
  }
  return config.value.redirect.afterLogin
}

async function onSubmit(data: LoginFormData): Promise<void> {
  if (!enabled.value) return

  setError(null)
  try {
    await login({
      email: data.email,
      password: data.password,
      ...(isStatefulSpa.value ? { remember: Boolean(data.remember) } : {}),
    })
    toast.success('Signed in successfully')
    await router.replace(safeRedirect())
  } catch {
    // The store exposes the normalized error message above the form.
  }
}
</script>

<template>
  <div class="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-xl shadow-base-content/5">
    <header class="relative border-b border-base-300 p-6">
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
        aria-hidden="true"
      />
      <div class="relative">
        <span
          class="flex size-11 items-center justify-center rounded-box bg-primary text-primary-content shadow-sm"
        >
          <KeyRound class="size-5" aria-hidden="true" />
        </span>
        <h1 class="mt-3 text-xl font-bold tracking-tight">Welcome back</h1>
        <p class="mt-1 text-sm text-base-content/60">{{ driverCopy }}</p>
      </div>
    </header>

    <div class="space-y-4 p-6">
      <DzAlert v-if="!enabled" color="warning" variant="soft" :icon="ShieldAlert" role="status">
        <p class="font-semibold">Authentication is disabled</p>
        <p class="mt-1 text-sm leading-relaxed">
          This deployment uses the <code class="rounded bg-base-200 px-1">none</code> driver.
          Sign-in is only available when authentication is enabled.
        </p>
        <div v-if="canEnableDemo" class="mt-3">
          <DzButton size="sm" color="primary" :loading="enablingDemo" @click="enableDemoSignIn">
            <Sparkles v-if="!enablingDemo" class="size-4" aria-hidden="true" />
            Enable simulated sign-in
          </DzButton>
          <p class="mt-2 text-[11px] leading-snug text-base-content/60">
            Development only — switches to the Sanctum SPA driver with the simulated backend.
          </p>
        </div>
        <p v-else class="mt-2 text-xs leading-relaxed text-base-content/60">
          Set <code class="rounded bg-base-200 px-1">VITE_AUTH_DRIVER</code> to
          <code class="rounded bg-base-200 px-1">sanctum-spa</code> or
          <code class="rounded bg-base-200 px-1">sanctum-token</code> to enable sign-in.
        </p>
      </DzAlert>

      <DzAlert v-if="error" color="error" variant="soft" closable @close="setError(null)">
        {{ error }}
      </DzAlert>

      <FormKit
        id="auth-login-form"
        ref="form"
        type="form"
        :actions="false"
        :disabled="formDisabled"
        @submit="onSubmit"
      >
        <div class="space-y-4">
          <FormKit
            type="email"
            name="email"
            label="Email address"
            placeholder="you@example.com"
            validation="required|email"
            validation-label="Email address"
            autocomplete="email"
            :value="presetEmail"
            autofocus
          />

          <div @keydown="syncCapsLock" @keyup="syncCapsLock">
            <FormKit
              ref="passwordField"
              type="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              validation="required"
              validation-label="Password"
              autocomplete="current-password"
              :help="capsLock ? 'Caps Lock is on.' : undefined"
            >
              <template #suffix>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-circle -me-2"
                  :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
                  :aria-pressed="passwordVisible"
                  @click="togglePassword"
                >
                  <EyeOff v-if="passwordVisible" class="size-4" aria-hidden="true" />
                  <Eye v-else class="size-4" aria-hidden="true" />
                </button>
              </template>
            </FormKit>
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between gap-3">
              <FormKit
                v-if="isStatefulSpa"
                type="checkbox"
                name="remember"
                label="Remember me"
                outer-class="!gap-0"
                label-class="text-base-content"
              />
              <span v-else />
              <RouterLink to="/forgot-password" class="link link-primary text-sm">
                Forgot password?
              </RouterLink>
            </div>
            <p v-if="isStatefulSpa" class="text-xs text-base-content/60">
              Only when the backend supports long-lived sessions.
            </p>
          </div>

          <DzButton type="submit" color="primary" block :loading="isLoading" :disabled="!enabled">
            <template v-if="isLoading">Signing in…</template>
            <template v-else>
              Sign in
              <ArrowRight class="size-4" aria-hidden="true" />
            </template>
          </DzButton>
        </div>
      </FormKit>

      <div v-if="config.mock && enabled" class="rounded-box border border-dashed border-base-300 bg-base-200/60 p-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 text-xs">
            <p class="flex items-center gap-1.5 font-semibold">
              <Lock class="size-3.5" aria-hidden="true" />
              Simulated backend — demo credentials
            </p>
            <p class="mt-1 font-mono">{{ MOCK_CREDENTIALS.email }}</p>
            <p class="font-mono">{{ MOCK_CREDENTIALS.password }}</p>
          </div>
          <DzButton size="xs" variant="outline" @click="fillDemoCredentials">Use</DzButton>
        </div>
        <p class="mt-2 text-[11px] leading-snug text-base-content/60">
          VITE_AUTH_MOCK is active: responses are simulated locally, not real Laravel Sanctum.
        </p>
      </div>
    </div>

    <footer class="space-y-2 border-t border-base-300 bg-base-200/40 p-4 text-center text-xs text-base-content/60">
      <p>
        Backend ready?
        <RouterLink to="/backend-integration" class="link link-primary">
          Laravel Sanctum setup guide
        </RouterLink>
      </p>
      <p>
        <RouterLink to="/components" class="link link-hover">
          Continue to the component library
        </RouterLink>
      </p>
    </footer>
  </div>
</template>
