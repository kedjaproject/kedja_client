<template>
  <a class="user-button" :class="classes" :style="style" @click="click">
    <img v-if="user" :src="user.data.picture" :title="user.data.fullName" height="100%" width="100%" />
  </a>
</template>
<script>
export default {
  name: 'UserButton',
  props: {
    user: Object,
    color: String,
    small: Boolean,
    noClick: Boolean
  },
  computed: {
    style () {
      return this.color && ('background-color: ' + this.color + ';')
    },
    classes () {
      return {
        small: this.small,
        'no-click': this.noClick
      }
    }
  },
  methods: {
    click (event) {
      if (this.noClick) {
        event.currentTarget.blur()
      } else {
        this.$emit('click', event)
      }
    }
  }
}
</script>
<style lang="sass">
// $color-default: #ffdc27

.user-button
  display: inline-block
  // background-color: $color-default
  width: 43px
  height: 43px
  // font-size: 20px
  // font-weight: 700
  // text-align: center
  // color: #fff
  padding: 0
  border: none
  &.small
    width: 20px
    height: 20px
    // font-size: 12px
  &.no-click
    cursor: auto
  &:hover:not(:disabled)
    // background-color: $color-default
</style>
