import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

import Factory from '@/Factory';
import { walls } from '@/assets/walls.json';

export const store = new Vuex.Store({
  state: {
    walls: [],
    activeWallId: 0,
    connections: []
    //schema: Schema
  },
  mutations: {

    /*myMutation: (state, {param}) => {
    },*/

    init: (state, {}) => {
      state.walls = walls;
      store.commit('prepareData',{});
      store.commit('apiCallTest',{});
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

    setDeepConnectionsByCardId: (state, {id}) => {
      state.connections = store.getters.getDeepConnectionsByCardId(id);
    },

    resetConnections: (state) => {
      state.connections = [];
    },

    //API

    apiCallTest: (state) => {

      let data = {
      }

      let params = {
        //url: "http://static.radkompaniet.se/schema.json",
        url: "",
        data: data,
        successCallback: (data) => {
          console.log(data);
        },
      }

      store.commit('makeAPICall',params);

    },

    makeAPICall: (state, params) => {

      //let headers = {"Authorization": 'Basic ' + btoa(user+':'+key)}

      let d = {
        //headers: headers,
        mode: 'cors',
        contentType: 'text/html;charset=utf-8',
        dataType: 'text',
        crossDomain: true,
        data: params.data
      }

      axios.get(params.url,{},d)
      .then(
        params.successCallback,
        this.errorCallback
      )
      .catch(error => {
        console.log(error);
      })

      console.log("API call: " + params.url)
      console.log(d)
    },

    errorCallback: (state, data) => {
      console.log("Error")
      console.log(data)
    }

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

    getDirectConnectionsByCardId: state => (id) => {
      let wall = store.getters.getActiveWall();
      return wall.connections.filter(c => c.members.indexOf(id) != -1)
    },

    getDeepConnectionsByCardId: state => (id) => {
      let wall = store.getters.getActiveWall();
      let allConnections = wall.connections;
      let connections = store.getters.getRecursiveConnectionsByCardId(allConnections,id,true)
      connections = connections.concat(store.getters.getRecursiveConnectionsByCardId(allConnections,id,false))
      connections = [...new Set(connections)] //remove duplicates
      return connections;
    },

    //Not optimized: might go down the same connections multiple times and create duplicates
    getRecursiveConnectionsByCardId: state => (allConnections,id,forward) => {
      let connections = allConnections.filter(c => c.members[+!forward] == id)
      let cc = [];
      connections.forEach((connection, iConnection) => {
        cc = cc.concat(store.getters.getRecursiveConnectionsByCardId(allConnections,connection.members[+forward],forward));
      })
      connections = connections.concat(cc);
      return connections;
    },

    //API

  },
});
