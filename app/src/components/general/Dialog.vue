<template>
    <div :class="classes" id="dialog-backdrop" @click.self="dismiss">
        <div class="dialog-window" role="dialog">
            <h2>{{ title }}</h2>
            <span class="message">{{ message }}</span>
            <div class="buttons">
                <button v-for="(button, i) in buttons" :key="i" @click="buttonClick(button)" :class="button.classes">{{ button.text }}</button>
            </div>
        </div>
    </div>
</template>
<script>
import { eventBus } from '@/utils'

const defaultButtons = [
  {
    text: 'OK',
    classes: 'btn-primary'
  }
]
const defaultTitle = 'Något gick fel'
const defaultMessage = 'Okänt fel. Kontrollera din nätverksuppkoppling.'

export default {
  name: 'Dialog',
  data () {
    return {
      isActive: false,
      isOpen: false,
      dismissable: true,
      title: '',
      message: '',
      buttons: []
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
    buttonClick (button) {
      if (button.callback) {
        button.callback()
      }
      this.close()
    },
    open (params) {
      params = params || {}
      this.dismissable = params.dismissable || true
      this.title = params.title || defaultTitle
      this.message = params.message || defaultMessage
      this.buttons = params.buttons || defaultButtons
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
    eventBus.$on('dialogOpen', this.open)
    document.addEventListener('keyup', event => {
      if (this.open && event.key === 'Escape') this.dismiss()
    })
  }
}
</script>
<style lang="sass">
#dialog-backdrop
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

  .dialog-window
    position: relative
    background-color: #fff
    width: 60vw
    min-width: 300px
    margin: 80px auto
    padding: 20px

  .message
    font-size: 20px

  .buttons
    text-align: right

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
