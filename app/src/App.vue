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
  }
}
</script>

<style>
@import './assets/style/layout.css';
@import './assets/style/text.css';
</style>
