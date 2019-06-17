<template>
  <div class="ViewWall">

    <kedja-header>
      <button @click="createCollection">
        + Ny samling
      </button>
    </kedja-header>

    <div class="content">
      <wall :wall="wall"></wall>
      <context-menu class="contextMenu" v-model="menuData" :style="{'flex-basis': menuData ? '300px' : '0px'}"></context-menu>
    </div>

  </div>
</template>

<script>

import { store } from '@/store';
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
      menuData: ""
    }
  },
  props: {
  },
  computed: {
    wall: function () {
      return store.getters.getActiveWall();
    },
    sidebarFlex: function () {

    }
  },
  methods: {
    getWallFromParam: function () {
      let wallId = this.$route.params['wallId'];
      if(wallId){
        let params = {
          //endpoint: wallId + "/wall",
          endpoint: 'walls/' + wallId,
          successCallback: (data) => {
            console.log(data)
            //this.wall = data.data;
            store.commit('setActiveWall',{wall: data.data});
          },
        }
        store.commit('makeAPICall', params);
      }
    },
    createCollection: function () {
      //store.commit('createCollectionInWall',{wall: this.wall});
      let params = {
        endpoint: "walls/" + this.wall.rid + "/collections",
        data: {title: 'Ny samling'},
        method: "post",
        successCallback: (data) => {
          console.log(data)
          this.wall.collections.push(data.data)
        }
      }

      store.commit('makeAPICall',params);
    },
  },
  mounted: function () {
    this.getWallFromParam();
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

  flex: 1;
  overflow: hidden;

  /* LAYOUT */
  display: flex;
  flex-direction: row;
  transition: all 0.5s;

}

.contextMenu{
  flex-basis: 300px;
  flex: 0 0;
  border: 1px solid lightgray;
  transition: all 0.5s;
}

</style>
