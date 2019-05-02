<template>
  <div class="Wall" v-if="wall">

    <div class="wallHeader">
      <EditableInput v-model="data.title" tag="h1" @change="updateTitle($event)"></EditableInput>
    </div>

    <div class="wallContent">
      <div id="collections">
        <collection v-for="collection in collections" :collection="collection" class="collection" @removeCollection="removeCollection"></collection>
        <button @click="createCollection" title="Lägg till ny samling">+</button>
      </div>
      <connection :from="connection.members[0]" :to="connection.members[1]" v-for="connection in connections"></connection>
    </div>

    <div class="wallFooter">
      Wall footer
    </div>

    <!--div v-if="connections.length">
      <connection :from="connections[0].members[0]" :to="connections[0].members[1]"></connection>
    </div-->

  </div>
  <div v-else>
    Loading wall
  </div>
</template>

<script>

import { store } from '@/store';
import Collection from './Collection'
import Connection from './Connection'
import EditableInput from '@/components/general/EditableInput'

export default {
  name: 'Wall',
  components: {
    Collection,
    Connection,
    EditableInput
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
    data: function () {
      return this.wall.data;
    },
    collections: function () {
      return this.wall.contained;
    },
    connections: function () {
      return store.state.connections;
    },
    /*title: function () {
      return this.data.title
    }*/
  },
  watch: {
    title: function (val) {
      //console.log(val)
    }
  },
  methods: {
    getWallFromParam: function () {
      let wallId = this.$route.params['wallId'];
      if(wallId){
        let params = {
          endpoint: "recursive_read/" + wallId,
          successCallback: (data) => {
            console.log(data)
            //this.wall = data.data;
            store.commit('setActiveWall',{wall: data.data});
          },
        }
        store.commit('makeAPICall', params);
      }
    },
    getConnectionsFromParam: function () {
      let wallId = this.$route.params['wallId'];
      if(wallId){
        let params = {
          endpoint: "list_contained_relations/" + wallId,
          successCallback: (data) => {
            console.log(data)
            store.commit('setConnections',{connections: data.data});
          },
        }
        store.commit('makeAPICall', params);
      }
    },
    getWallLocal: function () {
      this.wall = store.getters.getActiveWall();
    },
    createCollection: function () {
      store.commit('createCollectionInWall',{wall: this.wall});
    },
    removeCollection: function (collection) {
      //store.commit('removeCollectionFromWall',{wall: this.wall, collection: collection});
    },
    updateTitle: function (title) {
      let params = {
        endpoint: "update/Wall/" + this.wall.rid,
        params: {title: title},
        method: "put",
        successCallback: (data) => {
          console.log(data.data)
        },
      }

      store.commit('makeAPICall',params);
    }
  },
  mounted: function () {
    this.getWallFromParam();
    this.getConnectionsFromParam();
    //this.getWallLocal();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Wall{
  /* LAYOUT */
  display: flex;
  flex-direction: column;

  /* STYLING */
  background: #EAEAEA;

}

.wallContent{
  /* LAYOUT */
  display: flex;
  flex-direction: column;

  flex: 1;
  overflow-y: auto;
}

#collections{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: scroll;
  flex: 1;
}

.collection{
  flex: 0 0 250px;
  margin: 1px;
}

</style>
