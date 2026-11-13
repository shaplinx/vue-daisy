<script setup lang="ts">
import { useFormKitNodeById } from '@formkit/vue'
import FormActions from '@/components/form/FormActions.vue'
import FormGrid from '@/components/form/FormGrid.vue'
import FormStatus from '@/components/form/FormStatus.vue'
import { useDemoForm } from '@/composables/useDemoForm'

const { status, submitting, lastSubmission, submit } = useDemoForm({
  message: 'Profile updated',
})

const profile = {
  fullName: 'Ada Lovelace',
  email: 'ada@example.com',
  jobTitle: 'Principal Engineer',
  company: 'Analytical Engines Ltd.',
  bio: 'Mathematician, writer and the first computer programmer.',
  timezone: 'Europe/London',
  language: 'en',
  birthDate: '1990-12-10',
  emailNotifications: true,
  publicProfile: false,
  availability: 32,
}

const timezones = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'Europe/Berlin', value: 'Europe/Berlin' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
]

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Français', value: 'fr' },
  { label: '日本語', value: 'ja' },
]

const profileForm = useFormKitNodeById('formkit-profile-form')

function reset(): void {
  profileForm.value?.reset()
}
</script>

<template>
  <div class="space-y-2">
    <FormKit id="formkit-profile-form" type="form" :value="profile" :actions="false" @submit="submit">
      <FormGrid>
        <FormKit type="text" name="fullName" label="Full name" validation="required|alpha_spaces" />
        <FormKit type="email" name="email" label="Email" validation="required|email" />
        <FormKit type="text" name="jobTitle" label="Job title" />
        <FormKit type="text" name="company" label="Company" />
        <FormKit
          type="textarea"
          name="bio"
          label="Bio"
          validation="length:0,280"
          help="Up to 280 characters."
          outer-class="sm:col-span-2"
        />
        <FormKit type="select" name="timezone" label="Timezone" :options="timezones" />
        <FormKit type="select" name="language" label="Language" :options="languages" />
        <FormKit type="date" name="birthDate" label="Date of birth" />
        <FormKit
          type="range"
          name="availability"
          label="Weekly availability"
          min="1"
          max="40"
          step="1"
          help="Hours per week available for project work."
        />
        <FormKit
          type="dzToggle"
          name="emailNotifications"
          label="Email me about account activity"
          outer-class="sm:col-span-2"
        />
        <FormKit
          type="checkbox"
          name="publicProfile"
          label="Make my profile visible to other members"
          outer-class="sm:col-span-2"
        />
      </FormGrid>

      <FormActions>
        <DzButton type="submit" color="primary" :loading="submitting">Save changes</DzButton>
        <DzButton type="button" variant="ghost" @click="reset">Reset to saved profile</DzButton>
      </FormActions>
    </FormKit>

    <FormStatus
      :show="status === 'success'"
      title="Profile updated"
      message="Initial values were seeded through the form’s value prop; changes were validated by FormKit."
    >
      <pre
        v-if="lastSubmission"
        class="mt-3 max-h-48 overflow-auto rounded-box bg-base-100/70 p-3 text-xs"
      >{{ JSON.stringify(lastSubmission, null, 2) }}</pre>
    </FormStatus>
  </div>
</template>
