<template>
  <div class="ViewLoggingIn">

    <kedja-header>
    </kedja-header>

    <div class="viewContent">
      Du loggas in.
    </div>

  </div>
</template>

<script>

import KedjaHeader from '@/components/layout/KedjaHeader'
// import Component from '@/components/Component'

export default {
  name: 'ViewLoggingIn',
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
    auth () {
      return this.$store.getters.getAuth
    },
    userid () {
      return this.$route.query.u
    },
    token () {
      return this.$route.query.t
    }
  },
  methods: {
    login () {
      let params = {
        endpoint: 'auth/credentials/' + this.userid + '/' + this.token,
        method: 'post',
        successCallback: (response) => {
          console.log(response)
          this.$store.dispatch('login', {auth: response.data.Authorization, userid: response.data.userid, first_name: response.data.user.data.first_name, last_name: response.data.user.data.last_name})
          // this.$store.dispatch('setUserData', {field: "auth", value: response.data.Authorization})
          // this.$store.dispatch('setUserData', {field: "userid", value: response.data.userid})
          this.$router.push({name: 'Home'})
        }
      }

      this.$store.commit('makeAPICall', params)
    }
  },
  created () {
  },
  mounted () {
    this.login()
  }
}
</script>

<style scoped>

.ViewLoggingIn{
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
