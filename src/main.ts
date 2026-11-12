import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerUiComponents } from './plugins/components'
import { registerFormKit } from './plugins/formkit.config'
import './assets/main.css'

const app = createApp(App)

registerUiComponents(app)
registerFormKit(app)
app.use(router)
app.mount('#app')
