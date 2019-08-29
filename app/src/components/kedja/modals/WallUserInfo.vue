<template>
  <div id="wall-user-modal">
    <header>
      <h1>{{ user.fullName }}</h1>
      <p v-if="isCurrentUser">Det är du.</p>
      <p v-else>Användare på väggen <em>{{ wall.data.title }}</em>.</p>
    </header>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'WallUserInfo',
  props: {
    data: Object
  },
  computed: {
    user () {
      return this.data.user
    },
    wall () {
      return this.data.wall
    },
    isCurrentUser () {
      return this.user.rid === this.currentUser.rid
    },
    ...mapGetters('users', ['currentUser'])
  }
}
</script>
<style lang="sass">
#wall-user-modal
  header
    p
      font-size: 18px
</style>
