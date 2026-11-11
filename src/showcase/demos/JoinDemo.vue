<script setup lang="ts">
import { ChevronLeft, ChevronRight, Search } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
</script>

<template>
  <div v-if="mode !== 'variants'" class="max-w-xl space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Buttons</p>
      <DzJoin>
        <DzButton variant="outline" class="join-item">Left</DzButton>
        <DzButton variant="outline" class="join-item">Middle</DzButton>
        <DzButton variant="outline" class="join-item">Right</DzButton>
      </DzJoin>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Input with button</p>
      <DzJoin class="w-full">
        <DzInput class="join-item" placeholder="Search components…" aria-label="Search">
          <template #prefix><Search class="size-4 opacity-50" aria-hidden="true" /></template>
        </DzInput>
        <DzButton color="primary" class="join-item">Search</DzButton>
      </DzJoin>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Pagination group</p>
      <DzJoin>
        <DzButton variant="outline" class="join-item" square aria-label="Previous page">
          <template #icon><ChevronLeft class="size-4" aria-hidden="true" /></template>
        </DzButton>
        <DzButton variant="outline" class="join-item">1</DzButton>
        <DzButton variant="outline" color="primary" class="join-item">2</DzButton>
        <DzButton variant="outline" class="join-item">3</DzButton>
        <DzButton variant="outline" class="join-item" square aria-label="Next page">
          <template #icon><ChevronRight class="size-4" aria-hidden="true" /></template>
        </DzButton>
      </DzJoin>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-center gap-6">
        <DzJoin v-for="size in ['xs', 'sm', 'md', 'lg']" :key="size" :size="size">
          <DzButton variant="outline" class="join-item" :size="size">{{ size }}</DzButton>
          <DzButton variant="outline" class="join-item" :size="size">Group</DzButton>
          <DzButton variant="outline" class="join-item" :size="size">Join</DzButton>
        </DzJoin>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Vertical</p>
      <DzJoin vertical>
        <DzButton variant="outline" class="join-item">Top</DzButton>
        <DzButton variant="outline" class="join-item">Middle</DzButton>
        <DzButton variant="outline" class="join-item">Bottom</DzButton>
      </DzJoin>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Radio group</p>
      <DzJoin>
        <input type="radio" name="join-radio" class="join-item btn" aria-label="Option 1" checked />
        <input type="radio" name="join-radio" class="join-item btn" aria-label="Option 2" />
        <input type="radio" name="join-radio" class="join-item btn" aria-label="Option 3" />
      </DzJoin>
    </div>
  </div>
</template>
