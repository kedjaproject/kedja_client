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
import { mapGetters } from 'vuex'

export default {
  name: 'ViewHome',
  components: {
    KedjaHeader
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  methods: {
    loggedIn () {
      if (this.isAuthenticated) {
        this.$router.push({name: 'Walls'})
      } else {
        this.$router.push({name: 'Login'})
      }
    }
  },
  created () {
    this.loggedIn()
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
