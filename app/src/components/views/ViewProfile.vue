<template>
  <div class="ViewProfile">

    <kedja-header>
    </kedja-header>

    <div class="viewContent">
      Du är inloggad som

      <h2>
        {{currentUser.data.fullName}}
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
import { kedjaAPI } from '@/utils'
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
// import Component from '@/components/Component'

export default {
  name: 'ViewProfile',
  components: {
    KedjaHeader
  },
  data () {
    return {
      userDataEditable: {}
    }
  },
  props: {
  },
  computed: {
    ...mapGetters('users', ['currentUser']),
    ...mapState('users', ['currentUserId'])
  },
  methods: {
    ...mapMutations('users', ['setUserData']),
    ...mapActions('users', ['fetchUserData']),
    setDataEditable (data) {
      this.userDataEditable = {
        first_name: data.first_name,
        last_name: data.last_name
      }
    },
    updateProfile () {
      kedjaAPI.put('users/' + this.currentUserId, this.userDataEditable)
        .then(response => {
          this.setUserData(response.data)
          this.setDataEditable(response.data.data)
        })
    }
  },
  created () {
    // This does not work from data() for some reason...
    if (this.currentUser) {
      this.setDataEditable(this.currentUser.data)
    } else {
      this.$router.push('/login')
    }
  },
  mounted () {
    // API does not work, currently
    // this.getUserProfile()
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
