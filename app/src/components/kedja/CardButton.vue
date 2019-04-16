<template>
  <div class="CardButton" :class="{'active': active}">

    X

  </div>
</template>

<script>

//import Component from '@/components/Component'

export default {
  name: 'CardButton',
  /*components: {
    Component
  },*/
  data () {
    return {
    }
  },
  props: {
    active: false
  },
  computed: {
  },
  methods: {
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.CardButton{
  background: white;
  border: 1px solid lightgray;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.CardButton:hover{
  background: lightgray;
}

.active{
  background: yellow;
}

</style>
