import Vue from 'vue'
import { eventBus, kedjaAPI, openDeleteDialog } from '@/utils'

export default {
  namespaced: true,
  state: {
    collections: {}
  },
  getters: {
    getCollectionByCard: state => card => Object.values(state.collections).find(coll => coll.cardList.includes(card.rid))
  },
  actions: {
    removeCard ({commit, getters, rootGetters}, card) {
      const collection = getters.getCollectionByCard(card)
      const wall = rootGetters['walls/activeWall']
      const hasRelations = wall.relations.find(relation => relation.members.includes(card.rid))
      const action = () => {
        kedjaAPI.delete('collections/' + collection.rid + '/cards/' + card.rid)
          .then(response => {
            commit('walls/removeCardRelations', {wall, card}, {root: true})
            commit('removeCard', {collection, card})
            commit('walls/cards/removeCard', card, {root: true})
            commit('resetUserState', null, {root: true})
            eventBus.$emit('cardRemoved')
          })
      }
      if (hasRelations) {
        openDeleteDialog({
          message: 'Om du raderar detta kort tas även kopplingar till andra kort bort.',
          action
        })
      } else {
        action()
      }
    },
    createCardInCollection ({commit}, {collection, title}) {
      kedjaAPI.post('collections/' + collection.rid + '/cards', {title})
        .then(response => {
          commit('walls/cards/setCard', response.data, {root: true})
          commit('addCard', {collection, card: response.data})
          eventBus.$emit('cardCreated')
        })
    },
    createCollection ({commit, rootGetters}, wall) {
      kedjaAPI.post('walls/' + wall.rid + '/collections', {title: 'Ny samling'})
        .then(response => {
          // Order is important - rid must be in collections first
          commit('setCollection', response.data)
          commit('walls/addCollectionToWall', {wall, collection: response.data}, {root: true})
          eventBus.$emit('collectionCreated')
        })
    },
    removeCollection ({commit}, {wall, collection}) {
      const action = () => {
        kedjaAPI.delete('walls/' + wall.rid + '/collections/' + collection.rid)
          .then(response => {
            // Order is important - rid must be removed from collections last
            commit('walls/removeCollectionFromWall', {wall, collection}, {root: true})
            commit('removeCollection', collection)
            eventBus.$emit('collectionRemoved')
          })
      }
      if (collection.cardList.length) {
        openDeleteDialog({
          message: 'Om du raderar denna samling raderas även samlingens kort och deras kopplingar.',
          action
        })
      } else {
        action()
      }
    },
    setCardOrder ({ commit }, {collection, order}) {
      // Set preliminary order for speed.
      commit('setCollectionIdCardList', {
        collectionId: collection.rid,
        cardList: order
      })
      eventBus.$emit('relationsUpdated')
      kedjaAPI.put('collections/' + collection.rid + '/order', {order})
        .then(response => {
          // API sends full card data for collection, so update all
          commit('walls/cards/setCards', response.data, {root: true})
          // Use order from API, could be changed from elsewhere.
          const cardList = response.data.map(card => card.rid)
          commit('setCollectionIdCardList', {
            collectionId: collection.rid,
            cardList
          })
          eventBus.$emit('relationsUpdated')
        })
    }
  },
  mutations: {
    setCollections (state, collections) {
      collections.forEach(collection => {
        if (state.collections[collection.rid]) {
          // Update only data if already exists
          Vue.set(state.collections[collection.rid], 'data', collection.data)
        } else {
          Vue.set(state.collections, collection.rid, collection)
        }
      })
    },
    addCard (state, {collection, card}) {
      collection.cardList.push(card.rid)
    },
    setCollection (state, collection) {
      if (state.collections[collection.rid]) {
        // Update only data if already exists
        Vue.set(state.collections[collection.rid], 'data', collection.data)
      } else {
        collection.cardList = collection.cardList || []
        Vue.set(state.collections, collection.rid, collection)
      }
    },
    setCollectionIdCardList (state, {collectionId, cardList}) {
      Vue.set(state.collections[collectionId], 'cardList', cardList)
    },
    removeCollection (state, collection) {
      delete state.collections[collection.rid]
    },
    removeCard (state, {collection, card}) {
      collection.cardList.splice(collection.cardList.indexOf(card.rid), 1)
    }
  }
}
