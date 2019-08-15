<template>
  <div class="RouterLinkBox" :style="{'background-color': color}">

    <router-link :to="to" class="link">
      <slot>
      </slot>
    </router-link>

  </div>
</template>

<script>

// import { store } from '@/store';
// import Component from '@/components/Component'

export default {
  name: 'RouterLinkBox',
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
    text: '',
    color: '',
    to: ''
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

.RouterLinkBox{
}

.RouterLinkBox:hover{
  filter: saturate(3);
}

.link{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
