<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { cn } from '@/utils/cn'

export interface CarouselItem {
  id?: string | number
  src?: string
  alt?: string
  [key: string]: unknown
}

const props = defineProps({
  items: { type: Array as PropType<CarouselItem[]>, default: () => [] },
  modelValue: { type: Number, default: 0 },
  vertical: { type: Boolean, default: false },
  showControls: { type: Boolean, default: true },
  showIndicators: { type: Boolean, default: true },
  loop: { type: Boolean, default: false },
  width: { type: String, default: 'w-full' },
  itemClass: { type: [String, Array, Object], default: '' },
  ariaLabel: { type: String, default: 'Carousel' },
})

const emit = defineEmits<{
  'update:modelValue': [index: number]
  change: [index: number]
}>()

const track = ref<HTMLElement | null>(null)
const active = ref(props.modelValue)

const rootClass = computed(() =>
  cn('carousel', props.width, {
    'carousel-vertical': props.vertical,
  }),
)

function slides(): Element[] {
  return track.value ? Array.from(track.value.children) : []
}

function goTo(index: number): void {
  const children = slides()
  if (!children.length) return
  const total = children.length
  let next: number
  if (props.loop) next = (index + total) % total
  else next = Math.min(Math.max(index, 0), total - 1)

  const child = children[next]
  child?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: props.vertical ? 'nearest' : 'center',
  })
  active.value = next
  emit('update:modelValue', next)
  emit('change', next)
}

function next(): void {
  goTo(active.value + 1)
}

function prev(): void {
  goTo(active.value - 1)
}

function onScroll(): void {
  const children = slides()
  if (!children.length || !track.value) return
  const rect = track.value.getBoundingClientRect()
  let closest = 0
  let min = Infinity
  children.forEach((child, index) => {
    const childRect = child.getBoundingClientRect()
    const distance = props.vertical
      ? Math.abs(childRect.top - rect.top)
      : Math.abs(childRect.left - rect.left)
    if (distance < min) {
      min = distance
      closest = index
    }
  })
  if (closest !== active.value) {
    active.value = closest
    emit('update:modelValue', closest)
    emit('change', closest)
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (value !== active.value) nextTick(() => goTo(value))
  },
)

onMounted(() => track.value?.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => track.value?.removeEventListener('scroll', onScroll))

defineExpose({ next, prev, goTo })
</script>

<template>
  <div class="relative">
    <div
      ref="track"
      :class="rootClass"
      role="region"
      :aria-label="ariaLabel"
      tabindex="0"
      @keydown.left.prevent="prev"
      @keydown.right.prevent="next"
    >
      <div
        v-for="(item, index) in items"
        :key="item.id ?? index"
        class="carousel-item"
        :class="itemClass"
      >
        <img
          v-if="item.src"
          :src="item.src"
          :alt="item.alt || `Slide ${index + 1}`"
          class="h-full w-full object-cover"
          loading="lazy"
        />
        <slot name="item" :item="item" :index="index" />
      </div>
      <slot />
    </div>

    <button
      v-if="showControls && !vertical"
      type="button"
      class="btn btn-circle btn-sm absolute start-2 top-1/2 z-10 -translate-y-1/2 shadow"
      aria-label="Previous slide"
      @click="prev"
    >
      <ChevronLeft class="size-4" aria-hidden="true" />
    </button>
    <button
      v-if="showControls && !vertical"
      type="button"
      class="btn btn-circle btn-sm absolute end-2 top-1/2 z-10 -translate-y-1/2 shadow"
      aria-label="Next slide"
      @click="next"
    >
      <ChevronRight class="size-4" aria-hidden="true" />
    </button>

    <div
      v-if="showIndicators"
      class="mt-3 flex justify-center gap-2"
      role="tablist"
      aria-label="Carousel slides"
    >
      <button
        v-for="(_, index) in items.length || slides().length"
        :key="index"
        type="button"
        class="size-2.5 rounded-full transition-colors"
        :class="index === active ? 'bg-primary' : 'bg-base-content/20 hover:bg-base-content/40'"
        role="tab"
        :aria-selected="index === active"
        :aria-label="`Go to slide ${index + 1}`"
        @click="goTo(index)"
      />
    </div>
  </div>
</template>
