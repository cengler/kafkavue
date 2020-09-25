import { createApp, h } from 'vue';
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'

createApp(App)
  .use(vuetify)
  .use(router)
  .use(store)
  .mount('#app')
