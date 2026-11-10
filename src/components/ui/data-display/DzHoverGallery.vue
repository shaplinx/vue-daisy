<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  images: { type: Array, default: () => [] },
  alt: { type: String, default: 'Gallery image' },
  width: { type: String, default: 'max-w-60' },
  rounded: { type: Boolean, default: true },
})

const classes = computed(() => cn('hover-gallery', props.width, { 'rounded-box overflow-hidden': props.rounded }))
</script>

<template>
  <figure :class="classes">
    <template v-if="images.length">
      <img
        v-for="(image, index) in images"
        :key="image.id ?? index"
        :src="typeof image === 'string' ? image : image.src"
        :alt="typeof image === 'string' ? `${alt} ${index + 1}` : image.alt || `${alt} ${index + 1}`"
        loading="lazy"
      />
    </template>
    <slot v-else />
  </figure>
</template>
