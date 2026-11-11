<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  type: { type: String, default: 'spinner' },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  text: { type: String, default: '' },
  label: { type: String, default: 'Loading' },
})

const classes = computed(() =>
  cn(
    'loading',
    modifier('loading', props.type, ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity']),
    modifier('loading', props.size, SIZES),
    modifier('text', props.color, COLORS),
  ),
)
</script>

<template>
  <span class="inline-flex items-center gap-2" role="status" :aria-label="label">
    <span :class="classes" aria-hidden="true" />
    <span v-if="text" class="text-sm">{{ text }}</span>
    <span v-else class="sr-only">{{ label }}</span>
  </span>
</template>
