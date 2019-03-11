<template>
  <div class="Collection">

    <h2>
      {{collection.name}}
    </h2>

    <card v-for="card in collection.cards" :card="card" class="card"></card>

    <button @click="createCard">Lägg till nytt kort</button>

  </div>
</template>

<script>

import { store } from '@/store';
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
  },
  methods: {
    createCard: function () {
      store.commit('createCardInCollection',{collection: this.collection});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Collection{
  border: 1px solid #EAEAEA;
  padding: 20px;
  background: #CADBDA;
  cursor: pointer;
}

.Collection:hover{
  background: #ACCECC;
}

.card{
  margin: 5px 0 5px 0;
}

button{
width: 100%;}

</style>
