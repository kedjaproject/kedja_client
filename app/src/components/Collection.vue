<template>
  <div class="Collection">

    <h2>
      {{collection.name}}
    </h2>

    <card v-for="card in collection.cards" :card="card" class="card"></card>

  </div>
</template>

<script>

import Card from '@/components/Card'

export default {
  name: 'Collection',
  components: {
    Card
  },
  data () {
    return {
    }
  },
  props: {
    collection: ""
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Collection{
  border: 1px solid white;
  padding: 5px;
  background: #CADBDA;
}

.card{
  margin: 5px 0 5px 0;
}

</style>
