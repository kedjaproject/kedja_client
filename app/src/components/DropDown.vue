<template>
  <div class="DropDown">

    <slot class="slot">
    </slot>

    <div class="listContainer">
      <div class="list">
        <div v-for="(item,k) in items" :key="k" class="listItem" @click="performFunction(item.f)">
          {{item.label}}
        </div>
      </div>
    </div>

  </div>
</template>

<script>

// import { store } from '@/store'
// import Component from '@/components/Component'

export default {
  name: 'DropDown',
  /*
  components: {
    Component
  },
  */
  data () {
    return {
      open: false
    }
  },
  props: {
    items: ''
  },
  computed: {
  },
  methods: {
    toggleList () {
      this.open = !this.open
    },
    performFunction (f) {
      if (f) {
        f()
      }
    }
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.DropDown{
}

.DropDown:hover .list{
  display: inline;
}

.listContainer{
  position: relative;
}

.list{
  display: none;
  background: white;
  position: absolute;
  top: 0;
  min-width: 100%;
  border: 1px solid lightgray;
  border-top: 0;
  z-index: 1;
}

.listItem{
  padding: 5px;
  border-top: 1px solid lightgray;
  cursor: pointer;
}

.listItem:hover{
  background: #eee;
}

</style>
