<template>
  <div class="CardSeed">

    <div class="main">
      <EditableInput v-model="title" tag="h3" :placeholder="'Ange namn för kortet'" @change="updateTitle($event)" @cancel="cancel" ref="editinput"></EditableInput>
    </div>

  </div>
</template>

<script>

import EditableInput from '@/components/general/EditableInput'

export default {
  name: 'CardSeed',
  components: {
    EditableInput
  },
  data () {
    return {
      title: ''
    }
  },
  props: {
  },
  computed: {
    userState () {
      return this.$store.getters.getUserState
    }
  },
  watch: {
  },
  methods: {
    updateTitle (title) {
      this.title = ''
      if (title !== '') {
        this.$emit('create', title)
        // this.$refs.editinput.openEdit()
      } else {
        this.cancel()
      }
    },
    cancel () {
      this.$refs.editinput.clearTemp()
      this.$emit('cancel')
    },
    setFocus () {
      this.$refs.editinput.openEdit()
    }
  },
  created: function () {
  },
  mounted: function () {
    // this.setFocus()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.CardSeed{
  /*border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;*/
  background: #FFFFFF;
  /*transition: all 0.1s;*/
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  cursor: pointer;
}

.main{
  flex: 1;
  padding: 10px;
}

</style>
