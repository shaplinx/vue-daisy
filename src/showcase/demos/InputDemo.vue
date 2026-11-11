<script setup lang="ts">
import { ref } from 'vue'
import { AtSign, Mail, Search, User } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const name = ref('Ada Lovelace')
const email = ref('')
const search = ref('')
const password = ref('')
const submitted = ref('')

function onSubmit() {
  submitted.value = `Hello, ${name.value || 'stranger'}!`
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="max-w-xl space-y-4">
    <div class="form-control">
      <span class="label-text mb-1">Full name</span>
      <DzInput v-model="name" placeholder="Your name" clearable @enter="onSubmit">
        <template #prefix><User class="size-4 opacity-60" /></template>
      </DzInput>
    </div>
    <div class="form-control">
      <span class="label-text mb-1">Email</span>
      <DzInput v-model="email" type="email" placeholder="you@example.com" clearable>
        <template #prefix><Mail class="size-4 opacity-60" /></template>
      </DzInput>
    </div>
    <div class="form-control">
      <span class="label-text mb-1">Search</span>
      <DzInput v-model="search" type="search" placeholder="Search components…">
        <template #prefix><Search class="size-4 opacity-60" /></template>
        <template #suffix><kbd class="kbd kbd-sm">/</kbd></template>
      </DzInput>
    </div>
    <div class="flex items-center gap-3">
      <DzButton color="primary" size="sm" @click="onSubmit">Greet</DzButton>
      <span v-if="submitted" class="text-xs text-success">{{ submitted }}</span>
    </div>
    <p class="text-xs text-base-content/60">
      Press <kbd class="kbd kbd-xs">Enter</kbd> in the name field to trigger the same action.
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="grid max-w-2xl gap-3 sm:grid-cols-2">
        <DzInput v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" :size="size" :placeholder="`Size ${size}`" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="grid max-w-2xl gap-3 sm:grid-cols-2">
        <DzInput
          v-for="color in ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']"
          :key="color"
          :color="color"
          :placeholder="color"
        />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Types &amp; adornments</p>
      <div class="grid max-w-2xl gap-3 sm:grid-cols-2">
        <DzInput type="password" v-model="password" placeholder="Password" />
        <DzInput type="number" :model-value="42" placeholder="Number" />
        <DzInput type="date" :model-value="'2026-11-10'" />
        <DzInput :model-value="'ada@example.com'" clearable>
          <template #prefix><AtSign class="size-4 opacity-60" /></template>
        </DzInput>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">States</p>
      <div class="grid max-w-2xl gap-3 sm:grid-cols-2">
        <DzInput :model-value="''" invalid placeholder="Invalid" />
        <DzInput :model-value="'Read only value'" readonly />
        <DzInput :model-value="'Disabled value'" disabled />
        <DzInput :model-value="''" ghost placeholder="Ghost" />
      </div>
    </div>
  </div>
</template>
