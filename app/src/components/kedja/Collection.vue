<template>
  <div class="Collection" @mouseenter="setHovering(true)" @mouseleave="setHovering(false)">

    <EditableInput v-model="collection.name" tag="h2"></EditableInput>

    <transition-group name="fade" mode="out-in" class="cards">
      <card v-for="card in cardsFiltered" :card="card" @removeCard="removeCard" :key="card.id"></card>
    </transition-group>

    <button class="fullWidth" @click="createCard" title="Lägg till nytt kort">Lägg till nytt kort</button>

    <button class="remove" v-if="hovering" @click="removeCollection" title="Ta bort samling">
      x
    </button>

  </div>
</template>

<script>

import { store } from '@/store';
import Card from './Card'
import EditableInput from '@/components/general/EditableInput'

export default {
  name: 'Collection',
  components: {
    Card,
    EditableInput
  },
  data () {
    return {
      hovering: false
    }
  },
  computed: {
    cardsFiltered: function () {
      return this.collection.cards.filter(card => card.states.selected != false || card.states.selectedConnected != false)
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

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Collection{
  border: 1px solid #EAEAEA;
  padding: 20px;
  background: #CADBDA;
  position: relative;
}

.Collection:hover{
  background: #ACCECC;
}

.cards{
  display: flex;
  flex-direction: column;
  position: relative;
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
