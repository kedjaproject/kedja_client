<template>
  <div class="Indicator" @click="onclick($event)">
    <img :src="image" alt="Indikator" />
  </div>
</template>

<script>

// import { store } from '@/store';
// import Component from '@/components/Component'

export default {
  name: 'Indicator',
  props: {
    value: Number,
    min: {default: -1},
    max: {default: 2},
    selected: Boolean
  },
  computed: {
    image () {
      return '/static/graphics/icons/indicator/' +
        'KEDJA_Indikator, steg ' + (this.value + 1) +
        (this.selected ? ', markerat' : ', ej markerat') + ' kort.png'
    }
  },
  methods: {
    onclick (e) {
      if (this.selected) {
        e.stopPropagation()
        this.increaseValue()
      }
    },
    increaseValue () {
      let valueTemp = this.value + 1
      if (valueTemp > this.max) {
        valueTemp = this.min
      }
      this.$emit('change', valueTemp)
      this.$emit('input', valueTemp)
    }
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
