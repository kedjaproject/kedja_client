<template>
  <div class="Collection" @mouseenter="setHovering(true)" @mouseleave="setHovering(false)">

    <div class="collectionHeader">
      <EditableInput v-model="collection.data.title" tag="h3" @change="updateTitle($event)"></EditableInput>

      <!--button class="remove" v-if="hovering" @click="removeCollection" title="Ta bort samling">
        x
      </button-->

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
        endpoint: "update/Collection/" + this.collection.rid,
        params: {title: title},
        method: "put",
        successCallback: (data) => {
          console.log(data.data)
        },
      }

      store.commit('makeAPICall',params);
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
  padding: 20px;
  background: #CADBDA;
  /*position: relative;*/
}

.Collection:hover{
  background: #ACCECC;
}

.collectionContent{
  flex: 1;
  overflow-y: scroll;
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
