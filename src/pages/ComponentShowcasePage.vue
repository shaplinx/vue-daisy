<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Blocks, LayoutGrid, Search, SlidersHorizontal, X } from '@lucide/vue'
import ShowcaseCard from '@/showcase/ShowcaseCard.vue'
import { componentCategories, components } from '@/data/componentRegistry'

const route = useRoute()
const router = useRouter()

const search = ref('')
const searchInput = ref(null)

const activeCategory = computed(() => {
  const id = String(route.query.category || 'all')
  return componentCategories.some((category) => category.id === id) ? id : 'all'
})

const selectedId = computed(() => {
  const id = String(route.query.component || '')
  return components.some((component) => component.id === id) ? id : ''
})

const selectedComponent = computed(() =>
  selectedId.value ? components.find((component) => component.id === selectedId.value) : null,
)

const categoryLabel = computed(() =>
  Object.fromEntries(componentCategories.map((category) => [category.id, category.label])),
)

const categoryCounts = computed(() =>
  Object.fromEntries(
    componentCategories.map((category) => [
      category.id,
      components.filter((component) => component.category === category.id).length,
    ]),
  ),
)

function matchesSearch(component, query) {
  if (!query) return true
  const haystack = [
    component.name,
    component.id,
    component.description,
    categoryLabel.value[component.category],
    ...(component.props || []).map((prop) => prop.name),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

const searchTerm = computed(() => search.value.trim().toLowerCase())

const filteredComponents = computed(() => {
  if (selectedComponent.value) return [selectedComponent.value]
  return components.filter((component) => {
    const inCategory = activeCategory.value === 'all' || component.category === activeCategory.value
    return inCategory && matchesSearch(component, searchTerm.value)
  })
})

const navGroups = computed(() =>
  componentCategories
    .map((category) => ({
      ...category,
      items: components.filter(
        (component) =>
          component.category === category.id && matchesSearch(component, searchTerm.value),
      ),
    }))
    .filter((category) => category.items.length > 0),
)

const resultLabel = computed(() => {
  const count = filteredComponents.value.length
  if (selectedComponent.value) return selectedComponent.value.name
  return `${count} component${count === 1 ? '' : 's'}`
})

function setCategory(id) {
  search.value = ''
  const query = id === 'all' ? {} : { category: id }
  router.push({ path: '/components', query })
}

function clearFilters() {
  search.value = ''
  router.push({ path: '/components' })
}

function selectComponent(component) {
  const query = {}
  if (activeCategory.value !== 'all') query.category = activeCategory.value
  query.component = component.id
  router.push({ path: '/components', query })
  nextTick(() => document.getElementById(`component-${component.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function onSearch() {
  if (route.query.component) {
    const query = activeCategory.value !== 'all' ? { category: activeCategory.value } : {}
    router.replace({ path: '/components', query })
  }
}

watch(
  () => route.query.component,
  (id) => {
    if (!id) return
    nextTick(() => document.getElementById(`component-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  },
  { immediate: true },
)
</script>

<template>
  <section class="space-y-5">
    <header class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Component Library</h1>
          <span class="badge badge-primary">{{ components.length }} components</span>
          <span class="badge badge-ghost">{{ componentCategories.length }} categories</span>
        </div>
        <p class="max-w-2xl text-sm text-base-content/70">
          Every DaisyUI component, rebuilt as a reusable Vue 3 component with real interactive
          behaviour. Browse the preview, inspect variants, read the API and copy the source.
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs text-base-content/60">
        <Blocks class="size-4" aria-hidden="true" />
        <span>Vue 3 · DaisyUI 5 · Tailwind 4</span>
      </div>
    </header>

    <!-- Sticky search + category filters -->
    <div class="sticky top-16 z-20 -mx-4 border-y border-base-300 bg-base-200/95 px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6">
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div class="w-full sm:max-w-sm">
            <DzInput
              ref="searchInput"
              v-model="search"
              type="search"
              size="sm"
              clearable
              placeholder="Search components, props…"
              aria-label="Search components"
              @update:model-value="onSearch"
            >
              <template #prefix>
                <Search class="size-4 shrink-0 opacity-50" aria-hidden="true" />
              </template>
            </DzInput>
          </div>

          <div class="flex flex-1 items-center gap-2">
            <span class="hidden items-center gap-1.5 text-xs opacity-60 sm:inline-flex">
              <SlidersHorizontal class="size-3.5" aria-hidden="true" />
              {{ resultLabel }}
            </span>
            <div class="ms-auto flex items-center gap-1.5">
              <DzButton
                v-if="selectedComponent || search || activeCategory !== 'all'"
                variant="ghost"
                size="xs"
                @click="clearFilters"
              >
                <X class="size-3.5" aria-hidden="true" />
                Clear
              </DzButton>
            </div>
          </div>
        </div>

        <div class="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5" role="group" aria-label="Filter by category">
          <button
            type="button"
            class="btn btn-sm shrink-0 gap-1.5"
            :class="activeCategory === 'all' ? 'btn-primary' : 'btn-ghost bg-base-100'"
            :aria-pressed="activeCategory === 'all'"
            @click="setCategory('all')"
          >
            <LayoutGrid class="size-3.5" aria-hidden="true" />
            All
            <span class="badge badge-xs" :class="activeCategory === 'all' ? 'badge-neutral' : 'badge-ghost'">
              {{ components.length }}
            </span>
          </button>
          <button
            v-for="category in componentCategories"
            :key="category.id"
            type="button"
            class="btn btn-sm shrink-0 gap-1.5"
            :class="activeCategory === category.id ? 'btn-primary' : 'btn-ghost bg-base-100'"
            :aria-pressed="activeCategory === category.id"
            @click="setCategory(category.id)"
          >
            <component :is="category.icon" class="size-3.5" aria-hidden="true" />
            {{ category.label }}
            <span class="badge badge-xs" :class="activeCategory === category.id ? 'badge-neutral' : 'badge-ghost'">
              {{ categoryCounts[category.id] }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="grid gap-5 xl:grid-cols-[16rem_minmax(0,1fr)]">
      <!-- Component navigation -->
      <aside class="hidden xl:block" aria-label="Component navigation">
        <div class="sticky top-40 max-h-[calc(100vh-11rem)] overflow-y-auto rounded-box border border-base-300 bg-base-100 p-2">
          <p class="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-widest opacity-40">
            Jump to component
          </p>
          <nav v-if="navGroups.length" class="space-y-3">
            <div v-for="group in navGroups" :key="group.id">
              <p class="flex items-center gap-1.5 px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest opacity-40">
                <component :is="group.icon" class="size-3" aria-hidden="true" />
                {{ group.label }}
                <span class="ms-auto">{{ group.items.length }}</span>
              </p>
              <ul class="menu menu-sm w-full p-0">
                <li v-for="component in group.items" :key="component.id">
                  <button
                    type="button"
                    class="gap-2"
                    :class="{ 'menu-active': selectedId === component.id }"
                    @click="selectComponent(component)"
                  >
                    <span class="size-1.5 rounded-full bg-current opacity-40" aria-hidden="true" />
                    <span class="truncate">{{ component.name }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
          <p v-else class="px-2 py-6 text-center text-xs opacity-60">
            No components match “{{ search }}”.
          </p>
        </div>
      </aside>

      <!-- Showcase content -->
      <div class="min-w-0 space-y-4">
        <div v-if="selectedComponent" class="flex flex-col gap-2 rounded-box border border-primary/30 bg-primary/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm">
            Showing <strong>{{ selectedComponent.name }}</strong> from
            <strong>{{ categoryLabel[selectedComponent.category] }}</strong>.
          </p>
          <DzButton variant="outline" size="sm" @click="clearFilters">
            Show all {{ components.length }} components
          </DzButton>
        </div>

        <template v-if="filteredComponents.length">
          <ShowcaseCard
            v-for="component in filteredComponents"
            :key="component.id"
            :component="component"
          />
        </template>

        <div v-else class="rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
          <Search class="mx-auto mb-3 size-10 opacity-30" aria-hidden="true" />
          <h2 class="text-lg font-semibold">No components found</h2>
          <p class="mt-1 text-sm opacity-60">
            Nothing matches “{{ search }}”<template v-if="activeCategory !== 'all'"> in {{ categoryLabel[activeCategory] }}</template>.
          </p>
          <DzButton class="mt-4" size="sm" @click="clearFilters">Reset filters</DzButton>
        </div>
      </div>
    </div>
  </section>
</template>
