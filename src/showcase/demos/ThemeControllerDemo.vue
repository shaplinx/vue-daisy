<script setup lang="ts">
import { computed, ref } from 'vue'
import { Moon, Sun } from '@lucide/vue'
import { useTheme } from '@/composables/useTheme'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const { theme, isDark, setTheme } = useTheme()

const checked = computed(() => isDark.value)
const rotate = ref(true)
const flip = ref(false)
const small = ref(true)
const medium = ref(true)
const large = ref(true)
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <div class="flex flex-wrap items-center gap-4">
      <DzThemeController
        :model-value="checked"
        size="lg"
        @update:model-value="setTheme($event ? 'dark' : 'light')"
      >
        <template #on><Moon class="size-6" aria-hidden="true" /></template>
        <template #off><Sun class="size-6" aria-hidden="true" /></template>
      </DzThemeController>
      <div class="text-sm">
        <p class="font-medium">Theme controller</p>
        <p class="text-xs text-base-content/60">
          Current theme: <span class="badge badge-primary badge-sm">{{ theme }}</span> — this actually
          applies the theme.
        </p>
      </div>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Animations</p>
      <div class="flex items-center gap-8">
        <DzThemeController v-model="rotate" animation="rotate" aria-label="Rotate theme toggle">
          <template #on><Moon class="size-5" aria-hidden="true" /></template>
          <template #off><Sun class="size-5" aria-hidden="true" /></template>
        </DzThemeController>
        <DzThemeController v-model="flip" animation="flip" aria-label="Flip theme toggle">
          <template #on><Moon class="size-5" aria-hidden="true" /></template>
          <template #off><Sun class="size-5" aria-hidden="true" /></template>
        </DzThemeController>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex items-center gap-8">
        <DzThemeController v-model="small" size="sm" aria-label="Small theme toggle">
          <template #on><Moon class="size-4" aria-hidden="true" /></template>
          <template #off><Sun class="size-4" aria-hidden="true" /></template>
        </DzThemeController>
        <DzThemeController v-model="medium" size="md" aria-label="Medium theme toggle">
          <template #on><Moon class="size-5" aria-hidden="true" /></template>
          <template #off><Sun class="size-5" aria-hidden="true" /></template>
        </DzThemeController>
        <DzThemeController v-model="large" size="lg" aria-label="Large theme toggle">
          <template #on><Moon class="size-6" aria-hidden="true" /></template>
          <template #off><Sun class="size-6" aria-hidden="true" /></template>
        </DzThemeController>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Disabled</p>
      <DzThemeController :model-value="false" disabled aria-label="Disabled theme toggle">
        <template #on><Moon class="size-5" aria-hidden="true" /></template>
        <template #off><Sun class="size-5" aria-hidden="true" /></template>
      </DzThemeController>
    </div>
  </div>
</template>
