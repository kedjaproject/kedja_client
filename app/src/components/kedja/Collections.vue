<template>
  <div class="Collections" ref="collections">

    <collection v-for="collection in collections" :key="collection.rid" :collection="collection" class="collection" @removeCollection="removeCollection" @connect="connect" @unconnect="unconnect" :prid="prid"></collection>

    <div class="newCollection" @click="createCollection" tabindex="0">
      <button title="Lägg till ny samling" class="new">+</button>

    </div>

  </div>
</template>

<script>

import Collection from './Collection'

export default {
  name: 'Collections',
  components: {
    Collection
  },
  data () {
    return {
      // collections: ""
    }
  },
  props: {
    collections: '',
    prid: ''
  },
  computed: {
    dirtyDraw: function () {
      return this.$store.state.dirtyDraw
    }
  },
  watch: {
  },
  methods: {
    createCollection: function () {
      this.$emit('createCollection')
    },
    removeCollection: function (collection) {
      this.$emit('removeCollection', collection)
    },
    connect: function (p) {
      this.$emit('connect', p)
    },
    unconnect: function (p) {
      this.$emit('unconnect', p)
    }
    /*
    handleScroll: function () {
      this.$store.commit('setDirtyDraw');
    }
    */
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

.Collections > *{
  background: #CADBDA;
}

.collection:nth-child(even),
.collection:nth-child(even) .collectionHeader,
.collection:nth-child(even) .collectionFooter,
.newCollection:nth-child(even)
{
  background: #ACCECC;
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
  width: 300px;
}

.new{
  align-self: center;
  margin: 10px;
}

.newCollection{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
