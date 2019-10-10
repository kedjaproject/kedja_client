// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from '@/store'
// import TransitionEndPlugin from 'transitionend-plugin-vue'
// import VueDraggable from 'vue-draggable'
// import 'vue-draggable/polyfills'

// Vue.use(VueDraggable)
// Activate if using transitions for cards.
// Vue.use(TransitionEndPlugin)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
