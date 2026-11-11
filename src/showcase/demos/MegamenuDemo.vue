<script setup lang="ts">
import { Blocks, BookOpen, Compass, Layers, LifeBuoy, Palette, Settings, Sparkles } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'
import type { MegaMenuItem } from '@/components/ui/navigation/DzMegamenu.vue'

const mode = useDemoMode()

const items: MegaMenuItem[] = [
  { id: 'library', label: 'Library', icon: Layers },
  {
    id: 'components',
    label: 'Components',
    icon: Blocks,
    groups: [
      {
        title: 'Browse',
        links: [
          { label: 'Actions', description: 'Buttons, modals, dropdowns', to: { path: '/components', query: { category: 'actions' } }, icon: Sparkles },
          { label: 'Data display', description: 'Cards, tables, timelines', to: { path: '/components', query: { category: 'data-display' } }, icon: Layers },
          { label: 'Navigation', description: 'Menus, tabs, pagination', to: { path: '/components', query: { category: 'navigation' } }, icon: Compass },
        ],
      },
      {
        title: 'Learn',
        links: [
          { label: 'Documentation', description: 'DaisyUI component reference', href: 'https://daisyui.com/components/', icon: BookOpen },
          { label: 'Themes', description: 'Preview all six themes', to: '/themes', icon: Palette },
        ],
      },
      {
        title: 'Support',
        links: [
          { label: 'Help centre', description: 'Guides and FAQs', href: 'https://daisyui.com/', icon: LifeBuoy },
          { label: 'Settings', description: 'Application preferences', to: '/settings', icon: Settings },
        ],
      },
    ],
  },
  { id: 'docs', label: 'Docs', icon: BookOpen, to: '/components' },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <DzMegamenu :items="items" />
    <p class="text-xs text-base-content/60">Hover or click “Components” to open the panel. Escape closes it; arrow keys open it.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Click-only</p>
      <DzMegamenu :items="items" :open-on-hover="false" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Single group</p>
      <DzMegamenu :items="[items[0], { ...items[1], groups: (items[1].groups ?? []).slice(0, 1) }]" />
    </div>
  </div>
</template>
