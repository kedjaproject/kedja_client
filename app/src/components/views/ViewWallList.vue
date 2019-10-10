<template>
  <div class="ViewWallList">

    <kedja-header>

      <button @click="createWall">
        + Ny vägg
      </button>

    </kedja-header>

    <h3>Mina väggar</h3>

    <div class="wallBoxes">
      <router-link-box :to="{ name: 'ViewWall', params: {wallId: wall.rid} }" :color="getColor(wall)" v-for="wall in all" :key="wall.rid" class="wallBox">
        <h3>
          {{wall.data.title}}
        </h3>
      </router-link-box>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import KedjaHeader from '@/components/layout/KedjaHeader'
import RouterLinkBox from '@/components/RouterLinkBox'

export default {
  name: 'ViewWallList',
  components: {
    KedjaHeader,
    RouterLinkBox
  },
  computed: {
    ...mapGetters('walls', ['all'])
  },
  methods: {
    getColor (wall) {
      return wall.data.acl_name === 'private_wall' ? 'lightsteelblue' : '#c2c8e6'
    },
    ...mapActions('walls', ['fetchWalls', 'createWall'])
  },
  mounted () {
    this.fetchWalls()
  }
}
</script>

<style scoped lang="sass">

.ViewWallList
  /* LAYOUT */
  display: flex
  flex-direction: column

.wallBoxes
  display: flex
  flex-direction: row
  flex-wrap: wrap

.wallBox
  flex: 0 0 200px
  margin: 0 10px 10px 0
  min-height: 80px
  h3
    margin: 0

</style>
