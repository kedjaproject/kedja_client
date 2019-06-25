<template>
  <div class="ViewRegister">

    <kedja-header>
    </kedja-header>

    <div class="viewContent">

      <h2>Registrera nytt konto</h2>

      <p>
        Du behöver registrera ett konto på Kedja för att fortsätta inloggningen.
      </p>

      <p>
        <a href="">Läs användaravtal</a> för registrering och användning av Kedja.
      </p>

      <form @submit.prevent="register">
        <label >
          <input type="checkbox" /> Jag går med på allt.
        </label>
        <button type="submit">Sälj min själ</button>
      </form>

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
    registerToken: function () {
      return this.$route.query.t;
    }
  },
  methods: {
    register: function () {
      let params = {
        endpoint: "auth/register/" + this.registerToken,
        method: "post",
        successCallback: (response) => {
          console.log(response)
          this.$store.dispatch('login', {auth: response.data.Authorization, userid: response.data.userid, first_name: response.data.user.data.first_name, last_name: response.data.user.data.last_name});
          //this.$store.dispatch('setUserData', {field: "auth", value: response.data.Authorization});
          //this.$store.dispatch('setUserData', {field: "userid", value: response.data.userid});
          this.$router.push({name: "Home"})
        }
      }

      this.$store.commit('makeAPICall',params);
    }
  },
  created: function () {
  },
  mounted: function () {
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
