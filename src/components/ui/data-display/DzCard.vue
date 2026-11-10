<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  as: { type: String, default: 'div' },
  title: { type: String, default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  imageFull: { type: Boolean, default: false },
  bordered: { type: Boolean, default: false },
  dash: { type: Boolean, default: false },
  side: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  bodyClass: { type: [String, Array, Object], default: '' },
})

const classes = computed(() =>
  cn('card', {
    'card-border': props.bordered,
    'card-dash': props.dash,
    'card-side': props.side,
    'image-full': props.imageFull,
    'card-xs': props.size === 'xs',
    'card-sm': props.size === 'sm',
    'card-lg': props.size === 'lg',
    'card-xl': props.size === 'xl',
  }),
)
</script>

<template>
  <component :is="as" :class="classes">
    <slot name="image">
      <figure v-if="image">
        <img :src="image" :alt="imageAlt" loading="lazy" />
      </figure>
    </slot>

    <div class="card-body" :class="bodyClass">
      <slot name="header">
        <h2 v-if="title" class="card-title">
          <slot name="title">{{ title }}</slot>
        </h2>
      </slot>

      <slot />

      <div v-if="$slots.actions" class="card-actions justify-end">
        <slot name="actions" />
      </div>

      <slot name="footer" />
    </div>
  </component>
</template>
