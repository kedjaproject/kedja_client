import Vue from 'vue'
import { kedjaAPI } from '@/utils'

// User functions
const Users = {
  getFullName (user) {
    return [user.data.first_name, user.data.last_name].filter(a => a).join(' ')
  },
  getShortName (user) {
    return [user.data.first_name[0], user.data.last_name[0]].filter(a => a).join('').toUpperCase()
  }
}

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
      // Accept array or singular object
      if (!Array.isArray(data)) data = [data]
      data.forEach(user => {
        // Remember fullName and shortName (initials) for all users.
        user.data.fullName = Users.getFullName(user)
        user.data.shortName = Users.getShortName(user)
        Vue.set(state.data, user.rid, user)
        // If it's the logged in user, save to localStorage.
        if (user.rid === state.currentUserId) {
          localStorage.userData = JSON.stringify(user)
        }
      })
    },

    loadUserFromLocalStorage (state) {
      if (!localStorage.userData) return
      try {
        const userData = JSON.parse(localStorage.userData)
        state.currentUserId = userData.rid
        Vue.set(state.data, userData.rid, userData)
      } catch (e) {
        console.log('Could not load userData', e)
      }
    }
  },
  getters: {
    // Get specific list of users, or everyone in memory
    getUsers: state => userIds => {
      if (userIds) {
        return userIds.map(rid => state.data[rid])
      } else {
        return Object.values(state.data)
      }
    },
    currentUser (state) {
      return state.data[state.currentUserId]
    }
  },
  actions: {
    fetchUserData ({commit}, userId) {
      kedjaAPI.get('users/' + userId)
        .then(response => {
          commit('setUserData', response.data)
        })
    }
  }
}
