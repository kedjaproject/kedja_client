<template>
  <div class="ViewWall">

    <kedja-header>
      <button @click="createCollection">
        + Ny samling
      </button>
    </kedja-header>

    <wall :wall="wall"></wall>

  </div>
</template>

<script>

import { store } from '@/store';
import KedjaHeader from '@/components/layout/KedjaHeader'
import Wall from '@/components/kedja/Wall'

export default {
  name: 'ViewWall',
  components: {
    KedjaHeader,
    Wall
  },
  data () {
    return {
    }
  },
  props: {
  },
  computed: {
    wall: function () {
      return store.getters.getActiveWall();
    },
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
}

</style>
