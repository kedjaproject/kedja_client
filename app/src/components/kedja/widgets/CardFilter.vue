<template>
  <div class="CardFilter">
    <widget-icon path="/static/graphics/icons/filter/" img="KEDJA_Filter off.png" imgHover="KEDJA_Filter off hover.png" imgActive="KEDJA_Filter off aktiv.png" :active="!filterCards" @click.native="setFilterCards(false)" title="Visa samtliga kort" alt="Visa samtliga kort"></widget-icon>
    <widget-icon path="/static/graphics/icons/filter/" img="KEDJA_Filter on.png" imgHover="KEDJA_Filter on hover.png" imgActive="KEDJA_Filter on aktiv.png" :active="filterCards" @click.native="setFilterCards(true)" title="Visa endast kort i vald kedja" alt="Visa endast kort i vald kedja"></widget-icon>
  </div>
</template>

<script>

// import { store } from '@/store';
import WidgetIcon from './WidgetIcon'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'CardFilter',
  components: {
    WidgetIcon
  },
  computed: {
    ...mapState(['filterCards'])
  },
  methods: {
    ...mapMutations(['setFilterCards'])
  }
}
</script>

<style scoped>

.CardFilter{
  cursor: pointer;
  display: flex;
  flex-direction: row;
}

img{
  width: 70px;
}

</style>
