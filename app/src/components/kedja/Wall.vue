<template>
  <div class="Wall">

    <div class="wallHeader">

      <drop-down :items="[{label: 'Exportera vägg som'},{label: 'Versionshistorik'},{label: 'Radera vägg', f: removeWall}]">
        <EditableInput v-model="data.title" tag="h2" @change="updateTitle($event)"></EditableInput> &#9663;
      </drop-down>

      <!--div>
        {{connections}}
      </div-->

    </div>

    <div class="wallContent" ref="wallContent">
      <div id="collections">
        <collections :collections="collections" :prid="wall.prid" @createCollection="createCollection" @removeCollection="removeCollection" @connect="connect" @unconnect="unconnect"></collections>


        <!--collection v-for="collection in collections" :collection="collection" class="collection" @removeCollection="removeCollection" @connect="connect" @unconnect="unconnect" :prid="wall.rid"></collection-->

      </div>
      <div class="connections">
        <connection :connection="connection" :dirtyDraw="wall.dirtyDraw" v-for="connection in connections"></connection>
      </div>
    </div>

    <div class="wallFooter">
    </div>



    <!--div v-if="connections.length">
      <connection :from="connections[0].members[0]" :to="connections[0].members[1]"></connection>
    </div-->

  </div>
</template>

<script>

//import { store } from '@/store';
import KedjaHeader from '@/components/layout/KedjaHeader'
import DropDown from '@/components/DropDown'
import Collections from './Collections'
import Collection from './Collection'
import Connection from './Connection'
import EditableInput from '@/components/general/EditableInput'

export default {
  name: 'Wall',
  components: {
    KedjaHeader,
    DropDown,
    Collections,
    Collection,
    Connection,
    EditableInput
  },
  data () {
    return {
      //collections: ""
    }
  },
  props: {
    wall: ""
  },
  computed: {
    userState: function () {
      return this.$store.getters.getUserState;
    },
    /*wall: function () {
      return this.$store.getters.getActiveWall();
    },*/
    data: function () {
      return this.wall.data;
    },
    collections: function () {
      return this.wall.collections;
    },
    connections: function () {
      return this.wall.connections;
    },
    /*title: function () {
      return this.data.title
    }*/
  },
  watch: {
    wall: function () {
      this.$store.commit('initWall',this.wall);
      this.getCollectionsFromAPI();
      this.getConnectionsFromAPI();
    },
    collections: function () {
    }
  },
  methods: {
    getCollectionsFromAPI: function () {
      let wallId = this.$route.params['wallId'];
      if(wallId){
        let params = {
          //endpoint: wallId + "/wall",
          endpoint: 'walls/' + wallId + "/collections",
          successCallback: (data) => {
            this.$store.commit('setWallCollections', {wall: this.wall, collections: data.data});
          },
        }
        this.$store.commit('makeAPICall', params);
      }
    },
    getConnectionsFromAPI: function () {
      let wallId = this.$route.params['wallId'];
      if(wallId){
        let params = {
          endpoint: "walls/" + wallId + "/relations",
          successCallback: (data) => {
            this.$store.commit('setWallConnections', {wall: this.wall, connections: data.data});
          },
        }
        this.$store.commit('makeAPICall', params);
      }
    },
    getWallLocal: function () {
      this.wall = this.$store.getters.getActiveWall();
    },
    createCollection: function () {
      //this.$store.commit('createCollectionInWall',{wall: this.wall});
      let params = {
        endpoint: "walls/" + this.wall.rid + "/collections",
        data: {title: 'Ny samling'},
        method: "post",
        successCallback: (data) => {
          this.collections.push(data.data)
        }
      }

      this.$store.commit('makeAPICall',params);
    },
    removeWall: function () {
      //this.$router.push({ name: 'ViewWallList', params: {}  })
      let params = {
        endpoint: "walls/" + this.wall.rid,
        method: "delete",
        successCallback: (data) => {
          this.$router.push({ name: 'ViewWallList'})
        },
      }

      this.$store.commit('makeAPICall',params);
    },
    removeCollection: function (collection) {
      //this.$store.commit('removeCollectionFromWall',{wall: this.wall, collection: collection});
      let params = {
        endpoint: "walls/" + this.wall.rid + "/collections/" + collection.rid,
        method: "delete",
        successCallback: (data) => {
          console.log(data)

          let index = this.wall.collections.indexOf(collection)
          if(index != -1){
            this.wall.collections.splice(index,1)
          }

        },
      }

      this.$store.commit('makeAPICall',params);
    },
    updateTitle: function (title) {
      let params = {
        endpoint: "walls/" + this.wall.rid,
        data: {title: title},
        method: "put",
        successCallback: (data) => {
        },
      }

      this.$store.commit('makeAPICall',params);
    },
    connect: function (p) {
      //this.$store.commit('createConnection',params);
      console.log(p.members)

      let params = {
        endpoint: "walls/" + this.wall.rid + "/relations",
        data: p,
        method: "post",
        successCallback: (data) => {
          console.log(data)
          //this.$store.commit('addConnectionToWall',{wall: this.wall, connection: data.data});
          this.wall.connections.push(data.data)
          this.$store.commit('forceUserStateUpdate');
        },
      }

      this.$store.commit('makeAPICall',params);
    },
    unconnect: function (p) {
      //this.$store.commit('createConnection',params);
      console.log(p.members)

      let connection = this.wall.connections.filter(c => c.members.indexOf(p.members[0]) != -1 && c.members.indexOf(p.members[1]) != -1)[0];

      let params = {
        endpoint: "walls/" + this.wall.rid + "/relations/" + connection.relation_id,
        method: "delete",
        successCallback: (data) => {
          console.log(data)

          let index = this.wall.connections.indexOf(connection)
          if(index != -1){
            this.wall.connections.splice(index,1)
            //this.$store.commit('setDirtyDraw');
            this.$store.commit('forceUserStateUpdate');
          }

        },
      }

      this.$store.commit('makeAPICall',params);
    },
    handleScroll: function () {
      console.log("scroll")
      this.$store.commit('setDirtyDraw');
    }
  },
  created: function () {
  },
  mounted: function () {
    //this.getCollectionsFromAPI();
    //this.getConnectionsFromParam();
    //this.getWallLocal();
    /*this.$nextTick(function() {
      console.log(this.$refs)
      console.log(this.$refs.collections)
      console.log(this.$refs.wallContent)
    })*/

    //this.$refs.collections.addEventListener('scroll', this.handleScroll);
    //document.getElementById('collections').addEventListener('scroll', this.handleScroll);
  },
  updated: function () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Wall{

  flex: 1;

  /* LAYOUT */
  display: flex;
  flex-direction: column;

  /* STYLING */

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

  flex: 1;
}

</style>
