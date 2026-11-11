<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Component as VueComponent } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import {
  ArrowRight,
  Blocks,
  ClipboardList,
  Component,
  CornerDownLeft,
  Database,
  LayoutDashboard,
  Palette,
  Search,
  Settings,
  X,
} from '@lucide/vue'
import { components, componentCategories } from '@/data/componentRegistry'

interface SearchResult {
  label: string
  description: string
  to: RouteLocationRaw
  icon: VueComponent
  type: string
  group: string
  keywords?: string
}

const router = useRouter()

const open = ref(false)
const query = ref('')
const activeIndex = ref(0)
const input = ref<HTMLInputElement | null>(null)

const pages = [
  { label: 'Dashboard', description: 'Project overview and activity', to: '/dashboard', icon: LayoutDashboard, keywords: 'home overview' },
  { label: 'Component Library', description: 'Every DaisyUI component', to: '/components', icon: Component, keywords: 'showcase docs playground' },
  { label: 'Data Management', description: 'Tables and CRUD demonstrations', to: '/data', icon: Database, keywords: 'users table crud' },
  { label: 'Form Examples', description: 'FormKit forms and validation', to: '/forms', icon: ClipboardList, keywords: 'forms inputs validation' },
  { label: 'Settings', description: 'Application preferences', to: '/settings', icon: Settings, keywords: 'preferences config' },
  { label: 'Theme Settings', description: 'Switch and preview themes', to: '/themes', icon: Palette, keywords: 'appearance color dark light' },
]

const categoryLabel = computed(() =>
  Object.fromEntries(componentCategories.map((category) => [category.id, category.label])),
)

const results = computed<SearchResult[]>(() => {
  const q = query.value.trim().toLowerCase()
  const pageResults: SearchResult[] = pages
    .filter((page) => !q || `${page.label} ${page.description} ${page.keywords}`.toLowerCase().includes(q))
    .map((page) => ({ ...page, type: 'Page', group: 'Pages' }))

  const componentResults: SearchResult[] = components
    .filter((item) => {
      if (!q) return false
      return `${item.name} ${item.id} ${item.description} ${categoryLabel.value[item.category] || ''}`
        .toLowerCase()
        .includes(q)
    })
    .slice(0, 8)
    .map((item) => ({
      label: item.name,
      description: categoryLabel.value[item.category] || 'Component',
      to: { path: '/components', query: { component: item.id } },
      icon: Blocks,
      type: 'Component',
      group: 'Components',
    }))

  if (!q) return pageResults
  return [...pageResults, ...componentResults].slice(0, 12)
})

const groupedResults = computed<Array<{ label: string; items: SearchResult[] }>>(() => {
  const groups = new Map<string, SearchResult[]>()
  for (const result of results.value) {
    if (!groups.has(result.group)) groups.set(result.group, [])
    groups.get(result.group)?.push(result)
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }))
})

const flatResults = computed(() => groupedResults.value.flatMap((group) => group.items))

watch(flatResults, () => {
  activeIndex.value = 0
})

watch(open, (value) => {
  if (value) {
    nextTick(() => input.value?.focus())
  } else {
    query.value = ''
  }
})

function show() {
  open.value = true
}

function close() {
  open.value = false
}

function choose(result: SearchResult | undefined): void {
  if (!result) return
  router.push(result.to)
  close()
}

function onKeydown(event: KeyboardEvent): void {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value ? close() : show()
    return
  }

  if (!open.value) return

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % Math.max(1, flatResults.value.length)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + flatResults.value.length) % Math.max(1, flatResults.value.length)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    choose(flatResults.value[activeIndex.value])
  }
}

function onOverlayClick(event: MouseEvent): void {
  if (event.target === event.currentTarget) close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div>
    <button
      type="button"
      class="btn btn-ghost hidden h-9 min-h-0 items-center gap-2 border border-base-300 bg-base-200/60 px-3 font-normal text-base-content/60 md:inline-flex"
      aria-label="Search the application"
      @click="show"
    >
      <Search class="size-4" aria-hidden="true" />
      <span class="text-sm">Search…</span>
      <kbd class="kbd kbd-xs ms-6">⌘K</kbd>
    </button>

    <button
      type="button"
      class="btn btn-ghost btn-circle md:hidden"
      aria-label="Search the application"
      @click="show"
    >
      <Search class="size-5" aria-hidden="true" />
    </button>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="open"
          class="fixed inset-0 z-[90] flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="Global search"
          @click="onOverlayClick"
        >
          <div class="w-full max-w-xl overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-2xl">
            <div class="flex items-center gap-3 border-b border-base-300 px-4">
              <Search class="size-5 shrink-0 opacity-50" aria-hidden="true" />
              <input
                ref="input"
                v-model="query"
                type="search"
                class="h-14 flex-1 bg-transparent text-base outline-none"
                placeholder="Search pages and components…"
                aria-label="Search pages and components"
              />
              <button type="button" class="btn btn-ghost btn-xs btn-circle" aria-label="Close search" @click="close">
                <X class="size-4" aria-hidden="true" />
              </button>
            </div>

            <div class="max-h-[60vh] overflow-y-auto p-2">
              <template v-if="groupedResults.length">
                <div v-for="group in groupedResults" :key="group.label" class="mb-2">
                  <p class="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest opacity-40">
                    {{ group.label }}
                  </p>
                  <ul>
                    <li v-for="result in group.items" :key="`${result.type}-${result.label}`">
                      <button
                        type="button"
                        class="flex w-full items-center gap-3 rounded-box px-2.5 py-2 text-start"
                        :class="flatResults[activeIndex] === result ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'"
                        @click="choose(result)"
                        @mouseenter="activeIndex = flatResults.indexOf(result)"
                      >
                        <span class="flex size-8 shrink-0 items-center justify-center rounded-box bg-base-200">
                          <component :is="result.icon" class="size-4" aria-hidden="true" />
                        </span>
                        <span class="min-w-0 flex-1">
                          <span class="block truncate text-sm font-medium">{{ result.label }}</span>
                          <span class="block truncate text-xs opacity-60">{{ result.description }}</span>
                        </span>
                        <ArrowRight class="size-4 shrink-0 opacity-40" aria-hidden="true" />
                      </button>
                    </li>
                  </ul>
                </div>
              </template>
              <p v-else class="px-3 py-10 text-center text-sm opacity-60">
                No results for “{{ query }}”.
              </p>
            </div>

            <div class="flex items-center justify-between border-t border-base-300 bg-base-200/50 px-4 py-2 text-[11px] opacity-60">
              <span class="inline-flex items-center gap-1">
                <CornerDownLeft class="size-3" aria-hidden="true" /> to select
              </span>
              <span>↑ ↓ to navigate · esc to close</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
