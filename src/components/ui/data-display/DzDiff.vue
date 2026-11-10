<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  before: { type: String, default: '' },
  after: { type: String, default: '' },
  beforeAlt: { type: String, default: 'Before' },
  afterAlt: { type: String, default: 'After' },
  aspect: { type: String, default: 'aspect-16/9' },
  label: { type: String, default: 'Image comparison' },
})

const classes = computed(() => cn('diff', props.aspect, 'rounded-box'))
</script>

<template>
  <figure :class="classes" tabindex="0" :aria-label="label">
    <div class="diff-item-1" role="img" :aria-label="beforeAlt" tabindex="0">
      <slot name="before">
        <img :src="before" :alt="beforeAlt" />
      </slot>
    </div>
    <div class="diff-item-2" role="img" :aria-label="afterAlt">
      <slot name="after">
        <img :src="after" :alt="afterAlt" />
      </slot>
    </div>
    <div class="diff-resizer" />
  </figure>
</template>
