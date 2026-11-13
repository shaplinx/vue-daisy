<script setup lang="ts">
import { computed } from 'vue'
import { Bell, CheckCircle2, Info, TriangleAlert, XCircle } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const toast = useToast()
const count = computed(() => toast.notifications.length)

const buttons = [
  { type: 'success', label: 'Success toast', icon: CheckCircle2, color: 'success' },
  { type: 'error', label: 'Error toast', icon: XCircle, color: 'error' },
  { type: 'warning', label: 'Warning toast', icon: TriangleAlert, color: 'warning' },
  { type: 'info', label: 'Info toast', icon: Info, color: 'info' },
]

function show(type: string, duration = 4000) {
  const map: Record<string, () => number> = {
    success: () => toast.success('Your changes were saved successfully.', { title: 'Success', duration }),
    error: () => toast.error('The request failed. Please try again.', { title: 'Error', duration }),
    warning: () => toast.warning('Your session expires in five minutes.', { title: 'Warning', duration }),
    info: () => toast.info('A new component was added to the library.', { title: 'Information', duration }),
  }
  map[type]()
}

function showSticky() {
  toast.add({
    type: 'info',
    title: 'Sticky notification',
    message: 'This toast stays until you dismiss it.',
    duration: 0,
    dismissible: true,
  })
}

function clearAll() {
  toast.clear()
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-5">
    <div class="flex flex-wrap gap-2">
      <DzButton v-for="button in buttons" :key="button.type" :color="button.color" variant="soft" @click="show(button.type)">
        <template #icon><component :is="button.icon" class="size-4" aria-hidden="true" /></template>
        {{ button.label }}
      </DzButton>
    </div>
    <div class="flex flex-wrap gap-2">
      <DzButton variant="outline" size="sm" @click="show('success', 8000)">Long duration (8s)</DzButton>
      <DzButton variant="outline" size="sm" @click="showSticky">Sticky (manual dismiss)</DzButton>
      <DzButton variant="ghost" size="sm" @click="clearAll">Clear all</DzButton>
      <span class="badge badge-ghost badge-sm">{{ count }} active</span>
    </div>
    <p class="text-xs text-base-content/60">
      Toasts render in the app-level host (bottom-end). Hovering pauses the auto-dismiss timer.
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Variants</p>
      <div class="flex flex-wrap gap-2">
        <DzButton v-for="button in buttons" :key="button.type" :color="button.color" @click="show(button.type)">
          {{ button.type }}
        </DzButton>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Titles &amp; icons</p>
      <DzButton color="primary" variant="outline" @click="toast.success('All 69 components are interactive.', { title: 'Component library ready', duration: 5000 })">
        <template #icon><Bell class="size-4" aria-hidden="true" /></template>
        Rich notification
      </DzButton>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Queue</p>
      <div class="flex flex-wrap gap-2">
        <DzButton size="sm" variant="soft" @click="show('info')">Queue one</DzButton>
        <DzButton size="sm" variant="soft" @click="show('success'); show('warning'); show('error')">Queue three</DzButton>
      </div>
    </div>
  </div>
</template>
