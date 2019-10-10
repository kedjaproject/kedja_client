import Vue from 'vue'
import { kedjaAPI } from '@/utils'

export default {
  namespaced: true,
  state: {
  },
  mutations: {
    setPermissions (state, { rid, permissions }) {
      // Is is possible to set all on module like this?
      Vue.set(state, rid, permissions)
    }
  },
  actions: {
    fetchPermissions ({ commit }, rid) {
      kedjaAPI.get('permissions/' + rid)
        .then(response => {
          commit('setPermissions', { rid, permissions: response.data })
        })
    }
  },
  getters: {
    checkPermission: state => (rid, name) => {
      if (state[rid]) {
        if (state[rid].allowed.includes(name)) {
          return true
        }
        if (state[rid].denied.includes(name)) {
          return false
        }
        return state[rid].all_other_allowed
      }
      return false
    }
  }
}
