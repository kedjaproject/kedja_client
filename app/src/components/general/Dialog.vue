<template>
    <div :class="classes" id="dialog-backdrop" @click.self="dismiss">
        <div class="dialog-window" role="dialog">
            <h2 v-if="params.title">{{ params.title }}</h2>
            <span class="message">{{ params.message }}</span>
            <div class="buttons">
                <button v-for="(button, i) in params.buttons" :key="i" @click="buttonClick(button)" :class="button.classes">{{ button.text }}</button>
            </div>
        </div>
    </div>
</template>
<script>
import { eventBus } from '@/utils'

const defaults = {
  buttons: [
    {
      text: 'OK',
      classes: 'btn-primary'
    }
  ],
  title: 'Något gick fel',
  message: 'Okänt fel. Kontrollera din nätverksuppkoppling.',
  dismissable: true
}

export default {
  name: 'Dialog',
  data () {
    return {
      isActive: false,
      isOpen: false,
      params: {}
    }
  },
  computed: {
    classes () {
      return {
        active: this.isActive,
        open: this.isOpen
      }
    },
    dismissable () {
      return this.params.dismissable
    }
  },
  methods: {
    buttonClick (button) {
      if (button.action) {
        button.action()
      }
      this.close()
    },
    open (params) {
      this.params = {}
      Object.assign(this.params, defaults)
      Object.assign(this.params, params)
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
    max-width: 600px
    margin: 80px auto
    padding: 40px 50px

  .message
    font-size: 20px
    color: #666

  .buttons
    text-align: center
    margin-top: 20px
    button
      background-color: #bbb
      border: none
      margin-right: 20px
      text-transform: uppercase
      font-size: 20px
      font-weight: 500
      color: #000
      padding: 8px 16px
      &:last-child
        margin-right: 0
      &.btn-warning
        background-color: #999

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
