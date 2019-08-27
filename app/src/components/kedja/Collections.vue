<template>
  <div class="Collections" ref="collections">

    <collection v-for="collection in collections" :key="collection.rid" :collection="collection" :wall="wall" class="collection" @connect="connect" @unconnect="unconnect" :prid="prid"></collection>

    <button @click="createCollection(wall)" title="Lägg till ny samling" class="new">+ Ny samling</button>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Collection from './Collection'

export default {
  name: 'Collections',
  components: {
    Collection
  },
  props: {
    collections: Array,
    prid: Number,
    wall: Object
  },
  computed: {
    dirtyDraw: function () {
      return this.$store.state.dirtyDraw
    }
  },
  watch: {
  },
  methods: {
    connect: function (p) {
      this.$emit('connect', p)
    },
    unconnect: function (p) {
      this.$emit('unconnect', p)
    },
    /*
    handleScroll: function () {
      this.$store.commit('setDirtyDraw');
    }
    */
    ...mapActions('walls/collections', ['createCollection', 'removeCollection'])
  },
  created: function () {
  },
  mounted: function () {
    // this.$refs.collections.addEventListener('scroll', this.handleScroll);
    this.$emit('mounted')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Collections{

  flex: 1 0;
  overflow: hidden;

  /* LAYOUT */
  display: inline-flex;
  flex-direction: row;

  /* STYLING */
  /*overflow-x: scroll;*/
  /*position: relative;*/
}

/*.wrapper{
  flex: 1;
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
}*/

.collection{
  /*flex: 0 0 300px;*/
  min-width: 300px;
}

.new{
  align-self: center;
  margin: 10px;
}

</style>
