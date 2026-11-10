<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  color: { type: String, default: 'default' },
  size: { type: String, default: 'md' },
  indeterminate: { type: Boolean, default: false },
  label: { type: String, default: 'Progress' },
  showValue: { type: Boolean, default: false },
})

const classes = computed(() =>
  cn(
    'progress',
    modifier('progress', props.color, COLORS),
    modifier('progress', props.size, SIZES),
  ),
)

const percent = computed(() => {
  if (!props.max) return 0
  return Math.round((Number(props.value) / Number(props.max)) * 100)
})
</script>

<template>
  <div class="w-full">
    <div v-if="showValue || label" class="mb-1 flex justify-between text-xs opacity-70">
      <span>{{ label }}</span>
      <span v-if="showValue">{{ percent }}%</span>
    </div>
    <progress
      :class="classes"
      :value="indeterminate ? undefined : value"
      :max="indeterminate ? undefined : max"
      :aria-label="label"
      :aria-valuenow="indeterminate ? undefined : value"
      :aria-valuemax="indeterminate ? undefined : max"
    />
  </div>
</template>
