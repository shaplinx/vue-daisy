<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  color: { type: String, default: 'default' },
  size: { type: String, default: 'md' },
  ping: { type: Boolean, default: false },
  label: { type: String, default: '' },
})

const classes = computed(() =>
  cn(
    'status',
    modifier('status', props.color, COLORS),
    modifier('status', props.size, SIZES),
    { 'status-ping': props.ping },
  ),
)
</script>

<template>
  <span :class="classes" role="status">
    <span v-if="label" class="sr-only">{{ label }}</span>
  </span>
</template>
