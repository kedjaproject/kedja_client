<template>
  <div class="Collection" @mouseenter="setHovering(true)" @mouseleave="setHovering(false)">

    <div class="collectionHeader">
      <EditableInput v-model="collection.data.title" tag="h3" @change="updateTitle($event)"></EditableInput>
      {{collection.rid}}
      <br />

      <button @click="removeCollection" title="Ta bort samling">
        🗑️
      </button>

    </div>

    <div class="collectionContent">
      <transition-group name="fade" mode="out-in" class="cards">
        <card v-for="(card,index) in cards" :card="card" @removeCard="removeCard" :key="card.rid" :id="card.rid" tabindex="0"></card>
      </transition-group>

    </div>

    <div class="collectionFooter">
      <button class="fullWidth" @click="createCard" title="Lägg till nytt kort">Lägg till nytt kort</button>
    </div>


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
    cards: function () {
      return this.collection.contained
    },
    cardsFiltered: function () {
      return this.cards//.filter(card => card.states.selected != false || card.states.selectedConnected != false)
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
    },
    updateTitle: function (title) {
      let params = {
        endpoint: this.collection.rid,
        params: {title: title},
        method: "put",
        successCallback: (data) => {
          console.log(data.data)
        },
      }

      store.commit('makeAPICall',params);
    }
  },
  created: function () {
    if(!this.collection.contained){
      store.commit('getContainedCards',{collection: this.collection});
    }
  },
  mounted: function () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Collection{

  /* LAYOUT */
  display: flex;
  flex-direction: column;

  border: 1px solid #EAEAEA;
  background: #CADBDA;
  /*position: relative;*/
}

.Collection:nth-child(even){
  background: #ACCECC;
}

.Collection:hover{

}

.collectionHeader{
  padding: 0 20px 0 20px;
  border-bottom: 1px solid white;
}

.collectionContent{
  padding: 20px;
  flex: 1;
  overflow-y: scroll;
}

.collectionFooter{
  padding: 20px;
  border-top: 1px solid white;
}

.cards{
  display: flex;
  flex-direction: column;
  position: relative;
}

.remove{
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
