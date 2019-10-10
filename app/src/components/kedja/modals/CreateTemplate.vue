<template>
  <div v-if="done">
    <header>
      <h1>Klart!</h1>
      <p>Mallen {{ title }} är skapad</p>
    </header>
  </div>
  <div v-else>
    <header>
      <h1>Skapa mall</h1>
    </header>
    <form @submit.prevent="createTemplate">
      <label for="template_title">Namn på mallen</label>
      <input v-model="title" id="template_title" required />
      <button>Skapa mall</button>
    </form>
  </div>
</template>
<script>
import { kedjaAPI } from '@/utils'

export default {
  name: 'CreateTemplate',
  props: {
    data: Object
  },
  data () {
    return {
      title: this.data.data.title,
      done: false
    }
  },
  methods: {
    createTemplate () {
      kedjaAPI.post('templates', {rid: this.data.rid, title: this.title})
        .then(response => {
          this.done = true
        })
    }
  }
}
</script>
<style lang="sass" scoped>
form
  margin: 2em 0
  label
    display: block
    font-size: 20px
    margin-bottom: .2em
  input
    display: block
    font-size: 20px
    margin-bottom: .8em
</style>
