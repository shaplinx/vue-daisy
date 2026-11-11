<script setup lang="ts">
import { computed } from 'vue'
import type { Component, PropType } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

export interface BreadcrumbItem {
  id?: string | number
  label?: string
  to?: RouteLocationRaw
  href?: string
  icon?: Component
}

const props = defineProps({
  items: { type: Array as PropType<BreadcrumbItem[]>, default: () => [] },
  separator: {
    type: [String, Object, Function] as PropType<string | Component | null>,
    default: null,
  },
  ariaLabel: { type: String, default: 'Breadcrumb' },
})

const visibleItems = computed<BreadcrumbItem[]>(() => props.items)
</script>

<template>
  <div class="breadcrumbs max-w-full overflow-x-auto text-sm" :aria-label="ariaLabel">
    <ul>
      <li v-for="(item, index) in visibleItems" :key="item.id ?? index">
        <slot name="item" :item="item" :index="index" :last="index === visibleItems.length - 1">
          <RouterLink v-if="item.to" :to="item.to" class="inline-flex items-center gap-1">
            <component :is="item.icon" v-if="item.icon" class="size-3.5" aria-hidden="true" />
            {{ item.label }}
          </RouterLink>
          <a v-else-if="item.href" :href="item.href" class="inline-flex items-center gap-1">
            <component :is="item.icon" v-if="item.icon" class="size-3.5" aria-hidden="true" />
            {{ item.label }}
          </a>
          <span v-else class="inline-flex items-center gap-1" :aria-current="index === visibleItems.length - 1 ? 'page' : undefined">
            <component :is="item.icon" v-if="item.icon" class="size-3.5" aria-hidden="true" />
            {{ item.label }}
          </span>
        </slot>
        <component :is="separator" v-if="separator && index < visibleItems.length - 1" aria-hidden="true" />
      </li>
    </ul>
  </div>
</template>
