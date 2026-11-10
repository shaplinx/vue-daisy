<script setup>
import { ref } from 'vue'
import { Blocks, LayoutDashboard, Palette, Settings, Table2, Users } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const toast = useToast()
const activeId = ref('dashboard')

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  {
    id: 'data',
    label: 'Data Management',
    icon: Table2,
    children: [
      { id: 'users', label: 'Users', icon: Users, to: '/data' },
      { id: 'reports', label: 'Reports', icon: Blocks },
    ],
  },
  { id: 'themes', label: 'Theme Settings', icon: Palette, to: '/themes' },
  { id: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
]

function onSelect({ item }) {
  activeId.value = item.id
  toast.info(`Menu item selected: ${item.label}`)
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="grid gap-6 sm:grid-cols-[16rem_1fr]">
    <div class="rounded-box border border-base-300 bg-base-100 p-2">
      <DzMenu :items="items" :active-id="activeId" title="Application" @select="onSelect" />
    </div>
    <div class="rounded-box border border-dashed border-base-300 p-4 text-sm text-base-content/70">
      <p class="font-medium text-base-content">Nested navigation</p>
      <p class="mt-1 text-xs">The Data Management item expands to reveal child links. Clicking an item updates the active state and emits a select event.</p>
      <p class="mt-3 text-xs">Active id: <span class="badge badge-primary badge-sm">{{ activeId }}</span></p>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Horizontal</p>
      <DzMenu :items="items.filter((item) => item.to)" orientation="horizontal" :active-id="activeId" class="w-fit rounded-box border border-base-300" @select="onSelect" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap gap-3">
        <DzMenu v-for="size in ['xs', 'sm', 'md', 'lg']" :key="size" :items="items.slice(0, 3)" :size="size" class="w-52 rounded-box border border-base-300" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom slot</p>
      <DzMenu class="w-64 rounded-box border border-base-300">
        <li><a href="#!"><LayoutDashboard class="size-4" aria-hidden="true" />Custom item</a></li>
        <li><a href="#!" class="menu-active"><Palette class="size-4" aria-hidden="true" />Active custom</a></li>
        <li class="menu-disabled"><a>Disabled item</a></li>
      </DzMenu>
    </div>
  </div>
</template>
