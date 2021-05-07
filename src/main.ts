import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@mdi/font/css/materialdesignicons.css'
// @ts-ignore
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'

Vue.config.productionTip = false
Vue.use(JsonViewer)

new Vue({
  router,
  store: store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
