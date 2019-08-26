<template>
  <div class="Connections">
    <canvas class="canvasConnection"/>
  </div>
</template>

<script>

// import Component from '@/components/Component'
import { mapState } from 'vuex'

export default {
  name: 'Connections',
  /*
  components: {
    Component
  },
  */
  data () {
    return {
      loaded: false,
      bounds: {},
      scroll: {}
    }
  },
  props: {
    connections: Array,
    boundsElementId: ''
  },
  computed: {
    userState: function () {
      return this.$store.getters.getUserState
    },
    dirtyDraw: function () {
      return this.$store.state.dirtyDraw
    },
    connectionCards: function () {
      return this.connections.map(conn => {
        return {
          members: [
            this.cardById[conn.members[0]],
            this.cardById[conn.members[1]]
          ]
        }
      })
    },
    ...mapState('walls', ['cardById'])
  },
  watch: {
    /*
    from: {
      handler () {
        this.setBounds();
      },
      deep: false
    }
    */
    dirtyDraw (val) {
      // if(val){
      this.redraw()
      // }
    }
  },
  methods: {
    firstDraw: function () {
      // let el0 = document.getElementById(this.from)
      // let el1 = document.getElementById(this.to)

      if (document.getElementById(this.boundsElementId)) {
        this.$store.commit('setDirtyDraw')
      } else {
        setTimeout(this.firstDraw, 100)
      }
    },
    redraw () {
      this.setBounds()
      this.drawCanvas()
    },
    setBounds: function () {
      var c = this.$el.getElementsByTagName('canvas')[0]
      c.width = this.$el.clientWidth
      c.height = this.$el.clientHeight
      this.bounds = document.getElementById(this.boundsElementId).getBoundingClientRect()
      this.scroll = {
        left: document.getElementById(this.boundsElementId).scrollLeft,
        top: document.getElementById(this.boundsElementId).scrollTop
      }
    },
    drawCanvas: function () {
      var c = this.$el.getElementsByTagName('canvas')[0]
      var ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)

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
      let el0 = document.getElementById(conn.members[0].rid)
      let el1 = document.getElementById(conn.members[1].rid)

      if (el0 && el1) {
        let c0 = conn.members[0]
        let c1 = conn.members[1]

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

        // Start point
        let x0 = elLeft.getBoundingClientRect().x + elLeft.getBoundingClientRect().width - this.bounds.x + this.scroll.left
        let y0 = elLeft.getBoundingClientRect().y + elLeft.getBoundingClientRect().height / 2 - this.bounds.y

        // End point
        let x1 = elRight.getBoundingClientRect().x - this.bounds.x + this.scroll.left
        let y1 = elRight.getBoundingClientRect().y + elRight.getBoundingClientRect().height / 2 - this.bounds.y

        // Default rendering settings
        ctx.lineWidth = 5
        ctx.strokeStyle = '#ffff'

        if (this.userState.name === 'selectCard' || this.userState.name === 'connectCard') {
          if (inSelectedChainLeft && inSelectedChainRight) {
          } else {
            ctx.lineWidth = 1
            ctx.strokeStyle = '#fff5'
          }
        }

        ctx.beginPath()
        ctx.moveTo(x0 + 5, y0)
        ctx.lineTo(x1 - 5, y1)
        ctx.stroke()

        // Connection points
        // Start circle
        ctx.fillStyle = this.userState.name === 'default' || inSelectedChainLeft ? '#ffdc27' : '#ffdc2722'
        ctx.beginPath()
        ctx.arc(x0, y0, inSelectedChainLeft ? 15 : 10, -Math.PI / 2, Math.PI / 2)
        ctx.fill()

        // End circle
        ctx.fillStyle = this.userState.name === 'default' || inSelectedChainRight ? '#ffdc27' : 'ffdc2722'
        ctx.beginPath()
        ctx.arc(x1, y1, inSelectedChainRight ? 15 : 10, Math.PI / 2, -Math.PI / 2)
        ctx.fill()
      }
    },
    getCardById: function (id) {
      return this.cardById[id]
    }
  },
  created () {
    // this.$store.commit('initConnection',this.connection);
  },
  mounted () {
    // this.setBounds();
    setTimeout(this.firstDraw, 1000)
    // this.drawCanvas();
  },
  updated () {
    // this.redraw();
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
