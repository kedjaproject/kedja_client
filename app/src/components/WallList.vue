<template>
  <div class="WallList">

    <pre>
      {{walls}}
    </pre>

  </div>
</template>

<script>

import { store } from '@/store';

//import Component from '@/components/Component'

export default {
  name: 'WallList',
  /*components: {
    Component
  },*/
  data () {
    return {
      walls: ""
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
    getWalls: function () {

      let params = {
        endpoint: "list/Wall/1",
        //endpoint: "create/Wall/1",
        successCallback: (data) => {
          this.successCallbackGetWalls(data);
        },
      }
      store.commit('makeAPICall', params);

    },
    successCallbackGetWalls: function (data) {
      console.log(data)
      this.walls = data;
    },
  },
  mounted: function () {
    this.getWalls();
  }
}
</script>

<style scoped>

.WallList{
}

</style>
