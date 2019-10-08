import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
import walls from './modules/walls'
import users from './modules/users'
import { kedjaAPI, setAuthToken, eventBus } from '../utils'
import * as types from './mutation-types'

Vue.use(Vuex)

export const store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    walls,
    users
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

    [types.INIT]: (state) => {
      store.commit('users/loadUserFromLocalStorage')
    },

    [types.RESET_USER_STATE]: (state) => {
      store.commit('setUserState', {name: 'default'})
    },

    [types.SET_USER_STATE]: (state, {name, data}) => {
      eventBus.$emit('relationsUpdated')
      Vue.set(state, 'userState', {name: name, data: data || {}, rand: Math.random()})
    },

    [types.FORCE_USER_STATE_UPDATE]: (state) => {
      eventBus.$emit('relationsUpdated')
      state.userState.rand = Math.random()
    },

    [types.SET_ACTIVE_WALL]: (state, {wall}) => {
      state.activeWall = wall
    },

    [types.SET_WALL_COLLECTIONS]: (state, {wall, collections}) => {
      Vue.set(wall, 'collections', collections)
    },

    [types.SET_WALL_CONNECTIONS]: (state, {wall, connections}) => {
      Vue.set(wall, 'connections', connections)
    },

    [types.SET_COLLECTION_CARDS]: (state, {collection, cards}) => {
      Vue.set(collection, 'cards', cards)
    },

    [types.SET_CONNECTIONS]: (state, {connections}) => {
      state.connections = connections
    },

    [types.INIT_WALL]: (state, wall) => {
      Vue.set(wall, 'collections', [])
      Vue.set(wall, 'connections', [])
    },

    [types.INIT_COLLECTION]: (state, collection) => {
      Vue.set(collection, 'cards', [])
    },

    [types.INIT_CONNECTION]: (state, connection) => {
    },

    setFilterCards: (state, value) => {
      Vue.set(state, 'filterCards', value)
      eventBus.$emit('relationsUpdated')
    },

    resetConnections: (state) => {
      console.log('Reset connections')
      state.connections = []

      console.log(state.connections.length)
    },

    setCanConnectByCardId: (state, {id}) => {
      let collection = store.getters.getCollectionByCardId(id)
      console.log(collection)
      let wall = store.getters.getActiveWall()
      let siblings = store.getters.getClosestArraySiblings(wall.collections, collection)
      console.log(siblings)

      siblings.forEach((sibling, iSibling) => {
        if (sibling) {
          sibling.cards.forEach((card, iCard) => {
            store.commit('setCardState', {card: card, stateName: 'connectingCanConnect', stateFlag: true})
          })
        }
      })
    },

    removeConnectionsByCardId: (state, cardId) => {
      let wall = store.getters['walls/activeWall']
      console.log(wall.relations)
      Vue.set(wall, 'relations', wall.relations.filter(c => !c.members.includes(cardId)))
      console.log(wall.relations)
      store.commit('forceUserStateUpdate')
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

    userData: state => {
      return state.users.data[state.users.currentUserId]
    }
  }
})
