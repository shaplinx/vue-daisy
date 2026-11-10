<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home } from '@lucide/vue'
import DzBreadcrumbs from '@/components/ui/navigation/DzBreadcrumbs.vue'
import { componentCategories, components } from '@/data/componentRegistry'

const route = useRoute()

const items = computed(() => {
  const list = [{ label: 'Home', to: '/dashboard', icon: Home }]
  if (route.name === 'components') {
    list.push({ label: 'Component Library', to: '/components' })
    if (route.query.category) {
      const category = componentCategories.find((item) => item.id === route.query.category)
      if (category) list.push({ label: category.label })
    }
    if (route.query.component) {
      const component = components.find((item) => item.id === route.query.component)
      if (component) list.push({ label: component.name })
    }
  } else if (route.meta?.breadcrumb) {
    list.push({ label: route.meta.breadcrumb })
  }
  return list
})
</script>

<template>
  <DzBreadcrumbs :items="items" aria-label="Breadcrumb" />
</template>
