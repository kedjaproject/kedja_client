import collectionModule from './collectionModule'

const modules = {
  collections: collectionModule
}

const state = {
  walls: ""
}

// getters
const getters = {
  all: state => {
    return state.walls;
  },
}

// actions
const actions = {
  getWalls: (context) => {

    let payload = {
      endpoint: 'walls'
    }

    context.dispatch('makeAPICall',payload, { root: true }).then(
      function(data){
        context.commit('setWalls', data)
      },
      function(data){
        console.log(data)
      }
    )
    .catch(error => {
      console.log(error);
    }) // -> 'foo/someOtherAction'
  },
}

// mutations
const mutations = {

  setWalls: (state, payload) => {
    state.walls = payload.data;
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
