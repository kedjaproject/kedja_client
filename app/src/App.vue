<template>
  <div id="app">
    <kedja-header id="header"></kedja-header>
    <router-view id="router"/>
    <kedja-footer id="footer"></kedja-footer>
  </div>
</template>

<script>

import { store } from '@/store';
import KedjaHeader from '@/components/layout/KedjaHeader';
import KedjaFooter from '@/components/layout/KedjaFooter';

export default {
  name: 'App',
  components: {
    KedjaHeader,
    KedjaFooter
  },
  created: function () {
    store.commit('init',{});
  },
  mounted: function () {
    document.activeElement.blur()
  }
}
</script>

<style>
@import './assets/style/layout.css';
@import './assets/style/text.css';
@import './assets/style/form.css';
@import './assets/style/transitions.css';
</style>
