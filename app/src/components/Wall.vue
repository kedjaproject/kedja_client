<template>
  <div class="Wall">

    <h1>
      {{wall.name}}
    </h1>

    <collection v-for="collection in wall.collections" :collection="collection"></collection>

  </div>
</template>

<script>

import Collection from '@/components/Collection'

export default {
  name: 'Wall',
  components: {
    Collection
  },
  data () {
    return {
    }
  },
  props: {
    wall: ""
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Wall{

}

</style>
