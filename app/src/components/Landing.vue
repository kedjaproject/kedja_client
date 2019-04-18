<template>
  <div class="Landing">

    <wall :wall="walls[activeWallId]" v-if="walls[activeWallId]"></wall>

    <!--pre>
      {{walls[activeWallId]}}
    </pre-->

  </div>
</template>

<script>

import { store } from '@/store';

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
