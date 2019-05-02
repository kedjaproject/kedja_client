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
    activeWall: "",
    connections: [],
    tabIndexCounter: 0
    //schema: Schema
  },
  mutations: {

    /*myMutation: (state, {param}) => {
    },*/

    init: (state, {}) => {
      //state.walls = walls.slice();
      store.commit('initWallsFromAPI',{});
      //store.commit('prepareData',{});
    },

    initWallsFromAPI: (state, {}) => {

      let params = {
        endpoint: "list/Wall/1",
        successCallback: (data) => {
          state.walls = data.data;
        },
      }

      store.commit('makeAPICall',params);

    },

    setActiveWall: (state, {wall}) => {
      state.activeWall = wall;
    },

    setConnections: (state, {connections}) => {
      state.connections = connections;
    },

    initCard: (state, card) => {
      Vue.set(card, 'states', {})
    },

    prepareData: (state, {}) => {
      state.walls.forEach((wall, iWall) => {
        wall.contained.forEach((collection, iCollection) => {
          collection.cards.forEach((card, iCard) => {
            Vue.set(card, 'states', {})
          })
        })
      })
    },

    setCardsState: (state, {cards, cardIds, stateName, stateFlag, invertCollection}) => {

      console.log("Set cards state: " + stateName);
      console.log(cardIds);

      if(cards){
        cards = !invertCollection ? cards : store.getters.getCardsInverted(cards)
      }
      else{
        let wall = store.getters.getActiveWall();
        cards = !invertCollection ? store.getters.getCardsByIds(cardIds) : store.getters.getCardsByIdsInverted(cardIds);
      }

      cards.forEach((card, iCard) => {
        store.commit('setCardState',{card: card, stateName: stateName, stateFlag: stateFlag});
      })

    },

    resetCardsState: (state, {cardIds, stateName}) => {

      let wall = store.getters.getActiveWall();

      wall.contained.forEach((collection, iCollection) => {
        collection.contained.forEach((card, iCard) => {
          store.commit('setCardState',{card: card, stateName: stateName, stateFlag: undefined});
        })
      })

    },

    setCardState: (state, {card, stateName, stateFlag}) => {
      Vue.set(card.states, stateName, stateFlag)
    },

    //Create data

    createWall: (state, {}) => {
      let params = {
        endpoint: "create/Wall/1",
        params: {title: 'Ny vägg'},
        method: "post",
        successCallback: (data) => {
          state.walls.push(data.data)
        },
      }

      store.commit('makeAPICall',params);
    },

    createCollectionInWall: (state, {wall}) => {

      let rid = wall.rid;

      let params = {
        endpoint: "create/Collection/" + rid,
        params: {title: 'Ny samling'},
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
        params: {title: 'Nytt kort'},
        method: "post",
        successCallback: (data) => {
          collection.contained.push(data.data)
          console.log(data)
        },
      }

      store.commit('makeAPICall',params);

      //collection.cards.push(Factory.Card())
    },

    createConnection: (state, {card0, card1}) => {

      console.log("Connect cards: " + card0.rid + " and " + card1.rid)

      let params = {
        endpoint: "create_relation/" + card0.rid + "/" + card1.rid,
        params: {},
        method: "post",
        successCallback: (data) => {
          console.log(data)
        },
      }

      store.commit('makeAPICall',params);

      //collection.cards.push(Factory.Card())
    },

    removeConnection: (state, {card0, card1}) => {

      console.log("Unconnect cards: " + card0.rid + " and " + card1.rid)

      let params = {
        endpoint: "delete_relation/" + card0.rid + "/" + card1.rid,
        params: {},
        method: "delete",
        successCallback: (data) => {
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

    setCanConnectByCardId: (state, {id}) => {
      let collection = store.getters.getCollectionByCardId(id);
      console.log(collection)
      let wall = store.getters.getActiveWall();
      let siblings = store.getters.getClosestArraySiblings(wall.contained,collection)
      console.log(siblings)

      siblings.forEach((sibling,iSibling) => {
        if(sibling){
          sibling.contained.forEach((card,iCard) => {
            store.commit('setCardState',{card: card, stateName: 'connectingCanConnect', stateFlag: true});
          })
        }
      })

    },

    //API

    makeAPICall: (state, params) => {

      let method = params.method ? params.method : "get";

      axios({
        method: method,
        url:'https://staging-server.kedja.org/api/' + params.endpoint,
        //url:'http://kedja.archeproject.org/api/' + params.endpoint,
        params: params.params,
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
      //return state.walls[state.activeWallId];
      return state.activeWall;
    },

    getCardById: state => (id) => {
      let cardFound = undefined;
      let wall = store.getters.getActiveWall()
      wall.collections.forEach((collection, iCollection) => {
        let card = collection.cards.find(c => c.rid == id);
        if(card){
          cardFound = card;
        }
      })
      return cardFound
    },

    getCardsByIds: state => (ids) => {
      let wall = store.getters.getActiveWall();
      let cards = []
      wall.contained.forEach((collection, iCollection) => {
        cards = cards.concat(collection.contained.filter(card => ids.indexOf(card.rid) != -1))
      })
      return cards
    },

    getCardsByIdsInverted: state => (ids) => {
      let wall = store.getters.getActiveWall();
      let cards = []
      wall.contained.forEach((collection, iCollection) => {
        cards = cards.concat(collection.contained.filter(card => ids.indexOf(card.rid) == -1))
      })
      return cards
    },

    getCardsInverted: state => (cardsInput) => {
      let wall = store.getters.getActiveWall();
      let cards = []
      wall.contained.forEach((collection, iCollection) => {
        cards = cards.concat(collection.contained.filter(card => cardsInput.indexOf(card) == -1))
      })
      return cards
    },

    getClosestCardCousins: state => (card) => {
      let collection = store.getters.getCollectionByCard(card);
      console.log(collection)
      let wall = store.getters.getActiveWall();
      let siblings = store.getters.getClosestArraySiblings(wall.contained,collection)
      console.log(siblings)

      let cousins = []

      siblings.forEach((sibling,iSibling) => {
        if(sibling){
          cousins = cousins.concat(sibling.contained)
        }
      })

      return cousins

    },

    getCollectionByCard: state => (card) => {
      let wall = store.getters.getActiveWall()
      return wall.contained.filter(collection => collection.contained.indexOf(card) != -1)[0]

      /*wall.contained.forEach((collection, iCollection) => {
        let card = collection.contained.find(c => c.rid == card.rid);
        if(card){
          collectionFound = collection;
        }
      })
      return collectionFound*/
    },

    getCardsByState: state => (stateName) => {
      let wall = store.getters.getActiveWall();
      let cards = []
      wall.contained.forEach((collection, iCollection) => {
        cards = cards.concat(collection.contained.filter(card => card.states[stateName]))
      })
      return cards
    },

    getDirectConnectionsByCardId: state => (id) => {
      let wall = store.getters.getActiveWall();
      return wall.connections ? wall.connections.filter(c => c.members.indexOf(id) != -1) : []
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

      if(!allConnections){
        return []
      }

      let connections = allConnections.filter(c => c.members[+!forward] == id)
      let cc = [];
      connections.forEach((connection, iConnection) => {
        cc = cc.concat(store.getters.getRecursiveConnectionsByCardId(allConnections,connection.members[+forward],forward));
      })
      connections = connections.concat(cc);
      return connections;
    },

    getClosestArraySiblings: state => (array,item) => {

      if(!array){
        return []
      }

      let siblings = [undefined,undefined];
      let i = array.indexOf(item);
      if(i > 0){
        siblings[0] = array[i-1]
      }
      if(i < array.length-1){
        siblings[1] = array[i+1]
      }
      return siblings
    },

    getTreeById: state => (id) => {
    },

    //API

    getWalls: state => () => {
      return state.walls;
    },

  },
});
