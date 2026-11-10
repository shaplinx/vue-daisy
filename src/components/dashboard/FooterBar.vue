<script setup>
import { Blocks, BookOpen } from '@lucide/vue'

const year = new Date().getFullYear()
const version = '0.1.0'
</script>

<template>
  <footer class="border-t border-base-300 bg-base-100/60 px-4 py-4 lg:px-6">
    <div class="flex flex-col items-center justify-between gap-2 text-xs text-base-content/60 sm:flex-row">
      <p class="inline-flex items-center gap-1.5">
        <Blocks class="size-3.5" aria-hidden="true" />
        <span class="font-semibold text-base-content/80">Vue Daisy</span>
        <span class="badge badge-ghost badge-xs">v{{ version }}</span>
      </p>
      <p>© {{ year }} Vue Daisy · Built with Vue 3, Tailwind CSS &amp; DaisyUI</p>
      <a
        href="https://daisyui.com/components/"
        target="_blank"
        rel="noopener noreferrer"
        class="link link-hover inline-flex items-center gap-1"
      >
        <BookOpen class="size-3.5" aria-hidden="true" />
        DaisyUI docs
      </a>
    </div>
  </footer>
</template>
