import { makeAPICall } from '../../utils'

export default {
  namespaced: true,
  state: {
    currentUserId: NaN,
    data: {}
  },
  mutations: {
    setCurrentUserId (state, rid) {
      state.currentUserId = rid
      if (!rid) {
        // No rid means user is logging out
        delete localStorage.userData
      }
    },

    setUserData (state, data) {
      if (data.rid in state.data) {
        Object.assign(state.data[data.rid], data.data)
      } else {
        state.data[data.rid] = data.data
      }
      if (data.rid === state.currentUserId) {
        localStorage.userData = JSON.stringify(data)
      }
    },

    loadUserFromLocalStorage (state) {
      if (!localStorage.userData) return
      try {
        const userData = JSON.parse(localStorage.userData)
        state.currentUserId = userData.rid
        if (userData.rid in state.data) {
          Object.assign(state.data[userData.rid], userData.data)
        } else {
          state.data[userData.rid] = userData.data
        }
      } catch (e) {
        console.log('Could not load userData', e)
      }
    }
  },
  getters: {
    currentUser (state) {
      return state.data[state.currentUserId]
    }
  },
  actions: {
    fetchUserData ({commit}, userId) {
      makeAPICall('users/' + userId)
        .then(response => {
          commit('setUserData', response.data)
        })
    }
  }
}
