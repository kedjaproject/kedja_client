<template>
  <div class="KedjaHeader">

    <kedja-logo></kedja-logo>

    <div class="slot">

      <slot>
      </slot>

      <!--span>{{userState}}</span-->

    </div>

    <div class="user">
      <div v-if="userData.userid">
        <drop-down :items="[{label: 'Min profil', f: goToProfile},{label: 'Mina väggar', f: goToWalls},{label: 'Logga ut', f: logout}]">
          <div class="right">
            <span v-if="userFullName.length">{{userFullName}}</span>
            <span v-else>Inloggad användare</span>
          </div>
        </drop-down>
      </div>

    </div>

  </div>
</template>

<script>

import KedjaLogo from '@/components/KedjaLogo'
import DropDown from '@/components/DropDown'

export default {
  name: 'KedjaHeader',
  components: {
    KedjaLogo,
    DropDown
  },
  data () {
    return {
    }
  },
  props: {
  },
  computed: {
    userState () {
      return this.$store.getters.getUserState
    },
    userData () {
      return this.$store.getters.getUserData
    },
    userFullName () {
      if (this.userData.first_name && this.userData.last_name) {
        return this.userData.first_name + ' ' + this.userData.last_name
      }
    }
  },
  methods: {
    goToProfile (e) {
      this.$router.push({name: 'Profile'})
    },
    goToWalls (e) {
      this.$router.push({name: 'Walls'})
    },
    logout (e) {
      let params = {
        endpoint: 'auth/logout',
        method: 'post',
        successCallback: (response) => {
          this.$store.dispatch('logout')
          this.$router.push({name: 'Login'})
        }
      }
      this.$store.commit('makeAPICall', params)
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

.KedjaHeader{
  display: flex;
  flex-direction: row;
}

.slot{
  flex: 1;
}

.user{
  flex: 0 1 200px;
}

.right{
  text-align: right;
}

</style>
