<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  icon: { type: String, default: 'arrow' },
  bordered: { type: Boolean, default: false },
  forceOpen: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  contentClass: { type: [String, Array, Object], default: '' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = computed(() => props.forceOpen || props.modelValue)

const classes = computed(() =>
  cn('collapse', {
    'collapse-arrow': props.icon === 'arrow',
    'collapse-plus': props.icon === 'plus',
    'collapse-open': isOpen.value,
    'collapse-border border border-base-300': props.bordered,
    'cursor-not-allowed opacity-60': props.disabled,
  }),
)

function toggle() {
  if (props.disabled || props.forceOpen) return
  const next = !props.modelValue
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <div :class="classes">
    <button
      type="button"
      class="collapse-title text-start font-medium"
      :aria-expanded="isOpen"
      :disabled="disabled"
      @click="toggle"
    >
      <slot name="title">{{ title }}</slot>
    </button>
    <div class="collapse-content" :class="contentClass">
      <slot />
    </div>
  </div>
</template>
