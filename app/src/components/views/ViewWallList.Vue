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
      //walls: ""
    }
  },
  props: {
  },
  computed: {
    walls: function () {
      return this.$store.getters['walls/all']
    }
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
      this.$store.commit('makeAPICall', params);
    },
    getWallsStore: function () {
      this.$store.dispatch('walls/getWalls');
    },
    createWall: function () {
      //this.$store.commit('createCollectionInWall',{wall: this.wall});
      let params = {
        endpoint: "walls",
        data: {title: 'Ny vägg'},
        method: "post",
        successCallback: (data) => {
          console.log(data)
          this.walls.push(data.data)
        },
        errorCallback: (data) => {
          console.log("Du är inte inloggad. Logga in för att fortsätta.")
          console.log(data)
        }
      }

      this.$store.commit('makeAPICall',params);
    },
  },
  created: function () {

  },
  mounted: function () {
    this.getWallsStore();
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
