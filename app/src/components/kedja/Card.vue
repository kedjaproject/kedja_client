<template>
  <div class="Card" v-if="filtered" @click.stop="clicked(); scrollIntoView();" @keyup.self.delete="removeCard(card)" :class="{
    'selected': card.states.selected,
    'selectingConnected': card.states.selectingConnected,
    'selectingNotConnected': card.states.selectingNotConnected,
    'selectedConnectedOther': card.states.selectedConnected == false,
    'connectingConnected': card.states.connectingConnected,
    'connectingNotConnected': card.states.connectingNotConnected,
    'connectingCantConnect': card.states.connectingCantConnect,
    'cannotConnect': !this.card.states.canConnect && !this.card.states.connecting,
    'connectedOther': card.states.connected == false,
    'connecting': this.card.states.connecting
    }">

    <div class="top">

      <!--card-button :placeholder="true"></card-button-->

      <indicator v-model="card.data.int_indicator" @change="updateIndicatorValue" :selected="card.states.selected" @click.stop></indicator>

      <card-button v-if="isEditor" @click.native.stop="toggleConnecting(); scrollIntoView();">
        <widget-icon path="/static/graphics/icons/link/" img="KEDJA_Koppling.png" imgHover="KEDJA_Koppling, hover.png" imgActive="KEDJA_Koppling, igang.png" :active="card.states.connecting"></widget-icon>
      </card-button>

    </div>

    <div class="main">

      <!--h4 v-if="!selected">{{card.data.title}}</h4-->
      <!--EditableInput v-model="card.data.title" tag="h3" ref="input-name" @change="updateTitle($event)"></EditableInput-->
      <EditableInput v-if="isEditor" v-model="card.data.title" tag="h3" :placeholder="'Namnge kort'" @change="updateTitle($event)" @init-edit="initUpdateTitle" @click.stop class="indicator" :locked="titleLocked"></EditableInput>
      <h3 v-else>{{ card.data.title }}</h3>
      <!--h3>
        {{card.data.title}}
      </h3-->

      <!--h4>{{card.rid}}</h4-->
      <!--div>
        {{deepConnectedCardIds}}
      </div-->
      <!--div>
        {{card.states}}
      </div-->
    </div>

    <div v-if="isEditor" class="bottom">
      <card-button v-if="removeVisible" @click.native.stop="removeCard(card)">
        <widget-icon path="/static/graphics/icons/bin/" img="KEDJA_Papperskorg.png" imgHover="KEDJA_Papperskorg, hover.png"></widget-icon>
      </card-button>
    </div>

  </div>
</template>

<script>

import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'

import { kedjaAPI } from '@/utils'

import EditableInput from '@/components/general/EditableInput'
import CardButton from './CardButton'
import Indicator from './widgets/Indicator'
import WidgetIcon from './widgets/WidgetIcon'
import DropDown from '@/components/DropDown'

export default {
  name: 'Card',
  components: {
    EditableInput,
    CardButton,
    Indicator,
    WidgetIcon,
    DropDown
  },
  props: {
    card: Object,
    collection: Object
  },
  computed: {
    connectionsDirect () {
      return this.getDirectConnectionsByCardId(this.card.rid)
    },
    connectionsDeep () {
      return this.getDeepConnectionsByCardId(this.card.rid)
    },
    directConnectedCardIds () {
      let arr = []
      this.connectionsDirect.forEach((conn, iConn) => {
        if (conn.members[0] !== this.card.rid) {
          if (arr.indexOf(conn.members[0]) === -1) {
            arr.push(conn.members[0])
          }
        }
        if (conn.members[1] !== this.card.rid) {
          if (arr.indexOf(conn.members[1]) === -1) {
            arr.push(conn.members[1])
          }
        }
      })
      return arr
    },
    deepConnectedCardIds () {
      let arr = []
      this.connectionsDeep.forEach((conn, iConn) => {
        if (conn.members[0] !== this.card.rid) {
          if (arr.indexOf(conn.members[0]) === -1) {
            arr.push(conn.members[0])
          }
        }
        if (conn.members[1] !== this.card.rid) {
          if (arr.indexOf(conn.members[1]) === -1) {
            arr.push(conn.members[1])
          }
        }
      })
      return arr
    },
    removeVisible () {
      return this.card.states.selected
    },
    titleLocked () {
      return this.userState.name === 'connectCard'
    },
    filtered () {
      if (!this.filterCards || this.userState.name === 'default') {
        return true
      } else if (this.userState.name === 'selectCard') {
        return this.card.states.selected || this.card.states.selectingConnected
      }
      return true
    },
    isEditor () {
      return this.$parent.isEditor
    },
    ...mapGetters('walls', ['getDeepConnectionsByCardId', 'getDirectConnectionsByCardId', 'getClosestCardCousins', 'activeWall']),
    ...mapState('walls/cards', ['cards']),
    ...mapState(['userState', 'filterCards'])
  },
  watch: {
    userState: {
      deep: true,
      handler (s) {
        // default
        // if(s.name == 'default'){
        // this.$store.commit('resetCardState',{card: this.card});
        this.resetStates()
        // }

        // selectCard
        if (s.name === 'selectCard') {
          // this.$store.commit('setCardState',{card: this.card, stateName: "selected", stateFlag: true})
          if (s.data.rid === this.card.rid) { // If this is the card the user is interacting with
            this.setState('selected')
          } else { // Unless this is the card the user is interacting with
            if (this.deepConnectedCardIds.indexOf(s.data.rid) !== -1) { // if card is connected
              this.setState('selectingConnected')
            } else { // if card is not connected
              this.setState('selectingNotConnected')
            }
          }
        }

        // connectCard
        if (s.name === 'connectCard') {
          // this.$store.commit('setCardState',{card: this.card, stateName: "selected", stateFlag: true})
          if (s.data.rid === this.card.rid) { // If this is the card the user is interacting with
            this.setState('selected')
            this.setState('connecting')
          } else { // Unless this is the card the user is interacting with
            if (this.directConnectedCardIds.includes(s.data.rid)) { // if card is connected
              this.setState('connectingConnected')
            } else { // if card is not connected
              let cousins = this.getClosestCardCousins(this.card)
              if (cousins.find(c => c.rid === s.data.rid)) { // If not connected and the cards are closest cousins
                this.setState('connectingNotConnected')
              } else {
                this.setState('connectingCantConnect')
              }
            }
          }
        }
      }
    }
  },
  methods: {
    setState (name, flag = true) {
      this.setCardState({
        rid: this.card.rid,
        stateName: name,
        stateFlag: flag
      })
    },
    resetStates () {
      this.resetCardStates({ rid: this.card.rid })
    },
    resetState (name) {
      this.setCardState({
        rid: this.card.rid,
        stateName: name
      })
    },
    clicked () {
      if (this.userState.name !== 'connectCard') {
        this.setSelected()
      }
      if (this.card.states.connecting) {
        this.setSelected()
      }
      if (this.card.states.connectingNotConnected) {
        this.connect()
      } else if (this.card.states.connectingConnected) {
        this.disconnect()
      }
    },
    scrollIntoView () {
      // this.$el.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    },
    setSelected (e) {
      if (!(this.userState.name === 'selectCard' && this.userState.data.rid === this.card.rid)) {
        this.setUserState({name: 'selectCard', data: {rid: this.card.rid}})
      } else {
        this.resetUserState()
      }
    },
    toggleConnecting () {
      if (!this.card.states.connecting) {
        this.setUserState({name: 'connectCard', data: {rid: this.card.rid}})
      } else {
        this.setUserState({name: 'selectCard', data: {rid: this.card.rid}})
      }
    },
    connect: function () {
      this.resetStates()
      this.setState('connectingConnected')
      this.createRelation({
        wall: this.activeWall,
        cards: [this.card, this.cards[this.userState.data.rid]]
      })
    },
    disconnect () {
      this.resetStates()
      this.setState('connectingNotConnected')
      const cards = [this.card, this.cards[this.userState.data.rid]]
      const relation = this.activeWall.relations.find(r => {
        return (r.members[0] === cards[0].rid && r.members[1] === cards[1].rid) ||
               (r.members[0] === cards[1].rid && r.members[1] === cards[0].rid)
      })
      if (relation) {
        this.deleteRelation({
          wall: this.activeWall,
          relation
        })
      } else {
        console.log('no relation found for cards', cards)
      }
    },
    initUpdateTitle () {
      console.log('Börja byt namn på kort')
      this.setUserState({name: 'renameCard', data: {rid: this.card.rid}})
    },
    updateTitle (title) {
      kedjaAPI.put('collections/' + this.collection.rid + '/cards/' + this.card.rid, {title})
        .then(response => console.log(response))
    },
    updateIndicatorValue (value) {
      kedjaAPI.put('collections/' + this.collection.rid + '/cards/' + this.card.rid, {int_indicator: value})
        .then(response => {
          this.setCard(response.data)
        })
    },
    setFocus () {
      this.$el.focus()
    },
    ...mapActions('walls', ['createRelation', 'deleteRelation']),
    ...mapActions('walls/collections', ['removeCard']),
    ...mapMutations('walls/cards', ['setCardState', 'resetCardStates', 'setCard']),
    ...mapMutations(['setUserState', 'resetUserState'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Card{
  /*border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;*/
  background: #FFFFFF;
  border: 5px solid transparent;
  /*transition: all 0.1s;*/
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  cursor: pointer;
}

h3{
  margin-top: 0;
}

.top{
  flex: 1 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.top *{

}

.indicatorContainer{
  text-align: center;
  flex: 1;
}

.linkContainer {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.main{
  flex: 1;
  padding: 10px;
}

.bottom{
  flex: 1 0 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  min-height: 30px;
}

.selectedButtons * {
  margin: 1px;
}

.remove{
  position: absolute;
  top: 5px;
  right: 5px;
}

.selected{
  border: 5px solid #ffdc27;
  outline: 0;
}

.selectingConnected {
}

.selectingNotConnected {
  filter: opacity(0.3);
}

.connecting{
  border: 5px solid #ffdc27;
  background: lightyellow;
  outline: 0;
}

.connectingConnected{
  border: 5px solid #ffdc27;
}

.connectingNotConnected{
}

.connectingCantConnect{
  filter: opacity(0.3);
}

.cannotConnect{
  /*filter: opacity(0.5);*/
}

textarea{
  width: 100%;
  box-sizing: border-box;
}

</style>
