<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, KeyRound } from '@lucide/vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { toAuthError } from '@/auth/utils'

interface ResetFormData {
  email: string
  password: string
  password_confirmation: string
}

const route = useRoute()
const { config, resetPassword, enabled } = useAuth()
const toast = useToast()

const token = computed(() => (typeof route.query.token === 'string' ? route.query.token : ''))
const presetEmail = computed(() => (typeof route.query.email === 'string' ? route.query.email : ''))
const available = computed(() => Boolean(config.value.endpoints.resetPassword))

const submitting = ref(false)
const done = ref(false)
const message = ref<string | null>(null)

async function onSubmit(data: ResetFormData): Promise<void> {
  message.value = null
  submitting.value = true
  try {
    await resetPassword({
      token: token.value,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
    })
    done.value = true
    toast.success('Password reset successfully')
  } catch (cause) {
    message.value = toAuthError(cause, 'Could not reset the password.').message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="rounded-box border border-base-300 bg-base-100 shadow-sm">
    <header class="space-y-1.5 border-b border-base-300 p-6">
      <span class="flex size-10 items-center justify-center rounded-box bg-primary/10 text-primary">
        <KeyRound class="size-5" aria-hidden="true" />
      </span>
      <h1 class="pt-1 text-xl font-bold tracking-tight">Reset password</h1>
      <p class="text-sm text-base-content/60">Choose a new password for your account.</p>
    </header>

    <div class="space-y-4 p-6">
      <DzAlert v-if="!enabled" color="info" variant="soft">
        Authentication is disabled for this deployment, so password resets are unavailable.
      </DzAlert>

      <DzAlert v-else-if="!available" color="warning" variant="soft" role="alert">
        <p class="font-semibold">Password reset is not configured</p>
        <p class="mt-1 text-sm">
          Set <code class="rounded bg-base-200 px-1">VITE_AUTH_RESET_PASSWORD_ENDPOINT</code> to
          enable this feature for your Laravel backend.
        </p>
      </DzAlert>

      <template v-else-if="done">
        <DzAlert color="success" variant="soft" role="status">
          Your password has been reset. You can now sign in with the new password.
        </DzAlert>
        <DzButton to="/login" color="primary" block>Go to sign in</DzButton>
      </template>

      <DzAlert v-else-if="!token" color="warning" variant="soft" role="alert">
        This reset link is missing its token. Request a new link from the
        <RouterLink to="/forgot-password" class="link">forgot password</RouterLink> page.
      </DzAlert>

      <template v-else>
        <DzAlert v-if="message" color="error" variant="soft" role="alert">{{ message }}</DzAlert>

        <FormKit
          id="auth-reset-form"
          type="form"
          :actions="false"
          :disabled="submitting"
          @submit="onSubmit"
        >
          <div class="space-y-4">
            <FormKit
              type="email"
              name="email"
              label="Email"
              :value="presetEmail"
              validation="required|email"
              autocomplete="email"
            />
            <FormKit
              type="password"
              name="password"
              label="New password"
              placeholder="••••••••"
              validation="required|length:8"
              help="At least 8 characters."
              autocomplete="new-password"
            />
            <FormKit
              type="password"
              name="password_confirmation"
              label="Confirm new password"
              placeholder="••••••••"
              validation="required|confirm:password"
              autocomplete="new-password"
            />
            <DzButton type="submit" color="primary" block :loading="submitting">
              {{ submitting ? 'Resetting…' : 'Reset password' }}
            </DzButton>
          </div>
        </FormKit>
      </template>

      <RouterLink to="/login" class="inline-flex items-center gap-1 text-sm link link-hover">
        <ArrowLeft class="size-4" aria-hidden="true" />
        Back to sign in
      </RouterLink>
    </div>
  </div>
</template>
