import './assets/main.css'
import { amountMaskingDirective, dateMaskingDirective } from './utils/directives'
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index.js'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(ElementPlus)
app.use(router)
// app.use(vmoney)
app.directive('amount', amountMaskingDirective)
app.directive('date', dateMaskingDirective)
// app.directive('amount', Money3Directive)
app.mount('#app')
