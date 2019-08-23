<template>
  <div class="CardButton" :class="{'active': active, 'placeholder': placeholder}">

    <slot>
    </slot>

  </div>
</template>

<script>

// import Component from '@/components/Component'

export default {
  name: 'CardButton',
  /*
  components: {
    Component
  },
  */
  data () {
    return {
    }
  },
  props: {
    active: false,
    placeholder: false
  },
  computed: {
  },
  methods: {
  },
  mounted () {
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

.CardButton:hover:not(.active):not(.placeholder){
  background: lightgray;
}

.active{
  background: #ffdc27;
}

.placeholder{
  border-color: transparent;
  background: transparent;
}

</style>
