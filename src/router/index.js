// import Vue from 'vue'
// import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

// Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import Login from '../view/Login.vue'
import Dashboard from '../view/Dashboard.vue'
import Profile from '../view/Profile.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: {name: 'dashboard'}
    }, {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {requiresAuth: true}
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/profile',
      name: 'profile',
      component: Profile,
      // eslint-disable-next-line camelcase
      props: route => ({access_token: route.query.access_token}),
      meta: {requiresAuth: true}
    }
  ]
})

// Sync routes with auth module
store.dispatch('auth/syncRouter', router)

export default router
