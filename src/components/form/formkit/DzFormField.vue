<script setup lang="ts">
import { computed } from 'vue'
import type { FormKitInputContext } from './types'
import { visibleMessages } from './types'

const props = withDefaults(
  defineProps<{
    context: FormKitInputContext
    /** Override the label supplied to `<FormKit>`. */
    label?: string
    /** Hide the visible label (used by inline checkbox/toggle controls). */
    hideLabel?: boolean
    /** Radio groups use a fieldset/legend for accessible grouping. */
    as?: 'div' | 'fieldset'
  }>(),
  {
    label: undefined,
    hideLabel: false,
    as: 'div',
  },
)

const computedLabel = computed(() => props.label ?? props.context.label)
const messages = computed(() => visibleMessages(props.context))
const helpId = computed(() => `help-${props.context.id}`)
</script>

<template>
  <component
    :is="as"
    :class="
      as === 'fieldset'
        ? 'flex min-w-0 flex-col gap-2 border-0 p-0'
        : 'flex min-w-0 flex-col gap-1.5'
    "
  >
    <legend
      v-if="as === 'fieldset' && !hideLabel && computedLabel"
      class="label justify-start gap-1 p-0 text-sm font-medium"
    >
      {{ computedLabel }}
      <span v-if="context.state.required" class="text-error" aria-hidden="true">*</span>
    </legend>

    <label
      v-else-if="!hideLabel && computedLabel"
      :for="context.id"
      class="label justify-start gap-1 p-0 text-sm font-medium"
    >
      {{ computedLabel }}
      <span v-if="context.state.required" class="text-error" aria-hidden="true">*</span>
    </label>

    <slot />

    <p v-if="context.help" :id="helpId" class="text-xs text-base-content/60">
      {{ context.help }}
    </p>

    <ul v-if="messages.length" class="flex flex-col gap-1 text-xs" aria-live="polite">
      <li
        v-for="message in messages"
        :key="message.key"
        :id="`${context.id}-${message.key}`"
        class="text-error"
      >
        {{ message.value }}
      </li>
    </ul>

    <slot name="footer" />
  </component>
</template>
