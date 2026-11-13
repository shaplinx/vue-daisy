<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowRight,
  Blocks,
  CheckCircle2,
  Component,
  Database,
  Layers3,
  Palette,
  Sparkles,
  Users,
} from '@lucide/vue'
import { componentCategories, components } from '@/data/componentRegistry'
import { useTheme } from '@/composables/useTheme'

const { themes, currentTheme } = useTheme()

const stats = computed(() => [
  {
    id: 'components',
    title: 'Components',
    value: components.length,
    description: 'Reusable Dz* components',
    icon: Component,
    color: 'primary',
  },
  {
    id: 'categories',
    title: 'Categories',
    value: componentCategories.length,
    description: 'Actions → Mockup',
    icon: Layers3,
    color: 'secondary',
  },
  {
    id: 'themes',
    title: 'Themes',
    value: themes.length,
    description: `Active: ${currentTheme.value?.label || 'Light'}`,
    icon: Palette,
    color: 'accent',
  },
  {
    id: 'milestone',
    title: 'Milestone',
    value: '7 / 7',
    description: 'All phases complete',
    icon: Sparkles,
    color: 'success',
  },
])

const highlights = [
  {
    title: 'Interactive component showcase',
    description: '69 live demos with preview, variants, API tables and copyable source.',
    to: '/components',
    icon: Blocks,
    badge: 'Ready',
  },
  {
    title: 'Theme system',
    description: 'Six DaisyUI themes with persistence and a live preview picker.',
    to: '/themes',
    icon: Palette,
    badge: 'Ready',
  },
  {
    title: 'Data management',
    description: 'Reusable DataTable and Users CRUD demonstration with Laravel pagination.',
    to: '/data',
    icon: Database,
    badge: 'Ready',
  },
  {
    title: 'FormKit integration',
    description: 'DaisyUI-compatible FormKit theme with eight rich validation examples.',
    to: '/forms',
    icon: Users,
    badge: 'Ready',
  },
]

const recent = [
  { id: 1, title: 'Component library completed', detail: `${components.length} components across ${componentCategories.length} categories`, tone: 'success' },
  { id: 2, title: 'DataTable completed', detail: 'Reusable table with client and server modes, native Laravel pagination', tone: 'success' },
  { id: 3, title: 'Users CRUD completed', detail: 'Create, view, edit and delete against the mock Laravel resource', tone: 'success' },
  { id: 4, title: 'FormKit forms completed', detail: 'Themed built-in inputs, three custom controls, eight form demos and a DaisyUI theme', tone: 'success' },
  { id: 5, title: 'Quality assurance completed', detail: 'Responsive, interaction, theme, CRUD, pagination and FormKit checks passed', tone: 'success' },
]

const categoryCards = componentCategories.map((category) => ({
  ...category,
  count: components.filter((component) => component.category === category.id).length,
}))
</script>

<template>
  <section class="space-y-6">
    <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div class="space-y-1">
        <p class="text-xs font-semibold uppercase tracking-widest text-primary">Milestone 7</p>
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
        <p class="max-w-2xl text-sm text-base-content/70">
          All seven phases are complete and quality-assured. Explore the component showcase, switch
          themes and inspect every reusable pattern in a real application shell.
        </p>
      </div>
      <DzButton color="primary" to="/components">
        Open component showcase
        <ArrowRight class="size-4" aria-hidden="true" />
      </DzButton>
    </header>

    <DzStat :items="stats" shadow class="w-full bg-base-100" />

    <div class="grid gap-4 lg:grid-cols-3">
      <div class="space-y-4 lg:col-span-2">
        <div class="grid gap-3 sm:grid-cols-2">
          <RouterLink
            v-for="highlight in highlights"
            :key="highlight.title"
            :to="highlight.to"
            class="group rounded-box border border-base-300 bg-base-100 p-4 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
          >
            <div class="flex items-start justify-between gap-2">
              <span class="flex size-10 items-center justify-center rounded-box bg-primary/10 text-primary">
                <component :is="highlight.icon" class="size-5" aria-hidden="true" />
              </span>
              <span
                class="badge badge-sm"
                :class="highlight.badge === 'Ready' ? 'badge-success badge-soft' : 'badge-ghost'"
              >{{ highlight.badge }}</span>
            </div>
            <h2 class="mt-3 flex items-center gap-1 font-semibold">
              {{ highlight.title }}
              <ArrowRight class="size-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-60" aria-hidden="true" />
            </h2>
            <p class="mt-1 text-xs text-base-content/60">{{ highlight.description }}</p>
          </RouterLink>
        </div>

        <div class="rounded-box border border-base-300 bg-base-100 p-4">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="font-semibold">Browse by category</h2>
            <RouterLink to="/components" class="link link-primary text-xs">View all</RouterLink>
          </div>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <RouterLink
              v-for="category in categoryCards"
              :key="category.id"
              :to="{ path: '/components', query: { category: category.id } }"
              class="flex items-center gap-2 rounded-box border border-base-300 px-3 py-2 text-xs transition hover:bg-base-200"
            >
              <component :is="category.icon" class="size-4 shrink-0 opacity-60" aria-hidden="true" />
              <span class="truncate">{{ category.label }}</span>
              <span class="ms-auto badge badge-ghost badge-xs">{{ category.count }}</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="rounded-box border border-base-300 bg-base-100 p-4">
          <h2 class="font-semibold">Project progress</h2>
          <ul class="mt-3 space-y-3">
            <li>
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="inline-flex items-center gap-1.5">
                  <CheckCircle2 class="size-3.5 text-success" aria-hidden="true" />
                  Foundation &amp; showcase
                </span>
                <span class="opacity-60">100%</span>
              </div>
              <DzProgress :value="100" color="success" size="sm" label="Foundation and showcase" />
            </li>
            <li>
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="inline-flex items-center gap-1.5">
                  <CheckCircle2 class="size-3.5 text-success" aria-hidden="true" />
                  DataTable &amp; CRUD
                </span>
                <span class="opacity-60">100%</span>
              </div>
              <DzProgress :value="100" color="success" size="sm" label="DataTable and CRUD" />
            </li>
            <li>
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="inline-flex items-center gap-1.5">
                  <CheckCircle2 class="size-3.5 text-success" aria-hidden="true" />
                  FormKit forms
                </span>
                <span class="opacity-60">100%</span>
              </div>
              <DzProgress :value="100" color="success" size="sm" label="FormKit forms" />
            </li>
            <li>
              <div class="mb-1 flex items-center justify-between text-xs">
                <span class="inline-flex items-center gap-1.5">
                  <CheckCircle2 class="size-3.5 text-success" aria-hidden="true" />
                  Quality assurance
                </span>
                <span class="opacity-60">100%</span>
              </div>
              <DzProgress :value="100" color="success" size="sm" label="Quality assurance" />
            </li>
          </ul>
        </div>

        <div class="rounded-box border border-base-300 bg-base-100 p-4">
          <h2 class="font-semibold">Activity</h2>
          <ul class="mt-3 space-y-3">
            <li v-for="item in recent" :key="item.id" class="flex gap-3">
              <span class="mt-1.5 size-2 shrink-0 rounded-full" :class="`bg-${item.tone}`" aria-hidden="true" />
              <div class="min-w-0">
                <p class="text-sm font-medium leading-snug">{{ item.title }}</p>
                <p class="text-xs text-base-content/60">{{ item.detail }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
