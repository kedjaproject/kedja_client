<template>
  <div class="Card" @click.stop="clicked(); scrollIntoView();" @keyup.self.delete="removeCard" :class="{
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
      <card-button :placeholder="true"></card-button>

      <indicator v-model="card.data.int_indicator" @change="updateIndicatorValue" :selected="card.states.selected" @click.stop></indicator>

      <card-button @click.native.stop="toggleConnecting(); scrollIntoView();">
        <widget-icon path="/static/graphics/icons/link/" img="KEDJA_Koppling.png" imgHover="KEDJA_Koppling, hover.png" imgActive="KEDJA_Koppling, igang.png" :active="card.states.connecting"></widget-icon>
      </card-button>

    </div>

    <div class="main">

      <!--h4 v-if="!selected">{{card.data.title}}</h4-->
      <!--EditableInput v-model="card.data.title" tag="h3" ref="input-name" @change="updateTitle($event)"></EditableInput-->
      <EditableInput v-model="card.data.title" tag="h3" :placeholder="'Namnge kort'" @change="updateTitle($event)" @init-edit="initUpdateTitle" @click.stop class="indicator" :locked="titleLocked"></EditableInput>
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

    <div class="bottom">
      <card-button v-if="removeVisible" @click.native.stop="removeCard(card)">
        <widget-icon path="/static/graphics/icons/bin/" img="KEDJA_Papperskorg.png" imgHover="KEDJA_Papperskorg, hover.png"></widget-icon>
      </card-button>
    </div>

  </div>
</template>

<script>

import { mapGetters, mapState, mapActions } from 'vuex'

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
  data () {
    return {
      initiated: false
    }
  },
  props: {
    card: Object,
    prid: Number
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
    indicatorValue () {
      return this.card.data.int_indicator
    },
    removeVisible () {
      return this.card.states.selected
    },
    titleLocked () {
      return this.userState.name === 'connectCard'
    },
    ...mapGetters('walls', ['getDeepConnectionsByCardId', 'getDirectConnectionsByCardId', 'getClosestCardCousins']),
    ...mapState('walls/cards', ['cards']),
    ...mapState(['userState'])
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
            this.setState('selected', true)
          } else { // Unless this is the card the user is interacting with
            if (this.deepConnectedCardIds.indexOf(s.data.rid) !== -1) { // if card is connected
              this.setState('selectingConnected', true)
            } else { // if card is not connected
              this.setState('selectingNotConnected', true)
            }
          }
        }

        // connectCard
        if (s.name === 'connectCard') {
          // this.$store.commit('setCardState',{card: this.card, stateName: "selected", stateFlag: true})
          if (s.data.rid === this.card.rid) { // If this is the card the user is interacting with
            this.setState('selected', true)
            this.setState('connecting', true)
          } else { // Unless this is the card the user is interacting with
            if (this.directConnectedCardIds.includes(s.data.rid)) { // if card is connected
              this.setState('connectingConnected', true)
            } else { // if card is not connected
              let cousins = this.getClosestCardCousins(this.card)
              if (cousins.find(c => c.rid === s.data.rid)) { // If not connected and the cards are closest cousins
                this.setState('connectingNotConnected', true)
              } else {
                this.setState('connectingCantConnect', true)
              }
            }
          }
        }
      }
    }
  },
  methods: {
    setState (name, flag) {
      this.card.states[name] = flag
    },
    resetStates () {
      this.card.states = {}
    },
    resetState (name) {
      this.card.states[name] = undefined
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
      }
      if (this.card.states.connectingConnected) {
        this.unconnect()
      }
      // this.$store.commit('forceUserStateUpdate')
    },
    scrollIntoView () {
      // this.$el.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    },
    setSelected (e) {
      if (!(this.userState.name === 'selectCard' && this.userState.data.rid === this.card.rid)) {
        this.$store.commit('setUserState', {name: 'selectCard', data: {rid: this.card.rid}})
      } else {
        this.$store.commit('resetUserState')
      }
    },
    toggleConnecting () {
      if (!this.card.states.connecting) {
        this.$store.commit('setUserState', {name: 'connectCard', data: {rid: this.card.rid}})
      } else {
        this.$store.commit('setUserState', {name: 'selectCard', data: {rid: this.card.rid}})
      }
    },
    connect: function () {
      let cardOther = this.cards[this.userState.data.rid]
      console.log('Connect', cardOther)
      this.$emit('connect', {members: [cardOther.rid, this.card.rid]})
    },
    unconnect () {
      let cardOther = this.cards[this.userState.data.rid]
      console.log('Unconnect', cardOther)
      this.$emit('unconnect', {members: [cardOther.rid, this.card.rid]})
    },
    initUpdateTitle () {
      console.log('Börja byt namn på kort')
      this.$store.commit('setUserState', {name: 'renameCard', data: {rid: this.card.rid}})
    },
    updateTitle (title) {
      kedjaAPI.put('collections/' + this.prid + '/cards/' + this.card.rid, {title})
        .then(response => console.log(response))
    },
    updateIndicatorValue (value) {
      kedjaAPI.put('collections/' + this.prid + '/cards/' + this.card.rid, {int_indicator: value})
        .then(response => {
          // this.card.data.int_indicator = value
        })
      // console.log(value)
    },
    setFocus () {
      this.$el.focus()
    },
    ...mapActions('walls/collections', ['removeCard'])
  },
  created: function () {
    // Do when loading data instead.
    // this.$store.commit('initCard', this.card)
  },
  mounted: function () {
    // this.setFocus()
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
