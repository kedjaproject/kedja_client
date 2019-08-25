import Vue from 'vue'
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
      let userData = data.data
      // Remember fullName and shortName (initials) for all users.
      userData.fullName = [userData.first_name, userData.last_name].filter(a => a).join(' ')
      userData.shortName = [userData.first_name[0], userData.last_name[0]].filter(a => a).join('').toUpperCase()
      Vue.set(state.data, data.rid, userData)
      // If it's the logged in user, save to localStorage.
      if (data.rid === state.currentUserId) {
        localStorage.userData = JSON.stringify(data)
      }
    },

    loadUserFromLocalStorage (state) {
      if (!localStorage.userData) return
      try {
        const userData = JSON.parse(localStorage.userData)
        state.currentUserId = userData.rid
        Vue.set(state.data, userData.rid, userData.data)
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
