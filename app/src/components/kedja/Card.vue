<template>
  <div class="Card" @click.stop="clicked" :class="{
    'selected': card.states.selected,
    'selectingConnected': card.states.selectingConnected,
    'selectingNotConnected': card.states.selectingNotConnected,
    'selectedConnectedOther': card.states.selectedConnected == false,
    'connectingConnected': card.states.connectingConnected,
    'connectingNotConnected': card.states.connectingNotConnected,
    'connectingCantConnect': card.states.connectingCantConnect,
    'cannotConnect': canConnect == false && !connecting,
    'connectedOther': card.states.connected == false,
    'connecting': connecting
    }">

    <div class="top">
      <card-button @click.native.stop="toggleConnecting" :active="card.states.connecting">🔗</card-button>
    </div>

    <div class="main">

      <!--h4 v-if="!selected">{{card.data.title}}</h4-->
      <!--EditableInput v-model="card.data.title" tag="h3" ref="input-name" @change="updateTitle($event)"></EditableInput-->
      <h3>
        {{card.data.title}}
      </h3>
      <!--h4>{{card.rid}}</h4-->
      <!--div>
        {{deepConnectedCardIds}}
      </div-->
      <!--div>
        {{card.states}}
      </div-->
    </div>

    <div class="bottom">

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
    card: '',
    prid: ''
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
      return this.card.states.selectedConnected == true
    },
    connectionsDirect: function () {
      return this.$store.getters.getDirectConnectionsByCardId(this.card.rid)
    },
    connectionsDeep: function () {
      return this.$store.getters.getDeepConnectionsByCardId(this.card.rid)
    },
    directConnectedCardIds: function () {
      let arr = []
      this.connectionsDirect.forEach((conn, iConn) => {
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
    deepConnectedCardIds: function () {
      let arr = []
      this.connectionsDeep.forEach((conn, iConn) => {
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
      return this.card.states.connecting == true
      //return this.userState.name == 'connectCard' && this.userState.data.rid == this.card.rid
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
        if(s.name == 'selectCard'){
          //this.$store.commit('setCardState',{card: this.card, stateName: "selected", stateFlag: true});
          if(s.data.rid == this.card.rid){ //If this is the card the user is interacting with
            this.setState("selected",true)
          }
          else{ //Unless this is the card the user is interacting with
            if(this.deepConnectedCardIds.indexOf(s.data.rid) != -1){ //if card is connected
              this.setState("selectingConnected",true)
            }
            else{ //if card is not connected
              this.setState("selectingNotConnected",true)
            }
          }
        }

        //connectCard
        if(s.name == 'connectCard'){
          //this.$store.commit('setCardState',{card: this.card, stateName: "selected", stateFlag: true});
          if(s.data.rid == this.card.rid){ //If this is the card the user is interacting with
            this.setState("selected",true)
            this.setState("connecting",true)
          }
          else{ //Unless this is the card the user is interacting with
            if(this.directConnectedCardIds.indexOf(s.data.rid) != -1){ //if card is connected
              this.setState("connectingConnected",true)
            }
            else{  //if card is not connected
              let cousins = this.$store.getters.getClosestCardCousins(this.card)
              if(cousins.find(c => c.rid == s.data.rid)){ //If not connected and the cards are closest cousins
                this.setState("connectingNotConnected",true)
              }
              else{
                this.setState("connectingCantConnect",true)
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
      if(this.card.states.connectingNotConnected){
        this.connect()
      }
      if(this.card.states.connectingConnected){
        this.unconnect()
      }
      //this.$store.commit('forceUserStateUpdate');
    },

    setSelected: function (e){
      if(!this.card.states.selected){
        this.$store.commit('setUserState',{name: "selectCard", data: {rid: this.card.rid}})
      }
      else{
        this.$store.commit('resetUserState')
      }
    },
    toggleConnecting: function (){
      if(!this.card.states.connecting){
        this.$store.commit('setUserState',{name: "connectCard", data: {rid: this.card.rid}})
      }
      else{
        this.$store.commit('setUserState',{name: "selectCard", data: {rid: this.card.rid}})
      }
    },
    connect: function () {
      console.log("Connect")
      let cardOther = this.$store.getters.getCardById(this.userState.data.rid)
      this.$emit('connect',{members: [cardOther.rid, this.card.rid]})
    },
    unconnect: function () {
      console.log("Unconnect")
      let cardOther = this.$store.getters.getCardById(this.userState.data.rid)
      this.$emit('unconnect',{members: [cardOther.rid, this.card.rid]})
    },
    removeCard: function () {
      this.$store.commit('removeConnectionsByCardId',this.card.rid)
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

      this.$store.commit('makeAPICall',params)
    }
  },
  created: function () {
    this.$store.commit('initCard',this.card)
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
  justify-content: flex-end;
}

.main{
  flex: 1;
  padding: 10px;
}

.bottom{
  flex: 1 0 20px;
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
