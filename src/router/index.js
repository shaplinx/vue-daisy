import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/components',
  },
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: { title: 'Dashboard', icon: 'LayoutDashboard', breadcrumb: 'Dashboard' },
      },
      {
        path: 'components',
        name: 'components',
        component: () => import('@/pages/ComponentShowcasePage.vue'),
        meta: {
          title: 'Component Library',
          icon: 'Component',
          breadcrumb: 'Component Library',
        },
      },
      {
        path: 'data',
        name: 'data',
        component: () => import('@/pages/DataManagementPage.vue'),
        meta: { title: 'Data Management', icon: 'Database', breadcrumb: 'Data Management' },
      },
      {
        path: 'forms',
        name: 'forms',
        component: () => import('@/pages/FormShowcasePage.vue'),
        meta: { title: 'Form Examples', icon: 'ClipboardList', breadcrumb: 'Form Examples' },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/pages/SettingsPage.vue'),
        meta: { title: 'Settings', icon: 'Settings', breadcrumb: 'Settings' },
      },
      {
        path: 'themes',
        name: 'themes',
        component: () => import('@/pages/ThemeSettingsPage.vue'),
        meta: { title: 'Theme Settings', icon: 'Palette', breadcrumb: 'Theme Settings' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: 'Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta?.title
  document.title = title ? `${title} · Vue Daisy` : 'Vue Daisy · Component Library'
})

export default router
