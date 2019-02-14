import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import Factory from '@/Factory';
import { walls } from '@/assets/walls.json';

export const store = new Vuex.Store({
  state: {
    walls: ""
  },
  mutations: {

    myMutation: (state, {param}) => {
    },

    init: (state, {}) => {
      console.log(walls)
      state.walls = walls;
    },

  },
  getters: {

    myGetter: state => (param) => {
      return true
    },

  },
});
