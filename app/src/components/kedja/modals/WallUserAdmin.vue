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
        <h3><user-button :color="userColor(i)" :user="user" small no-click /> {{ user.fullName }}</h3>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
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
      return this.data.fakeUsers.filter(user => {
        return this.query.toLowerCase().split(/\s+/).every(str => user.fullName.toLowerCase().includes(str))
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
    }
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

  .result .user-button
    vertical-align: text-top
    margin-right: 10px
</style>
