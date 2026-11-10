<script setup>
import { ArrowLeft, SearchX } from '@lucide/vue'
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-base-200 p-6">
    <div class="w-full max-w-lg rounded-box border border-base-300 bg-base-100 p-8 text-center shadow-xl">
      <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-error/10 text-error">
        <SearchX class="size-8" aria-hidden="true" />
      </div>
      <p class="text-6xl font-black tracking-tighter text-primary">404</p>
      <h1 class="mt-2 text-xl font-bold">Page not found</h1>
      <p class="mt-2 text-sm text-base-content/70">
        The page you are looking for does not exist or has moved. The component showcase is always a
        good place to start.
      </p>
      <div class="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <DzButton color="primary" to="/components">
          <ArrowLeft class="size-4" aria-hidden="true" />
          Back to showcase
        </DzButton>
        <DzButton variant="outline" to="/dashboard">Open dashboard</DzButton>
      </div>
    </div>
  </div>
</template>
