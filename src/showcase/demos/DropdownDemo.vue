<script setup>
import { ref } from 'vue'
import { ChevronDown, Copy, Pencil, Settings, Share2, Trash2 } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const toast = useToast()
const lastAction = ref('Nothing selected yet')
const controlled = ref(false)

function onSelect(event) {
  const label = event.target.closest('[role="menuitem"], button, a')?.textContent?.trim() || 'Item'
  lastAction.value = label
  toast.info(`Selected: ${label}`)
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-5">
    <div class="flex flex-wrap items-center gap-3">
      <DzDropdown placement="end" @select="onSelect">
        <template #trigger="{ toggle, open }">
          <DzButton color="primary" @click="toggle" :aria-expanded="open">
            Actions
            <ChevronDown class="size-4" aria-hidden="true" />
          </DzButton>
        </template>
        <ul class="menu w-52">
          <li role="menuitem"><button type="button"><Pencil class="size-4" aria-hidden="true" />Edit</button></li>
          <li role="menuitem"><button type="button"><Copy class="size-4" aria-hidden="true" />Duplicate</button></li>
          <li role="menuitem"><button type="button"><Share2 class="size-4" aria-hidden="true" />Share</button></li>
          <li class="menu-title">Danger zone</li>
          <li role="menuitem"><button type="button" class="text-error"><Trash2 class="size-4" aria-hidden="true" />Delete</button></li>
        </ul>
      </DzDropdown>

      <DzDropdown placement="end" trigger="hover">
        <template #trigger="{ toggle }">
          <DzButton variant="outline" @click="toggle">Hover trigger</DzButton>
        </template>
        <ul class="menu w-48">
          <li><button type="button">Profile</button></li>
          <li><button type="button">Billing</button></li>
        </ul>
      </DzDropdown>

      <DzDropdown v-model="controlled" placement="end">
        <template #trigger="{ toggle, open }">
          <DzButton variant="ghost" @click="toggle" :aria-expanded="open">
            {{ controlled ? 'Close' : 'Controlled' }}
          </DzButton>
        </template>
        <div class="w-56 p-3 text-sm">
          <p class="font-medium">Controlled dropdown</p>
          <p class="mt-1 text-xs opacity-60">Open state is bound with v-model.</p>
          <DzButton size="xs" class="mt-2" @click="controlled = false">Close from inside</DzButton>
        </div>
      </DzDropdown>
    </div>

    <p class="text-xs text-base-content/60">
      Last action: <span class="badge badge-ghost badge-sm">{{ lastAction }}</span> · Escape, outside
      click and arrow keys are handled.
    </p>
  </div>

  <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="placement in ['end', 'start', 'top', 'bottom', 'left', 'right']" :key="placement" class="rounded-box border border-base-300 p-3">
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">{{ placement }}</p>
      <DzDropdown :placement="placement">
        <template #trigger="{ toggle }">
          <DzButton size="sm" variant="outline" @click="toggle">Open</DzButton>
        </template>
        <ul class="menu w-40">
          <li><button type="button">Option one</button></li>
          <li><button type="button">Option two</button></li>
        </ul>
      </DzDropdown>
    </div>
    <div class="rounded-box border border-base-300 p-3">
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Disabled</p>
      <DzDropdown disabled>
        <template #trigger="{ toggle }">
          <DzButton size="sm" disabled @click="toggle">Cannot open</DzButton>
        </template>
        <ul class="menu"><li><button>Hidden</button></li></ul>
      </DzDropdown>
    </div>
    <div class="rounded-box border border-base-300 p-3">
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Hover</p>
      <DzDropdown trigger="hover" placement="bottom">
        <template #trigger="{ toggle }">
          <DzButton size="sm" @click="toggle">Hover me</DzButton>
        </template>
        <ul class="menu w-40"><li><button type="button">Hover item</button></li></ul>
      </DzDropdown>
    </div>
  </div>
</template>
