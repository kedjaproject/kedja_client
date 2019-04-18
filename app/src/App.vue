<template>
  <div id="app">
    <div id="header">
      Kedja header
    </div>
    <router-view id="router"/>
    <div id="footer">
      Kedja footer
    </div>
  </div>
</template>

<script>

import { store } from '@/store';

export default {
  name: 'App',
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
