<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronRight } from '@lucide/vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  separator: { type: [String, Object, Function], default: null },
  ariaLabel: { type: String, default: 'Breadcrumb' },
})

const visibleItems = computed(() => props.items)
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
        <ChevronRight
          v-else-if="!separator && index < visibleItems.length - 1"
          class="size-3.5 opacity-40"
          aria-hidden="true"
        />
      </li>
    </ul>
  </div>
</template>
