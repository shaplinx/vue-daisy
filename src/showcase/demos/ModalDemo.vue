<script setup>
import { ref } from 'vue'
import { Check, Trash2 } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const toast = useToast()

const open = ref(false)
const size = ref('md')
const busy = ref(false)
const dismissible = ref(true)
const name = ref('')

function launch(nextSize = 'md') {
  size.value = nextSize
  open.value = true
}

function confirm() {
  busy.value = true
  setTimeout(() => {
    busy.value = false
    open.value = false
    toast.success(name.value ? `Created “${name.value}”` : 'Action confirmed')
    name.value = ''
  }, 900)
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <DzButton color="primary" @click="launch('md')">Open dialog</DzButton>
      <DzButton variant="outline" @click="launch('sm')">Small</DzButton>
      <DzButton variant="outline" @click="launch('lg')">Large</DzButton>
      <DzButton variant="ghost" @click="dismissible = !dismissible; launch('md')">
        {{ dismissible ? 'Locked backdrop' : 'Dismissible backdrop' }}
      </DzButton>
    </div>
    <p class="text-xs text-base-content/60">
      Escape and backdrop click close the dialog by default. Focus is trapped while open.
    </p>

    <DzModal
      v-model="open"
      :size="size"
      :backdrop-close="dismissible"
      :esc-close="dismissible"
      title="Create a new project"
      description="Dialogs support custom headers, bodies, footers and async confirmation."
      @close="busy = false"
    >
      <div class="space-y-3">
        <label class="label" for="modal-name"><span class="label-text">Project name</span></label>
        <DzInput id="modal-name" v-model="name" placeholder="e.g. Marketing site" clearable />
        <DzAlert v-if="!dismissible" color="warning" variant="soft" :closable="false">
          This dialog is locked — use the buttons below to close it.
        </DzAlert>
      </div>

      <template #footer>
        <DzButton variant="ghost" :disabled="busy" @click="open = false">Cancel</DzButton>
        <DzButton color="primary" :loading="busy" @click="confirm">
          <template #icon><Check class="size-4" aria-hidden="true" /></template>
          Create project
        </DzButton>
      </template>
    </DzModal>
  </div>

  <div v-else class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <DzButton v-for="s in ['sm', 'md', 'lg', 'xl', 'full']" :key="s" :variant="s === 'md' ? 'solid' : 'outline'" color="primary" @click="launch(s)">
        {{ s }} modal
      </DzButton>
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      <div class="rounded-box border border-base-300 p-3">
        <p class="text-xs font-semibold uppercase tracking-widest opacity-50">Positions</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <DzButton v-for="p in ['top', 'middle', 'bottom']" :key="p" size="xs" variant="outline" @click="launch('md')">{{ p }}</DzButton>
        </div>
      </div>
      <div class="rounded-box border border-base-300 p-3">
        <p class="text-xs font-semibold uppercase tracking-widest opacity-50">Footer actions</p>
        <div class="mt-2 flex items-center gap-2">
          <DzButton size="xs" variant="ghost"><template #icon><Trash2 class="size-3" aria-hidden="true" /></template>Delete</DzButton>
          <DzButton size="xs" color="primary"><template #icon><Check class="size-3" aria-hidden="true" /></template>Confirm</DzButton>
        </div>
      </div>
    </div>

    <DzModal v-model="open" :size="size" :backdrop-close="dismissible" :esc-close="dismissible" title="Modal preview" description="Resize and dismiss behaviour adapt to the selected options.">
      <p class="text-sm">This modal is rendered with <code class="rounded bg-base-200 px-1">size="{{ size }}"</code>.</p>
      <template #footer>
        <DzButton variant="ghost" @click="open = false">Close</DzButton>
        <DzButton color="primary" @click="open = false">Got it</DzButton>
      </template>
    </DzModal>
  </div>
</template>
