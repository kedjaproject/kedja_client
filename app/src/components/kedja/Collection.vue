<template>
  <div class="Collection">

    <div class="collectionHeader z1">

      <drop-down :items="[{label: 'Radera samling', f: removeCollection}]">
        <EditableInput v-model="collection.data.title" tag="h2" @change="updateTitle($event)"></EditableInput> &#9663;
      </drop-down>

      <!--EditableInput v-model="collection.data.title" tag="h3" @change="updateTitle($event)"></EditableInput-->
      <!--{{collection.rid}}-->

      <!--button @click="removeCollection" title="Ta bort samling">
        🗑️
      </button-->

    </div>

    <div class="collectionContent" ref="collectionContent">

      <transition-group name="fade" mode="out-in" class="cards">
        <card v-for="card in cards" :card="card" @removeCard="removeCard" @connect="connect" @unconnect="unconnect" :key="card.rid" :id="card.rid" :prid="collection.rid" tabindex="0"></card>
      </transition-group>

      <transition name="fade"  mode="out-in">
        <card-seed @create="createCard" @cancel="cancelCardSeed" ref="cardSeed" tabindex="0" v-if="showCardSeed"></card-seed>
      </transition>

    </div>

    <div class="collectionFooter z1">
      <button class="fullWidth" @click="initCreateCard" title="Lägg till nytt kort">+ Nytt kort</button>
    </div>

  </div>
</template>

<script>

import DropDown from '@/components/DropDown'
import Card from './Card'
import CardSeed from './CardSeed'
import EditableInput from '@/components/general/EditableInput'
import { makeAPICall } from '@/utils'

export default {
  name: 'Collection',
  components: {
    DropDown,
    Card,
    CardSeed,
    EditableInput
  },
  data () {
    return {
      hovering: false,
      showCardSeed: false
      // cards: ''
    }
  },
  computed: {
    cards () {
      return this.collection.cards
    },
    cardsFiltered: function () {
      return this.cards // .filter(card => card.states.selected != false || card.states.selectedConnected != false)
    }
  },
  props: {
    collection: '',
    prid: ''
  },
  /*
  watch: {
    collection: function () {
      this.getCardsFromAPI()
    }
  },
  */
  methods: {
    removeCollection: function () {
      this.$emit('removeCollection', this.collection)
    },
    getCardsFromAPI () {
      makeAPICall('collections/' + this.collection.rid + '/cards')
        .then(response => {
          // this.cards = response.data;
          this.$store.commit('setCollectionCards', {collection: this.collection, cards: response.data})
        })
    },
    initCreateCard () {
      this.showCardSeed = true
      // Next tick: needs to be performed after re-rendering, due to hidden element
      this.$nextTick(function (input) {
        this.$refs.cardSeed.setFocus() // $el.getElementsByTagName('input')[0].focus()
      })
    },
    createCard (title) {
      // this.$store.commit('createCardInCollection',{collection: this.collection})
      makeAPICall('collections/' + this.collection.rid + '/cards', {title}, 'post')
        .then(response => {
          this.cards.push(response.data)
          document.activeElement.blur()
          this.initCreateCard()
        })
    },
    cancelCardSeed () {
      this.showCardSeed = false
    },
    removeCard (card) {
      // this.$store.commit('removeCardFromCollection',{collection: this.collection, card: card})
      makeAPICall('collections/' + this.collection.rid + '/cards/' + card.rid, {}, 'delete')
        .then(response => {
          console.log(response)

          let index = this.collection.cards.indexOf(card)
          if (index !== -1) {
            this.collection.cards.splice(index, 1)
          }
        })
    },
    updateTitle (title) {
      makeAPICall('walls/' + this.collection.rid + '/collections/' + this.collection.rid, {title}, 'put')
        .then(response => {
          console.log(response)
        })
    },
    connect (params) {
      this.$emit('connect', params)
    },
    unconnect (params) {
      this.$emit('unconnect', params)
    },
    handleScroll () {
      this.$store.commit('setDirtyDraw')
    }
  },
  created () {
    this.$store.commit('initCollection', this.collection)
  },
  mounted () {
    this.getCardsFromAPI()

    this.$refs.collectionContent.addEventListener('scroll', this.handleScroll)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Collection{

  /* LAYOUT */
  display: flex;
  flex-direction: column;

  border: 0px solid #EAEAEA;
  background: #CADBDA;
  /*position: relative;*/
}

.collectionHeader{
  padding: 10px 20px 10px 20px;
  border-bottom: 1px solid white;
  background: #CADBDA;
}

.Collection:nth-child(even),
.Collection:nth-child(even) .collectionHeader,
.Collection:nth-child(even) .collectionFooter
{
  background: #ACCECC;
}

.collectionContent{
  padding: 30px;
  flex: 1;
  overflow-y: scroll;
  scroll-behavior: smooth;
}

.collectionFooter{
  padding: 20px;
  border-top: 1px solid white;
  background: #CADBDA;
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
