<script setup>
import { computed } from 'vue'
import { Check, Moon, Palette, Sun } from '@lucide/vue'
import DzDropdown from '@/components/ui/actions/DzDropdown.vue'
import DzButton from '@/components/ui/actions/DzButton.vue'
import { useTheme } from '@/composables/useTheme'

const { themes, theme, currentTheme, isDark, setTheme } = useTheme()

const label = computed(() => currentTheme.value?.label || 'Theme')
</script>

<template>
  <DzDropdown placement="end" content-class="w-72 p-3">
    <template #trigger="{ toggle, open }">
      <DzButton
        variant="ghost"
        circle
        :aria-label="`Theme: ${label}`"
        :aria-expanded="open"
        @click="toggle"
      >
        <Sun v-if="!isDark" class="size-5" aria-hidden="true" />
        <Moon v-else class="size-5" aria-hidden="true" />
      </DzButton>
    </template>

    <div class="mb-2 flex items-center justify-between px-1">
      <span class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide opacity-60">
        <Palette class="size-3.5" aria-hidden="true" />
        Theme
      </span>
      <span class="badge badge-ghost badge-sm">{{ label }}</span>
    </div>

    <div class="grid grid-cols-2 gap-1.5">
      <button
        v-for="item in themes"
        :key="item.name"
        type="button"
        class="flex items-center gap-2 rounded-box border border-base-300 p-2 text-start text-xs transition-colors hover:bg-base-200"
        :class="{ 'border-primary bg-primary/5': theme === item.name }"
        @click="setTheme(item.name)"
      >
        <span
          class="flex size-7 shrink-0 items-center gap-0.5 rounded-box bg-base-100 p-1"
          :data-theme="item.name"
          aria-hidden="true"
        >
          <span class="h-4 w-1 rounded-full bg-primary" />
          <span class="h-4 w-1 rounded-full bg-secondary" />
          <span class="h-4 w-1 rounded-full bg-accent" />
        </span>
        <span class="flex-1">{{ item.label }}</span>
        <Check v-if="theme === item.name" class="size-3.5 text-primary" aria-hidden="true" />
      </button>
    </div>
  </DzDropdown>
</template>
