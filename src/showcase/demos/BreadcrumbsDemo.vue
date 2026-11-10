<script setup>
import { Home, Layers, Settings, Slash } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()

const items = [
  { label: 'Home', to: '/dashboard', icon: Home },
  { label: 'Component Library', to: '/components', icon: Layers },
  { label: 'Navigation', to: { path: '/components', query: { category: 'navigation' } } },
  { label: 'Breadcrumbs' },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <DzBreadcrumbs :items="items" />
    <DzBreadcrumbs :items="items.slice(0, 2)" />
    <p class="text-xs text-base-content/60">Links are real router links; the final item is marked as the current page.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom separator</p>
      <DzBreadcrumbs :items="items" :separator="Slash" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Icons</p>
      <DzBreadcrumbs :items="[items[0], { label: 'Settings', to: '/settings', icon: Settings }, { label: 'Theme Settings' }]" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Long path (scrolls horizontally)</p>
      <DzBreadcrumbs
        :items="[
          { label: 'Home', to: '/' },
          { label: 'Workspace', to: '/dashboard' },
          { label: 'Component Library', to: '/components' },
          { label: 'Navigation', to: { path: '/components', query: { category: 'navigation' } } },
          { label: 'Breadcrumbs' },
        ]"
      />
    </div>
  </div>
</template>
