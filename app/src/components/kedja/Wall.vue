<template>
  <div class="Wall">

    <div class="wallHeader">
      <EditableInput v-model="wall.rid" tag="h1"></EditableInput>
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
      wall: ""
    }
  },
  props: {
  },
  computed: {
    collections: function () {
      return this.wall.contained;
    },
    connections: function () {
      return store.state.connections;
    }
  },
  methods: {
    getWallFromParam: function () {
      let wallId = this.$route.params['wallId'];
      if(wallId){
        let params = {
          endpoint: "recursive_read/" + wallId,
          successCallback: (data) => {
            this.wall = data.data;
          },
        }
        store.commit('makeAPICall', params);
      }
    },
    createCollection: function () {
      store.commit('createCollectionInWall',{wall: this.wall});
    },
    removeCollection: function (collection) {
      //store.commit('removeCollectionFromWall',{wall: this.wall, collection: collection});
    }
  },
  mounted: function () {
    this.getWallFromParam();
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
