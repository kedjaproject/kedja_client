<template>
  <div class="Collection" v-drag-and-drop:options="dndOptions">

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

      <ul @reordered="reordered">
      <!-- FIXME: This breaks sometimes, so don't read transitions until they really work. -->
      <!--<transition-group name="fade" mode="out-in" class="cards">-->
        <li :data-id="card.rid" v-for="card in cards" :key="card.rid">
          <card :card="card" :id="card.rid" :collection="collection" tabindex="0"></card>
        </li>
      <!--</transition-group>-->
      </ul>

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

import { kedjaAPI, eventBus } from '@/utils'
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
      showCardSeed: false,
      dndOptions: {
        showDropzoneAreas: true,
        multipleDropzonesItemsDraggingEnabled: false,
        onDragstart: event => {
          if (this.dndPrevented) {
            event.stop()
          }
        }
      }
    }
  },
  computed: {
    cards () {
      return this.getList(this.collection.cardList)
    },
    dndPrevented () {
      return this.filterCards && this.userState.data.rid
    },
    cardsFiltered () {
      if (this.userState.name === 'default') {
        return this.cards
      } else if (this.userState.name === 'selectCard') {
        // return this.cards.filter(card => card.states.selected || card.states.selectingConnected)
      }
      return this.cards
    },
    newDisabled () {
      return this.userState.name === 'connectCard'
    },
    ...mapGetters('walls/cards', ['getList', 'getCardsByState']),
    ...mapState(['userState', 'filterCards'])

  },
  props: {
    collection: Object,
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
    reordered (event) {
      if (this.dndPrevented) {
        return
      }
      const cardId = Number(event.detail.ids[0])
      let order = [...this.collection.cardList]
      const oldIndex = order.indexOf(cardId)
      // Do not allow card index higher than last index
      const index = Math.min(event.detail.index, order.length - 1)
      if (index !== oldIndex) {
        order.splice(oldIndex, 1)
        order.splice(index, 0, cardId)
        this.setCardOrder({
          collection: this.collection,
          order
        })
      }
    },
    removeCollection () {
      this.$store.dispatch('walls/collections/removeCollection', {wall: this.wall, collection: this.collection})
    },
    initCreateCard () {
      this.showCardSeed = true
      // Next tick: needs to be performed after re-rendering, due to hidden element
      this.$nextTick(function (input) {
        this.$refs.cardSeed.setFocus() // $el.getElementsByTagName('input')[0].focus()
      })
    },
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
    handleScroll () {
      eventBus.$emit('relationsUpdated')
    },
    ...mapActions('walls/collections', ['createCardInCollection', 'setCardOrder'])
  },
  mounted () {
    this.$refs.collectionContent.addEventListener('scroll', this.handleScroll)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">

.Collection
  /* LAYOUT */
  display: flex
  flex-direction: column

  border: 0px solid #EAEAEA
  background: #CADBDA

.collectionHeader
  padding: 20px 20px 10px 20px
  border-bottom: 1px solid white
  background: #CADBDA
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: center

.Collection:nth-child(even),
.Collection:nth-child(even) .collectionHeader,
.Collection:nth-child(even) .collectionFooter
  background: #ACCECC

.collectionContent
  padding: 40px
  flex: 1
  overflow-y: auto
  scroll-behavior: smooth
  position: relative
  ul
    padding: 0
    list-style: none
    margin: 0

.collectionFooter
  padding: 20px
  border-top: 1px solid white
  background: #CADBDA

.cards
  display: flex
  flex-direction: column
  position: relative

.remove
  position: absolute
  top: 5px
  right: 5px
</style>
