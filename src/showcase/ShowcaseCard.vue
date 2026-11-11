<script setup lang="ts">
import { computed, ref } from 'vue'
import { Code2, Eye, ListTree, Palette } from '@lucide/vue'
import DemoSection from './DemoSection.vue'
import PropTable from './PropTable.vue'
import CodeBlock from './CodeBlock.vue'
import { getDemo } from './demoMap'
import { componentCategories } from '@/data/componentRegistry'

const props = defineProps({
  component: { type: Object, required: true },
})

const category = computed(() =>
  componentCategories.find((item) => item.id === props.component.category),
)

const demo = computed(() => getDemo(props.component.demo))
const activeTab = ref('preview')

const tagName = computed(() => {
  const base = props.component.demo.replace(/Demo$/, '')
  return `Dz${base === 'Chat' ? 'ChatBubble' : base}`
})

const tabs = [
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'variants', label: 'Variants', icon: Palette },
  { id: 'api', label: 'Props & Events', icon: ListTree },
  { id: 'source', label: 'Source Example', icon: Code2 },
]
</script>

<template>
  <article
    :id="`component-${component.id}`"
    class="showcase-anchor scroll-mt-24 rounded-box border border-base-300 bg-base-100 shadow-sm"
  >
    <header class="flex flex-col gap-3 border-b border-base-300 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
      <div class="min-w-0">
        <div class="mb-1.5 flex flex-wrap items-center gap-2">
          <h2 class="text-lg font-bold tracking-tight">{{ component.name }}</h2>
          <span class="badge badge-primary badge-sm badge-soft">{{ category?.label }}</span>
          <code class="rounded bg-base-200 px-1.5 py-0.5 text-[10px] opacity-60">&lt;{{ tagName }} /&gt;</code>
        </div>
        <p class="max-w-3xl text-sm text-base-content/70">{{ component.description }}</p>
      </div>
    </header>

    <div class="p-4 sm:p-5">
      <DzTabs v-model="activeTab" :tabs="tabs" variant="box" size="sm" :aria-label="`${component.name} documentation`">
        <template #panel-preview>
          <DemoSection v-if="demo" mode="preview">
            <component :is="demo" />
          </DemoSection>
          <div v-else role="alert" class="alert alert-warning alert-soft">
            <span>Demo component “{{ component.demo }}” could not be resolved.</span>
          </div>
          <p class="mt-3 text-xs opacity-50">
            Everything above is live — click, type, open and toggle to test the real behaviour.
          </p>
        </template>

        <template #panel-variants>
          <DemoSection v-if="demo" mode="variants">
            <component :is="demo" />
          </DemoSection>
          <div v-else role="alert" class="alert alert-warning alert-soft">
            <span>Demo component “{{ component.demo }}” could not be resolved.</span>
          </div>
        </template>

        <template #panel-api>
          <PropTable
            :props="component.props"
            :events="component.events"
            :slots="component.slots"
          />
        </template>

        <template #panel-source>
          <CodeBlock :code="component.source" filename="Example.vue" />
          <p class="mt-3 text-xs opacity-50">
            Components are globally registered, so no local import is required. All components also
            support explicit imports from <code class="rounded bg-base-200 px-1">src/components/ui</code>.
          </p>
        </template>
      </DzTabs>
    </div>
  </article>
</template>
