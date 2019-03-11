<template>
  <div class="Card" :class="{'connected': card.status}" @mouseenter="setHovering(true)" @mouseleave="setHovering(false)">
    <h3>
      {{card.name}}
    </h3>

    <button class="remove" v-if="hovering" @click="removeCard">
      Ta bort kort
    </button>

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
    setHovering: function (status){
      this.hovering = status;
      store.commit('setCardsStatus',{cardIds: this.connectedCardIds, status: status});
    },
    removeCard: function () {
      this.$emit('removeCard',this.card)
    }
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
}

.Card:hover{
  background: #E5E5E5;
}

.remove{
  position: absolute;
  top: 5px;
  right: 5px;
}

.connected{
  background: #E5E5E5;
}

</style>
