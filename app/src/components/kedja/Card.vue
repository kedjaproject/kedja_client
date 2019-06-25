<template>
  <div class="Card" :class="{
    'selected': card.states.selected,
    'selectedConnectedOther': card.states.selectedConnected == false,
    'connected': card.states.connected,
    'canConnect': card.states.canConnect,
    'cannotConnect': canConnect == false && !connecting,
    'connectedOther': card.states.connected == false,
    'connecting': connecting
    }" @mouseenter="setHovering(true)" @mouseleave="setHovering(false)">

    <div class="main" @click.capture="clicked">

      <!--h4 v-if="!selected">{{card.data.title}}</h4-->
      <!--EditableInput v-model="card.data.title" tag="h3" ref="input-name" @change="updateTitle($event)"></EditableInput-->
      <h3>
        {{card.data.title}}
      </h3>
      <!--span>{{card.rid}}</span-->
      <!--pre>
        {{card.states}}
      </pre-->
      <!--pre>
        {{connectedCardIds}}
      </pre-->
    </div>

    <!--button class="remove" v-if="hovering" @click="removeCard">
      Ta bort kort
    </button-->

    <div v-if="card.states.selected" class="selectedButtons">
      <!--card-button @click.native="removeCard()">🗑️</card-button-->
      <card-button @click.native="toggleConnecting($event)" :active="card.states.connecting">🔗</card-button>
    </div>

  </div>
</template>

<script>

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
    card: "",
    prid: ""
  },
  computed: {
    userState: function () {
      return this.$store.getters.getUserState;
    },
    selected: function () {
      //return this.card.states.selected == true;
      return this.userState.name == 'selectCard' && this.userState.data.rid == this.card.rid
    },
    selectedConnected: function () {
      return this.card.states.selectedConnected == true;
    },
    connections: function () {
      //return this.$store.getters.getDeepConnectionsByCardId(this.card.rid)
      return this.$store.getters.getDirectConnectionsByCardId(this.card.rid)
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
      //return this.card.states.connecting == true;
      return this.userState.name == 'connectCard' && this.userState.data.rid == this.card.rid
    },
    connected: function () {
      return false;//this.card.states.canConnect && this.card.states.connected;
    },
    canConnect: function () {
      return this.card.states.canConnect
    }
  },
  watch: {
    userState: {
      deep: true,
      handler: function (s) {

        //default
        //if(s.name == 'default'){
          //this.$store.commit('resetCardState',{card: this.card});
          this.resetStates()
        //}

        //selectCard
        if(s.name == 'selectCard' && s.data.rid == this.card.rid){
          //this.$store.commit('setCardState',{card: this.card, stateName: "selected", stateFlag: true});
          this.setState("selected",true)
        }

        //connectCard
        if(s.name == 'connectCard'){
          //this.$store.commit('setCardState',{card: this.card, stateName: "selected", stateFlag: true});
          if(s.data.rid == this.card.rid){ //If this is the card the user is interacting with
            this.setState("selected",true)
            this.setState("connecting",true)
          }
          else{ //Unless this is the card the user is interacting with
            if(this.connectedCardIds.indexOf(s.data.rid) != -1){
              this.setState("connected",true)
            }
            else{
              let cousins = this.$store.getters.getClosestCardCousins(this.card)
              if(cousins.find(c => c.rid == s.data.rid)){ //If not connected and the cards are closest cousins
                this.setState("canConnect",true)
              }
            }
          }

        }

      }
    }
  },
  methods: {
    setState: function (name,flag) {
      this.card.states[name] = flag;
    },
    resetStates: function () {
      this.card.states = {}
    },
    resetState: function (name) {
      this.card.states[name] = undefined;
    },
    clicked: function () {

      if(this.userState.name != "connectCard"){
        this.setSelected()
      }
      if(this.card.states.connecting){
        this.setSelected()
      }
      if(this.card.states.canConnect){
        this.connect()
      }
      if(this.card.states.connected){
        this.unconnect()
      }

      //this.$store.commit('forceUserStateUpdate');

    },
    setHovering: function (flag){
      /*this.hovering = flag;
      if(flag){
        this.$store.commit('setCardsState',{cardIds: this.connectedCardIds, stateName: "connected"});
        this.$store.commit('setDeepConnectionsByCardId',{id: this.card.id});
      }
      else{
        this.$store.commit('resetCardsState',{stateName: "connected"});
        this.$store.commit('resetConnections');
      }*/
    },
    setSelected: function (e){
      //if(e.srcElement == this.$el){
        if(!this.selected){

          //User states
          this.$store.commit('setUserState',{name: "selectCard", data: {rid: this.card.rid}});

          /*
          //connection
          this.$store.commit('setDeepConnectionsByCardId',{id: this.card.rid});

          //selection
          this.$store.commit('setCardState',{card: this.card, stateName: "selected", stateFlag: true});
          this.$store.commit('setCardsState',{cardIds: [this.card.rid], stateName: "selected", stateFlag: false, invertCollection: true});

          this.$store.commit('setCardsState',{cardIds: this.connectedCardIds, stateName: "selectedConnected", stateFlag: true});

          //Unset states
          this.$store.commit('resetCardsState',{stateName: "connecting"});
          this.$store.commit('resetCardsState',{stateName: "canConnect"});
          */
        }
        else{
          //User states
          this.$store.commit('resetUserState');

          /*
          //connection
          this.$store.commit('resetConnections');

          //selection
          //this.$store.commit('resetCardsState',{stateName: "selected"});
          this.$store.commit('resetCardsState',{stateName: "connected"});
          //this.$store.commit('resetCardsState',{stateName: "selectedConnected"});
          */
        }
      //}
    },
    toggleConnecting: function (e){
      console.log("connecting " + this.connecting)
      if(!this.connecting){

        //User states
        this.$store.commit('setUserState',{name: "connectCard", data: {rid: this.card.rid}});

        /*
        this.$store.commit('setCardState',{card: this.card, stateName: "connecting", stateFlag: true});

        let cousins = this.$store.getters.getClosestCardCousins(this.card)
        this.$store.commit('setCardsState',{cards: this.$store.getters.getClosestCardCousins(this.card), stateName: "canConnect", stateFlag: true});
        this.$store.commit('setCardsState',{cards: this.$store.getters.getClosestCardCousins(this.card), stateName: "canConnect", stateFlag: false, invertCollection: true});
        */

      }
      else{
        /*
        this.$store.commit('resetCardsState',{stateName: "connecting"});
        this.$store.commit('resetCardsState',{stateName: "canConnect"});
        //this.$store.commit('resetCardsState',{stateName: "connectingCanConnect"});
        */
        //User states
        this.$store.commit('setUserState',{name: "selectCard", data: {rid: this.card.rid}});
      }
    },
    connect: function () {
      console.log("Connect")
      let cardOther = this.$store.getters.getCardsByState('connecting')[0]
      this.$emit('connect',{members: [cardOther.rid, this.card.rid]})
    },
    unconnect: function () {
      console.log("Unconnect")
      let cardOther = this.$store.getters.getCardsByState('connecting')[0]
      this.$emit('unconnect',{members: [cardOther.rid, this.card.rid]})
    },
    removeCard: function () {
      this.$emit('removeCard',this.card)
    },
    updateTitle: function (title) {
      let params = {
        endpoint: "collections/" + this.prid + "/cards/" + this.card.rid,
        data: {title: title},
        method: "put",
        successCallback: (data) => {
          console.log(data.data)
        },
      }

      this.$store.commit('makeAPICall',params);
    }
  },
  created: function () {
    this.$store.commit('initCard',this.card);
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
  /*transition: all 0.1s;*/
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

.remove{
  position: absolute;
  top: 5px;
  right: 5px;
}

.selected{
  border: 5px solid #ffdc27;
  outline: 0;
}

.connecting, .connected{
  border: 5px solid salmon;
}

.canConnect{
  border: 5px solid forestgreen;
}

.cannotConnect{
  /*filter: opacity(0.5);*/
}

textarea{
  width: 100%;
  box-sizing: border-box;
}

</style>
