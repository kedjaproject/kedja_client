<template>
  <div class="KedjaLogo">
    <router-link :to="{ name: 'Home', params: {} }">
      KEDJA.
    </router-link>
  </div>
</template>

<script>

// import Component from '@/components/Component'

export default {
  name: 'KedjaLogo',
  /*
  components: {
    Component
  },
  */
  data () {
    return {
    }
  },
  props: {
  },
  computed: {
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style scoped>

.KedjaLogo{
  font-size: 20pt;
  font-weight: bold;
  color: gray;
  display: inline-block;
  margin-right: 20px;
}

</style>
