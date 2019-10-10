<template>
  <div class="UsersList">
    <header>
      <h1>Users</h1>
    </header>
    <div class="UserRow" :key="user.rid" v-for="user in users">
      <img class="UserPicture" :src="user.data.picture" height="100" width="100" />
      <span class="UserName">
        {{ user.data.first_name }}
        {{ user.data.last_name }}
      </span>
      <span class="UserEmail">
        {{ user.data.email }}
      </span>
    </div>
  </div>

</template>
<script>
// import { mapMutations } from 'vuex'
import { kedjaAPI } from '@/utils'

export default {
  name: 'UsersList',
  data () {
    return {
      users: []
    }
  },
  created () {
    kedjaAPI.get('users')
      .then(response => {
        this.users = response.data
      })
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style scoped lang="sass">

.UsersList

  .UserRow
    display: flex
    flex-direction: row
    flex-wrap: wrap
    padding-bottom: 10px;

    .UserPicture
      flex: none
      margin: 0 30px 5px 0
      max-width: 35px
      max-height: 35px

    .UserName
      flex: 1 0
      margin: 0 10px 10px 0

    .UserEmail
      flex: 1 0
      margin: 0 0 10px 0
</style>
