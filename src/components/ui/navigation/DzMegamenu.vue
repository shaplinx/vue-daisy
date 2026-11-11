<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import type { Component, PropType } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { ChevronDown } from '@lucide/vue'
import { cn } from '@/utils/cn'

export interface MegaMenuLink {
  label: string
  to?: RouteLocationRaw
  href?: string
  icon?: Component
  description?: string
}

export interface MegaMenuGroup {
  title?: string
  links: MegaMenuLink[]
}

export interface MegaMenuItem {
  id?: string | number
  label: string
  to?: RouteLocationRaw
  icon?: Component
  active?: boolean
  groups?: MegaMenuGroup[]
}

const props = defineProps({
  items: { type: Array as PropType<MegaMenuItem[]>, default: () => [] },
  ariaLabel: { type: String, default: 'Mega menu' },
  openOnHover: { type: Boolean, default: true },
})

const activeIndex = ref(-1)
const root = ref<HTMLElement | null>(null)

const isOpen = computed(() => activeIndex.value >= 0)
const activeItem = computed<MegaMenuItem | null>(() => props.items[activeIndex.value] ?? null)

function toggle(index: number): void {
  activeIndex.value = activeIndex.value === index ? -1 : index
}

function open(index: number): void {
  activeIndex.value = index
}

function close(): void {
  activeIndex.value = -1
}

function onPointerEnter(index: number): void {
  if (props.openOnHover) open(index)
}

function onPointerLeave(event: MouseEvent): void {
  if (!props.openOnHover) return
  if (!root.value?.contains(event.relatedTarget as Node | null)) close()
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (!root.value?.contains(event.target as Node)) close()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    close()
    root.value?.querySelector<HTMLElement>('[data-mega-trigger][aria-expanded="true"]')?.focus()
  }
  if (event.key === 'ArrowDown' && activeIndex.value === -1) {
    event.preventDefault()
    open(0)
    nextTick(() =>
      root.value
        ?.querySelector<HTMLElement>('[data-mega-panel] a, [data-mega-panel] button')
        ?.focus(),
    )
  }
}

document.addEventListener('pointerdown', onDocumentPointerDown)
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown))
</script>

<template>
  <div ref="root" class="relative" @keydown="onKeydown" @mouseleave="onPointerLeave">
    <nav class="navbar rounded-box border border-base-300 bg-base-100 px-2" :aria-label="ariaLabel">
      <ul class="menu menu-horizontal w-full gap-1 px-0">
        <li v-for="(item, index) in items" :key="item.id ?? index">
          <button
            v-if="item.groups?.length"
            type="button"
            data-mega-trigger
            class="gap-1"
            :class="{ 'menu-active': activeIndex === index }"
            :aria-expanded="activeIndex === index"
            aria-haspopup="true"
            @click="toggle(index)"
            @mouseenter="onPointerEnter(index)"
          >
            <component :is="item.icon" v-if="item.icon" class="size-4" aria-hidden="true" />
            {{ item.label }}
            <ChevronDown class="size-3.5 opacity-60" aria-hidden="true" />
          </button>
          <RouterLink
            v-else-if="item.to"
            :to="item.to"
            :class="{ 'menu-active': item.active }"
            @mouseenter="close"
          >
            <component :is="item.icon" v-if="item.icon" class="size-4" aria-hidden="true" />
            {{ item.label }}
          </RouterLink>
          <a v-else href="#" @mouseenter="close">
            <component :is="item.icon" v-if="item.icon" class="size-4" aria-hidden="true" />
            {{ item.label }}
          </a>
        </li>
      </ul>
    </nav>

    <Transition name="fade">
      <div
        v-if="activeItem"
        data-mega-panel
        class="absolute inset-x-0 top-full z-50 mt-2 grid gap-6 rounded-box border border-base-300 bg-base-100 p-6 shadow-xl md:grid-cols-3"
        @mouseenter="open(activeIndex)"
      >
        <div v-for="(group, groupIndex) in activeItem.groups" :key="group.title ?? groupIndex">
          <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide opacity-50">
            {{ group.title }}
          </h3>
          <ul class="flex flex-col gap-1">
            <li v-for="(link, linkIndex) in group.links" :key="link.label ?? linkIndex">
              <RouterLink
                v-if="link.to"
                :to="link.to"
                class="flex items-start gap-3 rounded-box p-2 hover:bg-base-200"
                @click="close"
              >
                <span
                  v-if="link.icon"
                  class="flex size-9 shrink-0 items-center justify-center rounded-box bg-base-200"
                >
                  <component :is="link.icon" class="size-4" aria-hidden="true" />
                </span>
                <span>
                  <span class="block text-sm font-medium">{{ link.label }}</span>
                  <span v-if="link.description" class="block text-xs opacity-60">
                    {{ link.description }}
                  </span>
                </span>
              </RouterLink>
              <a
                v-else
                :href="link.href || '#'"
                class="flex items-start gap-3 rounded-box p-2 hover:bg-base-200"
                @click="close"
              >
                <span class="block text-sm font-medium">{{ link.label }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
</template>
