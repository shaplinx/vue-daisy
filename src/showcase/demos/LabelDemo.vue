<script setup lang="ts">
import { ref } from 'vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const name = ref('Reza Irfan')
</script>

<template>
  <div v-if="mode !== 'variants'" class="max-w-md space-y-4">
    <DzLabel text="Full name" html-for="label-name" required />
    <DzInput id="label-name" v-model="name" clearable />
    <DzLabel text="Nickname" html-for="label-nick" optional />
    <DzInput id="label-nick" placeholder="Optional" />
    <DzLabel text="Read-only label" />
    <p class="text-sm opacity-70">Labels can be standalone when the input has its own aria-label.</p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Variants</p>
      <div class="max-w-md space-y-3">
        <DzLabel text="Default label" />
        <DzLabel text="Required field" required />
        <DzLabel text="Optional field" optional />
        <DzLabel><span class="font-semibold text-primary">Custom slot content</span></DzLabel>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Paired with input</p>
      <div class="max-w-md">
        <DzLabel text="Email address" html-for="label-email" required />
        <DzInput id="label-email" type="email" placeholder="alex@example.com" />
      </div>
    </div>
  </div>
</template>
