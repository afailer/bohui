import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: 'redline',
      children: [
        {
          path: 'content',
          name: 'content',
          component: () =>
            import('@/components/contents.vue')
        },
        {
          path: 'redline',
          name: 'redline',
          component: () =>
            import('@/views/bohui/redline/index.vue')
        },
        {
          path: 'active',
          name: 'active',
          component: () =>
            import('@/views/bohui/active/index.vue')
        }
      ]
    }
  ]
})
