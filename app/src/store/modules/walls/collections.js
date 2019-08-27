import Vue from 'vue'
import { eventBus, kedjaAPI } from '@/utils'

export default {
  namespaced: true,
  state: {
    collections: {}
  },
  getters: {
    getCollectionByCard: state => card => Object.values(state.collections).find(coll => coll.cardList.includes(card.rid))
  },
  actions: {
    removeCard ({commit, getters}, card) {
      const collection = getters.getCollectionByCard(card)
      kedjaAPI.delete('collections/' + collection.rid + '/cards/' + card.rid)
        .then(response => {
          commit('walls/removeCardRelations', card, {root: true})
          eventBus.$emit('relationsUpdated')
          commit('removeCard', {collection, card})
          commit('walls/cards/removeCard', null, {root: true})
          commit('resetUserState', null, {root: true})
        })
    },
    createCardInCollection ({commit}, {collection, title}) {
      kedjaAPI.post('collections/' + collection.rid + '/cards', {title})
        .then(response => {
          commit('walls/cards/setCard', response.data, {root: true})
          commit('addCard', {collection, card: response.data})
        })
    },
    createCollection ({commit, rootGetters}, wall) {
      kedjaAPI.post('walls/' + wall.rid + '/collections', {title: 'Ny samling'})
        .then(response => {
          // Order is important - rid must be in collections first
          commit('addCollection', response.data)
          commit('walls/addCollectionToWall', {wall, collection: response.data}, {root: true})
        })
    },
    removeCollection ({commit}, {wall, collection}) {
      kedjaAPI.delete('walls/' + wall.rid + '/collections/' + collection.rid)
        .then(response => {
          // Order is important - rid must be removed from collections last
          commit('walls/removeCollectionFromWall', {wall, collection}, {root: true})
          commit('removeCollection', collection)
        })
    }
  },
  mutations: {
    setCollections (state, collections) {
      collections.forEach(collection => {
        Vue.set(state.collections, collection.rid, collection)
      })
    },
    addCard (state, {collection, card}) {
      collection.cardList.push(card.rid)
    },
    setCollection (state, collection) {
      Vue.set(state.collections, collection.rid, collection)
    },
    setCollectionIdCardList (state, {collectionId, cardList}) {
      Vue.set(state.collections[collectionId], 'cardList', cardList)
    },
    addCollection (state, collection) {
      Vue.set(state.collections, collection.rid, collection)
    },
    removeCollection (state, collection) {
      delete state.collections[collection.rid]
    },
    removeCard (state, {collection, card}) {
      collection.cardList.splice(collection.cardList.indexOf(card.rid), 1)
    }
  }
}
