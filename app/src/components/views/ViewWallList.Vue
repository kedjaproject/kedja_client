<template>
  <div class="ViewWallList">

    <kedja-header>

      <button @click="createWall">
        + Ny vägg
      </button>

    </kedja-header>

    <h3>Mina väggar</h3>

    <div class="wallBoxes">
      <router-link-box :to="{ name: 'ViewWall', params: {wallId: wall.rid} }" color="lightsteelblue" v-for="wall in walls" class="wallBox">
        <h3>
          {{wall.data.title}}
        </h3>
      </router-link-box>
    </div>

    <h3>Gemensamma väggar</h3>

    <div class="wallBoxes">
      <router-link-box :to="{ name: 'ViewWall', params: {wallId: wall.rid} }" color="lightsteelblue" v-for="wall in walls" class="wallBox">
        <h3>
          {{wall.data.title}}
        </h3>
      </router-link-box>
    </div>

  </div>
</template>

<script>

import { store } from '@/store';
import KedjaHeader from '@/components/layout/KedjaHeader'
import RouterLinkBox from '@/components/RouterLinkBox'

export default {
  name: 'ViewWallList',
  components: {
    KedjaHeader,
    RouterLinkBox
  },
  data () {
    return {
      walls: ""
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
    getWalls: function () {
      let params = {
        //endpoint: wallId + "/wall",
        endpoint: 'walls',
        successCallback: (data) => {
          this.walls = data.data;
        },
      }
      store.commit('makeAPICall', params);
    },
    createWall: function () {
      //store.commit('createCollectionInWall',{wall: this.wall});
      let params = {
        endpoint: "walls",
        data: {title: 'Ny vägg'},
        method: "post",
        successCallback: (data) => {
          console.log(data)
          this.walls.push(data.data)
        }
      }

      store.commit('makeAPICall',params);
    },
  },
  mounted: function () {
    this.getWalls();
  }
}
</script>

<style scoped>

.ViewWallList{
  /* LAYOUT */
  display: flex;
  flex-direction: column;
}

.wallBoxes{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.wallBox{
  flex: 0 0 200px;
  margin: 0 10px 10px 0;
}

</style>
