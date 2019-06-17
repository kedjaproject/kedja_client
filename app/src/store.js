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
    tabIndexCounter: 0,
    connectionBounds: "",
    userState: ""
    //schema: Schema
  },
  mutations: {

    /*myMutation: (state, {param}) => {
    },*/

    init: (state, {}) => {
      //state.walls = walls.slice();
      //store.commit('initWallsFromAPI',{});
      //store.commit('prepareData',{});
      //store.commit('resetUserState');
    },

    /*initWallsFromAPI: (state, {}) => {

      let params = {
        endpoint: "walls",
        successCallback: (data) => {
          state.walls = data.data;
        },
      }

      store.commit('makeAPICall',params);

    },*/

    resetUserState: (state) => {
      store.commit('setUserState',{name: 'default'});
    },

    setUserState: (state, {name, data}) => {
      store.commit('setDirtyDraw');
      state.userState = {name: name, data: data ? data : {}, rand: Math.random()}
    },

    forceUserStateUpdate: (state) => {
      store.commit('setDirtyDraw');
      state.userState.rand = Math.random()
    },

    setActiveWall: (state, {wall}) => {
      state.activeWall = wall;
    },

    setWallCollections: (state, {wall, collections}) => {
      Vue.set(wall,'collections',collections);
    },

    setWallConnections: (state, {wall, connections}) => {
      Vue.set(wall,'connections',connections);
    },

    setCollectionCards: (state, {collection, cards}) => {
      Vue.set(collection,'cards',cards);
    },

    setConnections: (state, {connections}) => {
      state.connections = connections;
    },

    initWall: (state, wall) => {
      Vue.set(wall, 'collections', [])
      Vue.set(wall, 'connections', [])
      Vue.set(wall, 'dirtyDraw', false)
    },

    initCollection: (state, collection) => {
      Vue.set(collection, 'cards', [])
    },

    initCard: (state, card) => {
      Vue.set(card, 'states', {})
    },

    initConnection: (state, connection) => {
      Vue.set(connection, 'dirtyDraw', false)
    },

    /*prepareData: (state, {}) => {
      state.walls.forEach((wall, iWall) => {
        wall.collections.forEach((collection, iCollection) => {
          collection.cards.forEach((card, iCard) => {
            Vue.set(card, 'states', {})
          })
        })
      })
    },*/

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

    resetCardState: (state, {card}) => {

      let wall = store.getters.getActiveWall();

      wall.collections.forEach((collection, iCollection) => {
        collection.cards.forEach((card, iCard) => {
          store.commit('setCardState',{card: card, stateName: stateName, stateFlag: undefined});
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

    createWall: (state, {}) => {
      let params = {
        endpoint: "walls",
        params: {title: 'Ny vägg'},
        method: "post",
        successCallback: (data) => {
          state.walls.push(data.data)
        },
      }

      store.commit('makeAPICall',params);
    },

    /*createCollectionInWall: (state, {wall}) => {

      let rid = wall.rid;

      let params = {
        endpoint: "walls/" + rid + "/collections",
        data: {title: 'Ny samling'},
        method: "post",
        successCallback: (data) => {
          console.log(data)
          wall.contained.push(data.data)
        }
      }

      store.commit('makeAPICall',params);

    },*/

    /*createCardInCollection: (state, {collection}) => {

      let rid = collection.rid;

      let params = {
        endpoint: "collections/" + rid + "/cards",
        params: {title: 'Nytt kort'},
        method: "post",
        successCallback: (data) => {
          console.log(data)
          collection.contained.push(data.data)
        },
      }

      store.commit('makeAPICall',params);

    },*/

    /*getContainedCards: (state, {collection}) => {
      let params = {
        endpoint: "collections/" + collection.rid + "/cards",
        method: "get",
        successCallback: (data) => {
          console.log(data)
          Vue.set(collection, 'contained', data.data)
        },
      }

      store.commit('makeAPICall',params);
    },*/

    setDirtyDraw: (state) => {

      let wall = store.getters.getActiveWall();

      Vue.set(wall,'dirtyDraw',true)

      state.connectionBounds = document.getElementsByClassName("collectionContent")[0].getBoundingClientRect();

      Vue.nextTick().then(function () {
        Vue.set(wall,'dirtyDraw',false)
      })

    },

    createConnection: (state, {card0, card1}) => {

      console.log("Connect cards: " + card0.rid + " and " + card1.rid)

      let params = {
        // FIXME: Must have structure /walls/<wall rid>/relations
        // Data must be serialized as json
        endpoint: "walls/" + card0.rid + "/" + card1.rid,
        params: {},
        method: "post",
        successCallback: (data) => {
          console.log(data)
        },
      }

      store.commit('makeAPICall',params);

      //collection.cards.push(Factory.Card())
    },

    addConnectionToWall: (state, {wall, connection}) => {
      wall.connections.push(connection)
    },

    removeConnection: (state, {card0, card1}) => {

      console.log("Unconnect cards: " + card0.rid + " and " + card1.rid)

      let params = {
        // FIXME: Must have structure /walls/<wall rid>/relations/<relation_id>
        // Relations are deleted by their relation_id and not by cards rid
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

    /*removeCollectionFromWall: (state, {wall, collection}) => {

      let params = {
        endpoint: "walls/" + wall.rid + "/collections/" + collection.rid,
        method: "delete",
        successCallback: (data) => {
          console.log(data)

          let index = wall.collections.indexOf(collection)
          if(index != -1){
            wall.collections.splice(index,1)
          }

        },
      }

      store.commit('makeAPICall',params);

    },*/

    /*removeCardFromCollection: (state, {collection,card}) => {

      let params = {
        endpoint: "collections/" + collection.rid + "/cards/" + card.rid,
        method: "delete",
        successCallback: (data) => {
          console.log(data)

          let index = collection.cards.indexOf(card)
          if(index != -1){
            collection.cards.splice(index,1)
          }

        },
      }

      store.commit('makeAPICall',params);

    },*/

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
      let siblings = store.getters.getClosestArraySiblings(wall.collections,collection)
      console.log(siblings)

      siblings.forEach((sibling,iSibling) => {
        if(sibling){
          sibling.cards.forEach((card,iCard) => {
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
        url:'https://staging-server.kedja.org/api/1/' + params.endpoint,
        params: params.params,
        data: params.data
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

    getUserState: state => {
      return state.userState;
    },

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
      wall.collections.forEach((collection, iCollection) => {
        cards = cards.concat(collection.cards.filter(card => ids.indexOf(card.rid) != -1))
      })
      return cards
    },

    getCardsByIdsInverted: state => (ids) => {
      let wall = store.getters.getActiveWall();
      let cards = []
      wall.collections.forEach((collection, iCollection) => {
        cards = cards.concat(collection.cards.filter(card => ids.indexOf(card.rid) == -1))
      })
      return cards
    },

    getCardsInverted: state => (cardsInput) => {
      let wall = store.getters.getActiveWall();
      let cards = []
      wall.collections.forEach((collection, iCollection) => {
        cards = cards.concat(collection.cards.filter(card => cardsInput.indexOf(card) == -1))
      })
      return cards
    },

    getClosestCardCousins: state => (card) => {
      let collection = store.getters.getCollectionByCard(card);
      let wall = store.getters.getActiveWall();
      let siblings = store.getters.getClosestArraySiblings(wall.collections,collection)

      let cousins = []

      siblings.forEach((sibling,iSibling) => {
        if(sibling){
          cousins = cousins.concat(sibling.cards)
        }
      })

      return cousins

    },

    getCollectionByCard: state => (card) => {
      let wall = store.getters.getActiveWall()
      return wall.collections.find(collection => collection.cards.indexOf(card) != -1)

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
      wall.collections.forEach((collection, iCollection) => {
        cards = cards.concat(collection.cards.filter(card => card.states[stateName]))
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
