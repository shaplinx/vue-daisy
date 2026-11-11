<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import type { Component, PropType } from 'vue'
import type { ClassValue } from '@/utils/cn'
import { cn } from '@/utils/cn'
import { modifier, SIZES } from '@/utils/daisy'

export interface TabItem {
  id?: string | number
  label?: string
  icon?: Component
  badge?: string | number
  disabled?: boolean
  [key: string]: unknown
}

export type TabId = string | number

const props = defineProps({
  tabs: { type: Array as PropType<TabItem[]>, default: () => [] },
  modelValue: { type: [String, Number] as PropType<TabId>, default: undefined },
  variant: { type: String, default: 'box' },
  size: { type: String, default: 'md' },
  position: { type: String, default: 'top' },
  grow: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Tabs' },
  panelClass: { type: [String, Array, Object] as PropType<ClassValue>, default: '' },
})

const emit = defineEmits<{
  'update:modelValue': [id: TabId]
  change: [tab: TabItem]
}>()

const uid = useId()
const internal = ref<TabId>(props.tabs[0]?.id ?? 0)

const normalizedTabs = computed<(TabItem & { id: TabId })[]>(() =>
  props.tabs.map((tab, index) => ({ id: tab.id ?? index, ...tab })),
)

const isControlled = computed(() => props.modelValue !== undefined)

const activeId = computed<TabId | undefined>(() => {
  const candidate = isControlled.value ? props.modelValue : internal.value
  return normalizedTabs.value.some((tab) => tab.id === candidate)
    ? candidate
    : normalizedTabs.value.find((tab) => !tab.disabled)?.id
})

const activeTab = computed(() =>
  normalizedTabs.value.find((tab) => tab.id === activeId.value) || null,
)

const listClass = computed(() =>
  cn(
    'tabs',
    modifier('tabs', props.variant, ['box', 'border', 'lift']),
    modifier('tabs', props.size, SIZES),
    {
      'tabs-bottom': props.position === 'bottom',
    },
  ),
)

function select(tab: TabItem & { id: TabId }): void {
  if (tab.disabled) return
  if (!isControlled.value) internal.value = tab.id
  emit('update:modelValue', tab.id)
  emit('change', tab)
}

function tabId(tab: TabItem & { id: TabId }): string {
  return `${uid}-tab-${tab.id}`
}

function panelId(tab: TabItem & { id: TabId }): string {
  return `${uid}-panel-${tab.id}`
}

function onKeydown(event: KeyboardEvent, index: number): void {
  const enabled = normalizedTabs.value.filter((tab) => !tab.disabled)
  if (!enabled.length) return
  const currentIndex = enabled.findIndex((tab) => tab.id === activeId.value)
  let nextIndex: number

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = (currentIndex + 1) % enabled.length
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = (currentIndex - 1 + enabled.length) % enabled.length
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = enabled.length - 1
      break
    default:
      return
  }

  event.preventDefault()
  const nextTab = enabled[nextIndex]
  if (!nextTab) return
  select(nextTab)
  nextTick(() => {
    const el = document.getElementById(tabId(nextTab))
    el?.focus()
  })
}

watch(
  () => props.tabs,
  (tabs) => {
    if (!isControlled.value && !tabs.some((tab) => tab.id === internal.value)) {
      internal.value = tabs[0]?.id ?? 0
    }
  },
)
</script>

<template>
  <div>
    <div
      role="tablist"
      :class="listClass"
      :aria-label="ariaLabel"
    >
      <button
        v-for="(tab, index) in normalizedTabs"
        :id="tabId(tab)"
        :key="tab.id"
        type="button"
        role="tab"
        class="tab gap-2"
        :class="{
          'tab-active': tab.id === activeId,
          'tab-disabled': tab.disabled,
          'flex-1': grow,
        }"
        :aria-selected="tab.id === activeId"
        :aria-controls="panelId(tab)"
        :tabindex="tab.id === activeId ? 0 : -1"
        :disabled="tab.disabled"
        @click="select(tab)"
        @keydown="onKeydown($event, index)"
      >
        <component :is="tab.icon" v-if="tab.icon" class="size-4" aria-hidden="true" />
        {{ tab.label }}
        <span v-if="tab.badge" class="badge badge-sm">{{ tab.badge }}</span>
      </button>
    </div>

    <div
      v-if="activeTab"
      :id="panelId(activeTab)"
      role="tabpanel"
      :aria-labelledby="tabId(activeTab)"
      :class="cn('dz-tab-panel mt-4', panelClass)"
    >
      <slot
        :name="`panel-${activeTab.id}`"
        :tab="activeTab"
        :index="normalizedTabs.indexOf(activeTab)"
      >
        <slot name="panel" :tab="activeTab" :index="normalizedTabs.indexOf(activeTab)">
          <slot :tab="activeTab" :index="normalizedTabs.indexOf(activeTab)" />
        </slot>
      </slot>
    </div>
  </div>
</template>
