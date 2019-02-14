<template>
  <div class="Card">
    {{card.name}}
  </div>
</template>

<script>
export default {
  name: 'Card',
  data () {
    return {
    }
  },
  props: {
    card: ""
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.Card{

}

</style>
