<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft, MailCheck, MailQuestion } from '@lucide/vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { toAuthError } from '@/auth/utils'

const { config, forgotPassword, enabled } = useAuth()
const toast = useToast()

const available = computed(() => Boolean(config.value.endpoints.forgotPassword))
const sending = ref(false)
const sent = ref(false)
const message = ref<string | null>(null)

async function onSubmit(data: { email: string }): Promise<void> {
  message.value = null
  sending.value = true
  try {
    await forgotPassword(data.email)
    sent.value = true
    toast.success('Password reset request sent')
  } catch (cause) {
    message.value = toAuthError(cause, 'Could not send the password reset link.').message
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="rounded-box border border-base-300 bg-base-100 shadow-sm">
    <header class="space-y-1.5 border-b border-base-300 p-6">
      <span class="flex size-10 items-center justify-center rounded-box bg-primary/10 text-primary">
        <MailQuestion class="size-5" aria-hidden="true" />
      </span>
      <h1 class="pt-1 text-xl font-bold tracking-tight">Forgot password</h1>
      <p class="text-sm text-base-content/60">
        We will email a reset link when the backend exposes the endpoint.
      </p>
    </header>

    <div class="space-y-4 p-6">
      <DzAlert v-if="!enabled" color="info" variant="soft">
        Authentication is disabled for this deployment, so password resets are unavailable.
      </DzAlert>

      <DzAlert v-else-if="!available" color="warning" variant="soft" role="alert">
        <p class="font-semibold">Password reset is not configured</p>
        <p class="mt-1 text-sm">
          Set <code class="rounded bg-base-200 px-1">VITE_AUTH_FORGOT_PASSWORD_ENDPOINT</code> to
          enable this feature for your Laravel backend.
        </p>
      </DzAlert>

      <template v-else-if="sent">
        <DzAlert color="success" variant="soft" role="status" :icon="MailCheck">
          If that address exists, a password reset link has been sent.
        </DzAlert>
        <DzButton to="/login" variant="outline" block>Back to sign in</DzButton>
      </template>

      <template v-else>
        <DzAlert v-if="message" color="error" variant="soft" role="alert">{{ message }}</DzAlert>

        <FormKit
          id="auth-forgot-form"
          type="form"
          :actions="false"
          :disabled="sending"
          @submit="onSubmit"
        >
          <div class="space-y-4">
            <FormKit
              type="email"
              name="email"
              label="Email"
              placeholder="you@example.com"
              validation="required|email"
              autocomplete="email"
            />
            <DzButton type="submit" color="primary" block :loading="sending">
              {{ sending ? 'Sending…' : 'Send reset link' }}
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
