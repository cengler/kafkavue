import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "about" */ '../views/Search.vue')
  },
  {
    path: '/edit',
    name: 'Edit',
    props: true,
    component: () => import(/* webpackChunkName: "about" */ '../views/Edit.vue')
  },
  {
    path: '/brokers',
    name: 'Brokers',
    component: () => import(/* webpackChunkName: "about" */ '../views/Brokers.vue')
  },
  {
    path: '/topics',
    name: 'Topics',
    component: () => import(/* webpackChunkName: "about" */ '../views/Topics.vue')
  },
  {
    path: '/consumers',
    name: 'Consumers',
    component: () => import(/* webpackChunkName: "about" */ '../views/Consumers.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
