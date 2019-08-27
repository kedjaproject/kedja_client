<template>
  <div class="Wall" v-if="wall">

    <div class="wallHeader">

      <drop-down :items="[{label: 'Radera vägg', f: removeWall }]">
        <EditableInput v-model="wall.data.title" tag="h2" @change="updateTitle($event)"></EditableInput> &#9663;
      </drop-down>

    </div>

    <div class="wallContent" ref="wallContent">
      <div id="collections" ref="colls">

        <div class="horisontal-scroll-wrapper">
          <collections :collections="collections" :wall="wall" :prid="rid" @connect="connect" @unconnect="unconnect" @mounted="collectionsMounted"></collections>
          <connections v-if="relations" :connections="relations" boundsElementId="collections" class="connections"></connections>
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

import { mapState, mapGetters } from 'vuex'
import { kedjaAPI, eventBus } from '@/utils'

import KedjaHeader from '@/components/layout/KedjaHeader'
import DropDown from '@/components/DropDown'
import Collections from './Collections'
import Connections from './Connections'
import EditableInput from '@/components/general/EditableInput'

export default {
  name: 'Wall',
  components: {
    KedjaHeader,
    DropDown,
    Collections,
    Connections,
    EditableInput
  },
  props: {
    rid: Number,
    wall: Object
  },
  computed: {
    collections () {
      return this.getWallCollections(this.wall)
    },
    relations () {
      return this.wall.relations
    },
    ...mapState('walls', ['walls']),
    ...mapState(['userState']),
    ...mapGetters('walls', ['getWallCollections'])
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
    // FIXME: Activate scrollIntoView
    /*
    createCollection () {
      // this.$store.commit('createCollectionInWall',{wall: this.wall})
      kedjaAPI.post('walls/' + this.rid + '/collections', {title: 'Ny samling'})
        .then(response => {
          this.collections.push(response.data)
          this.$nextTick(() => {
            document.activeElement.scrollIntoView({behavior: "smooth", inline: "start"})
          })
        })
    },
    */
    removeWall () {
      // this.$router.push({ name: 'ViewWallList', params: {}  })
      kedjaAPI.delete('walls/' + this.rid)
        .then(response => {
          this.$router.push({name: 'Walls'})
        })
    },
    /*
    removeCollection (collection) {
      // this.$store.commit('removeCollectionFromWall',{wall: this.wall, collection: collection})
      kedjaAPI.delete('walls/' + this.rid + '/collections/' + collection.rid)
        .then(response => {
          console.log(response)

          let index = this.wall.collections.indexOf(collection)
          if (index !== -1) {
            this.wall.collections.splice(index, 1)
          }
        })
    },
    */
    updateTitle (title) {
      kedjaAPI.put('walls/' + this.rid, {title})
    },
    connect (p) {
      // this.$store.commit('createConnection',params);
      console.log(p.members, this.wall)

      kedjaAPI.post('walls/' + this.rid + '/relations', p)
        .then(response => {
          console.log(response)
          // this.$store.commit('addConnectionToWall',{wall: this.wall, connection: data.data})
          this.wall.relations.push(response.data)
          this.$store.commit('forceUserStateUpdate')
        })
    },

    unconnect (p) {
      // this.$store.commit('createConnection',params)
      console.log(p.members)
      let relation = this.wall.relations.find(c => c.members.includes(p.members[0]) && c.members.includes(p.members[1]))

      kedjaAPI.delete('walls/' + this.rid + '/relations/' + relation.relation_id)
        .then(response => {
          let index = this.wall.relations.indexOf(relation)
          console.log(index)
          console.log(relation.relation_id)
          console.log(this.wall.relations)
          if (index !== -1) {
            this.wall.relations.splice(index, 1)
            // this.$store.commit('setDirtyDraw');
            this.$store.commit('forceUserStateUpdate')
          }
          console.log(this.wall.relations)
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
    eventBus.$on('collectionCreated', () => {
      this.$nextTick(() => {
        document.activeElement.scrollIntoView({behavior: "smooth", inline: "start"})
      })
    })
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
  padding: 1em 0 1em 0;
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
  overflow-x: auto;
  scroll-behavior: smooth;
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
