import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import WallList from '@/components/WallList'
import RecursiveAPI from '@/components/RecursiveAPI'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/walls',
      name: 'WallList',
      component: WallList
    },
    {
      path: '/recursive',
      name: 'RecursiveAPI',
      component: RecursiveAPI
    }
  ]
})
