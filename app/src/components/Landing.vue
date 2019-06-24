<template>
  <div class="Landing">

    <wall :wall="walls[activeWallId]" v-if="walls[activeWallId]"></wall>

    <pre>
      {{walls[activeWallId]}}
    </pre>

  </div>
</template>

<script>

import Wall from '@/components/kedja/Wall'

export default {
  name: 'Landing',
  components: {
    Wall
  },
  data () {
    return {
    }
  },
  props: {
  },
  computed: {
    walls: function () {
      return this.$store.state.walls
    },
    activeWallId: function () {
      return this.$store.state.activeWallId
    }
  },
  methods: {
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.Landing{
}

</style>
