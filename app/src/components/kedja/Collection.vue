<template>
  <div class="Collection">

    <div class="collectionHeader z1">

      <span></span>

      <EditableInput v-model="collection.data.title" tag="h2" @change="updateTitle($event)"></EditableInput>

      <drop-down :items="[{label: 'Radera samling', f: removeCollection}]">
        <card-button>
          <widget-icon path="/static/graphics/icons/dropdown/" img="KEDJA-14.png" imgHover="KEDJA-15.png"></widget-icon>
        </card-button>
      </drop-down>

    </div>

    <div class="collectionContent" ref="collectionContent">

      <transition-group name="fade" mode="out-in" class="cards">
        <card v-for="card in cards" :card="card" @connect="connect" @unconnect="unconnect" :key="card.rid" :id="card.rid" :prid="collection.rid" tabindex="0"></card>
      </transition-group>

      <transition name="fade"  mode="out-in">
        <card-seed @create="createCard" @cancel="cancelCardSeed" ref="cardSeed" tabindex="0" v-if="showCardSeed"></card-seed>
      </transition>

    </div>

    <div class="collectionFooter z1">
      <button class="fullWidth" @click="initCreateCard" title="Lägg till nytt kort" :disabled="newDisabled">+ Nytt kort</button>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

import { kedjaAPI } from '@/utils'
import DropDown from '@/components/DropDown'
import Card from './Card'
import CardSeed from './CardSeed'
import EditableInput from '@/components/general/EditableInput'
import CardButton from './CardButton'
import WidgetIcon from './widgets/WidgetIcon'

export default {
  name: 'Collection',
  components: {
    DropDown,
    Card,
    CardSeed,
    EditableInput,
    CardButton,
    WidgetIcon
  },
  data () {
    return {
      hovering: false,
      showCardSeed: false
    }
  },
  computed: {
    cards () {
      return this.getList(this.collection.cardList)
    },
    cardsFiltered () {
      if (this.userState.name === 'default') {
        return this.cards
      }
      else if (this.userState.name === 'selectCard') {
        // return this.cards.filter(card => card.states.selected || card.states.selectingConnected)
      }
      return this.cards
    },
    newDisabled () {
      return this.userState.name === 'connectCard'
    },
    ...mapGetters('walls/cards', ['getList']),
    ...mapGetters('walls/cards', ['getCardsByState']),
    ...mapState(['userState']),
    ...mapState(['filterCards'])

  },
  props: {
    collection: Object,
    prid: Number,
    wall: Object
  },
  watch: {
    userState: function (us) {
      if (us.name === 'selectCard' /* || us.name == 'connectCard' */) {
        this.$nextTick(() => {
          let els = this.$el.getElementsByClassName('selected')
          if (els.length === 0) {
            els = this.$el.getElementsByClassName('selectingConnected')
          }
          /*
          if(els.length == 0){
            els = this.$el.getElementsByClassName('connectingConnected');
          }
          */
          if (els.length > 0) {
            this.$refs.collectionContent.scrollTo({
              top: els[0].offsetTop - 10,
              behavior: 'smooth'
            })
            // els[0].scrollIntoView({behavior: "smooth", block: "center"})
          }
        })
      }
    }
  },
  methods: {
    removeCollection () {
      this.$store.dispatch('walls/collections/removeCollection', {wall: this.wall, collection: this.collection})
    },
    /*
    getCardsFromAPI () {
      kedjaAPI.get('collections/' + this.collection.rid + '/cards')
        .then(response => {
          // this.cards = response.data;
          this.$store.commit('setCollectionCards', {collection: this.collection, cards: response.data})
        })
    },
    */
    initCreateCard () {
      this.showCardSeed = true
      // Next tick: needs to be performed after re-rendering, due to hidden element
      this.$nextTick(function (input) {
        this.$refs.cardSeed.setFocus() // $el.getElementsByTagName('input')[0].focus()
      })
    },
    /*
    createCard (title) {
      // this.$store.commit('createCardInCollection',{collection: this.collection})
      kedjaAPI.post('collections/' + this.collection.rid + '/cards', {title})
        .then(response => {
          this.addCard({collection: this.collection, card: response.data}) // Walls/collections
          document.activeElement.blur()
          this.initCreateCard()
        })
    },
    */
    createCard (title) {
      this.createCardInCollection({collection: this.collection, title})
        .then(() => {
          document.activeElement.blur()
          this.initCreateCard()
        })
    },
    cancelCardSeed () {
      this.showCardSeed = false
    },
    updateTitle (title) {
      kedjaAPI.put('walls/' + this.collection.rid + '/collections/' + this.collection.rid, {title})
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
    },
    ...mapActions('walls/collections', ['createCardInCollection'])
  },
  created () {
    this.$store.commit('initCollection', this.collection)
  },
  mounted () {
    // this.getCardsFromAPI()

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
  padding: 20px 20px 10px 20px;
  border-bottom: 1px solid white;
  background: #CADBDA;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.Collection:nth-child(even),
.Collection:nth-child(even) .collectionHeader,
.Collection:nth-child(even) .collectionFooter
{
  background: #ACCECC;
}

.collectionContent{
  padding: 40px;
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  position: relative;
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
