<template>
    <button class="user-button" :class="{small}" :style="style" @click="$emit('click')">
        {{ user.shortName || '??' }}
    </button>
</template>
<script>
export default {
  name: 'UserButton',
  props: {
    user: Object,
    color: String,
    small: Boolean
  },
  computed: {
    style () {
      return this.color && ('background-color: ' + this.color + ';')
    }
  }
}
</script>
<style lang="sass">
$color-default: #ffdc27

.user-button
    background-color: $color-default
    width: 34px
    height: 34px
    font-size: 20px
    font-weight: 700
    text-align: center
    color: #fff
    padding: 0
    border: none
    &.small
        width: 20px
        height: 20px
        font-size: 12px
    &:hover:not(:disabled)
        background-color: $color-default
</style>
