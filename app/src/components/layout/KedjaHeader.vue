<template>
  <div class="KedjaHeader">

    <kedja-logo></kedja-logo>

    <slot>
    </slot>

  </div>
</template>

<script>

//import Component from '@/components/Component'
import KedjaLogo from '@/components/KedjaLogo'

export default {
  name: 'KedjaHeader',
  components: {
    KedjaLogo
  },
  data () {
    return {
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.KedjaHeader{
}

</style>
