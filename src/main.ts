import { createApp } from 'vue'
import './assets/style/style.scss'
import Main from './Main.vue'
import { createVfm } from 'vue-final-modal'

createApp(Main)
    .use(createVfm())
    .mount('#app')