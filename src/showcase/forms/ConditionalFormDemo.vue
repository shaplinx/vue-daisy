<script setup lang="ts">
import { computed, ref } from 'vue'
import FormActions from '@/components/form/FormActions.vue'
import FormGrid from '@/components/form/FormGrid.vue'
import FormStatus from '@/components/form/FormStatus.vue'
import { useDemoForm } from '@/composables/useDemoForm'

const { status, submitting, lastSubmission, submit } = useDemoForm({
  message: 'Conditional form submitted',
})

const accountType = ref('personal')
const country = ref('US')
const newsletter = ref(true)

const accountOptions = [
  { label: 'Personal', value: 'personal' },
  { label: 'Business', value: 'business' },
]

const countries = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'Germany', value: 'DE' },
  { label: 'Japan', value: 'JP' },
]

const states = [
  { label: 'California', value: 'CA' },
  { label: 'New York', value: 'NY' },
  { label: 'Texas', value: 'TX' },
  { label: 'Washington', value: 'WA' },
]

const provinces = [
  { label: 'Ontario', value: 'ON' },
  { label: 'Quebec', value: 'QC' },
  { label: 'British Columbia', value: 'BC' },
  { label: 'Alberta', value: 'AB' },
]

const companySizes = [
  { label: '1–10 people', value: 'small' },
  { label: '11–50 people', value: 'medium' },
  { label: '51–250 people', value: 'large' },
  { label: '250+ people', value: 'enterprise' },
]

const postalLabel = computed(() => {
  if (country.value === 'US') return 'ZIP code'
  if (country.value === 'CA') return 'Postal code'
  if (country.value === 'DE') return 'Postleitzahl'
  return 'Postal code'
})
</script>

<template>
  <div class="space-y-2">
    <div role="status" class="alert alert-info alert-soft mb-4 items-start">
      <span class="text-sm">
        This form is still a normal Vue template. Conditional fields are plain
        <code class="rounded bg-base-100/70 px-1 py-0.5 text-[0.85em]">v-if</code> blocks driven by
        <code class="rounded bg-base-100/70 px-1 py-0.5 text-[0.85em]">v-model</code> — no schema
        arrays are involved.
      </span>
    </div>

    <FormKit id="conditional-form" type="form" :actions="false" @submit="submit">
      <FormGrid>
        <FormKit
          type="radio"
          name="accountType"
          label="Account type"
          :options="accountOptions"
          v-model="accountType"
          validation="required"
          outer-class="sm:col-span-2"
        />

        <FormKit
          type="text"
          name="fullName"
          label="Full name"
          validation="required|alpha_spaces"
        />
        <FormKit
          type="email"
          name="email"
          label="Email"
          validation="required|email"
        />

        <template v-if="accountType === 'business'">
          <FormKit
            type="text"
            name="companyName"
            label="Company name"
            validation="required"
            help="Shown because the account type is Business."
          />
          <FormKit
            type="text"
            name="vatNumber"
            label="VAT number"
            placeholder="DE123456789"
            validation="required|matches:/^[A-Z]{2}[0-9A-Z]{8,12}$/"
            help="Two country letters followed by 8–12 alphanumeric characters."
          />
          <FormKit
            type="select"
            name="companySize"
            label="Company size"
            placeholder="Choose a size"
            :options="companySizes"
            validation="required"
            outer-class="sm:col-span-2"
          />
        </template>

        <template v-else>
          <FormKit type="date" name="birthDate" label="Date of birth" validation="required" />
          <FormKit
            type="dzToggle"
            name="newsletter"
            label="Send me the personal account newsletter"
            v-model="newsletter"
            help="This toggle only exists for personal accounts."
          />
        </template>

        <FormKit
          type="select"
          name="country"
          label="Country"
          :options="countries"
          v-model="country"
          validation="required"
        />
        <FormKit
          type="text"
          name="postalCode"
          :label="postalLabel"
          validation="required"
        />

        <FormKit
          v-if="country === 'US'"
          type="select"
          name="state"
          label="State"
          placeholder="Choose a state"
          :options="states"
          validation="required"
          outer-class="sm:col-span-2"
        />
        <FormKit
          v-if="country === 'CA'"
          type="select"
          name="province"
          label="Province"
          placeholder="Choose a province"
          :options="provinces"
          validation="required"
          outer-class="sm:col-span-2"
        />
      </FormGrid>

      <FormActions>
        <DzButton type="submit" color="primary" :loading="submitting">Submit conditional form</DzButton>
      </FormActions>
    </FormKit>

    <FormStatus
      :show="status === 'success'"
      title="Conditional form submitted"
      message="Only the currently rendered fields were validated and included in the payload."
    >
      <pre
        v-if="lastSubmission"
        class="mt-3 max-h-48 overflow-auto rounded-box bg-base-100/70 p-3 text-xs"
      >{{ JSON.stringify(lastSubmission, null, 2) }}</pre>
    </FormStatus>
  </div>
</template>
