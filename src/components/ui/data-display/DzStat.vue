<script setup lang="ts">
import { computed } from 'vue'
import type { Component, PropType } from 'vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS } from '@/utils/daisy'

export interface StatItem {
  id?: string | number
  title?: string
  value?: string | number
  description?: string
  icon?: Component
  color?: string
  actions?: boolean
  [key: string]: unknown
}

const props = defineProps({
  items: { type: Array as PropType<StatItem[]>, default: () => [] },
  title: { type: String, default: '' },
  value: { type: [String, Number] as PropType<string | number>, default: '' },
  description: { type: String, default: '' },
  icon: { type: [Object, Function] as PropType<Component | null>, default: null },
  color: { type: String, default: 'default' },
  vertical: { type: Boolean, default: false },
  shadow: { type: Boolean, default: false },
})

const classes = computed(() =>
  cn('stats', {
    'stats-vertical': props.vertical,
    shadow: props.shadow,
  }),
)

const valueColor = computed(() => modifier('text', props.color, COLORS))

const displayItems = computed<StatItem[]>(() =>
  props.items.length
    ? props.items
    : [
        {
          title: props.title,
          value: props.value,
          description: props.description,
          icon: props.icon ?? undefined,
          color: props.color,
        } satisfies StatItem,
      ],
)
</script>

<template>
  <div :class="classes">
    <div v-for="(item, index) in displayItems" :key="item.id ?? index" class="stat">
      <div v-if="item.icon || $slots.figure" class="stat-figure text-base-content/70">
        <slot name="figure" :item="item" :index="index">
          <component :is="item.icon" class="size-8" aria-hidden="true" />
        </slot>
      </div>
      <div class="stat-title">
        <slot name="title" :item="item" :index="index">{{ item.title }}</slot>
      </div>
      <div class="stat-value" :class="modifier('text', item.color, COLORS)">
        <slot name="value" :item="item" :index="index">{{ item.value }}</slot>
      </div>
      <div v-if="item.description || $slots.description" class="stat-desc">
        <slot name="description" :item="item" :index="index">{{ item.description }}</slot>
      </div>
      <div v-if="item.actions || $slots.actions" class="stat-actions">
        <slot name="actions" :item="item" :index="index" />
      </div>
    </div>
  </div>
</template>
