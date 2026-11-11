<script setup lang="ts">
import { ref } from 'vue'
import { Blocks, LayoutDashboard, Menu, Settings, Users } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const open = ref(false)

const nav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <div class="h-80 overflow-hidden rounded-box border border-base-300">
      <DzDrawer v-model="open" responsive="none" width="w-64" content-class="h-full">
        <template #sidebar>
          <div class="flex h-full flex-col gap-4 p-4">
            <div class="flex items-center gap-2 font-semibold">
              <Blocks class="size-5 text-primary" aria-hidden="true" />
              Vue Daisy
            </div>
            <DzMenu :items="nav" title="Navigation" />
          </div>
        </template>
        <div class="flex h-full flex-col bg-base-200">
          <div class="flex items-center gap-3 border-b border-base-300 bg-base-100 p-3">
            <DzButton variant="ghost" circle size="sm" aria-label="Open drawer" @click="open = true">
              <template #icon><Menu class="size-5" aria-hidden="true" /></template>
            </DzButton>
            <span class="text-sm font-semibold">Controlled drawer</span>
          </div>
          <div class="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
            <p class="text-sm font-medium">Click the menu button to open the sidebar.</p>
            <p class="max-w-xs text-xs text-base-content/60">
              The overlay closes the drawer, and the open state is bound with <code>v-model</code>.
            </p>
          </div>
        </div>
      </DzDrawer>
    </div>
    <p class="text-xs text-base-content/60">
      Open state: <span class="badge badge-ghost badge-sm">{{ open ? 'open' : 'closed' }}</span>
    </p>
  </div>

  <div v-else class="grid gap-6 lg:grid-cols-2">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sidebar at the start</p>
      <div class="h-72 overflow-hidden rounded-box border border-base-300">
        <DzDrawer v-model="open" responsive="none" width="w-56" content-class="h-full">
          <template #sidebar>
            <div class="h-full bg-base-100 p-4">
              <p class="mb-3 text-xs font-semibold uppercase tracking-widest opacity-50">Start</p>
              <DzMenu :items="nav" />
            </div>
          </template>
          <div class="flex h-full items-center justify-center bg-base-200 text-sm">Content area</div>
        </DzDrawer>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sidebar at the end</p>
      <div class="h-72 overflow-hidden rounded-box border border-base-300">
        <DzDrawer v-model="open" side="end" responsive="none" width="w-56" content-class="h-full">
          <template #sidebar>
            <div class="h-full bg-base-100 p-4">
              <p class="mb-3 text-xs font-semibold uppercase tracking-widest opacity-50">End</p>
              <DzMenu :items="nav" />
            </div>
          </template>
          <div class="flex h-full items-center justify-center bg-base-200 text-sm">Content area</div>
        </DzDrawer>
      </div>
    </div>
  </div>
</template>
