<template>
  <div class="Wall" v-if="wall">

    <div class="wallHeader">

      <drop-down :items="[{label: 'Radera vägg', f: removeWall }]">
        <EditableInput v-model="wall.title" tag="h2" @change="updateTitle($event)"></EditableInput> &#9663;
      </drop-down>

    </div>

    <div class="wallContent" ref="wallContent">
      <div id="collections" ref="colls">

        <div class="horisontal-scroll-wrapper">
          <collections :collections="collections" :prid="wall.rid" @createCollection="createCollection" @removeCollection="removeCollection" @connect="connect" @unconnect="unconnect" @mounted="collectionsMounted"></collections>
          <connections :connections="relations" boundsElementId="collections" class="connections"></connections>
        </div>

      </div>
    </div>

    <div class="wallFooter">
    </div>

  </div>
  <div v-else>
    Loading....
  </div>
</template>

<script>

import { mapState } from 'vuex'
import { kedjaAPI } from '@/utils'

import KedjaHeader from '@/components/layout/KedjaHeader'
import DropDown from '@/components/DropDown'
import Collections from './Collections'
import Collection from './Collection'
import Connection from './Connection'
import Connections from './Connections'
import EditableInput from '@/components/general/EditableInput'

export default {
  name: 'Wall',
  components: {
    KedjaHeader,
    DropDown,
    Collections,
    Collection,
    Connection,
    Connections,
    EditableInput
  },
  data () {
    return {
      // collections: ""
    }
  },
  props: {
    // wall: Object,
    rid: Number
  },
  computed: {
    userState () {
      return this.$store.getters.getUserState
    },
    wall () {
      return this.wallData[this.rid]
    },
    collections () {
      return this.wall.collections
    },
    relations () {
      return this.wall.relations
    },
    title: function () {
      return this.wall.title
    },
    ...mapState('walls', ['wallData'])
  },
  watch: {
    /*
    wall () {
      this.$store.commit('initWall', this.wall)
      this.getCollectionsFromAPI()
      this.getConnectionsFromAPI()
    },
    collections: function () {
    }
    */
  },
  methods: {
    getCollectionsFromAPI () {
      let wallId = this.$route.params['wallId']
      if (wallId) {
        kedjaAPI.get('walls/' + wallId + '/collections')
          .then(response => {
            this.$store.commit('setWallCollections', {wall: this.wall, collections: response.data})
          })
      }
    },
    getConnectionsFromAPI () {
      let wallId = this.$route.params['wallId']
      if (wallId) {
        kedjaAPI.get('walls/' + wallId + '/relations')
          .then(response => {
            this.$store.commit('setWallConnections', {wall: this.wall, connections: response.data})
          })
      }
    },
    getWallLocal () {
      this.wall = this.$store.getters.getActiveWall()
    },
    createCollection () {
      // this.$store.commit('createCollectionInWall',{wall: this.wall})
      kedjaAPI.post('walls/' + this.wall.rid + '/collections', {title: 'Ny samling'})
        .then(response => {
          this.collections.push(response.data)
        })
    },
    removeWall () {
      // this.$router.push({ name: 'ViewWallList', params: {}  })
      kedjaAPI.delete('walls/' + this.wall.rid)
        .then(response => {
          this.$router.push({name: 'Walls'})
        })
    },
    removeCollection (collection) {
      // this.$store.commit('removeCollectionFromWall',{wall: this.wall, collection: collection})
      kedjaAPI.delete('walls/' + this.wall.rid + '/collections/' + collection.rid)
        .then(response => {
          console.log(response)

          let index = this.wall.collections.indexOf(collection)
          if (index !== -1) {
            this.wall.collections.splice(index, 1)
          }
        })
    },
    updateTitle (title) {
      kedjaAPI.put('walls/' + this.wall.rid, {title})
        .then(response => {})
    },
    connect (p) {
      // this.$store.commit('createConnection',params);
      console.log(p.members)

      kedjaAPI.post('walls/' + this.wall.rid + '/relations', p)
        .then(response => {
          console.log(response)
          // this.$store.commit('addConnectionToWall',{wall: this.wall, connection: data.data})
          this.wall.connections.push(response.data)
          this.$store.commit('forceUserStateUpdate')
        })
    },

    unconnect (p) {
      // this.$store.commit('createConnection',params)
      console.log(p.members)
      let connection = this.wall.connections.filter(c => c.members.indexOf(p.members[0]) !== -1 && c.members.indexOf(p.members[1]) !== -1)[0]

      kedjaAPI.delete('walls/' + this.wall.rid + '/relations/' + connection.relation_id)
        .then(response => {
          let index = this.wall.connections.indexOf(connection)
          console.log(index)
          console.log(connection.relation_id)
          console.log(this.wall.connections)
          if (index !== -1) {
            this.wall.connections.splice(index, 1)
            // this.$store.commit('setDirtyDraw');
            this.$store.commit('forceUserStateUpdate')
          }
          console.log(this.wall.connections)
        })
    },

    handleScroll () {
      this.$store.commit('setDirtyDraw')
    },
    collectionsMounted () {
      // document.getElementById('collections').addEventListener('scroll', this.handleScroll)
      this.$refs.colls.addEventListener('scroll', this.handleScroll)
    }
  },
  created () {
  },
  mounted () {
    // this.getCollectionsFromAPI();
    // this.getConnectionsFromParam();
    // this.getWallLocal();
    /*
      this.$nextTick(function() {
      console.log(this.$refs)
      console.log(this.$refs.collections)
      console.log(this.$refs.wallContent)
    })
    */

    // this.$refs.collections.addEventListener('scroll', this.handleScroll);

  },
  updated () {
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
  overflow-x: hidden;

}

.wallHeader{
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.wallContent{
  /* LAYOUT */
  display: flex;
  flex-direction: row;

  flex: 1;
  overflow: hidden;
}

#collections{
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  overflow-y: hidden;
  flex: 1;
}

.horisontal-scroll-wrapper{
  display: flex;
  flex-direction: row;
  position: relative;
}

.connections{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

</style>
