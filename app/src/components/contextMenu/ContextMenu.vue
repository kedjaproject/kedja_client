<template>
  <div class="ContextMenu">

    <!--div class="handle" @click="toggleForceClose()" :class="{'forceClose': forceClose}">
      <span v-if="hasContent">&#9658;</span>
      <span v-else>&#9664;</span>
    </div-->

    <div class="menuContent">
      <div v-if="card">
        <ContextMenuCard :card="card"></ContextMenuCard>
      </div>
    </div>

  </div>
</template>

<script>

import ContextMenuCard from '@/components/contextMenu/ContextMenuCard'
//import Component from '@/components/Component'

export default {
  name: 'ContextMenu',
  components: {
    ContextMenuCard
  },
  data () {
    return {
      forceClose: false
    }
  },
  props: {
    value: ""
  },
  computed: {
    userState: function () {
      return this.$store.state.userState
    },
    card: function () {
      if(this.userState.name == "selectCard"){
        return this.$store.getters.getCardById(this.userState.data.rid)
      }
      return undefined
    },
    hasContent: function () {
      return this.card;
    }
  },
  watch:{
    hasContent: function (val) {
      this.emitData(val)
    }
  },
  methods: {
    emitData(data) {
      let d = this.forceClose ? false : data;
      this.$emit('input',d)
    },
    toggleForceClose: function () {
      this.forceClose = !this.forceClose;
    }
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.ContextMenu{

  display: flex;
  flex-direction: column;

  position: relative;

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

.menuContent{
  /*flex: 1;
  overflow-y: scroll;*/
}

.forceClose{
  background: red;
}

</style>
