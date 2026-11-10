<script setup>
import { Bell, Heart, Home, Search, Settings, User } from '@lucide/vue'
import { gradientC } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()

const tabs = [
  { icon: Home, label: 'Home', active: true },
  { icon: Search, label: 'Search' },
  { icon: Heart, label: 'Saved' },
  { icon: User, label: 'Profile' },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <div class="flex flex-wrap items-start gap-6">
      <DzPhoneMockup>
        <div class="flex h-full w-64 flex-col bg-base-100">
          <div class="relative h-40">
            <img :src="gradientC" alt="Ocean gradient cover" class="size-full object-cover" />
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
              <div>
                <p class="text-xs uppercase tracking-widest opacity-80">Vue Daisy</p>
                <p class="text-lg font-bold">Mobile preview</p>
              </div>
              <Bell class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="flex-1 space-y-3 p-4">
            <div class="rounded-box bg-base-200 p-3">
              <p class="text-sm font-semibold">Today</p>
              <p class="text-xs opacity-60">3 components updated</p>
            </div>
            <div class="rounded-box bg-base-200 p-3">
              <p class="text-sm font-semibold">New theme</p>
              <p class="text-xs opacity-60">Cupcake is now available.</p>
            </div>
          </div>
          <div class="flex items-center justify-around border-t border-base-300 p-3">
            <component
              :is="tab.icon"
              v-for="tab in tabs"
              :key="tab.label"
              class="size-5"
              :class="tab.active ? 'text-primary' : 'opacity-40'"
              :aria-label="tab.label"
            />
          </div>
        </div>
      </DzPhoneMockup>
      <div class="max-w-xs space-y-3 text-sm text-base-content/70">
        <p class="font-semibold text-base-content">Device frame</p>
        <p>
          The phone mockup includes the camera notch and a fixed-width display area. Content scrolls
          inside the frame, so it works for app screenshots or live markup.
        </p>
        <p class="flex items-center gap-2 text-xs">
          <Settings class="size-4" aria-hidden="true" />
          Try resizing the browser window.
        </p>
      </div>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Image screen</p>
      <DzPhoneMockup>
        <img :src="gradientC" alt="Ocean gradient screen" class="h-full w-64 object-cover" />
      </DzPhoneMockup>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom content</p>
      <DzPhoneMockup content-class="bg-base-200 p-4">
        <div class="flex h-full w-64 flex-col justify-between">
          <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-widest opacity-50">Welcome back</p>
            <p class="text-xl font-bold">Ada Lovelace</p>
            <p class="text-xs opacity-60">You have 4 unread notifications.</p>
          </div>
          <button class="btn btn-primary btn-sm">Open dashboard</button>
        </div>
      </DzPhoneMockup>
    </div>
  </div>
</template>
