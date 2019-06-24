import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import ViewLogin from '@/components/views/ViewLogin'
import ViewLoggingIn from '@/components/views/ViewLoggingIn'
import ViewRegister from '@/components/views/ViewRegister'
import ViewWallList from '@/components/views/ViewWallList'
import ViewWall from '@/components/views/ViewWall'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      /*name: 'Landing',
      component: Landing*/
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: ViewLogin
    },
    {
      path: '/logging_in',
      name: 'LoggingIn',
      component: ViewLoggingIn
    },
    {
      path: '/register',
      name: 'Register',
      component: ViewRegister
    },
    {
      path: '/loggedIn',
      name: 'LoggedIn',
      redirect: '/walls'
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
    }
  ]
})
