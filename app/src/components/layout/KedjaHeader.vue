<template>
  <div class="KedjaHeader">

    <kedja-logo />

    <div class="slot">

      <slot>
      </slot>

      <!--span>{{userState}}</span-->

    </div>

    <div class="user">
      <div v-if="isAuthenticated">
        <drop-down :items="[{label: 'Min profil', f: goToProfile},{label: 'Mina väggar', f: goToWalls},{label: 'Logga ut', f: logout}]">
          <div class="right">
            <user-button :user="currentUser" />
          </div>
        </drop-down>
      </div>

    </div>

  </div>
</template>

<script>

import KedjaLogo from '@/components/KedjaLogo'
import DropDown from '@/components/DropDown'
import UserButton from '@/components/kedja/widgets/UserButton'
import { kedjaAPI } from '@/utils'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'KedjaHeader',
  components: {
    KedjaLogo,
    DropDown,
    UserButton
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    ...mapGetters('users', ['currentUser']),
    ...mapState(['userState'])
  },
  methods: {
    goToProfile () {
      if (this.$route.name !== 'Profile') {
        this.$router.push({name: 'Profile'})
      }
    },
    goToWalls () {
      if (this.$route.name !== 'Walls') {
        this.$router.push({name: 'Walls'})
      }
    },
    logout () {
      kedjaAPI.post('auth/logout')
        .then(response => {
          this.$store.dispatch('logout')
          this.$router.push({name: 'Login'})
        })
    }
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
