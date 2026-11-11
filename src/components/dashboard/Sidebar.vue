<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Blocks,
  ClipboardList,
  Component,
  Database,
  LayoutDashboard,
  Palette,
  Settings,
} from '@lucide/vue'
import DzMenu from '@/components/ui/navigation/DzMenu.vue'
import type { MenuItemData } from '@/components/ui/navigation/DzMenuItem.vue'
import { componentCategories } from '@/data/componentRegistry'

const emit = defineEmits<{
  navigate: [item: MenuItemData]
}>()
const route = useRoute()
const router = useRouter()

const categoryChildren = componentCategories.map((category) => ({
  id: `category-${category.id}`,
  label: category.label,
  to: { path: '/components', query: { category: category.id } },
  icon: category.icon,
}))

const groups = computed(() => [
  {
    id: 'workspace',
    header: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      {
        id: 'components',
        label: 'Component Library',
        icon: Component,
        children: [
          { id: 'all-components', label: 'All components', to: '/components', icon: Blocks },
          ...categoryChildren,
        ],
      },
      { id: 'data', label: 'Data Management', to: '/data', icon: Database },
      { id: 'forms', label: 'Form Examples', to: '/forms', icon: ClipboardList, badge: 'Soon' },
    ],
  },
  {
    id: 'preferences',
    header: 'Preferences',
    items: [
      { id: 'settings', label: 'Settings', to: '/settings', icon: Settings },
      { id: 'themes', label: 'Theme Settings', to: '/themes', icon: Palette },
    ],
  },
])

function onSelect({ item }: { item: MenuItemData }) {
  emit('navigate', item)
  if (item.to) router.push(item.to)
}
</script>

<template>
  <div class="flex w-full flex-1 flex-col">
    <div class="flex h-16 items-center gap-3 border-b border-base-300 px-4">
      <RouterLink to="/components" class="flex min-w-0 items-center gap-2.5" aria-label="Vue Daisy home">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-box bg-primary text-primary-content shadow-sm">
          <Blocks class="size-5" aria-hidden="true" />
        </span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-bold tracking-tight">Vue Daisy</span>
          <span class="block truncate text-[11px] opacity-50">Component Library</span>
        </span>
      </RouterLink>
    </div>

    <div class="flex-1 py-3">
      <template v-for="group in groups" :key="group.id">
        <p class="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest opacity-40">
          {{ group.header }}
        </p>
        <DzMenu
          :items="group.items"
          :active-id="typeof route.name === 'string' ? route.name : null"
          class="mb-1"
          @select="onSelect"
        />
      </template>
    </div>
  </div>
</template>
