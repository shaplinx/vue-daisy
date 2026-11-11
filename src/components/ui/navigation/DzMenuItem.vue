<script setup lang="ts">
import { computed } from 'vue'
import type { Component, PropType } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { RouteLocationPathRaw, RouteLocationRaw } from 'vue-router'

export interface MenuItemData {
  id?: string | number
  label: string
  to?: RouteLocationRaw
  href?: string
  icon?: Component
  badge?: string | number
  disabled?: boolean
  divider?: boolean
  header?: string
  active?: boolean
  children?: MenuItemData[]
}

const props = defineProps({
  item: { type: Object as PropType<MenuItemData>, required: true },
  activeId: { type: [String, Number] as PropType<string | number | null>, default: null },
  level: { type: Number, default: 0 },
  /**
   * Icon-only mode for collapsible drawer sidebars. When the drawer is closed
   * (daisyUI `is-drawer-close` state) labels, badges and sub lists collapse
   * and each item shows its label as a tooltip next to its icon.
   */
  iconOnly: { type: Boolean, default: false },
})

const emit = defineEmits<{
  select: [payload: { item: MenuItemData; event: MouseEvent }]
}>()
const route = useRoute()

const hasChildren = computed(
  () => Array.isArray(props.item.children) && (props.item.children?.length ?? 0) > 0,
)

const childActive = computed(
  () => hasChildren.value && !!props.item.children?.some((child) => isActive(child)),
)

const active = computed(() => isActive(props.item))

/** Classes that only take effect while the parent drawer is closed. */
const iconOnlyClasses = computed(() =>
  props.iconOnly ? 'is-drawer-close:tooltip is-drawer-close:tooltip-right' : undefined,
)

const hideWhenCollapsedClasses = computed(() => (props.iconOnly ? 'is-drawer-close:hidden' : undefined))

const tooltip = computed(() => (props.iconOnly ? props.item.label : undefined))

/**
 * In icon-only mode a parent with children becomes a direct link to its first
 * destination: the collapsed rail has no room to expand the sub list.
 */
const parentDestination = computed(() => {
  if (props.item.to) return props.item.to
  if (hasChildren.value) return props.item.children?.find((child) => child.to)?.to
  return undefined
})

function isActive(item: MenuItemData | undefined): boolean {
  if (!item) return false
  if (item.active) return true
  if (props.activeId != null && item.id === props.activeId) return true
  if (item.to && route?.path) {
    const raw = item.to
    const path = typeof raw === 'string' ? raw : (raw as RouteLocationPathRaw).path
    const query =
      typeof raw === 'string' ? {} : ((raw as RouteLocationPathRaw).query ?? {})
    if (path && route.path === path) {
      const keys = Object.keys(query)
      if (!keys.length) return !route.query.component && !route.query.category
      return keys.every((key) => String(route.query[key] ?? '') === String(query[key]))
    }
  }
  return Array.isArray(item.children) && item.children.some((child) => isActive(child))
}

function onSelect(event: MouseEvent): void {
  emit('select', { item: props.item, event })
}

/** Forward a nested child selection so the deepest item is reported. */
function onChildSelect(payload: { item: MenuItemData; event: MouseEvent }): void {
  emit('select', payload)
}
</script>

<template>
  <li v-if="item.divider" class="my-1 h-px bg-base-300" aria-hidden="true" />

  <li v-else-if="item.header" class="menu-title">
    <slot name="header" :item="item">{{ item.header }}</slot>
  </li>

  <!-- Icon-only rail: a parent with children navigates to its first destination. -->
  <li v-else-if="iconOnly && hasChildren && parentDestination">
    <RouterLink
      :to="parentDestination"
      :class="[{ 'menu-active': active }, iconOnlyClasses]"
      :data-tip="tooltip"
      :aria-current="active ? 'page' : undefined"
      @click="onSelect"
    >
      <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" aria-hidden="true" />
      <span class="menu-label-text flex-1" :class="hideWhenCollapsedClasses">{{ item.label }}</span>
      <span v-if="item.badge" class="badge badge-sm badge-primary" :class="hideWhenCollapsedClasses">
        {{ item.badge }}
      </span>
    </RouterLink>
  </li>

  <li v-else-if="hasChildren">
    <details :open="childActive">
      <summary :class="[{ 'menu-active': active }, iconOnlyClasses]" :data-tip="tooltip">
        <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" aria-hidden="true" />
        <span class="menu-label-text flex-1" :class="hideWhenCollapsedClasses">{{ item.label }}</span>
        <span v-if="item.badge" class="badge badge-sm badge-primary" :class="hideWhenCollapsedClasses">
          {{ item.badge }}
        </span>
      </summary>
      <ul class="my-0.5" :class="hideWhenCollapsedClasses">
        <DzMenuItem
          v-for="(child, index) in item.children"
          :key="child.id ?? index"
          :item="child"
          :active-id="activeId"
          :level="level + 1"
          :icon-only="iconOnly"
          @select="onChildSelect"
        />
      </ul>
    </details>
  </li>

  <li v-else>
    <RouterLink
      v-if="item.to && !item.disabled"
      :to="item.to"
      :class="[{ 'menu-active': active }, iconOnlyClasses]"
      :data-tip="tooltip"
      :aria-current="active ? 'page' : undefined"
      @click="onSelect"
    >
      <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" aria-hidden="true" />
      <span class="menu-label-text flex-1" :class="hideWhenCollapsedClasses">{{ item.label }}</span>
      <span v-if="item.badge" class="badge badge-sm badge-primary" :class="hideWhenCollapsedClasses">
        {{ item.badge }}
      </span>
    </RouterLink>

    <a
      v-else-if="item.href && !item.disabled"
      :href="item.href"
      :class="[{ 'menu-active': active }, iconOnlyClasses]"
      :data-tip="tooltip"
      @click="onSelect"
    >
      <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" aria-hidden="true" />
      <span class="menu-label-text flex-1" :class="hideWhenCollapsedClasses">{{ item.label }}</span>
    </a>

    <button
      v-else
      type="button"
      :class="[{ 'menu-active': active }, iconOnlyClasses]"
      :data-tip="tooltip"
      :disabled="item.disabled"
      @click="!item.disabled && onSelect($event)"
    >
      <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" aria-hidden="true" />
      <span class="menu-label-text flex-1" :class="hideWhenCollapsedClasses">{{ item.label }}</span>
      <span v-if="item.badge" class="badge badge-sm badge-primary" :class="hideWhenCollapsedClasses">
        {{ item.badge }}
      </span>
    </button>
  </li>
</template>
