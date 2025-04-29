import { createApp } from 'vue';
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
// import VueRouter from 'vue-router'
import router from './router'
import vuetify from './plugins/vuetify'
import "bootstrap/dist/css/bootstrap.min.css"

const pinia = createPinia();

createApp(App)      
    .use(vuetify)
    .use(pinia)
    // .use(VueRouter)
    .use(router)
    .mount('#app')
