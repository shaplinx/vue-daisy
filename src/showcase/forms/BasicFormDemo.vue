<script setup lang="ts">
import FormGrid from '@/components/form/FormGrid.vue'
import FormStatus from '@/components/form/FormStatus.vue'
import { useDemoForm } from '@/composables/useDemoForm'

const { status, lastSubmission, submit } = useDemoForm({ message: 'Contact form submitted' })

const topics = [
  { label: 'Product feedback', value: 'product' },
  { label: 'Bug report', value: 'bug' },
  { label: 'Partnership', value: 'partnership' },
  { label: 'Something else', value: 'other' },
]
</script>

<template>
  <div class="space-y-2">
    <FormKit
      id="basic-contact-form"
      type="form"
      submit-label="Send message"
      :submit-attrs="{ class: 'w-full sm:w-auto' }"
      @submit="submit"
    >
      <FormGrid>
        <FormKit
          type="text"
          name="firstName"
          label="First name"
          placeholder="Ada"
          validation="required|alpha"
        />
        <FormKit
          type="text"
          name="lastName"
          label="Last name"
          placeholder="Lovelace"
          validation="required|alpha"
        />
        <FormKit
          type="email"
          name="email"
          label="Email"
          placeholder="ada@example.com"
          validation="required|email"
        />
        <FormKit
          type="text"
          name="company"
          label="Company"
          placeholder="Analytical Engines Ltd."
          help="Optional."
        />
        <FormKit
          type="select"
          name="topic"
          label="Topic"
          placeholder="Choose a topic"
          :options="topics"
          validation="required"
          outer-class="sm:col-span-2"
        />
        <FormKit
          type="textarea"
          name="message"
          label="Message"
          placeholder="Tell us what is on your mind…"
          validation="required|length:20,500"
          help="Between 20 and 500 characters."
          outer-class="sm:col-span-2"
        />
        <FormKit
          type="checkbox"
          name="consent"
          label="I agree to be contacted about this message"
          validation="accepted"
          outer-class="sm:col-span-2"
        />
      </FormGrid>
    </FormKit>

    <FormStatus
      :show="status === 'success'"
      title="Message sent"
      message="FormKit validated every field and the async submit handler resolved."
    >
      <pre
        v-if="lastSubmission"
        class="mt-3 max-h-48 overflow-auto rounded-box bg-base-100/70 p-3 text-xs"
      >{{ JSON.stringify(lastSubmission, null, 2) }}</pre>
    </FormStatus>
  </div>
</template>
