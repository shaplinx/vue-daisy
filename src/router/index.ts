import { createRouter, createWebHistory } from 'vue-router'
import { registerAuthGuard } from './guards/auth.guard'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
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
        path: 'media',
        name: 'media',
        component: () => import('@/pages/MediaLibraryPage.vue'),
        meta: { title: 'Media Library', icon: 'Images', breadcrumb: 'Media Library' },
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
      {
        path: 'backend-integration',
        name: 'backend-integration',
        component: () => import('@/pages/AuthDocsPage.vue'),
        meta: {
          title: 'Backend Integration',
          icon: 'ShieldCheck',
          breadcrumb: 'Backend Integration',
        },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { guestOnly: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: { title: 'Sign in', breadcrumb: 'Sign in' },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
        meta: { title: 'Forgot password', breadcrumb: 'Forgot password' },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/pages/auth/ResetPasswordPage.vue'),
        meta: { title: 'Reset password', breadcrumb: 'Reset password' },
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

registerAuthGuard(router)

router.afterEach((to) => {
  const title = to.meta?.title
  document.title = title ? `${title} · Vue Daisy` : 'Vue Daisy · Component Library'
})

export default router
