<script setup lang="ts">
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const date = ref('2026-11-10')
const month = ref('2026-11')
const time = ref('14:30')
const local = ref('2026-11-10T14:30')
</script>

<template>
  <div v-if="mode !== 'variants'" class="grid max-w-xl gap-4 sm:grid-cols-2">
    <DzCalendar v-model="date" label="Start date" />
    <DzCalendar v-model="time" type="time" label="Preferred time" />
    <p class="text-xs text-base-content/60 sm:col-span-2">
      Selected: <span class="badge badge-ghost badge-sm">{{ date }} · {{ time }}</span>
    </p>
  </div>

  <div v-else class="grid gap-4 sm:grid-cols-2">
    <DzCalendar v-model="date" label="Date" />
    <DzCalendar v-model="month" type="month" label="Month" />
    <DzCalendar v-model="time" type="time" label="Time" />
    <DzCalendar v-model="local" type="datetime-local" label="Date &amp; time" />
    <DzCalendar v-model="date" size="sm" color="primary" label="Small primary" />
    <DzCalendar v-model="date" size="lg" color="secondary" label="Large secondary" />
    <DzCalendar v-model="date" :disabled="true" label="Disabled" />
    <DzCalendar v-model="date" :min="'2026-01-01'" :max="'2026-12-31'" label="Min / max" />
  </div>
</template>
