import collectionModule from './collectionModule'
import { makeAPICall } from '@/utils'

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
    makeAPICall('walls')
      .then(response => {
        commit('setWalls', response)
      })
      .catch(err => {
        console.log(err)
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
