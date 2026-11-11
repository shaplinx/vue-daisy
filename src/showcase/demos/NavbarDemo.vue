<script setup lang="ts">
import { Bell, Blocks, Search } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <DzNavbar bordered class="rounded-box bg-base-100">
      <template #start>
        <DzButton variant="ghost" size="sm" class="gap-2 px-2">
          <template #icon><Blocks class="size-5 text-primary" aria-hidden="true" /></template>
          Vue Daisy
        </DzButton>
      </template>
      <template #center>
        <div class="hidden w-64 sm:block">
          <DzInput size="sm" placeholder="Search…" aria-label="Search">
            <template #prefix><Search class="size-4 opacity-50" aria-hidden="true" /></template>
          </DzInput>
        </div>
      </template>
      <template #end>
        <DzButton variant="ghost" circle size="sm" aria-label="Notifications">
          <template #icon>
            <span class="indicator">
              <span class="indicator-item badge badge-error badge-xs">2</span>
              <Bell class="size-5" aria-hidden="true" />
            </span>
          </template>
        </DzButton>
        <DzAvatar size="sm" alt="Alex Morgan" placeholder="AM" ring="primary" />
      </template>
    </DzNavbar>
    <p class="text-xs text-base-content/60">Start, center and end slots keep responsive alignment predictable.</p>
  </div>

  <div v-else class="space-y-4">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Plain</p>
      <DzNavbar class="rounded-box bg-base-200">
        <template #start><span class="px-2 font-semibold">Plain navbar</span></template>
        <template #end><DzButton size="xs" variant="outline">Action</DzButton></template>
      </DzNavbar>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Bordered</p>
      <DzNavbar bordered class="rounded-box bg-base-100">
        <template #start><span class="px-2 font-semibold">Bordered</span></template>
        <template #end><DzButton size="xs" color="primary">Action</DzButton></template>
      </DzNavbar>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Shadow</p>
      <DzNavbar shadow class="rounded-box bg-base-100">
        <template #start><span class="px-2 font-semibold">Shadow</span></template>
        <template #end><DzButton size="xs" variant="ghost">Action</DzButton></template>
      </DzNavbar>
    </div>
  </div>
</template>
