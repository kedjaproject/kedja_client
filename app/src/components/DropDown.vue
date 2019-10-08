<template>
  <div class="DropDown" tabindex="0" @blur="blur($event)">

    <div class="toggle" @click="toggleList">
      <slot class="slot">
      </slot>
    </div>

    <div class="listContainer z2" tabindex="0">
      <div class="list" :class="{'open': open}" tabindex="0">
        <div v-for="(item,k) in items" :key="k" class="listItem" @click="performFunction(item.f, item.args)" tabindex="0">
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
    close () {
      this.open = false
    },
    blur (e) {
      if (!this.$el.contains(e.relatedTarget)) {
        this.close()
      }
    },
    performFunction (f, args = {}) {
      if (f) {
        f(args)
      }
      this.close()
    }
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.DropDown{
  outline: none;
}

.toggle{
  cursor: pointer;
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

.list.open{
  display: inline;
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
