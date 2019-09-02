<template>
  <div id="wall-user-modal">
    <header>
      <h1>Sök användare</h1>
      <p>Lägg till användare på väggen <em>{{ wall.data.title }}</em>.</p>
    </header>
    <form @submit.prevent>
      <input type="search" placeholder="Sök på namn..." v-model="query" />
    </form>
    <div class="results">
      <h2 v-if="query" aria-live="assertive">{{ resultText }}</h2>
      <div class="result" v-for="(user, i) in results" :key="user.rid">
        <h3><user-button :color="userColor(i)" :user="user" small no-click /> {{ user.data.fullName }}</h3>
        <button class="remove-user-button" @click="removeUser({wall, user})" v-if="wall.userList.includes(user.rid)">- Ta bort användare</button>
        <button class="add-user-button" @click="addUser({wall, user})" v-else>+ Lägg till användare</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { getUserColor } from '@/utils'
import UserButton from '../widgets/UserButton'

export default {
  name: 'WallUserAdmin',
  components: {
    UserButton
  },
  data () {
    return {
      query: ''
    }
  },
  props: {
    data: Object
  },
  computed: {
    wall () {
      return this.data.wall
    },
    results () {
      if (!this.query) return []
      return this.data.users.filter(user => {
        return this.query.toLowerCase().split(/\s+/).every(str => user.data.fullName.toLowerCase().includes(str))
      })
    },
    resultText () {
      return this.results.length
        ? 'Visar ' + this.results.length + ' resultat'
        : 'Inga resultat'
    },
    ...mapGetters('users', ['currentUser'])
  },
  methods: {
    userColor (index) {
      return getUserColor(index)
    },
    ...mapMutations('walls', ['addUser', 'removeUser'])
  },
  mounted () {
    this.$el.querySelector('input').focus()
  }
}
</script>
<style lang="sass">
#wall-user-modal
  .results
    margin-top: 1rem
    border-top: 1px solid #ddd

  .result
    margin-bottom: 1rem
    h3
      display: inline
    button.add-user-button,
    button.remove-user-button
      margin-left: 15px
    button.add-user-button
      background-color: #efe
    button.remove-user-button
      background-color: #fee
    .user-button
      vertical-align: text-top
      margin-right: 10px
</style>
