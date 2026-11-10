<script setup>
import { computed, ref } from 'vue'
import { Bell, Check, Info, Palette, RotateCcw, SunMoon } from '@lucide/vue'
import { useTheme } from '@/composables/useTheme'
import { useToast } from '@/composables/useToast'

const { theme, currentTheme, isDark, setTheme } = useTheme()
const toast = useToast()

const SETTINGS_KEY = 'vue-daisy:preferences'

function readPreferences() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
  } catch {
    return {}
  }
}

const preferences = ref({
  productUpdates: true,
  securityAlerts: true,
  weeklyDigest: false,
  ...readPreferences(),
})

function savePreferences() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(preferences.value))
  } catch {
    // Storage may be unavailable; in-memory state still works.
  }
  toast.success('Preferences saved')
}

function resetPreferences() {
  try {
    localStorage.removeItem('vue-daisy:theme')
    localStorage.removeItem('vue-daisy:sidebar-collapsed')
    localStorage.removeItem(SETTINGS_KEY)
  } catch {
    // Ignore storage failures.
  }
  setTheme('light')
  preferences.value = { productUpdates: true, securityAlerts: true, weeklyDigest: false }
  toast.info('Local preferences reset')
}

const activeTheme = computed(() => currentTheme.value?.label || 'Light')
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
      <p class="max-w-2xl text-sm text-base-content/70">
        Application preferences stored locally in your browser. No account or backend is required for
        this demo.
      </p>
    </header>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-box border border-base-300 bg-base-100">
        <div class="border-b border-base-300 p-4">
          <h2 class="flex items-center gap-2 font-semibold">
            <Palette class="size-4 text-primary" aria-hidden="true" />
            Appearance
          </h2>
          <p class="mt-1 text-xs text-base-content/60">The active theme applies across every page and component.</p>
        </div>
        <div class="space-y-4 p-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium">Current theme</p>
              <p class="text-xs text-base-content/60">Persisted as <code class="rounded bg-base-200 px-1">data-theme="{{ theme }}"</code></p>
            </div>
            <span class="badge badge-primary">{{ activeTheme }}</span>
          </div>

          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium">Dark mode</p>
              <p class="text-xs text-base-content/60">Quickly toggle between light and dark.</p>
            </div>
            <DzToggle
              :model-value="isDark"
              color="primary"
              label="Dark mode"
              @update:model-value="setTheme($event ? 'dark' : 'light')"
            />
          </div>

          <DzButton variant="outline" size="sm" to="/themes">
            <SunMoon class="size-4" aria-hidden="true" />
            Open theme settings
          </DzButton>
        </div>
      </div>

      <div class="rounded-box border border-base-300 bg-base-100">
        <div class="border-b border-base-300 p-4">
          <h2 class="flex items-center gap-2 font-semibold">
            <Bell class="size-4 text-primary" aria-hidden="true" />
            Notifications
          </h2>
          <p class="mt-1 text-xs text-base-content/60">Choose which demo notifications you would like to receive.</p>
        </div>
        <div class="space-y-4 p-4">
          <DzToggle v-model="preferences.productUpdates" label="Product updates" description="New components and features." />
          <DzToggle v-model="preferences.securityAlerts" label="Security alerts" description="Important account and security notices." />
          <DzToggle v-model="preferences.weeklyDigest" label="Weekly digest" description="A short summary every Monday." />
          <DzButton size="sm" color="primary" @click="savePreferences">
            <Check class="size-4" aria-hidden="true" />
            Save preferences
          </DzButton>
        </div>
      </div>
    </div>

    <div class="rounded-box border border-base-300 bg-base-100">
      <div class="border-b border-base-300 p-4">
        <h2 class="flex items-center gap-2 font-semibold">
          <Info class="size-4 text-primary" aria-hidden="true" />
          About
        </h2>
      </div>
      <div class="grid gap-4 p-4 text-sm sm:grid-cols-2">
        <dl class="space-y-2">
          <div class="flex justify-between gap-4"><dt class="opacity-60">Version</dt><dd class="font-medium">0.1.0</dd></div>
          <div class="flex justify-between gap-4"><dt class="opacity-60">Milestone</dt><dd class="font-medium">1 — Component foundation</dd></div>
          <div class="flex justify-between gap-4"><dt class="opacity-60">Vue</dt><dd class="font-medium">3.5</dd></div>
        </dl>
        <dl class="space-y-2">
          <div class="flex justify-between gap-4"><dt class="opacity-60">Vite</dt><dd class="font-medium">8</dd></div>
          <div class="flex justify-between gap-4"><dt class="opacity-60">Tailwind CSS</dt><dd class="font-medium">4</dd></div>
          <div class="flex justify-between gap-4"><dt class="opacity-60">DaisyUI</dt><dd class="font-medium">5</dd></div>
        </dl>
      </div>
      <div class="flex flex-col gap-2 border-t border-base-300 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs text-base-content/60">
          Resetting clears the theme, sidebar state and notification preferences.
        </p>
        <DzButton variant="outline" size="sm" color="error" @click="resetPreferences">
          <RotateCcw class="size-4" aria-hidden="true" />
          Reset local preferences
        </DzButton>
      </div>
    </div>
  </section>
</template>
