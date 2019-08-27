import collections from './collections'
import cards from './cards'
import { kedjaAPI } from '@/utils'
import axios from 'axios'
import Vue from 'vue'

const helpers = {
  getCollectionByCard (collections, card) {
    return collections.find(collection => collection.cardList.includes(card.rid))
  },
  getClosestCollectionSiblings (collections, collection) {
    const i = collections.indexOf(collection)
    return [collections[i - 1], collections[i + 1]]
      .filter(sibling => sibling !== undefined)
  },
  getCollectionIndexByCardId: (collections, rid) => {
    return collections.findIndex(collection => collection.cardList.includes(rid))
  }
}

// getters
const getters = {
  all: state => state.wallList.map(rid => state.walls[rid]),

  // Data structure helpers
  // Everything with the attribute name "...List" should be a list of Resource ID's (rid), pointing to other resources
  activeWall: state => state.activeWallId && state.walls[state.activeWallId],
  getWallCollections: state => wall => wall && wall.collectionList && wall.collectionList.map(rid => state.collections.collections[rid]),
  activeWallCollections: (state, getters) => getters.getWallCollections(getters.activeWall),
  getCollectionCards: state => collection => collection.cardList.map(rid => state.cards.cards[rid]),
  // getWallByCollection: state => collection => Object.values(state.walls).find(wall => wall.collectionList.includes(collection.rid)),

  getClosestCardCousins: (state, getters) => card => {
    let collections = getters.activeWallCollections
    let collection = helpers.getCollectionByCard(collections, card)
    let siblings = helpers.getClosestCollectionSiblings(collections, collection)
    return siblings
      .reduce((cousins, sibling) => cousins.concat(getters.getCollectionCards(sibling)), [])
  },

  // Not optimized: might go down the same connections multiple times and create duplicates
  getRecursiveConnectionsByCardId (state, getters) {
    return (allConnections, id, forward) => {
      const collections = getters.activeWallCollections
      if (!allConnections) return []

      // let connections = allConnections.filter(c => c.members[+!forward] == id)
      let connectionsBothDirections = allConnections.filter(c => c.members.includes(id))

      let nextCardIds = []
      let connectionsRightDirection = []
      connectionsBothDirections.forEach(c => {
        let col0 = helpers.getCollectionIndexByCardId(collections, c.members[0])
        let col1 = helpers.getCollectionIndexByCardId(collections, c.members[1])
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
      let allConnections = getters.activeWall.relations
      let connections = getters.getRecursiveConnectionsByCardId(allConnections, rid, true)
      connections = connections.concat(getters.getRecursiveConnectionsByCardId(allConnections, rid, false))
      // connections = [...new Set(connections)] // remove duplicates
      return connections
    }
  },

  getDirectConnectionsByCardId (state, getters) {
    return (id) => {
      let wall = getters.activeWall
      return wall.relations.filter(c => c.members.indexOf(id) !== -1)
    }
  }

}

// actions
const actions = {
  getWalls ({commit}) {
    kedjaAPI.get('walls')
      .then(response => {
        commit('setWalls', response.data)
      })
  },

  fetchWall ({commit, state}, rid) {
    // Handle requests for wall and collections before relations.
    axios.all([
      kedjaAPI.get('walls/' + rid),
      kedjaAPI.get('walls/' + rid + '/collections'),
      kedjaAPI.get('walls/' + rid + '/relations')
    ])
      .then(axios.spread((wallResponse, collectionsResponse, relationsResponse) => {
        wallResponse.data.collectionList = collectionsResponse.data.map(coll => coll.rid)
        commit('setWall', wallResponse.data)
        commit('collections/setCollections', collectionsResponse.data)
        // Get all cards before handling relations.
        axios.all(collectionsResponse.data.map(collection => kedjaAPI.get('collections/' + collection.rid + '/cards')))
          .then(axios.spread((...cardsResponses) => {
            cardsResponses.forEach((cardsResponse, index) => {
              commit('cards/setCards', cardsResponse.data)
              commit('collections/setCollectionIdCardList', {
                collectionId: collectionsResponse.data[index].rid,
                cardList: cardsResponse.data.map(card => card.rid)})
            })
            commit('setRelationsData', {wall: wallResponse.data, relations: relationsResponse.data})
          }))
      }))
  },

  // Maybe use actions, like this, to modify content?
  createRelation ({commit, state}, {wall, cards}) {
    kedjaAPI.post('walls/' + state.activeWallId + '/relations', {members: cards.map(card => card.rid)})
      .then(response => {
        commit('addRelation', { wallId: state.activeWallId, relation: response.data })
      })
  }
}

// mutations
const mutations = {

  setWalls (state, walls) {
    walls.forEach(wall => {
      if (state.walls[wall.rid]) {
        // Just update data attribute if already loaded
        Vue.set(state.walls[wall.rid], 'data', wall.data)
      } else {
        Vue.set(state.walls, wall.rid, wall)
      }
      state.wallList = walls.map(wall => wall.rid)
      // TODO: Iterate walls keys to remove nonexisting.
    })
  },

  setActiveWallId (state, wallId) {
    state.activeWallId = wallId
  },

  setWall (state, wall) {
    Vue.set(state.walls, wall.rid, wall)
  },

  /*
  setCollectionsData (state, {wall, collections}) {
    collections.forEach(collection => {
      Vue.set(state.collections, collection.rid, collection)
    })
    Vue.set(state.walls[wall.rid], 'collectionList', collections.map(coll => coll.rid))
    // Vue.set(state.wallData[wall.rid], 'collections', collections)
  },

  setCardsData (state, {collection, cards}) {
    cards.forEach(card => {
      Vue.set(state.cards, card.rid, card)
    })
    Vue.set(state.collections[collection.rid], 'cardList', cards.map(card => card.rid))
  },
  */

  removeCardRelations (state, card) {
    Object.values(state.walls).forEach(wall => {
      if (wall.relations.find(rel => rel.members.includes(card.rid))) {
        Vue.set(wall, 'relations', wall.relations.filter(rel => !rel.members.includes(card.rid)))
      }
    })
  },

  // Use this instead?
  addRelation (state, {wall, relation}) {
    wall.relations.push(relation)
  },

  // And this...
  setRelationsData (state, {wall, relations}) {
    Vue.set(wall, 'relations', relations)
  },

  addCollectionToWall (state, {wall, collection}) {
    wall.collectionList.push(collection.rid)
  },

  removeCollectionFromWall (state, {wall, collection}) {
    wall.collectionList.splice(wall.collectionList.indexOf(collection.rid), 1)
  }
}

export default {
  namespaced: true,
  modules: {
    collections,
    cards
  },
  state: {
    walls: {}, // Each wall will have collectionList[] and relations[]
    wallList: [],
    activeWallId: NaN
    // collections: {}, // Each collection will have cardList[]
    // cards: {}
  },
  getters,
  actions,
  mutations
}
