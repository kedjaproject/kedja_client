<template>
  <div class="WallList">

    <button @click="createWall">
      Skapa ny vägg
    </button>

    <div v-for="wall in walls">
      <router-link :to="{ name: 'Wall', params: {wallId: wall.rid} }">
        <strong>{{wall.data.title}}</strong> [{{wall.rid}}]
      </router-link>
    </div>

  </div>
</template>

<script>

import { store } from '@/store';

//import Component from '@/components/Component'

export default {
  name: 'WallList',
  /*components: {
    Component
  },*/
  data () {
    return {
      //walls: ""
    }
  },
  props: {
  },
  computed: {
    walls: function () {
      return store.getters.getWalls();
    }
  },
  methods: {
    getWalls: function () {

      let params = {
        endpoint: "list/Wall/1",
        //endpoint: "create/Wall/1",
        successCallback: (data) => {
          this.successCallbackGetWalls(data);
        },
      }
      store.commit('makeAPICall', params);

    },
    successCallbackGetWalls: function (data) {
      console.log(data)
      this.walls = data;
    },
    createWall: function () {
      console.log(this)
      store.commit('createWall',{});
    },
    successCallbackCreateWall: (data) => {
      console.log(data)
      console.log(this)
      //this.walls.data.push(data.data)
    },
  },
  mounted: function () {
    //this.getWalls();
  }
}
</script>

<style scoped>

.WallList{
}

</style>
