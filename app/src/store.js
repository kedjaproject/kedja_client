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

    /*myMutation: (state, {param}) => {
    },*/

    init: (state, {}) => {
      state.walls = walls;
      store.commit('prepareData',{});
    },

    prepareData: (state, {}) => {
      state.walls.forEach((wall, iWall) => {
        wall.collections.forEach((collection, iCollection) => {
          collection.cards.forEach((card, iCard) => {
            Vue.set(card, 'states', {})
          })
        })
      })
    },

    setCardsState: (state, {cardIds, stateName}) => {

      let wall = store.getters.getActiveWall();

      wall.collections.forEach((collection, iCollection) => {
        collection.cards.forEach((card, iCard) => {
          let flag = cardIds.indexOf(card.id) != -1;
          store.commit('setCardState',{card: card, stateName: stateName, stateFlag: flag});
        })
      })

    },

    resetCardsState: (state, {cardIds, stateName}) => {

      let wall = store.getters.getActiveWall();

      wall.collections.forEach((collection, iCollection) => {
        collection.cards.forEach((card, iCard) => {
          store.commit('setCardState',{card: card, stateName: stateName, stateFlag: undefined});
        })
      })

    },



    setCardState: (state, {card, stateName, stateFlag}) => {
      Vue.set(card.states, stateName, stateFlag)
    },

    //Create data

    createCollectionInWall: (state, {wall}) => {
      wall.collections.push(Factory.Collection())
    },

    createCardInCollection: (state, {collection}) => {
      collection.cards.push(Factory.Card())
    },

    //Remove data

    removeCollectionFromWall: (state, {wall, collection}) => {
      let index = wall.collections.indexOf(collection)
      if(index != -1){
        wall.collections.splice(index,1)
      }
    },

    removeCardFromCollection: (state, {collection,card}) => {
      let index = collection.cards.indexOf(card)
      if(index != -1){
        collection.cards.splice(index,1)
      }
    },

  },
  getters: {

    /*myGetter: state => (param) => {
      return true
    },*/

    getActiveWall: state => (id) => {
      return state.walls[state.activeWallId];
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
