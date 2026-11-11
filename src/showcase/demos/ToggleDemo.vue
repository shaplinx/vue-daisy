<script setup lang="ts">
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const notifications = ref(true)
const analytics = ref(false)
const marketing = ref(false)
const darkMode = ref(true)
</script>

<template>
  <div v-if="mode !== 'variants'" class="max-w-md space-y-5">
    <div class="rounded-box border border-base-300 p-4">
      <p class="mb-3 text-xs font-semibold uppercase tracking-widest opacity-50">Preferences</p>
      <div class="space-y-4">
        <DzToggle
          v-model="notifications"
          label="Email notifications"
          description="Product updates and account activity."
          color="primary"
        />
        <DzToggle
          v-model="analytics"
          label="Usage analytics"
          description="Help us improve with anonymous metrics."
          color="secondary"
        />
        <DzToggle
          v-model="marketing"
          label="Marketing emails"
          description="Occasional tips and feature announcements."
        />
      </div>
    </div>
    <DzToggle v-model="darkMode" label="Dark mode" color="accent" />
    <p class="text-xs text-base-content/60">
      Notifications are <span class="font-semibold">{{ notifications ? 'on' : 'off' }}</span> ·
      analytics are <span class="font-semibold">{{ analytics ? 'on' : 'off' }}</span>.
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap gap-5">
        <DzToggle
          v-for="color in ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']"
          :key="color"
          :model-value="true"
          :color="color"
          :label="color"
        />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-center gap-5">
        <DzToggle
          v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']"
          :key="size"
          :model-value="true"
          :size="size"
          :label="`Size ${size}`"
        />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">States &amp; slots</p>
      <div class="flex flex-wrap items-center gap-5">
        <DzToggle :model-value="false" label="Off" />
        <DzToggle :model-value="true" label="On" />
        <DzToggle :model-value="true" disabled label="Disabled" />
        <DzToggle :model-value="true">
          <span class="inline-flex items-center gap-2">
            Custom slot
            <span class="badge badge-success badge-xs" />
          </span>
        </DzToggle>
      </div>
    </div>
  </div>
</template>
