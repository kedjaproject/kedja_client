<template>
  <div class="ViewLogin">

    <kedja-header>
    </kedja-header>

    <div class="viewContent">
      <h1>
        KEDJA.
      </h1>

      <!--form @submit.prevent="login">
        <input name="email" type="email" v-model="email" placeholder="E-mail..." required/>
        <input name="password" type="password" v-model="pass" placeholder="Lösenord..." required/>
        <button>Logga in</button>
      </form-->

      <h3>Logga in / Registrera nytt konto med</h3>

        <h2 v-for="(method, k) in methods" :key="k">
          <a :href="loginUrl(method)">{{method.title}}</a>
        </h2>

    </div>

  </div>
</template>

<script>

import KedjaHeader from '@/components/layout/KedjaHeader'
import { mapGetters } from 'vuex'
import { makeAPICall } from '@/utils'
// import Component from '@/components/Component'

export default {
  name: 'ViewLogin',
  components: {
    KedjaHeader
  },
  data () {
    return {
      email: '',
      pass: '',
      methods: ''
    }
  },
  props: {
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  methods: {
    loginUrl: function (method) {
      return method.url + '?came_from=' + window.location.origin
    },
    getLoginMethods () {
      makeAPICall('auth/methods')
        .then(response => {
          this.methods = response.data
        })
    },
    /*
    login: function (e) {
      this.$store.dispatch('setAuth', {auth: this.email});
      this.$router.push({ name: 'LoggedIn'})
    },
    */
    loggedIn () {
      if (this.isAuthenticated) {
        this.$router.push({name: 'Home'})
      }
    }
  },
  created () {
    this.loggedIn()
  },
  mounted () {
    this.getLoginMethods()
  }
}
</script>

<style scoped>

.ViewLogin{
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
