<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const step = ref(1)

const items = [
  { label: 'Account', description: 'Your details' },
  { label: 'Company', description: 'Organisation' },
  { label: 'Plan', description: 'Subscription' },
  { label: 'Review', description: 'Confirm' },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-4">
    <DzSteps v-model="step" :items="items" clickable />
    <div class="flex items-center justify-between">
      <DzButton size="sm" variant="outline" :disabled="step === 0" @click="step -= 1">
        <template #icon><ChevronLeft class="size-4" aria-hidden="true" /></template>
        Previous
      </DzButton>
      <span class="text-xs opacity-60">Step {{ step + 1 }} of {{ items.length }}</span>
      <DzButton size="sm" color="primary" :disabled="step === items.length - 1" @click="step += 1">
        Next
        <ChevronRight class="size-4" aria-hidden="true" />
      </DzButton>
    </div>
  </div>

  <div v-else class="space-y-8">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Vertical</p>
      <DzSteps :model-value="2" :items="items" vertical class="w-64" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <DzSteps
        v-for="color in ['primary', 'secondary', 'accent', 'success', 'warning', 'error']"
        :key="color"
        :model-value="2"
        :items="items"
        :color="color"
        class="mb-2"
      />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom step slot</p>
      <DzSteps :model-value="1" :items="items">
        <template #step="{ item, index, current, complete }">
          <span class="flex flex-col items-center gap-0.5">
            <span class="text-xs opacity-50">{{ complete ? '✓' : index + 1 }}</span>
            <span class="text-sm" :class="{ 'font-bold text-primary': current }">{{ item.label }}</span>
          </span>
        </template>
      </DzSteps>
    </div>
  </div>
</template>
