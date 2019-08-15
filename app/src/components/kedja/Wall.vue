<template>
  <div class="Wall">

    <div class="wallHeader">

      <drop-down :items="[{label: 'Radera vägg', f: removeWall }]">
        <EditableInput v-model="data.title" tag="h2" @change="updateTitle($event)"></EditableInput> &#9663;
      </drop-down>

    </div>

    <div class="wallContent" ref="wallContent">
      <div id="collections" ref="colls">

        <div class="wrapper">

          <collections :collections="collections" :prid="wall.rid" @createCollection="createCollection" @removeCollection="removeCollection" @connect="connect" @unconnect="unconnect" @mounted="collectionsMounted"></collections>
          <!--connection :connection="connection" :dirtyDraw="wall.dirtyDraw" v-for="connection in connections"></connection-->

          <connections :connections="connections" boundsElementId="collections" class="connections"></connections>

        </div>

      </div>
    </div>

    <div class="wallFooter">
    </div>

  </div>
</template>

<script>

// import { store } from '@/store'
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
    wall: ''
  },
  computed: {
    userState () {
      return this.$store.getters.getUserState
    },
    /*
    wall () {
      return this.$store.getters.getActiveWall();
    },
    */
    data () {
      return this.wall.data
    },
    collections () {
      return this.wall.collections
    },
    connections () {
      return this.wall.connections
    }
    /*
    title: function () {
      return this.data.title
    }
    */
  },
  watch: {
    wall () {
      this.$store.commit('initWall', this.wall)
      this.getCollectionsFromAPI()
      this.getConnectionsFromAPI()
    },
    collections: function () {
    }
  },
  methods: {
    getCollectionsFromAPI () {
      let wallId = this.$route.params['wallId']
      if (wallId) {
        let params = {
          // endpoint: wallId + "/wall",
          endpoint: 'walls/' + wallId + '/collections',
          successCallback: (data) => {
            this.$store.commit('setWallCollections', {wall: this.wall, collections: data.data})
          }
        }
        this.$store.commit('makeAPICall', params)
      }
    },
    getConnectionsFromAPI () {
      let wallId = this.$route.params['wallId']
      if (wallId) {
        let params = {
          endpoint: 'walls/' + wallId + '/relations',
          successCallback: (data) => {
            this.$store.commit('setWallConnections', {wall: this.wall, connections: data.data})
          }
        }
        this.$store.commit('makeAPICall', params)
      }
    },
    getWallLocal () {
      this.wall = this.$store.getters.getActiveWall()
    },
    createCollection () {
      // this.$store.commit('createCollectionInWall',{wall: this.wall})
      let params = {
        endpoint: 'walls/' + this.wall.rid + '/collections',
        data: {title: 'Ny samling'},
        method: 'post',
        successCallback: (data) => {
          this.collections.push(data.data)
        }
      }
      this.$store.commit('makeAPICall', params)
    },
    removeWall () {
      // this.$router.push({ name: 'ViewWallList', params: {}  })
      let params = {
        endpoint: 'walls/' + this.wall.rid,
        method: 'delete',
        successCallback: (data) => {
          this.$router.push({name: 'Walls'})
        }
      }
      this.$store.commit('makeAPICall', params)
    },
    removeCollection (collection) {
      // this.$store.commit('removeCollectionFromWall',{wall: this.wall, collection: collection})
      let params = {
        endpoint: 'walls/' + this.wall.rid + '/collections/' + collection.rid,
        method: 'delete',
        successCallback: (data) => {
          console.log(data)

          let index = this.wall.collections.indexOf(collection)
          if (index !== -1) {
            this.wall.collections.splice(index, 1)
          }
        }
      }
      this.$store.commit('makeAPICall', params)
    },
    updateTitle (title) {
      let params = {
        endpoint: 'walls/' + this.wall.rid,
        data: {title: title},
        method: 'put',
        successCallback: (data) => {
        }
      }
      this.$store.commit('makeAPICall', params)
    },
    connect (p) {
      // this.$store.commit('createConnection',params);
      console.log(p.members)

      let params = {
        endpoint: 'walls/' + this.wall.rid + '/relations',
        data: p,
        method: 'post',
        successCallback: (data) => {
          console.log(data)
          // this.$store.commit('addConnectionToWall',{wall: this.wall, connection: data.data})
          this.wall.connections.push(data.data)
          this.$store.commit('forceUserStateUpdate')
        }
      }
      this.$store.commit('makeAPICall', params)
    },
    unconnect (p) {
      // this.$store.commit('createConnection',params)
      console.log(p.members)

      let connection = this.wall.connections.filter(c => c.members.indexOf(p.members[0]) !== -1 && c.members.indexOf(p.members[1]) !== -1)[0]

      let params = {
        endpoint: 'walls/' + this.wall.rid + '/relations/' + connection.relation_id,
        method: 'delete',
        successCallback: (data) => {
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
        }
      }

      this.$store.commit('makeAPICall', params)
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
  updated: function () {

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
  flex: 1;
}

.wrapper{
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
