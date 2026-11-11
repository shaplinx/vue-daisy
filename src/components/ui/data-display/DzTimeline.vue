<script setup lang="ts">
import { computed } from 'vue'
import type { Component, PropType } from 'vue'
import { Circle } from '@lucide/vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS } from '@/utils/daisy'

export interface TimelineItem {
  id?: string | number
  date?: string
  title?: string
  description?: string
  icon?: Component
  color?: string
  [key: string]: unknown
}

const props = defineProps({
  items: { type: Array as PropType<TimelineItem[]>, default: () => [] },
  horizontal: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
  snapIcon: { type: Boolean, default: false },
  box: { type: Boolean, default: true },
})

const classes = computed(() =>
  cn('timeline', {
    'timeline-vertical': !props.horizontal,
    'timeline-horizontal': props.horizontal,
    'timeline-compact': props.compact,
    'timeline-snap-icon': props.snapIcon,
  }),
)
</script>

<template>
  <ul :class="classes">
    <slot>
      <li v-for="(item, index) in items" :key="item.id ?? index">
        <hr v-if="index > 0" :class="modifier('bg', item.color, COLORS)" />
        <div class="timeline-start mb-10 md:text-end">
          <slot name="start" :item="item" :index="index">
            <time class="font-mono text-xs opacity-60">{{ item.date }}</time>
            <div class="font-semibold">{{ item.title }}</div>
          </slot>
        </div>
        <div class="timeline-middle">
          <slot name="icon" :item="item" :index="index">
            <component
              :is="item.icon || Circle"
              class="size-5"
              :class="modifier('text', item.color || 'primary', COLORS)"
              aria-hidden="true"
            />
          </slot>
        </div>
        <div class="timeline-end mb-10">
          <slot name="content" :item="item" :index="index">
            <div v-if="box" class="timeline-box">
              <p>{{ item.description }}</p>
            </div>
            <p v-else>{{ item.description }}</p>
          </slot>
        </div>
        <hr v-if="index < items.length - 1" :class="modifier('bg', item.color, COLORS)" />
      </li>
    </slot>
  </ul>
</template>
