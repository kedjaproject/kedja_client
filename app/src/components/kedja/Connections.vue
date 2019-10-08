<template>
  <div class="Connections">
    <canvas class="canvasConnection"/>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import { eventBus } from '@/utils'

export default {
  name: 'Connections',
  data () {
    return {
      loaded: false,
      bounds: {},
      scroll: {}
    }
  },
  props: {
    connections: Array,
    wall: Object,
    collectionsElement: undefined
  },
  computed: {
    connectionCards () {
      return this.connections.map(conn => {
        return {
          members: [
            this.cards[conn.members[0]],
            this.cards[conn.members[1]]
          ]
        }
      })
    },
    ...mapState('walls/cards', ['cards']),
    ...mapState(['userState'])
  },
  methods: {
    redraw () {
      this.$nextTick(() => {
        this.setBounds()
        this.drawCanvas()
      })
    },
    setBounds () {
      const c = this.$el.querySelector('canvas')
      c.width = this.$el.clientWidth
      c.height = this.$el.clientHeight
      this.bounds = this.collectionsElement.getBoundingClientRect()
      this.scroll = {
        left: this.collectionsElement.scrollLeft,
        top: this.collectionsElement.scrollTop
      }
    },
    drawCanvas: function () {
      const canvas = this.$el.querySelector('canvas')
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Diagonal line across canvas
      /*
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(c.width, c.height);
      ctx.stroke();
      */
      this.connectionCards.forEach(connection => {
        this.drawConnection(ctx, connection)
      })
    },
    drawConnection: function (ctx, conn) {
      const c0 = conn.members[0]
      const c1 = conn.members[1]
      const el0 = document.getElementById(c0.rid)
      const el1 = document.getElementById(c1.rid)
      if (el0 && el1) {
        let elLeft, elRight, inSelectedChainLeft, inSelectedChainRight

        if (el0.getBoundingClientRect().x < el1.getBoundingClientRect().x) {
          elLeft = el0
          elRight = el1
          inSelectedChainLeft = c0.states.selected || c0.states.selectingConnected || c0.states.connectingConnected
          inSelectedChainRight = c1.states.selected || c1.states.selectingConnected || c1.states.connectingConnected
        } else {
          elLeft = el1
          elRight = el0
          inSelectedChainLeft = c1.states.selected || c1.states.selectingConnected || c1.states.connectingConnected
          inSelectedChainRight = c0.states.selected || c0.states.selectingConnected || c0.states.connectingConnected
        }

        // Left point
        let x0 = elLeft.getBoundingClientRect().x + elLeft.getBoundingClientRect().width - this.bounds.x + this.scroll.left
        let y0 = elLeft.getBoundingClientRect().y + elLeft.getBoundingClientRect().height / 2 - this.bounds.y

        // Right point
        let x1 = elRight.getBoundingClientRect().x - this.bounds.x + this.scroll.left
        let y1 = elRight.getBoundingClientRect().y + elRight.getBoundingClientRect().height / 2 - this.bounds.y

        // Default rendering settings
        ctx.lineWidth = 5
        ctx.strokeStyle = '#ffff'
        ctx.fillStyle = '#ffdc27'
        let radius = 15

        // User state based rendering settings
        if (this.userState.name === 'selectCard' || this.userState.name === 'connectCard') {
          if (inSelectedChainLeft && inSelectedChainRight) {
          } else {
            ctx.lineWidth = 1
            ctx.strokeStyle = '#fff5'
            ctx.fillStyle = '#ffdc2722'
            radius = 10
          }
        }

        // START DRAW
        // Line
        ctx.beginPath()
        ctx.moveTo(x0 + 5, y0)
        ctx.lineTo(x1 - 5, y1)
        ctx.stroke()

        // Connection points
        // Left-most half circle
        ctx.beginPath()
        ctx.arc(x0, y0, radius, -Math.PI / 2, Math.PI / 2)
        ctx.fill()

        // Right-most half circle
        ctx.beginPath()
        ctx.arc(x1, y1, radius, Math.PI / 2, -Math.PI / 2)
        ctx.fill()
      }
    }
  },
  created () {
    eventBus.$on('relationsUpdated', this.redraw)
    eventBus.$on('cardRemoved', () => {
      // Similar to $nextTick, but waits for css transitions to end.
      this.$nextTransitionEnd(this.redraw, this.$parent.$el)
    })
  },
  mounted () {
    // this.setBounds()
    // this.drawCanvas()
    // this.$nextTick(this.firstDraw)
    if (this.collectionsElement) {
      this.$nextTick(() => {
        this.redraw()
      })
    }
  }
}
</script>

<style scoped>

.Connections{
  padding: 0;
  pointer-events:none;

}

.canvasConnection{

}

</style>
