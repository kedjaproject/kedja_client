<template>
    <div :class="classes" id="modal-backdrop" @click.self="dismiss">
        <div class="modal-window" role="modal">
            <button v-show="dismissable" @click="close" class="closer">&times;</button>
            <h1 v-if="headline">{{ headline }}</h1>
            <component v-if="component" :is="component" :data="data" />
        </div>
    </div>
</template>
<script>
import { eventBus } from '@/utils'

export default {
  name: 'Modal',
  data () {
    return {
      isActive: false,
      isOpen: false,
      dismissable: true,
      component: null,
      data: null,
      headline: null
    }
  },
  computed: {
    classes () {
      return {
        active: this.isActive,
        open: this.isOpen
      }
    }
  },
  methods: {
    open (params) {
      if (params) {
        this.dismissable = params.dismissable || true
        this.component = params.component || null
        this.data = params.data || null
        this.headline = params.headline || null
      }
      this.isActive = true
      this.$nextTick(() => {
        this.isOpen = true
      })
    },
    close () {
      this.isOpen = false
      this.isActive = false
    },
    dismiss () {
      // Only if dismissable, for clicking bg or pressing ESC
      if (this.dismissable) this.close()
    }
  },
  created () {
    eventBus.$on('modalOpen', this.open)
    eventBus.$on('modalClose', this.close)
    document.addEventListener('keyup', event => {
      if (this.open && event.key === 'Escape') this.dismiss()
    })
  }
}
</script>
<style lang="sass">
#modal-backdrop
  z-index: 1000
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  background-color: rgba(#000, 0)
  transition: background-color 1s
  display: none

  &.active
    display: block

  &.open
    background-color: rgba(#000, .3)

  .modal-window
    position: relative
    background-color: #fff
    width: 80vw
    margin: 80px auto
    padding: 20px
    min-height: calc(100vh - 240px)
    max-height: calc(100vh - 160px)
    overflow-y: auto

  .closer
    color: #999
    font-size: 36px
    position: absolute
    right: 16px
    top: 10px
    line-height: 1
    padding: 4px
    border: none
    &:focus
        outline: none
</style>
