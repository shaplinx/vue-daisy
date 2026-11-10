<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { cn } from '@/utils/cn'
import { modifier, COLORS } from '@/utils/daisy'

const props = defineProps({
  to: { type: [String, Object], default: null },
  href: { type: String, default: '' },
  color: { type: String, default: 'default' },
  underline: { type: String, default: 'hover' },
  disabled: { type: Boolean, default: false },
  external: { type: Boolean, default: false },
  as: { type: String, default: '' },
})

const emit = defineEmits(['click'])

const tag = computed(() => {
  if (props.as) return props.as
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'span'
})

const classes = computed(() =>
  cn(
    'link',
    modifier('link', props.color, COLORS),
    {
      'link-hover': props.underline === 'hover',
      'no-underline': props.underline === 'none',
      'link-disabled pointer-events-none opacity-50': props.disabled,
    },
  ),
)

const linkAttrs = computed(() => {
  if (props.disabled) return {}
  if (tag.value === RouterLink) return { to: props.to }
  if (tag.value === 'a') {
    return {
      href: props.href || undefined,
      target: props.external ? '_blank' : undefined,
      rel: props.external ? 'noopener noreferrer' : undefined,
    }
  }
  return {}
})
</script>

<template>
  <component
    :is="tag"
    v-bind="linkAttrs"
    :class="classes"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
    @click="!disabled && emit('click', $event)"
  >
    <slot />
  </component>
</template>
