<template>
  <div class="ContextMenuCard">

    <div class="header">
      <input v-model="card.data.title" class="h2" @change="updateTitle()"/>
      <card-button @click.native="removeCard()">🗑️</card-button>
    </div>

    <hr />

    <h3>
      Beskrivning
    </h3>
    <p>
      Denna funktion är under utveckling
    </p>
    <textarea placeholder="Lägg till beskrivning"></textarea>

    <h3>
      Åtgärder
    </h3>
    <p>
      Denna funktion är under utveckling
    </p>

    <h3>Kommentarer</h3>
    <p>
      Denna funktion är under utveckling
    </p>

  </div>
</template>

<script>

import CardButton from '@/components/kedja/CardButton'
//import Component from '@/components/Component'

export default {
  name: 'ContextMenuCard',
  components: {
    CardButton
  },
  data () {
    return {
    }
  },
  props: {
    card: ""
  },
  computed: {
    collection: function () {
      return this.$store.getters.getCollectionByCard(this.card)
    }
  },
  methods: {
    updateTitle: function (title) {
      let params = {
        endpoint: "collections/" + this.collection.rid + "/cards/" + this.card.rid,
        data: {title: this.card.data.title},
        method: "put",
        successCallback: (data) => {
          console.log(data.data)
        },
      }

      this.$store.commit('makeAPICall',params);
    },
    removeCard: function () {
      //this.$store.commit('removeCardFromCollection',{collection: this.collection, card: card});
      let params = {
        endpoint: "collections/" + this.collection.rid + "/cards/" + this.card.rid,
        method: "delete",
        successCallback: (data) => {
          console.log(data)

          let index = this.collection.cards.indexOf(this.card)
          if(index != -1){
            this.collection.cards.splice(index,1)
          }

        },
      }

      this.$store.commit('makeAPICall',params);
    },
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.ContextMenuCard{
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.header{
  display: flex;
  flex-direction: row;
}

</style>
