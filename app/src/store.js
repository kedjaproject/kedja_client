import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import Factory from '@/Factory';

export const store = new Vuex.Store({
  state: {
  },
  mutations: {

    myMutation: (state, {param}) => {
    },

  },
  getters: {

    myGetter: state => (param) => {
      return true
    },

  },
});
