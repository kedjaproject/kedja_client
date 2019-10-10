import collections from './collections'
import cards from './cards'
import { kedjaAPI } from '@/utils'
import axios from 'axios'
import Vue from 'vue'
import { eventBus } from '../../../utils'

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

  getters: {
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

  },

  actions: {
    fetchWalls ({commit}) {
      kedjaAPI.get('walls')
        .then(response => {
          commit('setWalls', response.data)
        })
    },

    createWall ({commit}) {
      kedjaAPI.post('walls', {title: 'Ny vägg'})
        .then(response => {
          commit('setWall', response.data)
        })
    },

    fetchWall ({commit, rootState, rootGetters}, rid) {
      // Handle requests for wall and collections before relations.
      axios.all([
        kedjaAPI.get('walls/' + rid),
        kedjaAPI.get('walls/' + rid + '/collections'),
        kedjaAPI.get('walls/' + rid + '/relations')
      ])
        .then(axios.spread((wallResponse, collectionsResponse, relationsResponse) => {
          wallResponse.data.collectionList = collectionsResponse.data.map(coll => coll.rid)
          // FIXME: Should not be fake, ofc
          /* yet another FIXME: Breaks when unauthenticated
          const currentUser = rootGetters['users/currentUser']
          const otherFakeUsers = fakeUsers.filter(user => user.data.first_name !== currentUser.data.first_name || user.data.last_name !== currentUser.data.last_name)
          commit('users/setUserData', otherFakeUsers, {root: true})
          // Just add some ramdom users
          wallResponse.data.userList = otherFakeUsers.filter(user => Math.round(Math.random())).map(user => user.rid)
          wallResponse.data.userList.push(currentUser.rid)
          */
          // End FIXME
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
          commit('addRelation', { wall, relation: response.data })
        })
    },

    // Maybe use actions, like this, to modify content?
    deleteRelation ({commit, state}, {wall, relation}) {
      kedjaAPI.delete('walls/' + state.activeWallId + '/relations/' + relation.relation_id)
        .then(response => {
          commit('removeRelation', { wall, relationId: response.data.removed })
        })
    },

    setWallACL ({commit, state}, {wall, aclName}) {
      kedjaAPI.put('walls/' + wall.rid + '/acl', {'acl_name': aclName})
        .then(response => {
          commit('setWallACL', {wall, aclName: response.data.acl_name})
        })
    }
  },

  mutations: {

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
      if (!state.wallList.includes(wall.rid)) {
        state.wallList.push(wall.rid)
      }
    },

    setWallACL (state, {wall, aclName}) {
      Vue.set(wall.data, 'acl_name', aclName)
    },

    removeCardRelations (state, {wall, card}) {
      Vue.set(wall, 'relations', wall.relations.filter(rel => !rel.members.includes(card.rid)))
      eventBus.$emit('relationsUpdated')
    },

    addRelation (state, {wall, relation}) {
      wall.relations.push(relation)
      eventBus.$emit('relationsUpdated')
    },

    removeRelation (state, {wall, relationId}) {
      Vue.set(wall, 'relations', wall.relations.filter(r => r.relation_id !== relationId))
      eventBus.$emit('relationsUpdated')
    },

    // And this...
    setRelationsData (state, {wall, relations}) {
      Vue.set(wall, 'relations', relations)
      eventBus.$emit('relationsUpdated')
    },

    addCollectionToWall (state, {wall, collection}) {
      wall.collectionList.push(collection.rid)
    },

    removeCollectionFromWall (state, {wall, collection}) {
      wall.collectionList.splice(wall.collectionList.indexOf(collection.rid), 1)
    },

    addUser (state, {wall, user}) {
      wall.userList.push(user.rid)
    },

    removeUser (state, {wall, user}) {
      wall.userList.splice(wall.userList.indexOf(user.rid), 1)
    }
  }
}
