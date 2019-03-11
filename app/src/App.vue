<template>
  <div id="app">
    Kedja
    <router-view/>
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
