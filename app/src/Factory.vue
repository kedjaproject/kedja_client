
<script>

  export default {
    Wall: function (data) {
      return {
        name: "Ny vägg",
        collections: []
      }
    },
    Collection: function (data) {
      return {
        name: "Ny samling",
        cards: []
      }
    },
    Card: function (data) {
      return {
        name: "Nytt kort",
        id: ""
      }
    },
  }

</script>
