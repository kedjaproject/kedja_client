<template>
  <div class="Connection" :style="{'top': top-5+'px', 'left': left+'px'}">
    <canvas class="canvasConnection" :width="width" :height="height+10" />
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
      x0: "",
      y0: "",
      x1: "",
      y1: ""
    }
  },
  props: {
    from: "",
    to: ""
  },
  computed: {
    width: function () {
      return Math.abs(this.x1 - this.x0);
    },
    height: function () {
      return Math.abs(this.y1 - this.y0);
    },
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
  },
  methods: {
    setBounds: function () {
      let el0 = document.getElementById(this.from.toString());
      let el1 = document.getElementById(this.to.toString());

      //Start point
      this.x0 = el0.getBoundingClientRect().x + el0.getBoundingClientRect().width;
      this.y0 = el0.getBoundingClientRect().y + el0.getBoundingClientRect().height / 2;

      //End point
      this.x1 = el1.getBoundingClientRect().x;
      this.y1 = el1.getBoundingClientRect().y + el1.getBoundingClientRect().height / 2;

      this.drawCanvas();

    },
    drawCanvas: function () {
      var c = this.$el.getElementsByTagName("canvas")[0];
      var ctx = c.getContext("2d");
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#000000";

      //Curve
      ctx.beginPath();
      var y0 = this.y0 > this.y1 ? this.height + 5 : 5;
      var y1 = this.y0 > this.y1 ? 5 : this.height + 5;

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
      ctx.beginPath();
      ctx.arc(0, y0, 5, 0, 2 * Math.PI);
      ctx.fill();

      //End circle
      ctx.beginPath();
      ctx.arc(this.width, y1, 5, 0, 2 * Math.PI);
      ctx.fill();

    }
  },
  mounted: function () {
    this.setBounds();
  },
  updated: function () {
    this.setBounds();
  }
}
</script>

<style scoped>

.Connection{
  position: fixed;
  background: #ff000000;
  height: 0px auto;
  padding: 0;
}

.canvasConnection{
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
}

</style>
