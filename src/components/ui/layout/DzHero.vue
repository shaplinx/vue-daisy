<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  image: { type: String, default: '' },
  overlay: { type: Boolean, default: false },
  minHeight: { type: String, default: 'min-h-[32rem]' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})

const classes = computed(() => cn('hero', props.minHeight))
</script>

<template>
  <div :class="classes" :style="image ? { backgroundImage: `url(${image})` } : undefined">
    <div v-if="overlay" class="hero-overlay" aria-hidden="true" />
    <div class="hero-content text-center">
      <slot>
        <div class="max-w-md">
          <h1 v-if="title" class="text-4xl font-bold">{{ title }}</h1>
          <p v-if="description" class="py-4">{{ description }}</p>
          <slot name="actions" />
        </div>
      </slot>
    </div>
  </div>
</template>
