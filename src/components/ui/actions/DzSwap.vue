<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  animation: { type: String, default: 'rotate' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Toggle' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const classes = computed(() =>
  cn('swap', {
    'swap-rotate': props.animation === 'rotate',
    'swap-flip': props.animation === 'flip',
    'swap-active': props.active,
    'swap-sm': props.size === 'sm',
    'swap-lg': props.size === 'lg',
    'swap-disabled': props.disabled,
  }),
)

function onChange(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
  emit('change', (event.target as HTMLInputElement).checked)
}
</script>

<template>
  <label :class="classes" :aria-label="ariaLabel">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="swap-on">
      <slot name="on">
        <slot />
      </slot>
    </span>
    <span class="swap-off">
      <slot name="off">
        <slot />
      </slot>
    </span>
  </label>
</template>
