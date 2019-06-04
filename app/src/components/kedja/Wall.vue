<template>
  <div class="Wall" v-if="wall">

    <div class="wallHeader">

      <kedja-logo class="logo"></kedja-logo>
      <EditableInput v-model="data.title" tag="h1" @change="updateTitle($event)"></EditableInput>

    </div>

    <div class="wallContent">
      <div class="wallSettingsContainer">
        ⚙️
      </div>
      <div id="collections">
        <collection v-for="collection in collections" :collection="collection" class="collection" @removeCollection="removeCollection" :prid="wall.rid"></collection>
        <button @click="createCollection" title="Lägg till ny samling">+</button>
      </div>
      <connection :from="connection.members[0]" :to="connection.members[1]" v-for="connection in connections"></connection>
    </div>

    <div class="wallFooter">
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
import KedjaLogo from '@/components/KedjaLogo'
import Collection from './Collection'
import Connection from './Connection'
import EditableInput from '@/components/general/EditableInput'

export default {
  name: 'Wall',
  components: {
    KedjaLogo,
    Collection,
    Connection,
    EditableInput
  },
  data () {
    return {
      collections: ""
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
    /*collections: function () {
      return this.wall.contained;
    },*/
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
    getCollectionsFromAPI: function () {
      let wallId = this.$route.params['wallId'];
      if(wallId){
        let params = {
          //endpoint: wallId + "/wall",
          endpoint: 'walls/' + wallId + "/collections",
          successCallback: (data) => {
            console.log(data)
            this.collections = data.data
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
      store.commit('removeCollectionFromWall',{wall: this.wall, collection: collection});
    },
    updateTitle: function (title) {
      let params = {
        endpoint: "walls/" + this.wall.rid,
        data: {title: title},
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
    this.getCollectionsFromAPI();
    //this.getConnectionsFromParam();
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

.wallHeader{
  background: white;
  display: flex;
  flex-direction: row;
  border-bottom: 2px solid #EAEAEA;
  align-items: center;
}

.logo{
  padding: 20px;
  border-right: 2px solid #EAEAEA;
}

.wallContent{
  /* LAYOUT */
  display: flex;
  flex-direction: row;

  flex: 1;
  overflow-y: auto;
}

.wallSettingsContainer{
  background: white;
  padding: 20px;
  display: flex;
  align-items: flex-end;
}

#collections{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: scroll;
  flex: 1;
  padding: 20px;
}

.collection{
  flex: 0 0 300px;
  margin: 1px;
}

</style>
