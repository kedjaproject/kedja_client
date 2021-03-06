<template>
  <div class="Collection" v-drag-and-drop:options="dndOptions">

    <div class="collectionHeader z1">

      <span><!-- for spacing of objects --></span>

      <EditableInput v-if="isEditor" v-model="collection.data.title" tag="h2" @change="updateTitle($event)"></EditableInput>
      <h2 v-else>{{ collection.data.title }}</h2>

      <drop-down v-if="isEditor" :items="[{label: 'Radera samling', f: removeCollection}]">
        <card-button>
          <widget-icon path="/static/graphics/icons/dropdown/" img="KEDJA-14.png" imgHover="KEDJA-15.png"></widget-icon>
        </card-button>
      </drop-down>
      <span v-else></span>

    </div>

    <div class="collectionContent" ref="collectionContent">

      <ul @reordered="reordered" class="dropzone">
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

    <div v-if="isEditor" class="collectionFooter z1">
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
          } else {
            // Ugly. Delay to avoid css "display: none" on dragged card
            setTimeout(() => {
              event.owner.classList.add('dragging')
            }, 100)
          }
        },
        onDragend: event => {
          event.owner.classList.remove('dragging')
        }
      }
    }
  },
  computed: {
    cards () {
      return this.getList(this.collection.cardList)
    },
    isEditor () {
      return this.checkPermission(this.wall.rid, 'Wall:Edit')
    },
    dndPrevented () {
      if (!this.isEditor) {
        return true
      }
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
    ...mapState(['userState', 'filterCards']),
    ...mapGetters('permissions', ['checkPermission'])
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
      const currentIndex = order.indexOf(cardId)
      let newIndex = event.detail.index
      if (newIndex > currentIndex) {
        newIndex = newIndex - 1
      }
      if (newIndex !== currentIndex) {
        order.splice(currentIndex, 1)
        order.splice(newIndex, 0, cardId)
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
<style lang="sass">

.Collection
  /* LAYOUT */
  display: flex
  flex-direction: column

  border: 0px solid #EAEAEA
  background: #CADBDA

  .dragging
    min-height: 98%
    .item-dropzone-area
      height: 116px
      background-color: rgba(#fff, .4)
      margin-bottom: 10px

    [aria-grabbed="true"]
      display: none

  .collectionHeader
    padding: 20px 20px 10px 20px
    border-bottom: 1px solid white
    background: #CADBDA
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: center
    h2
      margin: 0

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
