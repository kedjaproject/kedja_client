<template>
  <div class="ViewHome">

    <kedja-header>
    </kedja-header>

    <div class="viewContent">
      HEM
    </div>

  </div>
</template>

<script>

import KedjaHeader from '@/components/layout/KedjaHeader'
//import Component from '@/components/Component'

export default {
  name: 'ViewHome',
  components: {
    KedjaHeader
  },
  data () {
    return {
    }
  },
  props: {
  },
  computed: {
    userData: function () {
      return this.$store.getters.getUserData;
    }
  },
  methods: {
    loggedIn: function () {
      if(this.userData.userid){
        this.$router.push({ name: 'Walls'})
      }
      else{
        this.$router.push({ name: 'Login'})
      }
    }
  },
  created: function () {
    this.loggedIn();
  },
  mounted: function () {
  }
}
</script>

<style scoped>

.ViewHome{
  /* LAYOUT */
  display: flex;
  flex-direction: column;
}

.viewContent{

  flex: 1;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

}

</style>
