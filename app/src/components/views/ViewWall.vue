<template>
  <div class="ViewWall" @click="resetUserState">

    <kedja-header></kedja-header>

    <div class="content">
      <wall v-if="rid" :rid="rid" :wall="wall" class="mywall"></wall>
      <!--context-menu class="cxtMenu" v-model="menuOpen" :style="{'flex-basis': menuOpen ? '300px' : '0px'}"></context-menu-->
    </div>

  </div>
</template>

<script>

import { mapState, mapMutations, mapActions } from 'vuex'

import KedjaHeader from '@/components/layout/KedjaHeader'
import Wall from '@/components/kedja/Wall.vue'
import ContextMenu from '@/components/contextMenu/ContextMenu'
import { kedjaAPI } from '@/utils'

export default {
  name: 'ViewWall',
  components: {
    KedjaHeader,
    Wall,
    ContextMenu
  },
  data () {
    return {
      rid: NaN
      // menuOpen: '' //Used for right side context-menu, which is (temporaily?) removed
    }
  },
  computed: {
    wall () {
      return this.rid && this.walls[this.rid]
    },
    ...mapState('walls', ['walls'])
  },
  methods: {
    getWallFromParam: function () {
      this.rid = Number(this.$route.params['wallId'])
      if (this.rid) {
        // Test
        this.fetchWall(this.rid)
        this.setActiveWallId(this.rid)
        // End test
        /*
        kedjaAPI.get('walls/' + wallId)
          .then(response => {
            this.$store.commit('setActiveWall', {wall: response.data})
          })
        */
      }
    },
    createCollection () {
      // this.$store.commit('createCollectionInWall', {wall: this.wall})
      kedjaAPI.post('walls/' + this.wall.rid + '/collections', {title: 'Ny samling'})
        .then(response => {
          console.log(response)
          this.wall.collections.push(response.data)
        })
    },
    resetUserState () {
      this.$store.commit('resetUserState')
    },
    ...mapMutations('walls', ['setActiveWallId']),
    ...mapActions('walls', ['fetchWall'])
  },
  mounted () {
    this.getWallFromParam()
  }
}
</script>

<style scoped>

.ViewWall{

  /* LAYOUT */
  display: flex;
  flex-direction: column;
  transition: all 0.5s;
}

.content{

  /*vertical flex*/
  flex: 1;
  overflow: hidden;

  /* LAYOUT */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /*transition: all 0.5s;*/

}

.mywall{
  flex: 1;
}

.cxtMenu{
  flex: 0 0;
  border: 1px solid lightgray;
  overflow-y: scroll;
  transition: all 0.5s;
}

.menu{
  flex: 0 0 400px;
  background: red;
}

</style>
