import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import ViewHome from '@/components/views/ViewHome'
import ViewLogin from '@/components/views/ViewLogin'
import ViewLoggingIn from '@/components/views/ViewLoggingIn'
import ViewRegister from '@/components/views/ViewRegister'
import ViewProfile from '@/components/views/ViewProfile'
import ViewWallList from '@/components/views/ViewWallList'
import ViewWall from '@/components/views/ViewWall'
import ScrollTest from '@/components/ScrollTest'

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
      path: '/home',
      name: 'Home',
      component: ViewHome
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ViewProfile
    },
    {
      path: '/walls',
      name: 'Walls',
      component: ViewWallList
    },
    {
      path: '/walls/:wallId',
      name: 'ViewWall',
      component: ViewWall
    },
    {
      path: '/scrollTest',
      name: 'ScrollTest',
      component: ScrollTest
    }

  ]
})
