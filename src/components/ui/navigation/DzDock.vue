<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { cn } from '@/utils/cn'
import { modifier, SIZES } from '@/utils/daisy'

const props = defineProps({
  items: { type: Array, default: () => [] },
  size: { type: String, default: 'md' },
  ariaLabel: { type: String, default: 'Dock navigation' },
})

const classes = computed(() => cn('dock', modifier('dock', props.size, SIZES)))
</script>

<template>
  <nav :class="classes" :aria-label="ariaLabel">
    <slot>
      <template v-for="(item, index) in items" :key="item.id ?? index">
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="flex flex-col items-center gap-1"
          :class="{ 'dock-active': item.active }"
          :aria-current="item.active ? 'page' : undefined"
        >
          <span class="relative">
            <component :is="item.icon" class="size-5" aria-hidden="true" />
            <span
              v-if="item.badge"
              class="badge badge-primary badge-xs absolute -end-2 -top-2"
            >{{ item.badge }}</span>
          </span>
          <span class="dock-label">{{ item.label }}</span>
        </RouterLink>
        <a
          v-else
          :href="item.href || '#'"
          class="flex flex-col items-center gap-1"
          :class="{ 'dock-active': item.active }"
        >
          <component :is="item.icon" class="size-5" aria-hidden="true" />
          <span class="dock-label">{{ item.label }}</span>
        </a>
      </template>
    </slot>
  </nav>
</template>
