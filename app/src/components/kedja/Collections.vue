<template>
  <div class="Collections" ref="collections">

    <collection v-for="collection in collections" :key="collection.rid" :collection="collection" :wall="wall" class="collection"></collection>

    <div v-if="isEditor" class="newCollection" @click="createCollection(wall)" tabindex="0">
      <button title="Lägg till ny samling" class="new">+</button>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Collection from './Collection'

export default {
  name: 'Collections',
  components: {
    Collection
  },
  props: {
    collections: Array,
    wall: Object
  },
  computed: {
    isEditor () {
      return this.checkPermission(this.wall.rid, 'Wall:Edit')
    },
    ...mapGetters('permissions', ['checkPermission'])
  },
  methods: {
    ...mapActions('walls/collections', ['createCollection', 'removeCollection'])
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
