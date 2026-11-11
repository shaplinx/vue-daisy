<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Download, Plus, Save, Settings, Trash2 } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const toast = useToast()
const clicks = ref(0)
const loading = ref(false)

const colors = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error']
const variants = ['solid', 'outline', 'ghost', 'link', 'soft', 'dash']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl']

function save() {
  clicks.value += 1
  toast.success('Changes saved', { title: 'Button clicked' })
}

function run() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    toast.success('Background task finished')
  }, 1600)
}

function remove() {
  toast.error('Delete action triggered', { title: 'Destructive action' })
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-5">
    <div class="flex flex-wrap items-center gap-2">
      <DzButton color="primary" @click="save">
        <template #icon><Save class="size-4" aria-hidden="true" /></template>
        Save changes
      </DzButton>
      <DzButton variant="outline" @click="toast.info('Outline button clicked')">
        <template #icon><Download class="size-4" aria-hidden="true" /></template>
        Export
      </DzButton>
      <DzButton variant="soft" color="error" @click="remove">
        <template #icon><Trash2 class="size-4" aria-hidden="true" /></template>
        Delete
      </DzButton>
      <DzButton variant="ghost" circle aria-label="Settings" @click="toast.info('Settings clicked')">
        <template #icon><Settings class="size-4" aria-hidden="true" /></template>
      </DzButton>
      <DzButton color="secondary" :loading="loading" loading-text="Working…" @click="run">
        Run task
      </DzButton>
      <DzButton disabled>Disabled</DzButton>
    </div>

    <div class="flex flex-wrap items-center gap-3 text-xs text-base-content/60">
      <span class="badge badge-ghost">Clicks: {{ clicks }}</span>
      <span>Buttons emit real click events; loading blocks interaction until finished.</span>
    </div>

    <div class="flex flex-wrap items-center gap-2 border-t border-base-300 pt-4">
      <DzButton variant="link" to="/components">
        Router link
        <ArrowRight class="size-3.5" aria-hidden="true" />
      </DzButton>
      <DzButton variant="link" color="secondary" href="https://daisyui.com" target="_blank" rel="noopener noreferrer">
        External link
      </DzButton>
      <DzButton variant="dash" color="primary">
        <template #icon><Plus class="size-4" aria-hidden="true" /></template>
        Add item
      </DzButton>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap gap-2">
        <DzButton v-for="color in colors" :key="color" :color="color">{{ color }}</DzButton>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Visual styles</p>
      <div class="flex flex-wrap gap-2">
        <DzButton v-for="variant in variants" :key="variant" :variant="variant" color="primary">{{ variant }}</DzButton>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-end gap-2">
        <DzButton v-for="size in sizes" :key="size" :size="size" color="primary">{{ size }}</DzButton>
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Shapes &amp; states</p>
      <div class="flex flex-wrap items-center gap-2">
        <DzButton wide color="primary">Wide</DzButton>
        <DzButton block color="secondary" class="sm:w-40">Block</DzButton>
        <DzButton circle aria-label="Add"><template #icon><Plus class="size-4" aria-hidden="true" /></template></DzButton>
        <DzButton square aria-label="Settings"><template #icon><Settings class="size-4" aria-hidden="true" /></template></DzButton>
        <DzButton active color="accent">Active</DzButton>
        <DzButton loading color="info" loading-text="Loading" />
        <DzButton disabled color="neutral">Disabled</DzButton>
      </div>
    </div>
  </div>
</template>
