<template>
  <div class="Wall">

    <h1>
      {{wall.name}}
    </h1>

    <div id="collections">
      <collection v-for="collection in wall.collections" :collection="collection" class="collection"></collection>
      <button @click="createCollection">Lägg till ny samling</button>
    </div>

  </div>
</template>

<script>

import { store } from '@/store';
import Collection from '@/components/Collection'

export default {
  name: 'Wall',
  components: {
    Collection
  },
  data () {
    return {
    }
  },
  props: {
    wall: ""
  },
  methods: {
    createCollection: function () {
      store.commit('createCollectionInWall',{wall: this.wall});
    }
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
