import { createApp } from 'vue'
import './assets/style/style.scss'
import Main from './Main.vue'
import { vfmPlugin } from 'vue-final-modal'

createApp(Main)
    .use(vfmPlugin({
      key: '$vfm',
      componentName: 'VueFinalModal',
      dynamicContainerName: 'ModalsContainer'
    }))
    .mount('#app')