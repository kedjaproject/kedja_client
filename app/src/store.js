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
    connections: [],
    tabIndexCounter: 0
    //schema: Schema
  },
  mutations: {

    /*myMutation: (state, {param}) => {
    },*/

    init: (state, {}) => {
      state.walls = walls.slice();
      //store.commit('initWallsFromAPI',{});
      //store.commit('prepareData',{});
    },

    initWallsFromAPI: (state, {}) => {

      let params = {
        //url: "http://static.radkompaniet.se/schema.json",
        endpoint: "list/Wall/1",
        successCallback: (data) => {
          console.log(data)
          state.walls = data.data;
        },
      }

      store.commit('makeAPICall',params);

    },

    initCard: (state, card) => {
      Vue.set(card, 'states', {})
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

      let rid = wall.rid;

      let params = {
        endpoint: "create/Collection/" + rid,
        data: {title: 'Ny samling'},
        method: "post",
        successCallback: (data) => {
          wall.contained.push(data.data)
        },
      }

      store.commit('makeAPICall',params);

    },

    createCardInCollection: (state, {collection}) => {

      let rid = collection.rid;

      let params = {
        endpoint: "create/Card/" + rid,
        data: {title: 'Nytt kort'},
        method: "post",
        successCallback: (data) => {
          collection.contained.push(data.data)
          console.log(data)
        },
      }

      store.commit('makeAPICall',params);

      //collection.cards.push(Factory.Card())
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
      console.log("Set deep connections")
      //state.connections = []
      state.connections = store.getters.getDeepConnectionsByCardId(id);
    },

    resetConnections: (state) => {
      console.log("Reset connections")
      state.connections = [];

      //state.connections = store.getters.getActiveWall().connections.slice();
      console.log(state.connections.length)
    },

    setCousinsByCardId: (state, {id}) => {
      let collection = store.getters.getCollectionByCardId(id);
      let wall = store.getters.getActiveWall();
      let siblings = store.getters.getClosestArraySiblings(wall.collections,collection)
      console.log(siblings)

      siblings.forEach((sibling,iSibling) => {
        if(sibling){
          sibling.cards.forEach((card,iCard) => {
            store.commit('setCardState',{card: card, stateName: 'cousin', stateFlag: true});
          })
        }
      })

    },

    //API

    makeAPICall: (state, params) => {

      let method = params.method ? params.method : "get";

      axios({
        method: method,
        url:'http://kedja.archeproject.org/api/' + params.endpoint,
        data: params.data,
        config: {headers: { 'Cache-Control': 'no-cache', 'Cache-Control': 'no-store' }}
      })
      .then(
        params.successCallback,
        this.errorCallback
      )
      .catch(error => {
        console.log(error);
      })

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
      let wall = store.getters.getActiveWall()
      wall.collections.forEach((collection, iCollection) => {
        let card = collection.cards.find(c => c.id == id);
        if(card){
          cardFound = card;
        }
      })
      return cardFound
    },

    getCollectionByCardId: state => (id) => {
      let collectionFound = undefined;
      let wall = store.getters.getActiveWall()
      wall.collections.forEach((collection, iCollection) => {
        let card = collection.cards.find(c => c.id == id);
        if(card){
          collectionFound = collection;
        }
      })
      return collectionFound
    },

    getDirectConnectionsByCardId: state => (id) => {
      let wall = store.getters.getActiveWall();
      return wall.connections.filter(c => c.members.indexOf(id) != -1)
    },

    getDeepConnectionsByCardId: state => (id) => {
      let allConnections = store.getters.getActiveWall().connections;
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

    getClosestArraySiblings: state => (array,item) => {
      let siblings = [undefined,undefined];
      let i = array.indexOf(item);
      if(i > 0){
        siblings[0] = array[i-1]
      }
      if(i < array.length-2){
        siblings[1] = array[i+1]
      }
      return siblings
    }

    //API

  },
});
