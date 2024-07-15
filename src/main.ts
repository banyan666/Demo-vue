import { createApp } from 'vue'
import './css/theme.css'
import './css/style.css'
import App from './App.vue'
import {createPinia} from "pinia";
import router from "./router";
import i18n from "./locale/index";


const pinia = createPinia()
const app=createApp(App)

app.use(pinia)
app.use(i18n)

app.use(router)
app.mount('#app')
console.log(import.meta.env.VITE_BASE_API,'-----')