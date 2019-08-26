import collectionModule from './collectionModule'
import { kedjaAPI } from '@/utils'
import axios from 'axios'
import Vue from 'vue'

const modules = {
  collections: collectionModule
}

const state = {
  walls: [],
  wallData: {},
  cardById: {}
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
  },

  fetchWall ({commit}, rid) {
    // Handle requests for wall and collections before relations.
    axios.all([
      kedjaAPI.get('walls/' + rid),
      kedjaAPI.get('walls/' + rid + '/collections'),
      kedjaAPI.get('walls/' + rid + '/relations')
    ])
      .then(axios.spread((wallResponse, collectionsResponse, relationsResponse) => {
        commit('setWallData', wallResponse.data)
        commit('setCollectionsData', {wall: wallResponse.data, collections: collectionsResponse.data})
        // Get all cards before handling relations.
        axios.all(collectionsResponse.data.map(collection => kedjaAPI.get('collections/' + collection.rid + '/cards')))
          .then(axios.spread((...cardsResponses) => {
            cardsResponses.forEach((cardsResponse, index) => {
              commit('setCardsData', {wall: wallResponse.data, collection: collectionsResponse.data[index], cards: cardsResponse.data})
            })
            commit('setRelationsData', {wall: wallResponse.data, relations: relationsResponse.data})
          }))
      }))
  }
}

// mutations
const mutations = {

  setWalls (state, payload) {
    state.walls = payload.data
  },

  setWallData (state, wall) {
    Vue.set(state.wallData, wall.rid, wall.data)
  },

  setCollectionsData (state, {wall, collections}) {
    Vue.set(state.wallData[wall.rid], 'collections', collections)
  },

  setCardsData (state, {wall, collection, cards}) {
    const coll = state.wallData[wall.rid].collections.find(c => c.rid === collection.rid)
    Vue.set(coll, 'cards', cards)
    cards.forEach(card => {
      Vue.set(state.cardById, card.rid, coll.cards.find(c => c.rid === card.rid))
    })
  },

  setRelationsData (state, {wall, relations}) {
    Vue.set(state.wallData[wall.rid], 'relations', relations)
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
