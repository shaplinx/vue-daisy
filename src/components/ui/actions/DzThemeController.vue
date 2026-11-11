<script setup lang="ts">
import { computed } from 'vue'
import { Moon, Sun } from '@lucide/vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  theme: { type: String, default: 'light' },
  modelValue: { type: Boolean, default: false },
  type: { type: String, default: 'toggle' },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  animation: { type: String, default: 'rotate' },
  lightTheme: { type: String, default: 'light' },
  darkTheme: { type: String, default: 'dark' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const isToggle = computed(() => props.type === 'toggle')
const isChecked = computed(() =>
  isToggle.value ? props.modelValue : props.theme === props.darkTheme,
)

const classes = computed(() =>
  cn(
    isToggle.value ? 'swap' : 'swap',
    {
      'swap-rotate': props.animation === 'rotate',
      'swap-flip': props.animation === 'flip',
      'swap-sm': props.size === 'sm',
      'swap-lg': props.size === 'lg',
      'swap-disabled': props.disabled,
    },
  ),
)

function onChange(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked
  const theme = checked ? props.darkTheme : props.lightTheme
  emit('update:modelValue', checked)
  emit('change', isToggle.value ? theme : theme, checked)
}
</script>

<template>
  <label
    :class="classes"
    :aria-label="isToggle ? 'Toggle dark mode' : `Switch to ${darkTheme} theme`"
  >
    <input
      :type="isToggle ? 'checkbox' : 'radio'"
      class="theme-controller"
      :value="isToggle ? undefined : theme"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
    />
    <span class="swap-on">
      <slot name="on"><Moon class="size-5" aria-hidden="true" /></slot>
    </span>
    <span class="swap-off">
      <slot name="off"><Sun class="size-5" aria-hidden="true" /></slot>
    </span>
  </label>
</template>
