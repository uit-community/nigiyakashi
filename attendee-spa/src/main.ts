import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import routes from 'vue-auto-routing'
import store from './store/'
import { createRouterLayout } from 'vue-router-layout'

Vue.use(Router)

const RouterLayout = createRouterLayout(layout => {
  return import('@/layouts/' + layout + '.vue')
})

const router = new Router({
  routes: [
    {
      path: '/',
      component: RouterLayout,
      children: routes
    }
  ]
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
