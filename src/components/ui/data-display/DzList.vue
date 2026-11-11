<script setup lang="ts">
import { computed } from 'vue'
import type { Component, PropType } from 'vue'
import { cn } from '@/utils/cn'

export interface ListItem {
  id?: string | number
  title?: string
  description?: string
  avatar?: string
  icon?: Component
  [key: string]: unknown
}

const props = defineProps({
  items: { type: Array as PropType<ListItem[]>, default: () => [] },
  wrap: { type: Boolean, default: false },
  horizontal: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'List' },
})

const classes = computed(() =>
  cn('list', {
    'list-col-wrap': props.wrap,
    'list-horizontal': props.horizontal,
  }),
)
</script>

<template>
  <ul :class="classes" :aria-label="ariaLabel">
    <slot>
      <li v-for="(item, index) in items" :key="item.id ?? index" class="list-row">
        <slot name="item" :item="item" :index="index">
          <div
            v-if="item.avatar || item.icon"
            class="flex size-10 items-center justify-center rounded-box bg-base-200"
          >
            <img
              v-if="item.avatar"
              :src="item.avatar"
              :alt="item.title || 'Avatar'"
              class="size-full rounded-box object-cover"
            />
            <component
              :is="item.icon"
              v-else
              class="size-5 opacity-70"
              aria-hidden="true"
            />
          </div>
          <div class="list-col-grow">
            <div class="font-semibold">{{ item.title }}</div>
            <div v-if="item.description" class="text-xs opacity-60">{{ item.description }}</div>
          </div>
          <slot name="actions" :item="item" :index="index" />
        </slot>
      </li>
    </slot>
  </ul>
</template>
