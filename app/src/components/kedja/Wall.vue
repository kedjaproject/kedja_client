<template>
  <div class="Wall">

    <EditableInput v-model="wall.rid" tag="h1"></EditableInput>

    <div id="collections">
      <collection v-for="collection in collections" :collection="collection" class="collection" @removeCollection="removeCollection"></collection>
      <button @click="createCollection" title="Lägg till ny samling">+</button>
    </div>

    <!--div v-if="connections.length">
      <connection :from="connections[0].members[0]" :to="connections[0].members[1]"></connection>
    </div-->
    <connection :from="connection.members[0]" :to="connection.members[1]" v-for="connection in connections"></connection>

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
  background: #EAEAEA;
}

#collections{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.collection{
  flex: 1;
  margin: 1px;
}

</style>
