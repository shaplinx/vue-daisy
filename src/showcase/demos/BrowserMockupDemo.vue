<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Check, Globe, ShieldCheck, Sparkles } from '@lucide/vue'
import { gradientA, gradientE } from '@/showcase/demoAssets'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const url = ref('https://vue-daisy.dev')

const features = [
  { icon: Sparkles, title: 'Composable primitives', text: 'Small, accessible building blocks.' },
  { icon: ShieldCheck, title: 'Typed contracts', text: 'Predictable props, events and slots.' },
  { icon: Globe, title: 'Theme aware', text: 'Six themes, one consistent API.' },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <DzBrowserMockup :url="url">
      <div class="w-full max-w-2xl overflow-hidden rounded-box bg-base-100 shadow-sm">
        <div class="relative h-40 sm:h-52">
          <img :src="gradientA" alt="Aurora gradient hero" class="size-full object-cover" />
          <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-5 text-white">
            <span class="text-xs uppercase tracking-widest opacity-80">Component library</span>
            <h3 class="text-2xl font-bold">Build faster with Vue Daisy</h3>
          </div>
        </div>
        <div class="grid gap-3 p-5 sm:grid-cols-3">
          <div v-for="feature in features" :key="feature.title" class="rounded-box bg-base-200 p-3">
            <component :is="feature.icon" class="mb-2 size-4 text-primary" aria-hidden="true" />
            <p class="text-sm font-semibold">{{ feature.title }}</p>
            <p class="text-xs opacity-60">{{ feature.text }}</p>
          </div>
        </div>
      </div>
    </DzBrowserMockup>
    <p class="text-xs text-base-content/60">
      The address bar is driven by the <code>url</code> prop and can be bound with <code>v-model:url</code>.
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Default frame</p>
      <DzBrowserMockup>
        <img :src="gradientE" alt="Berry gradient preview" class="w-full max-w-xl rounded-box" />
      </DzBrowserMockup>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Borderless</p>
      <DzBrowserMockup :bordered="false" url="https://daisyui.com">
        <div class="flex items-center gap-3 text-sm">
          <Check class="size-4 text-success" aria-hidden="true" />
          <span>Borderless frame with custom content</span>
          <ArrowRight class="size-4 opacity-50" aria-hidden="true" />
        </div>
      </DzBrowserMockup>
    </div>
  </div>
</template>
