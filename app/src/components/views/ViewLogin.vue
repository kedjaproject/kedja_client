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

        <h2 v-for="method in methods">
          <a :href="method.url">{{method.title}}</a>
        </h2>


    </div>

  </div>
</template>

<script>

import KedjaHeader from '@/components/layout/KedjaHeader'
//import Component from '@/components/Component'

export default {
  name: 'ViewLogin',
  components: {
    KedjaHeader
  },
  data () {
    return {
      email: "",
      pass: "",
      methods: ""
    }
  },
  props: {
  },
  computed: {
    auth: function () {
      return this.$store.getters.getAuth;
    }
  },
  methods: {
    getLoginMethods: function () {
      let params = {
        endpoint: "auth/methods",
        successCallback: (response) => {
          this.methods = response.data;
        }
      }

      this.$store.commit('makeAPICall',params);
    },
    login: function (e) {
      this.$store.dispatch('setAuth', {auth: this.email});
      this.$router.push({ name: 'LoggedIn'})
    },
    loggedIn: function () {
      if(this.auth){
        this.$router.push({ name: 'LoggedIn'})
      }
    }
  },
  created: function () {
    this.loggedIn();
  },
  mounted: function () {
    this.getLoginMethods();
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
