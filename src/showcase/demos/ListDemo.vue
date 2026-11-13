<script setup lang="ts">
import { ref } from 'vue'
import { FileText, Folder, Image, Music, Trash2, Users } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const toast = useToast()

const items = ref([
  { id: 1, icon: Folder, title: 'Design assets', description: '24 files · updated 2 hours ago' },
  { id: 2, icon: Image, title: 'hero-aurora.png', description: '2400 × 1600 · 1.8 MB' },
  { id: 3, icon: FileText, title: 'component-inventory.md', description: '69 components documented' },
  { id: 4, icon: Music, title: 'notification.mp3', description: '0:04 · 96 kbps' },
])

function remove(item: { id: number; title: string }) {
  items.value = items.value.filter((entry) => entry.id !== item.id)
  toast.info(`Removed ${item.title}`)
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="mx-auto max-w-xl">
    <DzList :items="items" aria-label="Files">
      <template #actions="{ item }">
        <button type="button" class="btn btn-ghost btn-sm btn-circle" :aria-label="`Remove ${item.title}`" @click="remove(item)">
          <Trash2 class="size-4" aria-hidden="true" />
        </button>
      </template>
    </DzList>
    <p class="mt-2 text-xs text-base-content/60">Actions are functional — removing an item updates the list.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Default</p>
      <DzList :items="items.slice(0, 3)" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Wrap layout</p>
      <DzList :items="items.slice(0, 2)" wrap />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Horizontal</p>
      <DzList :items="[{ id: 1, icon: Users, title: 'Members', description: '12 people' }]" horizontal />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom item slot</p>
      <DzList :items="items.slice(0, 2)">
        <template #item="{ item }">
          <span class="badge badge-primary badge-sm">{{ item.id }}</span>
          <span class="list-col-grow font-medium">{{ item.title }}</span>
          <span class="text-xs opacity-50">{{ item.description }}</span>
        </template>
      </DzList>
    </div>
  </div>
</template>
