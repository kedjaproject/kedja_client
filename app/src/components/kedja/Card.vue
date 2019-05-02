<template>
  <div class="Card" :class="{
    'selected': card.states.selected,
    'selectedConnectedOther': card.states.selectedConnected == false,
    'connected': connected,
    'canConnect': canConnect,
    'connectedOther': card.states.connected == false,
    'connecting': card.states.connecting
    }" @mouseenter="setHovering(true)" @mouseleave="setHovering(false)">

    <div class="main" @click="clicked">
      <h4>{{card.data.title}}</h4>
      <pre>
        {{card.states}}
      </pre>
      {{connectedCardIds}}
    </div>

    <!--EditableInput v-model="card.name" tag="span" ref="input-name" class="cardName" @click="focusAndSelect()"></EditableInput-->

    <!--button class="remove" v-if="hovering" @click="removeCard">
      Ta bort kort
    </button-->

    <div v-if="card.states.selected" class="selectedButtons">
      <card-button></card-button>
      <card-button></card-button>
      <card-button @click.native="toggleConnecting($event)" :active="card.states.connecting"></card-button>
    </div>

  </div>
</template>

<script>

import { store } from '@/store';
import EditableInput from '@/components/general/EditableInput'
import CardButton from './CardButton'

export default {
  name: 'Card',
  components: {
    EditableInput,
    CardButton
  },
  data () {
    return {
      hovering: false
    }
  },
  props: {
    card: ""
  },
  computed: {
    selected: function () {
      return this.card.states.selected == true;
    },
    connections: function () {
      return store.getters.getDeepConnectionsByCardId(this.card.rid)
    },
    connectedCardIds: function () {
      let arr = []
      this.connections.forEach((conn, iConn) => {
        if(conn.members[0] != this.card.rid){
          if(arr.indexOf(conn.members[0]) == -1){
            arr.push(conn.members[0])
          }
        }
        if(conn.members[1] != this.card.rid){
          if(arr.indexOf(conn.members[1]) == -1){
            arr.push(conn.members[1])
          }
        }
      })
      return arr
    },
    connecting: function () {
      return this.card.states.connecting == true;
    },
    connected: function () {
      return this.card.states.connectingCanConnect && this.card.states.connected;
    },
    canConnect: function () {
      return this.card.states.connectingCanConnect && !this.card.states.connected
    }
  },
  methods: {
    clicked: function () {
      if(this.connecting){
        this.toggleConnecting()
      }
      if(this.canConnect){
        this.connect()
      }
      if(this.connected){
        this.unconnect()
      }
      else{
        this.setSelected()
      }
    },
    setHovering: function (flag){
      /*this.hovering = flag;
      if(flag){
        store.commit('setCardsState',{cardIds: this.connectedCardIds, stateName: "connected"});
        store.commit('setDeepConnectionsByCardId',{id: this.card.id});
      }
      else{
        store.commit('resetCardsState',{stateName: "connected"});
        store.commit('resetConnections');
      }*/
    },
    setSelected: function (e){
      //if(e.srcElement == this.$el){
        if(!this.selected){

          //connection
          store.commit('setDeepConnectionsByCardId',{id: this.card.rid});

          //selection
          store.commit('setCardState',{card: this.card, stateName: "selected", stateFlag: true});
          store.commit('setCardsState',{cardIds: [this.card.rid], stateName: "selected", stateFlag: false, invertCollection: true});

          store.commit('setCardsState',{cardIds: this.connectedCardIds, stateName: "selectedConnected", stateFlag: true});
        }
        else{
          //connection

          store.commit('resetConnections');

          //selection
          store.commit('resetCardsState',{stateName: "selected"});
          store.commit('resetCardsState',{stateName: "connected"});
          //store.commit('resetCardsState',{stateName: "selectedConnected"});
        }
      //}
    },
    toggleConnecting: function (e){
      console.log("connecting " + this.connecting)
      if(!this.connecting){

        store.commit('setCardState',{card: this.card, stateName: "connecting", stateFlag: true});

        let cousins = store.getters.getClosestCardCousins(this.card)
        store.commit('setCardsState',{cards: store.getters.getClosestCardCousins(this.card), stateName: "canConnect", stateFlag: true});
        store.commit('setCardsState',{cards: store.getters.getClosestCardCousins(this.card), stateName: "canConnect", stateFlag: false, invertCollection: true});

      }
      else{
        store.commit('resetCardsState',{stateName: "connecting"});
        store.commit('resetCardsState',{stateName: "canConnect"});
        //store.commit('resetCardsState',{stateName: "connectingCanConnect"});
      }
    },
    connect: function () {
      let connectingCard = store.getters.getCardsByState('connecting')[0]
      store.commit('createConnection',{card0: connectingCard, card1: this.card});
    },
    unconnect: function () {
      let connectingCard = store.getters.getCardsByState('connecting')[0]
      store.commit('removeConnection',{card0: connectingCard, card1: this.card});
    },
    removeCard: function () {
      this.$emit('removeCard',this.card)
    },
  },
  created: function () {
    store.commit('initCard',this.card);
  },
  mounted: function () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Card{
  /*border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;*/
  background: #FFFFFF;
  transition: all 0.25s;
  display: inline-block;
  position: relative;
  background-clip: padding-box !important;
  margin-bottom: 10px;
}

.main{
  padding: 15px;
  cursor: pointer;
}

.selectedButtons{
  padding: 5px;
  background: rgb(245,245,245);
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.selectedButtons * {
  margin: 1px;
}

.cardName{
  font-size: 1.2em;
}

.remove{
  position: absolute;
  top: 5px;
  right: 5px;
}

.selected{
  background: white;
  /*border: 3px solid #FFEF29;*/
}

.selectedConnectedOther:not(.selected){
}

.connected{
  background: green;
}

.connectedOther:not(:hover){
  /*filter: opacity(0.25);*/
}

.connecting, .connected{
  border: 5px solid yellow;
}

.canConnect{
  box-shadow: 5px 5px 2px black;
}

textarea{
  width: 100%;
  box-sizing: border-box;
}




</style>
