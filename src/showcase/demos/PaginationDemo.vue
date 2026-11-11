<script setup lang="ts">
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const page = ref(1)
const sizePage = ref(3)
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <DzPagination v-model="page" :total-pages="12" :total="240" :per-page="20" />
    <p class="text-xs text-base-content/60">Current page: <span class="badge badge-ghost badge-sm">{{ page }}</span> · clicking updates the bound value.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="space-y-3">
        <DzPagination v-for="size in ['sm', 'md', 'lg']" :key="size" :model-value="4" :size="size" :total-pages="10" :total="100" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sibling count</p>
      <div class="space-y-3">
        <DzPagination :model-value="sizePage" :total-pages="20" :sibling-count="0" :total="200" @update:model-value="sizePage = $event" />
        <DzPagination :model-value="sizePage" :total-pages="20" :sibling-count="2" :total="200" @update:model-value="sizePage = $event" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Minimal (no edges)</p>
      <DzPagination :model-value="2" :total-pages="5" :show-edges="false" />
    </div>
  </div>
</template>
