<template>
  <div class="Indicator" @click="increaseValue">
    <img :src="image" alt="Indikator" />
  </div>
</template>

<script>

// import { store } from '@/store';
// import Component from '@/components/Component'

export default {
  name: 'ComponentTemplate',
  /*
  components: {
    Component
  },
  */
  data () {
    return {
    }
  },
  props: {
    value: "",
    min: {default: -1},
    max: {default: 2},
    selected: false
  },
  computed: {
    image: function () {
      let filename = ""
      if(this.value == -1){
        filename += this.selected ? "KEDJA_Indikator, steg 0, markerat kort" : "KEDJA_Indikator, steg 0, ej markerat kort"
      }
      else if(this.value == 0){
        filename += this.selected ? "KEDJA_Indikator, steg 1, markerat kort" : "KEDJA_Indikator, steg 1, ej markerat kort"
      }
      else if(this.value == 1){
        filename += this.selected ? "KEDJA_Indikator, steg 2, markerat kort" : "KEDJA_Indikator, steg 2, ej markerat kort"
      }
      else if(this.value == 2){
        filename += this.selected ? "KEDJA_Indikator, steg 3, markerat kort" : "KEDJA_Indikator, steg 3, ej markerat kort"
      }
      filename += ".png"

      return require("@/assets/graphics/icons/indicator/" + filename);
    }
  },
  methods: {
    emitChangedValue (v) {
      this.$emit('change',v)
    },
    increaseValue () {
      let valueTemp = this.value + 1;
      if(valueTemp > this.max){
        valueTemp = this.min;
      }
      this.$emit('input',valueTemp)
      this.emitChangedValue(valueTemp)
    }
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.Indicator{
  cursor: pointer;
}

img{
  width: 70px;
}

</style>
