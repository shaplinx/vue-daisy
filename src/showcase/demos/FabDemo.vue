<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Pencil, Plus, Share2, Trash2 } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const toast = useToast()
const open = ref(false)
const last = ref('—')

const actions = [
  { id: 'edit', label: 'Edit', icon: Pencil, color: 'primary' },
  { id: 'copy', label: 'Duplicate', icon: Copy, color: 'secondary' },
  { id: 'share', label: 'Share', icon: Share2, color: 'accent' },
  { id: 'delete', label: 'Delete', icon: Trash2, color: 'error' },
]

function onAction({ item }: { item: { label: string } }) {
  last.value = item.label
  toast.info(`${item.label} action triggered`)
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <div class="rounded-box border border-base-300 p-4">
      <p class="mb-3 text-xs opacity-60">Click the floating action button to reveal actions. Keyboard accessible with Enter or Space.</p>
      <div class="flex items-center gap-3">
        <DzFab v-model="open" :items="actions" @action="onAction" />
        <span class="badge badge-ghost">{{ open ? 'Open' : 'Closed' }}</span>
        <span class="text-xs opacity-60">Last action: {{ last }}</span>
      </div>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-center gap-8">
        <DzFab :items="actions" size="sm" item-size="sm" @action="onAction" />
        <DzFab :items="actions" size="md" item-size="md" @action="onAction" />
        <DzFab :items="actions" size="lg" item-size="lg" @action="onAction" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap items-center gap-8">
        <DzFab :items="actions" color="secondary" @action="onAction" />
        <DzFab :items="actions" color="accent" @action="onAction" />
        <DzFab :items="actions" color="error" @action="onAction" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Flower layout</p>
      <DzFab :items="actions.slice(0, 3)" flower :icon="Plus" @action="onAction" />
    </div>
  </div>
</template>
