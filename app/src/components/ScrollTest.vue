<template>
  <div class="ComponentTemplate">

    <div class="outer">
      <div class="content">
        <div class="item">
          Item
        </div>
        <div class="item">
          Item
        </div>
        <div class="item">
          Item
        </div>
        <div class="item">
          Item
        </div>
      </div>
      <div class="overlay">

      </div>
    </div>

  </div>
</template>

<script>

// import { store } from '@/store';
// import Component from '@/components/Component'

export default {
  name: 'ComponentTemplate',
  /*
  components: {
    Component
  },
  */
  data () {
    return {
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style scoped>

.ComponentTemplate{
  width: 500px;
  height: 300px;
  background: #eee;
  display: flex;
  flex-direction: row;
}

.outer{
  background: #ff000022;
  flex: 1;
  overflow-x: scroll;
}

.content{
  background: #00ff0022;
  /*display: flex;*/
  display: inline-flex;
  flex-direction: row;
  width: auto;
}

.item{
  /*flex: 0 0 200px;*/
  display: inline;
  width: 300px;
  background: #0000ff22;
}

</style>
