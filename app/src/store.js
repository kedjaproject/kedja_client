import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import Factory from '@/Factory';
import { walls } from '@/assets/walls.json';

export const store = new Vuex.Store({
  state: {
    walls: [],
    activeWallId: 0
  },
  mutations: {

    myMutation: (state, {param}) => {
    },

    init: (state, {}) => {
      state.walls = walls;
    },

    setCardsStatus: (state, {cardIds, status}) => {
      cardIds.forEach((cardId, iCardId) => {
        let card = store.getters.getCardById(cardId)
        store.commit('setCardStatus',{card: card, status: status});
      })
    },

    setCardStatus: (state, {card, status}) => {
      Vue.set(card, 'status', status)
    },

    createCardInCollection: (state, {collection}) => {
      collection.cards.push(Factory.Card())
    },

    createCollectionInWall: (state, {wall}) => {
      wall.collections.push(Factory.Collection())
    },

  },
  getters: {

    myGetter: state => (param) => {
      return true
    },

    getCardById: state => (id) => {
      let cardFound = undefined;
      let wall = state.walls[state.activeWallId];
      wall.collections.forEach((collection, iCollection) => {
        let card = collection.cards.find(c => c.id == id);
        if(card){
          cardFound = card;
        }
      })
      return cardFound
    },

    getConnectionsByCardId: state => (id) => {
      let wall = state.walls[state.activeWallId];
      return wall.connections.filter(c => c.members.indexOf(id) != -1)
    },

  },
});
