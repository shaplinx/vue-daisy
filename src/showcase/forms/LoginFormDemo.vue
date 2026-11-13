<script setup lang="ts">
import FormActions from '@/components/form/FormActions.vue'
import FormStatus from '@/components/form/FormStatus.vue'
import { useDemoForm } from '@/composables/useDemoForm'

const { status, submitting, submit } = useDemoForm({ message: 'Signed in successfully' })
</script>

<template>
  <div class="space-y-2">
    <FormKit id="formkit-login-form" type="form" :actions="false" @submit="submit">
      <div class="mx-auto w-full max-w-md space-y-4">
        <FormKit
          type="email"
          name="email"
          label="Email"
          placeholder="you@example.com"
          validation="required|email"
          autocomplete="email"
        />
        <FormKit
          type="password"
          name="password"
          label="Password"
          placeholder="••••••••"
          validation="required|length:8"
          help="At least 8 characters."
          autocomplete="current-password"
        />

        <div class="flex flex-wrap items-center justify-between gap-3">
          <FormKit
            type="checkbox"
            name="remember"
            label="Remember me"
            :value="true"
            outer-class="!gap-0"
          />
          <a href="#" class="link link-primary text-sm" @click.prevent>Forgot password?</a>
        </div>

        <FormActions class="!mt-2">
          <DzButton type="submit" color="primary" block :loading="submitting">Sign in</DzButton>
        </FormActions>

        <p class="text-center text-xs text-base-content/60">
          No account yet?
          <a href="#" class="link link-primary" @click.prevent>Create one</a>
        </p>
      </div>
    </FormKit>

    <FormStatus
      :show="status === 'success'"
      title="Welcome back"
      message="The login form submitted with valid credentials."
    />
  </div>
</template>
