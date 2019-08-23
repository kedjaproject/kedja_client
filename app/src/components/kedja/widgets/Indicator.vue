<template>
  <div class="Indicator">
    <input type="number" min="-1" max="2" ref="valuePicker" :value="value" @change="updateValue()"/>
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
    value: ''
  },
  computed: {
  },
  methods: {
    updateValue () {
      this.$emit('change', this.$refs.valuePicker.value)
    }
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.ComponentTemplate{
}

</style>
