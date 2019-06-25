<template>
  <div class="Collections" ref="collections">

      <collection v-for="collection in collections" :collection="collection" class="collection" @removeCollection="removeCollection" @connect="connect" @unconnect="unconnect" :prid="prid"></collection>

      <button @click="createCollection" title="Lägg till ny samling" class="new">+ Ny samling</button>

  </div>
</template>

<script>

import Collection from './Collection'

export default {
  name: 'Collections',
  components: {
    Collection,
  },
  data () {
    return {
      //collections: ""
    }
  },
  props: {
    collections: "",
    prid: ""
  },
  computed: {
  },
  watch: {
  },
  methods: {
    createCollection: function () {
      this.$emit('createCollection')
    },
    removeCollection: function (collection) {
      this.$emit('removeCollection',collection)
    },
    connect: function (p) {
      this.$emit('connect',p)
    },
    unconnect: function (p) {
      this.$emit('unconnect',p)
    },
    /*handleScroll: function () {
      this.$store.commit('setDirtyDraw');
    }*/
  },
  created: function () {
  },
  mounted: function () {
    //this.$refs.collections.addEventListener('scroll', this.handleScroll);
    this.$emit('mounted')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Collections{

  flex: 1;

  /* LAYOUT */
  display: flex;
  flex-direction: row;

  /* STYLING */
  /*overflow-x: scroll;*/
}

.collection{
  flex: 0 0 300px;
}


.new{
  align-self: center;
  margin: 10px;
}


</style>
