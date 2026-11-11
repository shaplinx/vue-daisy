<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS } from '@/utils/daisy'

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  size: { type: [String, Number], default: 80 },
  thickness: { type: [String, Number], default: 8 },
  color: { type: String, default: 'primary' },
  label: { type: String, default: 'Progress' },
  showValue: { type: Boolean, default: true },
})

const percent = computed(() => {
  if (!props.max) return 0
  return Math.min(100, Math.max(0, (Number(props.value) / Number(props.max)) * 100))
})

const classes = computed(() => cn('radial-progress', modifier('text', props.color, COLORS)))

const style = computed(() => ({
  '--value': percent.value,
  '--size': typeof props.size === 'number' ? `${props.size}px` : props.size,
  '--thickness': typeof props.thickness === 'number' ? `${props.thickness}px` : props.thickness,
}))
</script>

<template>
  <div
    :class="classes"
    :style="style"
    role="progressbar"
    :aria-label="label"
    :aria-valuenow="value"
    aria-valuemin="0"
    :aria-valuemax="max"
  >
    <slot>
      <span v-if="showValue" class="text-sm font-semibold">{{ Math.round(percent) }}%</span>
    </slot>
  </div>
</template>
