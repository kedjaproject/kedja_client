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
import { mapActions } from 'vuex'

import KedjaHeader from '@/components/layout/KedjaHeader'
import KedjaFooter from '@/components/layout/KedjaFooter'
import Modal from '@/components/general/Modal'
import Dialog from '@/components/general/Dialog'
import { INIT, RESET_USER_STATE } from '@/store/mutation-types'

export default {
  name: 'App',
  components: {
    KedjaHeader,
    KedjaFooter,
    Modal,
    Dialogz: Dialog // Name 'Dialog' seems to be reserved... (?)
  },
  created () {
    this.$store.commit(INIT, {env: process.env})
    this.$store.commit(RESET_USER_STATE)
    this.authenticate()
  },
  mounted () {
    document.activeElement.blur()
  },
  methods: {
    ...mapActions(['authenticate'])
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
