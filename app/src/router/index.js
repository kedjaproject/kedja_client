import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import ViewWallList from '@/components/views/ViewWallList'
import ViewWall from '@/components/views/ViewWall'
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
      name: 'ViewWallList',
      component: ViewWallList
    },
    {
      path: '/walls/:wallId',
      name: 'ViewWall',
      component: ViewWall
    },
    {
      path: '/recursive',
      name: 'RecursiveAPI',
      component: RecursiveAPI
    }
  ]
})
