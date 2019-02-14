<template>
  <div class="Landing">

    <wall :wall="walls[activeWallId]"></wall>

  </div>
</template>

<script>

import { store } from '@/store';

import Wall from '@/components/Wall'

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
      return store.state.walls
    },
    activeWallId: function () {
      return store.state.activeWallId
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
