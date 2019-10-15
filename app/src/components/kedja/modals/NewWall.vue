<template>
  <div>
    <header>
      <h1>Ny vägg</h1>
    </header>

      <button @click="createWallAndRedirect()">
        Tom vägg
      </button>

      <h2>Skapa från mall</h2>

      <div>
        <!-- title, created, id -->
        <button :key="template.id" v-for="template in templates" @click="createWallAndRedirect(template.id)">
          {{ template.title }}
        </button>
      </div>

  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { kedjaAPI, closeModal } from '@/utils'

export default {
  name: 'NewWall',
  data () {
    return {
      templates: []
    }
  },
  created () {
    kedjaAPI.get('templates')
      .then(response => {
        this.templates = response.data
      })
  },
  computed: {
  },
  methods: {
    ...mapMutations('walls', ['setWall']),
    createWallAndRedirect (templateID) {
      let request
      if (templateID) {
        // Create from template
        request = kedjaAPI.post('templates/' + templateID)
      } else {
        // Create blank wall
        request = kedjaAPI.post('walls', {title: 'Ny vägg'})
      }
      request.then(response => {
        this.setWall(response.data)
        this.$router.push({name: 'ViewWall', params: {wallId: response.data.rid}})
        closeModal()
      })
    }
  }
}
</script>
<style lang="sass">

</style>
