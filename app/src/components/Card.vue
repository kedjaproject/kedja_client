<template>
  <div class="Card" :class="{'connected': card.status}" @mouseover="setStatus(true)" @mouseout="setStatus(false)">
    Kort: {{card}}
    <br />
    Kopplingar: {{connections}}
  </div>
</template>

<script>

import { store } from '@/store';

export default {
  name: 'Card',
  data () {
    return {
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
    setStatus: function (status){
      store.commit('setCardsStatus',{cardIds: this.connectedCardIds, status: status});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Card{
  border: 1px solid lightgray;
  background: #468895;
  padding: 5px;
}

.Card:hover{
  background: #596607;
}

.connected{
  background: palegreen;
}

</style>
