<script setup lang="ts">
import { ref } from 'vue'
import { Bell, Palette, Settings, UserRound } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const active = ref('profile')

const tabs = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { id: 'advanced', label: 'Advanced', icon: Settings, disabled: true },
]

const panels: Record<string, string> = {
  profile: 'Update your name, avatar and contact details here.',
  appearance: 'Choose a theme and configure how the interface looks.',
  notifications: 'Decide which events should trigger an email or in-app alert.',
  advanced: 'Advanced configuration is unavailable in this demo.',
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <DzTabs v-model="active" :tabs="tabs" variant="box" aria-label="Account settings">
      <template #panel>
        <div class="rounded-box border border-base-300 bg-base-200/50 p-4 text-sm">
          <p class="font-medium">{{ tabs.find((tab) => tab.id === active)?.label }}</p>
          <p class="mt-1 text-xs opacity-70">{{ panels[active] }}</p>
        </div>
      </template>
    </DzTabs>
    <p class="text-xs text-base-content/60">Arrow keys move between tabs; the disabled tab is skipped.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Box</p>
      <DzTabs :tabs="tabs" variant="box">
        <template #panel><p class="text-sm opacity-70">Boxed tab content.</p></template>
      </DzTabs>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Border</p>
      <DzTabs :tabs="tabs" variant="border">
        <template #panel><p class="text-sm opacity-70">Border tab content.</p></template>
      </DzTabs>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Lift &amp; grow</p>
      <DzTabs :tabs="tabs" variant="lift" grow>
        <template #panel><p class="text-sm opacity-70">Lifted, full-width tabs.</p></template>
      </DzTabs>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <DzTabs v-for="size in ['sm', 'md', 'lg']" :key="size" :tabs="tabs.slice(0, 3)" :size="size" class="mb-3">
        <template #panel><p class="text-sm opacity-70">Size {{ size }}.</p></template>
      </DzTabs>
    </div>
  </div>
</template>
