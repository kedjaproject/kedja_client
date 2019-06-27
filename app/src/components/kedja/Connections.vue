<template>
  <div class="Connections">
    <canvas class="canvasConnection"/>
  </div>
</template>

<script>

//import Component from '@/components/Component'

export default {
  name: 'Connections',
  /*components: {
    Component
  },*/
  data () {
    return {
      loaded: false,
      bounds: {},
      scroll: {}
    }
  },
  props: {
    connections: "",
    boundsElementId: ""
  },
  computed: {
    dirtyDraw: function () {
      return this.$store.state.dirtyDraw
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

      if(document.getElementById(this.boundsElementId)){
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
      var c = this.$el.getElementsByTagName("canvas")[0];
      c.width = this.$el.clientWidth;
      c.height = this.$el.clientHeight;
      this.bounds = document.getElementById(this.boundsElementId).getBoundingClientRect()
      this.scroll = {
        left: document.getElementById(this.boundsElementId).scrollLeft,
        top: document.getElementById(this.boundsElementId).scrollTop
      }
    },
    drawCanvas: function () {
      var c = this.$el.getElementsByTagName("canvas")[0];
      var ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.lineWidth = 6;
      ctx.strokeStyle = "#fff";

      //Diagonal line across canvas
      /*ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(c.width, c.height);
      ctx.stroke();*/

      this.connections.forEach((connection) => {
        this.drawConnection(ctx,connection)
      })

    },
    drawConnection: function (ctx,conn) {

      let el0 = document.getElementById(conn.members[0]);
      let el1 = document.getElementById(conn.members[1]);

      if(el0 && el1){

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
        let x0 = elLeft.getBoundingClientRect().x + elLeft.getBoundingClientRect().width - this.bounds.x + this.scroll.left;
        let y0 = elLeft.getBoundingClientRect().y + elLeft.getBoundingClientRect().height / 2  - this.bounds.y;

        //End point
        let x1 = elRight.getBoundingClientRect().x - this.bounds.x + this.scroll.left;
        let y1 = elRight.getBoundingClientRect().y + elRight.getBoundingClientRect().height / 2 - this.bounds.y;


        ctx.beginPath();
        ctx.moveTo(x0 + 5, y0);
        ctx.lineTo(x1 - 5, y1);
        ctx.stroke();

        //Connection points
        ctx.fillStyle = "#ffdc27";
        //Start circle
        ctx.beginPath();
        ctx.arc(x0, y0, 15, -Math.PI/2, Math.PI/2);
        ctx.fill();

        //Start circle
        ctx.beginPath();
        ctx.arc(x1, y1, 15, Math.PI/2, -Math.PI/2);
        ctx.fill();

      }



    }
  },
  created: function () {
    //this.$store.commit('initConnection',this.connection);
  },
  mounted: function () {
    //this.setBounds();
    setTimeout(this.firstDraw, 1000);
    //this.drawCanvas();
  },
  updated: function () {
    //this.redraw();
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
