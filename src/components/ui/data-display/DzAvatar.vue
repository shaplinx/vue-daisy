<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { UserRound } from '@lucide/vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  size: { type: String, default: 'md' },
  shape: { type: String, default: 'circle' },
  ring: { type: String, default: '' },
  status: { type: String, default: '' },
  statusColor: { type: String, default: 'success' },
  placeholder: { type: String, default: '' },
  icon: { type: [Object, Function], default: null },
})

const failed = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
  },
)

const showImage = computed(() => Boolean(props.src) && !failed.value)

const initials = computed(() => {
  if (props.placeholder) return props.placeholder
  if (!props.alt) return ''
  return props.alt
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
})

const maskClass = computed(() =>
  ({
    circle: 'rounded-full',
    squircle: 'mask mask-squircle',
    rounded: 'rounded-xl',
    square: 'rounded-none',
    hexagon: 'mask mask-hexagon',
    star: 'mask mask-star-2',
  })[props.shape] || 'rounded-full',
)

const sizeClass = computed(
  () =>
    ({
      xs: 'w-6',
      sm: 'w-8',
      md: 'w-12',
      lg: 'w-16',
      xl: 'w-24',
    })[props.size] || 'w-12',
)

const ringClass = computed(() => {
  if (!props.ring) return ''
  const color = modifier('ring', props.ring, COLORS)
  return cn(color, 'ring-offset-2 ring-offset-base-100')
})
</script>

<template>
  <div
    class="avatar"
    :class="{
      'avatar-placeholder': !showImage,
      'avatar-online': status === 'online',
      'avatar-offline': status === 'offline',
    }"
  >
    <div
      :class="[
        sizeClass,
        maskClass,
        ringClass,
        showImage ? '' : 'bg-neutral text-neutral-content',
      ]"
    >
      <img v-if="showImage" :src="src" :alt="alt" @error="failed = true" />
      <span v-else-if="initials" class="text-sm font-semibold" aria-hidden="true">
        {{ initials }}
      </span>
      <component
        :is="icon || UserRound"
        v-else
        class="size-1/2 opacity-70"
        aria-hidden="true"
      />
    </div>
    <span v-if="status === 'online' || status === 'offline'" class="sr-only">{{ status }}</span>
  </div>
</template>
