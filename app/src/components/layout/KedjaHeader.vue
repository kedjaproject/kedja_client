<template>
  <div class="KedjaHeader">

    <kedja-logo></kedja-logo>

    <div class="slot">
      <slot>
      </slot>
    </div>

    <div class="user">
      <div v-if="userData.userid">
        <drop-down :items="[{label: 'Min profil', f: goToProfile},{label: 'Mina väggar', f: goToWalls},{label: 'Logga ut', f: logout}]">
          <div class="right">
            <router-link :to="{ name: 'Profile'}">
              {{userData.userid}}
            </router-link>
          </div>
        </drop-down>
      </div>
      <div v-else>
        <router-link :to="{ name: 'Login'}">Logga in</router-link>
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
    userData: function () {
      return this.$store.getters.getUserData;
    }
  },
  methods: {
    goToProfile: function (e) {
      this.$router.push({ name: 'Profile'})
    },
    goToWalls: function (e) {
      this.$router.push({ name: 'Walls'})
    },
    logout: function (e) {
      this.$store.dispatch('logout');
      this.$router.push({ name: 'Login'})
    }
  },
  mounted: function () {
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
  align-items: flex-end;
}

.right{
  text-align: right;
}

</style>
