<template>
  <div class="ContextMenuCard">

    <!--pre>
      {{card}}
    </pre-->

    <div class="header">
      <input v-model="card.data.title" class="h2" @change="updateTitle()"/>
      <card-button @click.native="removeCard()">🗑️</card-button>
    </div>

    <hr />

    <h3>
      Beskrivning
    </h3>
    <textarea placeholder="Lägg till beskrivning" readonly>Här kommer du att kunna lägga till en kortare beskrivning av kortet i fritextfält.</textarea>

    <h3>
      Åtgärder
    </h3>
    <p>
      Här kommer du att kunna ladda upp bilagor såsom pdf:er, bilder etc. som har med kortet att göra. Här hittar du även funktioner som hjälper dig att organisera och struktura kortet med:
      <ul>
        <li>
          ansvarig (användare som ansvarar för specifikt kort.
        </li>
        <li>
          indikator (knapp med 3 lägen som påvisar kortets status; planerad/påbörjad/avslutad)
        </li>
        <li>
          slutdatum (datum då kortets aktivitet ska/bör vara uppfylld)
        </li>
      </ul>
    </p>

    <h3>Kommentarer</h3>
    <p>
      Här kommer du att kunna kommentera tankar och ändringar som rör kortet med andra användare.
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
