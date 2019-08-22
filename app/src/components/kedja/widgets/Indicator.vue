<template>
  <div class="Indicator">

    <select ref="valuePicker" v-model="value">
      <option>
        1
      </option>
    </select>


  </div>
</template>

<script>

//import { store } from '@/store';
//import Component from '@/components/Component'

export default {
  name: 'ComponentTemplate',
  /*components: {
    Component
  },*/
  data () {
    return {
    }
  },
  props: {
    value: -1
  },
  computed: {
  },
  methods: {
    updateValue() {
      this.$emit('input',
        month: +this.$refs.monthPicker.value,
        year: +this.$refs.yearPicker.value
      })
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
