<template>
  <div>
    <input ref="location" :value="location"/>
    <button @click="copy">Kopiera länk</button>
    <div class="result" :class="{ copied }">Kopierad</div>
  </div>
</template>
<script>
export default {
  name: 'CopyLocation',
  data () {
    return {
      copied: false
    }
  },
  computed: {
    location () {
      return location.href
    }
  },
  methods: {
    copy () {
      this.$refs.location.select()
      this.$refs.location.setSelectionRange(0, 99999) // For mobile devices
      document.execCommand('copy')
      this.copied = true
      setTimeout(() => { this.copied = false }, 5000)
    }
  }
}
</script>
<style lang="sass" scoped>
div
  display: flex
  flex-wrap: wrap
  input
    flex: 1 1 auto
    width: 10em
    margin-right: 5px
    border: 2px solid #666
  button
    flex: 0 0 auto
    border: 0
    background: #666
    color: #fff
    &:hover
      background: #666
    &:active
      background: #fff
  .result
    flex: 0 0 100%
    margin-bottom: -.6em
    color: maroon
    opacity: 0
    transition: opacity .2s
    &.copied
      opacity: 1
</style>
