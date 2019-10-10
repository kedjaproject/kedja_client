import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
import walls from './modules/walls'
import users from './modules/users'
import permissions from './modules/permissions'
import { kedjaAPI, setAuthToken, eventBus } from '../utils'
import * as types from './mutation-types'

Vue.use(Vuex)

export const store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    walls,
    users,
    permissions
  },
  state: {
    connections: [],
    tabIndexCounter: 0,
    connectionBounds: '',
    userState: {},
    auth: '',
    userid: '',
    userData: {},
    filterCards: false
  },
  mutations: {
    [types.RESET_USER_STATE]: (state) => {
      store.commit('setUserState', {name: 'default'})
    },

    [types.SET_USER_STATE]: (state, {name, data}) => {
      eventBus.$emit('relationsUpdated')
      Vue.set(state, 'userState', {name: name, data: data || {}, rand: Math.random()})
    },
    [types.SET_FILTER_CARDS]: (state, value) => {
      Vue.set(state, 'filterCards', value)
      eventBus.$emit('relationsUpdated')
    }
  },

  actions: {
    authenticate ({dispatch, getters}) {
      if (!getters.isAuthenticated) return
      kedjaAPI.get('auth/valid')
        .then(({data}) => {
          if (!data.userid) {
            dispatch('logout')
          }
        })
    },

    login ({commit}, data) {
      setAuthToken(data.Authorization)
      commit('users/setCurrentUserId', data.user.rid)
      commit('users/setUserData', data.user)
    },

    logout: ({commit}) => {
      commit('users/setCurrentUserId', NaN)
    }
  },
  getters: {
    isAuthenticated (state) {
      return !!state.users.currentUserId
    },

    userData (state) {
      return state.users.data[state.users.currentUserId]
    }
  }
})
