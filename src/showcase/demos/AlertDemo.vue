<script setup>
import { ref } from 'vue'
import { CheckCircle2, Info, TriangleAlert, XCircle } from '@lucide/vue'
import { useToast } from '@/composables/useToast'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const toast = useToast()
const visible = ref(true)
const controlled = ref(true)

const alerts = [
  { id: 'info', color: 'info', icon: Info, title: 'Heads up', description: 'A new version of the component library is available.' },
  { id: 'success', color: 'success', icon: CheckCircle2, title: 'Saved successfully', description: 'Your changes have been written to the project.' },
  { id: 'warning', color: 'warning', icon: TriangleAlert, title: 'Check your input', description: 'Some required fields still need attention.' },
  { id: 'error', color: 'error', icon: XCircle, title: 'Something went wrong', description: 'The request failed. Please try again in a moment.' },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <DzAlert
      v-for="alert in alerts"
      :key="alert.id"
      :color="alert.color"
      :icon="alert.icon"
      :title="alert.title"
      :description="alert.description"
      closable
      @close="toast.info(`${alert.title} alert dismissed`)"
    />

    <DzAlert v-model="visible" color="primary" variant="soft" title="Controlled visibility" description="This alert is bound with v-model." closable />
    <DzButton v-if="!visible" size="sm" variant="outline" @click="visible = true">Show controlled alert again</DzButton>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Styles</p>
      <div class="space-y-2">
        <DzAlert color="info" variant="solid" title="Solid" description="Default alert style." />
        <DzAlert color="info" variant="soft" title="Soft" description="Lower-contrast tinted background." />
        <DzAlert color="info" variant="outline" title="Outline" description="Transparent with a coloured border." />
        <DzAlert color="info" variant="dash" title="Dash" description="Dashed border variant." />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">With actions</p>
      <DzAlert v-model="controlled" color="warning" title="Unsaved changes" description="You have unsaved changes in this form.">
        <template #actions>
          <div class="flex gap-2">
            <DzButton size="xs" color="warning" @click="controlled = false">Discard</DzButton>
            <DzButton size="xs" variant="ghost" @click="controlled = false">Cancel</DzButton>
          </div>
        </template>
      </DzAlert>
      <DzButton v-if="!controlled" class="mt-2" size="sm" variant="outline" @click="controlled = true">Reset action alert</DzButton>
    </div>
  </div>
</template>
