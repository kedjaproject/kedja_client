<template>
  <div class="Card" :class="{'selected': card.states.selected, 'selectedConnectedOther': card.states.selectedConnected == false, 'connected': card.states.connected, 'connectedOther': card.states.connected == false}" @mouseenter="setHovering(true)" @mouseleave="setHovering(false)" @click="setSelected()">

    <button class="remove" v-if="hovering" @click="removeCard" title="Ta bort samling" >Ta bort kort</button>
    <textarea v-model="card.name" class="hiddenField h3" ref="input-name">
    </textarea>


  </div>
</template>

<script>

import { store } from '@/store';

export default {
  name: 'Card',
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
      return store.getters.getConnectionsByCardId(this.card.id)
    },
    connectedCardIds: function () {
      let arr = []
      this.connections.forEach((conn, iConn) => {
        if(conn.members[0] != this.card.id){
          arr.push(conn.members[0])
        }
        if(conn.members[1] != this.card.id){
          arr.push(conn.members[1])
        }
      })
      return arr
    }
  },
  methods: {
    setHovering: function (flag){
      this.hovering = status;
      if(flag){
        store.commit('setCardsState',{cardIds: this.connectedCardIds, stateName: "connected"});
      }
      else{
        store.commit('resetCardsState',{stateName: "connected"});
      }
    },
    setSelected: function (){
      if(!this.selected){
        store.commit('setCardsState',{cardIds: [this.card.id], stateName: "selected"});
        store.commit('setCardsState',{cardIds: this.connectedCardIds, stateName: "selectedConnected"});
      }
      else{
        store.commit('resetCardsState',{stateName: "selected"});
        store.commit('resetCardsState',{stateName: "selectedConnected"});
      }
    },
    removeCard: function () {
      this.$emit('removeCard',this.card)
    }
  },
  mounted: function () {
    this.$refs["input-name"].focus();
    this.$refs["input-name"].select();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Card{
  border: 1px solid #CADBDA;
  background: #FFFFFF;
  padding: 5px;
  cursor: pointer;
  position: relative;
  transition: all 0.25s;
}

.Card:hover{
}

.Card
{
  border: 0px solid #FFEF29;
}

.remove{
  position: absolute;
  top: 5px;
  right: 5px;
}

.selected{
  background: white;
  border: 3px solid #FFEF29;

}

.selectedConnectedOther:not(.selected){
  /*display: none;*/
}

.connected:not(:hover){
  background: #FFFFFF;
}

.connectedOther:not(:hover){
  filter: opacity(0.25);
}

textarea{
  width: 100%;
  box-sizing: border-box;
}


</style>
