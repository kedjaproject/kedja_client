<template>
  <div class="ViewProfile">

    <kedja-header>
    </kedja-header>

    <div class="viewContent">
      Du är inloggad som

      <h2>
        {{userData.first_name}} {{userData.last_name}}
      </h2>

      <h3>Uppdatera profil</h3>

      <form @submit.prevent="updateProfile">
        <label>
          <input type="text" v-model="userDataEditable.first_name" placeholder="Förnamn" />
        </label>
        <label>
          <input type="text" v-model="userDataEditable.last_name" placeholder="Efternamn" />
        </label>
        <button type="submit">Spara ändringar</button>
      </form>

    </div>

  </div>
</template>

<script>

import KedjaHeader from '@/components/layout/KedjaHeader'
// import Component from '@/components/Component'

export default {
  name: 'ViewProfile',
  components: {
    KedjaHeader
  },
  data () {
    return {
      userDataEditable: ''
    }
  },
  props: {
  },
  computed: {
    userData () {
      return this.$store.getters.getUserData
    }
  },
  methods: {
    getUserProfile () {
      let params = {
        endpoint: 'users/' + this.userData.userid,
        successCallback: (response) => {
          this.userDataEditable = response.data.data
        }
      }

      this.$store.commit('makeAPICall', params)
    },
    updateProfile () {
      let params = {
        endpoint: 'users/' + this.userData.userid,
        method: 'put',
        data: {
          first_name: this.userDataEditable.first_name,
          last_name: this.userDataEditable.last_name
        },
        successCallback: (response) => {
          this.$store.dispatch('setUserData', {field: 'first_name', value: response.data.data.first_name})
          this.$store.dispatch('setUserData', {field: 'last_name', value: response.data.data.last_name})
        }
      }

      this.$store.commit('makeAPICall', params)
    }
  },
  created: function () {

  },
  mounted: function () {
    this.getUserProfile()
  }
}
</script>

<style scoped>

.ViewProfile{
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
