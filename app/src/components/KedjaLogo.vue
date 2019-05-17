<template>
  <div class="KedjaLogo">
    <router-link :to="{ name: 'WallList', params: {} }">
      KEDJA.
    </router-link>
  </div>
</template>

<script>

//import Component from '@/components/Component'

export default {
  name: 'KedjaLogo',
  /*components: {
    Component
  },*/
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

.KedjaLogo{
  font-size: 30pt;
  font-weight: bold;
  color: gray;
}

</style>
