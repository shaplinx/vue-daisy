<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    columns?: 1 | 2 | 3
  }>(),
  { columns: 2 },
)

const columnClass = computed(() => {
  if (props.columns === 1) return 'grid gap-4'
  if (props.columns === 3) return 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
  return 'grid gap-4 sm:grid-cols-2'
})
</script>

<template>
  <div :class="columnClass">
    <slot />
  </div>
</template>
