import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { registerUiComponents } from './plugins/components'
import { registerFormKit } from './plugins/formkit.config'
import { installAuth } from './auth/auth.provider'
import './assets/main.css'

const app = createApp(App)

// Pinia must exist before the router: the auth guard resolves the store on
// the first navigation.
app.use(createPinia())

registerUiComponents(app)
registerFormKit(app)

try {
  // Resolves authentication configuration once, creates the active driver
  // and wires it into the shared HTTP client.
  installAuth()
} catch (error) {
  renderFatalError(error)
  throw error
}

app.use(router)
app.mount('#app')

/** Render a clear startup error instead of a blank page on bad config. */
function renderFatalError(error: unknown): void {
  const container = document.getElementById('app')
  if (!container) return
  const message = error instanceof Error ? error.message : String(error)
  container.innerHTML = ''
  const panel = document.createElement('div')
  panel.setAttribute('role', 'alert')
  panel.style.cssText =
    'max-width:40rem;margin:15vh auto;padding:1.5rem;font-family:system-ui,sans-serif;' +
    'border:1px solid #dc2626;border-radius:.75rem;background:#fff;color:#111'
  const heading = document.createElement('h1')
  heading.textContent = 'Authentication configuration error'
  heading.style.cssText = 'margin:0 0 .5rem;font-size:1.125rem;color:#dc2626'
  const body = document.createElement('p')
  body.textContent = message
  body.style.cssText = 'margin:0;font-size:.875rem;line-height:1.5'
  panel.append(heading, body)
  container.appendChild(panel)
}
