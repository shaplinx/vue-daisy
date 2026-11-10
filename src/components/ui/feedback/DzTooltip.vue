<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS } from '@/utils/daisy'

const props = defineProps({
  text: { type: String, default: '' },
  position: { type: String, default: 'top' },
  color: { type: String, default: 'default' },
  open: { type: Boolean, default: undefined },
  delay: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false },
  interactive: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '' },
})

const visible = ref(false)
let timer

const isControlled = computed(() => props.open !== undefined)
const isOpen = computed(() => (isControlled.value ? props.open : visible.value))

const classes = computed(() =>
  cn(
    'tooltip',
    modifier('tooltip', props.position, ['top', 'bottom', 'left', 'right', 'start', 'center', 'end']),
    modifier('tooltip', props.color, COLORS),
    {
      'tooltip-open': isOpen.value,
      'tooltip-interactive': props.interactive,
    },
  ),
)

function show() {
  if (props.disabled || isControlled.value) return
  clearTimeout(timer)
  if (props.delay > 0) timer = setTimeout(() => (visible.value = true), props.delay)
  else visible.value = true
}

function hide() {
  clearTimeout(timer)
  if (!isControlled.value) visible.value = false
}

onBeforeUnmount(() => clearTimeout(timer))

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) hide()
  },
)
</script>

<template>
  <span
    :class="classes"
    :data-tip="text || undefined"
    :aria-label="ariaLabel || undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
    <span v-if="$slots.content" class="tooltip-content">
      <slot name="content" />
    </span>
  </span>
</template>
