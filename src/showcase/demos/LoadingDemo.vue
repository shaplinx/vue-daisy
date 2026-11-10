<script setup>
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const loading = ref(true)
const types = ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity']
const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-5">
    <div class="flex flex-wrap items-center gap-6">
      <DzLoading v-for="type in types" :key="type" :type="type" size="lg" color="primary" :text="type" />
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <DzButton size="sm" variant="outline" @click="loading = !loading">
        {{ loading ? 'Stop loading' : 'Start loading' }}
      </DzButton>
      <DzButton :loading="loading" :loading-text="loading ? 'Saving…' : 'Save'" color="primary" size="sm" @click="loading = true">
        Save changes
      </DzButton>
      <span class="text-xs opacity-60">Loading states are announced with role="status".</span>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Types</p>
      <div class="flex flex-wrap items-center gap-6">
        <DzLoading v-for="type in types" :key="type" :type="type" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-center gap-6">
        <DzLoading v-for="size in sizes" :key="size" :size="size" :label="`Size ${size}`" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap items-center gap-6">
        <DzLoading v-for="color in colors" :key="color" :color="color" type="dots" />
      </div>
    </div>
  </div>
</template>
