<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import type { ClassValue } from '@/utils/cn'
import { cn } from '@/utils/cn'
import { modifier, COLORS } from '@/utils/daisy'

const props = defineProps({
  side: { type: String, default: 'start' },
  color: { type: String, default: 'default' },
  avatar: { type: String, default: '' },
  name: { type: String, default: '' },
  time: { type: String, default: '' },
  footer: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  bubbleClass: { type: [String, Array, Object] as PropType<ClassValue>, default: '' },
})

const classes = computed(() =>
  cn('chat', {
    'chat-start': props.side !== 'end',
    'chat-end': props.side === 'end',
  }),
)

const bubbleClass = computed(() =>
  cn('chat-bubble', modifier('chat-bubble', props.color, COLORS), props.bubbleClass),
)
</script>

<template>
  <div :class="classes">
    <div v-if="avatar || $slots.avatar" class="chat-image avatar">
      <slot name="avatar">
        <div class="w-10 rounded-full">
          <img :src="avatar" :alt="name || 'Avatar'" />
        </div>
      </slot>
    </div>

    <div v-if="name || time || $slots.header" class="chat-header">
      <slot name="header">
        {{ name }}
        <time v-if="time" class="ms-1 text-xs opacity-50">{{ time }}</time>
      </slot>
    </div>

    <div :class="bubbleClass">
      <span v-if="loading" class="loading loading-dots loading-sm" aria-label="Typing" />
      <slot v-else />
    </div>

    <div v-if="footer || $slots.footer" class="chat-footer opacity-50">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>
