<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  value: { type: [Number, String], default: 0 },
  minDigits: { type: Number, default: 1 },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  label: { type: String, default: '' },
})

const digits = computed(() => {
  const numeric = Math.max(0, Number(props.value) || 0)
  return String(numeric).padStart(props.minDigits, '0').split('')
})

const classes = computed(() =>
  cn(
    'countdown font-mono',
    modifier('countdown', props.size, SIZES),
    modifier('countdown', props.color, COLORS),
  ),
)
</script>

<template>
  <span :class="classes" :aria-label="label || `Countdown ${value}`">
    <span
      v-for="(digit, index) in digits"
      :key="index"
      :style="{ '--value': digit }"
      aria-hidden="true"
    >
      {{ digit }}
    </span>
  </span>
</template>
