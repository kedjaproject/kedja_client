<template>
  <div class="BigDropDown" :class="{open}" @blur="blur" tabindex="0">

    <div class="toggle" @click="toggleList">
      <slot v-if="$slots.default" />
      <span v-else>
        <img v-if="currentOption.img" class="option-image" :src="currentOption.img">
        {{ currentOption.label }}
      </span>
      <span class="caret" v-if="caret">
        <img src="/static/graphics/icons/dropdown/KEDJA-14.png" alt="caret" />
        <img class="hover" src="/static/graphics/icons/dropdown/KEDJA-15.png" alt="caret" />
      </span>
    </div>

    <div class="listContainer z2">
      <ul class="list" :class="{open}">
        <li v-for="(option,k) in options" :key="k" class="listItem" :class="{active: option.active}" @click="callOption(option)">
          <div v-if="option.img">
            <img class="option-image" :src="option.img" alt="">
          </div>
          <div class="content">
            <h3>
              {{option.label}}
            </h3>
            <p v-if="option.description">{{ option.description }}</p>
            <component :is="option.component" v-if="option.component && (!option.componentOnActive || option.active)" />
          </div>
        </li>
      </ul>
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
    options: Array,
    caret: Boolean
  },
  computed: {
    currentOption () {
      return this.options.find(option => option.active)
    }
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
    callOption (option) {
      if (option.active) {
        return
      }
      if (option.f) {
        option.f(option.args)
      }
    }
  }
}
</script>

<style lang="sass">
.BigDropDown
  outline: none

  &.open
    background-color: #fff
    z-index: 1000
    filter: drop-shadow(0 2px 6px rgba(#000, .3))

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
    padding: 10px

  .listContainer
    position: relative

  .list
    display: none
    background: white
    position: absolute
    top: 0
    width: 400px
    max-width: 100vw
    padding: 10px
    margin: 0
    list-style: none
    z-index: 1
    &.open
      display: inline

  .listItem
    padding: 15px
    margin-bottom: 10px
    cursor: pointer
    border-radius: 5px
    border: 3px solid #ccc
    display: flex
    &:hover
      background-color: #eee
    &.active:hover
      background-color: #ccc
    h3
      margin-top: 0
      color: #000
    p:last-child
      margin-bottom: 0
    &:last-child
      margin-bottom: 0
    &.active
      background: #ccc
      cursor: initial
    .option-image
      margin-right: 10px
      width: 40px

  .option-image
    width: 30px
</style>
