<template>
  <div class="Collection" @mouseenter="setHovering(true)" @mouseleave="setHovering(false)">

    <input v-model="collection.name" class="hiddenField h2" ref="input-name"/>

    <card v-for="card in collection.cards" :card="card" class="card" @removeCard="removeCard" title="Ta bort kort"></card>

    <button class="fullWidth" @click="createCard" title="Lägg till nytt kort">Lägg till nytt kort</button>

    <button class="remove" v-if="hovering" @click="removeCollection" title="Ta bort samling">
      x
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
  },
  mounted: function () {
    this.$refs["input-name"].focus();
    this.$refs["input-name"].select();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Collection{
  border: 1px solid #EAEAEA;
  padding: 20px;
  background: #CADBDA;
  cursor: pointer;
  position: relative;
}

.Collection:hover{
  background: #ACCECC;
}

.card{
  margin: 5px 0 5px 0;
}

.fullWidth{
  margin: 5px 0 5px 0;
}

.remove{
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
