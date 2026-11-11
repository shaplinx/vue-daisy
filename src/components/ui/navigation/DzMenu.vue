<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { cn } from '@/utils/cn'
import DzMenuItem from './DzMenuItem.vue'
import type { MenuItemData } from './DzMenuItem.vue'

const props = defineProps({
  items: { type: Array as PropType<MenuItemData[]>, default: () => [] },
  orientation: { type: String, default: 'vertical' },
  size: { type: String, default: 'md' },
  activeId: { type: [String, Number] as PropType<string | number | null>, default: null },
  rounded: { type: Boolean, default: true },
  bordered: { type: Boolean, default: false },
  title: { type: String, default: '' },
  ariaLabel: { type: String, default: 'Menu' },
  /** Collapse items to icons with tooltips while the parent drawer is closed. */
  iconOnly: { type: Boolean, default: false },
})

const emit = defineEmits<{
  select: [payload: { item: MenuItemData; event: MouseEvent }]
}>()

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
        :icon-only="iconOnly"
        @select="emit('select', $event)"
      />
    </slot>
  </ul>
</template>
