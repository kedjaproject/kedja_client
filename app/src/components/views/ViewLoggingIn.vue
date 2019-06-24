<template>
  <div class="ViewRegister">

    <kedja-header>
    </kedja-header>

    <div class="viewContent">

      Du är inloggad med auth {{auth}}

    </div>




  </div>
</template>

<script>

import KedjaHeader from '@/components/layout/KedjaHeader'
//import Component from '@/components/Component'

export default {
  name: 'ViewRegister',
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
    auth: function () {
      return this.$store.getters.getAuth;
    },
    userid: function () {
      return this.$route.query.u;
    },
    token: function () {
      return this.$route.query.t;
    }
  },
  methods: {
    login: function () {
      let params = {
        endpoint: "auth/credentials/" + this.userid + "/" + this.token,
        method: "post",
        successCallback: (response) => {
          this.$store.dispatch('setAuth', {auth: response.data.Authorization});
          this.$router.push({name: "LoggedIn"})
        }
      }

      this.$store.commit('makeAPICall',params);
    }
  },
  created: function () {
  },
  mounted: function () {
    this.login();
  }
}
</script>

<style scoped>

.ViewRegister{
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

form{
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

form * {
    margin-bottom: 10px;
}

</style>
