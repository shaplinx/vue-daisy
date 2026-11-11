<script setup lang="ts">
import { ref } from 'vue'
import { CreditCard, Package, ShieldCheck, Truck } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()

const items = [
  { id: 'shipping', title: 'Shipping & delivery', icon: Truck, content: 'Orders ship within 24 hours. Tracking details arrive by email as soon as the parcel leaves our warehouse.' },
  { id: 'returns', title: 'Returns & refunds', icon: Package, content: 'Return any unused item within 30 days for a full refund. Original packaging is required.' },
  { id: 'payment', title: 'Payment methods', icon: CreditCard, content: 'We accept all major cards, Apple Pay, Google Pay and bank transfers.' },
  { id: 'warranty', title: 'Warranty', icon: ShieldCheck, content: 'Every product includes a two-year limited warranty against manufacturing defects.' },
]

const open = ref('shipping')
const multipleOpen = ref(['shipping', 'payment'])
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <DzAccordion v-model="open" :items="items" bordered icon="arrow" />
    <p class="text-xs text-base-content/60">
      Single-open mode. Currently open: <span class="badge badge-ghost badge-sm">{{ open || 'none' }}</span>
    </p>
  </div>

  <div v-else class="grid gap-4 lg:grid-cols-2">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Multiple open</p>
      <DzAccordion v-model="multipleOpen" :items="items.slice(0, 3)" multiple bordered icon="plus" />
    </div>
    <div class="space-y-4">
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Chevron icon</p>
        <DzAccordion :items="items.slice(0, 2)" icon="chevron" :model-value="'shipping'" />
      </div>
      <div>
        <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom title &amp; content slots</p>
        <DzAccordion :items="items.slice(0, 1)" :model-value="'shipping'">
          <template #title="{ item, open: isOpen }">
            <span class="inline-flex items-center gap-2">
              <component :is="item.icon" class="size-4" aria-hidden="true" />
              <span :class="{ 'text-primary': isOpen }">{{ item.title }}</span>
            </span>
          </template>
          <template #content="{ item }">
            <div class="rounded-box bg-base-200 p-3 text-xs">{{ item.content }}</div>
          </template>
        </DzAccordion>
      </div>
    </div>
  </div>
</template>
