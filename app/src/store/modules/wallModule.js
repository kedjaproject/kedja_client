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
  cardById: {},
  currentWallId: NaN
}

// getters
const getters = {
  all (state) {
    return state.walls
  },

  currentWall (state) {
    return state.wallData[state.currentWallId]
  },

  getCollectionArrayIdByCardId (state, getters) {
    return id => getters.currentWall.collections.findIndex(collection => collection.cards.find(card => card.rid === id))
  },

  getCollectionByCard: (state, getters) => card => {
    return getters.currentWall.collections.find(collection => collection.cards.includes(card))
  },

  getClosestCardCousins: (state, getters) => card => {
    let collection = getters.getCollectionByCard(card)
    let siblings = getters.getClosestArraySiblings(getters.currentWall.collections, collection)
    return siblings
      .reduce((cousins, sibling) => cousins.concat(sibling.cards), [])
  },

  getClosestArraySiblings: state => (collections, item) => {
    const i = collections.indexOf(item)
    return [collections[i - 1], collections[i + 1]]
      .filter(sibling => sibling !== undefined)
  },

  // Not optimized: might go down the same connections multiple times and create duplicates
  getRecursiveConnectionsByCardId (state, getters) {
    return (allConnections, id, forward) => {
      if (!allConnections) return []

      // let connections = allConnections.filter(c => c.members[+!forward] == id)
      let connectionsBothDirections = allConnections.filter(c => c.members.includes(id))

      let nextCardIds = []
      let connectionsRightDirection = []
      connectionsBothDirections.forEach((c) => {
        let col0 = getters.getCollectionArrayIdByCardId(c.members[0])
        let col1 = getters.getCollectionArrayIdByCardId(c.members[1])
        let indexForward = col1 > col0 ? 1 : 0
        let indexSelf = c.members.indexOf(id)
        let indexOther = +!indexSelf // turns 1 to 0, and 0 to 1
        if (forward === (indexForward === indexOther)) {
          nextCardIds.push(c.members[indexOther])
          connectionsRightDirection.push(c)
        }
      })

      let cc = []
      nextCardIds.forEach(cardId => {
        cc = cc.concat(getters.getRecursiveConnectionsByCardId(allConnections, cardId, forward))
      })
      connectionsRightDirection = connectionsRightDirection.concat(cc)

      return connectionsRightDirection
    }
  },

  getDeepConnectionsByCardId (state, getters) {
    return (rid) => {
      let allConnections = getters.currentWall.relations
      let connections = getters.getRecursiveConnectionsByCardId(allConnections, rid, true)
      connections = connections.concat(getters.getRecursiveConnectionsByCardId(allConnections, rid, false))
      // connections = [...new Set(connections)] // remove duplicates
      return connections
    }
  },

  getDirectConnectionsByCardId (state, getters) {
    return (id) => {
      let wall = getters.currentWall
      return wall.relations.filter(c => c.members.indexOf(id) !== -1)
    }
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
  },

  createRelation ({commit, state}, {wall, cards}) {
    kedjaAPI.post('walls/' + state.currentWallId + '/relations', {members: cards.map(card => card.rid)})
      .then(response => {
        commit('addRelation', { wallId: state.currentWallId, relation: response.data })
      })
  }
}

// mutations
const mutations = {

  setWalls (state, payload) {
    state.walls = payload.data
  },

  setCurrentWallId (state, wallId) {
    state.currentWallId = wallId
  },

  setWallData (state, wall) {
    Vue.set(state.wallData, wall.rid, wall)
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

  // Use this instead?
  addRelation (state, {wall, relation}) {
    state.wallData[wall.rid].relations.push(relation)
  },

  // And this...
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
