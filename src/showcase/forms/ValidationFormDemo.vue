<script setup lang="ts">
import { ref } from 'vue'
import FormActions from '@/components/form/FormActions.vue'
import FormGrid from '@/components/form/FormGrid.vue'
import FormStatus from '@/components/form/FormStatus.vue'
import { useDemoForm } from '@/composables/useDemoForm'

const { status, submitting, lastSubmission, submit } = useDemoForm({
  message: 'Complex form submitted',
})

const contactMethod = ref('email')

const contactOptions = [
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'SMS', value: 'sms' },
]
</script>

<template>
  <div class="space-y-2">
    <FormKit id="formkit-validation-form" type="form" :actions="false" @submit="submit">
      <FormGrid>
        <FormKit
          type="text"
          name="projectName"
          label="Project name"
          validation="required|length:3,40"
          validation-visibility="live"
        />
        <FormKit
          type="email"
          name="email"
          label="Contact email"
          validation="required|email|noDisposableEmail"
          validation-visibility="live"
        />
        <FormKit
          type="number"
          name="age"
          label="Age"
          validation="required|number|min:18|max:120"
          validation-visibility="live"
          help="Numeric validation with a minimum and maximum."
        />
        <FormKit
          type="number"
          name="budget"
          label="Budget (USD)"
          validation="required|number|between:100,10000"
          validation-visibility="live"
        />
        <FormKit
          type="url"
          name="website"
          label="Website"
          placeholder="https://example.com"
          validation="url"
          validation-visibility="live"
          help="Optional, but must be a valid URL when provided."
        />
        <FormKit
          type="text"
          name="projectCode"
          label="Project code"
          placeholder="ABC-1234"
          validation="required|matches:/^[A-Z]{3}-[0-9]{4}$/"
          validation-visibility="live"
          help="Three uppercase letters, a dash and four digits."
        />

        <FormKit
          type="radio"
          name="contactMethod"
          label="Preferred contact method"
          :options="contactOptions"
          v-model="contactMethod"
          validation="required"
          outer-class="sm:col-span-2"
        />

        <FormKit
          v-if="contactMethod === 'phone' || contactMethod === 'sms'"
          type="text"
          name="phone"
          label="Phone number"
          placeholder="+1 555 0100"
          validation="required|matches:/^\+?[0-9 ()-]{7,}$/"
          validation-visibility="live"
          outer-class="sm:col-span-2"
          help="Conditionally required — this field only exists while Phone or SMS is selected."
        />

        <FormKit
          type="date"
          name="startDate"
          label="Start date"
          validation="required"
          validation-visibility="live"
        />
        <FormKit
          type="date"
          name="endDate"
          label="End date"
          validation="required|date_after_node:startDate"
          validation-visibility="live"
          help="Cross-field rule: must be after the start date."
        />

        <FormKit
          type="password"
          name="password"
          label="Project password"
          validation="required|strongPassword"
          validation-visibility="live"
        />
        <FormKit
          type="password"
          name="passwordConfirm"
          label="Confirm password"
          validation="required|confirm:password"
          validation-visibility="live"
        />
      </FormGrid>

      <FormActions>
        <DzButton type="submit" color="primary" :loading="submitting">Validate and submit</DzButton>
        <span class="text-xs text-base-content/60">
          Errors appear live; submission is blocked until every rule passes.
        </span>
      </FormActions>
    </FormKit>

    <FormStatus
      :show="status === 'success'"
      title="All rules passed"
      message="Required, email, length, numeric, custom, cross-field and conditional validation all succeeded."
    >
      <pre
        v-if="lastSubmission"
        class="mt-3 max-h-48 overflow-auto rounded-box bg-base-100/70 p-3 text-xs"
      >{{ JSON.stringify(lastSubmission, null, 2) }}</pre>
    </FormStatus>
  </div>
</template>
