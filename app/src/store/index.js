import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import walls from './modules/wallModule'
import users from './modules/users'
import { makeAPICall, setAuthToken } from '../utils'
// import { walls } from '@/assets/walls.json'

Vue.use(Vuex)

export const store = new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    walls,
    users
  },
  state: {
    env: {},
    walls: [],
    activeWallId: 0,
    activeWall: '',
    connections: [],
    tabIndexCounter: 0,
    connectionBounds: '',
    userState: '',
    auth: '',
    userid: '',
    userData: {},
    dirtyDraw: true
    // schema: Schema
  },
  mutations: {

    /*
    myMutation: (state, {param}) => {
    },
    */

    init: (state, {env}) => {
      Vue.set(state, 'env', env)
      // state.walls = walls.slice()
      // store.commit('initWallsFromAPI',{})
      // store.commit('prepareData',{})
      // store.commit('resetUserState')
      // store.commit('setAuthFromLocalStorage')
      // store.commit('setUserIdFromLocalStorage')
      store.commit('users/loadUserFromLocalStorage')
      store.commit('setDirtyDraw')
    },

    /*
    initWallsFromAPI: (state, {}) => {

      let params = {
        endpoint: "walls",
        successCallback: (data) => {
          state.walls = data.data;
        },
      }

      store.commit('makeAPICall',params);

    },
    */

    /*
    setAuthFromLocalStorage: (state) => {
      if (typeof(Storage) !== "undefined") {
        state.auth = localStorage.getItem("auth");
      } else {
        console.log("No local storage support")
      }
    },

    setUserIdFromLocalStorage: (state) => {
      if (typeof(Storage) !== "undefined") {
        state.userData.userid = localStorage.getItem("userid");
      } else {
        console.log("No local storage support")
      }
    },
    */
    /* Moving this to 'users' store
    setUserDataFromLocalStorage (state) {
      if (typeof (Storage) !== 'undefined') {
        Vue.set(state.userData, 'auth', localStorage.getItem('auth'))
        Vue.set(state.userData, 'userid', localStorage.getItem('userid'))
        Vue.set(state.userData, 'first_name', localStorage.getItem('first_name'))
        Vue.set(state.userData, 'last_name', localStorage.getItem('last_name'))
      } else {
        console.log('No local storage support')
      }
    },
    */
    resetUserState: (state) => {
      store.commit('setUserState', {name: 'default'})
    },

    setUserState: (state, {name, data}) => {
      store.commit('setDirtyDraw')
      state.userState = {name: name, data: data || {}, rand: Math.random()}
      // console.log(state.userState)
    },

    forceUserStateUpdate: (state) => {
      store.commit('setDirtyDraw')
      state.userState.rand = Math.random()
    },

    setActiveWall: (state, {wall}) => {
      state.activeWall = wall
    },

    setWallCollections: (state, {wall, collections}) => {
      Vue.set(wall, 'collections', collections)
    },

    setWallConnections: (state, {wall, connections}) => {
      Vue.set(wall, 'connections', connections)
    },

    setCollectionCards: (state, {collection, cards}) => {
      Vue.set(collection, 'cards', cards)
    },

    setConnections: (state, {connections}) => {
      state.connections = connections
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

    /*
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
    */

    setDirtyDraw: (state) => {
      Vue.set(state, 'dirtyDraw', true)

      Vue.nextTick().then(function () {
        Vue.set(state, 'dirtyDraw', false)
      })
    },

    setDeepConnectionsByCardId: (state, {id}) => {
      console.log('Set deep connections')
      // state.connections = []
      state.connections = store.getters.getDeepConnectionsByCardId(id)
    },

    resetConnections: (state) => {
      console.log('Reset connections')
      state.connections = []

      // state.connections = store.getters.getActiveWall().connections.slice()
      console.log(state.connections.length)
    },

    setCanConnectByCardId: (state, {id}) => {
      let collection = store.getters.getCollectionByCardId(id)
      console.log(collection)
      let wall = store.getters.getActiveWall()
      let siblings = store.getters.getClosestArraySiblings(wall.collections, collection)
      console.log(siblings)

      siblings.forEach((sibling, iSibling) => {
        if (sibling) {
          sibling.cards.forEach((card, iCard) => {
            store.commit('setCardState', {card: card, stateName: 'connectingCanConnect', stateFlag: true})
          })
        }
      })
    },

    removeConnectionsByCardId: (state, cardId) => {
      let wall = store.getters.getActiveWall()
      console.log(wall.connections)
      Vue.set(wall, 'connections', wall.connections.filter(c => c.members.indexOf(cardId) === -1))
      console.log(wall.connections)
      store.commit('forceUserStateUpdate')
    },

    // API

    makeAPICall: (state, payload) => {
      let method = payload.method || 'get'

      let errorCallback = payload.errorCallback || function (response) {
        console.log(response)
      }

      axios({
        method: method,
        url: state.env.API_SERVER + state.env.API_PATH + payload.endpoint,
        headers: {
          Authorization: store.getters.getUserData.auth
        },
        params: payload.params,
        data: payload.data
      })
        .then(
          payload.successCallback,
          errorCallback
        )
        .catch(error => {
          console.log(error)
        })
    },

    errorCallback: (state, data) => {
      console.log('Error')
      console.log(data)
    }

  },
  actions: {

    authenticate ({dispatch, getters}) {
      if (!getters.isAuthenticated) return
      makeAPICall('auth/valid')
        .then(({data}) => {
          if (data.userid === null) {
            dispatch('logout')
          }
        })
        .catch(err => console.log(err))
    },

    setUserData: (context, {field, value}) => {
      if (typeof (Storage) !== 'undefined') {
        localStorage.setItem(field, value)
      } else {
        console.log('No local storage support')
      }
      context.commit('users/loadUserFromLocalStorage')
    },

    /*
    // eslint-disable-next-line camelcase
    login: (context, {auth, userid, first_name, last_name}) => {
      setAuthToken(auth)
      if (typeof (Storage) !== 'undefined') {
        context.dispatch('setUserData', {field: 'auth', value: auth})
        context.dispatch('setUserData', {field: 'userid', value: userid})
        context.dispatch('setUserData', {field: 'first_name', value: first_name})
        context.dispatch('setUserData', {field: 'last_name', value: last_name})
      } else {
        console.log('No local storage support')
      }
      context.commit('users/loadUserFromLocalStorage')
      // context.dispatch('setUserProfileFromAPI')
    },
    */

    login ({commit}, data) {
      setAuthToken(data.Authorization)
      commit('users/setCurrentUserId', data.user.rid)
      commit('users/setUserData', data.user)
    },

    logout: ({commit}) => {
      commit('users/setCurrentUserId', NaN)
      commit('users/loadUserFromLocalStorage')
    },

    setUserProfileFromAPI: (context) => {
      // let userData = store.getters.getUserData

      let params = {
        endpoint: 'users/' + this.userData.userid,
        successCallback: (response) => {
          if (typeof (Storage) !== 'undefined') {
            this.$store.dispatch('setUserData', {field: 'first_name', value: response.data.data.first_name})
            this.$store.dispatch('setUserData', {field: 'last_name', value: response.data.data.last_name})
          } else {
            console.log('No local storage support')
          }

          context.commit('users/loadUserFromLocalStorage')
        }
      }

      this.$store.commit('makeAPICall', params)
    },

    checkAuth: (context) => {
      if (!context.getters.getAuth) {
      }
    },

    makeAPICall: (state, payload) => {
      // FIXME: This whole method  shouldn't be here!

      let method = payload.method || 'get'

      return axios({
        method: method,
        url: state.state.env.API_SERVER + state.state.env.API_PATH + payload.endpoint,
        headers: {
          Authorization: store.getters.getUserData.auth
        },
        params: payload.params,
        data: payload.data
      })
    }

  },
  getters: {

    /*
    myGetter: state => (param) => {
      return true
    },
    */

    isAuthenticated (state) {
      return !!state.users.currentUserId
    },

    getUserData: state => {
      return state.users.data[state.users.currentUserId]
    },

    getUserState: state => {
      return state.userState
    },

    getUserInitials: state => {
    },

    getActiveWall: state => () => {
      // return state.walls[state.activeWallId]
      return state.activeWall
    },

    getCardById: state => (id) => {
      let cardFound // = undefined
      let wall = store.getters.getActiveWall()
      wall.collections.forEach((collection, iCollection) => {
        if (collection.cards) {
          let card = collection.cards.find(c => c.rid === id)
          if (card) {
            cardFound = card
          }
        }
      })
      return cardFound
    },

    getCardsByIds: state => (ids) => {
      let wall = store.getters.getActiveWall()
      let cards = []
      wall.collections.forEach((collection, iCollection) => {
        cards = cards.concat(collection.cards.filter(card => ids.indexOf(card.rid) !== -1))
      })
      return cards
    },

    getCardsByIdsInverted: state => (ids) => {
      let wall = store.getters.getActiveWall()
      let cards = []
      wall.collections.forEach((collection, iCollection) => {
        cards = cards.concat(collection.cards.filter(card => ids.indexOf(card.rid) === -1))
      })
      return cards
    },

    getCardsInverted: state => (cardsInput) => {
      let wall = store.getters.getActiveWall()
      let cards = []
      wall.collections.forEach((collection, iCollection) => {
        cards = cards.concat(collection.cards.filter(card => cardsInput.indexOf(card) === -1))
      })
      return cards
    },

    getClosestCardCousins: state => (card) => {
      let collection = store.getters.getCollectionByCard(card)
      let wall = store.getters.getActiveWall()
      let siblings = store.getters.getClosestArraySiblings(wall.collections, collection)

      let cousins = []

      siblings.forEach((sibling, iSibling) => {
        if (sibling) {
          cousins = cousins.concat(sibling.cards)
        }
      })

      return cousins
    },

    getCollectionByCard: state => (card) => {
      let wall = store.getters.getActiveWall()
      return wall.collections.find(collection => collection.cards.indexOf(card) !== -1)
    },

    getCollectionArrayIdByCardId: state => (id) => {
      let wall = store.getters.getActiveWall()
      return wall.collections.findIndex(collection => collection.cards.find(card => card.rid === id))
    },

    getCardsByState: state => (stateName) => {
      let wall = store.getters.getActiveWall()
      let cards = []
      wall.collections.forEach((collection, iCollection) => {
        cards = cards.concat(collection.cards.filter(card => card.states[stateName]))
      })
      return cards
    },

    getDirectConnectionsByCardId: state => (id) => {
      let wall = store.getters.getActiveWall()
      return wall.connections ? wall.connections.filter(c => c.members.indexOf(id) !== -1) : []
    },

    getDeepConnectionsByCardId: state => (id) => {
      let allConnections = store.getters.getActiveWall().connections
      let connections = store.getters.getRecursiveConnectionsByCardId(allConnections, id, true)
      connections = connections.concat(store.getters.getRecursiveConnectionsByCardId(allConnections, id, false))
      // connections = [...new Set(connections)] // remove duplicates
      return connections
    },

    // Not optimized: might go down the same connections multiple times and create duplicates
    getRecursiveConnectionsByCardId: state => (allConnections, id, forward) => {
      if (!allConnections) {
        return []
      }

      // let connections = allConnections.filter(c => c.members[+!forward] == id)
      let connectionsBothDirections = allConnections.filter(c => c.members.indexOf(id) !== -1)

      let nextCardIds = []
      let connectionsRightDirection = []
      connectionsBothDirections.forEach((c) => {
        let col0 = store.getters.getCollectionArrayIdByCardId(c.members[0])
        let col1 = store.getters.getCollectionArrayIdByCardId(c.members[1])
        let indexForward = col1 > col0 ? 1 : 0
        let indexSelf = c.members.indexOf(id)
        let indexOther = +!indexSelf // turns 1 to 0, and 0 to 1
        if (forward === (indexForward === indexOther)) {
          nextCardIds.push(c.members[indexOther])
          connectionsRightDirection.push(c)
        }
      })

      let cc = []
      nextCardIds.forEach((cardId) => {
        cc = cc.concat(store.getters.getRecursiveConnectionsByCardId(allConnections, cardId, forward))
      })
      connectionsRightDirection = connectionsRightDirection.concat(cc)

      /*
      connections = connections.filter(c => {
        let col0 = store.getters.getCollectionArrayIdByCardId(c.members[0])
        let col1 = store.getters.getCollectionArrayIdByCardId(c.members[1])
        let indexForward = col1 > col0 ? 1 : 0
        let indexSelf = c.members.indexOf(id)
        console.log(indexSelf)
        let retVal = forward == (indexForward != indexSelf)
        console.log(retVal)
        return false
      })
      */

      /*
      let cc = [];
      connections.forEach((connection, iConnection) => {
        cc = cc.concat(store.getters.getRecursiveConnectionsByCardId(allConnections,connection.members[+forward],forward));
      })
      connections = connections.concat(cc);
      */

      return connectionsRightDirection
    },

    getClosestArraySiblings: state => (array, item) => {
      if (!array) {
        return []
      }

      let siblings = [undefined, undefined]
      let i = array.indexOf(item)
      if (i > 0) {
        siblings[0] = array[i - 1]
      }
      if (i < array.length - 1) {
        siblings[1] = array[i + 1]
      }
      return siblings
    },

    getTreeById: state => (id) => {
    },

    // API

    getWalls: state => () => {
      return state.walls
    }

  }
})
