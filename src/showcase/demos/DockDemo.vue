<script setup>
import { ref } from 'vue'
import { Bell, Home, Search, Settings, UserRound } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const active = ref('home')

const items = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: 3 },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'settings', label: 'Settings', icon: Settings },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <div class="mx-auto max-w-xl rounded-box border border-base-300 bg-base-200 p-3">
      <DzDock aria-label="Bottom navigation">
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          class="flex flex-col items-center gap-1"
          :class="{ 'dock-active': active === item.id }"
          :aria-current="active === item.id ? 'page' : undefined"
          @click="active = item.id"
        >
          <span class="relative">
            <component :is="item.icon" class="size-5" aria-hidden="true" />
            <span v-if="item.badge" class="badge badge-primary badge-xs absolute -end-2 -top-2">{{ item.badge }}</span>
          </span>
          <span class="dock-label">{{ item.label }}</span>
        </button>
      </DzDock>
    </div>
    <p class="text-center text-xs text-base-content/60">Active tab: <span class="badge badge-ghost badge-sm">{{ active }}</span></p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="space-y-3">
        <DzDock v-for="size in ['sm', 'md', 'lg']" :key="size" :size="size" class="rounded-box border border-base-300 bg-base-200">
          <button
            v-for="item in items.slice(0, 4)"
            :key="item.id"
            type="button"
            class="flex flex-col items-center gap-1"
            :class="{ 'dock-active': active === item.id }"
            @click="active = item.id"
          >
            <component :is="item.icon" class="size-5" aria-hidden="true" />
            <span class="dock-label">{{ item.label }}</span>
          </button>
        </DzDock>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">With router links</p>
      <DzDock :items="[
        { label: 'Dashboard', to: '/dashboard', icon: Home, active: true },
        { label: 'Components', to: '/components', icon: Search },
        { label: 'Themes', to: '/themes', icon: Settings },
      ]" class="rounded-box border border-base-300 bg-base-200" />
    </div>
  </div>
</template>
