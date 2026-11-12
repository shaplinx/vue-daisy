<script setup lang="ts">
defineProps<{
  id: string
  title: string
  description: string
  badge?: string
}>()
</script>

<template>
  <article :id="id" class="showcase-anchor rounded-box border border-base-300 bg-base-100 shadow-sm">
    <header class="flex flex-col gap-2 border-b border-base-300 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
      <div class="min-w-0">
        <h2 class="text-lg font-bold tracking-tight">{{ title }}</h2>
        <p class="mt-1 max-w-3xl text-sm text-base-content/70">{{ description }}</p>
      </div>
      <span v-if="badge" class="badge badge-primary badge-soft badge-sm shrink-0">{{ badge }}</span>
    </header>
    <div class="p-4 sm:p-6">
      <slot />
    </div>
  </article>
</template>
