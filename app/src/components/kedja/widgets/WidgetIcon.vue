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
  data () {
    return {
      hovering: false
    }
  },
  props: {
    active: Boolean,
    path: String,
    img: String,
    imgHover: String,
    imgActive: String
  },
  computed: {
    image () {
      let filename = ''
      if (this.active) {
        filename = this.imgActive
      } else if (this.hovering) {
        filename = this.imgHover
      } else {
        filename = this.img
      }

      // return this.path + filename;
      return this.path + filename
      // return require("@/assets/graphics/icons/link/" + filename);
    }
  },
  methods: {
    setHovering (val) {
      this.hovering = val
    }
  },
  mounted () {
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
