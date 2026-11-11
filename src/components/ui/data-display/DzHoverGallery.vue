<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { cn } from '@/utils/cn'

export interface HoverGalleryImage {
  id?: string | number
  src?: string
  alt?: string
}

const props = defineProps({
  images: { type: Array as PropType<Array<string | HoverGalleryImage>>, default: () => [] },
  alt: { type: String, default: 'Gallery image' },
  width: { type: String, default: 'max-w-60' },
  rounded: { type: Boolean, default: true },
})

function imageSrc(image: string | HoverGalleryImage, index: number): string {
  if (typeof image === 'string') return image
  return image.src ?? `${image.id ?? index}`
}

function imageAlt(image: string | HoverGalleryImage, index: number): string {
  if (typeof image === 'string') return `${props.alt} ${index + 1}`
  return image.alt || `${props.alt} ${index + 1}`
}

const classes = computed(() => cn('hover-gallery', props.width, { 'rounded-box overflow-hidden': props.rounded }))
</script>

<template>
  <figure :class="classes">
    <template v-if="images.length">
      <img
        v-for="(image, index) in images"
        :key="typeof image === 'string' ? index : (image.id ?? index)"
        :src="imageSrc(image, index)"
        :alt="imageAlt(image, index)"
        loading="lazy"
      />
    </template>
    <slot v-else />
  </figure>
</template>
