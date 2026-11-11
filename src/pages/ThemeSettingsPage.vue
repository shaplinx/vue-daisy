<script setup lang="ts">
import { computed } from 'vue'
import { Check, Moon, Palette, Sun } from '@lucide/vue'
import { useTheme } from '@/composables/useTheme'

const { themes, theme, currentTheme, setTheme, toggleTheme } = useTheme()

const activeLabel = computed(() => currentTheme.value?.label || 'Light')
</script>

<template>
  <section class="space-y-6">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-1">
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Theme Settings</h1>
        <p class="max-w-2xl text-sm text-base-content/70">
          Pick one of the six DaisyUI themes below. Your choice is saved in
          <code class="rounded bg-base-200 px-1">localStorage</code> and applied before the app mounts
          on the next visit.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="badge badge-primary gap-1">
          <Palette class="size-3" aria-hidden="true" />
          {{ activeLabel }}
        </span>
        <DzButton variant="outline" size="sm" @click="toggleTheme">
          <Sun v-if="currentTheme?.colorScheme === 'dark'" class="size-4" aria-hidden="true" />
          <Moon v-else class="size-4" aria-hidden="true" />
          Toggle light / dark
        </DzButton>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <button
        v-for="item in themes"
        :key="item.name"
        type="button"
        class="card border bg-base-100 text-start transition hover:-translate-y-0.5 hover:shadow-md"
        :class="theme === item.name ? 'border-primary ring-2 ring-primary/30' : 'border-base-300'"
        :data-theme="item.name"
        :aria-pressed="theme === item.name"
        :aria-label="`Apply ${item.label} theme`"
        @click="setTheme(item.name)"
      >
        <div class="card-body gap-3 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">{{ item.label }}</p>
              <p class="text-xs opacity-60">data-theme="{{ item.name }}"</p>
            </div>
            <span v-if="theme === item.name" class="badge badge-primary badge-sm gap-1">
              <Check class="size-3" aria-hidden="true" /> active
            </span>
            <span v-else class="badge badge-ghost badge-sm">{{ item.colorScheme }}</span>
          </div>

          <div class="rounded-box border border-base-300 bg-base-100 p-3">
            <div class="flex items-center gap-2">
              <span class="size-5 rounded-full bg-primary" aria-hidden="true" />
              <span class="size-5 rounded-full bg-secondary" aria-hidden="true" />
              <span class="size-5 rounded-full bg-accent" aria-hidden="true" />
              <span class="size-5 rounded-full bg-neutral" aria-hidden="true" />
              <span class="size-5 rounded-full bg-info" aria-hidden="true" />
              <span class="size-5 rounded-full bg-success" aria-hidden="true" />
              <span class="size-5 rounded-full bg-warning" aria-hidden="true" />
              <span class="size-5 rounded-full bg-error" aria-hidden="true" />
            </div>
            <div class="mt-3 flex items-center gap-2">
              <span class="btn btn-primary btn-xs pointer-events-none">Primary</span>
              <span class="btn btn-ghost btn-xs pointer-events-none">Ghost</span>
              <span class="badge badge-secondary badge-xs">Badge</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs opacity-60">
            <span>{{ item.colorScheme }} palette</span>
            <span class="inline-flex items-center gap-1">
              <Check v-if="theme === item.name" class="size-3 text-primary" aria-hidden="true" />
              {{ theme === item.name ? 'Applied' : 'Click to apply' }}
            </span>
          </div>
        </div>
      </button>
    </div>

    <div class="rounded-box border border-base-300 bg-base-100 p-4 text-sm text-base-content/70">
      <h2 class="font-semibold text-base-content">How theming works</h2>
      <ul class="mt-2 list-disc space-y-1 ps-5">
        <li>The selected theme is written to <code class="rounded bg-base-200 px-1">&lt;html data-theme&gt;</code>.</li>
        <li>Every component uses semantic DaisyUI tokens, so no per-component colour overrides are needed.</li>
        <li>Each card previews its own palette through a nested <code class="rounded bg-base-200 px-1">data-theme</code> attribute.</li>
      </ul>
    </div>
  </section>
</template>
