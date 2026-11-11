<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'primary' },
  label: { type: String, default: '' },
  showValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Range' },
})

const emit = defineEmits(['update:modelValue', 'change', 'input'])

const classes = computed(() =>
  cn('range', modifier('range', props.size, SIZES), modifier('range', props.color, COLORS)),
)

function onInput(event: Event): void {
  const value = Number((event.target as HTMLInputElement).value)
  emit('update:modelValue', value)
  emit('input', value)
}

function onChange(event: Event): void {
  emit('change', Number((event.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="w-full">
    <div v-if="label || showValue" class="mb-1 flex justify-between text-sm">
      <span>{{ label }}</span>
      <span v-if="showValue" class="badge badge-sm">{{ modelValue }}</span>
    </div>
    <input
      type="range"
      :class="classes"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-label="ariaLabel"
      :aria-valuetext="`${modelValue}`"
      @input="onInput"
      @change="onChange"
    />
  </div>
</template>
