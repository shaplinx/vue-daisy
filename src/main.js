import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerUiComponents } from './plugins/components'
import './assets/main.css'

const app = createApp(App)

registerUiComponents(app)
app.use(router)
app.mount('#app')
