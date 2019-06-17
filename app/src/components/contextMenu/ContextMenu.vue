<template>
  <div class="ContextMenu">

    <div class="handle">
      &#9664;
    </div>

    <div v-if="card">
      <ContextMenuCard :card="card"></ContextMenuCard>
    </div>

  </div>
</template>

<script>

import { store } from '@/store';
import ContextMenuCard from '@/components/contextMenu/ContextMenuCard'
//import Component from '@/components/Component'

export default {
  name: 'ContextMenu',
  components: {
    ContextMenuCard
  },
  data () {
    return {
    }
  },
  props: {
    value: ""
  },
  computed: {
    userState: function () {
      return store.state.userState
    },
    card: function () {
      if(this.userState.name == "selectCard"){
        return store.getters.getCardById(this.userState.data.rid)
      }
      return undefined
    },
    content: function () {
      if(this.card){
        this.emitData(this.card)
        return this.card
      }

    }
  },
  watch:{
  },
  methods: {
    emitData(data) {
      this.$emit('input', {
        data
      })
    }
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.ContextMenu{
  position: relative;

  width: 300px;
  background: white;

  padding: 20px;
}

.handle{
  position: absolute;
  top: 0px;
  left: -30px;
  width: 30px;
  height: 50px;
  border: 1px solid lightgray;
  box-sizing: border-box;
  box-shadow: 0px 5px 3px lightgray;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

</style>
