<script setup lang="ts">
import type { PropType } from 'vue'
import { Check } from '@lucide/vue'
import type { MediaItem } from '@/services/mediaService'

const props = defineProps({
  item: { type: Object as PropType<MediaItem>, required: true },
  selected: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
})

const emit = defineEmits<{
  open: [item: MediaItem]
  toggle: [id: number]
}>()
</script>

<template>
  <article
    class="group relative aspect-square overflow-hidden rounded-box border-2 bg-base-200 transition"
    :class="[
      selected ? 'border-primary ring-2 ring-primary/25' : 'border-transparent hover:border-base-300',
      active && !selected ? 'outline outline-2 outline-base-content/25 outline-offset-1' : '',
    ]"
  >
    <button
      type="button"
      class="absolute inset-0 block h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      :aria-label="`View details for ${item.title || item.filename}`"
      :aria-pressed="selected"
      @click="emit('open', item)"
    >
      <img
        :src="item.thumbnailUrl"
        :alt="item.alt || item.title || item.filename"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
      />
    </button>

    <label
      class="absolute start-1.5 top-1.5 z-10 inline-flex cursor-pointer items-center justify-center rounded-md bg-base-100/90 p-1 shadow-sm backdrop-blur"
      :aria-label="`${selected ? 'Deselect' : 'Select'} ${item.title || item.filename}`"
      @click.stop
    >
      <input
        type="checkbox"
        class="checkbox checkbox-primary checkbox-sm"
        :checked="selected"
        :aria-label="`${selected ? 'Deselect' : 'Select'} ${item.title || item.filename}`"
        @change="emit('toggle', item.id)"
      />
    </label>

    <span
      v-if="selected"
      class="pointer-events-none absolute end-1.5 top-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-primary text-primary-content shadow"
      aria-hidden="true"
    >
      <Check class="size-4" />
    </span>

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-2 pt-6"
    >
      <p class="truncate text-xs font-medium text-white">{{ item.title || item.filename }}</p>
      <p class="truncate text-[10px] text-white/70">{{ item.filename }}</p>
    </div>
  </article>
</template>
