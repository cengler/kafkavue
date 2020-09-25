import { createRouter, createWebHashHistory } from 'vue-router'
import HelloWorld from './components/HelloWorld'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
