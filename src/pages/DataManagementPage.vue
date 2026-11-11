<script setup lang="ts">
import { ArrowRight, Database, Filter, Server, Table2, Users } from '@lucide/vue'

const planned = [
  { icon: Table2, title: 'Reusable DataTable', description: 'Column definitions, custom cells, alignment and visibility.' },
  { icon: Filter, title: 'Filtering & sorting', description: 'Global search, column filters, multi-column sorting and reset.' },
  { icon: Server, title: 'Client & server modes', description: 'Native Laravel pagination metadata without manual transformation.' },
  { icon: Users, title: 'Users CRUD', description: 'Create, view, edit and delete with confirmation and toasts.' },
]
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-1">
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Data Management</h1>
        <span class="badge badge-warning badge-soft">Phase 3</span>
      </div>
      <p class="max-w-2xl text-sm text-base-content/70">
        This area will host the reusable DataTable and the Users CRUD demonstration. The component
        library foundation is being verified first, as required.
      </p>
    </header>

    <div role="status" class="alert alert-info alert-soft">
      <Database class="size-5" aria-hidden="true" />
      <div>
        <h2 class="font-semibold">Milestone 1 in progress</h2>
        <p class="text-sm">
          CRUD is intentionally not implemented yet. Verify the component showcase first, then this
          page becomes the DataTable playground.
        </p>
      </div>
      <DzButton size="sm" variant="outline" to="/components">
        Review showcase
        <ArrowRight class="size-4" aria-hidden="true" />
      </DzButton>
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <div v-for="item in planned" :key="item.title" class="rounded-box border border-base-300 bg-base-100 p-4">
        <span class="flex size-9 items-center justify-center rounded-box bg-base-200">
          <component :is="item.icon" class="size-4.5 opacity-70" aria-hidden="true" />
        </span>
        <h2 class="mt-3 text-sm font-semibold">{{ item.title }}</h2>
        <p class="mt-1 text-xs text-base-content/60">{{ item.description }}</p>
      </div>
    </div>

    <div class="rounded-box border border-dashed border-base-300 bg-base-100 p-6">
      <h2 class="font-semibold">Meanwhile, explore the building blocks</h2>
      <p class="mt-1 text-sm text-base-content/70">
        The DataTable will compose the Table, Pagination, Input, Select, Badge, Button, Modal and
        Toast components — all of which are already implemented and interactive.
      </p>
      <div class="mt-4 flex flex-wrap gap-2">
        <DzButton size="sm" :to="{ path: '/components', query: { component: 'table' } }">Table</DzButton>
        <DzButton size="sm" variant="outline" :to="{ path: '/components', query: { component: 'pagination' } }">Pagination</DzButton>
        <DzButton size="sm" variant="outline" :to="{ path: '/components', query: { component: 'modal' } }">Modal</DzButton>
        <DzButton size="sm" variant="outline" :to="{ path: '/components', query: { component: 'toast' } }">Toast</DzButton>
      </div>
    </div>
  </section>
</template>
