<script setup lang="ts">
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const role = ref('developer')
const country = ref('')
const frameworks = ref(['vue'])
const invalid = ref('')

const roles = [
  { label: 'Developer', value: 'developer' },
  { label: 'Designer', value: 'designer' },
  { label: 'Product manager', value: 'pm' },
  { label: 'Support engineer', value: 'support', disabled: true },
]

const countries = [
  { label: 'Europe', group: 'Europe' },
  { label: 'Germany', value: 'de', group: 'Europe' },
  { label: 'France', value: 'fr', group: 'Europe' },
  { label: 'Netherlands', value: 'nl', group: 'Europe' },
  { label: 'North America', group: 'North America' },
  { label: 'United States', value: 'us', group: 'North America' },
  { label: 'Canada', value: 'ca', group: 'North America' },
]

const frameworkOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="grid max-w-2xl gap-4 sm:grid-cols-2">
    <div class="form-control">
      <span class="label-text mb-1">Role</span>
      <DzSelect v-model="role" :options="roles" aria-label="Role" />
    </div>
    <div class="form-control">
      <span class="label-text mb-1">Country (grouped)</span>
      <DzSelect v-model="country" :options="countries" placeholder="Select a country" aria-label="Country" />
    </div>
    <div class="form-control sm:col-span-2">
      <span class="label-text mb-1">Frameworks (multiple)</span>
      <DzSelect v-model="frameworks" :options="frameworkOptions" multiple aria-label="Frameworks" />
    </div>
    <p class="text-xs text-base-content/60 sm:col-span-2">
      Role: <span class="badge badge-ghost badge-sm">{{ role || 'none' }}</span>
      · Country: <span class="badge badge-ghost badge-sm">{{ country || 'none' }}</span>
      · Frameworks: <span class="badge badge-ghost badge-sm">{{ frameworks.join(', ') || 'none' }}</span>
    </p>
  </div>

  <div v-else class="grid gap-4 sm:grid-cols-2">
    <DzSelect :model-value="'developer'" :options="roles" aria-label="Default select" />
    <DzSelect :model-value="''" :options="roles" placeholder="With placeholder" aria-label="Placeholder select" />
    <DzSelect :model-value="'vue'" :options="frameworkOptions" size="sm" color="primary" aria-label="Small primary" />
    <DzSelect :model-value="'vue'" :options="frameworkOptions" size="lg" color="secondary" aria-label="Large secondary" />
    <DzSelect :model-value="''" :options="roles" ghost aria-label="Ghost select" />
    <DzSelect :model-value="''" :options="roles" invalid placeholder="Invalid state" aria-label="Invalid select" />
    <DzSelect :model-value="''" :options="roles" disabled placeholder="Disabled" aria-label="Disabled select" />
    <DzSelect :model-value="''" :options="countries" placeholder="Grouped options" aria-label="Grouped select" />
    <div class="sm:col-span-2">
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Validation feedback</p>
      <DzSelect
        v-model="invalid"
        :options="roles"
        :invalid="!invalid"
        placeholder="Choose a role to clear the error"
        aria-label="Validated select"
      />
      <p class="mt-1 text-xs" :class="invalid ? 'text-success' : 'text-error'">
        {{ invalid ? 'Looks good.' : 'A role is required.' }}
      </p>
    </div>
  </div>
</template>
