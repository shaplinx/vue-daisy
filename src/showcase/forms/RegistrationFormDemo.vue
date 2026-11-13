<script setup lang="ts">
import { useFormKitNodeById } from '@formkit/vue'
import FormActions from '@/components/form/FormActions.vue'
import FormGrid from '@/components/form/FormGrid.vue'
import FormStatus from '@/components/form/FormStatus.vue'
import { useDemoForm } from '@/composables/useDemoForm'

const { status, submitting, lastSubmission, submit } = useDemoForm({
  message: 'Account created successfully',
})

const registrationForm = useFormKitNodeById('formkit-registration-form')

function reset(): void {
  registrationForm.value?.reset()
}

const roles = [
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Product manager', value: 'product' },
  { label: 'Other', value: 'other' },
]
</script>

<template>
  <div class="space-y-2">
    <FormKit id="formkit-registration-form" type="form" :actions="false" @submit="submit">
      <FormGrid>
        <FormKit
          type="text"
          name="fullName"
          label="Full name"
          placeholder="Ada Lovelace"
          validation="required|alpha_spaces|length:2,60"
        />
        <FormKit
          type="text"
          name="username"
          label="Username"
          placeholder="ada"
          validation="required|alphanumeric|length:3,20|availableUsername"
          validation-visibility="live"
          help="Try “admin” or “root” to see async availability validation."
        />
        <FormKit
          type="email"
          name="email"
          label="Work email"
          placeholder="ada@example.com"
          validation="required|email|noDisposableEmail"
          help="Disposable email domains are rejected by a custom rule."
        />
        <FormKit
          type="select"
          name="role"
          label="Role"
          placeholder="Choose a role"
          :options="roles"
          validation="required"
        />
        <FormKit
          type="password"
          name="password"
          label="Password"
          validation="required|strongPassword"
          validation-visibility="live"
          help="8+ characters with upper, lower and numeric characters."
        />
        <FormKit
          type="password"
          name="passwordConfirm"
          label="Confirm password"
          validation="required|confirm:password"
          validation-visibility="live"
        />
        <FormKit
          type="checkbox"
          name="terms"
          label="I accept the terms of service and privacy policy"
          validation="accepted"
          outer-class="sm:col-span-2"
        />
        <FormKit
          type="dzToggle"
          name="newsletter"
          label="Send me product updates"
          help="This toggle is rendered by the custom dzToggle input."
          outer-class="sm:col-span-2"
        />
      </FormGrid>

      <FormActions>
        <DzButton type="submit" color="primary" :loading="submitting">Create account</DzButton>
        <DzButton type="button" variant="ghost" @click="reset">Reset</DzButton>
      </FormActions>
    </FormKit>

    <FormStatus
      :show="status === 'success'"
      title="Account created"
      message="Registration passed required, email, length, custom, async and cross-field validation."
    >
      <pre
        v-if="lastSubmission"
        class="mt-3 max-h-48 overflow-auto rounded-box bg-base-100/70 p-3 text-xs"
      >{{ JSON.stringify(lastSubmission, null, 2) }}</pre>
    </FormStatus>
  </div>
</template>
