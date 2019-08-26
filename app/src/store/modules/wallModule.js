import collectionModule from './collectionModule'
import { kedjaAPI } from '@/utils'

const modules = {
  collections: collectionModule
}

const state = {
  walls: []
}

// getters
const getters = {
  all: state => {
    return state.walls
  }
}

// actions
const actions = {
  getWalls ({commit}) {
    kedjaAPI.get('walls')
      .then(response => {
        commit('setWalls', response)
      })
  }
}

// mutations
const mutations = {

  setWalls: (state, payload) => {
    state.walls = payload.data
  }

}

export default {
  namespaced: true,
  modules,
  state,
  getters,
  actions,
  mutations
}
