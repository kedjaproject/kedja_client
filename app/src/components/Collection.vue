<template>
  <div class="Collection" @mouseenter="setHovering(true)" @mouseleave="setHovering(false)">

    <h2>
      {{collection.name}}
    </h2>

    <card v-for="card in collection.cards" :card="card" class="card" @removeCard="removeCard"></card>

    <button @click="createCard">Lägg till nytt kort</button>

    <button class="remove" v-if="hovering" @click="removeCollection">
      Ta bort samling
    </button>

  </div>
</template>

<script>

import { store } from '@/store';
import Card from '@/components/Card'

export default {
  name: 'Collection',
  components: {
    Card
  },
  data () {
    return {
      hovering: false
    }
  },
  props: {
    collection: ""
  },
  methods: {
    setHovering: function (status){
      this.hovering = status;
    },
    removeCollection: function () {
      this.$emit('removeCollection',this.collection)
    },
    createCard: function () {
      store.commit('createCardInCollection',{collection: this.collection});
    },
    removeCard: function (card) {
      store.commit('removeCardFromCollection',{collection: this.collection, card: card});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Collection{
  border: 1px solid white;
  padding: 5px;
  background: #CADBDA;
  position: relative;
}

.card{
  margin: 5px 0 5px 0;
}

.remove{
  position: absolute;
  top: 5px;
  right: 5px;
}

</style>
