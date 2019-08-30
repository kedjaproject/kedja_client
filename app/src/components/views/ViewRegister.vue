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
// import Component from '@/components/Component'
import { kedjaAPI } from '@/utils'

export default {
  name: 'ViewRegister',
  components: {
    KedjaHeader
  },
  computed: {
    registerToken: function () {
      return this.$route.query.t
    }
  },
  methods: {
    register: function () {
      kedjaAPI.post('auth/register/' + this.registerToken)
        .then(response => {
          console.log(response)
          this.$store.dispatch('login', response.data)
          this.$router.push({name: 'Home'})
        })
    }
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
