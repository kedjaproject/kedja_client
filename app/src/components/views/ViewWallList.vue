<template>
  <div class="ViewWallList">

    <kedja-header>

      <button @click="createWall">
        + Ny vägg
      </button>

    </kedja-header>

    <h3>Mina väggar</h3>

    <div class="wallBoxes">
      <router-link-box :to="{ name: 'ViewWall', params: {wallId: wall.rid} }" color="lightsteelblue" v-for="wall in walls" :key="wall.rid" class="wallBox">
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
import { makeAPICall } from '@/utils'

export default {
  name: 'ViewWallList',
  components: {
    KedjaHeader,
    RouterLinkBox
  },
  data () {
    return {
      // walls: ""
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
    getWalls () {
      makeAPICall('walls')
        .then(response => {
          this.walls = response.data
        })
    },
    getWallsStore () {
      this.$store.dispatch('walls/getWalls')
    },
    createWall () {
      // this.$store.commit('createCollectionInWall',{wall: this.wall});
      makeAPICall('walls', {title: 'Ny vägg'}, 'post')
        .then(response => {
          console.log(response)
          this.walls.push(response.data)
        })
        .catch(() => {
          console.log('Du är inte inloggad. Logga in för att fortsätta.')
        })
    }
  },
  created () {

  },
  mounted () {
    this.getWallsStore()
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
