<template>
  <div class="DropDown" tabindex="0" :class="{open}" @blur="blur">

    <div class="toggle" @click="toggleList">
      <slot class="slot"></slot>
      <span class="caret" v-if="caret">
        <img src="/static/graphics/icons/dropdown/KEDJA-14.png" alt="caret" />
        <img class="hover" src="/static/graphics/icons/dropdown/KEDJA-15.png" alt="caret" />
      </span>
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

export default {
  name: 'DropDown',
  data () {
    return {
      open: false
    }
  },
  props: {
    items: Array,
    caret: Boolean
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
  }
}
</script>

<style lang="sass">
.DropDown
  outline: none

  &:hover .caret img
    display: none
    &.hover
      display: inline

  .caret
    img
      width: 24px
      &.hover
        display: none

  .toggle
    cursor: pointer
    font-size: 30px
    color: #777
    padding: 10px 0

  .listContainer
    position: relative

  .list
    display: none
    background: white
    position: absolute
    top: 0
    min-width: 100%
    border: 1px solid lightgray
    border-top: 0
    z-index: 1
    &.open
      display: inline

  .listItem
    padding: 5px
    border-top: 1px solid lightgray
    cursor: pointer
    &:hover
      background: #eee

</style>
