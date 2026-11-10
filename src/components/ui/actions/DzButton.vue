<script setup>
import { computed, useAttrs } from 'vue'
import { RouterLink } from 'vue-router'
import { LoaderCircle } from '@lucide/vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  color: { type: String, default: 'default' },
  variant: { type: String, default: 'solid' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  href: { type: String, default: '' },
  to: { type: [String, Object], default: null },
  as: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  wide: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  circle: { type: Boolean, default: false },
  square: { type: Boolean, default: false },
  noAnimation: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])
const attrs = useAttrs()

const tag = computed(() => {
  if (props.as) return props.as
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})

const isInteractive = computed(() => tag.value !== 'button')
const isDisabled = computed(() => props.disabled || props.loading)

const classes = computed(() =>
  cn(
    'btn',
    modifier('btn', props.color, COLORS),
    modifier('btn', props.variant, ['outline', 'ghost', 'link', 'soft', 'dash']),
    modifier('btn', props.size, SIZES),
    {
      'btn-active': props.active,
      'btn-wide': props.wide,
      'btn-block': props.block,
      'btn-circle': props.circle,
      'btn-square': props.square,
      'btn-disabled': isDisabled.value,
      'no-animation': props.noAnimation,
    },
  ),
)

const linkAttrs = computed(() => {
  if (tag.value === 'a') {
    return { href: isDisabled.value ? undefined : props.href, role: 'button' }
  }
  if (tag.value === RouterLink) {
    return { to: isDisabled.value ? undefined : props.to, role: 'button' }
  }
  return {}
})

function onClick(event) {
  if (isDisabled.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component
    :is="tag"
    v-bind="{ ...attrs, ...linkAttrs }"
    :class="[classes, attrs.class]"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? isDisabled : undefined"
    :aria-disabled="isInteractive ? isDisabled : undefined"
    :aria-busy="loading || undefined"
    @click="onClick"
  >
    <LoaderCircle v-if="loading" class="size-4 animate-spin" aria-hidden="true" />
    <slot v-else name="icon" />
    <span v-if="loading && loadingText">{{ loadingText }}</span>
    <slot v-else />
  </component>
</template>
