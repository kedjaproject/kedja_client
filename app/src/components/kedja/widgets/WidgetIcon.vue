<template>
  <div class="WidgetIcon" @mouseover="setHovering(true)" @mouseout="setHovering(false)">
    <img :src="image" alt="Koppla kort" />
  </div>
</template>

<script>

// import { store } from '@/store';
// import Component from '@/components/Component'

export default {
  name: 'WidgetIcon',
  /*
  components: {
    Component
  },
  */
  data () {
    return {
      hovering: false
    }
  },
  props: {
    active: false,
    path: "",
    img: "",
    imgHover: "",
    imgActive: ""
  },
  computed: {
    image: function () {
      let filename = ""
      if(this.active){
        filename = this.imgActive
      }
      else if(this.hovering){
        filename = this.imgHover
      }
      else {
        filename = this.img
      }

      //return this.path + filename;
      return this.path + filename;
      //return require("@/assets/graphics/icons/link/" + filename);
    }
  },
  methods: {
    setHovering: function (val) {
      this.hovering = val;
    }
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.WidgetIcon{
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

img{
  width: 100%;
}

</style>
