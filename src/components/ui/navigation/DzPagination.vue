<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@lucide/vue'
import { cn } from '@/utils/cn'
import { modifier, SIZES } from '@/utils/daisy'

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  total: { type: Number, default: 0 },
  perPage: { type: Number, default: 10 },
  siblingCount: { type: Number, default: 1 },
  showEdges: { type: Boolean, default: true },
  showPrevNext: { type: Boolean, default: true },
  size: { type: String, default: 'md' },
  disabled: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Pagination' },
})

const emit = defineEmits(['update:modelValue', 'change', 'page-change'])

const current = computed(() => Math.min(Math.max(1, props.modelValue), Math.max(1, props.totalPages)))

const pages = computed(() => {
  const total = Math.max(1, props.totalPages)
  const sibling = Math.max(0, props.siblingCount)
  const start = Math.max(2, current.value - sibling)
  const end = Math.min(total - 1, current.value + sibling)
  const result = [1]

  if (start > 2) result.push('start-ellipsis')
  for (let page = start; page <= end; page += 1) result.push(page)
  if (end < total - 1) result.push('end-ellipsis')
  if (total > 1) result.push(total)
  return result
})

const classes = computed(() => cn('join', modifier('join', props.size, SIZES)))

const canPrev = computed(() => current.value > 1 && !props.disabled)
const canNext = computed(() => current.value < props.totalPages && !props.disabled)

function goTo(page) {
  if (props.disabled) return
  const next = Math.min(Math.max(1, page), Math.max(1, props.totalPages))
  if (next === current.value) return
  emit('update:modelValue', next)
  emit('change', next)
  emit('page-change', next)
}
</script>

<template>
  <div class="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
    <div v-if="total" class="text-xs opacity-60" aria-live="polite">
      Page {{ current }} of {{ totalPages }} · {{ total }} records
    </div>

    <nav :aria-label="ariaLabel">
      <div :class="classes">
        <button
          v-if="showEdges"
          type="button"
          class="join-item btn btn-sm"
          :disabled="!canPrev"
          aria-label="First page"
          @click="goTo(1)"
        >
          <ChevronsLeft class="size-4" aria-hidden="true" />
        </button>
        <button
          v-if="showPrevNext"
          type="button"
          class="join-item btn btn-sm"
          :disabled="!canPrev"
          aria-label="Previous page"
          @click="goTo(current - 1)"
        >
          <ChevronLeft class="size-4" aria-hidden="true" />
        </button>

        <template v-for="page in pages" :key="page">
          <span v-if="typeof page === 'string'" class="join-item btn btn-sm btn-disabled" aria-hidden="true">
            …
          </span>
          <button
            v-else
            type="button"
            class="join-item btn btn-sm"
            :class="{ 'btn-active btn-primary': page === current }"
            :aria-current="page === current ? 'page' : undefined"
            :aria-label="`Page ${page}`"
            @click="goTo(page)"
          >
            {{ page }}
          </button>
        </template>

        <button
          v-if="showPrevNext"
          type="button"
          class="join-item btn btn-sm"
          :disabled="!canNext"
          aria-label="Next page"
          @click="goTo(current + 1)"
        >
          <ChevronRight class="size-4" aria-hidden="true" />
        </button>
        <button
          v-if="showEdges"
          type="button"
          class="join-item btn btn-sm"
          :disabled="!canNext"
          aria-label="Last page"
          @click="goTo(totalPages)"
        >
          <ChevronsRight class="size-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  </div>
</template>
