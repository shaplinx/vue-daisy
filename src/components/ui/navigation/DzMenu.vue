<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'
import DzMenuItem from './DzMenuItem.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  orientation: { type: String, default: 'vertical' },
  size: { type: String, default: 'md' },
  activeId: { type: [String, Number], default: null },
  rounded: { type: Boolean, default: true },
  bordered: { type: Boolean, default: false },
  title: { type: String, default: '' },
  ariaLabel: { type: String, default: 'Menu' },
})

const emit = defineEmits(['select'])

const classes = computed(() =>
  cn('menu', {
    'menu-horizontal': props.orientation === 'horizontal',
    'menu-xs': props.size === 'xs',
    'menu-sm': props.size === 'sm',
    'menu-lg': props.size === 'lg',
    'menu-xl': props.size === 'xl',
    'rounded-box': props.rounded,
    'border border-base-300': props.bordered,
    'w-full': props.orientation === 'vertical',
  }),
)
</script>

<template>
  <ul :class="classes" :aria-label="ariaLabel">
    <li v-if="title" class="menu-title">{{ title }}</li>
    <slot>
      <DzMenuItem
        v-for="(item, index) in items"
        :key="item.id ?? index"
        :item="item"
        :active-id="activeId"
        @select="emit('select', $event)"
      />
    </slot>
  </ul>
</template>
