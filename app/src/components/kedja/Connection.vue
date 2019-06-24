<template>
  <div class="Connection z0" :style="{'top': yMin+'px', 'left': left+'px'}">
    <canvas class="canvasConnection" :width="width" :height="height" />
  </div>
</template>

<script>

//import Component from '@/components/Component'

export default {
  name: 'Connection',
  /*components: {
    Component
  },*/
  data () {
    return {
      loaded: false,
      x0: "",
      y0: "",
      x1: "",
      y1: "",
    }
  },
  props: {
    connection: "",
    dirtyDraw: false
  },
  computed: {
    yMin: function () {
      return this.$store.state.connectionBounds.y
    },
    yMax: function () {
      return this.$store.state.connectionBounds.y + this.$store.state.connectionBounds.height
    },
    height: function () {
      return this.yMax - this.yMin
    },
    from: function () {
      return this.connection.members[0]
    },
    to: function () {
      return this.connection.members[1]
    },
    width: function () {
      return Math.abs(this.x1 - this.x0);
    },
    /*height: function () {
      return Math.abs(this.y1 - this.y0);
    },*/
    left: function () {
      return Math.min(this.x0, this.x1);
    },
    top: function () {
      return Math.min(this.y0, this.y1);
    }
  },
  watch: {
    /*from: {
      handler: function () {
        this.setBounds();
      },
      deep: false
    }*/
    dirtyDraw: function (val){
      if(val){
        this.redraw();
      }
    }
  },
  methods: {
    firstDraw: function () {
      let el0 = document.getElementById(this.from);
      let el1 = document.getElementById(this.to);

      if(el0 && el1){
        this.$store.commit('setDirtyDraw');
      }
      else{
        setTimeout(this.firstDraw, 100);
      }

    },
    redraw: function () {
      this.setBounds();
      this.drawCanvas();
    },
    setBounds: function () {

      if(document.getElementById(this.from) && document.getElementById(this.to)){
        let el0 = document.getElementById(this.from);
        let el1 = document.getElementById(this.to);

        let elLeft, elRight;

        if(el0.getBoundingClientRect().x < el1.getBoundingClientRect().x){
          elLeft = el0;
          elRight = el1;
        }
        else{
          elLeft = el1;
          elRight = el0;
        }

        //Start point
        this.x0 = elLeft.getBoundingClientRect().x + elLeft.getBoundingClientRect().width;
        //this.y0 = el0.getBoundingClientRect().y + el0.getBoundingClientRect().height / 2;
        this.y0 = elLeft.getBoundingClientRect().y - this.yMin + elLeft.getBoundingClientRect().height / 2;

        //End point
        this.x1 = elRight.getBoundingClientRect().x;
        //this.y1 = el1.getBoundingClientRect().y + el1.getBoundingClientRect().height / 2;
        this.y1 = elRight.getBoundingClientRect().y - this.yMin + elRight.getBoundingClientRect().height / 2;
      }

    },
    drawCanvas: function () {

      var c = this.$el.getElementsByTagName("canvas")[0];
      var ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.lineWidth = 6;
      ctx.strokeStyle = "#ffffff";

      //Curve
      ctx.beginPath();
      //var y0 = this.y0 > this.y1 ? this.height + 5 : 5;
      //var y1 = this.y0 > this.y1 ? 5 : this.height + 5;
      var y0 = this.y0;
      var y1 = this.y1;

      /*
      ctx.moveTo(0, y0);
      //ctx.lineTo(this.width, y1);
      ctx.bezierCurveTo(this.width / 2, y0, this.width / 2, y1, this.width, y1);
      ctx.stroke();
      */


      //Pipe 90deg angles
      ctx.moveTo(0, y0);
      ctx.lineTo(this.width / 2, y0);
      ctx.lineTo(this.width / 2, y1);
      ctx.lineTo(this.width, y1);
      ctx.stroke();

      ctx.lineWidth = 3;


      //Start circle
      /*ctx.beginPath();
      ctx.arc(0, y0, 5, 0, 2 * Math.PI);
      ctx.fill();

      //End circle
      ctx.beginPath();
      ctx.arc(this.width, y1, 5, 0, 2 * Math.PI);
      ctx.fill();*/


    }
  },
  created: function () {
    this.$store.commit('initConnection',this.connection);
  },
  mounted: function () {
    this.firstDraw();
  },
  updated: function () {
    this.redraw();
  }
}
</script>

<style scoped>

.Connection{
  position: fixed;
  background: #ff000000;
  height: 0px auto;
  padding: 0;
  pointer-events:none;
}

.canvasConnection{
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
}

</style>
