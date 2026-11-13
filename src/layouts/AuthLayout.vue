<script setup lang="ts">
import { Blocks, ShieldCheck } from '@lucide/vue'
import ThemeMenu from '@/components/dashboard/ThemeMenu.vue'
import { useAuth } from '@/composables/useAuth'

const { driver, config } = useAuth()

const driverLabels: Record<string, string> = {
  'sanctum-spa': 'Sanctum Stateful SPA',
  'sanctum-token': 'Sanctum Bearer Token',
  none: 'Authentication Disabled',
}
</script>

<template>
  <div class="relative flex min-h-screen flex-col bg-base-200 text-base-content">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent" />

    <header class="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6">
      <RouterLink to="/" class="flex items-center gap-2.5" aria-label="Vue Daisy home">
        <span
          class="flex size-9 shrink-0 items-center justify-center rounded-box bg-primary text-primary-content shadow-sm"
        >
          <Blocks class="size-5" aria-hidden="true" />
        </span>
        <span>
          <span class="block text-sm font-bold tracking-tight">Vue Daisy</span>
          <span class="block text-[11px] opacity-50">Component Library</span>
        </span>
      </RouterLink>

      <div class="flex items-center gap-2">
        <span class="badge badge-ghost badge-sm hidden sm:inline-flex">
          <ShieldCheck class="size-3" aria-hidden="true" />
          {{ driverLabels[driver] || driver }}
        </span>
        <ThemeMenu />
      </div>
    </header>

    <main class="relative z-10 flex flex-1 items-start justify-center px-4 py-6 sm:items-center sm:py-10">
      <div class="w-full max-w-md">
        <RouterView />
      </div>
    </main>

    <footer class="relative z-10 px-4 pb-6 text-center text-xs text-base-content/50">
      <p>
        {{ config.mock ? 'Simulated Laravel Sanctum backend' : 'Laravel Sanctum authentication' }}
        · {{ driverLabels[driver] || driver }}
      </p>
    </footer>
  </div>
</template>
