<template>
  <div class="RecursiveAPI">

    <pre>
      {{apiData}}
    </pre>

  </div>
</template>

<script>

import { store } from '@/store';

//import Component from '@/components/Component'

export default {
  name: 'RecursiveAPI',
  /*components: {
    Component
  },*/
  data () {
    return {
      apiData: ""
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
    getData: function () {

      let params = {
        endpoint: "recursive_read/1",
        //endpoint: "create/Wall/1",
        successCallback: (data) => {
          this.successCallbackGetWalls(data);
        },
      }
      store.commit('makeAPICall', params);

    },
    successCallbackGetWalls: function (data) {
      console.log(data)
      this.apiData = data;
    },
  },
  mounted: function () {
    this.getData();
  }
}
</script>

<style scoped>

.RecursiveAPI{
}

</style>
