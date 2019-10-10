<template>
  <div id="app">
    <!--kedja-header id="header"></kedja-header-->
    <router-view id="router" />
    <kedja-footer id="footer" />
    <modal />
    <dialogz />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

import KedjaHeader from '@/components/layout/KedjaHeader'
import KedjaFooter from '@/components/layout/KedjaFooter'
import Modal from '@/components/general/Modal'
import Dialog from '@/components/general/Dialog'

export default {
  name: 'App',
  components: {
    KedjaHeader,
    KedjaFooter,
    Modal,
    Dialogz: Dialog // Name 'Dialog' seems to be reserved... (?)
  },
  created () {
    this.loadUserFromLocalStorage()
    this.authenticate()
    this.resetUserState()
  },
  mounted () {
    document.activeElement.blur()
  },
  methods: {
    ...mapActions(['authenticate']),
    ...mapMutations(['resetUserState']),
    ...mapMutations('users', ['loadUserFromLocalStorage'])
  }
}
</script>

<style>
@import './assets/style/layout.css';
@import './assets/style/text.css';
@import './assets/style/general.css';
@import './assets/style/form.css';
@import './assets/style/transitions.css';
</style>
