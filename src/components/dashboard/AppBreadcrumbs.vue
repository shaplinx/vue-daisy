<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home } from '@lucide/vue'
import DzBreadcrumbs from '@/components/ui/navigation/DzBreadcrumbs.vue'
import type { BreadcrumbItem } from '@/components/ui/navigation/DzBreadcrumbs.vue'
import { componentCategories, components } from '@/data/componentRegistry'

const route = useRoute()

const items = computed<BreadcrumbItem[]>(() => {
  const list: BreadcrumbItem[] = [{ label: 'Home', to: '/dashboard', icon: Home }]
  if (route.name === 'components') {
    list.push({ label: 'Component Library', to: '/components' })
    const categoryId = Array.isArray(route.query.category) ? route.query.category[0] : route.query.category
    if (categoryId) {
      const category = componentCategories.find((item) => item.id === categoryId)
      if (category) list.push({ label: category.label })
    }
    const componentId = Array.isArray(route.query.component) ? route.query.component[0] : route.query.component
    if (componentId) {
      const component = components.find((item) => item.id === componentId)
      if (component) list.push({ label: component.name })
    }
  } else if (route.meta?.breadcrumb) {
    list.push({ label: route.meta.breadcrumb as string })
  }
  return list
})
</script>

<template>
  <DzBreadcrumbs :items="items" aria-label="Breadcrumb" />
</template>
