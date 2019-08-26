<template>
  <div class="ViewWall" @click="resetUserState">

    <kedja-header>
      <h3></h3>
    </kedja-header>

    <div class="content">
      <wall :wall="wall" class="mywall"></wall>
      <!--context-menu class="cxtMenu" v-model="menuOpen" :style="{'flex-basis': menuOpen ? '300px' : '0px'}"></context-menu-->
    </div>

  </div>
</template>

<script>

import KedjaHeader from '@/components/layout/KedjaHeader'
import Wall from '@/components/kedja/Wall'
import ContextMenu from '@/components/contextMenu/ContextMenu'

export default {
  name: 'ViewWall',
  components: {
    KedjaHeader,
    Wall,
    ContextMenu
  },
  data () {
    return {
      // menuOpen: '' //Used for right side context-menu, which is (temporaily?) removed
    }
  },
  props: {
  },
  computed: {
    wall () {
      return this.$store.getters.getActiveWall()
    }
    /*
    sidebarFlex () {

    }
    */
  },
  methods: {
    getWallFromParam: function () {
      let wallId = this.$route.params['wallId']
      if (wallId) {
        let params = {
          // endpoint: wallId + "/wall",
          endpoint: 'walls/' + wallId,
          successCallback: (data) => {
            this.$store.commit('setActiveWall', {wall: data.data})
          }
        }
        this.$store.commit('makeAPICall', params)
      }
    },
    createCollection () {
      // this.$store.commit('createCollectionInWall', {wall: this.wall})
      let params = {
        endpoint: 'walls/' + this.wall.rid + '/collections',
        data: {title: 'Ny samling'},
        method: 'post',
        successCallback: (data) => {
          console.log(data)
          this.wall.collections.push(data.data)
        }
      }

      this.$store.commit('makeAPICall', params)
    },
    resetUserState () {
      this.$store.commit('resetUserState')
    }
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
